export const Loader = ({ label = 'Cargando…', full = false }) => <div className={full ? 'loader loader--full' : 'loader'} role="status"><span className="loader__ring" /><span>{label}</span></div>;

