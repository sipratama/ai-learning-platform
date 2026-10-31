export function resolveApiBaseUrl(value: string | undefined, fallback: string): string {
  const candidate = value?.trim() || fallback
  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    throw new Error('Invalid API base URL')
  }
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error('Invalid API base URL')
  }
  return url.href.replace(/\/$/, '')
}
