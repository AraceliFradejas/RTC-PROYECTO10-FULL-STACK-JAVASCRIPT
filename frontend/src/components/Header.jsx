import { CalendarPlus, LogOut, Menu, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo } from './Logo.jsx';

export const Header = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="site-header">
    <div className="shell header-inner">
      <Logo />
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Abrir navegación">{open ? <X /> : <Menu />}</button>
      <nav className={open ? 'nav nav--open' : 'nav'} aria-label="Navegación principal">
        <NavLink to="/events" onClick={close}>Explorar</NavLink>
        <NavLink to="/about" onClick={close}>La empresa</NavLink>
        {user ? <>
          <Link className="button button--dark button--small" to="/events/new" onClick={close}><CalendarPlus /> Proponer talk</Link>
          <span className="nav__user"><UserRound /> Hola, {user.name.split(' ')[0]}</span>
          <button className="icon-button" onClick={() => { logout(); close(); }} aria-label="Cerrar sesión"><LogOut /></button>
        </> : <Link className="button button--dark button--small" to="/auth" onClick={close}>Entrar</Link>}
      </nav>
    </div>
  </header>;
};
