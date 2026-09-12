import { useLanguage } from '../context/LanguageContext.jsx';
import videos from '../data/speakerVideos.json';
import { SpeakerMediaPreview } from './SpeakerMediaPreview.jsx';

export const SpeakerInvitation = ({ speaker, media = videos }) => {
  const { t, language } = useLanguage();
  const clip = media[speaker.id]?.[language];
  const transcript = speaker[language].invitation;
  return <section className="speaker-invitation speaker-invitation--personal" aria-label={t('Una invitación de {name}', { name: speaker.name })}>
    <SpeakerMediaPreview poster={clip?.poster || speaker.image} youtubeUrl={clip?.youtubeUrl} title={t('Descubre su invitación')} transcript={transcript}>
      <p className="kicker">{t('Nos vemos en la próxima charla')}</p>
      <h2>{t('Una invitación de {name}', { name: speaker.name })}</h2>
      <p className="speaker-talk__intro">{speaker[language].lead}</p>
    </SpeakerMediaPreview>
  </section>;
};
