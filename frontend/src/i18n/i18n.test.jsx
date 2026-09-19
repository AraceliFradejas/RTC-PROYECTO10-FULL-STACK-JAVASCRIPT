import { LearningStories } from '../components/LearningStories.jsx';
import learningStories from '../data/learningStories.json';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import { App } from '../App.jsx';
import { EventFormPage } from '../pages/EventFormPage.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { formatEventDate, languageStorageKey, readLanguage, translate } from './translate.js';
import { localizeEvent } from './events.js';
import catalogue from './events.json';
import { speakers, getEventSpeaker } from '../data/speakers.js';
import { SpeakerInvitation } from '../components/SpeakerInvitation.jsx';
import { EventSpeaker } from '../components/EventSpeaker.jsx';
import previewEvents from '../data/previewEvents.json';

vi.mock('../hooks/useEvents.js', () => ({
  useEvents: () => ({ events: [{ _id: 'demo', speakerId: 'alison-patrick', title: 'The Next Inch: Leadership', category: 'Liderazgo', date: '2027-02-18T18:00:00Z', location: 'Madrid', attendees: [], capacity: 30 }], loading: false, error: '' }),
}));
afterEach(() => vi.unstubAllGlobals());
const render = (language, route = '/', child = <App />) => {
  vi.stubGlobal('localStorage', { getItem: key => key === languageStorageKey ? language : null });
  return renderToStaticMarkup(<LanguageProvider><MemoryRouter initialEntries={[route]}><ToastProvider><AuthProvider>{child}</AuthProvider></ToastProvider></MemoryRouter></LanguageProvider>);
};

describe('complete language versions', () => {
  it('renders the home, carousel, speakers, events and footer in English', () => {
    const html = render('en');
    for (const text of ['Inch by inch.', 'Together.', 'Every inch counts', 'High-performance leadership', 'Upcoming experiences', '0 attendees', 'Legal notice', 'The Next Inch: Leadership']) expect(html).toContain(text);
    for (const text of ['Centímetro a centímetro.', 'Liderazgo de alto rendimiento', 'Próximas experiencias', 'Aviso legal']) expect(html).not.toContain(text);
    expect(html).toContain('aria-label="English" aria-pressed="true"');
  });
  it('renders Spanish without the old English headings and slogan', () => {
    const html = render('es');
    for (const text of ['Centímetro a centímetro.', 'La siguiente jugada', 'Avanza un centímetro. Cambia el partido.', 'The Next Inch: liderazgo', 'Ponentes y experiencias ficticias']) expect(html).toContain(text);
    for (const text of ['Move the next inch.', 'The next play', 'One brand · Different plays', 'Descubre sus talks']) expect(html).not.toContain(text);
  });
  it.each([
    ['/about', 'From the locker room to the workplace', 'Del vestuario a la empresa'],
    ['/events', 'Coming up soon', 'Más próximos'],
    ['/auth', 'Password', 'Contraseña'],
    ['/forgot-password', 'Recover your account', 'Recupera tu acceso'],
    ['/reset-password', 'Request a new link', 'Solicitar un enlace nuevo'],
    ['/legal', 'solely for educational', 'con fines exclusivamente educativos'],
    ['/missing', 'Back to home', 'Volver al inicio'],
  ])('localizes the %s route', (route, en, es) => {
    expect(render('en', route)).toContain(en);
    expect(render('en', route)).not.toContain(es);
    expect(render('es', route)).toContain(es);
    expect(render('es', route)).not.toContain(en);
  });
  it('translates event form labels while keeping API category values stable', () => {
    const html = render('en', '/', <EventFormPage />);
    expect(html).toContain('Event title');
    expect(html).toContain('value="Liderazgo" selected="">Leadership</option>');
    expect(html).toContain('Upload a poster');
    expect(html).not.toContain('Publicar evento');
  });
  it('localizes defaults and connection failures', () => {
    expect(render('en', '/', <EmptyState />)).toContain('No events here yet');
    expect(render('en', '/', <EmptyState message="No podemos conectar con el servidor. Inténtalo de nuevo más tarde." />)).toContain('We can’t connect to the server.');
    expect(translate('en', 'Escribe al menos 2 caracteres.')).toBe('Enter at least 2 characters.');
    expect(translate('es', 'Enter at least 2 characters.')).toBe('Escribe al menos 2 caracteres.');
  });
  it('uses saved supported preferences and survives blocked or invalid storage', () => {
    vi.stubGlobal('localStorage', { getItem: () => 'en' });
    expect(readLanguage()).toBe('en');
    vi.stubGlobal('localStorage', { getItem: () => 'fr' });
    expect(readLanguage()).toBe('es');
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('blocked'); } });
    expect(readLanguage()).toBe('es');
  });
  it('formats dates and interpolates translated counts', () => {
    expect(formatEventDate('2027-04-08T12:00:00Z', 'en')).toContain('Apr');
    expect(formatEventDate('2027-04-08T12:00:00Z', 'es')).toContain('abr');
    expect(translate('en', '{count} de {capacity} plazas confirmadas', { count: 1, capacity: 30 })).toBe('1 of 30 places confirmed');
  });
  it('translates all editorial events without overwriting organiser content', () => {
    for (const item of catalogue) {
      const event = { title: item.sourceTitle, description: item.sourceDescription };
      expect(localizeEvent(event, 'en').description).toBe(item.en.description);
      expect(localizeEvent(event, 'es').title).toBe(item.es.title);
      expect(localizeEvent({ ...event, description: 'My own description' }, 'en').description).toBe('My own description');
    }
    const custom = { title: 'A new event', description: 'Written by the organiser' };
    expect(localizeEvent(custom, 'es')).toEqual(custom);
  });
});


describe('speaker profiles and event relationships', () => {
  it.each(speakers)('renders $name in both languages with the correct portrait and biography', speaker => {
    const en = render('en', `/speakers/${speaker.id}`);
    const es = render('es', `/speakers/${speaker.id}`);
    expect(en).toContain(speaker.name);
    expect(en).toContain(speaker.image);
    expect(en).toContain(speaker.en.lead);
    expect(en).not.toContain(speaker.es.lead);
    expect(es).toContain(speaker.es.lead);
    expect(es).not.toContain(speaker.en.lead);
    expect(en).toContain('Fictional biography');
    expect(es).toContain('Biografía ficticia');
  });
  it('links the directory cards and the assigned event to the same biography', () => {
    const directory = render('en', '/speakers');
    for (const speaker of speakers) expect(directory).toContain(`href="/speakers/${speaker.id}"`);
    const event = previewEvents.find(event => event.speakerId === 'alison-patrick');
    const card = render('en', '/', <EventSpeaker event={event} />);
    expect(card).toContain('Alison Patrick');
    expect(card).toContain('href="/speakers/alison-patrick"');
    expect(card).toContain('Read biography');
    expect(render('en', '/speakers/alison-patrick')).toContain('href="/events/demo"');
  });
  it('keeps unassigned talks pending and does not infer a speaker from their category', () => {
    const unassigned = [{ title: 'A new event', category: 'Liderazgo' }];
    for (const event of unassigned) {
      expect(getEventSpeaker(event)).toBeUndefined();
      expect(render('en', '/', <EventSpeaker event={event} />)).toContain('Speaker to be announced');
    }
    expect(getEventSpeaker({ title: 'A new event', category: 'Liderazgo' })).toBeUndefined();
  });
  it('recognises unchanged editorial API records without overwriting explicit speaker assignments', () => {
    const entry = catalogue.find(item => item.speakerId === 'alison-patrick');
    const event = { title: entry.sourceTitle, description: entry.sourceDescription };
    expect(getEventSpeaker(event).id).toBe('alison-patrick');
    expect(getEventSpeaker({ ...event, description: 'A different event' })).toBeUndefined();
    expect(getEventSpeaker({ ...event, speakerId: 'unknown' })).toBeUndefined();
  });
  it('provides a translated recovery link for missing profiles', () => {
    expect(render('es', '/speakers/missing')).toContain('No encontramos este perfil');
    expect(render('en', '/speakers/missing')).toContain('href="/speakers"');
  });
});


describe('faculty appointments and video invitations', () => {
  it('shows the executive appointment and faculty roles in both languages', () => {
    expect(render('es', '/speakers/alison-patrick')).toContain('Miembro del Comité de Dirección del grupo KelseTS');
    expect(render('en', '/speakers/alison-patrick')).toContain('Member of the KelseTS Group Executive Committee');
    for (const speaker of speakers) {
      expect(render('es', `/speakers/${speaker.id}`)).toContain(speaker.es.facultyTitle);
      expect(render('en', `/speakers/${speaker.id}`)).toContain(speaker.en.facultyTitle);
    }
  });
  it('shows the invitation as text until a video exists in the selected language', () => {
    const speaker = speakers[0];
    const html = render('es', '/', <SpeakerInvitation speaker={speaker} media={{}} />);
    expect(html).toContain(speaker.es.invitation);
    expect(html).not.toContain('<video');
    const english = render('en', '/', <SpeakerInvitation speaker={speaker} media={{ 'alison-patrick': { es: { src: '/test-es.mp4' } } }} />);
    expect(english).toContain(speaker.en.invitation);
    expect(english).not.toContain('/test-es.mp4');
  });
  it('opens published videos on YouTube from a static image', () => {
    const html = render('en', '/', <SpeakerInvitation speaker={speakers[0]} media={{ 'alison-patrick': { en: { youtubeUrl: 'https://www.youtube.com/watch?v=example' } } }} />);
    expect(html).toContain('<img');
    expect(html).toContain('href="https://www.youtube.com/watch?v=example"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('Read transcript');
    expect(html).not.toContain('<video');
    expect(html).not.toContain('<iframe');
  });
  it('uses an expandable static preview until a valid YouTube link is available', () => {
    for (const youtubeUrl of ['', 'https://example.com/video', 'javascript:alert(1)']) {
      const html = render('es', '/', <SpeakerInvitation speaker={speakers[0]} media={{ 'alison-patrick': { es: { youtubeUrl } } }} />);
      expect(html).toContain('class="speaker-preview"');
      expect(html).toContain('aria-expanded="false"');
      expect(html).toContain('Leer transcripción');
      expect(html).toContain(speakers[0].es.invitation);
      expect(html).not.toContain('target="_blank"');
    }
    expect(render('es', '/speakers/alison-patrick')).toContain('Descubre cómo aprendieron nuestros alumnos con nuestros ponentes');
    expect(render('en', '/speakers/alison-patrick')).toContain('Discover how our students learned with our speakers');
  });
});


describe('bilingual learning stories', () => {
  it.each(['es', 'en'])('shows four reflections and excerpts without the removed context panel in %s', language => {
    const html = render(language, '/', <LearningStories />);
    expect(html.match(/class="learning-story"/g)).toHaveLength(4);
    for (const speaker of speakers) {
      expect(html).toContain(learningStories.reflections[speaker.id][language].title);
      expect(html).toContain(learningStories.reflections[speaker.id][language].action);
      expect(html).toContain(`href="/speakers/${speaker.id}"`);
      expect(html).not.toContain(learningStories.reflections[speaker.id][language === 'es' ? 'en' : 'es'].title);
    }
    expect(html).not.toContain('learning-stories__context');
    expect(html).toContain(language === 'es' ? 'Próximamente' : 'Coming soon');
    expect(html).toContain('href="#learning-fragments"');
    expect(html).not.toContain('<video');
    expect(html).not.toContain('<iframe');
  });
  it('preserves the agenda and original portraits before the student experience', () => {
    const html = render('es');
    expect(html.indexOf('id="speakers"')).toBeLessThan(html.indexOf('id="asi-lo-vivimos"'));
    expect(html.indexOf('Próximas experiencias')).toBeLessThan(html.indexOf('id="speakers"'));
    expect(html).toContain('Conoce la experiencia de nuestros alumnos');
    for (const speaker of speakers) expect(html).toContain(`src="${speaker.image}"`);
    expect(render('en')).toContain('Discover our students’ experience');
  });
  it('opens only a published YouTube presentation for the selected language', () => {
    const content = { ...learningStories, presentation: { es: { youtubeUrl: 'https://youtu.be/example' }, en: { youtubeUrl: '' } } };
    const es = render('es', '/', <LearningStories content={content} />);
    expect(es).toContain('href="https://youtu.be/example"');
    expect(es).toContain('target="_blank"');
    expect(es).not.toContain('Próximamente');
    expect(render('en', '/', <LearningStories content={content} />)).not.toContain('https://youtu.be/example');
    const invalid = { ...content, presentation: { es: { youtubeUrl: 'https://example.com/video' } } };
    expect(render('es', '/', <LearningStories content={invalid} />)).toContain('Próximamente');
  });
});

it('offers the four speakers and an unassigned option in the event form in both languages', () => {
  for (const language of ['es', 'en']) {
    const html = render(language, '/', <EventFormPage />);
    expect(html).toContain('name="speakerId"');
    for (const speaker of speakers) {
      expect(html).toContain(`value="${speaker.id}"`);
      expect(html).toContain(speaker.name);
    }
    expect(html).toContain(language === 'es' ? 'Ponente por confirmar' : 'Speaker to be announced');
  }
});


describe('password recovery screens', () => {
  it('offers recovery from login and rejects a missing token without a password form', () => {
    expect(render('es', '/auth')).toContain('href="/forgot-password"');
    const html = render('es', '/reset-password');
    expect(html).toContain('role="alert"');
    expect(html).not.toContain('autoComplete="new-password"');
  });
  it('renders accessible new-password fields without exposing the token in markup', () => {
    const token = 'a'.repeat(64);
    vi.stubGlobal('window', { location: { hash: `#token=${token}` } });
    const html = render('es', '/reset-password');
    expect(html.match(/autoComplete="new-password"/g)).toHaveLength(2);
    expect(html).toContain('for="recovery-confirmation"');
    expect(html).toContain('aria-describedby="recovery-password-hint"');
    expect(html).toContain('id="recovery-password-hint"');
    expect(html).toContain('aria-describedby="recovery-confirmation-hint"');
    expect(html).not.toContain(token);
  });
});
