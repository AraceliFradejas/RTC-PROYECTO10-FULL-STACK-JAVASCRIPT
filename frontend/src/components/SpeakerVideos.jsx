import { useId, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import talks from '../data/speakerTalks.json';
import { SpeakerMediaPreview } from './SpeakerMediaPreview.jsx';
import { SpeakerInvitation } from './SpeakerInvitation.jsx';

export const SpeakerVideos = ({ speaker }) => {
  const { language, t } = useLanguage();
  const [selection, setSelection] = useState('talk');
  const panelId = useId();
  const clip = talks[speaker?.id]?.[language];
  if (!speaker || !clip) return speaker ? <SpeakerInvitation speaker={speaker} /> : null;
  const duration = Math.round(clip.duration);
  return <section className="speaker-videos" aria-label={t('Vídeos de {name}', { name: speaker.name })}>
    <div className="speaker-videos__selector" role="group" aria-label={t('Elige un vídeo')}>
      <button type="button" aria-pressed={selection === 'talk'} aria-controls={panelId} onClick={() => setSelection('talk')}>{t('Así aprendemos')}</button>
      <button type="button" aria-pressed={selection === 'invitation'} aria-controls={panelId} onClick={() => setSelection('invitation')}>{t('Su invitación')}</button>
    </div>
    <div id={panelId}>
      {selection === 'invitation' ? <SpeakerInvitation speaker={speaker} /> : <section className="speaker-invitation speaker-talk">
        <SpeakerMediaPreview poster={clip.poster} youtubeUrl={clip.youtubeUrl} title={t('Descubre cómo aprendieron nuestros alumnos con nuestros ponentes')} transcript={clip.transcript}>
          <p className="kicker">KelseTS School · {speaker.name}</p>
          <div className="speaker-talk__heading"><h2>{clip.title}</h2><span>{Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')} · {language.toUpperCase()}</span></div>
          <p className="speaker-talk__intro">{speaker[language].approach}</p>
          <ul className="speaker-talk__topics">{speaker[language].topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
          <p className="speaker-talk__note">{t('Recreación con IA para un proyecto del máster, sin fines lucrativos y con finalidad exclusivamente pedagógica.')}</p>
        </SpeakerMediaPreview>
      </section>}
    </div>
  </section>;
};
