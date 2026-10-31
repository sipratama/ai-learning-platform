//go:build !devfixture

package main

import (
	"io"
	"log/slog"
	"net/http/httptest"
	"testing"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/platform/config"
	"github.com/sipratama/ai-learning-platform/apps/api/internal/platform/httpserver"
	"github.com/sipratama/ai-learning-platform/apps/api/internal/publiclearning"
)

func TestStandardArtifactRejectsFixture(t *testing.T) {
	if err := initializeFixture(config.Config{Environment: "local", FixtureMode: "vs01a"}); err == nil {
		t.Fatal("standard artifact accepted fixture mode")
	}
	if err := initializeFixture(config.Config{Environment: "production", FixtureMode: "disabled"}); err != nil {
		t.Fatalf("standard artifact rejected disabled mode: %v", err)
	}
}

func TestStandardArtifactHasNoContentRepository(t *testing.T) {
	repo, err := contentRepository(config.Config{Environment: "production", FixtureMode: "disabled"})
	if err != nil || repo != nil {
		t.Fatal("standard artifact configured a synthetic repository")
	}
	content, err := publiclearning.New(repo)
	if err != nil {
		t.Fatal(err)
	}
	handler := httpserver.NewHandlerWithContent(slog.New(slog.NewTextHandler(io.Discard, nil)), content)
	for _, path := range []string{"/api/v1/catalog/paths", "/api/v1/catalog/courses", "/api/v1/paths/path-foundations", "/api/v1/courses/course-flagship", "/api/v1/courses/course-flagship/lessons/lesson-flagship-1", "/assets/fixture/diagram.svg"} {
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, httptest.NewRequest("GET", path, nil))
		if response.Code != 503 {
			t.Fatal("standard composition exposed disposable content")
		}
	}
}
