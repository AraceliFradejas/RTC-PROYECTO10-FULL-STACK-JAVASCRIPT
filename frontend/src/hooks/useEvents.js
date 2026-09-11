import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getEvents } from '../services/events.js';

export const useEvents = (query = '') => {
  const { language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async signal => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getEvents(query, { signal, language });
      if (!signal?.aborted) setEvents(data);
    } catch (requestError) {
      if (!signal?.aborted && requestError.name !== 'AbortError') setError(requestError.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [query, language]);
  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);
  return { events, loading, error, reload: () => load() };
};
