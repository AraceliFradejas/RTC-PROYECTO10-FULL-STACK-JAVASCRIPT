import { useLanguage } from "../context/LanguageContext.jsx";
import { Link } from 'react-router-dom';
export const LegalPage = () => {
  const {
    t
  } = useLanguage();
  return <section className="page shell legal-page">
  <p className="kicker">{t("Legal notice · Aviso legal")}</p>
  <h1>{t("Un proyecto ficticio con una historia")} <em>{t("muy real.")}</em></h1>
  <div className="legal-page__grid">
    <article><h2>{t("Aviso legal")}</h2><p>{t("KelseTS es una marca ficticia creada por Araceli Fradejas Muñoz con fines exclusivamente educativos, académicos y de portfolio.")}</p><p>{t("El proyecto está inspirado creativamente en la cultura pop, la música y el deporte, pero no está afiliado, patrocinado, autorizado ni respaldado por Taylor Swift, Travis Kelce, los Kansas City Chiefs, la National Football League, sus representantes ni ninguna entidad relacionada.")}</p><p>{t("Todos los nombres, marcas, logotipos e imágenes de terceros pertenecen a sus respectivos titulares. Los eventos, productos, speakers, testimonios y servicios presentados son ficticios.")}</p></article>

  </div>
  <Link className="button button--dark" to="/">{t("Volver a KelseTS Talks")}</Link>
</section>;
};
