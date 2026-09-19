import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { FormErrors } from "../FormErrors.jsx";
import { AuthFields } from "./AuthFields.jsx";

export const AuthForm = ({
  mode,
  setMode,
  values,
  setValues,
  errors,
  setErrors,
  loading,
  submit,
}) => {
  const { t } = useLanguage();
  return (
    <>
      <div
        className="auth-tabs"
        role="group"
        aria-label={t("Entra en KelseTS")}
      >
        <button
          disabled={loading}
          aria-pressed={mode === "login"}
          className={mode === "login" ? "active" : ""}
          onClick={() => {
            setMode("login");
            setErrors({});
          }}
        >
          {t("Iniciar sesión")}
        </button>
        <button
          disabled={loading}
          aria-pressed={mode === "register"}
          className={mode === "register" ? "active" : ""}
          onClick={() => {
            setMode("register");
            setErrors({});
          }}
        >
          {t("Crear cuenta")}
        </button>
      </div>
      <form onSubmit={submit} noValidate aria-busy={loading}>
        <FormErrors errors={errors} prefix="auth" />
        <AuthFields
          mode={mode}
          values={values}
          setValues={setValues}
          errors={errors}
        />
        <button
          className="button button--accent button--wide"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="mini-spinner" />{" "}
              {mode === "login" ? t("Entrando…") : t("Creando tu cuenta…")}
            </>
          ) : (
            <>
              {mode === "login" ? t("Entrar") : t("Crear cuenta")}{" "}
              <ArrowRight />
            </>
          )}
        </button>
      </form>
      {mode === "login" && (
        <p className="recovery-links">
          <Link
            className="text-link"
            to="/forgot-password"
            state={{ email: values.email }}
          >
            {t("¿Has olvidado tu contraseña?")}
          </Link>
        </p>
      )}
    </>
  );
};
