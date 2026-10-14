const TOKEN_STORAGE_KEY = 'laptopia_auth_token';

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // The in-memory session still works when browser storage is unavailable.
  }
}

export async function apiRequest(url, options = {}, token = getAuthToken()) {
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 && typeof window !== 'undefined') {
    setAuthToken(null);
    window.dispatchEvent(new Event('laptopia:auth-expired'));
  }
  return response;
}

export async function parseApiResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    throw new Error(data.error || 'The request could not be completed.');
  }
  return data;
}
