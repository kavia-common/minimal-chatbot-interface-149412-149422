# Gemini Chatbot Frontend (React + Vite)

Minimal React frontend to send a message to the FastAPI backend and display Gemini's reply.

## Setup
1. Install dependencies:
   npm install
2. Configure backend URL (optional but recommended outside local dev):
   - Copy .env.example to .env
   - Set VITE_BACKEND_URL to your backend's base URL (e.g. http://localhost:3001)
3. Run the dev server (port 3000):
   npm run dev
   # or
   npm start

Notes:
- The dev server binds to 0.0.0.0 on port 3000 to work in preview environments.
- Build and preview:
   npm run build
   npm run preview

## Backend URL resolution
The frontend resolves the backend base URL in this order:
1) VITE_BACKEND_URL if provided (absolute URL recommended; trailing `/` is trimmed).
2) When running the Vite dev server (port 3000), it uses a relative path so requests to `/chat` are proxied to http://localhost:3001 (configured in vite.config.js).
3) Otherwise, it falls back to `window.location.origin` but forces port `3001`.
4) Final fallback: `http://localhost:3001`.

This ensures local development works without extra CORS configuration while allowing explicit configuration via VITE_BACKEND_URL for deployed environments.

## Usage
- Type a message and click Send.
- The app POSTs to `${baseURL}/chat` where `baseURL` is determined above, and displays the reply from `{ reply }`.
- Errors (network issues or non-2xx responses) are shown inline with a Dismiss option.

## Theme
Ocean Professional:
- Primary: #2563EB (blue)
- Accent/Success: #F59E0B (amber)
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827

Modern, centered layout with rounded corners, subtle shadows, and gentle gradients.

## Notes
- Stateless per request; no authentication or persistence.
- CORS-friendly fetch (no credentials). During local dev, the Vite proxy handles same-origin for `/chat`.
- Ensure your `index.html` exists (it does in this project at the root of the frontend) and loads `/src/main.jsx`.
