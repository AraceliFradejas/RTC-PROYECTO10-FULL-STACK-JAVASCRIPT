import { useLanguage } from "../context/LanguageContext.jsx";
export const Loader = ({
  label = 'Cargando…',
  full = false
}) => {
  const {
    t
  } = useLanguage();
  return <div className={full ? 'loader loader--full' : 'loader'} role="status"><span className="loader__ring" /><span>{t(label)}</span></div>;
};
