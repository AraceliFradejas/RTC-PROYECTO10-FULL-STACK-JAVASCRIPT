import { CalendarX2 } from 'lucide-react';

export const EmptyState = ({ title = 'No hay eventos por aquí', message = 'Prueba con otros filtros o vuelve dentro de poco.' }) => <div className="empty-state"><CalendarX2 /><h2>{title}</h2><p>{message}</p></div>;

