import { useLanguage } from "../context/LanguageContext.jsx";
import { Link } from 'react-router-dom';
export const NotFoundPage = () => {
  const {
    t
  } = useLanguage();
  return <section className="page shell not-found"><span>404</span><h1>{t("Esta luz se ha apagado")}</h1><p>{t("La página que buscas no existe o ha cambiado de lugar.")}</p><Link className="button button--accent" to="/">{t("Volver al inicio")}</Link></section>;
};
