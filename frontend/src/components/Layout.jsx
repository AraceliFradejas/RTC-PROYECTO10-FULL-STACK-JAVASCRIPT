import { useLanguage } from "../context/LanguageContext.jsx";
import { useEffect, useRef } from 'react';
import { PageMetadata } from '../seo/PageMetadata.jsx';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
export const Layout = () => {
  const {
    t
  } = useLanguage();
  const { pathname } = useLocation();
  const routePath = pathname.replace(/\/+$/, '') || '/';
  const main = useRef(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      main.current?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
  }, [pathname]);
  return <>{!/^\/events\/(?!new$)[^/]+$/.test(routePath) && <PageMetadata />}<a className="skip-link" href="#content">{t("Saltar al contenido")}</a><Header /><main id="content" tabIndex={-1} ref={main}><Outlet /></main><Footer /></>;
};
