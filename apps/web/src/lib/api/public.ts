import { resolveApiBaseUrl } from './config'

export interface PathSummary {
  id: string
  versionId: string
  title: string
  summary: string
  courseCount: number
}
export interface CourseSummary {
  id: string
  versionId: string
  title: string
  summary: string
  freeLessonCount: number
}
export interface LessonSummary {
  id: string
  title: string
  position: number
  isFree: boolean
}
export interface ModuleSummary {
  id: string
  title: string
  position: number
  lessons: LessonSummary[]
}
export interface PathDetail extends PathSummary {
  description: string
  courses: CourseSummary[]
}
export interface CourseDetail extends CourseSummary {
  description: string
  modules: ModuleSummary[]
}
type BlockBase = { id: string; position: number }
export type PublicBlock = BlockBase &
  (
    | { type: 'richText'; payload: { markdown: string } }
    | { type: 'code'; payload: { language: string; text: string } }
    | { type: 'callout'; payload: { text: string } }
    | { type: 'flashcard'; payload: { front: string; back: string } }
    | { type: 'media'; payload: { src: string; alt: string } }
    | { type: 'unavailable'; payload: null }
  )
export interface LessonDetail {
  id: string
  courseId: string
  courseVersionId: string
  moduleId: string
  title: string
  position: number
  isFree: boolean
  blocks: PublicBlock[]
}
export interface PublicResponse<T> {
  data: T
  snapshotId: string
  nextCursor: string | null
}

export class PublicApiError extends Error {
  constructor(
    public status: number,
    public requestId?: string,
  ) {
    super('Public content is unavailable')
  }
}

export const apiBaseUrl = resolveApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL,
  import.meta.env.DEV ? 'http://127.0.0.1:8080' : window.location.origin,
)

const idPattern = /^[A-Za-z0-9][A-Za-z0-9._~-]{0,127}$/
export function validId(value: string): boolean {
  return idPattern.test(value) && value !== '.' && value !== '..'
}
export function hasControlCharacters(value: string): boolean {
  return [...value].some(
    (character) =>
      character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
  )
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new PublicApiError(502)
  return value as Record<string, unknown>
}
function text(value: unknown): string {
  if (typeof value !== 'string') throw new PublicApiError(502)
  return value
}
function identifier(value: unknown): string {
  const result = text(value)
  if (!validId(result)) throw new PublicApiError(502)
  return result
}
function count(value: unknown, minimum = 0): number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < minimum
  )
    throw new PublicApiError(502)
  return value
}
function array<T>(value: unknown, parse: (item: unknown) => T): T[] {
  if (!Array.isArray(value)) throw new PublicApiError(502)
  return value.map(parse)
}
function summary(value: unknown) {
  const item = record(value)
  return {
    id: identifier(item.id),
    versionId: identifier(item.versionId),
    title: text(item.title),
    summary: text(item.summary),
  }
}
export function parsePath(value: unknown): PathSummary {
  return { ...summary(value), courseCount: count(record(value).courseCount) }
}
export function parseCourse(value: unknown): CourseSummary {
  return {
    ...summary(value),
    freeLessonCount: count(record(value).freeLessonCount),
  }
}
export function parsePathDetail(value: unknown): PathDetail {
  const item = record(value)
  return {
    ...parsePath(item),
    description: text(item.description),
    courses: array(item.courses, parseCourse),
  }
}
export function parseCourseDetail(value: unknown): CourseDetail {
  const item = record(value)
  return {
    ...parseCourse(item),
    description: text(item.description),
    modules: array(item.modules, (value) => {
      const module = record(value)
      return {
        id: identifier(module.id),
        title: text(module.title),
        position: count(module.position, 1),
        lessons: array(module.lessons, (value) => {
          const lesson = record(value)
          if (typeof lesson.isFree !== 'boolean') throw new PublicApiError(502)
          return {
            id: identifier(lesson.id),
            title: text(lesson.title),
            position: count(lesson.position, 1),
            isFree: lesson.isFree,
          }
        }),
      }
    }),
  }
}
export function safeMediaPath(src: string): boolean {
  return (
    /^\/assets\/fixture\/[A-Za-z0-9_/-]+(?:\.[A-Za-z0-9]+)?$/.test(src) &&
    !src.includes('..')
  )
}
export function parseBlock(value: unknown): PublicBlock {
  const block = record(value)
  const base = { id: identifier(block.id), position: count(block.position, 1) }
  try {
    const p = record(block.payload)
    switch (block.type) {
      case 'richText':
        return {
          ...base,
          type: 'richText',
          payload: { markdown: text(p.markdown) },
        }
      case 'code':
        return {
          ...base,
          type: 'code',
          payload: { language: text(p.language), text: text(p.text) },
        }
      case 'callout':
        return { ...base, type: 'callout', payload: { text: text(p.text) } }
      case 'flashcard': {
        const front = text(p.front),
          back = text(p.back)
        if (!front.trim() || !back.trim()) break
        return { ...base, type: 'flashcard', payload: { front, back } }
      }
      case 'media': {
        const src = text(p.src)
        if (!safeMediaPath(src)) break
        return { ...base, type: 'media', payload: { src, alt: text(p.alt) } }
      }
    }
  } catch {
    /* Keep a damaged Block local; never render arbitrary fields. */
  }
  return { ...base, type: 'unavailable', payload: null }
}
export function parseLesson(value: unknown): LessonDetail {
  const item = record(value)
  if (item.isFree !== true) throw new PublicApiError(404)
  return {
    id: identifier(item.id),
    courseId: identifier(item.courseId),
    courseVersionId: identifier(item.courseVersionId),
    moduleId: identifier(item.moduleId),
    title: text(item.title),
    position: count(item.position, 1),
    isFree: true,
    blocks: array(item.blocks, parseBlock).sort(
      (a, b) => a.position - b.position,
    ),
  }
}

export async function publicRead<T>(
  path: string,
  parse: (value: unknown) => T,
  signal?: AbortSignal,
): Promise<PublicResponse<T>> {
  const response = await fetch(`${apiBaseUrl}/api/v1${path}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'omit',
    cache: 'no-store',
    signal,
  })
  if (!response.ok) {
    const requestId = response.headers.get('X-Request-ID') ?? ''
    // Never display a server-supplied title/detail or echo a raw query/cursor.
    throw new PublicApiError(
      response.status,
      /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(requestId)
        ? requestId
        : undefined,
    )
  }
  if (!response.headers.get('Content-Type')?.includes('application/json'))
    throw new PublicApiError(502)
  const envelope = record(await response.json())
  const snapshotId = identifier(record(envelope.meta).snapshotId)
  const data = parse(envelope.data)
  const next =
    envelope.page === undefined ? null : record(envelope.page).nextCursor
  if (
    next !== null &&
    (typeof next !== 'string' ||
      next.length > 1024 ||
      next.length === 0 ||
      hasControlCharacters(next))
  )
    throw new PublicApiError(502)
  return { data, snapshotId, nextCursor: next }
}

export function publicList<T>(
  path: string,
  parse: (value: unknown) => T,
  signal?: AbortSignal,
) {
  return publicRead(path, (value) => array(value, parse), signal)
}

export function flattenLessons(course: CourseDetail) {
  return [...course.modules]
    .sort((a, b) => a.position - b.position)
    .flatMap((module) =>
      [...module.lessons]
        .sort((a, b) => a.position - b.position)
        .filter((lesson) => lesson.isFree)
        .map((lesson) => ({
          ...lesson,
          moduleId: module.id,
          moduleTitle: module.title,
        })),
    )
}
