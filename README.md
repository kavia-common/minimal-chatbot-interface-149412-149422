# minimal-chatbot-interface-149412-149422

This workspace contains the Gemini chatbot frontend.

## Frontend (gemini_chatbot_frontend)
- React + Vite app with Ocean Professional theme.
- Provides a minimal chat interface that POSTs to the backend `/chat` endpoint.
- Configure backend URL with `VITE_BACKEND_URL` (default: http://localhost:3001).

## Backend Verification
A sibling workspace exists for the backend: `minimal-chatbot-interface-149412-149421/gemini_chatbot_backend`.

Findings:
- The repository includes an OpenAPI spec at:
  minimal-chatbot-interface-149412-149421/gemini_chatbot_backend/interfaces/openapi.json
- That spec documents:
  - A FastAPI app (implied by schema) with:
    - GET `/` health endpoint.
    - POST `/chat` accepting `{ "message": string }` and returning `{ "reply": string }`.
- However, only the OpenAPI JSON spec is visible in this repo snapshot. The actual FastAPI application source code files (e.g., main.py/app.py) are not present in the provided file list here.
- Conclusion: The API contract for `/chat` exists (via openapi.json), but the concrete backend implementation code is not shown in this container’s workspace view. Ensure the backend service is running at port 3001 and exposes `/chat` per the spec.

## Development
- Start frontend:
  cd gemini_chatbot_frontend
  npm install
  npm run dev

Ensure the backend is available at `VITE_BACKEND_URL` and has CORS enabled for the frontend origin.
