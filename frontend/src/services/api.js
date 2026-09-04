const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body, token, signal } = options;
  const isFormData = body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    method,
    signal,
    headers: {
      ...(!isFormData && body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(payload.error?.message || 'No hemos podido completar la petición.', response.status, payload.error?.details);
  return payload;
};

