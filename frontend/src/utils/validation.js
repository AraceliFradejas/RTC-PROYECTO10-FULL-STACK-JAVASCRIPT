export const isEmail = value => typeof value === 'string' && value.trim().length <= 254 && /^\S+@\S+\.\S+$/.test(value.trim());
export const validPassword = value => typeof value === 'string' && value.length >= 8 && new TextEncoder().encode(value).length <= 72;
