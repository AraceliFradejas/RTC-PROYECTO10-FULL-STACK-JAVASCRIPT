import { useLanguage } from "../context/LanguageContext.jsx";
import { Link } from 'react-router-dom';
export const Logo = () => {
  const {
    t
  } = useLanguage();
  return <Link className="logo" to="/" aria-label={t("KelseTS Talks, inicio")}>
  <img className="logo__image" src="/images/brand/kelcets-logo.png" alt="" width="56" height="56" />
  <span>KelceTS<small>Talks</small></span>
</Link>;
};
