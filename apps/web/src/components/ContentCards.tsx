import { Link } from 'react-router-dom'
import type { CourseSummary, PathSummary } from '../lib/api/public'
import { Badge, Icon } from './ui'

export function PathCard({ path }: { path: PathSummary }) {
  return (
    <article className="content-card content-card--path">
      <div className="card-top">
        <Badge tone="sky">Learning Path</Badge>
        <span className="card-emblem" aria-hidden="true">
          <Icon name="route" size={30} />
        </span>
      </div>
      <h2>
        <Link className="card-title" to={`/paths/${path.id}`}>
          {path.title}
          <span className="card-arrow">
            <Icon name="arrow" />
          </span>
        </Link>
      </h2>
      <p className="card-summary">{path.summary}</p>
      <div className="card-footer">
        <span>{path.courseCount} course dalam path</span>
        <span className="card-link-hint" aria-hidden="true">
          Lihat path
        </span>
      </div>
    </article>
  )
}

export function CourseCard({
  course,
  order,
}: {
  course: CourseSummary
  order?: number
}) {
  const Heading = order ? 'h3' : 'h2'
  return (
    <article className="content-card content-card--course">
      <div className="card-top">
        {order ? (
          <span className="course-order" aria-label={`Urutan ${order}`}>
            {String(order).padStart(2, '0')}
          </span>
        ) : (
          <Badge>Course</Badge>
        )}
        <span className="card-emblem" aria-hidden="true">
          <Icon name="book" size={30} />
        </span>
      </div>
      <Heading>
        <Link className="card-title" to={`/courses/${course.id}`}>
          {course.title}
          <span className="card-arrow">
            <Icon name="arrow" />
          </span>
        </Link>
      </Heading>
      <p className="card-summary">{course.summary}</p>
      <div className="card-footer">
        <span>{course.freeLessonCount} lesson gratis</span>
        <span className="card-link-hint" aria-hidden="true">
          Buka course
        </span>
      </div>
    </article>
  )
}
