import { expect, type Page } from '@playwright/test'

// StrictMode can abort a fetch after its response headers arrive. Wait for
// requestfinished (not response) and consume the body before the next action.
// Aborted requests emit requestfailed; completed HTTP errors still fail here.
export async function completedPublicRead(
  page: Page,
  url: string,
) {
  const request = await page.waitForEvent(
    'requestfinished',
    (request) => request.method() === 'GET' && request.url() === url,
  )
  expect(request.failure()).toBeNull()
  const response = await request.response()
  expect(response).not.toBeNull()
  expect(response!.status()).toBe(200)
  expect(response!.headers()['content-type']).toContain('application/json')
  return { response: response!, body: await response!.json() }
}
