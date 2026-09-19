import { EventAvailability } from './EventAvailability.jsx';
import { formatEventDate } from '../i18n/translate.js';
import { localizeEvent } from '../i18n/events.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { ArrowUpRight, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const categoryTones = {
  Liderazgo: 'red', Resiliencia: 'purple', Equipo: 'gold',
  Rendimiento: 'red', Innovación: 'purple', Bienestar: 'gold',
};
export { formatEventDate as formatDate } from '../i18n/translate.js';

export const EventCard = ({ event, horizontal = false, headingLevel = 3 }) => {
  const Heading = `h${headingLevel}`;
  const { t, language, locale } = useLanguage();
  const content = localizeEvent(event, language);
  const date = new Date(event.date);
  const attendees = event.attendees?.length || 0;
  const tone = categoryTones[event.category] || 'red';

  return <article className={`event-card event-card--${tone}${horizontal ? ' event-card--horizontal' : ''}`}>
    <Link className="event-card__link" to={`/events/${event._id}`} aria-label={t('Ver {title}', { title: content.title })}>
      <div className={`event-card__visual${event.poster ? '' : ' event-card__visual--empty'}`}>
        {event.poster
          ? <img src={event.poster} alt={t('Cartel de {title}', { title: content.title })} loading="lazy" />
          : <span className="event-card__monogram" aria-hidden="true">K.</span>}

      </div>
      <div className="event-card__body">
        <div className="event-card__metadata">
        <time className="event-card__date" dateTime={event.date} aria-label={formatEventDate(event.date, language)}>
          <span aria-hidden="true" className="event-card__day">{new Intl.DateTimeFormat(locale, { day: '2-digit' }).format(date)}</span>
          <span aria-hidden="true" className="event-card__month">{new Intl.DateTimeFormat(locale, { month: 'short' }).format(date)}</span>
          <span aria-hidden="true" className="event-card__year">{date.getFullYear()}</span>
        </time>
        <span className="event-card__category">{t(event.category)}</span>
        </div>
        <p className="event-card__location"><MapPin aria-hidden="true" /> {event.location}</p>
        <Heading>{content.title}</Heading>
        {content.description && <p className="event-card__description">{content.description}</p>}
        <EventAvailability event={event} />
        <div className="event-card__footer">
          <span className="event-card__attendance"><Users aria-hidden="true" /> {t(attendees === 1 ? '{count} asistente' : '{count} asistentes', { count: attendees })}</span>
          <span className="event-card__cta">{t('Ver experiencia')}<span className="event-card__arrow"><ArrowUpRight aria-hidden="true" /></span></span>
        </div>
      </div>
    </Link>
  </article>;
};
