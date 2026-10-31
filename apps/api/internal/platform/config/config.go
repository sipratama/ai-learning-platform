package config

import (
	"errors"
	"net"
	"strconv"
)

const DefaultListenAddress = "127.0.0.1:8080"

type Config struct {
	ListenAddress string
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
	return Config{ListenAddress: address}, nil
}
