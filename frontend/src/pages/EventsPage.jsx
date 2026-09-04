import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState.jsx';
import { EventCard } from '../components/EventCard.jsx';
import { Loader } from '../components/Loader.jsx';
import { useEvents } from '../hooks/useEvents.js';

const categories = ['Todos', 'Arte', 'Música', 'Diseño', 'Tecnología', 'Gastronomía', 'Bienestar', 'Otros'];
export const EventsPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [sort, setSort] = useState('soonest');
  const query = useMemo(() => `?${new URLSearchParams({ ...(search && { search }), ...(category !== 'Todos' && { category }), sort })}`, [search, category, sort]);
  const { events, loading, error } = useEvents(query);
  return <section className="page shell">
    <div className="page-heading"><p className="kicker">Agenda Lúmina</p><h1>Encuentra tu próximo <em>sí.</em></h1><p>Planes pequeños, ideas grandes y personas interesantes.</p></div>
    <div className="filters">
      <label className="search-field"><Search /><span className="sr-only">Buscar eventos</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Busca por nombre o lugar" /></label>
      <label className="select-field"><SlidersHorizontal /><span className="sr-only">Ordenar eventos</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="soonest">Más próximos</option><option value="newest">Recién publicados</option><option value="popular">Más populares</option></select></label>
    </div>
    <div className="chips" aria-label="Filtrar por categoría">{categories.map((item) => <button className={category === item ? 'chip chip--active' : 'chip'} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
    <div className="results-line"><p>{loading ? 'Actualizando agenda…' : `${events.length} ${events.length === 1 ? 'encuentro' : 'encuentros'}`}</p></div>
    {loading ? <Loader label="Preparando la agenda…" /> : error ? <EmptyState title="La agenda no está disponible" message={error} /> : events.length ? <div className="card-grid">{events.map((event, index) => <EventCard key={event._id} event={event} index={index} />)}</div> : <EmptyState />}
  </section>;
};

