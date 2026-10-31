#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../apps/api"
go_bin="${GO_BIN:-go}"
temporary_dir="$(mktemp -d)"
trap 'rm -rf "$temporary_dir"' EXIT

"$go_bin" list -deps ./cmd/api >"$temporary_dir/standard-deps"
"$go_bin" list -tags devfixture -deps ./cmd/api >"$temporary_dir/development-deps"
if grep -q '/internal/devfixture' "$temporary_dir/standard-deps"; then
  echo 'Standard API artifact includes the development fixture package.' >&2
  exit 1
fi
if ! grep -q '/internal/devfixture' "$temporary_dir/development-deps"; then
  echo 'Development build does not include the fixture package.' >&2
  exit 1
fi

"$go_bin" build -o "$temporary_dir/api-standard" ./cmd/api
"$go_bin" build -tags devfixture -o "$temporary_dir/api-development" ./cmd/api

marker='synthetic-private-answer-marker'
if LC_ALL=C grep -a -F -q "$marker" "$temporary_dir/api-standard"; then
  echo 'Private fixture marker appears in standard API artifact.' >&2
  exit 1
fi
if ! LC_ALL=C grep -a -F -q "$marker" "$temporary_dir/api-development"; then
  echo 'Development API artifact is missing its fixture marker.' >&2
  exit 1
fi

for public_marker in 'vs01a-guest-proof@1.0.0' 'Synthetic lesson diagram' 'Draft Flagship Revision'; do
  if LC_ALL=C grep -a -F -q "$public_marker" "$temporary_dir/api-standard"; then
    echo 'Fixture content appears in standard API artifact.' >&2
    exit 1
  fi
  if ! LC_ALL=C grep -a -F -q "$public_marker" "$temporary_dir/api-development"; then
    echo 'Development API artifact is missing expected fixture content.' >&2
    exit 1
  fi
done

for environment in staging production; do
  if APP_ENV="$environment" FIXTURE_MODE=disabled "$temporary_dir/api-development" >"$temporary_dir/startup.log" 2>&1; then
    echo 'Development artifact started in a forbidden environment.' >&2
    exit 1
  fi
  if APP_ENV="$environment" FIXTURE_MODE=vs01a "$temporary_dir/api-standard" >"$temporary_dir/startup.log" 2>&1; then
    echo 'Standard artifact accepted fixture mode in a forbidden environment.' >&2
    exit 1
  fi
done

echo 'Fixture build and startup boundaries verified.'
