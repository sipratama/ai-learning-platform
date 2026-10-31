package httpserver

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestUnavailableContentHasNoSyntheticFallback(t *testing.T) {
	h := NewHandler(slog.New(slog.NewTextHandler(io.Discard, nil)))
	for _, path := range []string{"/api/v1/catalog/paths", "/api/v1/catalog/courses", "/api/v1/paths/path-foundations", "/api/v1/courses/course-flagship", "/api/v1/courses/course-flagship/lessons/lesson-flagship-1", "/assets/fixture/diagram.svg"} {
		r := httptest.NewRecorder()
		h.ServeHTTP(r, httptest.NewRequest("GET", path, nil))
		if r.Code != 503 {
			t.Fatalf("content without a repository returned %d", r.Code)
		}
	}
}
func TestJSONAcceptNegotiation(t *testing.T) {
	for _, tc := range []struct {
		value string
		ok    bool
	}{
		{"", true}, {"application/json", true}, {"*/*", true}, {"text/html,application/json;q=0.5", true}, {"application/json;q=0,*/*;q=1", false}, {"application/json;q=0", false}, {"text/html", false}, {"application/*", false}, {"application/json;q=bad", false}, {"application/json;q=2", false},
	} {
		if acceptsJSON(tc.value) != tc.ok {
			t.Errorf("Accept negotiation did not match the contract for %q", tc.value)
		}
	}
}
func TestUnknownOfficialRoutesRemainAbsent(t *testing.T) {
	h := NewHandler(slog.New(slog.NewTextHandler(io.Discard, nil)))
	for _, method := range []string{http.MethodGet, http.MethodPost, http.MethodPut} {
		for _, path := range []string{"/api/v1/me/activity-evidence", "/api/v1/me/course-completions/course-flagship", "/api/v1/admin/courses"} {
			r := httptest.NewRecorder()
			h.ServeHTTP(r, httptest.NewRequest(method, path, nil))
			if r.Code != 404 {
				t.Fatal("unauthorized official capability became available")
			}
		}
	}
}
