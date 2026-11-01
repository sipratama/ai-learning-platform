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

base_sha='0b80442f8430753d21e187287ab705a95998dcd5'
output=root/'docs/vs02a-readiness/evidence/2026-11-01-decision-readiness'
tracked=subprocess.check_output(['git','ls-tree','-r','--name-only',base_sha],text=True).splitlines()
for rel in tracked:
 original=subprocess.check_output(['git','show',base_sha+':'+rel])
 if not (root/rel).is_file() or (root/rel).read_bytes()!=original:errors.append('Pre-existing bytes changed: '+rel)
allpaths=[p for p in subprocess.check_output(['git','ls-files','-z','--cached','--others','--exclude-standard']).decode().split('\0') if p and (root/p).is_file()]
secret=re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{36}|sb_secret_[A-Za-z0-9_-]{16,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|(?:postgres(?:ql)?://)[^\s<>]+:[^\s<>]+@')
for rel in allpaths:
 if rel not in tracked and not rel.startswith('docs/vs02a-readiness/'):errors.append('Unexpected scope: '+rel)
 try:content=(root/rel).read_text()
 except UnicodeError:continue
 if secret.search(content):errors.append('Secret-shaped material: '+rel)
 if rel not in tracked:
  r=subprocess.run(['git','diff','--no-index','--check','/dev/null',rel],capture_output=True,text=True)
  if r.stdout or r.stderr or r.returncode not in (0,1):errors.append('Whitespace: '+rel)
res=subprocess.run(['bash','scripts/check-secrets.sh'],capture_output=True,text=True)
if res.returncode:errors.append('Secret baseline failed')
digests=0; historical_script_checks=0
for mpath in sorted((pkg/'evidence').glob('*/artifacts.json')):
 manifest=json.loads(mpath.read_text())
 for rel,want in manifest.get('files',manifest.get('files_sha256',{})).items():
  if mpath.parent.name=='2026-11-01' and rel.startswith('scripts/'):
   raw=subprocess.check_output(['git','show','7164b7adda548b5ad0ea96f72e763a02d02e2af5:'+rel]);historical_script_checks+=1
  else:raw=(root/rel).read_bytes()
  if hashlib.sha256(raw).hexdigest()!=want:errors.append('Artifact digest mismatch: '+rel)
  digests+=1
for row in json.loads((output/'reviewed-source-inventory.json').read_text()):
 if hashlib.sha256((root/row['path']).read_bytes()).hexdigest()!=row['sha256']:errors.append('Review source changed: '+row['path'])
stream=[json.loads(line) for line in (output/'checkpoint-race.jsonl').read_text().splitlines() if line]
negative=[x for x in stream if x.get('Action')=='pass' and re.search(r'/VCP-N\d{2}-',x.get('Test',''))]
if len(negative)!=53:errors.append('53 negative cases not retained')
audit=json.loads((output/'npm-audit.json').read_text()); production=json.loads((output/'npm-audit-production.json').read_text()); assessment=json.loads((output/'advisory-applicability.json').read_text())
if audit['metadata']['vulnerabilities']['moderate']!=11 or audit['metadata']['vulnerabilities']['total']!=11 or production['metadata']['vulnerabilities']['total']!=0:errors.append('Unexpected audit totals')
if {x['package'] for x in assessment['packages']}!=set(audit['vulnerabilities']):errors.append('Incomplete individual advisory coverage')
if any(x['disposition']!='OPEN_REVIEW_REQUIRED' or x['waiver'] for x in assessment['packages']):errors.append('Unapproved advisory disposition')
credential=json.loads((output/'credential-containment-review.json').read_text())
if credential['independent_revocation_verification']!='NOT RUN' or credential['provider_writes_this_task'] or credential['private_env_read_this_task'] or credential['full_credential_containment_accepted']:errors.append('Credential review boundary broadened')
import datetime
result={'source_sha':base_sha,'checked_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'docs':len(docs),'relative_links_and_fragments':links,'canonical_ids_including_ranges':len(refs),'local_test_definitions':sum(x.startswith('VSA-T') for x in localdefs),'local_open_item_definitions':sum(x.startswith('VSA-O') for x in localdefs),'preserved_baseline_files':len(tracked),'scanned_files':len(allpaths),'artifact_digests_checked':digests,'historical_scripts_checked_at_7164b7a':historical_script_checks,'negative_cases_passed':len(negative),'individual_moderate_entries_reviewed':len(assessment['packages']),'secret_baseline_exit':res.returncode,'secret_pattern_scan':'FAIL' if any('Secret' in x for x in errors) else 'PASS','errors':errors,'status':'FAIL' if errors else 'PASS'}
(output/'preparation-checks.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
raise SystemExit(bool(errors))
