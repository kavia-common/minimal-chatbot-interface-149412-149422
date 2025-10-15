 // PUBLIC_INTERFACE
 /**
  * getBackendBaseURL determines the base URL for the backend API.
  *
  * Resolution precedence:
  * 1) VITE_BACKEND_URL if provided (must resolve to absolute; trailing slash trimmed).
  *    - When this is set, proxy usage is disabled (absolute URL used).
  * 2) Local development (Vite dev server on port 3000 with localhost/127.0.0.1/::1):
  *    - Return "" so requests use the Vite proxy for /chat -> http://localhost:3001.
  * 3) Otherwise (e.g., cloud preview or any non-local host):
  *    - Use the same host as the current page but force port 3001.
  *    - Example: https://vscode-internal-33666-beta.beta01.cloud.kavia.ai:3001
  * 4) Final fallback: http://localhost:3001
  *
  * Returns a string which may be:
  *  - Absolute URL string (e.g., "http://localhost:3001")
  *  - Empty string "" to indicate "use relative path" (only in local dev for proxy)
  */
export function getBackendBaseURL() {
  let resolved = 'http://localhost:3001';
  try {
    const envBaseRaw = (import.meta?.env?.VITE_BACKEND_URL || '').toString().trim();

    // If env var is present, prefer it and avoid proxy usage (always absolute)
    if (envBaseRaw) {
      if (/^https?:\/\//i.test(envBaseRaw)) {
        resolved = envBaseRaw.replace(/\/+$/, '');
      } else if (typeof window !== 'undefined' && window.location?.origin) {
        const abs = new URL(envBaseRaw, window.location.origin).toString();
        resolved = abs.replace(/\/+$/, '');
      } else {
        resolved = envBaseRaw.replace(/\/+$/, '');
      }
      if (import.meta?.env?.DEV) {
        // eslint-disable-next-line no-console
        console.info(`[api] Backend base URL (from VITE_BACKEND_URL): ${resolved}`);
      }
      return resolved;
    }

    // No env var provided
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname || '';
      const isLocalhost =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '[::1]';

      const port = window.location.port;

      // If we're on the local Vite dev server, use relative path so proxy applies
      if (isLocalhost && port === '3000') {
        if (import.meta?.env?.DEV) {
          // eslint-disable-next-line no-console
          console.info('[api] Using Vite dev proxy for /chat -> http://localhost:3001');
        }
        return ''; // relative base -> '/chat'
      }

      // Otherwise, use same host with backend port 3001 (covers cloud preview)
      const u = new URL(window.location.origin);
      u.port = '3001';
      resolved = u.origin.replace(/\/+$/, '');
    }
  } catch {
    // noop — resolved remains as final fallback 'http://localhost:3001'
  }

  if (import.meta?.env?.DEV) {
    // eslint-disable-next-line no-console
    console.info(`[api] Backend base URL (auto-derived): ${resolved}`);
  }
  return resolved;
}

/**
 * PUBLIC_INTERFACE
 * postChat sends a message to the backend /chat endpoint and returns parsed JSON.
 * - Uses proper JSON headers.
 * - Surfaces non-2xx responses as errors with the backend-supplied message where possible.
 * - Includes raw response text fallback and request context in error messages.
 * - Safe to call from the UI; it will throw on network/HTTP errors.
 */
export async function postChat(message) {
  const base = getBackendBaseURL();
  const url = base ? `${base.replace(/\/+$/, '')}/chat` : `/chat`;

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      // Stateless request; do not include credentials
      body: JSON.stringify({ message }),
    });
  } catch (err) {
    // Network error (CORS, DNS, connection refused, etc.)
    const reason = err?.message || 'Network error';
    throw new Error(`Failed to fetch ${url} [POST]: ${reason}`);
  }

  // Capture raw text for richer error messages, then attempt JSON parse.
  let rawText = '';
  try {
    rawText = await res.clone().text();
  } catch {
    rawText = '';
  }

  // Attempt to parse JSON (even for error responses if possible)
  let data = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON or empty response
    data = {};
  }

  if (!res.ok) {
    const backendMsg =
      (data && (data.error || data.detail || data.message)) ||
      (rawText ? rawText.slice(0, 500) : null);
    const statusText = res.statusText || 'Request failed';
    const msg = backendMsg
      ? `${backendMsg} (HTTP ${res.status})`
      : `${statusText} (HTTP ${res.status})`;
    throw new Error(`POST ${url} failed: ${msg}`);
  }

  return data;
}
