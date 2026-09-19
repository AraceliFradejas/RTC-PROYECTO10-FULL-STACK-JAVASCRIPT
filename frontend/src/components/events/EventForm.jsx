import { Send } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { FormErrors } from "../FormErrors.jsx";
import { EventScheduleFields } from "./EventScheduleFields.jsx";
import { EventDescriptionFields } from "./EventDescriptionFields.jsx";
import { EventPosterField } from "./EventPosterField.jsx";

export const EventForm = ({
  editing,
  original,
  values,
  update,
  poster,
  setPoster,
  errors,
  loading,
  submit,
}) => {
  const { t } = useLanguage();
  return (
    <form
      className="event-form"
      onSubmit={submit}
      noValidate
      aria-busy={loading}
    >
      <FormErrors errors={errors} prefix="event" />
      <EventScheduleFields values={values} update={update} errors={errors} />
      <EventDescriptionFields values={values} update={update} errors={errors} />
      <EventPosterField
        editing={editing}
        original={original}
        poster={poster}
        setPoster={setPoster}
        errors={errors}
      />
      <button
        className="button button--accent button--wide field--full"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="mini-spinner" />{" "}
            {t(editing ? "Guardando…" : "Publicando…")}
          </>
        ) : (
          <>
            {t(editing ? "Guardar cambios" : "Publicar evento")} <Send />
          </>
        )}
      </button>
    </form>
  );
};
