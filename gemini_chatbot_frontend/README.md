# Gemini Chatbot Frontend (React + Vite)

Minimal React frontend to send a message to the FastAPI backend and display Gemini's reply.

## Setup
1. Install dependencies:
   npm install
2. Optional: configure backend URL via .env:
   - Copy .env.example to .env and edit VITE_BACKEND_URL (defaults to http://localhost:3001)
3. Run the dev server (port 3000):
   npm run dev

## Usage
- Type a message and click Send.
- The app POSTs to `${VITE_BACKEND_URL || http://localhost:3001}/chat` and displays the reply from { reply }.
- Errors show inline with a Dismiss option.

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
- CORS-friendly fetch (no credentials). Ensure the backend enables CORS for origin http://localhost:3000 during development.
