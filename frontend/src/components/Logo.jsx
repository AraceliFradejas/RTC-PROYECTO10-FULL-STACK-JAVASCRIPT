import { Link } from 'react-router-dom';

export const Logo = () => <Link className="logo" to="/" aria-label="Lúmina Madrid, inicio">
  <span className="logo__mark" aria-hidden="true">L</span>
  <span>Lúmina<small>Madrid</small></span>
</Link>;

