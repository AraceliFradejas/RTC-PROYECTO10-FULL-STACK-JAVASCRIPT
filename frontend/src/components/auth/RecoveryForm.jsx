import { useLanguage } from "../../context/LanguageContext.jsx";
import { FormErrors } from "../FormErrors.jsx";
import { RecoveryFields } from "./RecoveryFields.jsx";

export const RecoveryForm = ({ reset, state }) => {
  const { t } = useLanguage();
  const { submit, errors, loading } = state;
  return (
    <form onSubmit={submit} noValidate aria-busy={loading}>
      <FormErrors errors={errors} prefix="recovery" />
      <RecoveryFields reset={reset} {...state} />
      <button className="button button--accent button--wide" disabled={loading}>
        {t(
          loading
            ? "Procesando…"
            : reset
              ? "Guardar nueva contraseña"
              : "Enviar enlace de recuperación",
        )}
      </button>
    </form>
  );
};
