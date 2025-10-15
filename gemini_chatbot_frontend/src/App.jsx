import React, { useState } from 'react'

const API_URL = 'http://localhost:3001/chat'

export default function App(){
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function sendMessage(){
    setError('')
    setReply('')
    const text = message.trim()
    if(!text){
      setError('Please enter a message.')
      return
    }
    setLoading(true)
    try{
      const res = await fetch(API_URL, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()
      if(!res.ok){
        const errMsg = (data && (data.error || data.detail)) || 'Request failed'
        throw new Error(errMsg)
      }
      setReply(data.reply || '')
    }catch(e){
      setError(e.message || 'Something went wrong')
    }finally{
      setLoading(false)
    }
  }

  function retry(){
    sendMessage()
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
            <button className="button secondary" onClick={retry}>Retry</button>
          </div>
        )}

        <div className="form">
          <textarea
            placeholder="Type your message..."
            value={message}
            onChange={e=>setMessage(e.target.value)}
            disabled={loading}
          />
          <div className="actions">
            <button className="button" onClick={sendMessage} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>

        <div style={{height:12}} />

        <div className="panel" aria-live="polite">
          {reply ? reply : (loading ? 'Awaiting response...' : 'Response will appear here.')}
        </div>
      </div>
    </div>
  )
}
