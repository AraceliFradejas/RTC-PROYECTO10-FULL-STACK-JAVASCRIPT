import { FormErrors } from '../components/FormErrors.jsx';
import { useLanguage } from "../context/LanguageContext.jsx";
import { ArrowLeft, ImagePlus, Send } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiRequest } from '../services/api.js';
import { speakers } from '../data/speakers.js';
const initial = {
  title: '',
  date: '',
  location: '',
  category: 'Liderazgo',
  speakerId: '',
  capacity: 30,
  description: ''
};
export const EventFormPage = () => {
  const {
    t
  } = useLanguage();
  const [values, setValues] = useState(initial);
  const [poster, setPoster] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    token
  } = useAuth();
  const {
    notify
  } = useToast();
  const navigate = useNavigate();
  const update = event => setValues({
    ...values,
    [event.target.name]: event.target.value
  });
  const submit = async event => {
    event.preventDefault();
    const next = {};
    if (values.title.trim().length < 3) next.title = 'El título necesita al menos 3 caracteres.';
    if (!values.date || new Date(values.date) <= new Date()) next.date = 'Elige una fecha futura.';
    if (!values.location.trim()) next.location = 'Indica dónde será.';
    if (values.description.trim().length < 20) next.description = 'Cuéntanos algo más (mínimo 20 caracteres).';
    if (poster && poster.size > 4 * 1024 * 1024) next.poster = 'La imagen no puede superar 4 MB.';
    if (values.title.trim().length > 100) next.title = 'El título no puede superar 100 caracteres.';
    if (values.location.trim().length > 120) next.location = 'El lugar no puede superar 120 caracteres.';
    if (values.description.trim().length > 1200) next.description = 'La descripción no puede superar 1200 caracteres.';
    if (!Number.isInteger(Number(values.capacity)) || Number(values.capacity) < 1 || Number(values.capacity) > 10000) next.capacity = 'El aforo debe ser un número entero entre 1 y 10000.';
    if (poster && !['image/jpeg', 'image/png', 'image/webp'].includes(poster.type)) next.poster = 'La imagen debe ser JPG, PNG o WebP.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(values).forEach(([key, value]) => form.append(key, value));
      if (poster) form.append('poster', poster);
      const {
        data
      } = await apiRequest('/events', {
        method: 'POST',
        body: form,
        token
      });
      notify('Tu experiencia ya forma parte de la agenda KelseTS.');
      navigate(`/events/${data._id}`);
    } catch (error) {
      setErrors({
        form: error.message
      });
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  return <section className="page page--narrow"><Link className="back-link" to="/events"><ArrowLeft /> {t("Volver a la agenda")}</Link><div className="form-heading"><p className="kicker">{t("Bring your story")}</p><h1>{t("Crea una experiencia")}</h1><p>{t("Diseña una charla que ayude a otras personas a dar su siguiente paso.")}</p></div>
    <form className="event-form" onSubmit={submit} noValidate aria-busy={loading}><FormErrors errors={errors} prefix="event" />
      <label className="field--full">{t("Título del evento")}<input name="title" id="event-title" required aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "event-title-error" : undefined} value={values.title} onChange={update} placeholder={t("Ej. Liderar cuando el marcador va en contra")} />{errors.title && <small id="event-title-error" className="field-error">{t(errors.title)}</small>}</label>
      <label>{t("Fecha y hora")}<input type="datetime-local" name="date" id="event-date" required aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "event-date-error" : undefined} value={values.date} onChange={update} />{errors.date && <small id="event-date-error" className="field-error">{t(errors.date)}</small>}</label>
      <label>{t("Lugar")}<input name="location" id="event-location" required aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? "event-location-error" : undefined} value={values.location} onChange={update} placeholder={t("Espacio y barrio")} />{errors.location && <small id="event-location-error" className="field-error">{t(errors.location)}</small>}</label>
      <label>{t("Categoría")}<select name="category" value={values.category} onChange={update}>{['Liderazgo', 'Resiliencia', 'Equipo', 'Rendimiento', 'Innovación', 'Bienestar', 'Otros'].map(item => <option key={item} value={item}>{t(item)}</option>)}</select></label>
      <label>{t("Aforo")}<input type="number" name="capacity" id="event-capacity" required aria-invalid={Boolean(errors.capacity)} aria-describedby={errors.capacity ? "event-capacity-error" : undefined} min="1" max="10000" value={values.capacity} onChange={update} />{errors.capacity && <small id="event-capacity-error" className="field-error">{t(errors.capacity)}</small>}</label>
      <label className="field--full">{t("Ponente")}<select name="speakerId" value={values.speakerId} onChange={update}><option value="">{t("Ponente por confirmar")}</option>{speakers.map(speaker => <option key={speaker.id} value={speaker.id}>{speaker.name}</option>)}</select><small>{t("Elige quién dará la charla. La persona organizadora se guarda por separado.")}</small></label>
      <label className="field--full">{t("Descripción")}<textarea name="description" id="event-description" required aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "event-description-error" : undefined} value={values.description} onChange={update} rows="6" placeholder={t("Qué aprenderá el público, quién dará la charla y a quién va dirigida…")} />{errors.description && <small id="event-description-error" className="field-error">{t(errors.description)}</small>}<small>{values.description.length}/1200</small></label>
      <label className="upload-field field--full"><ImagePlus /><span><strong>{t("Sube un cartel")}</strong><small id="event-poster-hint">{t("JPG, PNG o WebP · máximo 4 MB")}</small></span><input id="event-poster" aria-invalid={Boolean(errors.poster)} aria-describedby={errors.poster ? "event-poster-error event-poster-hint" : "event-poster-hint"} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPoster(e.target.files[0])} /><span>{poster?.name || t("Elegir imagen")}</span>{errors.poster && <small id="event-poster-error" className="field-error">{t(errors.poster)}</small>}</label>
      <button className="button button--accent button--wide field--full" disabled={loading}>{loading ? <><span className="mini-spinner" /> {t("Publicando…")}</> : <>{t("Publicar evento")} <Send /></>}</button>
    </form>
  </section>;
};
