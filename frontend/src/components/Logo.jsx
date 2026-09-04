import { Link } from 'react-router-dom';

export const Logo = () => <Link className="logo" to="/" aria-label="KelseTS Talks, inicio">
  <span className="logo__mark" aria-hidden="true">K</span>
  <span>KelseTS<small>Talks</small></span>
</Link>;
