import { getYouTubeUrl } from '../services/media.js';
import { useId, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export const SpeakerMediaPreview = ({ poster, youtubeUrl, title, transcript, children }) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const transcriptId = useId();
  const url = getYouTubeUrl(youtubeUrl);
  const cover = <>
    <img src={poster} alt="" loading="lazy" width="1280" height="720" />
    <span className="speaker-preview__overlay">
      <span className="speaker-preview__icon" aria-hidden="true">{url ? '▶' : '+'}</span>
      <span className="speaker-preview__action">{t(url ? 'Ver en YouTube · Se abre en otra pestaña' : 'Pulsa para descubrir la charla')}</span>
    </span>
  </>;
  return <div className="speaker-media">
    {url ? <a className="speaker-preview" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${title} · ${t('Ver en YouTube · Se abre en otra pestaña')}`}>{cover}</a>
      : <button type="button" className="speaker-preview" aria-label={`${t('Pulsa para descubrir la charla')} · ${title}`} aria-expanded={expanded} aria-controls={transcriptId} onClick={() => setExpanded(value => !value)}>{cover}</button>}
    <div className="speaker-media__content">
      {children}
      <p className="speaker-media__prompt">{title}</p>
      <details open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}>
        <summary>{t('Leer transcripción')}</summary>
        <div id={transcriptId}>{transcript.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      </details>
    </div>
  </div>;
};
