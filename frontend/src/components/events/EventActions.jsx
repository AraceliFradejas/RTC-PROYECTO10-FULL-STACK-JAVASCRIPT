import { Check, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { canEditEvent } from "../../utils/eventEditing.js";
import { previewMode } from "../../services/events.js";
import { useEventActions } from "../../hooks/useEventActions.js";

export const EventActions = ({ event, content, setEvent }) => {
  const { t } = useLanguage();
  const id = event._id;
  const { user, ended, attending, actionLoading, sharing, toggle, share } =
    useEventActions(event, content, setEvent);
  return (
    <>
      <div className="detail-actions">
        {!previewMode && canEditEvent(event, user) && (
          <Link className="button button--dark" to={`/events/${id}/edit`}>
            {t("Editar experiencia")}
          </Link>
        )}
        <button
          aria-pressed={attending}
          aria-busy={actionLoading}
          className={
            attending ? "button button--confirmed" : "button button--accent"
          }
          onClick={toggle}
          disabled={actionLoading || previewMode || (ended && !attending)}
        >
          {previewMode ? (
            t("Reservas próximamente")
          ) : actionLoading ? (
            <>
              <span className="mini-spinner" /> {t("Actualizando…")}
            </>
          ) : attending ? (
            <>
              <Check /> {t("Plaza confirmada")}
            </>
          ) : ended ? (
            t("Evento finalizado")
          ) : (
            t("Confirmar asistencia")
          )}
        </button>
        <button
          className="icon-button icon-button--border"
          onClick={share}
          disabled={sharing}
          aria-busy={sharing}
          aria-label={t("Compartir evento")}
        >
          {sharing ? <span className="mini-spinner" /> : <Share2 />}
        </button>
      </div>
      {attending && (
        <p className="confirmation-note">
          {t("Ya estás en la lista. Puedes cancelar pulsando de nuevo.")}
        </p>
      )}
    </>
  );
};
