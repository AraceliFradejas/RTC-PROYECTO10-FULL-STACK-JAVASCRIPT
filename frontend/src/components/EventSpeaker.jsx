import { ArrowUpRight, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEventSpeaker } from '../data/speakers.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export const EventSpeaker = ({ event }) => {
  const { t } = useLanguage();
  const speaker = getEventSpeaker(event);
  if (!speaker) return <p className="event-speaker-pending"><UserRound aria-hidden="true" />{t('Ponente por confirmar')}</p>;
  return <Link className="event-speaker" to={`/speakers/${speaker.id}`} aria-label={t('Conoce a {name}', { name: speaker.name })}>
    <img src={speaker.image} alt="" width="72" height="72" />
    <span className="event-speaker__info"><small>{t('Tu ponente')}</small><strong>{speaker.name}</strong><span>{t(speaker.role)}</span></span>
    <span className="event-speaker__more">{t('Ver biografía')}<ArrowUpRight aria-hidden="true" /></span>
  </Link>;
};
