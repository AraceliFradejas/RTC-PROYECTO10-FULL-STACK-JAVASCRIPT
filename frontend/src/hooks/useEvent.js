import { useCallback } from "react";
import { getEvent } from "../services/events.js";
import { useAsyncResource } from "./useAsyncResource.js";

export const useEvent = (id) => {
  const load = useCallback(
    async (signal) => {
      const { data } = await getEvent(id, { signal });
      return data;
    },
    [id],
  );
  const { data: event, setData: setEvent, ...state } = useAsyncResource(load);
  return { event, setEvent, ...state };
};
