import { ArrowLeft, CalendarDays, Check, MapPin, Share2, UserRound, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '../components/EventCard.jsx';
import { Loader } from '../components/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiRequest } from '../services/api.js';

export const EventDetailPage = () => {
  const { id } = useParams(); const { user, token } = useAuth(); const { notify } = useToast(); const navigate = useNavigate();
  const [event, setEvent] = useState(null); const [loading, setLoading] = useState(true); const [actionLoading, setActionLoading] = useState(false); const [error, setError] = useState('');
  useEffect(() => { const controller = new AbortController(); apiRequest(`/events/${id}`, { signal: controller.signal }).then(({ data }) => setEvent(data)).catch((err) => { if (err.name !== 'AbortError') setError(err.message); }).finally(() => setLoading(false)); return () => controller.abort(); }, [id]);
  if (loading) return <Loader full label="Preparando todos los detalles…" />;
  if (error || !event) return <section className="page shell empty-state"><h1>No encontramos ese evento</h1><p>{error}</p><Link className="button button--dark" to="/events">Volver a la agenda</Link></section>;
  const attending = event.attendees.some((attendee) => (attendee._id || attendee) === user?.id);
  const toggle = async () => {
    if (!user) return navigate('/auth', { state: { from: `/events/${id}` } });
    setActionLoading(true); try { const response = await apiRequest(`/events/${id}/attendance`, { method: 'POST', token }); setEvent({ ...event, attendees: response.data.attendees }); notify(response.message); } catch (err) { notify(err.message, 'error'); } finally { setActionLoading(false); }
  };
  const share = async () => { try { await navigator.share?.({ title: event.title, url: location.href }) || navigator.clipboard.writeText(location.href); notify('Enlace copiado para compartir.'); } catch { /* El usuario canceló */ } };
  return <article className="detail-page">
    <div className="shell"><Link className="back-link" to="/events"><ArrowLeft /> Volver a la agenda</Link></div>
    <div className="shell detail-hero"><div className={`detail-visual ${event.poster ? '' : 'detail-visual--empty'}`}>{event.poster ? <img src={event.poster} alt={`Cartel de ${event.title}`} /> : <span>{event.category}</span>}</div><div className="detail-summary"><span className="tag">{event.category}</span><h1>{event.title}</h1><p className="detail-meta"><CalendarDays /> <span>{formatDate(event.date)} · {new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(event.date))}</span></p><p className="detail-meta"><MapPin /> <span>{event.location}</span></p><p className="detail-meta"><Users /> <span>{event.attendees.length} de {event.capacity} plazas confirmadas</span></p><div className="detail-actions"><button className={attending ? 'button button--confirmed' : 'button button--accent'} onClick={toggle} disabled={actionLoading}>{actionLoading ? <><span className="mini-spinner" /> Actualizando…</> : attending ? <><Check /> Plaza confirmada</> : 'Confirmar asistencia'}</button><button className="icon-button icon-button--border" onClick={share} aria-label="Compartir evento"><Share2 /></button></div>{attending && <p className="confirmation-note">Ya estás en la lista. Puedes cancelar pulsando de nuevo.</p>}</div></div>
    <div className="shell detail-content"><section><p className="kicker">Sobre el encuentro</p><h2>Lo que vamos a vivir</h2><p className="detail-description">{event.description}</p><div className="creator"><div className="avatar">{event.creator.avatar ? <img src={event.creator.avatar} alt="" /> : <UserRound />}</div><div><small>Creado por</small><strong>{event.creator.name}</strong></div></div></section><aside><p className="kicker">Quién viene</p><h2>La comunidad</h2>{event.attendees.length ? <ul className="attendee-list">{event.attendees.map((attendee) => <li key={attendee._id}><span className="avatar avatar--small">{attendee.avatar ? <img src={attendee.avatar} alt="" /> : attendee.name.slice(0, 1)}</span>{attendee.name}</li>)}</ul> : <p className="muted">Sé la primera persona en apuntarte.</p>}</aside></div>
  </article>;
};

