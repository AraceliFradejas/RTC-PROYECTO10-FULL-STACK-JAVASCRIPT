import { Link } from 'react-router-dom';
import { kelseTsSites, socialLinks } from '../data/brandLinks.js';
import { Logo } from './Logo.jsx';

export const Footer = () => <footer className="footer">
  <div className="shell footer__grid">
    <div className="footer__brand"><Logo /><p>Ideas que mueven equipos. Historias que cambian el partido.</p></div>
    <div><h2>Universo KelseTS</h2>{kelseTsSites.map((site) => <a href={site.url} target="_blank" rel="noopener noreferrer" key={site.name}>{site.name}</a>)}</div>
    <div><h2>Conecta</h2>{socialLinks.map((social) => <a href={social.url} target="_blank" rel="noopener noreferrer" key={social.name}>{social.name}</a>)}</div>
    <div><h2>KelseTS Talks</h2><Link to="/events">Agenda</Link><Link to="/about">La empresa</Link><Link to="/legal">Aviso legal</Link></div>
  </div>
  <div className="shell footer__bottom"><p>© {new Date().getFullYear()} KelseTS · Proyecto ficticio educativo</p><p>Sin afiliación con Taylor Swift, Travis Kelce, Kansas City Chiefs o la NFL.</p></div>
</footer>;
