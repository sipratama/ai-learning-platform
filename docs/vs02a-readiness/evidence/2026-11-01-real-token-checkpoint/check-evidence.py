from pathlib import Path
import collections,hashlib,json,re,subprocess,urllib.parse
root=Path.cwd(); pkg=root/'docs/vs02a-readiness'; docs=sorted(pkg.glob('*.md'))
errors=[]; links=0; external=set()
def anchors(p):
 seen=collections.Counter();out=set()
 for line in p.read_text().splitlines():
  m=re.match(r'^#{1,6}\s+(.+?)\s*#*$',line)
  if not m:continue
  s=re.sub(r'[`*_~]','',m[1]).lower();s=re.sub(r'[^\w\- ]','',s).replace(' ','-')
  n=seen[s];seen[s]+=1;out.add(s+(f'-{n}' if n else ''))
 return out
owners={}
for names,p in [(['D','Q','G3','FA','AG','GOV-AI'],'DP-01/03-decision-registry.md'),(['GAP','EG'],'DP-01/04-open-decisions-register.md'),(['RULE'],'DP-02/02-domain-rules-and-invariants.md'),(['AC'],'DP-02/05-acceptance-criteria.md'),(['UX'],'DP-02/04-ux-and-interaction-specification.md'),(['JRN','PERM'],'DP-02/03-user-journeys-and-permissions.md'),(['ADR'],'DP-03/06-architecture-decisions-and-traceability.md'),(['MOD'],'DP-03/02-module-boundaries-and-dependencies.md'),(['ENT'],'DP-03/03-logical-data-model.md'),(['TX'],'DP-03/05-consistency-and-transaction-design.md'),(['API','API-C'],'DP-04/01-api-contract-and-resource-design.md'),(['SEC'],'DP-04/02-authentication-authorization-and-security.md'),(['FT'],'DP-05/02-functional-integration-and-e2e-verification.md'),(['ST'],'DP-05/03-security-privacy-and-abuse-verification.md'),(['QUAL'],'DP-06/05-implementation-readiness-and-quality-gates.md'),(['DEL'],'DP-06/04-secure-delivery-and-change-management.md'),(['EXEC','HAND'],'DP-06/06-execution-traceability-and-handoff-register.md'),(['DR','DD'],'DP-06/03-vertical-slice-backlog-and-acceptance-contracts.md')]:
 for name in names:owners[name]=(root/'docs'/p).read_text()
pattern=re.compile(r'\b('+ '|'.join(sorted(owners,key=len,reverse=True)) +r')-(\d{2,3})\b')
refs=set();localrefs=set();localdefs=[]
alltext='\n'.join(p.read_text() for p in docs)
for p in docs:
 s=p.read_text()
 for label,url in re.findall(r'\[([^\]]+)\]\(([^)]+)\)',s):
  if url.startswith(('http://','https://')):external.add(url);continue
  links+=1;uri=urllib.parse.urlsplit(url);q=(p.parent/urllib.parse.unquote(uri.path)).resolve() if uri.path else p
  if not q.is_file():errors.append(f'{p.name}: missing link {url}')
  elif uri.fragment and q.suffix=='.md' and urllib.parse.unquote(uri.fragment) not in anchors(q):errors.append(f'{p.name}: missing anchor {url}')
 for m in pattern.finditer(s):
  name,num=m.groups();refs.add((name,num))
  tail=s[m.end():];end=re.match(r'[–-](?:'+re.escape(name)+r'-)?(\d{2,3})\b',tail)
  if end:
   for n in range(int(num)+1,int(end[1])+1):refs.add((name,str(n).zfill(len(num))))
 localrefs.update(re.findall(r'\bVSA-[TO]\d{2}\b',s))
 localdefs.extend(re.findall(r'^\|\s*(?:\*\*)?(VSA-[TO]\d{2})\b',s,re.M))
 # Include both fully qualified and abbreviated package ranges.
 for m in re.finditer(r'VSA-([TO])(\d{2})[–-](?:VSA-)?(?:[TO])?(\d{2})\b',s):
  kind,start,end=m.groups()
  localrefs.update(f'VSA-{kind}{n:02}' for n in range(int(start),int(end)+1))
for name,num in refs:
 if not re.search(r'\b'+re.escape(name+'-'+num)+r'\b',owners[name]):errors.append('Unknown canonical owner reference: '+name+'-'+num)
for ref in localrefs:
 if ref not in localdefs:errors.append('Undefined local reference: '+ref)
for ref,n in collections.Counter(localdefs).items():
 if n!=1:errors.append(f'Local definition count {ref}: {n}')
for expected in ['FT-005','FT-020',*[f'ST-{n:03}' for n in range(1,7)],'API-006','DR-001','DD-001','QUAL-002','GOV-AI-001']:
 if expected not in alltext:errors.append('Required source reference absent: '+expected)

base_sha='8ebcffb8903899714326946ce443d4e2c76772ac'
paths=subprocess.check_output(['git','ls-tree','-r','--name-only',base_sha],text=True).splitlines()
allowed=['.github/workflows/ci.yml','docs/vs02a-readiness/09-hosted-supabase-es256-synthetic-setup-and-verification-runbook.md']
changed=[]
for rel in paths:
 original=subprocess.check_output(['git','show',base_sha+':'+rel])
 current=(root/rel).read_bytes() if (root/rel).is_file() else None
 if current!=original:
  changed.append(rel)
  if rel not in allowed:errors.append('Unexpected baseline change: '+rel)
  elif rel.startswith('docs/') and not current.startswith(original):errors.append('Historical runbook overwritten')
allpaths=[p for p in subprocess.check_output(['git','ls-files','-z','--cached','--others','--exclude-standard']).decode().split('\0') if p and (root/p).is_file()]
secret=re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{36}|sb_secret_[A-Za-z0-9_-]{16,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|(?:postgres(?:ql)?://)[^\s<>]+:[^\s<>]+@')
for rel in allpaths:
 try:content=(root/rel).read_text()
 except UnicodeError:continue
 if secret.search(content):errors.append('Secret-shaped material: '+rel)
 if rel not in paths and not rel.startswith(('docs/vs02a-readiness/','scripts/vs02a-jwt-checkpoint/','scripts/vs02a_checkpoint_operator.py','scripts/test_vs02a_checkpoint_operator.py')):errors.append('Unexpected new file: '+rel)
res=subprocess.run(['bash','scripts/check-secrets.sh'],capture_output=True,text=True)
if res.returncode:errors.append('Existing secret guard failed')
res2=subprocess.run(['git','diff','--check'],capture_output=True,text=True)
if res2.returncode:errors.append('Tracked whitespace check failed')
output=root/'docs/vs02a-readiness/evidence/2026-11-01-real-token-checkpoint'
artifact=json.loads((output/'artifacts.json').read_text())
for rel,expected in artifact['files_sha256'].items():
 p=root/rel
 if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest()!=expected:errors.append('Artifact digest mismatch: '+rel)
live=json.loads((output/'live-verification.json').read_text())
created=json.loads((output/'provision.json').read_text())
if live.get('status')!='PASS' or len(live['users'])!=3 or not live.get('credential_ledger_removed'):errors.append('Live proof completeness')
if [u['alias'] for u in live['users']]!=['A','B','C']:errors.append('Live roster mismatch')
for user,creation in zip(live['users'],created['users']):
 proof=user['proof']; replay=user['offline_replay_after_logout']
 if (user['status']!='PASS' or user['local_logout_http_status']!=204 or user['live_session_before_logout'] is not True or user['live_session_after_logout'] is not False or proof['subject_sha256']!=creation['subject_sha256'] or proof['issued_lifetime_seconds']!=3600 or proof['algorithm']!='ES256' or proof['audience']!='authenticated' or replay['status']!='PASS' or replay['expires_at_unix']!=proof['expires_at_unix']):errors.append('Incoherent live evidence: '+user['alias'])
 if any(replay[x]!=proof[x] for x in ['issuer_sha256','subject_sha256','session_id_sha256','kid_sha256','issued_at_unix']):errors.append('Replay context differs: '+user['alias'])
stream=[json.loads(line) for line in (output/'local-go-race.jsonl').read_text().splitlines() if line]
negative=[x['Test'] for x in stream if x.get('Action')=='pass' and re.search(r'/VCP-N\d{2}-',x.get('Test',''))]
if len(negative)!=53:errors.append('Expected 53 negative subcases, actual '+str(len(negative)))
result={'source_base_sha':base_sha,'tooling_source_sha':artifact['tooling_source_sha'],'docs':len(docs),'relative_links_and_fragments':links,'canonical_ids_including_ranges':len(refs),'local_test_definitions':sum(x.startswith('VSA-T') for x in localdefs),'local_open_item_definitions':sum(x.startswith('VSA-O') for x in localdefs),'baseline_tracked_files':len(paths),'unchanged_baseline_files':len(paths)-len(changed),'allowed_baseline_changes':changed,'scanned_files':len(allpaths),'secret_pattern_scan':'PASS' if not any('Secret' in e for e in errors) else 'FAIL','secret_baseline_exit':res.returncode,'artifact_digests_checked':len(artifact['files_sha256']),'negative_subcases_passed':len(negative),'errors':errors,'status':'PASS' if not errors else 'FAIL'}
import datetime
result['checked_at_utc']=datetime.datetime.now(datetime.timezone.utc).isoformat()
(output/'preparation-checks.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
raise SystemExit(bool(errors))
