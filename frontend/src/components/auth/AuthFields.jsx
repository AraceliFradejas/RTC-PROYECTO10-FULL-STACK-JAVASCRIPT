import { FormField } from "../FormField.jsx";
import { PasswordField } from "../PasswordField.jsx";

export const AuthFields = ({ mode, values, setValues, errors }) => (
  <>
    {mode === "register" && (
      <FormField id="auth-name" label="Nombre" error={errors.name}>
        <input
          name="name"
          id="auth-name"
          required
          value={values.name}
          onChange={(e) =>
            setValues({
              ...values,
              name: e.target.value,
            })
          }
          autoComplete="name"
        />
      </FormField>
    )}
    <FormField id="auth-email" label="Email" error={errors.email}>
      <input
        name="email"
        type="email"
        id="auth-email"
        required
        value={values.email}
        onChange={(e) =>
          setValues({
            ...values,
            email: e.target.value,
          })
        }
        autoComplete="email"
      />
    </FormField>
    <PasswordField
      id="auth-password"
      name="password"
      label="Contraseña"
      required
      value={values.password}
      onChange={(e) => setValues({ ...values, password: e.target.value })}
      autoComplete={mode === "login" ? "current-password" : "new-password"}
      error={errors.password}
    />
  </>
);
