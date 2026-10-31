package config

import "testing"

func TestLoad(t *testing.T) {
	for _, tc := range []struct {
		name    string
		value   string
		want    string
		wantErr bool
	}{
		{"default", "", DefaultListenAddress, false},
		{"custom", "localhost:9000", "localhost:9000", false},
		{"ipv6", "[::1]:9000", "[::1]:9000", false},
		{"missing port", "localhost", "", true},
		{"invalid port", "localhost:abc", "", true},
		{"zero port", "localhost:0", "", true},
		{"large port", "localhost:65536", "", true},
	} {
		t.Run(tc.name, func(t *testing.T) {
			got, err := Load(func(key string) string {
				if key == "HTTP_LISTEN_ADDR" {
					return tc.value
				}
				return ""
			})
			if (err != nil) != tc.wantErr || (!tc.wantErr && got.ListenAddress != tc.want) {
				t.Fatalf("Load() = %#v, %v; want %q, error=%v", got, err, tc.want, tc.wantErr)
			}
		})
	}
}

func TestFixtureConfigurationFailsClosed(t *testing.T) {
	for _, tc := range []struct {
		name, environment, mode string
		wantError               bool
	}{
		{"disabled default", "", "", false},
		{"local explicit", "local", "vs01a", false},
		{"test explicit", "test", "vs01a", false},
		{"missing environment", "", "vs01a", true},
		{"staging", "staging", "vs01a", true},
		{"production", "production", "vs01a", true},
		{"unknown", "surprise", "vs01a", true},
		{"unknown disabled", "surprise", "disabled", true},
		{"malformed mode", "local", "true", true},
	} {
		t.Run(tc.name, func(t *testing.T) {
			cfg, err := Load(func(key string) string {
				switch key {
				case "APP_ENV":
					return tc.environment
				case "FIXTURE_MODE":
					return tc.mode
				default:
					return ""
				}
			})
			if (err != nil) != tc.wantError {
				t.Fatalf("Load() = %#v, %v; want error=%v", cfg, err, tc.wantError)
			}
		})
	}
}
