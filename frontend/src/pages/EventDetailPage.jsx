import { canEditEvent } from '../utils/eventEditing.js';
import { PageMetadata } from '../seo/PageMetadata.jsx';
import { EventAvailability } from '../components/EventAvailability.jsx';
import { EventSpeaker } from '../components/EventSpeaker.jsx';
import { SpeakerVideos } from '../components/SpeakerVideos.jsx';
import { getEventSpeaker } from '../data/speakers.js';
import { getEvent, previewMode } from '../services/events.js';
import { PreviewNotice } from '../components/PreviewNotice.jsx';
import { localizeEvent } from '../i18n/events.js';
import { useLanguage } from "../context/LanguageContext.jsx";
import { ArrowLeft, CalendarDays, Check, MapPin, Share2, UserRound, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '../components/EventCard.jsx';
import { Loader } from '../components/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiRequest } from '../services/api.js';
export const EventDetailPage = () => {
  const {
    t, language, locale
  } = useLanguage();
  const {
    id
  } = useParams();
  const {
    user,
    token
  } = useAuth();
  const {
    notify
  } = useToast();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getEvent(id, {
      signal: controller.signal
    }).then(({
      data
    }) => { if (!controller.signal.aborted) setEvent(data); }).catch(err => {
      if (!controller.signal.aborted && err.name !== 'AbortError') setError(err.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);
  if (loading) return <><PageMetadata /><Loader full label={t("Preparando todos los detalles…")} /></>;
  if (error || !event) return <section className="page shell empty-state"><PageMetadata unavailable /><h1>{t("No encontramos ese evento")}</h1><p>{t(error)}</p><Link className="button button--dark" to="/events">{t("Volver a la agenda")}</Link></section>;
  const content = localizeEvent(event, language);
  const attending = event.attendees.some(attendee => (attendee._id || attendee) === user?.id);
  const toggle = async () => {
    if (previewMode) return;
    if (!user) return navigate('/auth', {
      state: {
        from: `/events/${id}`
      }
    });
    setActionLoading(true);
    try {
      const response = await apiRequest(`/events/${id}/attendance`, {
        method: 'POST',
        body: { language },
        token
      });
      setEvent({
        ...event,
        attendees: response.data.attendees
      });
      notify(response.message);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: content.title,
          url: location.href
        });
      } else {
        await navigator.clipboard.writeText(location.href);
        notify('Enlace copiado para compartir.');
      }
    } catch (shareError) {
      if (shareError.name !== 'AbortError') notify('No hemos podido compartir el enlace.', 'error');
    }
  };
  return <article className="detail-page"><PageMetadata event={event} />
    <div className="shell"><Link className="back-link" to="/events"><ArrowLeft /> {t("Volver a la agenda")}</Link></div>
    <div className="shell"><PreviewNotice /></div>
    <div className="shell detail-hero"><div className={`detail-visual ${event.poster ? '' : 'detail-visual--empty'}`}>{event.poster ? <img src={event.poster} alt={t("Cartel de {title}", { title: content.title })} /> : <span>{t(event.category)}</span>}</div><div className="detail-summary"><span className="tag">{t(event.category)}</span><h1>{content.title}</h1><EventSpeaker event={event} /><p className="detail-meta"><CalendarDays /> <span>{formatDate(event.date, language)} · {new Intl.DateTimeFormat(locale, {
              hour: '2-digit',
              minute: '2-digit', timeZone: 'Europe/Madrid'
            }).format(new Date(event.date))}</span></p><p className="detail-meta"><MapPin /> <span>{event.location}</span></p><p className="detail-meta"><Users /> <span>{t("{count} de {capacity} plazas confirmadas", { count: event.attendees.length, capacity: event.capacity })}</span></p><EventAvailability event={event} /><div className="detail-actions">{!previewMode && canEditEvent(event, user) && <Link className="button button--dark" to={`/events/${id}/edit`}>{t("Editar experiencia")}</Link>}<button aria-pressed={attending} aria-busy={actionLoading} className={attending ? 'button button--confirmed' : 'button button--accent'} onClick={toggle} disabled={actionLoading || previewMode}>{previewMode ? t("Reservas próximamente") : actionLoading ? <><span className="mini-spinner" /> {t("Actualizando…")}</> : attending ? <><Check /> {t("Plaza confirmada")}</> : t("Confirmar asistencia")}</button><button className="icon-button icon-button--border" onClick={share} aria-label={t("Compartir evento")}><Share2 /></button></div>{attending && <p className="confirmation-note">{t("Ya estás en la lista. Puedes cancelar pulsando de nuevo.")}</p>}</div></div>
    <div className="shell detail-content"><section><p className="kicker">{t("Inside the talk")}</p><h2>{t("Lo que te llevarás")}</h2><p className="detail-description">{content.description}</p><div className="creator"><div className="avatar">{event.creator.avatar ? <img src={event.creator.avatar} alt="" /> : <UserRound />}</div><div><small>{t("Experiencia creada por")}</small><strong>{event.creator.name}</strong></div></div></section><aside><p className="kicker">{t("The roster")}</p><h2>{t("El equipo")}</h2>{event.attendees.length ? <ul className="attendee-list attendee-list--scroll" tabIndex={0} aria-label={t("El equipo")}>{event.attendees.map(attendee => <li key={attendee._id}><span className="avatar avatar--small">{attendee.avatar ? <img src={attendee.avatar} alt="" /> : attendee.name.slice(0, 1)}</span>{attendee.name}</li>)}</ul> : <p className="muted">{t("Sé la primera persona en entrar al campo.")}</p>}</aside></div>
    {getEventSpeaker(event) && <div className="shell detail-videos"><SpeakerVideos key={getEventSpeaker(event).id} speaker={getEventSpeaker(event)} /></div>}
  </article>;
};
