import { Logo } from './Logo.jsx';

export const Footer = () => <footer className="footer">
  <div className="shell footer__inner"><Logo /><p>Encuentros con intención, creados en Madrid.</p><p>© {new Date().getFullYear()} Araceli Fradejas Muñoz</p></div>
</footer>;

