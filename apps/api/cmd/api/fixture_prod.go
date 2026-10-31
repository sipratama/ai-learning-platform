//go:build !devfixture

package main

import (
	"errors"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/platform/config"
)

func initializeFixture(cfg config.Config) error {
	if cfg.FixtureMode != "disabled" {
		return errors.New("fixture unavailable in standard artifact")
	}
	return nil
}
