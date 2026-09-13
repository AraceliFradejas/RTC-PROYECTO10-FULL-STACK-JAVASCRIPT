// Stable targets for the 2027 editorial catalogue, not for user-created events.
export const demoTarget = (event, index = 0) => {
  const date = new Date(event.date);
  if (date.getUTCFullYear() !== 2027) return 0;
  const month = date.getUTCMonth();
  if (month < 3) return Math.max(0, event.capacity - [7, 5, 9][index % 3]);
  const ratio = month < 6 ? [0.68, 0.74, 0.63][index % 3] : [0.24, 0.31, 0.19][index % 3];
  return Math.min(event.capacity - 1, Math.floor(event.capacity * ratio));
};

export const missingDemoIds = (event, users, target) => {
  const existing = new Set(event.attendees.map(String));
  const missing = Math.max(0, Math.min(target, event.capacity) - existing.size);
  return users.filter(id => !existing.has(String(id))).slice(0, missing);
};
