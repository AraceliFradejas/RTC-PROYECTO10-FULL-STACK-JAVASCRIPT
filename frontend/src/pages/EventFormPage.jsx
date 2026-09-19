import { FormField } from "../components/FormField.jsx";
import { eventCategories } from "../data/eventCategories.js";
import { FormErrors } from "../components/FormErrors.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { ArrowLeft, ImagePlus, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { getEvent, previewMode } from "../services/events.js";
import { Loader } from "../components/Loader.jsx";
import {
  canEditEvent,
  localDateTime,
  eventFormData,
  validEventDate,
} from "../utils/eventEditing.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { apiRequest } from "../services/api.js";
import { speakers } from "../data/speakers.js";
const initial = {
  title: "",
  date: "",
  location: "",
  category: "Liderazgo",
  speakerId: "",
  capacity: 30,
  description: "",
};
export const EventFormPage = () => {
  const { id } = useParams();
  const editing = Boolean(id);
  const [original, setOriginal] = useState(null);
  const [fetching, setFetching] = useState(editing);
  const [loadError, setLoadError] = useState("");
  const { t } = useLanguage();
  const [values, setValues] = useState(initial);
  const [poster, setPoster] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setFetching(true);
    setLoadError('');
    setOriginal(null);
    getEvent(id, { signal: controller.signal })
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        if (previewMode || !canEditEvent(data, user))
          throw new Error(
            "Solo la persona creadora puede modificar este evento.",
          );
        setOriginal(data);
        setValues(
          Object.fromEntries(
            Object.keys(initial).map((key) => [
              key,
              key === "date"
                ? localDateTime(data.date)
                : (data[key] ?? initial[key]),
            ]),
          ),
        );
      })
      .catch((error) => {
        if (!controller.signal.aborted) setLoadError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setFetching(false);
      });
    return () => controller.abort();
  }, [id, user?.id, user?.role]);
  const update = (event) =>
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  const submit = async (event) => {
    event.preventDefault();
    if (loading || fetching || (editing && !original)) return;
    const next = {};
    if (values.title.trim().length < 3)
      next.title = "El título necesita al menos 3 caracteres.";
    if (!validEventDate(values.date, original))
      next.date = "Elige una fecha futura.";
    if (!values.location.trim()) next.location = "Indica dónde será.";
    if (values.description.trim().length < 20)
      next.description = "Cuéntanos algo más (mínimo 20 caracteres).";
    if (poster && poster.size > 4 * 1024 * 1024)
      next.poster = "La imagen no puede superar 4 MB.";
    if (values.title.trim().length > 100)
      next.title = "El título no puede superar 100 caracteres.";
    if (values.location.trim().length > 120)
      next.location = "El lugar no puede superar 120 caracteres.";
    if (values.description.trim().length > 1200)
      next.description = "La descripción no puede superar 1200 caracteres.";
    if (
      !Number.isInteger(Number(values.capacity)) ||
      Number(values.capacity) < 1 ||
      Number(values.capacity) > 10000
    )
      next.capacity = "El aforo debe ser un número entero entre 1 y 10000.";
    if (
      poster &&
      !["image/jpeg", "image/png", "image/webp"].includes(poster.type)
    )
      next.poster = "La imagen debe ser JPG, PNG o WebP.";
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
  if (fetching)
    return <Loader full label={t("Preparando todos los detalles…")} />;
  if (loadError)
    return (
      <section className="page shell">
        <h1>{t("No se puede editar esta charla")}</h1>
        <p role="alert">{t(loadError)}</p>
        <Link className="button button--dark" to={`/events/${id}`}>
          {t("Volver a la charla")}
        </Link>
      </section>
    );
  return (
    <section className="page page--narrow">
      <Link className="back-link" to={editing ? `/events/${id}` : "/events"}>
        <ArrowLeft /> {t(editing ? "Volver a la charla" : "Volver a la agenda")}
      </Link>
      <div className="form-heading">
        <p className="kicker">{t("Bring your story")}</p>
        <h1>{t(editing ? "Editar experiencia" : "Crea una experiencia")}</h1>
        <p>
          {t(
            editing
              ? "Actualiza los datos de tu charla. El cartel se conserva si no eliges otra imagen."
              : "Diseña una charla que ayude a otras personas a dar su siguiente paso.",
          )}
        </p>
      </div>
      <form
        className="event-form"
        onSubmit={submit}
        noValidate
        aria-busy={loading}
      >
        <FormErrors errors={errors} prefix="event" />
        <FormField
          id="event-title"
          label="Título del evento"
          error={errors.title}
          className="field--full"
        >
          <input
            name="title"
            id="event-title"
            required
            value={values.title}
            onChange={update}
            placeholder={t("Ej. Liderar cuando el marcador va en contra")}
          />
        </FormField>
        <FormField id="event-date" label="Fecha y hora" error={errors.date}>
          <input
            type="datetime-local"
            name="date"
            id="event-date"
            required
            value={values.date}
            onChange={update}
          />
        </FormField>
        <FormField id="event-location" label="Lugar" error={errors.location}>
          <input
            name="location"
            id="event-location"
            required
            value={values.location}
            onChange={update}
            placeholder={t("Espacio y barrio")}
          />
        </FormField>
        <FormField id="event-category" label="Categoría">
          <select name="category" value={values.category} onChange={update}>
            {eventCategories.map((item) => (
              <option key={item} value={item}>
                {t(item)}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="event-capacity" label="Aforo" error={errors.capacity}>
          <input
            type="number"
            name="capacity"
            id="event-capacity"
            required
            min="1"
            max="10000"
            value={values.capacity}
            onChange={update}
          />
        </FormField>
        <FormField
          id="event-speakerId"
          label="Ponente"
          className="field--full"
          hint={t(
            "Elige quién dará la charla. La persona organizadora se guarda por separado.",
          )}
        >
          <select name="speakerId" value={values.speakerId} onChange={update}>
            <option value="">{t("Ponente por confirmar")}</option>
            {speakers.map((speaker) => (
              <option key={speaker.id} value={speaker.id}>
                {speaker.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          id="event-description"
          label="Descripción"
          error={errors.description}
          className="field--full"
          hint={`${values.description.length}/1200`}
        >
          <textarea
            name="description"
            id="event-description"
            required
            value={values.description}
            onChange={update}
            rows="6"
            placeholder={t(
              "Qué aprenderá el público, quién dará la charla y a quién va dirigida…",
            )}
          />
        </FormField>
        {editing && original?.poster && (
          <img
            className="field--full"
            src={original.poster}
            alt={t("Cartel actual")}
            style={{ maxWidth: 180, borderRadius: 12 }}
          />
        )}
        <label className="upload-field field--full">
          <ImagePlus />
          <span>
            <strong>{t("Sube un cartel")}</strong>
            <small id="event-poster-hint">
              {t("JPG, PNG o WebP · máximo 4 MB")}
            </small>
          </span>
          <input
            id="event-poster"
            aria-invalid={Boolean(errors.poster)}
            aria-describedby={
              errors.poster
                ? "event-poster-error event-poster-hint"
                : "event-poster-hint"
            }
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setPoster(e.target.files[0])}
          />
          <span>{poster?.name || t("Elegir imagen")}</span>
          {errors.poster && (
            <small id="event-poster-error" className="field-error">
              {t(errors.poster)}
            </small>
          )}
        </label>
        <button
          className="button button--accent button--wide field--full"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="mini-spinner" />{" "}
              {t(editing ? "Guardando…" : "Publicando…")}
            </>
          ) : (
            <>
              {t(editing ? "Guardar cambios" : "Publicar evento")} <Send />
            </>
          )}
        </button>
      </form>
    </section>
  );
};
