import { useId, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import talks from '../data/speakerTalks.json';
import { SpeakerInvitation } from './SpeakerInvitation.jsx';

export const SpeakerVideos = ({ speaker }) => {
  const { language, t } = useLanguage();
  const [selection, setSelection] = useState('talk');
  const [failedSource, setFailedSource] = useState(null);
  const panelId = useId();
  const clip = talks[speaker?.id]?.[language];
  if (!speaker || !clip) return speaker ? <SpeakerInvitation speaker={speaker} /> : null;
  const duration = Math.round(clip.duration);
  return <section className="speaker-videos" aria-label={t('Vídeos de {name}', { name: speaker.name })}>
    <div className="speaker-videos__selector" role="group" aria-label={t('Elige un vídeo')}>
      <button type="button" aria-pressed={selection === 'talk'} aria-controls={panelId} onClick={() => setSelection('talk')}>{t('Un fragmento de su charla')}</button>
      <button type="button" aria-pressed={selection === 'invitation'} aria-controls={panelId} onClick={() => setSelection('invitation')}>{t('Su invitación')}</button>
    </div>
    <div id={panelId}>
      {selection === 'invitation' ? <SpeakerInvitation speaker={speaker} /> : <section className="speaker-invitation speaker-talk">
        <p className="kicker">KelseTS School · {speaker.name}</p>
        <div className="speaker-talk__heading"><h2>{clip.title}</h2><span>{Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')} · {language.toUpperCase()}</span></div>
        <p className="speaker-talk__note">{t('Charla ficticia recreada con IA para el universo educativo de KelseTS.')}</p>
        {failedSource !== clip.src ? <video key={`${speaker.id}-${language}-${clip.src}`} controls playsInline preload="none" poster={clip.poster} aria-label={t('Charla en vídeo de {name}', { name: speaker.name })} onError={() => setFailedSource(clip.src)}>
          <source src={clip.src} type="video/mp4" />
          <track kind="captions" src={clip.captions} srcLang={language} label={language === 'es' ? 'Español' : 'English'} default />
        </video> : <p role="status">{t('No se ha podido cargar el vídeo. Puedes leer la charla a continuación.')}</p>}
        <details open={failedSource === clip.src}><summary>{t('Leer transcripción')}</summary>{clip.transcript.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</details>
      </section>}
    </div>
  </section>;
};
