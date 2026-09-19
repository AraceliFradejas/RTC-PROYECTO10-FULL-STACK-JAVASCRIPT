import { ImagePlus } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export const EventPosterField = ({
  editing,
  original,
  poster,
  setPoster,
  errors,
}) => {
  const { t } = useLanguage();
  return (
    <>
      {editing && original?.poster && (
        <img
          className="field--full"
          src={original.poster}
          alt={t("Cartel actual")}
          style={{ maxWidth: 180, borderRadius: 12 }}
        />
      )}
      <label className="upload-field field--full">
        <ImagePlus />
        <span>
          <strong>{t("Sube un cartel")}</strong>
          <small id="event-poster-hint">
            {t("JPG, PNG o WebP · máximo 4 MB")}
          </small>
        </span>
        <input
          id="event-poster"
          aria-invalid={Boolean(errors.poster)}
          aria-describedby={
            errors.poster
              ? "event-poster-error event-poster-hint"
              : "event-poster-hint"
          }
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setPoster(e.target.files[0])}
        />
        <span>{poster?.name || t("Elegir imagen")}</span>
        {errors.poster && (
          <small id="event-poster-error" className="field-error">
            {t(errors.poster)}
          </small>
        )}
      </label>
    </>
  );
};
