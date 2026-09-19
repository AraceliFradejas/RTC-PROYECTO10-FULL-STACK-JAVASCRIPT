import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvent, previewMode } from "../services/events.js";
import { apiRequest } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  canEditEvent,
  localDateTime,
  eventFormData,
} from "../utils/eventEditing.js";
import { initialEventValues, validateEventForm } from "../utils/eventForm.js";
import { useAsyncResource } from "./useAsyncResource.js";

export const useEventEditor = (id) => {
  const editing = Boolean(id);
  const { user, token } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialEventValues);
  const [poster, setPoster] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const load = useCallback(
    async (signal) => {
      const { data } = await getEvent(id, { signal });
      if (previewMode || !canEditEvent(data, user))
        throw new Error(
          "Solo la persona creadora puede modificar este evento.",
        );
      return data;
    },
    [id, user?.id, user?.role],
  );
  const {
    data: original,
    loading: fetching,
    error: loadError,
  } = useAsyncResource(load, { enabled: editing });
  useEffect(() => {
    if (!original) return;
    setValues(
      Object.fromEntries(
        Object.keys(initialEventValues).map((key) => [
          key,
          key === "date"
            ? localDateTime(original.date)
            : (original[key] ?? initialEventValues[key]),
        ]),
      ),
    );
    setPoster(null);
    setErrors({});
  }, [original]);
  const update = (event) =>
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  const submit = async (event) => {
    event.preventDefault();
    if (loading || fetching || (editing && !original)) return;
    const next = validateEventForm(values, poster, original);
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const form = eventFormData(values, poster, original);
      const { data } = await apiRequest(editing ? `/events/${id}` : "/events", {
        method: editing ? "PATCH" : "POST",
        body: form,
        token,
      });
      notify(
        editing
          ? "Cambios guardados."
          : "Tu experiencia ya forma parte de la agenda KelseTS.",
      );
      navigate(`/events/${data._id}`);
    } catch (error) {
      setErrors({
        form: error.message,
      });
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  return {
    editing,
    original,
    fetching,
    loadError,
    values,
    update,
    poster,
    setPoster,
    errors,
    loading,
    submit,
  };
};
