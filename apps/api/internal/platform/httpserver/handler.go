package httpserver

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log/slog"
	"net/http"
	"regexp"
	"time"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/publiclearning"
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
	return NewHandlerWithContent(logger, nil)
}

func NewHandlerWithContent(logger *slog.Logger, content *publiclearning.Service) http.Handler {
	permits := make(chan struct{}, 32)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		started := time.Now()
		requestID := r.Header.Get(requestIDHeader)
		if len(r.Header.Values(requestIDHeader)) != 1 || !validRequestID.MatchString(requestID) {
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
		w.Header().Set("X-Content-Type-Options", "nosniff")
		tracked := &responseWriter{ResponseWriter: w}
		defer func() {
			if recover() != nil {
				if tracked.status == 0 {
					writeProblem(tracked, http.StatusInternalServerError, "Internal Server Error", requestID)
				}
				logger.Error("request_failed", "reason", "public_read_failed", "request_id", requestID)
			}
			logger.Info("http_request", "service", "api", "outcome", tracked.status, "request_id", requestID, "duration_ms", time.Since(started).Milliseconds())
		}()
		if r.URL.Path != "/healthz" {
			servePublic(tracked, r, requestID, content, permits)
			return
		}

		switch {
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
