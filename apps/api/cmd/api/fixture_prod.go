//go:build !devfixture

package main

import (
	"errors"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/platform/config"
	"github.com/sipratama/ai-learning-platform/apps/api/internal/publiclearning"
)

func initializeFixture(cfg config.Config) error {
	_, err := contentRepository(cfg)
	return err
}

func contentRepository(cfg config.Config) (publiclearning.Repository, error) {
	if cfg.FixtureMode != "disabled" {
		return nil, errors.New("fixture unavailable in standard artifact")
	}
	return nil, nil
}
