import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const target = process.env.API_PROXY_TARGET || 'http://127.0.0.1:8080'
const proxyURL = new URL(target)
if (
  proxyURL.protocol !== 'http:' ||
  !['127.0.0.1', 'localhost', '[::1]'].includes(proxyURL.hostname) ||
  proxyURL.username ||
  proxyURL.password ||
  proxyURL.search ||
  proxyURL.hash ||
  proxyURL.pathname !== '/'
) {
  throw new Error('API_PROXY_TARGET must be an HTTP loopback origin')
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/v1': { target, changeOrigin: false },
      '/assets/fixture': { target, changeOrigin: false },
    },
    watch: {
      ignored: [
        '**/playwright-report/**',
        '**/playwright-integration-report/**',
        '**/test-results/**',
      ],
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
