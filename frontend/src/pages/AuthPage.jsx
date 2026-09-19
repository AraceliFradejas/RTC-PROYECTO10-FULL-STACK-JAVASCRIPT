import { Navigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { AuthLayout } from "../components/auth/AuthLayout.jsx";
import { AuthForm } from "../components/auth/AuthForm.jsx";
import { useAuthForm } from "../hooks/useAuthForm.js";

export const AuthPage = () => {
  const { t } = useLanguage();
  const form = useAuthForm();
  const { user, sessionExpired, mode, destination } = form;
  if (user) return <Navigate to={destination} replace />;
  return (
    <AuthLayout>
      <p className="kicker">
        {mode === "login" ? t("De vuelta al equipo") : t("Tu primera jugada")}
      </p>
      <h1>{mode === "login" ? t("Entra en KelseTS") : t("Crea tu cuenta")}</h1>
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
      <AuthForm {...form} />
    </AuthLayout>
  );
};
