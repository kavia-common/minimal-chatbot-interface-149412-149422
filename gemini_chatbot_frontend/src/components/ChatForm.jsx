import React, { useState } from 'react'

/**
 * PUBLIC_INTERFACE
 * ChatForm renders the input area and submit button.
 * Props:
 * - onSubmit(message: string): void | Promise<void>
 * - loading: boolean
 */
export default function ChatForm({ onSubmit, loading }) {
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    await onSubmit?.(message)
  }

  return (
    <form onSubmit={submit} className="chat-form" style={{ display: 'grid', gap: 12 }}>
      <textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
        aria-label="Message input"
      />
      <div className="actions">
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  )
}
