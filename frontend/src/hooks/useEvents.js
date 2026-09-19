import { useCallback } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getEvents } from "../services/events.js";
import { useAsyncResource } from "./useAsyncResource.js";

export const useEvents = (query = "") => {
  const { language } = useLanguage();
  const load = useCallback(
    async (signal) => {
      const { data } = await getEvents(query, { signal, language });
      return data;
    },
    [query, language],
  );
  const {
    data: events,
    loading,
    error,
    reload,
  } = useAsyncResource(load, { initialData: [] });
  return { events, loading, error, reload };
};
