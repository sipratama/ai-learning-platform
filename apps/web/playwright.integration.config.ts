import { existsSync } from 'node:fs'
import { defineConfig } from '@playwright/test'

const chrome =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
export default defineConfig({
  testDir: './tests/integration',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  outputDir: 'test-results/integration',
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/integration-results.json' }],
    ['html', { outputFolder: 'playwright-integration-report', open: 'never' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:15173',
    locale: 'id-ID',
    timezoneId: 'Asia/Jakarta',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: existsSync(chrome) ? { executablePath: chrome } : {},
  },
  webServer: [
    {
      command: 'node tests/integration/start-api.mjs',
      url: 'http://127.0.0.1:18081/healthz',
      timeout: 180_000,
      reuseExistingServer: false,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
    },
    {
      command: 'npm run dev -- --port 15173 --strictPort',
      url: 'http://127.0.0.1:15173',
      timeout: 30_000,
      reuseExistingServer: false,
      env: {
        API_PROXY_TARGET: 'http://127.0.0.1:18081',
        VITE_API_BASE_URL: 'http://127.0.0.1:15173',
      },
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
    },
  ],
  projects: [
    { name: 'real-desktop', use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: 'real-mobile',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
})
