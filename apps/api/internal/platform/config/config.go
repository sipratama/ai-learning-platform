package config

import (
	"errors"
	"net"
	"strconv"
)

const DefaultListenAddress = "127.0.0.1:8080"

type Config struct {
	ListenAddress string
	Environment   string
	FixtureMode   string
}

func Load(getenv func(string) string) (Config, error) {
	address := getenv("HTTP_LISTEN_ADDR")
	if address == "" {
		address = DefaultListenAddress
	}
	_, portText, err := net.SplitHostPort(address)
	if err != nil {
		return Config{}, errors.New("invalid HTTP listen address")
	}
	port, err := strconv.Atoi(portText)
	if err != nil || port < 1 || port > 65535 {
		return Config{}, errors.New("invalid HTTP listen port")
	}
	environment := getenv("APP_ENV")
	fixtureMode := getenv("FIXTURE_MODE")
	if fixtureMode == "" {
		fixtureMode = "disabled"
	}
	if environment == "" {
		if fixtureMode != "disabled" {
			return Config{}, errors.New("fixture mode requires explicit environment")
		}
		environment = "local"
	}
	switch environment {
	case "local", "test", "staging", "production":
	default:
		return Config{}, errors.New("invalid environment classification")
	}
	switch fixtureMode {
	case "disabled":
	case "vs01a":
		if environment != "local" && environment != "test" {
			return Config{}, errors.New("fixture mode is not allowed in this environment")
		}
	default:
		return Config{}, errors.New("invalid fixture mode")
	}
	return Config{ListenAddress: address, Environment: environment, FixtureMode: fixtureMode}, nil
}
