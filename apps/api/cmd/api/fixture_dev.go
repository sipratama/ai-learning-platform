//go:build devfixture

package main

import (
	"errors"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/devfixture"
	"github.com/sipratama/ai-learning-platform/apps/api/internal/platform/config"
	"github.com/sipratama/ai-learning-platform/apps/api/internal/publiclearning"
)

func initializeFixture(cfg config.Config) error {
	_, err := contentRepository(cfg)
	return err
}

func contentRepository(cfg config.Config) (publiclearning.Repository, error) {
	if cfg.Environment != "local" && cfg.Environment != "test" {
		return nil, errors.New("development fixture artifact forbidden in this environment")
	}
	if cfg.FixtureMode != "vs01a" {
		return nil, nil
	}
	return devfixture.Load()
}
