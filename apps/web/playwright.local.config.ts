import { existsSync } from 'node:fs'
import { defineConfig } from '@playwright/test'

const chrome = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Start Compose separately. This suite exercises the built images without mocks.
export default defineConfig({
  testDir: './tests/local-preview',
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  outputDir: 'test-results/local-preview',
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/local-preview-results.json' }],
    ['html', { outputFolder: 'playwright-report/local-preview', open: 'never' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:8088',
    locale: 'id-ID',
    timezoneId: 'Asia/Jakarta',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: existsSync(chrome) ? { executablePath: chrome } : {},
  },
  projects: [
    { name: 'preview-desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'preview-mobile', use: {
      viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    } },
  ],
})
