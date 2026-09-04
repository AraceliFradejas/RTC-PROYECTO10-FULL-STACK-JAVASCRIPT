import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

export const Layout = () => <><a className="skip-link" href="#content">Saltar al contenido</a><Header /><main id="content"><Outlet /></main><Footer /></>;

