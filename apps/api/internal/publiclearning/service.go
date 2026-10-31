package publiclearning

import (
	"errors"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"unicode"
	"unicode/utf8"
)

var (
	ErrInvalid     = errors.New("invalid public read")
	ErrNotFound    = errors.New("public resource not found")
	ErrUnavailable = errors.New("public repository unavailable")
)

type Page struct {
	NextCursor *string `json:"nextCursor"`
}
type Meta struct {
	RequestID  string         `json:"requestId"`
	SnapshotID string         `json:"snapshotId"`
	Filters    map[string]any `json:"filters,omitempty"`
	Sort       string         `json:"sort,omitempty"`
}
type Response struct {
	Data any   `json:"data"`
	Page *Page `json:"page,omitempty"`
	Meta Meta  `json:"meta"`
}
type query struct {
	Q, Member, Cursor string
	Limit             int
}

func ValidID(id string) bool {
	if len(id) < 1 || len(id) > 128 || !asciiAlphaNumeric(id[0]) {
		return false
	}
	for i := range len(id) {
		c := id[i]
		if !asciiAlphaNumeric(c) && !strings.ContainsRune("._~-", rune(c)) {
			return false
		}
	}
	return true
}
func asciiAlphaNumeric(c byte) bool {
	return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c >= '0' && c <= '9'
}
func safeText(s string) bool {
	if !utf8.ValidString(s) {
		return false
	}
	for _, c := range s {
		if unicode.IsControl(c) {
			return false
		}
	}
	return true
}
func parseQuery(endpoint string, values url.Values) (query, error) {
	q := query{Limit: 20}
	memberKey := "pathId"
	if endpoint == "catalog/paths" {
		memberKey = "courseId"
	}
	list := strings.HasPrefix(endpoint, "catalog/")
	for key, vs := range values {
		if !list || len(vs) != 1 || !safeText(key) || !safeText(vs[0]) {
			return q, ErrInvalid
		}
		value := vs[0]
		switch key {
		case "q":
			q.Q = strings.TrimSpace(value)
			if n := utf8.RuneCountInString(q.Q); n < 1 || n > 100 {
				return q, ErrInvalid
			}
		case memberKey:
			if !ValidID(value) {
				return q, ErrInvalid
			}
			q.Member = value
		case "limit":
			if value == "" {
				return q, ErrInvalid
			}
			for _, c := range value {
				if c < '0' || c > '9' {
					return q, ErrInvalid
				}
			}
			n, err := strconv.Atoi(value)
			if err != nil || n < 1 || n > 50 {
				return q, ErrInvalid
			}
			q.Limit = n
		case "cursor":
			if len(value) < 1 || len(value) > 1024 {
				return q, ErrInvalid
			}
			q.Cursor = value
		default:
			return q, ErrInvalid
		}
	}
	return q, nil
}

// Read applies catalog behavior to visibility-filtered projections from one snapshot.
func (s *Service) Read(endpoint string, ids []string, values url.Values) (Response, error) {
	for _, id := range ids {
		if !ValidID(id) {
			return Response{}, ErrInvalid
		}
	}
	q, err := parseQuery(endpoint, values)
	if err != nil {
		return Response{}, err
	}
	if s == nil || s.repo == nil {
		return Response{}, ErrUnavailable
	}
	meta := Meta{SnapshotID: s.repo.SnapshotID()}
	switch endpoint {
	case "catalog/paths":
		items := make([]PathSummary, 0)
		for _, item := range s.repo.PublicPaths() {
			if !matches(item.Title, item.Summary, q.Q) {
				continue
			}
			if q.Member != "" {
				path, ok := s.repo.PublicPath(item.ID)
				if !ok {
					continue
				}
				member := false
				for _, course := range path.Courses {
					if course.ID == q.Member {
						member = true
						break
					}
				}
				if !member {
					continue
				}
			}
			items = append(items, item)
		}
		data, page, err := paginate(s, endpoint, q, items, func(p PathSummary) (string, string) { return p.Title, p.ID })
		if err != nil {
			return Response{}, err
		}
		meta.Filters = filters(q, "courseId")
		meta.Sort = "title,id"
		return Response{Data: data, Page: page, Meta: meta}, nil
	case "catalog/courses":
		items := make([]CourseSummary, 0)
		var members map[string]bool
		if q.Member != "" {
			members = map[string]bool{}
			if path, ok := s.repo.PublicPath(q.Member); ok {
				for _, course := range path.Courses {
					members[course.ID] = true
				}
			}
		}
		for _, item := range s.repo.PublicCourses() {
			if matches(item.Title, item.Summary, q.Q) && (members == nil || members[item.ID]) {
				items = append(items, item)
			}
		}
		data, page, err := paginate(s, endpoint, q, items, func(c CourseSummary) (string, string) { return c.Title, c.ID })
		if err != nil {
			return Response{}, err
		}
		meta.Filters = filters(q, "pathId")
		meta.Sort = "title,id"
		return Response{Data: data, Page: page, Meta: meta}, nil
	case "paths":
		if len(ids) == 1 {
			if data, ok := s.repo.PublicPath(ids[0]); ok {
				return Response{Data: data, Meta: meta}, nil
			}
		}
	case "courses":
		if len(ids) == 1 {
			if data, ok := s.repo.PublicCourse(ids[0]); ok {
				return Response{Data: data, Meta: meta}, nil
			}
		}
	case "lessons":
		if len(ids) == 2 {
			if data, ok := s.repo.PublicLesson(ids[0], ids[1]); ok {
				return Response{Data: data, Meta: meta}, nil
			}
		}
	}
	return Response{}, ErrNotFound
}
func matches(title, summary, q string) bool {
	return q == "" || strings.Contains(strings.ToLower(title), strings.ToLower(q)) || strings.Contains(strings.ToLower(summary), strings.ToLower(q))
}
func filters(q query, memberKey string) map[string]any {
	result := map[string]any{"limit": q.Limit}
	if q.Q != "" {
		result["q"] = q.Q
	}
	if q.Member != "" {
		result[memberKey] = q.Member
	}
	return result
}
func paginate[T any](s *Service, endpoint string, q query, items []T, key func(T) (string, string)) ([]T, *Page, error) {
	sort.Slice(items, func(i, j int) bool {
		a, ai := key(items[i])
		b, bi := key(items[j])
		a = strings.ToLower(a)
		b = strings.ToLower(b)
		if a == b {
			return ai < bi
		}
		return a < b
	})
	start := 0
	if q.Cursor != "" {
		cursor, err := s.decode(q.Cursor)
		if err != nil || !cursor.bound(endpoint, q, s.repo.SnapshotID()) {
			return nil, nil, ErrInvalid
		}
		found := false
		for i, item := range items {
			title, id := key(item)
			if strings.ToLower(title) == cursor.LastTitle && id == cursor.LastID {
				start = i + 1
				found = true
				break
			}
		}
		if !found {
			return nil, nil, ErrInvalid
		}
	}
	end := min(start+q.Limit, len(items))
	data := items[start:end]
	page := &Page{}
	if end < len(items) {
		title, id := key(items[end-1])
		token, err := s.encode(newCursor(endpoint, q, s.repo.SnapshotID(), strings.ToLower(title), id))
		if err != nil {
			return nil, nil, err
		}
		page.NextCursor = &token
	}
	return data, page, nil
}
func (s *Service) Asset(path string) ([]byte, string, error) {
	if s == nil || s.repo == nil {
		return nil, "", ErrUnavailable
	}
	if data, kind, ok := s.repo.PublicAsset(path); ok {
		return data, kind, nil
	}
	return nil, "", ErrNotFound
}
