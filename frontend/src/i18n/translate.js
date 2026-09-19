import messages from './messages.json';

export const languages = ['es', 'en'];
export const languageStorageKey = 'kelsets_talks_language';
export const locales = { es: 'es-ES', en: 'en-GB' };
const aliases = new Map(Object.entries(messages).flatMap(([key, value]) => [[key, value], [value.es, value], [value.en, value]]));

export const translate = (language, key, values = {}) => {
  if (key == null) return '';
  const message = aliases.get(key)?.[language] ?? key;
  return String(message).replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
};

export const readLanguage = () => {
  try {
    const saved = localStorage.getItem(languageStorageKey);
    if (languages.includes(saved)) return saved;
  } catch { /* A blocked storage must not prevent navigation. */ }
  return 'es';
};

export const formatEventDate = (date, language = 'es') => new Intl.DateTimeFormat(locales[language], {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Madrid',
}).format(new Date(date));

export const formatEventTime = (date, language = 'es') => new Intl.DateTimeFormat(locales[language], { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }).format(new Date(date));
