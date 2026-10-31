// Public DTO test doubles only. Never imported by application entry points.
// This does not emulate Go visibility enforcement or cursor signing.
import type {
  CourseDetail,
  CourseSummary,
  LessonDetail,
  PathDetail,
  PathSummary,
} from '../../src/lib/api/public'

export const courses: CourseSummary[] = [
  {
    id: 'course-focus',
    versionId: 'pub-v1',
    title: 'Focused Practice',
    summary: 'A separate Course for filtering and search.',
    freeLessonCount: 1,
  },
  {
    id: 'course-flagship',
    versionId: 'pub-v1',
    title: 'Menguasai ChatGPT dari Nol',
    summary: 'A small public development sample.',
    freeLessonCount: 2,
  },
]
export const paths: PathSummary[] = [
  {
    id: 'path-foundations',
    versionId: 'pub-v1',
    title: 'Foundations Path',
    summary: 'A first route through the flagship course.',
    courseCount: 1,
  },
  {
    id: 'path-practice',
    versionId: 'pub-v1',
    title: 'Practice Path',
    summary: 'Flagship and focused practice together.',
    courseCount: 2,
  },
]
export const courseDetails: Record<string, CourseDetail> = {
  'course-flagship': {
    ...courses[1],
    description:
      'Two free fixture Lessons; not the complete production flagship.',
    modules: [
      {
        id: 'module-flagship-1',
        title: 'Getting Started',
        position: 1,
        lessons: [
          {
            id: 'lesson-flagship-1',
            title: 'First Steps',
            position: 1,
            isFree: true,
          },
          {
            id: 'lesson-flagship-2',
            title: 'Safe Practice',
            position: 2,
            isFree: true,
          },
        ],
      },
    ],
  },
  'course-focus': {
    ...courses[0],
    description: 'Disposable public Course for membership checks.',
    modules: [
      {
        id: 'module-focus-1',
        title: 'Focus',
        position: 1,
        lessons: [
          {
            id: 'lesson-focus-1',
            title: 'Focus Lesson',
            position: 1,
            isFree: true,
          },
        ],
      },
    ],
  },
}
export const pathDetails: Record<string, PathDetail> = {
  'path-foundations': {
    ...paths[0],
    description: 'Disposable development path for public reading checks.',
    courses: [courses[1]],
  },
  'path-practice': {
    ...paths[1],
    description: 'Disposable development path for canonical Course reuse.',
    courses: [courses[1], courses[0]],
  },
}
export const lessons: Record<string, LessonDetail> = {
  'lesson-flagship-1': {
    id: 'lesson-flagship-1',
    courseId: 'course-flagship',
    courseVersionId: 'pub-v1',
    moduleId: 'module-flagship-1',
    title: 'First Steps',
    position: 1,
    isFree: true,
    blocks: [
      {
        id: 'block-rich-1',
        type: 'richText',
        position: 1,
        payload: { markdown: '# Welcome\nThis is a safe fixture Lesson.' },
      },
      {
        id: 'block-code-1',
        type: 'code',
        position: 2,
        payload: {
          language: 'text',
          text: "<script>alert('literal only')</script>",
        },
      },
      {
        id: 'block-card-1',
        type: 'flashcard',
        position: 3,
        payload: {
          front: 'What is a prompt?',
          back: 'A request or instruction to an AI system.',
        },
      },
      {
        id: 'block-media-1',
        type: 'media',
        position: 4,
        payload: {
          src: '/assets/fixture/diagram.svg',
          alt: 'Synthetic learning diagram',
        },
      },
    ],
  },
  'lesson-flagship-2': {
    id: 'lesson-flagship-2',
    courseId: 'course-flagship',
    courseVersionId: 'pub-v1',
    moduleId: 'module-flagship-1',
    title: 'Safe Practice',
    position: 2,
    isFree: true,
    blocks: [
      {
        id: 'block-callout-1',
        type: 'callout',
        position: 1,
        payload: { text: 'Local practice never grants official completion.' },
      },
    ],
  },
  'lesson-focus-1': {
    id: 'lesson-focus-1',
    courseId: 'course-focus',
    courseVersionId: 'pub-v1',
    moduleId: 'module-focus-1',
    title: 'Focus Lesson',
    position: 1,
    isFree: true,
    blocks: [
      {
        id: 'block-focus-1',
        type: 'richText',
        position: 1,
        payload: { markdown: 'Focused practice fixture content.' },
      },
    ],
  },
}
export function envelope(data: unknown, nextCursor: string | null = null) {
  return {
    data,
    page: { nextCursor },
    meta: {
      requestId: 'frontend-test',
      snapshotId: 'pub-v1',
      filters: {},
      sort: 'title,id',
    },
  }
}
export function fixtureResponse(url: URL): { status: number; body: unknown } {
  const route = url.pathname.replace('/api/v1', '')
  if (route === '/catalog/paths' || route === '/catalog/courses') {
    const kind = route.endsWith('paths') ? 'paths' : 'courses'
    let items: (PathSummary | CourseSummary)[] =
      kind === 'paths' ? paths : courses
    const q = url.searchParams.get('q')?.toLowerCase()
    if (q)
      items = items.filter((item) =>
        `${item.title} ${item.summary}`.toLowerCase().includes(q),
      )
    const member = url.searchParams.get(
      kind === 'paths' ? 'courseId' : 'pathId',
    )
    if (member)
      items = items.filter((item) =>
        kind === 'paths'
          ? pathDetails[item.id].courses.some((course) => course.id === member)
          : pathDetails[member]?.courses.some(
              (course) => course.id === item.id,
            ),
      )
    const cursor = url.searchParams.get('cursor')
    if (cursor && cursor !== 'test_opaque_page_2')
      return { status: 400, body: {} }
    const limit = Number(url.searchParams.get('limit') ?? 20)
    const start = cursor ? limit : 0
    return {
      status: 200,
      body: envelope(
        items.slice(start, start + limit),
        start + limit < items.length ? 'test_opaque_page_2' : null,
      ),
    }
  }
  const segments = route.split('/').filter(Boolean)
  let data: unknown
  if (segments[0] === 'paths' && segments.length === 2)
    data = pathDetails[segments[1]]
  if (segments[0] === 'courses' && segments.length === 2)
    data = courseDetails[segments[1]]
  if (
    segments[0] === 'courses' &&
    segments[2] === 'lessons' &&
    segments.length === 4
  ) {
    const lesson = lessons[segments[3]]
    if (lesson?.courseId === segments[1]) data = lesson
  }
  return data
    ? { status: 200, body: envelope(data) }
    : {
        status: 404,
        body: { title: 'Not Found', status: 404, requestId: 'frontend-test' },
      }
}
