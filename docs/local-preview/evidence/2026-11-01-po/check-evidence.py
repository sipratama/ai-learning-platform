"""Initial PO package checks; run at repo root before recording a new human run."""
from pathlib import Path
import datetime
import hashlib
import json
import re
import subprocess
import urllib.parse

root = Path.cwd()
out = root / 'docs/local-preview/evidence/2026-11-01-po'
base = '7ec5973be65fdefc0d09e29d9850ea48ca052961'
errors = []
paths = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', base], text=True).splitlines()
allowed = {'.github/workflows/ci.yml', 'apps/web/Dockerfile.local', 'docs/local-preview/README.md'}
changed = []
for rel in paths:
    original = subprocess.check_output(['git', 'show', base + ':' + rel])
    current = (root / rel).read_bytes() if (root / rel).is_file() else None
    if original != current:
        changed.append(rel)
        if rel not in allowed:
            errors.append('Unrelated existing change: ' + rel)
        if rel == 'docs/local-preview/README.md' and not current.startswith(original):
            errors.append('Historical runbook bytes overwritten')
workflow = (root / '.github/workflows/ci.yml').read_text()
start, end = workflow.find('  local-docker-preview:\n'), workflow.find('  secret-baseline:\n')
if start < 0 or end < start or (workflow[:start] + workflow[end:]).encode() != subprocess.check_output(['git', 'show', base + ':.github/workflows/ci.yml']):
    errors.append('Existing CI changed beyond added Docker regression job')
manual = json.loads((root / 'docs/local-preview/manual-test-results.json').read_text())
if [x['test_id'] for x in manual['cases']] != [f'MT-{i:02}' for i in range(1, 9)]:
    errors.append('Manual roster incomplete')
if manual['overall_manual_acceptance'] != 'NOT RUN' or manual['tester'] is not None or manual['po_decision'] is not None or manual['auth_bundle_1_authorized']:
    errors.append('Unprovided manual/PO authority inferred')
if any(x['status'] != 'NOT RUN' or x['actual_result'] != 'NOT RUN' or x['evidence'] for x in manual['cases']):
    errors.append('Manual result filled by preparer')
containers = json.loads((out / 'container-verification.json').read_text())['containers']
if {x['service'] for x in containers} != {'api', 'web'}:
    errors.append('Unexpected preview services')
for c in containers:
    if (c['status'] != 'running' or c['health'] != 'healthy' or not c['platform_manifest_matches_built_tag']
            or not c['read_only'] or c['privileged'] or c['secret_environment_key_detected']
            or c['user'] not in ('101:101', '10001:10001')):
        errors.append('Container boundary/health mismatch: ' + c['service'])
    for bindings in (c['host_ports'] or {}).values():
        if bindings and any(b['HostIp'] != '127.0.0.1' or b['HostPort'] != '8088' for b in bindings):
            errors.append('Unexpected host exposure: ' + c['service'])
for record in json.loads((out / 'commands.json').read_text()):
    if record['exit_code'] or record['status'] != 'PASS':
        errors.append('Host regression failure: ' + record['id'])
    if not (out / record['retained_log']).is_file():
        errors.append('Missing host log: ' + record['id'])
if json.loads((out / 'compose-up-fixed.json').read_text())['exit_code']:
    errors.append('Final Compose build/start failed')
if json.loads((out / 'native-guard-negative.json').read_text())['actual_exit_code'] == 0:
    errors.append('Missing-native regression unexpectedly accepted')
summary = json.loads((out / 'automated-test-summary.json').read_text())
if summary['automatic_docker_cases_passed'] != 8 or summary['unexpected_docker_cases']:
    errors.append('Actual Docker suite incomplete')
if summary['normal_flow_observation_status'] != 'PASS' or summary['console_or_page_errors'] or summary['external_origins']:
    errors.append('Normal browser observation failed')
if any(x['status'] != 'PASS' for x in json.loads((out / 'http-verification.json').read_text())['checks']):
    errors.append('HTTP verification failed')
if summary['full_npm_audit']['total'] or summary['production_npm_audit']['total']:
    errors.append('Current dependency audit nonzero')
if json.loads((out / 'runtime-secret-scan.json').read_text())['status'] != 'PASS':
    errors.append('Runtime static asset secret scan failed')
for rel, want in json.loads((out / 'runtime-source-manifest.json').read_text())['files_sha256'].items():
    if hashlib.sha256((root / rel).read_bytes()).hexdigest() != want:
        errors.append('Executed source changed: ' + rel)
manifest = json.loads((out / 'artifacts.json').read_text())['files_sha256']
for rel, want in manifest.items():
    if hashlib.sha256((root / rel).read_bytes()).hexdigest() != want:
        errors.append('Artifact digest mismatch: ' + rel)
links = 0
for p in [root / 'docs/local-preview' / name for name in ['README.md', 'PO-TESTING-ID.md', 'PO-MANUAL-TEST-PLAN.md', '2026-11-01-docker-manual-acceptance-verification.md']]:
    for _, destination in re.findall(r'\[([^\]]+)\]\(([^)]+)\)', p.read_text()):
        if destination.startswith(('https://', 'http://')):
            continue
        target = (p.parent / urllib.parse.unquote(urllib.parse.urlsplit(destination).path)).resolve()
        if not target.is_file():
            errors.append('Missing documentation link: ' + destination)
        links += 1
allpaths = subprocess.check_output(['git', 'ls-files', '-z', '--cached', '--others', '--exclude-standard']).decode().split('\0')
secret = re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{36}|sb_secret_[A-Za-z0-9_-]{16,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|(?:postgres(?:ql)?://)[^\s<>]+:[^\s<>]+@')
for rel in allpaths:
    if not rel or not (root / rel).is_file():
        continue
    if rel not in paths and not rel.startswith('docs/local-preview/'):
        errors.append('Unexpected new scope: ' + rel)
    try:
        text = (root / rel).read_text()
    except UnicodeError:
        continue
    if secret.search(text):
        errors.append('Secret-shaped material: ' + rel)
    if rel not in paths:
        result = subprocess.run(['git', 'diff', '--no-index', '--check', '/dev/null', rel], capture_output=True)
        if result.stdout or result.stderr or result.returncode not in (0, 1):
            errors.append('New-file whitespace: ' + rel)
r = subprocess.run(['bash', 'scripts/check-secrets.sh'], capture_output=True)
if r.returncode:
    errors.append('Secret baseline failed')
result = {'source_base_sha': base, 'fix_sha': 'e5b09f5a0fa7e775c2e0f530c27d4a51df09d4e3',
          'checked_at_host_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'baseline_files': len(paths), 'unchanged_baseline_files': len(paths) - len(changed),
          'allowed_existing_changes': changed, 'relative_links': links, 'artifact_digests_checked': len(manifest),
          'manual_tests_not_run': len(manual['cases']), 'docker_browser_tests_passed': summary['automatic_docker_cases_passed'],
          'secret_baseline_exit': r.returncode, 'errors': errors, 'status': 'FAIL' if errors else 'PASS'}
(out / 'preparation-checks.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
raise SystemExit(bool(errors))
