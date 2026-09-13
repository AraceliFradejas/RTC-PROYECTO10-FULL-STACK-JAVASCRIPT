import { useLanguage } from '../context/LanguageContext.jsx';
import { availability } from '../utils/availability.js';

export const EventAvailability = ({ event }) => {
  const { t } = useLanguage();
  const status = availability(event);
  return <div className={`event-availability event-availability--${status.tone}`}>
    <strong>{t(status.message)}</strong>
    {status.tone !== 'closed' && <span>{t(status.remaining === 1 ? 'Queda {count} plaza' : 'Quedan {count} plazas', { count: status.remaining })}</span>}
    {event.demoAttendance && <small>{t('Incluye asistentes ficticios · Proyecto académico')}</small>}
  </div>;
};
