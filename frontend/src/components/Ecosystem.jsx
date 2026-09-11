import { useLanguage } from "../context/LanguageContext.jsx";
import { ArrowUpRight } from 'lucide-react';
import { kelseTsSites } from '../data/brandLinks.js';
export const Ecosystem = ({
  compact = false
}) => {
  const {
    t
  } = useLanguage();
  return <section className={compact ? 'ecosystem ecosystem--compact' : 'ecosystem'} aria-labelledby="ecosystem-title">
  <div className="shell">
    <div className="section-heading ecosystem__heading">
      <div><p className="kicker">{t("One brand · Different plays")}</p><h2 id="ecosystem-title">{t("Descubre el universo KelseTS")}</h2></div>
      <p>{t("Una marca, distintas formas de avanzar.")}</p>
    </div>
    <div className="ecosystem__grid">
      {kelseTsSites.map((site, index) => <a className={`ecosystem-card ecosystem-card--${site.accent}`} href={site.url} target="_blank" rel="noopener noreferrer" key={site.name}>
        <span className="ecosystem-card__number">0{index + 1}</span>
        <p>{t(site.label)}</p><h3>{site.name}</h3><span className="ecosystem-card__description">{t(site.description)}</span>
        <span className="ecosystem-card__link">{t("Visitar proyecto")} <ArrowUpRight /></span>
      </a>)}
    </div>
  </div>
</section>;
};
