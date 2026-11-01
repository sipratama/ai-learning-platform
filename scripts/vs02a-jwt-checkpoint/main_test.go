package main

import (
	"bytes"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"strings"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const fixtureIssuer = "https://aaaaaaaaaaaaaaaaaaaa.supabase.co/auth/v1"
const fixtureSubject = "11111111-1111-4111-8111-111111111111"
const fixtureSession = "22222222-2222-4222-8222-222222222222"

func fixtureKey(t *testing.T) *ecdsa.PrivateKey {
	t.Helper()
	k, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		t.Fatal("local ephemeral key generation failed")
	}
	return k
}

func fixtureClaims(now time.Time) jwt.MapClaims {
	return jwt.MapClaims{"iss": fixtureIssuer, "aud": "authenticated", "sub": fixtureSubject, "session_id": fixtureSession, "role": "authenticated", "is_anonymous": false, "iat": now.Unix(), "exp": now.Add(time.Hour).Unix()}
}

func fixtureJWK(k *ecdsa.PrivateKey) map[string]any {
	return map[string]any{"kid": "local-test-key", "kty": "EC", "crv": "P-256", "alg": "ES256", "use": "sig", "key_ops": []string{"verify"}, "ext": true, "x": base64.RawURLEncoding.EncodeToString(k.X.FillBytes(make([]byte, 32))), "y": base64.RawURLEncoding.EncodeToString(k.Y.FillBytes(make([]byte, 32)))}
}

func fixtureJWKS(t *testing.T, entries ...map[string]any) []byte {
	t.Helper()
	raw, err := json.Marshal(map[string]any{"keys": entries})
	if err != nil {
		t.Fatal("fixture serialization failed")
	}
	return raw
}

func sign(t *testing.T, claims jwt.MapClaims, key any, method jwt.SigningMethod, header map[string]any) string {
	t.Helper()
	token := jwt.NewWithClaims(method, claims)
	token.Header["kid"] = "local-test-key"
	for name, value := range header {
		token.Header[name] = value
	}
	serialized, err := token.SignedString(key)
	if err != nil {
		t.Fatal("local fixture signing failed")
	}
	return serialized
}

func signRaw(t *testing.T, header, payload []byte, key *ecdsa.PrivateKey) string {
	t.Helper()
	input := base64.RawURLEncoding.EncodeToString(header) + "." + base64.RawURLEncoding.EncodeToString(payload)
	signature, err := jwt.SigningMethodES256.Sign(input, key)
	if err != nil {
		t.Fatal("local raw fixture signing failed")
	}
	return input + "." + base64.RawURLEncoding.EncodeToString(signature)
}

func TestVCPPositiveProofAndRedaction(t *testing.T) {
	now := time.Now().UTC().Truncate(time.Second)
	key := fixtureKey(t)
	claims := fixtureClaims(now)
	claims["app_metadata"] = map[string]any{"role": "Admin", "sensitive": "local-sensitive-marker"}
	serialized := sign(t, claims, key, jwt.SigningMethodES256, nil)
	result, err := verify(serialized, fixtureIssuer, "authenticated", fixtureJWKS(t, fixtureJWK(key)), now)
	if err != nil || result.Status != "PASS" || result.LifetimeSeconds != 3600 || result.SubjectSHA256 != digest(fixtureSubject) || result.SessionSHA256 != digest(fixtureSession) {
		t.Fatal("VCP-P01: valid local provider-shaped fixture did not verify")
	}
	body, _ := json.Marshal(map[string]any{"token": serialized, "jwks": json.RawMessage(fixtureJWKS(t, fixtureJWK(key)))})
	var output bytes.Buffer
	if run(bytes.NewReader(body), &output, fixtureIssuer, "authenticated") != 0 {
		t.Fatal("VCP-P02: operator CLI rejected valid local fixture")
	}
	for _, forbidden := range []string{serialized, fixtureSubject, fixtureSession, "local-test-key", "local-sensitive-marker", "Admin", "access_token", "refresh_token"} {
		if strings.Contains(output.String(), forbidden) {
			t.Fatal("VCP-P02: proof leaked forbidden fixture field")
		}
	}
}

func TestVCPRejectUnsupportedAlgorithms(t *testing.T) {
	now := time.Unix(2000000000, 0)
	trusted := fixtureKey(t)
	rsaKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Fatal("local RSA fixture generation failed")
	}
	secret := make([]byte, 32)
	if _, err := rand.Read(secret); err != nil {
		t.Fatal("local HMAC fixture generation failed")
	}
	for _, tc := range []struct {
		id     string
		method jwt.SigningMethod
		key    any
	}{
		{"VCP-N01-none", jwt.SigningMethodNone, jwt.UnsafeAllowNoneSignatureType},
		{"VCP-N02-HS256", jwt.SigningMethodHS256, secret},
		{"VCP-N03-RS256", jwt.SigningMethodRS256, rsaKey},
	} {
		t.Run(tc.id, func(t *testing.T) {
			token := sign(t, fixtureClaims(now), tc.key, tc.method, nil)
			if _, err := verify(token, fixtureIssuer, "authenticated", fixtureJWKS(t, fixtureJWK(trusted)), now); err == nil {
				t.Fatal("unsupported algorithm accepted")
			}
		})
	}
}

func TestVCPRejectClaimsAndHeaders(t *testing.T) {
	now := time.Unix(2000000000, 0)
	key := fixtureKey(t)
	tests := []struct {
		id     string
		change func(jwt.MapClaims)
		header map[string]any
	}{
		{"VCP-N04-wrong-issuer", func(c jwt.MapClaims) { c["iss"] = "https://bbbbbbbbbbbbbbbbbbbb.supabase.co/auth/v1" }, nil},
		{"VCP-N05-wrong-audience", func(c jwt.MapClaims) { c["aud"] = "service_role" }, nil},
		{"VCP-N06-extra-audience", func(c jwt.MapClaims) { c["aud"] = []string{"authenticated", "other"} }, nil},
		{"VCP-N07-missing-exp", func(c jwt.MapClaims) { delete(c, "exp") }, nil},
		{"VCP-N08-missing-iat", func(c jwt.MapClaims) { delete(c, "iat") }, nil},
		{"VCP-N09-expired", func(c jwt.MapClaims) { c["iat"] = now.Unix() - 200; c["exp"] = now.Unix() - 31 }, nil},
		{"VCP-N10-future-iat", func(c jwt.MapClaims) { c["iat"] = now.Unix() + 31 }, nil},
		{"VCP-N11-future-nbf", func(c jwt.MapClaims) { c["nbf"] = now.Unix() + 31 }, nil},
		{"VCP-N12-long-lifetime", func(c jwt.MapClaims) { c["exp"] = now.Unix() + 3601 }, nil},
		{"VCP-N13-reversed-time", func(c jwt.MapClaims) { c["exp"] = now.Unix() }, nil},
		{"VCP-N14-fractional-time", func(c jwt.MapClaims) { c["iat"] = float64(now.Unix()) + 0.5 }, nil},
		{"VCP-N15-null-time", func(c jwt.MapClaims) { c["iat"] = nil }, nil},
		{"VCP-N16-string-time", func(c jwt.MapClaims) { c["iat"] = "2000000000" }, nil},
		{"VCP-N17-missing-subject", func(c jwt.MapClaims) { delete(c, "sub") }, nil},
		{"VCP-N18-bad-session", func(c jwt.MapClaims) { c["session_id"] = "not-a-uuid" }, nil},
		{"VCP-N19-anonymous", func(c jwt.MapClaims) { c["is_anonymous"] = true }, nil},
		{"VCP-N20-null-anonymous", func(c jwt.MapClaims) { c["is_anonymous"] = nil }, nil},
		{"VCP-N21-provider-admin-role", func(c jwt.MapClaims) { c["role"] = "Admin" }, nil},
		{"VCP-N22-missing-kid", nil, map[string]any{"kid": ""}},
		{"VCP-N23-unknown-kid", nil, map[string]any{"kid": "untrusted-key"}},
		{"VCP-N24-jku", nil, map[string]any{"jku": "https://example.invalid/keys"}},
		{"VCP-N25-x5u", nil, map[string]any{"x5u": "https://example.invalid/cert"}},
		{"VCP-N26-embedded-key", nil, map[string]any{"jwk": fixtureJWK(key)}},
		{"VCP-N27-critical-extension", nil, map[string]any{"crit": []string{"extension"}}},
		{"VCP-N28-wrong-type", nil, map[string]any{"typ": "other"}},
		{"VCP-N29-oversize-kid", nil, map[string]any{"kid": strings.Repeat("x", 129)}},
	}
	for _, tc := range tests {
		t.Run(tc.id, func(t *testing.T) {
			claims := fixtureClaims(now)
			if tc.change != nil {
				tc.change(claims)
			}
			serialized := sign(t, claims, key, jwt.SigningMethodES256, tc.header)
			if _, err := verify(serialized, fixtureIssuer, "authenticated", fixtureJWKS(t, fixtureJWK(key)), now); err == nil {
				t.Fatal("invalid context accepted")
			}
		})
	}
}

func TestVCPRejectForgedMalformedAndDuplicateTokens(t *testing.T) {
	now := time.Unix(2000000000, 0)
	key := fixtureKey(t)
	other := fixtureKey(t)
	claims := fixtureClaims(now)
	payload, _ := json.Marshal(claims)
	header := []byte(`{"alg":"ES256","kid":"local-test-key","typ":"JWT"}`)
	valid := sign(t, claims, key, jwt.SigningMethodES256, nil)
	parts := strings.Split(valid, ".")
	tampered := strings.Replace(string(payload), fixtureSubject, fixtureSession, 1)
	duplicatePayload := append(append([]byte{}, payload[:len(payload)-1]...), []byte(`,"iss":"`+fixtureIssuer+`"}`)...)
	for name, serialized := range map[string]string{
		"VCP-N30-forged-signature": sign(t, claims, other, jwt.SigningMethodES256, nil),
		"VCP-N31-tampered-payload": parts[0] + "." + base64.RawURLEncoding.EncodeToString([]byte(tampered)) + "." + parts[2],
		"VCP-N32-duplicate-header": signRaw(t, []byte(`{"alg":"ES256","alg":"ES256","kid":"local-test-key"}`), payload, key),
		"VCP-N33-duplicate-claims": signRaw(t, header, duplicatePayload, key),
		"VCP-N34-bad-encoding":     "@.@.@",
		"VCP-N35-missing-segment":  "a.b",
		"VCP-N36-oversize":         strings.Repeat("x", maxToken+1),
	} {
		t.Run(name, func(t *testing.T) {
			if _, err := verify(serialized, fixtureIssuer, "authenticated", fixtureJWKS(t, fixtureJWK(key)), now); err == nil {
				t.Fatal("forged or malformed fixture accepted")
			}
		})
	}
}

func TestVCPRejectUntrustedJWKSets(t *testing.T) {
	key := fixtureKey(t)
	now := time.Unix(2000000000, 0)
	valid := sign(t, fixtureClaims(now), key, jwt.SigningMethodES256, nil)
	for _, tc := range []struct {
		id     string
		change func(map[string]any)
	}{
		{"VCP-N37-wrong-key-algorithm", func(k map[string]any) { k["alg"] = "HS256" }},
		{"VCP-N38-symmetric-key", func(k map[string]any) { k["kty"] = "oct" }},
		{"VCP-N39-wrong-curve", func(k map[string]any) { k["crv"] = "P-384" }},
		{"VCP-N40-private-material", func(k map[string]any) { k["d"] = "local-sensitive-marker" }},
		{"VCP-N41-key-use", func(k map[string]any) { k["use"] = "enc" }},
		{"VCP-N42-sign-operation", func(k map[string]any) { k["key_ops"] = []string{"sign"} }},
		{"VCP-N43-nonboolean-ext", func(k map[string]any) { k["ext"] = "true" }},
		{"VCP-N44-invalid-point", func(k map[string]any) { k["x"] = strings.Repeat("A", 43); k["y"] = strings.Repeat("A", 43) }},
	} {
		t.Run(tc.id, func(t *testing.T) {
			entry := fixtureJWK(key)
			tc.change(entry)
			if _, err := verify(valid, fixtureIssuer, "authenticated", fixtureJWKS(t, entry), now); err == nil {
				t.Fatal("incompatible JWK accepted")
			}
		})
	}
	for name, raw := range map[string][]byte{
		"VCP-N45-empty-set":     []byte(`{"keys":[]}`),
		"VCP-N46-duplicate-kid": fixtureJWKS(t, fixtureJWK(key), fixtureJWK(key)),
		"VCP-N47-oversize-set":  []byte(strings.Repeat("x", maxJWKS+1)),
		"VCP-N48-invalid-json":  []byte(`{"keys":`),
	} {
		t.Run(name, func(t *testing.T) {
			if _, err := verify(valid, fixtureIssuer, "authenticated", raw, now); err == nil {
				t.Fatal("unusable JWK set accepted")
			}
		})
	}
}

func TestVCPClockBoundaries(t *testing.T) {
	now := time.Unix(2000000000, 0)
	key := fixtureKey(t)
	claims := fixtureClaims(now)
	claims["exp"] = now.Unix() + 60
	serialized := sign(t, claims, key, jwt.SigningMethodES256, nil)
	for _, tc := range []struct {
		name string
		at   time.Time
		pass bool
	}{
		{"VCP-P03-inside-expiry-skew", now.Add(89 * time.Second), true},
		{"VCP-N49-expiry-equality", now.Add(90 * time.Second), false},
		{"VCP-N50-after-expiry-skew", now.Add(91 * time.Second), false},
	} {
		t.Run(tc.name, func(t *testing.T) {
			_, err := verify(serialized, fixtureIssuer, "authenticated", fixtureJWKS(t, fixtureJWK(key)), tc.at)
			if (err == nil) != tc.pass {
				t.Fatal("expiry boundary disagrees with checkpoint policy")
			}
		})
	}
}

func TestVCPCliFailureDoesNotEchoCredentials(t *testing.T) {
	for name, input := range map[string]string{
		"VCP-N51-malformed-input": `{"token":"local-sensitive-marker",`,
		"VCP-N52-oversize-input":  strings.Repeat("local-sensitive-marker", 10000),
		"VCP-N53-invalid-token":   `{"token":"local-sensitive-marker","jwks":{"keys":[]}}`,
	} {
		t.Run(name, func(t *testing.T) {
			var output bytes.Buffer
			if run(strings.NewReader(input), &output, fixtureIssuer, "authenticated") == 0 || strings.Contains(output.String(), "local-sensitive-marker") {
				t.Fatal("CLI accepted bad input or exposed sensitive marker")
			}
			var result map[string]string
			if json.Unmarshal(output.Bytes(), &result) != nil || result["status"] != "FAIL" {
				t.Fatal("CLI failure is not a redacted structured result")
			}
		})
	}
}
