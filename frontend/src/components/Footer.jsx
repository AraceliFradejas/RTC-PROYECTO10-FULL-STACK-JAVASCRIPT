import { Logo } from './Logo.jsx';

export const Footer = () => <footer className="footer">
  <div className="shell footer__inner"><Logo /><p>Ideas que mueven equipos. Historias que cambian el partido.</p><p>© {new Date().getFullYear()} KelseTS</p></div>
</footer>;
