import { FormField } from "../FormField.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { speakers } from "../../data/speakers.js";

export const EventDescriptionFields = ({ values, update, errors }) => {
  const { t } = useLanguage();
  return (
    <>
      <FormField
        id="event-speakerId"
        label="Ponente"
        className="field--full"
        hint={t(
          "Elige quién dará la charla. La persona organizadora se guarda por separado.",
        )}
      >
        <select name="speakerId" value={values.speakerId} onChange={update}>
          <option value="">{t("Ponente por confirmar")}</option>
          {speakers.map((speaker) => (
            <option key={speaker.id} value={speaker.id}>
              {speaker.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField
        id="event-description"
        label="Descripción"
        error={errors.description}
        className="field--full"
        hint={`${values.description.length}/1200`}
      >
        <textarea
          name="description"
          id="event-description"
          required
          value={values.description}
          onChange={update}
          rows="6"
          placeholder={t(
            "Qué aprenderá el público, quién dará la charla y a quién va dirigida…",
          )}
        />
      </FormField>
    </>
  );
};
