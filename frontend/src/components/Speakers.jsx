import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { speakers } from '../data/visualContent.js';

export const Speakers = () => <section className="speakers section">
  <div className="shell">
    <div className="section-heading"><div><p className="kicker">Las voces del cambio</p><h2>Personas que mueven equipos</h2></div><Link className="text-link" to="/events">Descubre sus talks <ArrowRight /></Link></div>
    <div className="speakers__grid">
      {speakers.map((speaker, index) => <article className="speaker-card" key={speaker.name}>
        <img src={speaker.image} alt={`Retrato de ${speaker.name}`} loading="lazy" />
        <span>0{index + 1}</span>
        <div><h3>{speaker.name}</h3><p>{speaker.role}</p></div>
      </article>)}
    </div>
    <p className="speakers__note">Speakers y experiencias ficticias creadas para el universo KelseTS.</p>
  </div>
</section>;
