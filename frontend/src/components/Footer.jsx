import { useLanguage } from "../context/LanguageContext.jsx";
import { Link } from 'react-router-dom';
import { kelseTsSites, socialLinks } from '../data/brandLinks.js';
import { Logo } from './Logo.jsx';
export const Footer = () => {
  const {
    t
  } = useLanguage();
  return <footer className="footer">
  <div className="shell footer__grid">
    <div className="footer__brand"><Logo /><p>{t("Ideas que mueven equipos. Historias que cambian el partido.")}</p></div>
    <div><h2>{t("Universo KelseTS")}</h2>{kelseTsSites.map(site => <a href={site.url} target="_blank" rel="noopener noreferrer" key={site.name}>{site.name}</a>)}</div>
    <div><h2>{t("Conecta")}</h2>{socialLinks.map(social => <a href={social.url} target="_blank" rel="noopener noreferrer" key={social.name}>{social.name}</a>)}</div>
    <div><h2>KelseTS Talks</h2><Link to="/events">{t("Agenda")}</Link><Link to="/speakers">{t("Ponentes")}</Link><Link to="/about">{t("La empresa")}</Link><Link to="/legal">{t("Aviso legal")}</Link></div>
  </div>
  <div className="shell footer__bottom">
    <p>© {new Date().getFullYear()} {t("KelseTS es un proyecto ficticio creado para el máster Rock The Code de")}{" "}<a href="https://thepower.education/thepowermba/tech" target="_blank" rel="noopener noreferrer">The Power Tech School</a>. {t("Esta web demuestra el desarrollo de una aplicación full stack para la gestión de eventos y asistentes, con soporte multilingüe. Tiene fines exclusivamente educativos y no representa un producto o servicio real.")}</p>
    <p>{t("Sin afiliación con Taylor Swift, Travis Kelce, Kansas City Chiefs o la NFL.")}</p>
  </div>
</footer>;
};
