package httpserver

import (
	"encoding/json"
	"errors"
	"mime"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/publiclearning"
)

func matchPublic(path string) (string, []string, bool) {
	if !strings.HasPrefix(path, "/api/v1/") {
		return "", nil, false
	}
	parts := strings.Split(strings.TrimPrefix(path, "/api/v1/"), "/")
	switch {
	case len(parts) == 2 && parts[0] == "catalog" && (parts[1] == "paths" || parts[1] == "courses"):
		return "catalog/" + parts[1], nil, true
	case len(parts) == 2 && (parts[0] == "paths" || parts[0] == "courses"):
		return parts[0], parts[1:], true
	case len(parts) == 4 && parts[0] == "courses" && parts[2] == "lessons":
		return "lessons", []string{parts[1], parts[3]}, true
	}
	return "", nil, false
}
func servePublic(w http.ResponseWriter, r *http.Request, requestID string, content *publiclearning.Service, permits chan struct{}) {
	path := r.URL.EscapedPath()
	endpoint, ids, known := matchPublic(path)
	media := strings.HasPrefix(path, "/assets/fixture/")
	if !known && !media {
		writeProblem(w, 404, "Not Found", requestID)
		return
	}
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", "GET")
		writeProblem(w, 405, "Method Not Allowed", requestID)
		return
	}
	if !media && !acceptsJSON(strings.Join(r.Header.Values("Accept"), ",")) {
		writeProblem(w, 406, "Not Acceptable", requestID)
		return
	}
	values, err := url.ParseQuery(r.URL.RawQuery)
	if err != nil {
		writeProblem(w, 400, "Bad Request", requestID)
		return
	}
	for i, id := range ids {
		value, err := url.PathUnescape(id)
		if err != nil || !publiclearning.ValidID(value) {
			writeProblem(w, 400, "Bad Request", requestID)
			return
		}
		ids[i] = value
	}
	select {
	case permits <- struct{}{}:
		defer func() { <-permits }()
	default:
		writeProblem(w, 429, "Too Many Requests", requestID)
		return
	}
	if media {
		if len(values) != 0 {
			writeProblem(w, 400, "Bad Request", requestID)
			return
		}
		data, kind, err := content.Asset(path)
		if err != nil {
			publicProblem(w, err, requestID)
			return
		}
		w.Header().Set("Content-Type", kind)
		w.Header().Set("Content-Security-Policy", "default-src 'none'; sandbox")
		w.Header().Set("Cross-Origin-Resource-Policy", "same-origin")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(data)
		return
	}
	result, err := content.Read(endpoint, ids, values)
	if err != nil {
		publicProblem(w, err, requestID)
		return
	}
	result.Meta.RequestID = requestID
	raw, err := json.Marshal(result)
	if err != nil {
		publicProblem(w, err, requestID)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(append(raw, '\n'))
}
func publicProblem(w http.ResponseWriter, err error, requestID string) {
	switch {
	case errors.Is(err, publiclearning.ErrInvalid):
		writeProblem(w, 400, "Bad Request", requestID)
	case errors.Is(err, publiclearning.ErrNotFound):
		writeProblem(w, 404, "Not Found", requestID)
	case errors.Is(err, publiclearning.ErrUnavailable):
		writeProblem(w, 503, "Service Unavailable", requestID)
	default:
		writeProblem(w, 500, "Internal Server Error", requestID)
	}
}

// Respect the most specific matching range, including an explicit JSON q=0 exclusion.
func acceptsJSON(accept string) bool {
	if strings.TrimSpace(accept) == "" {
		return true
	}
	specificity := -1
	quality := 0.0
	for _, part := range strings.Split(accept, ",") {
		kind, params, err := mime.ParseMediaType(strings.TrimSpace(part))
		if err != nil {
			continue
		}
		rank := -1
		if kind == "application/json" {
			rank = 2
		}
		if kind == "*/*" {
			rank = 0
		}
		if rank < 0 {
			continue
		}
		q := 1.0
		if value, ok := params["q"]; ok {
			q, err = strconv.ParseFloat(value, 64)
			if err != nil || q < 0 || q > 1 {
				continue
			}
		}
		if rank > specificity || rank == specificity && q > quality {
			specificity = rank
			quality = q
		}
	}
	return specificity >= 0 && quality > 0
}
