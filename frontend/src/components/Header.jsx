import { useLanguage } from "../context/LanguageContext.jsx";
import { CalendarPlus, LogOut, Menu, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LanguageSelector } from './LanguageSelector.jsx';
import { Logo } from './Logo.jsx';
export const Header = () => {
  const {
    t
  } = useLanguage();
  const {
    user,
    logout
  } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="site-header">
    <div className="shell header-inner">
      <Logo />
      <LanguageSelector />
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={t(open ? "Cerrar navegación" : "Abrir navegación")}>{open ? <X /> : <Menu />}</button>
      <nav className={open ? 'nav nav--open' : 'nav'} aria-label={t("Navegación principal")}>
        <NavLink to="/events" onClick={close}>{t("Explorar")}</NavLink>
        <NavLink to="/speakers" onClick={close}>{t("Ponentes")}</NavLink>
        <NavLink to="/about" onClick={close}>{t("La empresa")}</NavLink>
        {user ? <>
          <Link className="button button--dark button--small" to="/events/new" onClick={close}><CalendarPlus /> {t("Proponer talk")}</Link>
          <span className="nav__user"><UserRound /> {t("Hola,")} {user.name.split(' ')[0]}</span>
          <button className="icon-button" onClick={() => {
            logout();
            close();
          }} aria-label={t("Cerrar sesión")}><LogOut /></button>
        </> : <Link className="button button--dark button--small" to="/auth" onClick={close}>{t("Entrar")}</Link>}
      </nav>
    </div>
  </header>;
};
