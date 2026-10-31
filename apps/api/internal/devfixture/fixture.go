//go:build devfixture

package devfixture

import (
	"bytes"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"regexp"
	"sort"
	"strings"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/publiclearning"
)

const (
	Identity   = "vs01a-guest-proof@1.0.0"
	Version    = "1.0.0"
	SnapshotID = "pub-v1"
	DraftID    = "draft-v2"
)

//go:embed manifest.json assets/diagram.svg
var files embed.FS

var validID = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9._~-]{0,127}$`)

type manifest struct {
	Identity   string         `json:"identity"`
	Version    string         `json:"version"`
	SnapshotID string         `json:"snapshotId"`
	DraftID    string         `json:"draftId"`
	Paths      []pathRecord   `json:"paths"`
	Courses    []courseRecord `json:"courses"`
	AnswerKeys []answerKey    `json:"answerKeys"`
}

type pathRecord struct {
	ID           string   `json:"id"`
	VersionID    string   `json:"versionId"`
	State        string   `json:"state"`
	Discoverable bool     `json:"discoverable"`
	Title        string   `json:"title"`
	Summary      string   `json:"summary"`
	Description  string   `json:"description"`
	CourseIDs    []string `json:"courseIds"`
}

type courseRecord struct {
	ID           string         `json:"id"`
	VersionID    string         `json:"versionId"`
	State        string         `json:"state"`
	Discoverable bool           `json:"discoverable"`
	Flagship     bool           `json:"flagship"`
	Title        string         `json:"title"`
	Summary      string         `json:"summary"`
	Description  string         `json:"description"`
	Modules      []moduleRecord `json:"modules"`
}

type moduleRecord struct {
	ID       string         `json:"id"`
	Title    string         `json:"title"`
	Position int            `json:"position"`
	Lessons  []lessonRecord `json:"lessons"`
}

type lessonRecord struct {
	ID       string        `json:"id"`
	Title    string        `json:"title"`
	Position int           `json:"position"`
	Free     bool          `json:"free"`
	Blocks   []blockRecord `json:"blocks"`
}

type blockRecord struct {
	ID          string          `json:"id"`
	Type        string          `json:"type"`
	Position    int             `json:"position"`
	Payload     json.RawMessage `json:"payload"`
	safePayload any
}

type answerKey struct {
	AssessmentID string `json:"assessmentId"`
	Key          string `json:"key"`
}

type Snapshot struct {
	data manifest
}

type VersionInfo struct {
	Identity   string `json:"identity"`
	Version    string `json:"version"`
	SnapshotID string `json:"snapshotId"`
}

type PathSummary = publiclearning.PathSummary
type CourseSummary = publiclearning.CourseSummary
type PathDetail = publiclearning.PathDetail
type LessonSummary = publiclearning.LessonSummary
type ModuleSummary = publiclearning.ModuleSummary
type CourseDetail = publiclearning.CourseDetail
type PublicBlock = publiclearning.PublicBlock
type LessonDetail = publiclearning.LessonDetail

type richTextPayload struct {
	Markdown string `json:"markdown"`
}
type codePayload struct {
	Language string `json:"language"`
	Text     string `json:"text"`
}
type calloutPayload struct {
	Text string `json:"text"`
}
type flashcardPayload struct {
	Front string `json:"front"`
	Back  string `json:"back"`
}
type mediaPayload struct {
	Src string `json:"src"`
	Alt string `json:"alt"`
}

// Load constructs a fresh, isolated snapshot on every call. No mutable global fixture exists.
func Load() (*Snapshot, error) {
	raw, err := files.ReadFile("manifest.json")
	if err != nil {
		return nil, errors.New("fixture manifest unavailable")
	}
	return parse(raw)
}

func parse(raw []byte) (*Snapshot, error) {
	var data manifest
	if err := decodeStrict(raw, &data); err != nil {
		return nil, fmt.Errorf("invalid fixture JSON: %w", err)
	}
	if err := validate(&data); err != nil {
		return nil, err
	}
	return &Snapshot{data: data}, nil
}

func decodeStrict(raw []byte, target any) error {
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(target); err != nil {
		return err
	}
	if err := decoder.Decode(new(any)); err != io.EOF {
		return errors.New("trailing JSON data")
	}
	return nil
}

func requiredID(id string) bool      { return validID.MatchString(id) && id != "." && id != ".." }
func requiredText(value string) bool { return strings.TrimSpace(value) != "" }

func validate(data *manifest) error {
	if data.Identity != Identity || data.Version != Version || data.SnapshotID != SnapshotID || data.DraftID != DraftID {
		return errors.New("fixture identity or version mismatch")
	}
	if len(data.Paths) < 2 || len(data.Courses) < 2 || len(data.AnswerKeys) == 0 {
		return errors.New("fixture records missing")
	}
	paths := make(map[string]bool)
	allCourses := make(map[string]bool)
	publicCourses := make(map[string]*courseRecord)
	canonicalCourses := make(map[string]bool)
	contentIDs := make(map[string]bool)
	publicCourseCount, flagshipCount := 0, 0
	hiddenCourse, draftFlagship, draftLesson, adversarialCode, unsafeDraftMarkdown, unsafeDraftMedia := false, false, false, false, false, false
	publicBlockTypes := make(map[string]bool)
	flagshipLessons := make(map[string]bool)
	focusLesson := false
	for i := range data.Courses {
		course := &data.Courses[i]
		if !requiredID(course.ID) || !requiredText(course.Title) || !requiredText(course.Summary) || !requiredText(course.Description) || !validState(course.State, course.VersionID, course.Discoverable) {
			return errors.New("invalid Course identity, fields or state")
		}
		key := course.ID + "@" + course.VersionID
		if allCourses[key] {
			return errors.New("duplicate Course version")
		}
		allCourses[key] = true
		canonicalCourses[course.ID] = true
		if course.ID == "course-hidden" && course.State == "published" && !course.Discoverable {
			hiddenCourse = true
		}
		if course.ID == "course-flagship" && course.State == "draft" {
			draftFlagship = true
		}
		if course.State == "published" && course.Discoverable {
			if publicCourses[course.ID] != nil {
				return errors.New("multiple public Course versions")
			}
			publicCourses[course.ID] = course
			publicCourseCount++
			if len(course.Modules) == 0 {
				return errors.New("public Course has no Module")
			}
		}
		if course.Flagship {
			if course.ID != "course-flagship" || course.State != "published" || !course.Discoverable {
				return errors.New("invalid flagship identity")
			}
			flagshipCount++
		}
		for mi := range course.Modules {
			module := &course.Modules[mi]
			if !uniqueContentID(contentIDs, module.ID) || !requiredText(module.Title) || module.Position != mi+1 || len(module.Lessons) == 0 {
				return errors.New("invalid Module identity or order")
			}
			for li := range module.Lessons {
				lesson := &module.Lessons[li]
				if !uniqueContentID(contentIDs, lesson.ID) || !requiredText(lesson.Title) || lesson.Position != li+1 || len(lesson.Blocks) == 0 {
					return errors.New("invalid Lesson identity or order")
				}
				if course.Flagship && !lesson.Free {
					return errors.New("flagship Lesson is not free")
				}
				if course.Flagship {
					flagshipLessons[lesson.ID] = true
				}
				if course.ID == "course-focus" && course.State == "published" && course.Discoverable && lesson.ID == "lesson-focus-1" && lesson.Free {
					focusLesson = true
				}
				if course.ID == "course-flagship" && course.State == "draft" && lesson.ID == "lesson-draft" {
					draftLesson = true
				}
				for bi := range lesson.Blocks {
					block := &lesson.Blocks[bi]
					if !uniqueContentID(contentIDs, block.ID) || block.Position != bi+1 {
						return errors.New("invalid Block identity or order")
					}
					payload, err := validatePayload(block.Type, block.Payload, course.State == "published" && course.Discoverable)
					if err != nil {
						return fmt.Errorf("invalid Block payload: %w", err)
					}
					block.safePayload = payload
					if course.State == "draft" && lesson.ID == "lesson-draft" {
						if value, ok := payload.(richTextPayload); ok && strings.Contains(value.Markdown, "<script>") {
							unsafeDraftMarkdown = true
						}
						if value, ok := payload.(mediaPayload); ok && !safeMediaPath(value.Src) {
							unsafeDraftMedia = true
						}
					}
					if course.State == "published" && course.Discoverable {
						publicBlockTypes[block.Type] = true
						if value, ok := payload.(codePayload); ok && strings.Contains(value.Text, "<script>") {
							adversarialCode = true
						}
					}
				}
			}
		}
	}
	if publicCourseCount < 2 || flagshipCount != 1 || publicCourses["course-flagship"] == nil || publicCourses["course-focus"] == nil || !flagshipLessons["lesson-flagship-1"] || !flagshipLessons["lesson-flagship-2"] || !focusLesson || !hiddenCourse || !draftFlagship || !draftLesson || !adversarialCode || !unsafeDraftMarkdown || !unsafeDraftMedia {
		return errors.New("required public Courses missing")
	}
	for _, kind := range []string{"richText", "code", "callout", "flashcard", "media"} {
		if !publicBlockTypes[kind] {
			return errors.New("required public Block type missing")
		}
	}
	for id := range canonicalCourses {
		if contentIDs[id] {
			return errors.New("Course identity collides with content identity")
		}
	}
	publicPathCount, sharedFlagship := 0, 0
	visibleRequiredPaths := make(map[string]bool)
	hiddenPath := false
	for _, path := range data.Paths {
		if !requiredID(path.ID) || !requiredText(path.Title) || !requiredText(path.Summary) || !requiredText(path.Description) || !validState(path.State, path.VersionID, path.Discoverable) || len(path.CourseIDs) == 0 {
			return errors.New("invalid Path identity, fields or state")
		}
		key := path.ID + "@" + path.VersionID
		if paths[key] {
			return errors.New("duplicate Path version")
		}
		paths[key] = true
		if canonicalCourses[path.ID] || contentIDs[path.ID] {
			return errors.New("Path identity collides with another resource")
		}
		if path.ID == "path-hidden" && path.State == "published" && !path.Discoverable {
			hiddenPath = true
		}
		seen := make(map[string]bool)
		for _, courseID := range path.CourseIDs {
			if !requiredID(courseID) || seen[courseID] {
				return errors.New("invalid or duplicate Path membership")
			}
			seen[courseID] = true
			if path.State == "published" {
				if publicCourses[courseID] == nil {
					return errors.New("published Path references unavailable Course")
				}
			} else if !allCourses[courseID+"@"+DraftID] && !allCourses[courseID+"@"+SnapshotID] {
				return errors.New("draft Path references missing Course")
			}
		}
		if path.State == "published" && path.Discoverable {
			publicPathCount++
			visibleRequiredPaths[path.ID] = true
			if seen["course-flagship"] {
				sharedFlagship++
			}
			if path.ID == "path-practice" && !seen["course-focus"] {
				return errors.New("practice Path lacks focused Course")
			}
		}
	}
	if publicPathCount < 2 || sharedFlagship < 2 || !visibleRequiredPaths["path-foundations"] || !visibleRequiredPaths["path-practice"] || !hiddenPath {
		return errors.New("required public Paths or reuse missing")
	}
	answers := make(map[string]bool)
	for _, answer := range data.AnswerKeys {
		if !requiredID(answer.AssessmentID) || !requiredText(answer.Key) || answers[answer.AssessmentID] {
			return errors.New("invalid private answer key record")
		}
		answers[answer.AssessmentID] = true
	}
	if !answers["assessment-hidden"] {
		return errors.New("private answer-key case missing")
	}
	return nil
}

func uniqueContentID(seen map[string]bool, id string) bool {
	if !requiredID(id) || seen[id] {
		return false
	}
	seen[id] = true
	return true
}

func validState(state, version string, discoverable bool) bool {
	if state == "published" {
		return version == SnapshotID
	}
	return state == "draft" && version == DraftID && !discoverable
}

func validatePayload(kind string, raw json.RawMessage, public bool) (any, error) {
	if len(raw) == 0 || bytes.Equal(raw, []byte("null")) {
		return nil, errors.New("missing payload")
	}
	switch kind {
	case "richText":
		var value richTextPayload
		if err := decodeStrict(raw, &value); err != nil || !requiredText(value.Markdown) {
			return nil, errors.New("invalid rich text")
		}
		if public && (strings.ContainsAny(value.Markdown, "<>") || strings.Contains(value.Markdown, "](") || containsUnsafeScheme(value.Markdown)) {
			return nil, errors.New("unsafe public Markdown")
		}
		return value, nil
	case "code":
		var value codePayload
		if err := decodeStrict(raw, &value); err != nil || !requiredText(value.Language) || !requiredText(value.Text) {
			return nil, errors.New("invalid code")
		}
		return value, nil
	case "callout":
		var value calloutPayload
		if err := decodeStrict(raw, &value); err != nil || !requiredText(value.Text) {
			return nil, errors.New("invalid callout")
		}
		return value, nil
	case "flashcard":
		var value flashcardPayload
		if err := decodeStrict(raw, &value); err != nil || !requiredText(value.Front) || !requiredText(value.Back) {
			return nil, errors.New("invalid flashcard")
		}
		return value, nil
	case "media":
		var value mediaPayload
		if err := decodeStrict(raw, &value); err != nil || !requiredText(value.Src) || !requiredText(value.Alt) {
			return nil, errors.New("invalid media")
		}
		if public && !safeMediaPath(value.Src) {
			return nil, errors.New("unsafe public media")
		}
		return value, nil
	default:
		return nil, errors.New("unsupported Block type")
	}
}

func containsUnsafeScheme(value string) bool {
	lower := strings.ToLower(value)
	return strings.Contains(lower, "javascript:") || strings.Contains(lower, "data:") || strings.Contains(lower, "vbscript:")
}

func safeMediaPath(value string) bool {
	if !strings.HasPrefix(value, "/assets/fixture/") || strings.Contains(value, "//") || strings.Contains(value, "..") || strings.ContainsAny(value, "\\?#%") {
		return false
	}
	for _, part := range strings.Split(strings.TrimPrefix(value, "/assets/fixture/"), "/") {
		if part == "" || !requiredID(part) {
			return false
		}
	}
	assetPath := "assets/" + strings.TrimPrefix(value, "/assets/fixture/")
	if _, err := files.ReadFile(assetPath); err != nil {
		return false
	}
	return true
}

func (s *Snapshot) Info() VersionInfo {
	return VersionInfo{Identity: s.data.Identity, Version: s.data.Version, SnapshotID: s.data.SnapshotID}
}

func (s *Snapshot) publicCourse(id string) *courseRecord {
	for i := range s.data.Courses {
		course := &s.data.Courses[i]
		if course.ID == id && course.State == "published" && course.Discoverable {
			return course
		}
	}
	return nil
}

func (s *Snapshot) courseSummary(course *courseRecord) CourseSummary {
	count := 0
	for _, module := range course.Modules {
		for _, lesson := range module.Lessons {
			if lesson.Free {
				count++
			}
		}
	}
	return CourseSummary{ID: course.ID, VersionID: course.VersionID, Title: course.Title, Summary: course.Summary, FreeLessonCount: count}
}

func (s *Snapshot) pathSummary(path *pathRecord) PathSummary {
	count := 0
	for _, id := range path.CourseIDs {
		if s.publicCourse(id) != nil {
			count++
		}
	}
	return PathSummary{ID: path.ID, VersionID: path.VersionID, Title: path.Title, Summary: path.Summary, CourseCount: count}
}

// PublicPaths returns a fresh, visibility-filtered projection without search or pagination.
func (s *Snapshot) PublicPaths() []PathSummary {
	result := make([]PathSummary, 0)
	for i := range s.data.Paths {
		path := &s.data.Paths[i]
		if path.State == "published" && path.Discoverable {
			result = append(result, s.pathSummary(path))
		}
	}
	sort.Slice(result, func(i, j int) bool {
		a, b := strings.ToLower(result[i].Title), strings.ToLower(result[j].Title)
		if a == b {
			return result[i].ID < result[j].ID
		}
		return a < b
	})
	return result
}

// PublicCourses returns a fresh, visibility-filtered projection without search or pagination.
func (s *Snapshot) PublicCourses() []CourseSummary {
	result := make([]CourseSummary, 0)
	for i := range s.data.Courses {
		course := &s.data.Courses[i]
		if course.State == "published" && course.Discoverable {
			result = append(result, s.courseSummary(course))
		}
	}
	sort.Slice(result, func(i, j int) bool {
		a, b := strings.ToLower(result[i].Title), strings.ToLower(result[j].Title)
		if a == b {
			return result[i].ID < result[j].ID
		}
		return a < b
	})
	return result
}

func (s *Snapshot) PublicPath(id string) (PathDetail, bool) {
	for i := range s.data.Paths {
		path := &s.data.Paths[i]
		if path.ID != id || path.State != "published" || !path.Discoverable {
			continue
		}
		result := PathDetail{PathSummary: s.pathSummary(path), Description: path.Description, Courses: make([]CourseSummary, 0, len(path.CourseIDs))}
		for _, courseID := range path.CourseIDs {
			if course := s.publicCourse(courseID); course != nil {
				result.Courses = append(result.Courses, s.courseSummary(course))
			}
		}
		return result, true
	}
	return PathDetail{}, false
}

func (s *Snapshot) PublicCourse(id string) (CourseDetail, bool) {
	course := s.publicCourse(id)
	if course == nil {
		return CourseDetail{}, false
	}
	result := CourseDetail{CourseSummary: s.courseSummary(course), Description: course.Description, Modules: make([]ModuleSummary, 0, len(course.Modules))}
	for _, module := range course.Modules {
		projected := ModuleSummary{ID: module.ID, Title: module.Title, Position: module.Position, Lessons: make([]LessonSummary, 0, len(module.Lessons))}
		for _, lesson := range module.Lessons {
			if lesson.Free {
				projected.Lessons = append(projected.Lessons, LessonSummary{ID: lesson.ID, Title: lesson.Title, Position: lesson.Position, IsFree: true})
			}
		}
		result.Modules = append(result.Modules, projected)
	}
	return result, true
}

func (s *Snapshot) PublicLesson(courseID, lessonID string) (LessonDetail, bool) {
	course := s.publicCourse(courseID)
	if course == nil {
		return LessonDetail{}, false
	}
	for _, module := range course.Modules {
		for _, lesson := range module.Lessons {
			if lesson.ID != lessonID || !lesson.Free {
				continue
			}
			result := LessonDetail{ID: lesson.ID, CourseID: course.ID, CourseVersionID: course.VersionID, ModuleID: module.ID, Title: lesson.Title, Position: lesson.Position, IsFree: true, Blocks: make([]PublicBlock, 0, len(lesson.Blocks))}
			for _, block := range lesson.Blocks {
				result.Blocks = append(result.Blocks, PublicBlock{ID: block.ID, Type: block.Type, Position: block.Position, Payload: block.safePayload})
			}
			return result, true
		}
	}
	return LessonDetail{}, false
}
