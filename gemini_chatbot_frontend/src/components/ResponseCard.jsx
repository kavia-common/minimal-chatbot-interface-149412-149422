import React from 'react'

/**
 * PUBLIC_INTERFACE
 * ResponseCard shows the model's reply or a placeholder/loading text.
 * Props:
 * - reply: string
 * - loading: boolean
 */
export default function ResponseCard({ reply, loading }) {
  const content = reply
    ? reply
    : loading
      ? 'Awaiting response...'
      : 'Response will appear here.'
  return (
    <div className="panel" aria-live="polite">
      {content}
    </div>
  )
}
