import { FormField } from "../components/FormField.jsx";
import { PasswordField } from "../components/PasswordField.jsx";
import { isEmail, validPassword } from "../utils/validation.js";
import { FormErrors } from "../components/FormErrors.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
export const AuthPage = () => {
  const { t } = useLanguage();
  const [mode, setMode] = useState("login");
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, sessionExpired, login, register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  if (user) return <Navigate to={location.state?.from || "/events"} replace />;
  const validate = () => {
    const next = {};
    if (mode === "register" && values.name.trim().length < 2)
      next.name = "Escribe al menos 2 caracteres.";
    if (!isEmail(values.email)) next.email = "Escribe un email válido.";
    if (mode === "register" && !validPassword(values.password))
      next.password =
        "La contraseña debe tener al menos 8 caracteres y ocupar como máximo 72 bytes.";
    if (mode === "login" && !values.password)
      next.password = "Email y contraseña son obligatorios.";
    setErrors(next);
    return !Object.keys(next).length;
  };
  const submit = async (event) => {
    event.preventDefault();
    if (loading || !validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await (mode === "login"
        ? login({
            email: values.email,
            password: values.password,
          })
        : register(values));
      notify(
        mode === "login"
          ? "Vuelves al terreno de juego."
          : "Tu cuenta está lista. Te damos la bienvenida a KelseTS.",
      );
      navigate(location.state?.from || "/events");
    } catch (error) {
      setErrors({
        form: error.message,
      });
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="auth-page">
      <div className="auth-visual">
        <p className="kicker">{t("Mindset in motion")}</p>
        <blockquote>
          {t("El resultado no cambia de golpe. Cambia decisión a decisión.")}
        </blockquote>
      </div>
      <div className="auth-panel">
        <div className="auth-box">
          <p className="kicker">
            {mode === "login"
              ? t("De vuelta al equipo")
              : t("Tu primera jugada")}
          </p>
          <h1>
            {mode === "login" ? t("Entra en KelseTS") : t("Crea tu cuenta")}
          </h1>
          <p>
            {mode === "login"
              ? t("Tu próxima experiencia te está esperando.")
              : t("Regístrate y entrarás directamente, sin pasos de más.")}
          </p>
          {sessionExpired && (
            <p role="alert">
              {t("Tu sesión ha caducado. Vuelve a iniciar sesión.")}
            </p>
          )}
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
            {mode === "register" && (
              <FormField id="auth-name" label="Nombre" error={errors.name}>
                <input
                  name="name"
                  id="auth-name"
                  required
                  value={values.name}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      name: e.target.value,
                    })
                  }
                  autoComplete="name"
                />
              </FormField>
            )}
            <FormField id="auth-email" label="Email" error={errors.email}>
              <input
                name="email"
                type="email"
                id="auth-email"
                required
                value={values.email}
                onChange={(e) =>
                  setValues({
                    ...values,
                    email: e.target.value,
                  })
                }
                autoComplete="email"
              />
            </FormField>
            <PasswordField
              id="auth-password"
              name="password"
              label="Contraseña"
              required
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              error={errors.password}
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
        </div>
      </div>
    </section>
  );
};
