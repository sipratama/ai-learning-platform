package publiclearning

type PathSummary struct {
	ID          string `json:"id"`
	VersionID   string `json:"versionId"`
	Title       string `json:"title"`
	Summary     string `json:"summary"`
	CourseCount int    `json:"courseCount"`
}

type CourseSummary struct {
	ID              string `json:"id"`
	VersionID       string `json:"versionId"`
	Title           string `json:"title"`
	Summary         string `json:"summary"`
	FreeLessonCount int    `json:"freeLessonCount"`
}

type PathDetail struct {
	PathSummary
	Description string          `json:"description"`
	Courses     []CourseSummary `json:"courses"`
}

type LessonSummary struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Position int    `json:"position"`
	IsFree   bool   `json:"isFree"`
}

type ModuleSummary struct {
	ID       string          `json:"id"`
	Title    string          `json:"title"`
	Position int             `json:"position"`
	Lessons  []LessonSummary `json:"lessons"`
}

type CourseDetail struct {
	CourseSummary
	Description string          `json:"description"`
	Modules     []ModuleSummary `json:"modules"`
}

type PublicBlock struct {
	ID       string `json:"id"`
	Type     string `json:"type"`
	Position int    `json:"position"`
	Payload  any    `json:"payload"`
}

type LessonDetail struct {
	ID              string        `json:"id"`
	CourseID        string        `json:"courseId"`
	CourseVersionID string        `json:"courseVersionId"`
	ModuleID        string        `json:"moduleId"`
	Title           string        `json:"title"`
	Position        int           `json:"position"`
	IsFree          bool          `json:"isFree"`
	Blocks          []PublicBlock `json:"blocks"`
}

// Repository exposes only immutable public projections. It contains no private authoring state.
type Repository interface {
	SnapshotID() string
	PublicPaths() []PathSummary
	PublicCourses() []CourseSummary
	PublicPath(string) (PathDetail, bool)
	PublicCourse(string) (CourseDetail, bool)
	PublicLesson(string, string) (LessonDetail, bool)
	PublicAsset(string) ([]byte, string, bool)
}
