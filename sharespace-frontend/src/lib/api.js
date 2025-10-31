export function getApiBaseUrl() {
  // CRA style env var only; fallback to localhost:5000
  const fromCRA = process.env.REACT_APP_API_BASE_URL;
  return fromCRA || 'http://localhost:5001/api';
}

export async function apiRequest(path, options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const merged = {
    method: 'GET',
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    ...options,
  };
  const res = await fetch(url, merged);
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = isJson && data?.message ? data.message : `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

