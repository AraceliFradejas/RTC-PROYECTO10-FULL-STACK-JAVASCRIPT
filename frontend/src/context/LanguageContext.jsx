import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { languages, languageStorageKey, locales, readLanguage, translate } from '../i18n/translate.js';

const LanguageContext = createContext(null);
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(readLanguage);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = 'KelseTS Talks · The Next Inch';
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate(language, 'Charlas motivacionales y experiencias de liderazgo inspiradas en el deporte.'));
    try { localStorage.setItem(languageStorageKey, language); } catch { /* The selector still works without storage. */ }
  }, [language]);
  const value = useMemo(() => ({
    language,
    locale: locales[language],
    setLanguage: (next) => { if (languages.includes(next)) setLanguage(next); },
    t: (key, values) => translate(language, key, values),
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
export const useLanguage = () => useContext(LanguageContext);
