import { useLanguage } from "../context/LanguageContext.jsx";
import { CalendarX2 } from 'lucide-react';
export const EmptyState = ({
  title = 'No hay eventos por aquí',
  message = 'Prueba con otros filtros o vuelve dentro de poco.'
}) => {
  const {
    t
  } = useLanguage();
  return <div className="empty-state"><CalendarX2 /><h2>{t(title)}</h2><p>{t(message)}</p></div>;
};
