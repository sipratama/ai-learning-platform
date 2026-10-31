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
			got, err := Load(func(string) string { return tc.value })
			if (err != nil) != tc.wantErr || (!tc.wantErr && got.ListenAddress != tc.want) {
				t.Fatalf("Load() = %#v, %v; want %q, error=%v", got, err, tc.want, tc.wantErr)
			}
		})
	}
}
