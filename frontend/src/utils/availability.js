export const availability = (event, now = Date.now()) => {
  const remaining = Math.max(0, event.capacity - (event.attendees?.length || 0));
  if (new Date(event.date).getTime() <= now) return { tone: 'closed', message: 'Evento finalizado', remaining };
  if (remaining === 0) return { tone: 'closed', message: 'Aforo completo', remaining };
  if (remaining <= Math.max(5, Math.ceil(event.capacity * 0.1))) return { tone: 'urgent', message: 'Últimas plazas · ¡No te quedes sin la tuya!', remaining };
  if (remaining <= event.capacity * 0.4) return { tone: 'reserve', message: 'No te quedes sin tu plaza', remaining };
  return { tone: 'open', message: 'Plazas disponibles', remaining };
};
