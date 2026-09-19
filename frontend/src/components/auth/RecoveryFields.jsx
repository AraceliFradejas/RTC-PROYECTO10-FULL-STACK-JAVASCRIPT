import { FormField } from "../FormField.jsx";
import { PasswordField } from "../PasswordField.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export const RecoveryFields = ({
  reset,
  email,
  setEmail,
  password,
  setPassword,
  confirmation,
  setConfirmation,
  errors,
}) => {
  const { t } = useLanguage();
  return (
    <>
      {!reset ? (
        <FormField id="recovery-email" label="Email" error={errors.email}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormField>
      ) : (
        <>
          {["password", "confirmation"].map((field) => (
            <PasswordField
              key={field}
              id={`recovery-${field}`}
              name={field}
              label={
                field === "password"
                  ? "Nueva contraseña"
                  : "Repite la contraseña"
              }
              autoComplete="new-password"
              required
              value={field === "password" ? password : confirmation}
              onChange={(event) =>
                (field === "password" ? setPassword : setConfirmation)(
                  event.target.value,
                )
              }
              error={errors[field]}
              hint={t(
                "Usa al menos 8 caracteres. Se permiten hasta 72 bytes; las tildes y los emojis pueden ocupar más de un byte.",
              )}
            />
          ))}
        </>
      )}
    </>
  );
};
