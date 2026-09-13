import { uploadBuffer, deleteImage } from '../config/cloudinary.js';

// Validate before uploading; retain the previous asset until the record is saved.
export const saveWithImage = async (document, file, { field, idField, folder }, services = { uploadBuffer, deleteImage }) => {
  await document.validate();
  const previous = document[idField];
  let uploaded;
  if (file) {
    uploaded = await services.uploadBuffer(file.buffer, folder);
    document[field] = uploaded.secure_url;
    document[idField] = uploaded.public_id;
  }
  try { await document.save(); }
  catch (error) {
    if (uploaded) {
      try { await services.deleteImage(uploaded.public_id); }
      catch { console.warn('No se pudo retirar la imagen de una operación fallida.'); }
    }
    throw error;
  }
  if (uploaded && previous && previous !== uploaded.public_id) {
    try { await services.deleteImage(previous); }
    catch { console.warn('Registro guardado; queda pendiente retirar la imagen anterior.'); }
  }
  return document;
};
