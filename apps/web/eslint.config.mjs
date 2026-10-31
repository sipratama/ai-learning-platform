import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
      'playwright-integration-report/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
]
