import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import videos from '../data/speakerVideos.json';

export const SpeakerInvitation = ({ speaker, media = videos }) => {
  const { t, language } = useLanguage();
  const [failedSource, setFailedSource] = useState(null);
  const clip = media[speaker.id]?.[language];
  const transcript = speaker[language].invitation;
  const playable = clip?.src && clip.src !== failedSource;
  return <section className="speaker-invitation" aria-label={t('Una invitación de {name}', { name: speaker.name })}>
    <p className="kicker">{t('Nos vemos en la próxima charla')}</p>
    <h2>{t('Una invitación de {name}', { name: speaker.name })}</h2>
    {playable ? <>
      <video key={`${speaker.id}-${language}`} controls playsInline preload="none" poster={clip.poster || speaker.image} aria-label={t('Invitación en vídeo de {name}', { name: speaker.name })} onError={() => setFailedSource(clip.src)}>
        <source src={clip.src} type="video/mp4" />
        {clip.captions && <track kind="captions" src={clip.captions} srcLang={language} label={language === 'es' ? 'Español' : 'English'} default />}
      </video>
      <details><summary>{t('Leer transcripción')}</summary><p>{transcript}</p></details>
    </> : <p className="speaker-invitation__text">{transcript}</p>}
  </section>;
};
