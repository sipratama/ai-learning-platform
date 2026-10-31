//go:build devfixture

package devfixture

import (
	"encoding/json"
	"testing"
)

func TestNonFreeLessonNeverProjects(t *testing.T) {
	data := manifestForTest(t)
	data.Courses[1].Modules[0].Lessons = append(data.Courses[1].Modules[0].Lessons, lessonRecord{
		ID: "lesson-nonfree-probe", Title: "Restricted test Lesson", Position: 2, Free: false,
		Blocks: []blockRecord{{ID: "block-nonfree-probe", Type: "callout", Position: 1, Payload: json.RawMessage(`{"text":"Nonfree test content"}`)}},
	})
	raw, err := json.Marshal(data)
	if err != nil {
		t.Fatal(err)
	}
	snapshot, err := parse(raw)
	if err != nil {
		t.Fatal(err)
	}
	if _, ok := snapshot.PublicLesson("course-focus", "lesson-nonfree-probe"); ok {
		t.Fatal("nonfree Lesson projected publicly")
	}
	course, ok := snapshot.PublicCourse("course-focus")
	if !ok || course.FreeLessonCount != 1 || len(course.Modules[0].Lessons) != 1 {
		t.Fatal("nonfree Lesson affected public curriculum or free count")
	}
}
