import { useLanguage } from "../../context/LanguageContext.jsx";

export const AuthLayout = ({ children }) => {
  const { t } = useLanguage();
  return (
    <section className="auth-page">
      <div className="auth-visual">
        <p className="kicker">{t("Mindset in motion")}</p>
        <blockquote>
          {t("El resultado no cambia de golpe. Cambia decisión a decisión.")}
        </blockquote>
      </div>
      <div className="auth-panel">
        <div className="auth-box">{children}</div>
      </div>
    </section>
  );
};
