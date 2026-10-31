//go:build !devfixture

package main

import (
	"testing"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/platform/config"
)

func TestStandardArtifactRejectsFixture(t *testing.T) {
	if err := initializeFixture(config.Config{Environment: "local", FixtureMode: "vs01a"}); err == nil {
		t.Fatal("standard artifact accepted fixture mode")
	}
	if err := initializeFixture(config.Config{Environment: "production", FixtureMode: "disabled"}); err != nil {
		t.Fatalf("standard artifact rejected disabled mode: %v", err)
	}
}
