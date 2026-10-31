import { describe, expect, it } from 'vitest'
import { resolveApiBaseUrl } from './config'

describe('resolveApiBaseUrl', () => {
  it('uses and normalizes the configured URL', () => {
    expect(resolveApiBaseUrl(' https://api.example.test/ ', 'http://127.0.0.1:8080')).toBe(
      'https://api.example.test',
    )
  })

  it('uses the local fallback when unset', () => {
    expect(resolveApiBaseUrl(undefined, 'http://127.0.0.1:8080')).toBe(
      'http://127.0.0.1:8080',
    )
  })

  it.each(['not-a-url', 'file:///tmp/api', 'https://user:pass@api.example.test', 'https://api.example.test/?token=x'])(
    'rejects unsafe configuration %s',
    (value) => {
      expect(() => resolveApiBaseUrl(value, 'http://127.0.0.1:8080')).toThrow(
        'Invalid API base URL',
      )
    },
  )
})
