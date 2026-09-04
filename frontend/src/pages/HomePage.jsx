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
        <div><p className="kicker"><Sparkles /> Madrid se encuentra aquí</p><h1>Planes que dejan <em>algo encendido.</em></h1><p className="hero__copy">Descubre talleres, conversaciones y experiencias creadas por personas con ganas de compartir.</p><div className="hero__actions"><Link className="button button--accent" to="/events">Explorar eventos <ArrowRight /></Link><Link className="text-link" to="/events/new">Publicar un plan</Link></div></div>
        <div className="hero-art" aria-hidden="true"><span className="hero-art__orb" /><div className="hero-art__card"><small>PRÓXIMO ENCUENTRO</small><strong>Ideas al atardecer</strong><span>Matadero · 19:00</span></div><span className="hero-art__word">juntas</span></div>
      </div>
    </section>
    <section className="section shell">
      <div className="section-heading"><div><p className="kicker">Agenda abierta</p><h2>Lo próximo en la ciudad</h2></div><Link className="text-link" to="/events">Ver toda la agenda <ArrowRight /></Link></div>
      {loading ? <Loader label="Buscando los próximos planes…" /> : error ? <EmptyState title="No podemos cargar la agenda" message={error} /> : events.length ? <div className="card-grid">{events.slice(0, 3).map((event, index) => <EventCard key={event._id} event={event} index={index} />)}</div> : <EmptyState />}
    </section>
    <section className="manifesto"><div className="shell manifesto__grid"><p className="kicker">La comunidad primero</p><h2>No coleccionamos eventos.<br />Creamos conexiones.</h2><div className="manifesto__points"><p><Compass /> Encuentra experiencias que encajan contigo.</p><p><Heart /> Confirma tu plaza sin procesos innecesarios.</p><p><Sparkles /> Comparte aquello que te gustaría vivir.</p></div></div></section>
  </>;
};

