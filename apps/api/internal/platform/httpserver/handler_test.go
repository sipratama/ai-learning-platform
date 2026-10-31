package httpserver

import (
	"bytes"
	"encoding/json"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealthAndRequestID(t *testing.T) {
	var logs bytes.Buffer
	handler := NewHandler(slog.New(slog.NewJSONHandler(&logs, nil)))

	for _, tc := range []struct {
		name       string
		id         string
		wantEchoed bool
	}{
		{"generated", "", false},
		{"propagated", "request-123", true},
		{"invalid regenerated", "bad id\nsecret", false},
	} {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
			if tc.id != "" {
				req.Header.Set(requestIDHeader, tc.id)
			}
			res := httptest.NewRecorder()
			handler.ServeHTTP(res, req)
			if res.Code != http.StatusOK || res.Header().Get("Content-Type") != "application/json" {
				t.Fatalf("unexpected health response: %d %q", res.Code, res.Body.String())
			}
			id := res.Header().Get(requestIDHeader)
			if !validRequestID.MatchString(id) || (id == tc.id) != tc.wantEchoed {
				t.Fatalf("unexpected request id %q", id)
			}
			var body struct {
				Status    string `json:"status"`
				RequestID string `json:"requestId"`
			}
			if err := json.Unmarshal(res.Body.Bytes(), &body); err != nil || body.Status != "ok" || body.RequestID != id {
				t.Fatalf("unexpected health body: %#v, %v", body, err)
			}
		})
	}
}

func TestSafeErrorsAndRedactedLogs(t *testing.T) {
	var logs bytes.Buffer
	handler := NewHandler(slog.New(slog.NewJSONHandler(&logs, nil)))
	secret := "sensitive-test-token"
	for _, tc := range []struct {
		method string
		path   string
		status int
	}{
		{http.MethodPost, "/healthz", http.StatusMethodNotAllowed},
		{http.MethodGet, "/missing?token=" + secret, http.StatusNotFound},
	} {
		req := httptest.NewRequest(tc.method, tc.path, strings.NewReader(secret))
		req.Header.Set("Authorization", "Bearer "+secret)
		res := httptest.NewRecorder()
		handler.ServeHTTP(res, req)
		if res.Code != tc.status || res.Header().Get("Content-Type") != "application/problem+json" {
			t.Fatalf("unexpected error response: %d %q", res.Code, res.Body.String())
		}
		if !strings.Contains(res.Body.String(), `"requestId"`) || strings.Contains(res.Body.String(), secret) {
			t.Fatalf("unsafe problem body: %q", res.Body.String())
		}
		if tc.status == http.StatusMethodNotAllowed && res.Header().Get("Allow") != http.MethodGet {
			t.Fatal("missing Allow header")
		}
	}
	if strings.Contains(logs.String(), secret) || strings.Contains(logs.String(), "Authorization") || strings.Contains(logs.String(), "/missing") {
		t.Fatalf("sensitive request data leaked to logs: %q", logs.String())
	}
}
