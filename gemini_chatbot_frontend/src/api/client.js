 // PUBLIC_INTERFACE
 /**
  * getBackendBaseURL determines the base URL for the backend API.
  *
  * Resolution precedence:
  * 1) VITE_BACKEND_URL if provided (recommended to be an absolute URL; trailing slash trimmed).
  * 2) When running the Vite dev server (port 3000), use relative '' base so that requests go
  *    through the Vite proxy (configured for /chat -> http://localhost:3001).
  * 3) Otherwise, fall back to window.location.origin but with port 3001 if available.
  * 4) Final fallback: http://localhost:3001
  *
  * Returns a string which may be:
  *  - Absolute URL string (e.g., "http://localhost:3001")
  *  - Empty string "" to indicate "use relative path"
  */
export function getBackendBaseURL() {
  try {
    const envBase = (import.meta?.env?.VITE_BACKEND_URL || '').toString().trim();
    if (envBase) {
      // If it's not an absolute URL, resolve relative to window.location.origin
      // This allows values like "/api" to still work if intentionally used.
      if (/^https?:\/\//i.test(envBase)) {
        return envBase.replace(/\/+$/, '');
      }
      if (typeof window !== 'undefined' && window.location?.origin) {
        const abs = new URL(envBase, window.location.origin).toString();
        return abs.replace(/\/+$/, '');
      }
      // Last resort, return as-is without trailing slash
      return envBase.replace(/\/+$/, '');
    }

    // No env var provided
    if (typeof window !== 'undefined' && window.location) {
      // If we're on the Vite dev server, use relative path so proxy applies
      if (window.location.port === '3000') {
        return ''; // relative base -> '/chat'
      }
      // Otherwise, use same host with backend port 3001
      const u = new URL(window.location.origin);
      u.port = '3001';
      return u.origin.replace(/\/+$/, '');
    }
  } catch {
    // noop — we'll return the hardcoded fallback below
  }
  return 'http://localhost:3001';
}

/**
 * PUBLIC_INTERFACE
 * postChat sends a message to the backend /chat endpoint and returns parsed JSON.
 * - Uses proper JSON headers.
 * - Surfaces non-2xx responses as errors with the backend-supplied message where possible.
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
    throw new Error(`Failed to fetch: ${reason}`);
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
    const backendMsg = data?.error || data?.detail || data?.message;
    const statusText = res.statusText || 'Request failed';
    const msg = backendMsg
      ? `${backendMsg} (HTTP ${res.status})`
      : `${statusText} (HTTP ${res.status})`;
    throw new Error(msg);
  }

  return data;
}
