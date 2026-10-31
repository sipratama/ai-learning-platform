//go:build devfixture

package httpserver

import (
	"bytes"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"sync"
	"testing"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/devfixture"
	"github.com/sipratama/ai-learning-platform/apps/api/internal/publiclearning"
)

func fixtureHandler(t *testing.T, logs io.Writer) http.Handler {
	t.Helper()
	repo, err := devfixture.Load()
	if err != nil {
		t.Fatal(err)
	}
	s, err := publiclearning.New(repo)
	if err != nil {
		t.Fatal(err)
	}
	return NewHandlerWithContent(slog.New(slog.NewJSONHandler(logs, nil)), s)
}
func read(t *testing.T, h http.Handler, path string, status int) *httptest.ResponseRecorder {
	t.Helper()
	r := httptest.NewRecorder()
	h.ServeHTTP(r, httptest.NewRequest("GET", path, nil))
	if r.Code != status {
		t.Fatalf("unexpected HTTP status: got %d, want %d", r.Code, status)
	}
	return r
}
func document(t *testing.T, r *httptest.ResponseRecorder) map[string]any {
	t.Helper()
	var body map[string]any
	if json.Unmarshal(r.Body.Bytes(), &body) != nil {
		t.Fatal("invalid JSON response")
	}
	return body
}
func TestAPI001Through005Success(t *testing.T) {
	h := fixtureHandler(t, io.Discard)
	for _, path := range []string{"/api/v1/catalog/paths", "/api/v1/catalog/courses", "/api/v1/paths/path-practice", "/api/v1/courses/course-flagship", "/api/v1/courses/course-flagship/lessons/lesson-flagship-1", "/api/v1/courses/course-flagship/lessons/lesson-flagship-2"} {
		r := read(t, h, path, 200)
		b := document(t, r)
		meta := b["meta"].(map[string]any)
		if meta["snapshotId"] != "pub-v1" || meta["requestId"] != r.Header().Get("X-Request-ID") || r.Header().Get("Cache-Control") != "no-store" {
			t.Fatal("response metadata or headers violated contract")
		}
		if !strings.HasPrefix(r.Header().Get("Content-Type"), "application/json") {
			t.Fatal("missing JSON content type")
		}
	}
}
func TestVS01AN01CatalogVisibilityAndFilters(t *testing.T) {
	h := fixtureHandler(t, io.Discard)
	for _, tc := range []struct {
		path  string
		count int
	}{
		{"/api/v1/catalog/paths", 2}, {"/api/v1/catalog/courses", 2},
		{"/api/v1/catalog/paths?q=FOUNDATIONS", 1}, {"/api/v1/catalog/paths?q=%20foundations%20", 1},
		{"/api/v1/catalog/courses?q=zz-no-match", 0}, {"/api/v1/catalog/courses?pathId=path-foundations", 1},
		{"/api/v1/catalog/courses?pathId=path-practice&q=focused", 1}, {"/api/v1/catalog/courses?pathId=path-foundations&q=focused", 0},
		{"/api/v1/catalog/paths?courseId=course-focus", 1}, {"/api/v1/catalog/paths?courseId=course-hidden", 0},
		{"/api/v1/catalog/courses?pathId=path-hidden", 0}, {"/api/v1/catalog/paths?q=Private", 0},
	} {
		b := document(t, read(t, h, tc.path, 200))
		data, ok := b["data"].([]any)
		if !ok || len(data) != tc.count {
			t.Errorf("unexpected public result count for %s", tc.path)
		}
	}
}
func TestVS01AN02N03N04HiddenDraftAndMismatchedIDs(t *testing.T) {
	h := fixtureHandler(t, io.Discard)
	for _, path := range []string{"/api/v1/paths/path-hidden", "/api/v1/paths/missing", "/api/v1/courses/course-hidden", "/api/v1/courses/missing", "/api/v1/courses/course-flagship/lessons/lesson-draft", "/api/v1/courses/course-flagship/lessons/lesson-focus-1"} {
		read(t, h, path, 404)
	}
}
func TestVS01AN05N06AllowlistedDTOs(t *testing.T) {
	h := fixtureHandler(t, io.Discard)
	paths := []string{"/api/v1/catalog/paths", "/api/v1/catalog/courses", "/api/v1/paths/path-practice", "/api/v1/courses/course-flagship", "/api/v1/courses/course-flagship/lessons/lesson-flagship-1", "/api/v1/courses/course-flagship/lessons/lesson-flagship-2", "/api/v1/courses/course-focus/lessons/lesson-focus-1"}
	forbidden := []string{"synthetic-private-answer-marker", "answerKeys", "assessmentId", "draft-v2", "lesson-draft", "Private Course Marker", "Private Path Marker", "enrollment", "grade", "completion", "author"}
	for _, path := range paths {
		b := read(t, h, path, 200).Body.String()
		// The authored public callout contains the word completion; inspect field names separately.
		for _, marker := range forbidden {
			if marker == "completion" {
				marker = `"completion"`
			}
			if strings.Contains(b, marker) {
				t.Fatal("private or unauthorized field escaped its projection")
			}
		}
	}
	// Exact top-level/detail DTO keys, not just marker absence.
	b := document(t, read(t, h, "/api/v1/courses/course-flagship", 200))
	data := b["data"].(map[string]any)
	expected := map[string]bool{"id": true, "versionId": true, "title": true, "summary": true, "freeLessonCount": true, "description": true, "modules": true}
	if len(data) != len(expected) {
		t.Fatal("Course DTO field count changed")
	}
	for k := range data {
		if !expected[k] {
			t.Fatal("unexpected Course DTO field")
		}
	}
}
func TestVS01AN07N08N09QueryAndIDValidation(t *testing.T) {
	h := fixtureHandler(t, io.Discard)
	invalid := []string{"sort=title", "archive=true", "offset=1", "Q=x", "q=x&q=y", "limit=1&limit=2", "pathId=path-practice&pathId=path-practice", "limit=0", "limit=51", "limit=-1", "limit=1.0", "limit=", "q=", "q=%20%20", "q=%FF", "q=%00", "q=%C2%85", "q=%zz", "q=a;b", "cursor=%", "cursor=not-a-signed-cursor", "courseId=x", "pathId=a%2Fb", "pathId=.."}
	invalid = append(invalid, "q="+strings.Repeat("x", 101), "cursor="+strings.Repeat("x", 1025))
	invalid = append(invalid, "pathId="+strings.Repeat("a", 129))
	for _, query := range invalid {
		read(t, h, "/api/v1/catalog/courses?"+query, 400)
	}
	for _, path := range []string{"/api/v1/courses/a%2Fb", "/api/v1/courses/a%5Cb", "/api/v1/courses/%2e%2e", "/api/v1/courses/%FF", "/api/v1/paths/path-foundations?q=x", "/api/v1/courses/course-flagship?version=pub-v1"} {
		read(t, h, path, 400)
	}
	read(t, h, "/api/v1/catalog/courses?q="+url.QueryEscape(strings.Repeat("界", 100)), 200)
	read(t, h, "/api/v1/catalog/courses?pathId="+strings.Repeat("a", 128), 200)
	read(t, h, "/api/v1/courses/"+strings.Repeat("a", 128), 404)
	read(t, h, "/api/v1/courses/"+strings.Repeat("a", 129), 400)
	bounded := document(t, read(t, h, "/api/v1/catalog/courses?limit=50", 200))
	if bounded["meta"].(map[string]any)["filters"].(map[string]any)["limit"] != float64(50) {
		t.Fatal("effective limit was not echoed")
	}
}
func TestVS01AN10N11SignedPaginationAndReset(t *testing.T) {
	h := fixtureHandler(t, io.Discard)
	for _, endpoint := range []string{"paths", "courses"} {
		first := document(t, read(t, h, "/api/v1/catalog/"+endpoint+"?limit=1", 200))
		token := first["page"].(map[string]any)["nextCursor"].(string)
		secondPath := "/api/v1/catalog/" + endpoint + "?limit=1&cursor=" + url.QueryEscape(token)
		second := document(t, read(t, h, secondPath, 200))
		replay := document(t, read(t, h, secondPath, 200))
		a := first["data"].([]any)[0].(map[string]any)["id"]
		b := second["data"].([]any)[0].(map[string]any)["id"]
		if a == b || second["page"].(map[string]any)["nextCursor"] != nil || replay["data"].([]any)[0].(map[string]any)["id"] != b {
			t.Fatal("pagination duplicated, skipped, or changed on safe replay")
		}
		for _, path := range []string{
			"/api/v1/catalog/" + endpoint + "?limit=2&cursor=" + url.QueryEscape(token),
			"/api/v1/catalog/" + endpoint + "?limit=1&q=changed&cursor=" + url.QueryEscape(token),
			"/api/v1/catalog/" + endpoint + "?limit=1&cursor=" + url.QueryEscape(token+"x"),
		} {
			read(t, h, path, 400)
		}
		other := "courses"
		member := "courseId=course-flagship"
		if endpoint == "courses" {
			other = "paths"
			member = "pathId=path-practice"
		}
		read(t, h, "/api/v1/catalog/"+endpoint+"?limit=1&"+member+"&cursor="+url.QueryEscape(token), 400)
		read(t, h, "/api/v1/catalog/"+other+"?limit=1&cursor="+url.QueryEscape(token), 400)
		read(t, fixtureHandler(t, io.Discard), secondPath, 400)
	}
}
func TestVS01AN12N13SafeContentAndMedia(t *testing.T) {
	h := fixtureHandler(t, io.Discard)
	body := document(t, read(t, h, "/api/v1/courses/course-flagship/lessons/lesson-flagship-1", 200))
	data := body["data"].(map[string]any)
	blocks := data["blocks"].([]any)
	if len(blocks) != 4 {
		t.Fatal("supported Blocks missing")
	}
	if blocks[1].(map[string]any)["payload"].(map[string]any)["text"] != "<script>alert('literal only')</script>" {
		t.Fatal("literal code changed")
	}
	image := read(t, h, "/assets/fixture/diagram.svg", 200)
	if image.Header().Get("Content-Type") != "image/svg+xml" || image.Header().Get("X-Content-Type-Options") != "nosniff" || image.Header().Get("Content-Security-Policy") == "" {
		t.Fatal("media security headers missing")
	}
	for _, path := range []string{"/assets/fixture/manifest.json", "/assets/fixture/../manifest.json", "/assets/fixture/%2e%2e/manifest.json", "/assets/fixture/diagram.svg/extra", "/assets/fixture/%64iagram.svg", "/assets/fixture/unknown.svg"} {
		read(t, h, path, 404)
	}
	read(t, h, "/assets/fixture/diagram.svg?file=manifest.json", 400)
}
func TestVS01AN14N15N16RequestIDsProblemsAndLogs(t *testing.T) {
	var logs bytes.Buffer
	h := fixtureHandler(t, &logs)
	for _, value := range []string{"valid-id.123", strings.Repeat("x", 64), "bad request-id", "x\nprivate-marker", strings.Repeat("x", 65)} {
		request := httptest.NewRequest("GET", "/api/v1/catalog/paths", nil)
		request.Header.Set("X-Request-ID", value)
		response := httptest.NewRecorder()
		h.ServeHTTP(response, request)
		id := response.Header().Get("X-Request-ID")
		if !validRequestID.MatchString(id) || (id == value) != validRequestID.MatchString(value) {
			t.Fatal("request ID was not safely validated")
		}
	}
	duplicate := httptest.NewRequest("GET", "/api/v1/catalog/paths", nil)
	duplicate.Header.Add("X-Request-ID", "first")
	duplicate.Header.Add("X-Request-ID", "second")
	duplicateResponse := httptest.NewRecorder()
	h.ServeHTTP(duplicateResponse, duplicate)
	if id := duplicateResponse.Header().Get("X-Request-ID"); id == "first" || id == "second" || !validRequestID.MatchString(id) {
		t.Fatal("duplicate request IDs were not replaced")
	}
	for _, tc := range []struct {
		method, path, accept string
		status               int
	}{
		{"POST", "/api/v1/catalog/paths", "application/json", 405}, {"HEAD", "/api/v1/catalog/paths", "application/json", 405},
		{"GET", "/api/v1/catalog/paths", "text/html", 406}, {"GET", "/api/v1/catalog/paths?q=%00private-marker", "application/json", 400},
		{"GET", "/api/v1/courses/course-hidden", "application/json", 404},
	} {
		r := httptest.NewRequest(tc.method, tc.path, strings.NewReader("private-marker"))
		r.Header.Set("Accept", tc.accept)
		r.Header.Set("Authorization", "Bearer private-marker")
		response := httptest.NewRecorder()
		h.ServeHTTP(response, r)
		if response.Code != tc.status {
			t.Fatal("unexpected protocol status")
		}
		b := document(t, response)
		if len(b) != 4 || b["type"] != "about:blank" || b["requestId"] != response.Header().Get("X-Request-ID") {
			t.Fatal("problem envelope changed")
		}
		if response.Header().Get("Content-Type") != "application/problem+json" {
			t.Fatal("problem media type missing")
		}
		if tc.status == 405 && response.Header().Get("Allow") != "GET" {
			t.Fatal("Allow header missing")
		}
	}
	if strings.Contains(logs.String(), "private-marker") || strings.Contains(logs.String(), "course-hidden") || strings.Contains(logs.String(), "Authorization") {
		t.Fatal("sensitive request material entered logs")
	}
}
func TestConcurrentFixtureReads(t *testing.T) {
	h := fixtureHandler(t, io.Discard)
	var wg sync.WaitGroup
	for range 16 {
		wg.Go(func() {
			for range 20 {
				r := httptest.NewRecorder()
				h.ServeHTTP(r, httptest.NewRequest("GET", "/api/v1/catalog/paths?limit=1", nil))
				if r.Code != 200 {
					t.Error("concurrent read failed")
				}
			}
		})
	}
	wg.Wait()
}

type faultRepository struct {
	publiclearning.Repository
	panicRead bool
	entered   chan struct{}
	release   chan struct{}
}

func (r faultRepository) PublicPaths() []publiclearning.PathSummary {
	if r.panicRead {
		panic("private-marker internal path")
	}
	r.entered <- struct{}{}
	<-r.release
	return r.Repository.PublicPaths()
}
func TestVS01AN15Safe500AndBounded429(t *testing.T) {
	repo, err := devfixture.Load()
	if err != nil {
		t.Fatal(err)
	}
	var logs bytes.Buffer
	s, err := publiclearning.New(faultRepository{Repository: repo, panicRead: true})
	if err != nil {
		t.Fatal(err)
	}
	h := NewHandlerWithContent(slog.New(slog.NewJSONHandler(&logs, nil)), s)
	r := read(t, h, "/api/v1/catalog/paths", 500)
	if strings.Contains(r.Body.String(), "private-marker") || strings.Contains(logs.String(), "private-marker") {
		t.Fatal("panic details leaked")
	}
	entered, release := make(chan struct{}, 32), make(chan struct{})
	s, err = publiclearning.New(faultRepository{Repository: repo, entered: entered, release: release})
	if err != nil {
		t.Fatal(err)
	}
	h = NewHandlerWithContent(slog.New(slog.NewTextHandler(io.Discard, nil)), s)
	var wg sync.WaitGroup
	for range 32 {
		wg.Go(func() {
			r := httptest.NewRecorder()
			h.ServeHTTP(r, httptest.NewRequest("GET", "/api/v1/catalog/paths", nil))
			if r.Code != 200 {
				t.Error("admitted read failed")
			}
		})
	}
	for range 32 {
		<-entered
	}
	read(t, h, "/api/v1/catalog/paths", 429)
	close(release)
	wg.Wait()
}
