import { spawn, execFile, type ChildProcess } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { expect, test } from '@playwright/test'
import { completedPublicRead } from '../support/completed-response'

test('AI-F01: actual API restart recovery replaces the error, results and signed cursor repeatedly', async ({
  page,
  request,
}, info) => {
  // Each worker owns its servers: restarting this key must not disrupt other
  // real-API scenarios. There is no HTTP restart endpoint or API interception.
  const apiOrigin = `http://127.0.0.1:${18181 + info.parallelIndex}`
  const webOrigin = `http://127.0.0.1:${15373 + info.parallelIndex}`
  const directory = await mkdtemp(join(tmpdir(), 'vs01a-recovery-'))
  const executable = join(
    directory,
    process.platform === 'win32' ? 'api.exe' : 'api',
  )
  const webRoot = resolve(import.meta.dirname, '../..')
  const output: string[] = []
  const processes: ChildProcess[] = []
  const cycles: {
    oldCursorRejected: number
    cursorReplaced: boolean
    nextPage: string
  }[] = []
  function start(command: string, args: string[], env: NodeJS.ProcessEnv) {
    const child = spawn(command, args, {
      cwd: webRoot,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    processes.push(child)
    child.stdout?.on('data', (data: Buffer) => output.push(data.toString()))
    child.stderr?.on('data', (data: Buffer) => output.push(data.toString()))
    child.on('error', (error) => output.push(error.message))
    return child
  }
  async function stop(child: ChildProcess) {
    if (child.exitCode !== null || child.signalCode !== null || !child.pid)
      return
    const closed = once(child, 'close')
    child.kill('SIGTERM')
    await closed
  }
  async function available(child: ChildProcess, url: string) {
    await expect
      .poll(async () => {
        expect(child.exitCode, output.join('')).toBeNull()
        try {
          return (await request.get(url)).status()
        } catch {
          return 0
        }
      })
      .toBe(200)
  }
  async function startAPI() {
    const child = start(executable, [], {
      ...process.env,
      APP_ENV: 'test',
      FIXTURE_MODE: 'vs01a',
      HTTP_LISTEN_ADDR: new URL(apiOrigin).host,
    })
    await available(child, `${apiOrigin}/healthz`)
    return child
  }
  const initialURL = `${webOrigin}/api/v1/catalog/paths?limit=1`
  try {
    await promisify(execFile)(
      process.env.GO_BIN || 'go',
      ['build', '-tags', 'devfixture', '-o', executable, './cmd/api'],
      {
        cwd: resolve(webRoot, '../api'),
        env: { ...process.env, GOTOOLCHAIN: 'local' },
      },
    )
    let api = await startAPI()
    const web = start(
      process.execPath,
      [
        resolve(webRoot, 'node_modules/vite/bin/vite.js'),
        '--host', '127.0.0.1',
        '--port', new URL(webOrigin).port,
        '--strictPort',
      ],
      {
        ...process.env,
        API_PROXY_TARGET: apiOrigin,
        VITE_API_BASE_URL: webOrigin,
      },
    )
    await available(web, `${webOrigin}/catalog`)

    for (let cycle = 0; cycle < 2; cycle++) {
      const [{ body: first }] = await Promise.all([
        completedPublicRead(page, initialURL),
        page.goto(`${webOrigin}/catalog?limit=1`),
      ])
      expect(first.meta.snapshotId).toBe('pub-v1')
      expect(first.data.map((item: { id: string }) => item.id)).toEqual([
        'path-foundations',
      ])
      await expect(
        page.getByRole('link', { name: first.data[0].title, exact: true }),
      ).toBeVisible()
      const oldCursor = first.page.nextCursor as string
      expect(oldCursor).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
      await stop(api)
      api = await startAPI()
      const rejectedURL = new URL(initialURL)
      rejectedURL.searchParams.set('cursor', oldCursor)
      const [rejected] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.request().method() === 'GET' &&
            response.url() === rejectedURL.href,
        ),
        page.getByRole('button', { name: 'Muat lagi', exact: true }).click(),
      ])
      expect(rejected.status()).toBe(400)
      await expect(page.getByRole('alert')).toContainText(
        'Daftar perlu dimuat ulang',
      )
      // publicRead deliberately does not consume problem bodies. Verify the
      // exact rejected URL directly, without waiting for that unused stream.
      const directRejection = await request.get(rejectedURL.href)
      expect(directRejection.status()).toBe(400)
      const problem = await directRejection.json()
      expect(problem.status).toBe(400)
      expect(Object.keys(problem).sort()).toEqual([
        'requestId', 'status', 'title', 'type',
      ])
      const reload = page.getByRole('button', { name: 'Muat ulang daftar' })
      await reload.focus()
      const [{ body: replacement }] = await Promise.all([
        completedPublicRead(page, initialURL),
        page.keyboard.press('Enter'),
      ])
      expect(replacement.data).toEqual(first.data)
      expect(replacement.meta.snapshotId).toBe(first.meta.snapshotId)
      const newCursor = replacement.page.nextCursor as string
      expect(newCursor).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
      expect(newCursor).not.toBe(oldCursor)
      await expect(
        page.getByRole('status').filter({ hasText: '1 learning path ditampilkan' }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: replacement.data[0].title, exact: true }),
      ).toBeVisible()
      await expect(page.getByRole('alert')).toHaveCount(0)
      await expect(reload).toHaveCount(0)
      const nextURL = new URL(initialURL)
      nextURL.searchParams.set('cursor', newCursor)
      const [{ body: second }] = await Promise.all([
        completedPublicRead(page, nextURL.href),
        page.getByRole('button', { name: 'Muat lagi', exact: true }).click(),
      ])
      expect(second.meta.snapshotId).toBe(replacement.meta.snapshotId)
      expect(second.data.map((item: { id: string }) => item.id)).toEqual([
        'path-practice',
      ])
      expect(second.page.nextCursor).toBeNull()
      await expect(
        page.getByRole('link', { name: second.data[0].title, exact: true }),
      ).toBeVisible()
      await expect(
        page.getByRole('status').filter({ hasText: '2 learning path ditampilkan' }),
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Muat lagi', exact: true }),
      ).toHaveCount(0)
      await expect(page.getByRole('alert')).toHaveCount(0)
      cycles.push({
        oldCursorRejected: problem.status,
        cursorReplaced: newCursor !== oldCursor,
        nextPage: second.data[0].id,
      })
    }
    await info.attach('recovery-cycles', {
      body: JSON.stringify(cycles, null, 2),
      contentType: 'application/json',
    })
  } finally {
    await Promise.all(processes.map(stop))
    await rm(directory, { recursive: true, force: true })
    await info.attach('isolated-server-output', {
      body: output.join(''),
      contentType: 'text/plain',
    })
  }
})
