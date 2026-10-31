//go:build devfixture

package main

import (
	"testing"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/platform/config"
)

func TestDevelopmentArtifactEnvironmentGuard(t *testing.T) {
	for _, environment := range []string{"staging", "production", "unknown", ""} {
		if err := initializeFixture(config.Config{Environment: environment, FixtureMode: "disabled"}); err == nil {
			t.Fatalf("development artifact accepted %q", environment)
		}
	}
	for _, environment := range []string{"local", "test"} {
		if err := initializeFixture(config.Config{Environment: environment, FixtureMode: "vs01a"}); err != nil {
			t.Fatalf("fixture load in %q: %v", environment, err)
		}
	}
}
