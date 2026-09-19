import { UserRound } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export const EventContent = ({ event, content }) => {
  const { t } = useLanguage();
  return (
    <div className="shell detail-content">
      <section>
        <p className="kicker">{t("Inside the talk")}</p>
        <h2>{t("Lo que te llevarás")}</h2>
        <p className="detail-description">{content.description}</p>
        <div className="creator">
          <div className="avatar">
            {event.creator?.avatar ? (
              <img src={event.creator?.avatar} alt="" />
            ) : (
              <UserRound />
            )}
          </div>
          <div>
            <small>{t("Experiencia creada por")}</small>
            <strong>
              {event.creator?.name || t("Organización no disponible")}
            </strong>
          </div>
        </div>
      </section>
      <aside>
        <p className="kicker">{t("The roster")}</p>
        <h2>{t("El equipo")}</h2>
        {event.attendees.length ? (
          <ul
            className="attendee-list attendee-list--scroll"
            tabIndex={0}
            aria-label={t("El equipo")}
          >
            {event.attendees.map((attendee) => (
              <li key={attendee._id}>
                <span className="avatar avatar--small">
                  {attendee.avatar ? (
                    <img src={attendee.avatar} alt="" />
                  ) : (
                    attendee.name.slice(0, 1)
                  )}
                </span>
                {attendee.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            {t("Sé la primera persona en entrar al campo.")}
          </p>
        )}
      </aside>
    </div>
  );
};
