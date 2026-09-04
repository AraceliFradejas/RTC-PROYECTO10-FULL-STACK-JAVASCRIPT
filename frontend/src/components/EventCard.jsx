import { ArrowUpRight, CalendarDays, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const fallbackGradients = ['coral', 'violet', 'lime', 'blue'];
export const formatDate = (date) => new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));

export const EventCard = ({ event, index = 0 }) => <article className="event-card">
  <Link className={`event-card__visual event-card__visual--${fallbackGradients[index % fallbackGradients.length]}`} to={`/events/${event._id}`} tabIndex="-1">
    {event.poster ? <img src={event.poster} alt="" /> : <span aria-hidden="true">{event.category?.slice(0, 1)}</span>}
    <span className="tag">{event.category}</span>
  </Link>
  <div className="event-card__body">
    <p className="eyebrow"><CalendarDays /> {formatDate(event.date)}</p>
    <h3><Link to={`/events/${event._id}`}>{event.title}</Link></h3>
    <p className="event-card__location"><MapPin /> {event.location}</p>
    <div className="event-card__footer"><span><Users /> {event.attendees?.length || 0} asistentes</span><Link to={`/events/${event._id}`} aria-label={`Ver ${event.title}`}><ArrowUpRight /></Link></div>
  </div>
</article>;

