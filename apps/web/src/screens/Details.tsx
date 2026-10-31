import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CourseCard } from '../components/ContentCards'
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
  parsePathDetail,
  publicRead,
  PublicApiError,
  validId,
  type CourseDetail,
} from '../lib/api/public'
import { useResource } from '../lib/useResource'

export function PathDetailScreen() {
  const { pathId = '' } = useParams()
  const resource = useResource(`path:${pathId}`, async (signal) => {
    if (!validId(pathId)) throw new PublicApiError(400)
    const result = await publicRead(`/paths/${pathId}`, parsePathDetail, signal)
    if (result.data.id !== pathId) throw new PublicApiError(502)
    return result
  })
  useEffect(() => {
    if (resource.value) window.dispatchEvent(new Event('learning:ready'))
  }, [resource.value])
  const path = resource.value?.data
  return (
    <div className="page">
      <PageTitle title={path?.title ?? 'Learning Path'} />
      {!path && <h1 className="sr-only">Learning Path</h1>}
      <Breadcrumbs
        items={[
          { label: 'Katalog', to: '/catalog?type=paths' },
          { label: path?.title ?? 'Learning Path' },
        ]}
      />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState error={resource.error} retry={resource.retry} />
      ) : (
        path && (
          <>
            <header className="detail-header">
              <div>
                <div className="detail-type">
                  <Icon name="route" />
                  <span>Learning Path</span>
                </div>
                <h1>{path.title}</h1>
                <p className="detail-description">{path.description}</p>
              </div>
              <div className="detail-stamp detail-stamp--sky">
                <strong>{path.courseCount}</strong>
                <span>course dalam path ini</span>
                <span className="stamp-rule" />
                <span>
                  Ikuti urutannya.
                  <br />
                  Buka ruang untuk mencoba.
                </span>
              </div>
            </header>
            <section aria-labelledby="path-courses">
              <div className="section-heading">
                <h2 id="path-courses">Course dalam path ini</h2>
                <span>Disusun sesuai urutan materi</span>
              </div>
              {path.courses.length ? (
                <ol className="ordered-course-grid">
                  {path.courses.map((course, i) => (
                    <li key={course.id}>
                      <CourseCard course={course} order={i + 1} />
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyState title="Course belum tersedia">
                  Course pada path ini sedang disiapkan.
                </EmptyState>
              )}
            </section>
            <Link className="back-link" to="/catalog?type=paths">
              Kembali ke learning path
              <Icon name="arrow" />
            </Link>
          </>
        )
      )}
    </div>
  )
}

export function Curriculum({
  course,
  currentLesson,
  compact = false,
}: {
  course: CourseDetail
  currentLesson?: string
  compact?: boolean
}) {
  return (
    <div className={compact ? 'curriculum curriculum--compact' : 'curriculum'}>
      {[...course.modules]
        .sort((a, b) => a.position - b.position)
        .map((module) => (
          <details className="module" key={module.id} open>
            <summary>
              <span className="module-index" aria-hidden="true">
                {String(module.position).padStart(2, '0')}
              </span>
              <span>
                {module.title}
                <span className="module-count">
                  {module.lessons.filter((lesson) => lesson.isFree).length}{' '}
                  lesson gratis
                </span>
              </span>
              <span className="module-chevron">
                <Icon name="chevron" size={18} />
              </span>
            </summary>
            {module.lessons.filter((lesson) => lesson.isFree).length ? (
              <ol className="lesson-list">
                {[...module.lessons]
                  .sort((a, b) => a.position - b.position)
                  .filter((lesson) => lesson.isFree)
                  .map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        to={`/courses/${course.id}/lessons/${lesson.id}`}
                        aria-current={
                          currentLesson === lesson.id ? 'page' : undefined
                        }
                      >
                        <span className="lesson-index" aria-hidden="true">
                          {lesson.position}
                        </span>
                        <span className="lesson-title">{lesson.title}</span>
                        {!compact && <Badge tone="lime">Gratis</Badge>}
                        <Icon name="arrow" size={18} />
                      </Link>
                    </li>
                  ))}
              </ol>
            ) : (
              <p className="module-empty">Lesson belum tersedia.</p>
            )}
          </details>
        ))}
    </div>
  )
}

export function CourseDetailScreen() {
  const { courseId = '' } = useParams()
  const resource = useResource(`course:${courseId}`, async (signal) => {
    if (!validId(courseId)) throw new PublicApiError(400)
    const result = await publicRead(
      `/courses/${courseId}`,
      parseCourseDetail,
      signal,
    )
    if (result.data.id !== courseId) throw new PublicApiError(502)
    return result
  })
  useEffect(() => {
    if (resource.value) window.dispatchEvent(new Event('learning:ready'))
  }, [resource.value])
  const course = resource.value?.data,
    first = course && flattenLessons(course)[0]
  return (
    <div className="page">
      <PageTitle title={course?.title ?? 'Course'} />
      {!course && <h1 className="sr-only">Course</h1>}
      <Breadcrumbs
        items={[
          { label: 'Katalog', to: '/catalog?type=courses' },
          { label: course?.title ?? 'Course' },
        ]}
      />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState error={resource.error} retry={resource.retry} />
      ) : (
        course && (
          <>
            <header className="detail-header course-header">
              <div>
                <div className="detail-type">
                  <Icon name="book" />
                  <span>Course</span>
                </div>
                <h1>{course.title}</h1>
                <p className="detail-description">{course.description}</p>
                <div className="metadata-row">
                  <Badge tone="lime">
                    {course.freeLessonCount} lesson gratis
                  </Badge>
                  <span>{course.modules.length} module</span>
                </div>
              </div>
              <div className="course-art" aria-hidden="true">
                <div className="art-page art-page--back" />
                <div className="art-page art-page--front">
                  <Icon name="book" size={64} />
                  <span>
                    Ide baru
                    <br />
                    dimulai di sini.
                  </span>
                </div>
              </div>
            </header>
            <div className="course-layout">
              <section aria-labelledby="curriculum-title">
                <div className="section-heading">
                  <h2 id="curriculum-title">Di dalam course ini</h2>
                </div>
                {course.modules.length ? (
                  <Curriculum course={course} />
                ) : (
                  <EmptyState title="Lesson belum tersedia">
                    Materi course ini sedang disiapkan.
                  </EmptyState>
                )}
              </section>
              <aside className="reading-entry">
                <Badge tone="lime">Terbuka untuk Guest</Badge>
                <h2>
                  Siap membuka
                  <br />
                  halaman pertama?
                </h2>
                <p>Materi gratis dapat dibaca langsung, tanpa membuat akun.</p>
                {first ? (
                  <Link
                    className="button button--primary"
                    to={`/courses/${course.id}/lessons/${first.id}`}
                  >
                    Baca lesson pertama
                    <Icon name="arrow" />
                  </Link>
                ) : (
                  <p className="muted">Lesson belum tersedia.</p>
                )}
                <p className="entry-note">
                  Membaca materi tidak menghasilkan kelulusan resmi.
                </p>
              </aside>
            </div>
            <Link className="back-link" to="/catalog?type=courses">
              Kembali ke katalog course
              <Icon name="arrow" />
            </Link>
          </>
        )
      )}
    </div>
  )
}
