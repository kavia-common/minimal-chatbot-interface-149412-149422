 // PUBLIC_INTERFACE
 /**
  * postChat sends a message to the backend /chat endpoint and returns parsed JSON.
  * It reads base URL from VITE_BACKEND_URL, defaulting to http://localhost:3001.
  */
 export async function postChat(message) {
   const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
   const url = `${base.replace(/\/+$/, '')}/chat`
   const res = await fetch(url, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     // Do not include credentials to keep it stateless and CORS-friendly
     body: JSON.stringify({ message }),
   })
   let data = null
   try {
     data = await res.json()
   } catch {
     // Non-JSON or empty response
     data = {}
   }
   if (!res.ok) {
     const errMsg = data?.error || data?.detail || `Request failed (${res.status})`
     throw new Error(errMsg)
   }
   return data
 }
