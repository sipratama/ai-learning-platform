import process from 'node:process'
import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const go = process.env.GO_BIN || 'go'
const version = spawnSync(go, ['version'], { encoding: 'utf8' })
if (version.status !== 0 || !version.stdout.includes('go1.27.3 ')) {
  process.stderr.write(
    'Real integration requires Go 1.27.3. Set GO_BIN to its executable.\n',
  )
  process.exit(1)
}
const directory = await mkdtemp(join(tmpdir(), 'ai-learning-real-api-'))
const executable = join(
  directory,
  process.platform === 'win32' ? 'api.exe' : 'api',
)
let child,
  stopping = false
async function stop() {
  if (stopping) return
  stopping = true
  if (child && child.exitCode === null) {
    child.kill('SIGTERM')
    await new Promise((done) => child.once('exit', done))
  }
  await rm(directory, { recursive: true, force: true })
}
process.once('SIGTERM', () => {
  void stop()
})
process.once('SIGINT', () => {
  void stop()
})
try {
  child = spawn(
    go,
    ['build', '-tags', 'devfixture', '-o', executable, './cmd/api'],
    {
      cwd: resolve(import.meta.dirname, '../../../api'),
      env: { ...process.env, GOTOOLCHAIN: 'local' },
      stdio: 'inherit',
    },
  )
  const code = await new Promise((done, reject) => {
    child.once('error', reject)
    child.once('exit', done)
  })
  if (stopping) process.exit(0)
  if (code !== 0) throw new Error('Development API build failed')
  child = spawn(executable, [], {
    env: {
      ...process.env,
      APP_ENV: 'test',
      FIXTURE_MODE: 'vs01a',
      HTTP_LISTEN_ADDR: '127.0.0.1:18081',
    },
    stdio: 'inherit',
  })
  const result = await new Promise((done, reject) => {
    child.once('error', reject)
    child.once('exit', done)
  })
  if (!stopping && result !== 0)
    throw new Error('Development API exited unexpectedly')
} catch {
  process.stderr.write('Real API integration startup failed.\n')
  process.exitCode = 1
} finally {
  await stop()
}
