import { validEventDate } from "./eventEditing.js";

export const initialEventValues = {
  title: "",
  date: "",
  location: "",
  category: "Liderazgo",
  speakerId: "",
  capacity: 30,
  description: "",
};

export const validateEventForm = (values, poster, original) => {
  const next = {};
  if (values.title.trim().length < 3)
    next.title = "El título necesita al menos 3 caracteres.";
  if (!validEventDate(values.date, original))
    next.date = "Elige una fecha futura.";
  if (!values.location.trim()) next.location = "Indica dónde será.";
  if (values.description.trim().length < 20)
    next.description = "Cuéntanos algo más (mínimo 20 caracteres).";
  if (poster && poster.size > 4 * 1024 * 1024)
    next.poster = "La imagen no puede superar 4 MB.";
  if (values.title.trim().length > 100)
    next.title = "El título no puede superar 100 caracteres.";
  if (values.location.trim().length > 120)
    next.location = "El lugar no puede superar 120 caracteres.";
  if (values.description.trim().length > 1200)
    next.description = "La descripción no puede superar 1200 caracteres.";
  if (
    !Number.isInteger(Number(values.capacity)) ||
    Number(values.capacity) < 1 ||
    Number(values.capacity) > 10000
  )
    next.capacity = "El aforo debe ser un número entero entre 1 y 10000.";
  if (
    poster &&
    !["image/jpeg", "image/png", "image/webp"].includes(poster.type)
  )
    next.poster = "La imagen debe ser JPG, PNG o WebP.";
  return next;
};
