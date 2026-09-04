import { ArrowRight, Compass, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState.jsx';
import { EventCard } from '../components/EventCard.jsx';
import { Loader } from '../components/Loader.jsx';
import { useEvents } from '../hooks/useEvents.js';

export const HomePage = () => {
  const { events, loading, error } = useEvents('?sort=soonest');
  return <>
    <section className="hero">
      <div className="shell hero__grid">
        <div><p className="kicker"><Sparkles /> KelseTS Talks · Teams · Transformation</p><h1>El partido cambia en la <em>siguiente jugada.</em></h1><p className="hero__copy">Charlas motivacionales y experiencias para líderes y equipos que quieren avanzar cuando la presión aprieta.</p><div className="hero__actions"><Link className="button button--accent" to="/events">Ver próximos talks <ArrowRight /></Link><Link className="text-link" to="/about">Conoce KelseTS</Link></div></div>
        <div className="hero-art" aria-hidden="true"><span className="hero-art__orb" /><span className="field-line field-line--one"/><span className="field-line field-line--two"/><div className="hero-art__card"><small>THE NEXT INCH · LIVE</small><strong>La siguiente jugada</strong><span>Madrid · 19:00</span></div><span className="hero-art__word">KelseTS</span></div>
      </div>
    </section>
    <section className="section shell">
      <div className="section-heading"><div><p className="kicker">The next play</p><h2>Próximas experiencias</h2></div><Link className="text-link" to="/events">Ver toda la agenda <ArrowRight /></Link></div>
      {loading ? <Loader label="Buscando las próximas experiencias…" /> : error ? <EmptyState title="No podemos cargar la agenda" message={error} /> : events.length ? <div className="card-grid">{events.slice(0, 3).map((event, index) => <EventCard key={event._id} event={event} index={index} />)}</div> : <EmptyState />}
    </section>
    <section className="manifesto"><div className="shell manifesto__grid"><p className="kicker">Nuestra filosofía</p><h2>No necesitas ver todo el campo.<br />Solo conquistar el próximo paso.</h2><div className="manifesto__points"><p><Compass /> Dirección cuando el marcador se complica.</p><p><Heart /> Equipo cuando el talento individual no basta.</p><p><Sparkles /> Acción para convertir intención en resultados.</p></div></div></section>
  </>;
};
