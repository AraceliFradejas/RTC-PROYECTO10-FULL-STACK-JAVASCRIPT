import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormField } from "./FormField.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export const PasswordField = ({ id, label, error, hint, ...inputProps }) => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  return (
    <FormField
      id={id}
      label={label}
      error={error}
      hint={hint}
      renderControl={(accessibility) => (
        <span className="password-field">
          <input
            {...inputProps}
            {...accessibility}
            type={visible ? "text" : "password"}
          />
          <button
            type="button"
            aria-controls={id}
            aria-label={t(
              visible ? "Ocultar contraseña" : "Mostrar contraseña",
            )}
            onClick={() => setVisible((value) => !value)}
          >
            {visible ? (
              <EyeOff aria-hidden="true" />
            ) : (
              <Eye aria-hidden="true" />
            )}
          </button>
        </span>
      )}
    />
  );
};
