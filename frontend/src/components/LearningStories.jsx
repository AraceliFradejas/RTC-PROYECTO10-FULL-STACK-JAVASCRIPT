import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { speakers } from '../data/speakers.js';
import talks from '../data/speakerTalks.json';
import stories from '../data/learningStories.json';
import { getYouTubeUrl } from '../services/media.js';

export const LearningStories = ({ content = stories }) => {
  const { language, t } = useLanguage();
  const presentationUrl = getYouTubeUrl(content.presentation[language]?.youtubeUrl);
  return <section className="learning-stories section" id="asi-lo-vivimos" aria-labelledby="learning-stories-title">
    <div className="shell">
      <div className="learning-stories__heading">
        <p className="kicker">{t('Así aprendemos')}</p>
        <h2 id="learning-stories-title">{t('Conoce la experiencia de nuestros alumnos')}</h2>
        <p>{t('Descubre cómo aprendieron nuestros alumnos con nuestros ponentes.')}</p>
      </div>
      <div className="learning-stories__intro">
        <div className="learning-stories__presentation">
          <span className="learning-stories__badge">{t(presentationUrl ? 'Nuestra mirada, en vídeo' : 'Nuestra mirada, en vídeo · Próximamente')}</span>
          <h3>{t('Cuatro charlas vistas desde el aula.')}</h3>
          <p>{t('Una mirada desde el aula: fragmentos de las cuatro charlas y reflexiones sobre lo aprendido y cómo llevarlo a la práctica.')}</p>
          {presentationUrl ? <a className="button button--accent" href={presentationUrl} target="_blank" rel="noopener noreferrer"><Play aria-hidden="true" />{t('Ver en YouTube · Se abre en otra pestaña')}</a>
            : <a className="text-link" href="#learning-fragments">{t('Explora los aprendizajes')}<ArrowDown aria-hidden="true" /></a>}
        </div>
        <aside className="learning-stories__context">
          <BookOpen aria-hidden="true" />
          <h3>{t('Aprender, compartir, poner en práctica')}</h3>
          <p>{t('Selecciona un fragmento, descubre su idea principal y encuentra un pequeño paso que puedas probar con tu equipo.')}</p>
          <p className="learning-stories__notice">{t('Recreación con IA para un proyecto del máster, sin fines lucrativos y con finalidad exclusivamente pedagógica.')}</p>
        </aside>
      </div>
      <div className="learning-stories__grid" id="learning-fragments">
        {speakers.map((speaker, index) => {
          const clip = talks[speaker.id]?.[language];
          const reflection = content.reflections[speaker.id]?.[language];
          if (!clip || !reflection) return null;
          const clipUrl = getYouTubeUrl(clip.youtubeUrl);
          return <article className="learning-story" key={speaker.id}>
            <img className="learning-story__image" src={clip.poster} alt={t('Durante la charla de {name}', { name: speaker.name })} loading="lazy" width="1672" height="941" />
            <div className="learning-story__body">
              <p className="learning-story__speaker"><span aria-hidden="true">0{index + 1}</span>{speaker.name}</p>
              <h3>{reflection.title}</h3>
              <p>{reflection.text}</p>
              <div className="learning-story__action"><strong>{t('Llévalo a tu equipo')}</strong><p>{reflection.action}</p></div>
              <details><summary>{t('Leer un fragmento de la charla')}</summary><h4>{clip.title}</h4>{clip.transcript.split('\n\n').slice(0, 2).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</details>
              <div className="learning-story__links">
                <Link className="text-link" to={`/speakers/${speaker.id}`}>{t('Conoce a {name}', { name: speaker.name })}<ArrowRight aria-hidden="true" /></Link>
                {clipUrl && <a className="text-link" href={clipUrl} target="_blank" rel="noopener noreferrer" aria-label={t('Ver en YouTube · Se abre en otra pestaña')}>{t('Ver charla en YouTube')}<ArrowUpRight aria-hidden="true" /></a>}
              </div>
            </div>
          </article>;
        })}
      </div>
      <div className="learning-stories__footer"><p>{t('Tu próxima experiencia empieza con una buena pregunta.')}</p><Link className="button button--dark" to="/events">{t('Descubre las próximas charlas')}<ArrowRight aria-hidden="true" /></Link></div>
    </div>
  </section>;
};
