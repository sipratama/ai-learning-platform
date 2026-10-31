package httpserver

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log/slog"
	"net/http"
	"regexp"
	"time"
)

const requestIDHeader = "X-Request-ID"

var validRequestID = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$`)

type responseWriter struct {
	http.ResponseWriter
	status int
}

func (w *responseWriter) WriteHeader(status int) {
	if w.status != 0 {
		return
	}
	w.status = status
	w.ResponseWriter.WriteHeader(status)
}

func (w *responseWriter) Write(body []byte) (int, error) {
	if w.status == 0 {
		w.WriteHeader(http.StatusOK)
	}
	return w.ResponseWriter.Write(body)
}

func NewHandler(logger *slog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		started := time.Now()
		requestID := r.Header.Get(requestIDHeader)
		if !validRequestID.MatchString(requestID) {
			bytes := make([]byte, 16)
			if _, err := rand.Read(bytes); err != nil {
				writeProblem(w, http.StatusInternalServerError, "Internal Server Error", "")
				logger.Error("request_failed", "reason", "request_id_generation_failed")
				return
			}
			requestID = hex.EncodeToString(bytes)
		}
		w.Header().Set(requestIDHeader, requestID)
		w.Header().Set("Cache-Control", "no-store")
		tracked := &responseWriter{ResponseWriter: w}

		switch {
		case r.URL.Path != "/healthz":
			writeProblem(tracked, http.StatusNotFound, "Not Found", requestID)
		case r.Method != http.MethodGet:
			tracked.Header().Set("Allow", http.MethodGet)
			writeProblem(tracked, http.StatusMethodNotAllowed, "Method Not Allowed", requestID)
		default:
			tracked.Header().Set("Content-Type", "application/json")
			_ = json.NewEncoder(tracked).Encode(struct {
				Status    string `json:"status"`
				RequestID string `json:"requestId"`
			}{Status: "ok", RequestID: requestID})
		}
		logger.Info("http_request", "service", "api", "outcome", tracked.status, "request_id", requestID, "duration_ms", time.Since(started).Milliseconds())
	})
}

func writeProblem(w http.ResponseWriter, status int, title, requestID string) {
	w.Header().Set("Content-Type", "application/problem+json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(struct {
		Type      string `json:"type"`
		Title     string `json:"title"`
		Status    int    `json:"status"`
		RequestID string `json:"requestId,omitempty"`
	}{Type: "about:blank", Title: title, Status: status, RequestID: requestID})
}
