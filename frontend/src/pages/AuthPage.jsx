import { useLanguage } from "../context/LanguageContext.jsx";
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
export const AuthPage = () => {
  const {
    t
  } = useLanguage();
  const [mode, setMode] = useState('login');
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    user,
    login,
    register
  } = useAuth();
  const {
    notify
  } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  if (user) return <Navigate to="/events" replace />;
  const validate = () => {
    const next = {};
    if (mode === 'register' && values.name.trim().length < 2) next.name = 'Escribe al menos 2 caracteres.';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Escribe un email válido.';
    if (values.password.length < 8) next.password = 'Usa al menos 8 caracteres.';
    setErrors(next);
    return !Object.keys(next).length;
  };
  const submit = async event => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await (mode === 'login' ? login({
        email: values.email,
        password: values.password
      }) : register(values));
      notify(mode === 'login' ? 'Vuelves al terreno de juego.' : 'Tu cuenta está lista. Bienvenida a KelseTS.');
      navigate(location.state?.from || '/events');
    } catch (error) {
      setErrors({
        form: error.message
      });
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  return <section className="auth-page"><div className="auth-visual"><p className="kicker">{t("Mindset in motion")}</p><blockquote>{t("El resultado no cambia de golpe. Cambia decisión a decisión.")}</blockquote></div><div className="auth-panel">
    <div className="auth-box"><p className="kicker">{mode === 'login' ? t("De vuelta al equipo") : t("Tu primera jugada")}</p><h1>{mode === 'login' ? t("Entra en KelseTS") : t("Crea tu cuenta")}</h1><p>{mode === 'login' ? t("Tu próxima experiencia te está esperando.") : t("Regístrate y entrarás directamente, sin pasos de más.")}</p>
      <div className="auth-tabs"><button className={mode === 'login' ? 'active' : ''} onClick={() => {
            setMode('login');
            setErrors({});
          }}>{t("Iniciar sesión")}</button><button className={mode === 'register' ? 'active' : ''} onClick={() => {
            setMode('register');
            setErrors({});
          }}>{t("Crear cuenta")}</button></div>
      <form onSubmit={submit} noValidate>
        {errors.form && <div className="form-alert" role="alert">{t(errors.form)}</div>}
        {mode === 'register' && <label>{t("Nombre")}<input name="name" value={values.name} onChange={e => setValues({
              ...values,
              name: e.target.value
            })} autoComplete="name" aria-invalid={Boolean(errors.name)} />{errors.name && <small className="field-error">{t(errors.name)}</small>}</label>}
        <label>{t("Email")}<input type="email" value={values.email} onChange={e => setValues({
              ...values,
              email: e.target.value
            })} autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email && <small className="field-error">{t(errors.email)}</small>}</label>
        <label>{t("Contraseña")}<span className="password-field"><input type={showPassword ? 'text' : 'password'} value={values.password} onChange={e => setValues({
                ...values,
                password: e.target.value
              })} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} aria-invalid={Boolean(errors.password)} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? t("Ocultar contraseña") : t("Mostrar contraseña")}>{showPassword ? <EyeOff /> : <Eye />}</button></span>{errors.password && <small className="field-error">{t(errors.password)}</small>}</label>
        <button className="button button--accent button--wide" disabled={loading}>{loading ? <><span className="mini-spinner" /> {mode === 'login' ? t("Entrando…") : t("Creando tu cuenta…")}</> : <>{mode === 'login' ? t("Entrar") : t("Crear cuenta")} <ArrowRight /></>}</button>
      </form>
    </div>
  </div></section>;
};
