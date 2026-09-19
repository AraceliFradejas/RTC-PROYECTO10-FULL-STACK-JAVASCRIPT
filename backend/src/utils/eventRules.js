export const eventCategories = ['Liderazgo', 'Resiliencia', 'Equipo', 'Rendimiento', 'Innovación', 'Bienestar', 'Otros'];
export const speakerIds = ['alison-patrick', 'jude-becks', 'anna-nasser', 'travis-wood'];

export const unchangedEventDate = (value, original) => Boolean(original && Date.parse(value) === new Date(original.date).getTime());
export const eventHasEnded = (event, now = Date.now()) => new Date(event.date).getTime() <= now;

// An edited field becomes the new source text in both languages until translated again.
export const synchronizeEditedTranslations = (event, payload) => {
  for (const field of ['title', 'description']) {
    if (payload[field] === undefined || payload[field] === event[field]) continue;
    for (const language of ['es', 'en']) {
      if (event.translations?.[language]) event.translations[language][field] = payload[field];
    }
  }
};
