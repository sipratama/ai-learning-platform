import { useEffect, useState } from 'react'
import { PublicApiError, type PublicResponse } from './api/public'

export function useResource<T>(
  key: string,
  load: (signal: AbortSignal) => Promise<PublicResponse<T>>,
) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{
    key: string
    attempt: number
    value?: PublicResponse<T>
    error?: PublicApiError
  }>()
  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal).then(
      (value) => {
        if (!controller.signal.aborted) setState({ key, attempt, value })
      },
      (error: unknown) => {
        if (!controller.signal.aborted)
          setState({
            key,
            attempt,
            error:
              error instanceof PublicApiError ? error : new PublicApiError(0),
          })
      },
    )
    return () => controller.abort()
    // The resource key identifies the request; functions are intentionally not identities.
    // eslint has no hook dependency rule in this repository.
  }, [key, attempt])
  const current =
    state?.key === key && state.attempt === attempt ? state : undefined
  return {
    value: current?.value,
    error: current?.error,
    loading: !current,
    retry: () => setAttempt((n) => n + 1),
  }
}
