//go:build devfixture

package main

import (
	"errors"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/devfixture"
	"github.com/sipratama/ai-learning-platform/apps/api/internal/platform/config"
)

func initializeFixture(cfg config.Config) error {
	if cfg.Environment != "local" && cfg.Environment != "test" {
		return errors.New("development fixture artifact forbidden in this environment")
	}
	if cfg.FixtureMode != "vs01a" {
		return nil
	}
	_, err := devfixture.Load()
	return err
}
