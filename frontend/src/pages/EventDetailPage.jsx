import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { PageMetadata } from "../seo/PageMetadata.jsx";
import { PreviewNotice } from "../components/PreviewNotice.jsx";
import { Loader } from "../components/Loader.jsx";
import { SpeakerVideos } from "../components/SpeakerVideos.jsx";
import { EventHero } from "../components/events/EventHero.jsx";
import { EventContent } from "../components/events/EventContent.jsx";
import { getEventSpeaker } from "../data/speakers.js";
import { localizeEvent } from "../i18n/events.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useEvent } from "../hooks/useEvent.js";

export const EventDetailPage = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { event, setEvent, loading, error } = useEvent(id);
  if (loading)
    return (
      <>
        <PageMetadata />
        <Loader full label={t("Preparando todos los detalles…")} />
      </>
    );
  if (error || !event)
    return (
      <section className="page shell empty-state">
        <PageMetadata unavailable />
        <h1>{t("No encontramos ese evento")}</h1>
        <p>{t(error)}</p>
        <Link className="button button--dark" to="/events">
          {t("Volver a la agenda")}
        </Link>
      </section>
    );
  const content = localizeEvent(event, language);
  const speaker = getEventSpeaker(event);
  return (
    <article className="detail-page">
      <PageMetadata event={event} />
      <div className="shell">
        <Link className="back-link" to="/events">
          <ArrowLeft /> {t("Volver a la agenda")}
        </Link>
      </div>
      <div className="shell">
        <PreviewNotice />
      </div>
      <EventHero event={event} content={content} setEvent={setEvent} />
      <EventContent event={event} content={content} />
      {speaker && (
        <div className="shell detail-videos">
          <SpeakerVideos key={speaker.id} speaker={speaker} />
        </div>
      )}
    </article>
  );
};
