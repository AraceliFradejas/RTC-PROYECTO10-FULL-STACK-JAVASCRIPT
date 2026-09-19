import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiRequest } from './api.js';

afterEach(() => vi.unstubAllGlobals());

describe('apiRequest', () => {
  it('añade el token y serializa cuerpos JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', fetchMock);
    await apiRequest('/events', { method: 'POST', token: 'token-demo', body: { title: 'Taller' } });
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/events'), expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer token-demo', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ title: 'Taller' }),
    }));
  });

  it('convierte la respuesta de error en ApiError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 409, json: async () => ({ error: { message: 'Evento completo' } }) }));
    await expect(apiRequest('/events/1/attendance')).rejects.toEqual(expect.objectContaining({
      message: 'Evento completo', status: 409,
    }));
    await apiRequest('/events/1/attendance').catch((error) => expect(error).toBeInstanceOf(ApiError));
  });
});


describe('errores de conexión traducibles', () => {
  it('normaliza los mensajes del navegador cuando no hay conexión', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(apiRequest('/events')).rejects.toEqual(expect.objectContaining({
      message: 'No podemos conectar con el servidor. Inténtalo de nuevo más tarde.', status: 0,
    }));
  });
  it('conserva AbortError para evitar avisos al abandonar una página', async () => {
    const abort = new DOMException('Aborted', 'AbortError');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abort));
    await expect(apiRequest('/events')).rejects.toBe(abort);
  });
});

describe('caducidad de sesión y tiempo de espera', () => {
  it('notifica solo un 401 autenticado y permite retirar el observador', async () => {
    const { onUnauthorized } = await import('./api.js');
    const listener = vi.fn();
    const unsubscribe = onUnauthorized(listener);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 401, ok: false, json: async () => ({}) }));
    try {
      await apiRequest('/auth/login').catch(() => {});
      expect(listener).not.toHaveBeenCalled();
      await apiRequest('/events/1', { token: 'expired' }).catch(() => {});
      expect(listener).toHaveBeenCalledWith('expired');
    } finally { unsubscribe(); }
    await apiRequest('/events/1', { token: 'expired' }).catch(() => {});
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it('cancela una petición bloqueada y devuelve un error comprensible', async () => {
    vi.stubGlobal('fetch', vi.fn((_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    })));
    await expect(apiRequest('/events', { timeoutMs: 5 })).rejects.toMatchObject({ message: 'El servidor tarda demasiado. Inténtalo de nuevo.', status: 0 });
  });
  it('conserva la cancelación al abandonar una página', async () => {
    const controller = new AbortController();
    vi.stubGlobal('fetch', vi.fn((_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    })));
    const request = apiRequest('/events', { signal: controller.signal });
    controller.abort();
    await expect(request).rejects.toMatchObject({ name: 'AbortError' });
  });
});
