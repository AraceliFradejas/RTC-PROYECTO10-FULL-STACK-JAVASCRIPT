// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEventEditor } from './useEventEditor.js';
import { getEvent } from '../services/events.js';
import { apiRequest } from '../services/api.js';
import { localDateTime } from '../utils/eventEditing.js';

const { navigate, notify, auth } = vi.hoisted(() => ({
  navigate: vi.fn(), notify: vi.fn(), auth: { user: { id: 'owner', role: 'user' }, token: 'test-token' },
}));
vi.mock('react-router-dom', () => ({ useNavigate: () => navigate }));
vi.mock('../context/AuthContext.jsx', () => ({ useAuth: () => auth }));
vi.mock('../context/ToastContext.jsx', () => ({ useToast: () => ({ notify }) }));
vi.mock('../services/events.js', () => ({ getEvent: vi.fn(), previewMode: false }));
vi.mock('../services/api.js', () => ({ apiRequest: vi.fn() }));

const savedEvent = {
  _id: 'event-1', creator: 'owner', title: 'Experiencia anterior',
  date: '2020-03-15T18:30:42.000Z', location: 'Madrid', category: 'Bienestar',
  speakerId: '', capacity: 50, description: 'Una descripción suficientemente extensa del evento.',
  poster: { url: 'https://example.com/poster.webp' },
};
let root, container, editor;
function Probe({ id }) { editor = useEventEditor(id); return null; }
const render = (id) => act(async () => root.render(<Probe id={id} />));
const submit = () => editor.submit({ preventDefault: vi.fn() });
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  getEvent.mockResolvedValue({ data: savedEvent });
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe('useEventEditor editing flows', () => {
  it('prefills an existing event and saves a description change without altering its past date or poster', async () => {
    await render('event-1');
    expect(editor.fetching).toBe(false);
    expect(editor.values.date).toBe(localDateTime(savedEvent.date));
    expect(editor.values.title).toBe(savedEvent.title);
    await act(async () => editor.update({ target: { name: 'description', value: 'Descripción corregida después de celebrar el evento.' } }));
    apiRequest.mockResolvedValue({ data: savedEvent });
    await act(async () => submit());
    const [url, request] = apiRequest.mock.calls[0];
    expect(url).toBe('/events/event-1');
    expect(request.method).toBe('PATCH');
    expect(request.token).toBe('test-token');
    expect(request.body.get('date')).toBe(savedEvent.date);
    expect(request.body.get('description')).toBe('Descripción corregida después de celebrar el evento.');
    expect(request.body.has('poster')).toBe(false);
    expect(notify).toHaveBeenCalledWith('Cambios guardados.');
    expect(navigate).toHaveBeenCalledWith('/events/event-1');
  });

  it('blocks editing and submission when the loaded event belongs to another user', async () => {
    getEvent.mockResolvedValue({ data: { ...savedEvent, creator: 'someone-else' } });
    await render('event-1');
    expect(editor.loadError).toContain('Solo la persona creadora');
    await act(async () => submit());
    expect(apiRequest).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('preserves entered values and shows the server error when saving fails', async () => {
    await render('event-1');
    await act(async () => editor.update({ target: { name: 'title', value: 'Título corregido' } }));
    apiRequest.mockRejectedValue(new Error('El aforo no puede ser inferior al número de asistentes.'));
    await act(async () => submit());
    expect(editor.errors.form).toContain('aforo');
    expect(editor.values.title).toBe('Título corregido');
    expect(editor.loading).toBe(false);
    expect(notify).toHaveBeenCalledWith(editor.errors.form, 'error');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('validates new events without fetching or sending an incomplete form', async () => {
    await render(undefined);
    expect(getEvent).not.toHaveBeenCalled();
    await act(async () => submit());
    expect(editor.errors).toHaveProperty('title');
    expect(editor.errors).toHaveProperty('date');
    expect(apiRequest).not.toHaveBeenCalled();
    expect(editor.loading).toBe(false);
  });
});
