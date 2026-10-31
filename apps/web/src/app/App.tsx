import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from '../components/Shell'
import { ErrorState, PageTitle } from '../components/ui'
import { PublicApiError } from '../lib/api/public'
import { Catalog } from '../screens/Catalog'
import { CourseDetailScreen, PathDetailScreen } from '../screens/Details'
import { Reader } from '../screens/Reader'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/paths/:pathId" element={<PathDetailScreen />} />
        <Route path="/courses/:courseId" element={<CourseDetailScreen />} />
        <Route
          path="/courses/:courseId/lessons/:lessonId"
          element={<Reader />}
        />
        <Route
          path="*"
          element={
            <div className="page">
              <PageTitle title="Halaman tidak tersedia" />
              <h1>Halaman tidak tersedia</h1>
              <ErrorState error={new PublicApiError(404)} />
            </div>
          }
        />
      </Route>
    </Routes>
  )
}
export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
