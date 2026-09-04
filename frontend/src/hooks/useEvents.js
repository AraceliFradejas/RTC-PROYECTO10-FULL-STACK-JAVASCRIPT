import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../services/api.js';

export const useEvents = (query = '') => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async (signal) => {
    setLoading(true); setError('');
    try {
      const { data } = await apiRequest(`/events${query}`, { signal });
      setEvents(data);
    } catch (requestError) {
      if (requestError.name !== 'AbortError') setError(requestError.message);
    } finally { setLoading(false); }
  }, [query]);
  useEffect(() => { const controller = new AbortController(); load(controller.signal); return () => controller.abort(); }, [load]);
  return { events, loading, error, reload: () => load() };
};

