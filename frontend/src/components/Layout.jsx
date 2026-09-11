import { useLanguage } from "../context/LanguageContext.jsx";
import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
export const Layout = () => {
  const {
    t
  } = useLanguage();
  const { pathname } = useLocation();
  useLayoutEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [pathname]);
  return <><a className="skip-link" href="#content">{t("Saltar al contenido")}</a><Header /><main id="content"><Outlet /></main><Footer /></>;
};
