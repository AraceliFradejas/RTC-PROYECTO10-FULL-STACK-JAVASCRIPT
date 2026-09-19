import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { usePasswordRecovery } from "../hooks/usePasswordRecovery.js";
import { AuthLayout } from "../components/auth/AuthLayout.jsx";
import { RecoveryForm } from "../components/auth/RecoveryForm.jsx";
import { RecoveryNotice } from "../components/auth/RecoveryNotice.jsx";

export const PasswordRecoveryPage = ({ reset = false }) => {
  const { t } = useLanguage();
  const state = usePasswordRecovery(reset);
  const { done, notice, hasToken } = state;
  return (
    <AuthLayout>
      <p className="kicker">KelseTS Talks</p>
      <h1>{t(reset ? "Elige una nueva contraseña" : "Recupera tu acceso")}</h1>
      {!reset && (
        <p className="recovery-notice">
          {t(
            "Demo educativa: el correo se recibe en Mailtrap Sandbox, no en tu bandeja personal.",
          )}
        </p>
      )}
      {done ? (
        <RecoveryNotice reset={reset} notice={notice} />
      ) : reset && !hasToken ? (
        <p role="alert">
          {t("El enlace no es válido o ha caducado. Solicita uno nuevo.")}
        </p>
      ) : (
        <>
          <p>
            {t(
              reset
                ? "Escribe y confirma la nueva contraseña. Después tendrás que iniciar sesión de nuevo."
                : "Introduce el correo con el que te registraste. Te enviaremos un enlace para elegir otra contraseña.",
            )}
          </p>
          <RecoveryForm reset={reset} state={state} />
        </>
      )}
      <div className="recovery-links">
        <Link className="text-link" to="/auth">
          {t("Volver a iniciar sesión")}
        </Link>
        {reset && !done && (
          <Link className="text-link" to="/forgot-password">
            {t("Solicitar un enlace nuevo")}
          </Link>
        )}
      </div>
    </AuthLayout>
  );
};
