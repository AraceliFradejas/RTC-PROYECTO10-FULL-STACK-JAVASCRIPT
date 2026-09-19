import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getMetadata, metadataHtml } from './metadata.js';

export const PageMetadata = ({ event, unavailable = false }) => {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  useEffect(() => {
    const meta = getMetadata(pathname, language, event, unavailable);
    document.head.querySelectorAll('[data-seo], title, meta[name="description"]').forEach(node => node.remove());
    const template = document.createElement('template');
    template.innerHTML = metadataHtml(meta);
    document.head.append(template.content);
  }, [pathname, language, event, unavailable]);
  return null;
};
