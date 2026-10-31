package main

import (
	"context"
	"errors"
	"log/slog"
	"net"
	"os"
	"os/signal"
	"syscall"

	"github.com/sipratama/ai-learning-platform/apps/api/internal/platform/config"
	"github.com/sipratama/ai-learning-platform/apps/api/internal/platform/httpserver"
	"github.com/sipratama/ai-learning-platform/apps/api/internal/publiclearning"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg, err := config.Load(os.Getenv)
	if err != nil {
		logger.Error("startup_failed", "reason", "invalid_configuration")
		os.Exit(1)
	}
	repository, err := contentRepository(cfg)
	if err != nil {
		logger.Error("startup_failed", "reason", "fixture_unavailable")
		os.Exit(1)
	}
	content, err := publiclearning.New(repository)
	if err != nil {
		logger.Error("startup_failed", "reason", "content_unavailable")
		os.Exit(1)
	}

	listener, err := net.Listen("tcp", cfg.ListenAddress)
	if err != nil {
		logger.Error("startup_failed", "reason", "listen_failed")
		os.Exit(1)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	logger.Info("server_started", "service", "api")
	if err := httpserver.Serve(ctx, listener, httpserver.NewHandlerWithContent(logger, content)); err != nil && !errors.Is(err, context.Canceled) {
		logger.Error("server_stopped", "reason", "serve_failed")
		os.Exit(1)
	}
	logger.Info("server_stopped", "reason", "shutdown")
}
