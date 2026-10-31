package publiclearning

import (
	"errors"
	"net/url"
	"strings"
	"testing"
)

type memoryPublicRepo struct{ version string }

func (r memoryPublicRepo) SnapshotID() string { return r.version }
func (r memoryPublicRepo) PublicPaths() []PathSummary {
	return []PathSummary{{ID: "b", VersionID: r.version, Title: "Same", Summary: "Public", CourseCount: 0}, {ID: "a", VersionID: r.version, Title: "same", Summary: "Public", CourseCount: 0}}
}
func (r memoryPublicRepo) PublicCourses() []CourseSummary           { return []CourseSummary{} }
func (r memoryPublicRepo) PublicPath(string) (PathDetail, bool)     { return PathDetail{}, false }
func (r memoryPublicRepo) PublicCourse(string) (CourseDetail, bool) { return CourseDetail{}, false }
func (r memoryPublicRepo) PublicLesson(string, string) (LessonDetail, bool) {
	return LessonDetail{}, false
}
func (r memoryPublicRepo) PublicAsset(string) ([]byte, string, bool) { return nil, "", false }

func TestCursorAuthenticationAndBindings(t *testing.T) {
	s, err := New(memoryPublicRepo{"snapshot-one"})
	if err != nil {
		t.Fatal(err)
	}
	q := query{Q: "Same", Limit: 1}
	token, err := s.encode(newCursor("catalog/paths", q, "snapshot-one", "same", "a"))
	if err != nil {
		t.Fatal(err)
	}
	c, err := s.decode(token)
	if err != nil || !c.bound("catalog/paths", q, "snapshot-one") {
		t.Fatal("issued cursor rejected")
	}
	if c.bound("catalog/courses", q, "snapshot-one") || c.bound("catalog/paths", q, "snapshot-two") || c.bound("catalog/paths", query{Q: "Same", Member: "other", Limit: 1}, "snapshot-one") {
		t.Fatal("cursor binding bypassed")
	}
	// Authentic old-snapshot cursor, same signing key: independently exercise snapshot binding.
	s.repo = memoryPublicRepo{"snapshot-two"}
	if _, err := s.Read("catalog/paths", nil, url.Values{"limit": {"1"}, "q": {"Same"}, "cursor": {token}}); !errors.Is(err, ErrInvalid) {
		t.Fatal("old snapshot cursor accepted")
	}
	parts := strings.Split(token, ".")
	parts[0] = "e30" // {} with an unchanged signature.
	if _, err := s.decode(strings.Join(parts, ".")); err == nil {
		t.Fatal("tampered payload accepted")
	}
	for _, bad := range []string{"", token + "=", token + ".x", "***.***"} {
		if _, err := s.decode(bad); err == nil {
			t.Fatal("malformed cursor accepted")
		}
	}
}
func TestStableTitleIDOrderingAndNormalizedQuery(t *testing.T) {
	s, err := New(memoryPublicRepo{"snapshot-one"})
	if err != nil {
		t.Fatal(err)
	}
	first, err := s.Read("catalog/paths", nil, url.Values{"limit": {"1"}, "q": {" SAME "}})
	if err != nil {
		t.Fatal(err)
	}
	if first.Data.([]PathSummary)[0].ID != "a" {
		t.Fatal("title ties are not ordered by canonical ID")
	}
	next, err := s.Read("catalog/paths", nil, url.Values{"limit": {"1"}, "q": {"same"}, "cursor": {*first.Page.NextCursor}})
	if err != nil || next.Data.([]PathSummary)[0].ID != "b" {
		t.Fatal("normalized query or title/ID order changed")
	}
}
