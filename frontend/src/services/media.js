export const getYouTubeUrl = value => {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'].includes(url.hostname)) return url.href;
  } catch { /* A missing or invalid URL keeps the text preview available. */ }
  return null;
};
