import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { languages, languageStorageKey, locales, readLanguage, translate } from '../i18n/translate.js';

const LanguageContext = createContext(null);
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(readLanguage);
  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem(languageStorageKey, language); } catch { /* The selector still works without storage. */ }
  }, [language]);
  const changeLanguage = useCallback(next => { if (languages.includes(next)) setLanguage(next); }, []);
  const value = useMemo(() => ({
    language,
    locale: locales[language],
    setLanguage: changeLanguage,
    t: (key, values) => translate(language, key, values),
  }), [language, changeLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
export const useLanguage = () => useContext(LanguageContext);
