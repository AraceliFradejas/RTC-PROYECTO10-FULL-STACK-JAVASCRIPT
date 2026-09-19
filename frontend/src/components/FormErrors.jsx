import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export const FormErrors = ({ errors, prefix }) => {
  const { language, t } = useLanguage();
  const summary = useRef(null);
  const entries = Object.entries(errors);
  useEffect(() => { if (Object.keys(errors).length) summary.current?.focus(); }, [errors]);
  if (!entries.length) return null;
  return <div className="form-alert form-error-summary" tabIndex={-1} ref={summary} role="alert">
    <p>{language === 'en' ? 'Please review the following:' : 'Revisa lo siguiente:'}</p>
    <ul>{entries.map(([field, message]) => <li key={field}>{field === 'form' ? t(message) : <a href={`#${prefix}-${field}`} onClick={event => {
      event.preventDefault();
      document.getElementById(`${prefix}-${field}`)?.focus();
    }}>{t(message)}</a>}</li>)}</ul>
  </div>;
};
