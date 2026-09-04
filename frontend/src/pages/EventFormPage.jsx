import { ArrowLeft, ImagePlus, Send } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiRequest } from '../services/api.js';

const initial = { title: '', date: '', location: '', category: 'Arte', capacity: 30, description: '' };
export const EventFormPage = () => {
  const [values, setValues] = useState(initial); const [poster, setPoster] = useState(null); const [errors, setErrors] = useState({}); const [loading, setLoading] = useState(false);
  const { token } = useAuth(); const { notify } = useToast(); const navigate = useNavigate();
  const update = (event) => setValues({ ...values, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); const next = {};
    if (values.title.trim().length < 3) next.title = 'El título necesita al menos 3 caracteres.';
    if (!values.date || new Date(values.date) <= new Date()) next.date = 'Elige una fecha futura.';
    if (!values.location.trim()) next.location = 'Indica dónde será.';
    if (values.description.trim().length < 20) next.description = 'Cuéntanos algo más (mínimo 20 caracteres).';
    if (poster && poster.size > 5 * 1024 * 1024) next.poster = 'La imagen no puede superar 5 MB.';
    setErrors(next); if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const form = new FormData(); Object.entries(values).forEach(([key, value]) => form.append(key, value)); if (poster) form.append('poster', poster);
      const { data } = await apiRequest('/events', { method: 'POST', body: form, token });
      notify('Tu evento ya forma parte de la agenda.'); navigate(`/events/${data._id}`);
    } catch (error) { setErrors({ form: error.message }); notify(error.message, 'error'); }
    finally { setLoading(false); }
  };
  return <section className="page page--narrow"><Link className="back-link" to="/events"><ArrowLeft /> Volver a la agenda</Link><div className="form-heading"><p className="kicker">Comparte una experiencia</p><h1>Crea un evento</h1><p>Da la información necesaria para que nadie se quede con dudas.</p></div>
    <form className="event-form" onSubmit={submit} noValidate>{errors.form && <div className="form-alert" role="alert">{errors.form}</div>}
      <label className="field--full">Título del evento<input name="title" value={values.title} onChange={update} placeholder="Ej. Collage y vermut" />{errors.title && <small className="field-error">{errors.title}</small>}</label>
      <label>Fecha y hora<input type="datetime-local" name="date" value={values.date} onChange={update} />{errors.date && <small className="field-error">{errors.date}</small>}</label>
      <label>Lugar<input name="location" value={values.location} onChange={update} placeholder="Espacio y barrio" />{errors.location && <small className="field-error">{errors.location}</small>}</label>
      <label>Categoría<select name="category" value={values.category} onChange={update}>{['Arte','Música','Diseño','Tecnología','Gastronomía','Bienestar','Otros'].map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Aforo<input type="number" name="capacity" min="1" max="10000" value={values.capacity} onChange={update} /></label>
      <label className="field--full">Descripción<textarea name="description" value={values.description} onChange={update} rows="6" placeholder="Qué ocurrirá, a quién va dirigido y qué conviene traer…" />{errors.description && <small className="field-error">{errors.description}</small>}<small>{values.description.length}/1200</small></label>
      <label className="upload-field field--full"><ImagePlus /><span><strong>Sube un cartel</strong><small>JPG, PNG o WebP · máximo 5 MB</small></span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPoster(e.target.files[0])} /><span>{poster?.name || 'Elegir imagen'}</span>{errors.poster && <small className="field-error">{errors.poster}</small>}</label>
      <button className="button button--accent button--wide field--full" disabled={loading}>{loading ? <><span className="mini-spinner" /> Publicando…</> : <>Publicar evento <Send /></>}</button>
    </form>
  </section>;
};
