import { PreviewNotice } from '../components/PreviewNotice.jsx';
import { useLanguage } from "../context/LanguageContext.jsx";
import { ArrowRight, Compass, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState.jsx';
import { EventCard } from '../components/EventCard.jsx';
import { Loader } from '../components/Loader.jsx';
import { Ecosystem } from '../components/Ecosystem.jsx';
import { HeroCarousel } from '../components/HeroCarousel.jsx';
import { Speakers } from '../components/Speakers.jsx';
import { useEvents } from '../hooks/useEvents.js';
export const HomePage = () => {
  const {
    t
  } = useLanguage();
  const {
    events,
    loading,
    error
  } = useEvents('?sort=soonest');
  return <>
    <section className="hero">
      <div className="hero__grid">
        <HeroCarousel />
        <div className="hero__content">
          <p className="kicker">KelceTS Talks · The Next Inch</p>
          <h1>{t("Centímetro a centímetro.")}<br /><em>{t("Juntos.")}</em></h1>
          <p className="hero__copy">{t("El siguiente avance no se gana en solitario. Charlas y experiencias que llevan la fuerza del deporte al corazón de tu equipo.")}</p>
          <div className="hero__actions"><Link className="button button--accent" to="/events">{t("Descubre los talks")} <ArrowRight /></Link><a className="button button--outline" href="#the-next-inch">{t("Nuestra inspiración")}</a></div>
          <p className="hero__signature">{t("Move the next inch. Change the whole game.")}</p>
        </div>
      </div>
    </section>
    <section className="manifesto" id="the-next-inch" aria-labelledby="manifesto-title">
      <div className="shell">
        <p className="kicker">{t("Nuestra inspiración · Un domingo cualquiera")}</p>
        <div className="manifesto__grid">
          <div><h2 id="manifesto-title">{t("Un vestuario.")}<br />{t("Un equipo.")}<br /><em>{t("Una decisión.")}</em></h2><Link className="text-link" to="/about">{t("La historia de The Next Inch")} <ArrowRight /></Link></div>
          <div className="manifesto__story"><p>{t("En")} <cite>{t("Un domingo cualquiera (Any Given Sunday)")}</cite>{t(", el entrenador interpretado por Al Pacino recuerda a su equipo que el partido se decide en pequeños avances y en lo que cada persona está dispuesta a aportar a los demás.")}</p><p>{t("Ese espíritu es el punto de partida de")} <strong>The Next Inch</strong>{t(": volver a intentarlo cuando cuesta, confiar en quien tienes al lado y convertir el esfuerzo de cada uno en una oportunidad para todos.")}</p><p>{t("Del vestuario al trabajo. De la inspiración a ese próximo paso que tu equipo puede dar hoy.")}</p></div>
          <div className="manifesto__points"><p><Compass /><span><strong>{t("Cada avance cuenta.")}</strong>{t("Una decisión, una conversación, un nuevo intento.")}</span></p><p><Heart /><span><strong>{t("Nadie avanza solo.")}</strong>{t("La confianza también se entrena.")}</span></p><p><Sparkles /><span><strong>{t("El equipo cambia el partido.")}</strong>{t("Lo que haces por los demás nos mueve a todos.")}</span></p></div>
        </div>
      </div>
    </section>
    <section className="section shell">
      <div className="section-heading"><div><p className="kicker">{t("The next play")}</p><h2>{t("Próximas experiencias")}</h2></div><Link className="text-link" to="/events">{t("Ver toda la agenda")} <ArrowRight /></Link></div>
      <PreviewNotice />
      {loading ? <Loader label={t("Buscando las próximas experiencias…")} /> : error ? <EmptyState title={t("No podemos cargar la agenda")} message={error} /> : events.length ? <div className="card-grid">{events.slice(0, 3).map((event, index) => <EventCard key={event._id} event={event} index={index} />)}</div> : <EmptyState />}
    </section>
    <Speakers />
    <Ecosystem />
  </>;
};
