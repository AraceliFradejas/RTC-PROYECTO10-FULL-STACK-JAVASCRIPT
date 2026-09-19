import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
export { getMetadata, metadataHtml, utilityRoutes, publicRoutes, siteUrl } from './seo/metadata.js';

export function renderPage(path) {
  return renderToString(<LanguageProvider><MemoryRouter initialEntries={[path]}><ToastProvider><AuthProvider><App /></AuthProvider></ToastProvider></MemoryRouter></LanguageProvider>);
}
