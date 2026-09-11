import { apiRequest, ApiError } from './api.js';
import { localizeEvent } from '../i18n/events.js';
import { translate } from '../i18n/translate.js';

// Explicit, development-only preview. API failures never silently enable it.
export const previewMode = import.meta.env.DEV && import.meta.env.VITE_PREVIEW_MODE === 'true';
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();

export const filterPreviewEvents = (events, query = '', language = 'es') => {
  const params = new URLSearchParams(query);
  const search = normalize(params.get('search') || '');
  const category = params.get('category');
  return events.filter(event => {
    const content = localizeEvent(event, language);
    const text = normalize([content.title, content.description, event.location, translate(language, event.category)].join(' '));
    return (!category || category === event.category) && (!search || text.includes(search));
  }).sort((a, b) => {
    if (params.get('sort') === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (params.get('sort') === 'popular') return b.attendees.length - a.attendees.length || new Date(a.date) - new Date(b.date);
    return new Date(a.date) - new Date(b.date);
  });
};
const getPreviewEvents = async signal => {
  signal?.throwIfAborted();
  const { default: events } = await import('../data/previewEvents.json');
  signal?.throwIfAborted();
  return events;
};
export const getEvents = async (query, { signal, language = 'es' } = {}) => {
  if (!previewMode) return apiRequest(`/events${query}`, { signal });
  return { data: filterPreviewEvents(await getPreviewEvents(signal), query, language) };
};
export const getEvent = async (id, { signal } = {}) => {
  if (!previewMode) return apiRequest(`/events/${id}`, { signal });
  const events = await getPreviewEvents(signal);
  const event = events.find(item => item._id === id);
  if (!event) throw new ApiError('No hemos encontrado ese evento.', 404);
  return { data: event };
};
