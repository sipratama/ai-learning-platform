"""Run from repository root; writes only this maintenance evidence's check result."""
from pathlib import Path
import datetime
import hashlib
import json
import re
import subprocess

root = Path.cwd()
folder = root / 'docs/tooling/evidence/2026-11-01-minimatch'
base = '91080f45e1aba38316eeecca6eeba3f618bd7f3a'
errors = []
tracked = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', base], text=True).splitlines()
allowed = {'.github/workflows/ci.yml', 'apps/web/package.json', 'apps/web/package-lock.json'}
changed = []
for rel in tracked:
    original = subprocess.check_output(['git', 'show', base + ':' + rel])
    if not (root / rel).is_file() or (root / rel).read_bytes() != original:
        changed.append(rel)
        if rel not in allowed:
            errors.append('Unrelated baseline change: ' + rel)

old = json.loads(subprocess.check_output(['git', 'show', base + ':apps/web/package.json']))
new = json.loads((root / 'apps/web/package.json').read_text())
expected = {'eslint@10.14.0': {'minimatch': '11.0.3'},
            '@eslint/config-array@0.23.5': {'minimatch': '11.0.3'},
            '@typescript-eslint/typescript-estree@8.72.1': {'minimatch': '11.0.3'}}
if new.get('overrides') != expected:
    errors.append('Override scope/version changed')
new_without_additions = json.loads(json.dumps(new))
new_without_additions.pop('overrides', None)
new_without_additions['scripts'].pop('test:tooling', None)
if new_without_additions != old:
    errors.append('Unrelated package manifest change')
old_lock = json.loads(subprocess.check_output(['git', 'show', base + ':apps/web/package-lock.json']))
new_lock = json.loads((root / 'apps/web/package-lock.json').read_text())
a, b = old_lock['packages'], new_lock['packages']
lock_changes = {p for p in set(a) | set(b) if a.get(p) != b.get(p)}
if lock_changes != {'node_modules/minimatch', 'node_modules/@isaacs/nonrecursive-glob-match'}:
    errors.append('Unexpected lockfile node/metadata changes')
if any(b[p].get('dev') is not True for p in lock_changes):
    errors.append('Changed dependency outside development graph')
workflow = (root / '.github/workflows/ci.yml').read_text()
workflow = workflow.replace('      - name: Audit tooling and production dependencies\n        run: |\n          npm audit\n          npm audit --omit=dev\n', '')
workflow = workflow.replace('      - name: Tooling compatibility and lint coverage\n        run: npm run test:tooling\n', '')
if workflow.encode() != subprocess.check_output(['git', 'show', base + ':.github/workflows/ci.yml']):
    errors.append('Existing CI changed beyond added validation')

before = json.loads((folder / 'compatibility-before.json').read_text())
after = json.loads((folder / 'compatibility-after.json').read_text())
if before['behavior'] != after['behavior'] or before['behavior_sha256'] != after['behavior_sha256']:
    errors.append('Compatibility behavior differs')
if len(before['behavior']['lintFiles']) != 30:
    errors.append('Unexpected original lint coverage')
if any(x['minimatch'] != '11.0.3' for x in after['resolution']):
    errors.append('Unexpected after resolution')
for name, total in [('baseline-audit.json', 11), ('after-audit.json', 0),
                    ('baseline-audit-production.json', 0), ('after-audit-production.json', 0)]:
    if json.loads((folder / name).read_text())['metadata']['vulnerabilities']['total'] != total:
        errors.append('Audit total mismatch: ' + name)
commands = json.loads((folder / 'commands.json').read_text())
for command in commands:
    expected_exit = 1 if command['id'] == 'baseline-audit' else 0
    if command['exit_code'] != expected_exit:
        errors.append('Command failure: ' + command['id'])
    if not (folder / command['retained_log']).is_file():
        errors.append('Missing command log: ' + command['id'])
for rel, want in json.loads((folder / 'validation-source-manifest.json').read_text())['files_sha256'].items():
    if hashlib.sha256((root / rel).read_bytes()).hexdigest() != want:
        errors.append('Validation input changed: ' + rel)
manifest = json.loads((folder / 'artifacts.json').read_text())['files_sha256']
for rel, want in manifest.items():
    if hashlib.sha256((root / rel).read_bytes()).hexdigest() != want:
        errors.append('Artifact digest mismatch: ' + rel)

paths = subprocess.check_output(['git', 'ls-files', '-z', '--cached', '--others', '--exclude-standard']).decode().split('\0')
secret = re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{36}|sb_secret_[A-Za-z0-9_-]{16,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|(?:postgres(?:ql)?://)[^\s<>]+:[^\s<>]+@')
for rel in paths:
    if not rel or not (root / rel).is_file():
        continue
    if rel not in tracked and rel != 'scripts/check-minimatch-tooling.mjs' and not rel.startswith('docs/tooling/'):
        errors.append('Unrelated new file: ' + rel)
    try:
        text = (root / rel).read_text()
    except UnicodeError:
        continue
    if secret.search(text):
        errors.append('Secret-shaped material: ' + rel)
    if rel not in tracked:
        check = subprocess.run(['git', 'diff', '--no-index', '--check', '/dev/null', rel], capture_output=True)
        if check.stdout or check.stderr or check.returncode not in (0, 1):
            errors.append('New-file whitespace: ' + rel)
for label, destination in re.findall(r'\[([^\]]+)\]\(([^)]+)\)', (root / 'docs/tooling/2026-11-01-minimatch-remediation.md').read_text()):
    if not destination.startswith(('https://', 'http://')) and not (root / 'docs/tooling' / destination).resolve().is_file():
        errors.append('Missing documentation target: ' + destination)
secret_check = subprocess.run(['bash', 'scripts/check-secrets.sh'], capture_output=True)
if secret_check.returncode:
    errors.append('Secret baseline failed')
result = {'base_sha': base, 'implementation_sha': '7eccd9a2c9144ca5aa4dedc5c229628cf2668d92',
          'checked_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'baseline_files': len(tracked), 'unchanged_baseline_files': len(tracked) - len(changed),
          'allowed_baseline_changes': changed, 'lock_nodes_changed': sorted(lock_changes),
          'existing_ci_preserved': True if 'Existing CI changed beyond added validation' not in errors else False,
          'lint_files_before_after': len(before['behavior']['lintFiles']),
          'artifact_digests_checked': len(manifest), 'secret_baseline_exit': secret_check.returncode,
          'errors': errors, 'status': 'PASS' if not errors else 'FAIL'}
(folder / 'scope-and-evidence-checks.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
raise SystemExit(bool(errors))
