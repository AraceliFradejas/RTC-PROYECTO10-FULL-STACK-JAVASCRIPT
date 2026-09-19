import { speakers, getSpeaker } from '../data/speakers.js';
import { localizeEvent } from '../i18n/events.js';

export const siteUrl = 'https://kelse-ts-talks.vercel.app';
export const publicRoutes = ['/', '/events', '/speakers', '/about', '/legal', ...speakers.map(speaker => `/speakers/${speaker.id}`)];
const pages = {
  '/': {
    es: ['Charlas de liderazgo y trabajo en equipo', 'Explora KelseTS Talks: charlas, ponentes y aprendizajes inspirados en el deporte. Plataforma ficticia de eventos creada como proyecto académico.'],
    en: ['Leadership and teamwork talks', 'Explore KelseTS Talks: speakers and learning experiences inspired by sport. A fictional events platform created as an educational project.'],
  },
  '/events': {
    es: ['Agenda de charlas', 'Consulta la agenda de KelseTS Talks y filtra charlas por tema, lugar y fecha. Eventos ficticios de liderazgo, resiliencia e innovación.'],
    en: ['Talks and events', 'Explore the KelseTS Talks agenda by topic, location and date. Fictional events about leadership, resilience and innovation.'],
  },
  '/speakers': {
    es: ['Ponentes', 'Conoce los cuatro ponentes ficticios de KelseTS Talks, sus biografías, charlas y transcripciones sobre liderazgo, equipos, datos y resiliencia.'],
    en: ['Speakers', 'Meet the four fictional KelseTS Talks speakers through biographies, talks and transcripts about leadership, teams, data and resilience.'],
  },
  '/about': {
    es: ['Sobre el proyecto', 'Qué es KelseTS Talks: un proyecto académico de Araceli Fradejas Muñoz que conecta deporte, aprendizaje y desarrollo profesional.'],
    en: ['About the project', 'What is KelseTS Talks? An educational project by Araceli Fradejas Muñoz connecting sport, learning and professional development.'],
  },
  '/legal': {
    es: ['Aviso legal y finalidad educativa', 'Consulta el carácter ficticio y educativo de KelseTS Talks, sus recursos y el aviso de ausencia de afiliación con personas y entidades reales.'],
    en: ['Legal notice and educational purpose', 'Read about the fictional, educational nature of KelseTS Talks and its non-affiliation with real people and organisations.'],
  },
  '/auth': { es: ['Iniciar sesión o crear cuenta', 'Accede a tu cuenta de KelseTS Talks para gestionar tu asistencia a las experiencias.'], en: ['Sign in or create an account', 'Sign in to KelseTS Talks to manage your attendance at learning experiences.'] },
  '/events/new': { es: ['Crear una experiencia', 'Crea una charla en KelseTS Talks.'], en: ['Create an experience', 'Create a talk on KelseTS Talks.'] },
};

export function getMetadata(pathname, language = 'es', event, unavailable = false) {
  const lang = language === 'en' ? 'en' : 'es';
  const path = pathname.replace(/\/+$/, '') || '/';
  const speaker = path.startsWith('/speakers/') ? getSpeaker(path.slice('/speakers/'.length)) : null;
  const content = event ? localizeEvent(event, lang) : null;
  let pair = pages[path]?.[lang];
  let image = '/images/brand/brand-origin-clean.jpg';
  if (speaker) {
    pair = [`${speaker.name} · ${lang === 'es' ? 'Ponente ficticio' : 'Fictional speaker'}`, `${lang === 'es' ? 'Perfil ficticio. ' : 'Fictional profile. '}${speaker[lang].lead}`];
    image = speaker.image;
  }
  if (content) {
    pair = [content.title, `${lang === 'es' ? 'Evento del proyecto académico KelseTS Talks. ' : 'Event from the KelseTS Talks educational project. '}${content.description || ''}`];
    if (event.poster) image = event.poster;
  }
  if (!pair && /^\/events\/[^/]+$/.test(path) && !unavailable) pair = lang === 'es' ? ['Detalle de la experiencia', 'Consulta esta experiencia del proyecto académico KelseTS Talks.'] : ['Experience details', 'Explore this experience from the KelseTS Talks educational project.'];
  const known = Boolean(pair) && !unavailable;
  if (!known) pair = lang === 'es' ? ['Contenido no disponible', 'Explora la agenda y los ponentes de KelseTS Talks.'] : ['Content unavailable', 'Explore the KelseTS Talks agenda and speakers.'];
  const noindex = !known || ['/auth', '/events/new'].includes(path);
  const url = `${siteUrl}${path === '/' ? '/' : path}`;
  const title = `${pair[0]} | KelseTS Talks`;
  const description = pair[1].replace(/\s+/g, ' ').slice(0, 180).trim();
  const absoluteImage = new URL(image, siteUrl).href;
  // These are fictional educational profiles/events, not real Event or Person listings.
  const structured = noindex ? null : {
    '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#webpage`, url,
    name: title, description, inLanguage: lang,
    isPartOf: { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'KelseTS Talks', description: lang === 'es' ? 'Proyecto ficticio educativo de gestión de eventos.' : 'Fictional educational events project.' },
  };
  return { title, description, url, image: absoluteImage, language: lang, robots: noindex ? 'noindex, follow' : 'index, follow', structured };
}

export const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
export const serializeJson = value => JSON.stringify(value).replace(/</g, '\\u003c');
export function metadataHtml(meta) {
  const tags = [
    ['name', 'description', meta.description], ['name', 'robots', meta.robots],
    ['property', 'og:type', 'website'], ['property', 'og:site_name', 'KelseTS Talks'],
    ['property', 'og:title', meta.title], ['property', 'og:description', meta.description],
    ['property', 'og:url', meta.url], ['property', 'og:image', meta.image],
    ['property', 'og:locale', meta.language === 'es' ? 'es_ES' : 'en_GB'],
    ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', meta.title],
    ['name', 'twitter:description', meta.description], ['name', 'twitter:image', meta.image],
  ];
  return `<title data-seo="true">${escapeHtml(meta.title)}</title>\n${meta.url ? `<link data-seo="true" rel="canonical" href="${escapeHtml(meta.url)}" />` : ''}\n` +
    tags.filter(([, , value]) => value != null).map(([attribute, key, value]) => `<meta data-seo="true" ${attribute}="${key}" content="${escapeHtml(value)}" />`).join('\n') +
    (meta.structured ? `\n<script data-seo="true" type="application/ld+json">${serializeJson(meta.structured)}</script>` : '');
}
