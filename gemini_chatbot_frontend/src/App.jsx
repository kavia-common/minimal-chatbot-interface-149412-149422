import React, { useState } from 'react'
import './styles/theme.css'
import './index.css'
import ChatForm from './components/ChatForm.jsx'
import ResponseCard from './components/ResponseCard.jsx'
import { postChat } from './api/client.js'

/**
 * PUBLIC_INTERFACE
 * App renders a centered chat UI with Ocean Professional theme,
 * handles message submission to backend /chat, and shows loading and error states.
 */
export default function App() {
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(message) {
    setError('')
    setReply('')
    const text = (message || '').trim()
    if (!text) {
      setError('Please enter a message.')
      return
    }
    setLoading(true)
    try {
      const data = await postChat(text)
      // Expect { reply } but best-effort fallback to common fields
      const best = data?.reply ?? data?.text ?? data?.message ?? ''
      setReply(String(best || ''))
    } catch (e) {
      const msg = e?.message || 'Something went wrong'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const onRetry = () => {
    setError('')
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <span className="badge">Ocean Professional</span>
          <div className="title">Gemini Chatbot</div>
        </div>

        {error && (
          <div className="error" role="alert">
            <span>{error}</span>
            <button className="button secondary" onClick={onRetry}>Dismiss</button>
          </div>
        )}

        <div className="form">
          <ChatForm onSubmit={handleSubmit} loading={loading} />
        </div>

        <div style={{ height: 12 }} />

        <ResponseCard loading={loading} reply={reply} />
      </div>
    </div>
  )
}
