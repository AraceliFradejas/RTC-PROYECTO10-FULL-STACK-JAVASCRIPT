import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { Loader } from "../components/Loader.jsx";
import { EventForm } from "../components/events/EventForm.jsx";
import { useEventEditor } from "../hooks/useEventEditor.js";

export const EventFormPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const editor = useEventEditor(id);
  const { fetching, loadError, editing } = editor;
  if (fetching)
    return <Loader full label={t("Preparando todos los detalles…")} />;
  if (loadError)
    return (
      <section className="page shell">
        <h1>{t("No se puede editar esta charla")}</h1>
        <p role="alert">{t(loadError)}</p>
        <Link className="button button--dark" to={`/events/${id}`}>
          {t("Volver a la charla")}
        </Link>
      </section>
    );
  return (
    <section className="page page--narrow">
      <Link className="back-link" to={editing ? `/events/${id}` : "/events"}>
        <ArrowLeft /> {t(editing ? "Volver a la charla" : "Volver a la agenda")}
      </Link>
      <div className="form-heading">
        <p className="kicker">{t("Bring your story")}</p>
        <h1>{t(editing ? "Editar experiencia" : "Crea una experiencia")}</h1>
        <p>
          {t(
            editing
              ? "Actualiza los datos de tu charla. El cartel se conserva si no eliges otra imagen."
              : "Diseña una charla que ayude a otras personas a dar su siguiente paso.",
          )}
        </p>
      </div>
      <EventForm {...editor} />
    </section>
  );
};
