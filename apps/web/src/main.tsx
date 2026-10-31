import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { resolveApiBaseUrl } from './lib/api/config'
import './styles/index.css'

const defaultApiBaseUrl = window.location.origin

resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, defaultApiBaseUrl)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
