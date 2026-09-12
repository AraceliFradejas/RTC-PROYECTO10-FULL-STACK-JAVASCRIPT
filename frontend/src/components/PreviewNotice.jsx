import { useLanguage } from '../context/LanguageContext.jsx';
import { previewMode } from '../services/events.js';

export const PreviewNotice = () => {
  const { t } = useLanguage();
  if (!previewMode) return null;
  return <p className="preview-notice"><strong>{t('Agenda de muestra')}</strong><span>{t('Descubre las charlas del año. Reservas aún no disponibles.')}</span></p>;
};
