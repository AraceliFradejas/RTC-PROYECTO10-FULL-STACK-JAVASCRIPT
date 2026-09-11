import { useLanguage } from '../context/LanguageContext.jsx';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { speakers } from '../data/speakers.js';

export const Speakers = ({ standalone = false }) => {
  const { t } = useLanguage();
  const Heading = standalone ? 'h1' : 'h2';
  return <section className="speakers section" id="speakers">
    <div className="shell">
      <div className="section-heading"><div><p className="kicker">{t('Las voces del cambio')}</p><Heading>{t('Personas que mueven equipos')}</Heading></div><Link className="text-link" to="/events">{t('Descubre sus talks')} <ArrowRight /></Link></div>
      <div className="speakers__grid">
        {speakers.map((speaker, index) => <article className="speaker-card" key={speaker.id}>
          <Link className="speaker-card__link" to={`/speakers/${speaker.id}`} aria-label={t('Conoce a {name}', { name: speaker.name })}>
            <img src={speaker.image} alt={t('Retrato de {name}', { name: speaker.name })} loading="lazy" />
            <span className="speaker-card__number">0{index + 1}</span>
            <div className="speaker-card__content"><h3>{speaker.name}</h3><p>{t(speaker.role)}</p><small className="speaker-card__faculty">KelseTS School</small><span className="speaker-card__cta">{t('Ver biografía')}<ArrowUpRight aria-hidden="true" /></span></div>
          </Link>
        </article>)}
      </div>
      <p className="speakers__note">{t('Speakers y experiencias ficticias creadas para el universo KelseTS.')}</p>
    </div>
  </section>;
};
