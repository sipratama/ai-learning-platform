#!/usr/bin/env bash
set -euo pipefail

while IFS= read -r -d '' path; do
  case "$path" in
    .env|*/.env|.env.*|*/.env.*)
      case "$path" in
        *.example) ;;
        *) echo 'Tracked local environment file detected.' >&2; exit 1 ;;
      esac
      ;;
    *.pem|*.key|*/id_rsa|*/id_ed25519)
      echo 'Tracked key material file detected.' >&2
      exit 1
      ;;
  esac
done < <(git ls-files -z --cached --others --exclude-standard)

while IFS= read -r -d '' path; do
  case "$path" in
    apps/*|.github/*)
      if [ -f "$path" ] && grep -I -q -E \
        -e '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----' \
        -e '(SUPABASE_SERVICE_ROLE_KEY|DATABASE_URL|API_SECRET)[[:space:]]*=[[:space:]]*[^[:space:]#]+' \
        -e 'ghp_[A-Za-z0-9]{36}' \
        "$path"; then
        echo 'Obvious secret material detected in application or CI files.' >&2
        exit 1
      fi
      ;;
  esac
done < <(git ls-files -z --cached --others --exclude-standard)
