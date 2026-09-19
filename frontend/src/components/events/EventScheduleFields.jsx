import { FormField } from "../FormField.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { eventCategories } from "../../data/eventCategories.js";

export const EventScheduleFields = ({ values, update, errors }) => {
  const { t } = useLanguage();
  return (
    <>
      <FormField
        id="event-title"
        label="Título del evento"
        error={errors.title}
        className="field--full"
      >
        <input
          name="title"
          id="event-title"
          required
          value={values.title}
          onChange={update}
          placeholder={t("Ej. Liderar cuando el marcador va en contra")}
        />
      </FormField>
      <FormField id="event-date" label="Fecha y hora" error={errors.date}>
        <input
          type="datetime-local"
          name="date"
          id="event-date"
          required
          value={values.date}
          onChange={update}
        />
      </FormField>
      <FormField id="event-location" label="Lugar" error={errors.location}>
        <input
          name="location"
          id="event-location"
          required
          value={values.location}
          onChange={update}
          placeholder={t("Espacio y barrio")}
        />
      </FormField>
      <FormField id="event-category" label="Categoría">
        <select name="category" value={values.category} onChange={update}>
          {eventCategories.map((item) => (
            <option key={item} value={item}>
              {t(item)}
            </option>
          ))}
        </select>
      </FormField>
      <FormField id="event-capacity" label="Aforo" error={errors.capacity}>
        <input
          type="number"
          name="capacity"
          id="event-capacity"
          required
          min="1"
          max="10000"
          value={values.capacity}
          onChange={update}
        />
      </FormField>
    </>
  );
};
