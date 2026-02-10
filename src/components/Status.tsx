import { useEffect } from 'react'
import { useAppState } from '../context/useAppState'

export function Status() {
  const { state, dispatch } = useAppState()
  const { status } = state

  useEffect(() => {
    // Auto-dismiss non-error messages after 5 seconds
    if (status && status.type !== 'error') {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_STATUS', payload: null })
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [status, dispatch])

  if (!status) {
    return null
  }

  const bgColorMap = {
    success: 'bg-green-900 border-green-700',
    error: 'bg-red-900 border-red-700',
    warning: 'bg-yellow-900 border-yellow-700',
    info: 'bg-blue-900 border-blue-700',
  }

  const textColorMap = {
    success: 'text-green-100',
    error: 'text-red-100',
    warning: 'text-yellow-100',
    info: 'text-blue-100',
  }

  const role = status.type === 'error' ? 'alert' : 'status'
  const ariaLive = status.type === 'error' ? 'assertive' : 'polite'

  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-label={`${status.type} message: ${status.message}`}
      className={`
        mx-4 mt-2 border-l-4 px-4 py-3 rounded
        ${bgColorMap[status.type]}
        ${textColorMap[status.type]}
        flex items-center justify-between gap-3
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="text-sm">{status.message}</span>
      </div>
      <button
        onClick={() => dispatch({ type: 'SET_STATUS', payload: null })}
        className="text-lg leading-none opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close status message"
      >
        ×
      </button>
    </div>
  )
}
