import { eventCategories } from "../data/eventCategories.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { PreviewNotice } from "../components/PreviewNotice.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState.jsx";
import { EventCard } from "../components/EventCard.jsx";
import { Loader } from "../components/Loader.jsx";
import { useEvents } from "../hooks/useEvents.js";
const categories = ["Todos", ...eventCategories];
export const EventsPage = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("soonest");
  const debouncedSearch = useDebouncedValue(search);
  const query = useMemo(
    () =>
      `?${new URLSearchParams({
        ...(debouncedSearch && {
          search: debouncedSearch,
        }),
        ...(category !== "Todos" && {
          category,
        }),
        sort,
      })}`,
    [debouncedSearch, category, sort],
  );
  const { events, loading, error } = useEvents(query);
  return (
    <section className="page shell">
      <div className="page-heading">
        <p className="kicker">{t("KelseTS Experiences")}</p>
        <h1>
          {t("Tu próxima idea puede cambiar el")} <em>{t("partido.")}</em>
        </h1>
        <p>
          {t(
            "Keynotes, conversaciones y sesiones prácticas para crecer como profesional y como equipo.",
          )}
        </p>
      </div>
      <PreviewNotice />
      <div className="filters">
        <label className="search-field">
          <Search />
          <span className="sr-only">{t("Buscar eventos")}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Busca por tema, speaker o lugar")}
          />
        </label>
        <label className="select-field">
          <SlidersHorizontal />
          <span className="sr-only">{t("Ordenar eventos")}</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="soonest">{t("Más próximos")}</option>
            <option value="newest">{t("Recién publicados")}</option>
            <option value="popular">{t("Más populares")}</option>
          </select>
        </label>
      </div>
      <div
        className="chips"
        role="group"
        aria-label={t("Filtrar por categoría")}
      >
        {categories.map((item) => (
          <button
            aria-pressed={category === item}
            className={category === item ? "chip chip--active" : "chip"}
            onClick={() => setCategory(item)}
            key={item}
          >
            {t(item)}
          </button>
        ))}
      </div>
      <div className="results-line" role="status" aria-atomic="true">
        <p>
          {loading
            ? t("Actualizando agenda…")
            : t(
                events.length === 1
                  ? "{count} encuentro"
                  : "{count} encuentros",
                { count: events.length },
              )}
        </p>
      </div>
      {loading ? (
        <Loader label={t("Preparando la agenda…")} />
      ) : error ? (
        <EmptyState title={t("La agenda no está disponible")} message={error} />
      ) : events.length ? (
        <div className="event-agenda">
          {events.map((event, index) => (
            <EventCard
              headingLevel={2}
              horizontal
              key={event._id}
              event={event}
              index={index}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
};
