export const canEditEvent = (event, user) => Boolean(user && (user.role === 'admin' || (event.creator?._id || event.creator) === user.id));

export const localDateTime = value => {
  const date = new Date(value);
  const pad = part => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const eventFormData = (values, poster, original) => {
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => form.append(key, key === 'date'
    ? original && value === localDateTime(original.date) ? original.date : new Date(value).toISOString()
    : value));
  if (poster) form.append('poster', poster);
  return form;
};
