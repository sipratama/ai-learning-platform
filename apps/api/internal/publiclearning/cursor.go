package publiclearning

import (
	"bytes"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"io"
	"strings"
)

type Service struct {
	repo Repository
	key  [32]byte
}

// New uses a fresh process-owned key. Keys and private fixture data never cross HTTP.
func New(repo Repository) (*Service, error) {
	s := &Service{repo: repo}
	if _, err := rand.Read(s.key[:]); err != nil {
		return nil, err
	}
	return s, nil
}

type cursor struct {
	Endpoint  string `json:"e"`
	Q         string `json:"q"`
	Member    string `json:"m"`
	Limit     int    `json:"l"`
	Snapshot  string `json:"s"`
	LastTitle string `json:"t"`
	LastID    string `json:"i"`
}

func newCursor(e string, q query, snapshot, title, id string) cursor {
	return cursor{e, strings.ToLower(q.Q), q.Member, q.Limit, snapshot, title, id}
}
func (c cursor) bound(e string, q query, snapshot string) bool {
	return c.Endpoint == e && c.Q == strings.ToLower(q.Q) && c.Member == q.Member && c.Limit == q.Limit && c.Snapshot == snapshot && c.LastTitle != "" && ValidID(c.LastID)
}

var cursorEncoding = base64.RawURLEncoding.Strict()

func (s *Service) encode(c cursor) (string, error) {
	raw, err := json.Marshal(c)
	if err != nil {
		return "", err
	}
	signature := hmac.New(sha256.New, s.key[:])
	signature.Write(raw)
	token := cursorEncoding.EncodeToString(raw) + "." + cursorEncoding.EncodeToString(signature.Sum(nil))
	if len(token) > 1024 {
		return "", ErrUnavailable
	}
	return token, nil
}
func (s *Service) decode(token string) (cursor, error) {
	var c cursor
	parts := strings.Split(token, ".")
	if len(parts) != 2 {
		return c, ErrInvalid
	}
	raw, err := cursorEncoding.DecodeString(parts[0])
	if err != nil {
		return c, ErrInvalid
	}
	sig, err := cursorEncoding.DecodeString(parts[1])
	if err != nil || len(sig) != sha256.Size {
		return c, ErrInvalid
	}
	mac := hmac.New(sha256.New, s.key[:])
	mac.Write(raw)
	if !hmac.Equal(sig, mac.Sum(nil)) {
		return c, ErrInvalid
	}
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if decoder.Decode(&c) != nil || decoder.Decode(new(any)) != io.EOF {
		return c, ErrInvalid
	}
	return c, nil
}
