// Development tooling guard. No application imports or additional dependencies.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const web = fileURLToPath(new URL('../apps/web/', import.meta.url))
const require = createRequire(new URL('../apps/web/package.json', import.meta.url))
const { ESLint } = require('eslint')
const parser = require('@typescript-eslint/parser')
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex')
const relative = name => path.relative(web, name).split(path.sep).join('/')
const ordered = value => Object.fromEntries(Object.entries(value ?? {}).sort(([a], [b]) => a.localeCompare(b)))

const tracked = execFileSync('git', ['ls-files', '-z', '--', '.'], { cwd: web, encoding: 'utf8' })
  .split('\0').filter(Boolean).sort()
const paths = [...new Set([...tracked, 'src/nested/example.tsx', 'src/.hidden.ts',
  'src/[literal].ts', 'src/élève.ts', 'tests/e2e/nested/example.spec.ts',
  'dist/example.ts', 'dist/nested/example.tsx', 'distinguished/example.ts',
  'node_modules/pkg/index.js', 'test-results/nested/example.ts',
  'playwright-report/index.js', 'playwright-integration-report/index.js'])].sort()
const directories = ['src', 'src/nested', 'src/.hidden', 'tests', 'tests/e2e',
  'tests/integration', 'dist', 'node_modules/pkg', 'test-results/nested']
const patterns = ['**/*.{js,mjs,cjs}', '**/*.{ts,tsx}', 'src/**/*.{ts,tsx}',
  'tests/{e2e,integration}/**/*.spec.ts', '**/*.d.ts', 'dist/**', 'node_modules/**',
  'test-results/**', 'playwright-report/**', 'playwright-integration-report/**',
  '**/!(*.test).{ts,tsx}', 'src/\\[literal\\].ts']
const consumerNames = ['eslint', '@eslint/config-array', '@typescript-eslint/typescript-estree']
const resolution = []
let globMatrix
for (const consumer of consumerNames) {
  const consumerRequire = createRequire(require.resolve(consumer))
  const matcher = consumerRequire('minimatch')
  const { version } = consumerRequire('minimatch/package.json')
  resolution.push({ consumer, minimatch: version })
  const matrix = patterns.map(pattern => ({
    pattern,
    matches: paths.filter(value => new matcher.Minimatch(pattern, { dot: true }).match(value)),
    partialDirectories: directories.filter(value => new matcher.Minimatch(pattern, { dot: true }).match(value, true)),
  }))
  if (globMatrix) assert.deepEqual(matrix, globMatrix, 'Consumers resolved inconsistent glob behavior')
  globMatrix = matrix
  assert.equal(matcher.minimatch('src/[literal].ts', 'src/\\[literal\\].ts'), true)
  assert.equal(matcher.minimatch('src/.hidden.ts', '**/*.ts', { dot: true }), true)
  assert.equal(matcher.minimatch('distinguished/example.ts', 'dist/**', { dot: true }), false)
  // Explicit Windows options on any host; this is not a native Windows run.
  assert.equal(matcher.minimatch('C:/repo/src/test.ts', 'C:\\repo\\src\\*.ts', {
    platform: 'win32', windowsPathsNoEscape: true, dot: true,
  }), true)
}

const eslint = new ESLint({ cwd: web })
const results = await eslint.lintFiles(['.'])
const lintFiles = results.map(result => relative(result.filePath)).sort()
assert.ok(lintFiles.length > 0, 'ESLint must actually inspect files')
assert.equal(results.reduce((count, result) => count + result.errorCount + result.warningCount, 0), 0)
// Every tracked JS/TS file must be linted unless the effective config ignores it.
for (const file of tracked.filter(file => /\.(?:[cm]?js|tsx?)$/.test(file))) {
  if (!await eslint.isPathIgnored(path.join(web, file))) {
    assert.ok(lintFiles.includes(file), `Tracked file lost lint coverage: ${file}`)
  }
}
const configs = []
for (const file of lintFiles) {
  const config = await eslint.calculateConfigForFile(path.join(web, file))
  configs.push({ file, rules: digest(ordered(config.rules)),
    language: digest({ ecmaVersion: config.languageOptions.ecmaVersion,
      sourceType: config.languageOptions.sourceType,
      globals: ordered(config.languageOptions.globals),
      parserOptions: ordered(config.languageOptions.parserOptions),
      parser: config.languageOptions.parser.meta }),
    plugins: Object.keys(config.plugins ?? {}).sort(), settings: digest(ordered(config.settings)) })
}
configs.sort((a, b) => a.file.localeCompare(b.file))

const ignorePaths = ['dist/example.ts', 'node_modules/example.js', 'test-results/example.ts',
  'playwright-report/example.js', 'playwright-integration-report/example.js',
  'distinguished/example.ts', 'src/example.ts', 'tests/e2e/example.spec.ts']
const ignored = []
for (const file of ignorePaths) ignored.push({ file, ignored: await eslint.isPathIgnored(path.join(web, file)) })
assert.deepEqual(ignored.map(item => item.ignored), [true, true, true, true, true, false, false, false])

const fixtures = [
  { name: 'valid-tsx', file: 'src/tooling-probe.tsx', source:
    'type Box<T> = { value: T }; export const render = (box: Box<number>) => <span>{box.value}</span>;' },
  { name: 'invalid-tsx', file: 'src/tooling-probe.tsx', source: 'export const render = <span>;' },
  { name: 'typescript-rules', file: 'src/tooling-probe.ts', source: 'const unused: any = 1; debugger;' },
  { name: 'javascript-rules', file: 'tooling-probe.mjs', source: 'const unused = missing; debugger;' },
]
const diagnostics = []
for (const fixture of fixtures) {
  const [result] = await eslint.lintText(fixture.source, { filePath: fixture.file })
  diagnostics.push({ name: fixture.name, messages: result.messages.map(message => ({
    ruleId: message.ruleId, severity: message.severity, fatal: message.fatal ?? false,
    messageId: message.messageId ?? null, line: message.line, column: message.column,
  })) })
}
assert.equal(diagnostics[0].messages.length, 0)
assert.ok(diagnostics[1].messages.some(message => message.fatal))
assert.deepEqual(diagnostics[2].messages.map(message => message.ruleId).sort(),
  ['@typescript-eslint/no-explicit-any', '@typescript-eslint/no-unused-vars', 'no-debugger'])
assert.deepEqual(diagnostics[3].messages.map(message => message.ruleId).sort(),
  ['@typescript-eslint/no-unused-vars', 'no-debugger', 'no-undef'])

// Exercise estree's actual minimatch caller through allowDefaultProject.
// This setup is deliberately absent from the application's ordinary lint config.
const temporary = await mkdtemp(path.join(web, '.tooling-probe-'))
let typescript
try {
  const filename = path.join(temporary, 'probe.ts')
  const source = 'export const number: number = 42;'
  await writeFile(filename, source)
  const parsed = parser.parseForESLint(source, { filePath: filename, tsconfigRootDir: web,
    projectService: { allowDefaultProject: [relative(filename)], defaultProject: 'tsconfig.json' } })
  assert.ok(parsed.services.program, 'Default-project fixture must use a TypeScript Program')
  typescript = { ast: digest(parsed.ast), program: true }
} finally {
  parser.clearCaches()
  await rm(temporary, { recursive: true, force: true })
}

const behavior = { lintFiles, configs, globMatrix, ignored, diagnostics, typescript }
const comparison = process.argv.indexOf('--compare')
if (comparison !== -1) {
  const baseline = JSON.parse(await readFile(process.argv[comparison + 1], 'utf8'))
  assert.deepEqual(behavior, baseline.behavior, 'Tooling behavior changed from reviewed baseline')
}
const expected = process.argv.indexOf('--expect-version')
if (expected !== -1) {
  for (const entry of resolution) assert.equal(entry.minimatch, process.argv[expected + 1])
}
console.log(JSON.stringify({ status: 'PASS', node: process.version, resolution,
  behavior_sha256: digest(behavior), behavior }, null, 2))
