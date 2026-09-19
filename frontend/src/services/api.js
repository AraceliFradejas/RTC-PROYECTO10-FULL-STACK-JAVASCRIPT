const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const unauthorizedListeners = new Set();

export const onUnauthorized = listener => {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
};

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body, token, signal, timeoutMs = 20000 } = options;
  const isFormData = body instanceof FormData;
  const controller = new AbortController();
  let timedOut = false;
  const cancel = () => controller.abort();
  if (signal?.aborted) cancel();
  signal?.addEventListener('abort', cancel, { once: true });
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        ...(!isFormData && body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
    if (response.status === 401 && token) {
      for (const listener of unauthorizedListeners) listener(token);
    }
    if (response.status === 204) return null;
    let payload;
    try { payload = await response.json(); }
    catch (error) {
      if (controller.signal.aborted || error.name === 'AbortError') throw error;
      payload = {};
    }
    if (!response.ok) throw new ApiError(payload.error?.message || 'No hemos podido completar la petición.', response.status, payload.error?.details);
    return payload;
  } catch (error) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    if (timedOut) throw new ApiError('El servidor tarda demasiado. Inténtalo de nuevo.', 0);
    if (error instanceof ApiError || error.name === 'AbortError') throw error;
    throw new ApiError('No podemos conectar con el servidor. Inténtalo de nuevo más tarde.', 0);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
};
