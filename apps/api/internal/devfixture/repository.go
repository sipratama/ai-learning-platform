//go:build devfixture

package devfixture

func (s *Snapshot) SnapshotID() string { return s.data.SnapshotID }

// PublicAsset is an exact allowlist; there is no filesystem path construction or directory serving.
func (s *Snapshot) PublicAsset(path string) ([]byte, string, bool) {
	if path != "/assets/fixture/diagram.svg" {
		return nil, "", false
	}
	data, err := files.ReadFile("assets/diagram.svg")
	if err != nil {
		return nil, "", false
	}
	return data, "image/svg+xml", true
}
