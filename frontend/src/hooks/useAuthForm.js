import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { isEmail, validPassword } from "../utils/validation.js";

export const useAuthForm = () => {
  const [mode, setMode] = useState("login");
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, sessionExpired, login, register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const validate = () => {
    const next = {};
    if (mode === "register" && values.name.trim().length < 2)
      next.name = "Escribe al menos 2 caracteres.";
    if (!isEmail(values.email)) next.email = "Escribe un email válido.";
    if (mode === "register" && !validPassword(values.password))
      next.password =
        "La contraseña debe tener al menos 8 caracteres y ocupar como máximo 72 bytes.";
    if (mode === "login" && !values.password)
      next.password = "Email y contraseña son obligatorios.";
    setErrors(next);
    return !Object.keys(next).length;
  };
  const submit = async (event) => {
    event.preventDefault();
    if (loading || !validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await (mode === "login"
        ? login({
            email: values.email,
            password: values.password,
          })
        : register(values));
      notify(
        mode === "login"
          ? "Vuelves al terreno de juego."
          : "Tu cuenta está lista. Te damos la bienvenida a KelseTS.",
      );
      navigate(location.state?.from || "/events");
    } catch (error) {
      setErrors({
        form: error.message,
      });
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  return {
    user,
    sessionExpired,
    mode,
    setMode,
    values,
    setValues,
    errors,
    setErrors,
    loading,
    submit,
    destination: location.state?.from || "/events",
  };
};
