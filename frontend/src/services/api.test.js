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

