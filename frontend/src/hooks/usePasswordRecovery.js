import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../services/api.js";
import { isEmail, validPassword } from "../utils/validation.js";

export const usePasswordRecovery = (reset) => {
  const { language, setLanguage } = useLanguage();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [link] = useState(() => {
    const fragment = new URLSearchParams(
      typeof window === "undefined" ? "" : window.location.hash.slice(1),
    );
    return {
      token: fragment.get("token") || "",
      language: fragment.get("language"),
    };
  });
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const notice = useRef(null);
  const hasToken = /^[a-f0-9]{64}$/.test(link.token);
  useEffect(() => {
    if (link.language === "es" || link.language === "en")
      setLanguage(link.language);
  }, [link, setLanguage]);
  useEffect(() => {
    if (done) notice.current?.focus();
  }, [done]);
  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    const next = {};
    if (reset) {
      if (!validPassword(password))
        next.password =
          "La contraseña debe tener al menos 8 caracteres y ocupar como máximo 72 bytes.";
      if (password !== confirmation)
        next.confirmation = "Las contraseñas no coinciden.";
    } else if (!isEmail(email)) next.email = "Escribe un email válido.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await apiRequest(
        reset ? "/auth/reset-password" : "/auth/forgot-password",
        {
          method: "POST",
          body: reset
            ? { token: link.token, password }
            : { email: email.trim(), language },
        },
      );
      if (reset) {
        logout();
        setPassword("");
        setConfirmation("");
        navigate("/reset-password", { replace: true });
      }
      setDone(true);
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };
  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmation,
    setConfirmation,
    errors,
    loading,
    done,
    notice,
    hasToken,
    submit,
  };
};
