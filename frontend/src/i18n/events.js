import catalogue from './events.json';

// Only translate our editorial catalogue. Organiser-written text stays intact.
export const localizeEvent = (event, language) => {
  const entry = catalogue.find(item => item.sourceTitle === event.title);
  const localized = entry?.[language];
  return {
    ...event,
    title: event.translations?.[language]?.title || localized?.title || event.title,
    description: event.translations?.[language]?.description ||
      (event.description === entry?.sourceDescription ? localized?.description : null) || event.description,
  };
};
