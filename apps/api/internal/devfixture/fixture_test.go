//go:build devfixture

package devfixture

import (
	"bytes"
	"encoding/json"
	"strings"
	"sync"
	"testing"
)

func manifestForTest(t *testing.T) manifest {
	t.Helper()
	raw, err := files.ReadFile("manifest.json")
	if err != nil {
		t.Fatal(err)
	}
	var value manifest
	if err := decodeStrict(raw, &value); err != nil {
		t.Fatal(err)
	}
	return value
}

func parseModified(t *testing.T, modify func(*manifest)) error {
	t.Helper()
	value := manifestForTest(t)
	modify(&value)
	raw, err := json.Marshal(value)
	if err != nil {
		t.Fatal(err)
	}
	_, err = parse(raw)
	return err
}

func TestManifestLoadsWithExactIdentityAndPublicHierarchy(t *testing.T) {
	snapshot, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	if info := snapshot.Info(); info.Identity != Identity || info.Version != Version || info.SnapshotID != SnapshotID {
		t.Fatalf("wrong fixture identity: %#v", info)
	}
	paths := snapshot.PublicPaths()
	courses := snapshot.PublicCourses()
	if len(paths) != 2 || len(courses) != 2 || paths[0].ID != "path-foundations" || paths[1].ID != "path-practice" {
		t.Fatalf("wrong public projection: %#v, %#v", paths, courses)
	}
	first, ok := snapshot.PublicPath("path-foundations")
	if !ok || len(first.Courses) != 1 || first.Courses[0].ID != "course-flagship" {
		t.Fatalf("wrong first Path: %#v", first)
	}
	second, ok := snapshot.PublicPath("path-practice")
	if !ok || len(second.Courses) != 2 || second.Courses[0].ID != first.Courses[0].ID || second.Courses[1].ID != "course-focus" {
		t.Fatalf("canonical Course reuse missing: %#v", second)
	}
	flagship, ok := snapshot.PublicCourse("course-flagship")
	if !ok || flagship.VersionID != SnapshotID || flagship.FreeLessonCount != 2 || len(flagship.Modules) != 1 || len(flagship.Modules[0].Lessons) != 2 {
		t.Fatalf("wrong flagship hierarchy: %#v", flagship)
	}
	for _, lesson := range flagship.Modules[0].Lessons {
		if !lesson.IsFree {
			t.Fatalf("flagship Lesson is not free: %#v", lesson)
		}
		if _, ok := snapshot.PublicLesson("course-flagship", lesson.ID); !ok {
			t.Fatalf("free Lesson missing: %s", lesson.ID)
		}
	}
	if _, ok := snapshot.PublicLesson("course-flagship", "lesson-focus-1"); ok {
		t.Fatal("cross-Course Lesson mismatch was accepted")
	}
	if _, ok := snapshot.PublicLesson("course-focus", "lesson-focus-1"); !ok {
		t.Fatal("focused Lesson missing")
	}
}

func TestHiddenDraftAndAnswerKeysNeverProject(t *testing.T) {
	snapshot, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	for _, id := range []string{"path-hidden", "missing"} {
		if _, ok := snapshot.PublicPath(id); ok {
			t.Fatalf("hidden Path %q was selected", id)
		}
	}
	for _, id := range []string{"course-hidden", "missing"} {
		if _, ok := snapshot.PublicCourse(id); ok {
			t.Fatalf("hidden Course %q was selected", id)
		}
	}
	if _, ok := snapshot.PublicLesson("course-flagship", "lesson-draft"); ok {
		t.Fatal("draft Lesson was selected")
	}
	var public bytes.Buffer
	encoder := json.NewEncoder(&public)
	for _, item := range []any{snapshot.Info(), snapshot.PublicPaths(), snapshot.PublicCourses()} {
		if err := encoder.Encode(item); err != nil {
			t.Fatal(err)
		}
	}
	for _, id := range []string{"path-foundations", "path-practice"} {
		item, _ := snapshot.PublicPath(id)
		if err := encoder.Encode(item); err != nil {
			t.Fatal(err)
		}
	}
	for _, id := range []string{"course-flagship", "course-focus"} {
		item, _ := snapshot.PublicCourse(id)
		if err := encoder.Encode(item); err != nil {
			t.Fatal(err)
		}
	}
	for _, pair := range [][2]string{{"course-flagship", "lesson-flagship-1"}, {"course-flagship", "lesson-flagship-2"}, {"course-focus", "lesson-focus-1"}} {
		item, _ := snapshot.PublicLesson(pair[0], pair[1])
		if err := encoder.Encode(item); err != nil {
			t.Fatal(err)
		}
	}
	for _, marker := range []string{"path-hidden", "course-hidden", "lesson-draft", "draft-v2", "assessment-hidden", "synthetic-private-answer-marker", "answerKey", "author"} {
		if strings.Contains(public.String(), marker) {
			t.Fatalf("private marker %q appeared in public projection", marker)
		}
	}
}

func TestSnapshotsAreFreshAndConsumerMutationsDoNotPersist(t *testing.T) {
	first, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	second, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	if first == second {
		t.Fatal("loader reused a Snapshot")
	}
	before, _ := json.Marshal(first.PublicCourses())
	after, _ := json.Marshal(second.PublicCourses())
	if !bytes.Equal(before, after) {
		t.Fatal("fixture result changed between loads")
	}
	paths := first.PublicPaths()
	paths[0].Title = "tampered"
	path, _ := first.PublicPath("path-foundations")
	path.Courses[0].Title = "tampered"
	course, _ := first.PublicCourse("course-flagship")
	course.Modules[0].Lessons[0].Title = "tampered"
	lesson, _ := first.PublicLesson("course-flagship", "lesson-flagship-1")
	lesson.Blocks[0].Payload = richTextPayload{Markdown: "tampered"}
	if first.PublicPaths()[0].Title == "tampered" || second.PublicPaths()[0].Title == "tampered" {
		t.Fatal("returned Path aliases internal data")
	}
	pathAgain, _ := first.PublicPath("path-foundations")
	courseAgain, _ := first.PublicCourse("course-flagship")
	lessonAgain, _ := first.PublicLesson("course-flagship", "lesson-flagship-1")
	if pathAgain.Courses[0].Title == "tampered" || courseAgain.Modules[0].Lessons[0].Title == "tampered" || lessonAgain.Blocks[0].Payload.(richTextPayload).Markdown == "tampered" {
		t.Fatal("returned nested projection aliases internal data")
	}
}

func TestConcurrentIndependentSnapshots(t *testing.T) {
	var workers sync.WaitGroup
	for i := 0; i < 16; i++ {
		workers.Add(1)
		go func() {
			defer workers.Done()
			snapshot, err := Load()
			if err != nil {
				t.Error(err)
				return
			}
			paths := snapshot.PublicPaths()
			lesson, ok := snapshot.PublicLesson("course-flagship", "lesson-flagship-1")
			if len(paths) != 2 || !ok || len(lesson.Blocks) != 4 {
				t.Errorf("inconsistent concurrent fixture projection: paths=%d, lesson=%t, blocks=%d", len(paths), ok, len(lesson.Blocks))
			}
		}()
	}
	workers.Wait()
}

func TestManifestRejectsInvalidIdentityRelationshipsAndContent(t *testing.T) {
	for _, tc := range []struct {
		name   string
		modify func(*manifest)
	}{
		{"identity", func(m *manifest) { m.Identity = "other" }},
		{"version", func(m *manifest) { m.Version = "2.0.0" }},
		{"snapshot", func(m *manifest) { m.SnapshotID = "wrong" }},
		{"draft ID", func(m *manifest) { m.DraftID = "wrong" }},
		{"duplicate Course", func(m *manifest) { m.Courses = append(m.Courses, m.Courses[0]) }},
		{"duplicate Path", func(m *manifest) { m.Paths = append(m.Paths, m.Paths[0]) }},
		{"duplicate Block", func(m *manifest) { m.Courses[0].Modules[0].Lessons[0].Blocks[1].ID = "block-rich-1" }},
		{"missing Course ref", func(m *manifest) { m.Paths[0].CourseIDs[0] = "course-missing" }},
		{"hidden Course ref", func(m *manifest) { m.Paths[0].CourseIDs[0] = "course-hidden" }},
		{"duplicate membership", func(m *manifest) { m.Paths[0].CourseIDs = append(m.Paths[0].CourseIDs, "course-flagship") }},
		{"draft discoverable", func(m *manifest) { m.Courses[3].Discoverable = true }},
		{"published wrong version", func(m *manifest) { m.Courses[0].VersionID = DraftID }},
		{"Module order", func(m *manifest) { m.Courses[0].Modules[0].Position = 2 }},
		{"Lesson order", func(m *manifest) { m.Courses[0].Modules[0].Lessons[0].Position = 2 }},
		{"flagship locked", func(m *manifest) { m.Courses[0].Modules[0].Lessons[0].Free = false }},
		{"required flagship Lesson", func(m *manifest) { m.Courses[0].Modules[0].Lessons[1].ID = "lesson-other" }},
		{"required focus Lesson free", func(m *manifest) { m.Courses[1].Modules[0].Lessons[0].Free = false }},
		{"required public Block type", func(m *manifest) {
			m.Courses[0].Modules[0].Lessons[1].Blocks[0].Type = "richText"
			m.Courses[0].Modules[0].Lessons[1].Blocks[0].Payload = json.RawMessage(`{"markdown":"safe"}`)
		}},
		{"empty required field", func(m *manifest) { m.Courses[0].Title = " " }},
		{"unsupported Block", func(m *manifest) { m.Courses[0].Modules[0].Lessons[0].Blocks[0].Type = "executable" }},
		{"unsafe public Markdown", func(m *manifest) {
			m.Courses[0].Modules[0].Lessons[0].Blocks[0].Payload = json.RawMessage(`{"markdown":"<script>alert(1)</script>"}`)
		}},
		{"unsafe public media", func(m *manifest) {
			m.Courses[0].Modules[0].Lessons[0].Blocks[3].Payload = json.RawMessage(`{"src":"javascript:alert(1)","alt":"unsafe"}`)
		}},
		{"media traversal", func(m *manifest) {
			m.Courses[0].Modules[0].Lessons[0].Blocks[3].Payload = json.RawMessage(`{"src":"/assets/fixture/../private","alt":"unsafe"}`)
		}},
		{"protocol relative media", func(m *manifest) {
			m.Courses[0].Modules[0].Lessons[0].Blocks[3].Payload = json.RawMessage(`{"src":"//private.example/asset.svg","alt":"unsafe"}`)
		}},
		{"missing public asset", func(m *manifest) {
			m.Courses[0].Modules[0].Lessons[0].Blocks[3].Payload = json.RawMessage(`{"src":"/assets/fixture/missing.svg","alt":"missing"}`)
		}},
		{"payload unknown field", func(m *manifest) {
			m.Courses[0].Modules[0].Lessons[0].Blocks[0].Payload = json.RawMessage(`{"markdown":"safe","answerKey":"leak"}`)
		}},
		{"answer key missing", func(m *manifest) { m.AnswerKeys = nil }},
	} {
		t.Run(tc.name, func(t *testing.T) {
			if err := parseModified(t, tc.modify); err == nil {
				t.Fatal("invalid manifest was accepted")
			}
		})
	}
}

func TestManifestRejectsUnknownFieldsAndTrailingJSON(t *testing.T) {
	raw, err := files.ReadFile("manifest.json")
	if err != nil {
		t.Fatal(err)
	}
	for _, candidate := range [][]byte{
		append(bytes.TrimSuffix(raw, []byte("\n")), []byte(" {}")...),
		[]byte(`{"identity":"vs01a-guest-proof@1.0.0","unknown":"value"}`),
	} {
		if _, err := parse(candidate); err == nil {
			t.Fatal("malformed JSON was accepted")
		}
	}
}
