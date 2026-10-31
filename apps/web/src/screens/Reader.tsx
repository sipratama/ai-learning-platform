import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Block } from '../components/Blocks'
import {
  Badge,
  Breadcrumbs,
  EmptyState,
  ErrorState,
  Icon,
  Loading,
  PageTitle,
} from '../components/ui'
import {
  flattenLessons,
  parseCourseDetail,
  parseLesson,
  publicRead,
  PublicApiError,
  validId,
} from '../lib/api/public'
import { useResource } from '../lib/useResource'
import { Curriculum } from './Details'

export function Reader() {
  const [outlineOpen, setOutlineOpen] = useState(
    () => window.matchMedia('(min-width: 1200px)').matches,
  )
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1200px)')
    const update = () => setOutlineOpen(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const { courseId = '', lessonId = '' } = useParams()
  const course = useResource(`reader-course:${courseId}`, async (signal) => {
    if (!validId(courseId)) throw new PublicApiError(400)
    const result = await publicRead(
      `/courses/${courseId}`,
      parseCourseDetail,
      signal,
    )
    if (result.data.id !== courseId) throw new PublicApiError(502)
    return result
  })
  const resource = useResource(
    `lesson:${courseId}:${lessonId}`,
    async (signal) => {
      if (!validId(courseId) || !validId(lessonId))
        throw new PublicApiError(400)
      const result = await publicRead(
        `/courses/${courseId}/lessons/${lessonId}`,
        parseLesson,
        signal,
      )
      if (result.data.id !== lessonId || result.data.courseId !== courseId)
        throw new PublicApiError(404)
      return result
    },
  )
  useEffect(() => {
    if (resource.value) window.dispatchEvent(new Event('learning:ready'))
  }, [resource.value])
  const lesson = resource.value?.data,
    content = course.value?.data
  const versionMismatch = !!(
    lesson &&
    content &&
    (lesson.courseVersionId !== content.versionId ||
      resource.value?.snapshotId !== course.value?.snapshotId)
  )
  const lessons = content ? flattenLessons(content) : [],
    index = lessons.findIndex((item) => item.id === lessonId)
  const membershipMismatch = !!(
    lesson &&
    content &&
    !versionMismatch &&
    (index < 0 || lessons[index].moduleId !== lesson.moduleId)
  )
  const unsafeContext = versionMismatch || membershipMismatch,
    context = content && !unsafeContext ? content : undefined
  return (
    <div className="page reader-page">
      <PageTitle title={lesson?.title ?? 'Lesson'} />
      {(!lesson || unsafeContext) && <h1 className="sr-only">Lesson</h1>}
      <Breadcrumbs
        items={[
          { label: 'Katalog', to: '/catalog?type=courses' },
          {
            label: context?.title ?? 'Course',
            to: validId(courseId) ? `/courses/${courseId}` : '/catalog',
          },
          { label: lesson?.title ?? 'Lesson' },
        ]}
      />
      {resource.loading ? (
        <Loading label="Memuat lesson…" />
      ) : resource.error ? (
        <ErrorState
          error={resource.error}
          retry={resource.retry}
          back={validId(courseId) ? `/courses/${courseId}` : '/catalog'}
        />
      ) : unsafeContext ? (
        <ErrorState
          error={new PublicApiError(502)}
          retry={() => {
            course.retry()
            resource.retry()
          }}
          back={`/courses/${courseId}`}
        />
      ) : (
        lesson && (
          <div className="reader-layout">
            <aside className="reader-outline" aria-label="Daftar lesson">
              <details
                className="outline-disclosure"
                open={outlineOpen}
                onToggle={(event) => setOutlineOpen(event.currentTarget.open)}
              >
                <summary>
                  <Icon name="book" />
                  Daftar lesson
                  <Icon name="chevron" size={16} />
                </summary>
                <nav aria-label="Lesson dalam course">
                  {context ? (
                    <>
                      <Link
                        className="outline-course"
                        to={`/courses/${courseId}`}
                      >
                        {context.title}
                      </Link>
                      <Curriculum
                        course={context}
                        currentLesson={lessonId}
                        compact
                      />
                    </>
                  ) : course.loading ? (
                    <p className="muted">Memuat daftar lesson…</p>
                  ) : course.error ? (
                    <ErrorState
                      error={course.error}
                      retry={course.retry}
                      compact
                    />
                  ) : null}
                </nav>
              </details>
            </aside>
            <div className="reader-content">
              <header className="lesson-heading">
                <div className="metadata-row">
                  <Badge tone="lime">Gratis</Badge>
                  {context && index >= 0 && (
                    <span>
                      Lesson {index + 1} dari {lessons.length} · urutan materi
                    </span>
                  )}
                </div>
                {context && index >= 0 && (
                  <p className="module-context">{lessons[index].moduleTitle}</p>
                )}
                <h1>{lesson.title}</h1>
                <p className="lesson-subtitle">
                  Baca, pahami, lalu coba dengan caramu sendiri.
                </p>
              </header>
              <article
                className="reading-surface"
                aria-label={`Materi ${lesson.title}`}
                key={`${courseId}:${lesson.courseVersionId}:${lessonId}`}
              >
                {lesson.blocks.length ? (
                  lesson.blocks.map((block) => (
                    <Block
                      block={block}
                      key={`${block.id}:${block.position}`}
                    />
                  ))
                ) : (
                  <EmptyState title="Isi lesson belum tersedia">
                    Pilih lesson lain dari daftar materi.
                  </EmptyState>
                )}
              </article>
              <nav
                className="lesson-pagination"
                aria-label="Navigasi antar-lesson"
              >
                {context && index > 0 && (
                  <Link
                    className="lesson-navigation lesson-navigation--previous"
                    to={`/courses/${courseId}/lessons/${lessons[index - 1].id}`}
                  >
                    <span>Lesson sebelumnya</span>
                    <strong>{lessons[index - 1].title}</strong>
                  </Link>
                )}
                {context && index >= 0 && index < lessons.length - 1 ? (
                  <Link
                    className="lesson-navigation"
                    to={`/courses/${courseId}/lessons/${lessons[index + 1].id}`}
                  >
                    <span>
                      Lesson berikutnya
                      <Icon name="arrow" size={18} />
                    </span>
                    <strong>{lessons[index + 1].title}</strong>
                  </Link>
                ) : (
                  <Link
                    className="lesson-navigation"
                    to={`/courses/${courseId}`}
                  >
                    <span>
                      Kembali ke course
                      <Icon name="arrow" size={18} />
                    </span>
                    <strong>Lihat daftar materi</strong>
                  </Link>
                )}
              </nav>
              <p className="reader-local-note">
                Membaca dan mencoba latihan lokal tidak mencatat kelulusan
                resmi.
              </p>
            </div>
          </div>
        )
      )}
    </div>
  )
}
