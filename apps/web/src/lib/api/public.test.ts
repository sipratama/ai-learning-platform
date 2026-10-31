import { afterEach, describe, expect, it, vi } from 'vitest'
import { parseCourse, publicRead, PublicApiError } from './public'

afterEach(() => vi.unstubAllGlobals())
describe('public read boundary', () => {
  it('preserves an opaque signed cursor without decoding or interpreting its format', async () => {
    const cursor = 'opaque.payload~signature-123'
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              data: [],
              page: { nextCursor: cursor },
              meta: { snapshotId: 'pub-v1' },
            }),
            { headers: { 'Content-Type': 'application/json' } },
          ),
      ),
    )
    const result = await publicRead('/catalog/courses', (value) => value)
    expect(result.nextCursor).toBe(cursor)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'GET',
        credentials: 'omit',
        cache: 'no-store',
      }),
    )
  })
  it('projects only the public fields used by the UI', () => {
    const result = parseCourse({
      id: 'course',
      versionId: 'pub-v1',
      title: 'Public course',
      summary: 'Public summary',
      freeLessonCount: 1,
      privateOwner: 'never display',
      draftId: 'draft-v2',
    })
    expect(result).not.toHaveProperty('privateOwner')
    expect(result).not.toHaveProperty('draftId')
  })
  it('rejects non-JSON success responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response('<html>not an API response</html>', {
            headers: { 'Content-Type': 'text/html' },
          }),
      ),
    )
    await expect(
      publicRead('/catalog/courses', (value) => value),
    ).rejects.toBeInstanceOf(PublicApiError)
  })
})
