import { SpeakerVideos } from '../components/SpeakerVideos.jsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getSpeaker, getEventSpeaker } from '../data/speakers.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useEvents } from '../hooks/useEvents.js';
import { EventCard } from '../components/EventCard.jsx';
import { Loader } from '../components/Loader.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { PreviewNotice } from '../components/PreviewNotice.jsx';

export const SpeakerPage = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const speaker = getSpeaker(slug);
  const { events, loading, error } = useEvents('?sort=soonest');
  if (!speaker) return <section className="page shell empty-state"><h1>{t('No encontramos este perfil')}</h1><Link className="button button--accent" to="/speakers">{t('Ver ponentes')}</Link></section>;
  const bio = speaker[language];
  const related = events.filter(event => getEventSpeaker(event)?.id === speaker.id);

  return <article className="speaker-profile">
    <div className="shell"><Link className="back-link" to="/speakers"><ArrowLeft />{t('Todos los ponentes')}</Link></div>
    <header className="shell speaker-profile__hero">
      <div className="speaker-profile__portrait"><img src={speaker.image} alt={t('Retrato de {name}', { name: speaker.name })} /><span>KelseTS Talks</span></div>
      <div className="speaker-profile__intro"><p className="kicker">{t('Las voces del cambio')}</p><h1>{speaker.name}</h1><p className="speaker-profile__role">{t(speaker.role)}</p><ul className="speaker-profile__appointments">{bio.appointments.map(position => <li key={position}>{position}</li>)}</ul><p className="speaker-profile__lead">{bio.lead}</p><a className="button button--accent" href="#speaker-events">{t('Ver sus charlas')}<ArrowRight /></a></div>
    </header>
    <div className="shell speaker-profile__body">
      <section><p className="kicker">{t('Su historia')}</p><h2>{t('Una mirada propia al juego')}</h2>{bio.bio.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className="speaker-profile__note">{t('Biografía ficticia creada para el universo educativo de KelseTS.')}</p></section>
      <aside className="speaker-profile__approach"><p className="kicker">{t('En sus sesiones')}</p><h2>{t('De la idea a la acción')}</h2><p>{bio.approach}</p><ul>{bio.topics.map(topic => <li key={topic}>{topic}</li>)}</ul></aside>
    </div>
    <div className="shell speaker-profile__invitation"><SpeakerVideos key={speaker.id} speaker={speaker} /></div>
    <section className="shell section speaker-profile__events" id="speaker-events">
      <div className="section-heading"><div><p className="kicker">{t('El próximo encuentro')}</p><h2>{t('Charlas con {name}', { name: speaker.name })}</h2></div><Link className="text-link" to="/events">{t('Ver toda la agenda')}<ArrowRight /></Link></div>
      <PreviewNotice />
      {loading ? <Loader /> : error ? <EmptyState title={t('No podemos cargar la agenda')} message={error} /> : related.length ? <div className="card-grid">{related.map(event => <EventCard key={event._id} event={event} />)}</div> : <EmptyState title={t('Próximas fechas por anunciar')} message={t('Vuelve pronto para descubrir sus próximas charlas.')} />}
    </section>
  </article>;
};
