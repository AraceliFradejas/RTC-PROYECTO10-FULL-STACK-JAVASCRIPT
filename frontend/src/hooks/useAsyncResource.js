import { useCallback, useEffect, useState } from "react";

// The caller memoizes load; changing it cancels the previous request.
export const useAsyncResource = (
  load,
  { initialData = null, enabled = true } = {},
) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError("");
    Promise.resolve()
      .then(() => load(controller.signal))
      .then((value) => {
        if (!controller.signal.aborted) setData(value);
      })
      .catch((failure) => {
        if (!controller.signal.aborted && failure.name !== "AbortError")
          setError(failure.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [load, enabled, revision]);

  return { data, setData, loading, error, reload };
};
