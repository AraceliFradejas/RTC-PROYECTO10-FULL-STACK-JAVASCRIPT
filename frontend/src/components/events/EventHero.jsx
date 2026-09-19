import { CalendarDays, MapPin, Users } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  formatEventDate as formatDate,
  formatEventTime,
} from "../../i18n/translate.js";
import { EventSpeaker } from "../EventSpeaker.jsx";
import { EventAvailability } from "../EventAvailability.jsx";
import { EventActions } from "./EventActions.jsx";

export const EventHero = ({ event, content, setEvent }) => {
  const { t, language } = useLanguage();
  return (
    <div className="shell detail-hero">
      <div
        className={`detail-visual ${event.poster ? "" : "detail-visual--empty"}`}
      >
        {event.poster ? (
          <img
            src={event.poster}
            alt={t("Cartel de {title}", { title: content.title })}
          />
        ) : (
          <span>{t(event.category)}</span>
        )}
      </div>
      <div className="detail-summary">
        <span className="tag">{t(event.category)}</span>
        <h1>{content.title}</h1>
        <EventSpeaker event={event} />
        <p className="detail-meta">
          <CalendarDays />{" "}
          <span>
            {formatDate(event.date, language)} ·{" "}
            {formatEventTime(event.date, language)}
          </span>
        </p>
        <p className="detail-meta">
          <MapPin /> <span>{event.location}</span>
        </p>
        <p className="detail-meta">
          <Users />{" "}
          <span>
            {t("{count} de {capacity} plazas confirmadas", {
              count: event.attendees.length,
              capacity: event.capacity,
            })}
          </span>
        </p>
        <EventAvailability event={event} />
        <EventActions event={event} content={content} setEvent={setEvent} />
      </div>
    </div>
  );
};
