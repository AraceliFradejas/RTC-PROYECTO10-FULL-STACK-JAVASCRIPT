import { cloneElement } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

export const FormField = ({
  id,
  label,
  error,
  hint,
  className = "",
  children,
  renderControl,
}) => {
  const { t } = useLanguage();
  const describedBy =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") ||
    undefined;
  const props = {
    id,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
  };
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={id}>{t(label)}</label>
      {renderControl ? renderControl(props) : cloneElement(children, props)}
      {hint && <small id={`${id}-hint`}>{hint}</small>}
      {error && (
        <small id={`${id}-error`} className="field-error">
          {t(error)}
        </small>
      )}
    </div>
  );
};
