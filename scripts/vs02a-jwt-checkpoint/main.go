// Command vs02a-jwt-checkpoint is an operator-only, offline JWT proof tool.
// It has no HTTP server, database adapter, account provisioning or application imports.
package main

import (
	"bytes"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"flag"
	"io"
	"math/big"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const maxToken = 8192
const maxJWKS = 65536
const skew = 30 * time.Second
const maxLifetime = 3600

var issuerPattern = regexp.MustCompile(`^https://[a-z0-9]{20}\.supabase\.co/auth/v1$`)
var uuidPattern = regexp.MustCompile(`^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`)

type checkError string

func (e checkError) Error() string { return string(e) }

type userClaims struct {
	jwt.RegisteredClaims
	SessionID   string `json:"session_id"`
	Role        string `json:"role"`
	IsAnonymous *bool  `json:"is_anonymous"`
}

// proof deliberately contains no JWT, email, raw subject/session/kid or key material.
type proof struct {
	Status           string `json:"status"`
	IssuerSHA256     string `json:"issuer_sha256"`
	Audience         string `json:"audience"`
	SubjectSHA256    string `json:"subject_sha256"`
	SessionSHA256    string `json:"session_id_sha256"`
	KidSHA256        string `json:"kid_sha256"`
	Algorithm        string `json:"algorithm"`
	IssuedAt         int64  `json:"issued_at_unix"`
	ExpiresAt        int64  `json:"expires_at_unix"`
	LifetimeSeconds  int64  `json:"issued_lifetime_seconds"`
	VerifiedAt       int64  `json:"verified_at_unix"`
	RemainingSeconds int64  `json:"remaining_until_exp_seconds"`
	SkewSeconds      int64  `json:"checkpoint_skew_seconds"`
}

func digest(value string) string {
	x := sha256.Sum256([]byte(value))
	return hex.EncodeToString(x[:])
}

// JSON syntax and duplicates are checked before decoding into typed claims.
// This is input validation; all signature mathematics belongs to the maintained library.
func jsonValue(decoder *json.Decoder, depth int) error {
	if depth > 16 {
		return checkError("json_depth")
	}
	token, err := decoder.Token()
	if err != nil {
		return checkError("invalid_json")
	}
	delim, nested := token.(json.Delim)
	if !nested {
		return nil
	}
	switch delim {
	case '{':
		seen := map[string]bool{}
		for decoder.More() {
			key, err := decoder.Token()
			if err != nil {
				return checkError("invalid_json")
			}
			name, ok := key.(string)
			if !ok || seen[name] {
				return checkError("duplicate_json_member")
			}
			seen[name] = true
			if err := jsonValue(decoder, depth+1); err != nil {
				return err
			}
		}
	case '[':
		for decoder.More() {
			if err := jsonValue(decoder, depth+1); err != nil {
				return err
			}
		}
	default:
		return checkError("invalid_json")
	}
	if _, err := decoder.Token(); err != nil {
		return checkError("invalid_json")
	}
	return nil
}

func object(raw []byte) (map[string]json.RawMessage, error) {
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.UseNumber()
	if err := jsonValue(decoder, 0); err != nil {
		return nil, err
	}
	if _, err := decoder.Token(); err != io.EOF {
		return nil, checkError("json_trailing_data")
	}
	var result map[string]json.RawMessage
	if json.Unmarshal(raw, &result) != nil || result == nil {
		return nil, checkError("json_object_required")
	}
	return result, nil
}

func publicKeys(raw []byte) (map[string]*ecdsa.PublicKey, error) {
	if len(raw) > maxJWKS {
		return nil, checkError("jwks_size")
	}
	root, err := object(raw)
	if err != nil || len(root) != 1 {
		return nil, checkError("jwks_shape")
	}
	var entries []json.RawMessage
	if json.Unmarshal(root["keys"], &entries) != nil || len(entries) < 1 || len(entries) > 8 {
		return nil, checkError("jwks_key_count")
	}
	result := map[string]*ecdsa.PublicKey{}
	for _, entry := range entries {
		fields, err := object(entry)
		if err != nil {
			return nil, checkError("jwk_shape")
		}
		allowed := map[string]bool{"kty": true, "kid": true, "crv": true, "alg": true, "use": true, "key_ops": true, "ext": true, "x": true, "y": true}
		for name := range fields {
			if !allowed[name] {
				return nil, checkError("jwk_unreviewed_field")
			}
		}
		var key struct {
			Kty string `json:"kty"`
			Kid string `json:"kid"`
			Crv string `json:"crv"`
			X   string `json:"x"`
			Y   string `json:"y"`
		}
		if json.Unmarshal(entry, &key) != nil || key.Kty != "EC" || key.Crv != "P-256" || len(key.Kid) < 1 || len(key.Kid) > 128 {
			return nil, checkError("jwk_type")
		}
		for _, char := range key.Kid {
			if char < 33 || char > 126 {
				return nil, checkError("jwk_kid")
			}
		}
		for name, expected := range map[string]string{"alg": "ES256", "use": "sig"} {
			if value, present := fields[name]; present {
				var actual string
				if json.Unmarshal(value, &actual) != nil || actual != expected {
					return nil, checkError("jwk_metadata")
				}
			}
		}
		if value, present := fields["key_ops"]; present {
			var ops []string
			if json.Unmarshal(value, &ops) != nil || len(ops) != 1 || ops[0] != "verify" {
				return nil, checkError("jwk_operations")
			}
		}
		if value, present := fields["ext"]; present && string(value) != "true" && string(value) != "false" {
			return nil, checkError("jwk_extractability")
		}
		x, ex := base64.RawURLEncoding.Strict().DecodeString(key.X)
		y, ey := base64.RawURLEncoding.Strict().DecodeString(key.Y)
		if ex != nil || ey != nil || len(x) != 32 || len(y) != 32 || result[key.Kid] != nil {
			return nil, checkError("jwk_coordinates_or_duplicate")
		}
		point := &ecdsa.PublicKey{Curve: elliptic.P256(), X: new(big.Int).SetBytes(x), Y: new(big.Int).SetBytes(y)}
		if !point.Curve.IsOnCurve(point.X, point.Y) {
			return nil, checkError("jwk_point")
		}
		result[key.Kid] = point
	}
	return result, nil
}

func integer(fields map[string]json.RawMessage, name string) (int64, error) {
	value, exists := fields[name]
	if !exists {
		return 0, checkError("required_time")
	}
	number, err := strconv.ParseInt(string(value), 10, 64)
	if err != nil || number <= 0 {
		return 0, checkError("integral_time_required")
	}
	return number, nil
}

func verify(serialized, issuer, audience string, jwks []byte, now time.Time) (*proof, error) {
	if !issuerPattern.MatchString(issuer) || audience != "authenticated" {
		return nil, checkError("invalid_trust_config")
	}
	if len(serialized) > maxToken {
		return nil, checkError("token_size")
	}
	parts := strings.Split(serialized, ".")
	if len(parts) != 3 {
		return nil, checkError("compact_jwt_required")
	}
	headerRaw, err := base64.RawURLEncoding.Strict().DecodeString(parts[0])
	if err != nil {
		return nil, checkError("header_encoding")
	}
	header, err := object(headerRaw)
	if err != nil {
		return nil, checkError("header_json")
	}
	for name := range header {
		if name != "alg" && name != "kid" && name != "typ" {
			return nil, checkError("unsupported_header")
		}
	}
	var alg, kid, typ string
	if json.Unmarshal(header["alg"], &alg) != nil || alg != "ES256" || json.Unmarshal(header["kid"], &kid) != nil || len(kid) < 1 || len(kid) > 128 {
		return nil, checkError("header_context")
	}
	if value, present := header["typ"]; present && (json.Unmarshal(value, &typ) != nil || typ != "JWT") {
		return nil, checkError("header_type")
	}
	payload, err := base64.RawURLEncoding.Strict().DecodeString(parts[1])
	if err != nil {
		return nil, checkError("payload_encoding")
	}
	fields, err := object(payload)
	if err != nil {
		return nil, checkError("payload_json")
	}
	if value, present := fields["is_anonymous"]; present && string(value) != "false" {
		return nil, checkError("anonymous_context")
	}
	iat, ei := integer(fields, "iat")
	exp, ee := integer(fields, "exp")
	if ei != nil || ee != nil || exp <= iat || exp-iat > maxLifetime {
		return nil, checkError("issued_lifetime")
	}
	if _, exists := fields["nbf"]; exists {
		nbf, err := integer(fields, "nbf")
		if err != nil || nbf >= exp {
			return nil, checkError("not_before_shape")
		}
	}
	keys, err := publicKeys(jwks)
	if err != nil {
		return nil, err
	}
	key := keys[kid]
	if key == nil {
		return nil, checkError("unknown_kid")
	}
	claims := &userClaims{}
	token, err := jwt.ParseWithClaims(serialized, claims, func(t *jwt.Token) (any, error) {
		if t.Method != jwt.SigningMethodES256 {
			return nil, checkError("algorithm")
		}
		return key, nil
	}, jwt.WithValidMethods([]string{"ES256"}), jwt.WithIssuer(issuer), jwt.WithAudience(audience), jwt.WithExpirationRequired(), jwt.WithIssuedAt(), jwt.WithLeeway(skew), jwt.WithStrictDecoding(), jwt.WithTimeFunc(func() time.Time { return now }))
	if err != nil || token == nil || !token.Valid {
		return nil, checkError("signature_or_claim_validation")
	}
	if len(claims.Audience) != 1 || claims.Audience[0] != audience || !uuidPattern.MatchString(claims.Subject) || !uuidPattern.MatchString(claims.SessionID) || claims.Role != "authenticated" || claims.IsAnonymous != nil && *claims.IsAnonymous {
		return nil, checkError("user_context")
	}
	return &proof{Status: "PASS", IssuerSHA256: digest(claims.Issuer), Audience: claims.Audience[0], SubjectSHA256: digest(claims.Subject), SessionSHA256: digest(claims.SessionID), KidSHA256: digest(kid), Algorithm: alg, IssuedAt: iat, ExpiresAt: exp, LifetimeSeconds: exp - iat, VerifiedAt: now.Unix(), RemainingSeconds: exp - now.Unix(), SkewSeconds: int64(skew / time.Second)}, nil
}

func run(input io.Reader, output io.Writer, issuer, audience string) int {
	raw, err := io.ReadAll(io.LimitReader(input, 131073))
	if err != nil || len(raw) > 131072 {
		_ = json.NewEncoder(output).Encode(map[string]string{"status": "FAIL", "reason": "input_size"})
		return 1
	}
	var request struct {
		Token string          `json:"token"`
		JWKS  json.RawMessage `json:"jwks"`
	}
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	err = decoder.Decode(&request)
	if err == nil {
		_, err = object(raw)
	}
	if err != nil {
		_ = json.NewEncoder(output).Encode(map[string]string{"status": "FAIL", "reason": "input_json"})
		return 1
	}
	result, err := verify(request.Token, issuer, audience, request.JWKS, time.Now().UTC())
	if err != nil {
		code := "verification_failed"
		var safe checkError
		if errors.As(err, &safe) {
			code = string(safe)
		}
		_ = json.NewEncoder(output).Encode(map[string]string{"status": "FAIL", "reason": code})
		return 1
	}
	_ = json.NewEncoder(output).Encode(result)
	return 0
}

func main() {
	issuer := flag.String("issuer", "", "Exact out-of-band trusted hosted issuer")
	audience := flag.String("audience", "authenticated", "Checkpoint expected audience")
	flag.Parse()
	os.Exit(run(os.Stdin, os.Stdout, *issuer, *audience))
}
