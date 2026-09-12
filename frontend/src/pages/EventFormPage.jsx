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
    if (poster && poster.size > 5 * 1024 * 1024) next.poster = 'La imagen no puede superar 5 MB.';
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
    <form className="event-form" onSubmit={submit} noValidate>{errors.form && <div className="form-alert" role="alert">{t(errors.form)}</div>}
      <label className="field--full">{t("Título del evento")}<input name="title" value={values.title} onChange={update} placeholder={t("Ej. Liderar cuando el marcador va en contra")} />{errors.title && <small className="field-error">{t(errors.title)}</small>}</label>
      <label>{t("Fecha y hora")}<input type="datetime-local" name="date" value={values.date} onChange={update} />{errors.date && <small className="field-error">{t(errors.date)}</small>}</label>
      <label>{t("Lugar")}<input name="location" value={values.location} onChange={update} placeholder={t("Espacio y barrio")} />{errors.location && <small className="field-error">{t(errors.location)}</small>}</label>
      <label>{t("Categoría")}<select name="category" value={values.category} onChange={update}>{['Liderazgo', 'Resiliencia', 'Equipo', 'Rendimiento', 'Innovación', 'Bienestar', 'Otros'].map(item => <option key={item} value={item}>{t(item)}</option>)}</select></label>
      <label>{t("Aforo")}<input type="number" name="capacity" min="1" max="10000" value={values.capacity} onChange={update} /></label>
      <label className="field--full">{t("Ponente")}<select name="speakerId" value={values.speakerId} onChange={update}><option value="">{t("Ponente por confirmar")}</option>{speakers.map(speaker => <option key={speaker.id} value={speaker.id}>{speaker.name}</option>)}</select><small>{t("Elige quién dará la charla. La persona organizadora se guarda por separado.")}</small></label>
      <label className="field--full">{t("Descripción")}<textarea name="description" value={values.description} onChange={update} rows="6" placeholder={t("Qué aprenderá el público, quién dará la charla y a quién va dirigida…")} />{errors.description && <small className="field-error">{t(errors.description)}</small>}<small>{values.description.length}/1200</small></label>
      <label className="upload-field field--full"><ImagePlus /><span><strong>{t("Sube un cartel")}</strong><small>{t("JPG, PNG o WebP · máximo 5 MB")}</small></span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPoster(e.target.files[0])} /><span>{poster?.name || t("Elegir imagen")}</span>{errors.poster && <small className="field-error">{t(errors.poster)}</small>}</label>
      <button className="button button--accent button--wide field--full" disabled={loading}>{loading ? <><span className="mini-spinner" /> {t("Publicando…")}</> : <>{t("Publicar evento")} <Send /></>}</button>
    </form>
  </section>;
};
