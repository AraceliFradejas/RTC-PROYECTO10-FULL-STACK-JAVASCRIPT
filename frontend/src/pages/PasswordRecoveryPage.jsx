import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { FormErrors } from '../components/FormErrors.jsx';
import { apiRequest } from '../services/api.js';

export const PasswordRecoveryPage = ({ reset = false }) => {
  const { t, language, setLanguage } = useLanguage();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [link] = useState(() => {
    const fragment = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.hash.slice(1));
    return { token: fragment.get('token') || '', language: fragment.get('language') };
  });
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const notice = useRef(null);
  const hasToken = /^[a-f0-9]{64}$/.test(link.token);
  useEffect(() => { if (link.language === 'es' || link.language === 'en') setLanguage(link.language); }, [link]);
  useEffect(() => { if (done) notice.current?.focus(); }, [done]);
  const submit = async event => {
    event.preventDefault();
    if (loading) return;
    const next = {};
    if (reset) {
      if (password.length < 8 || new TextEncoder().encode(password).length > 72) next.password = 'La contraseña debe tener al menos 8 caracteres y ocupar como máximo 72 bytes.';
      if (password !== confirmation) next.confirmation = 'Las contraseñas no coinciden.';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim()) || email.trim().length > 254) next.email = 'Escribe un email válido.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await apiRequest(reset ? '/auth/reset-password' : '/auth/forgot-password', { method: 'POST', body: reset ? { token: link.token, password } : { email: email.trim(), language } });
      if (reset) {
        logout();
        setPassword('');
        setConfirmation('');
        navigate('/reset-password', { replace: true });
      }
      setDone(true);
    } catch (error) { setErrors({ form: error.message }); }
    finally { setLoading(false); }
  };
  return <section className="auth-page">
    <div className="auth-visual"><p className="kicker">{t('Mindset in motion')}</p><blockquote>{t('El resultado no cambia de golpe. Cambia decisión a decisión.')}</blockquote></div>
    <div className="auth-panel"><div className="auth-box">
      <p className="kicker">KelseTS Talks</p>
      <h1>{t(reset ? 'Elige una nueva contraseña' : 'Recupera tu acceso')}</h1>
      {!reset && <p className="recovery-notice">{t('Demo educativa: el correo se recibe en Mailtrap Sandbox, no en tu bandeja personal.')}</p>}
      {done ? <div className="recovery-notice" ref={notice} tabIndex={-1} role="status"><p>{t(reset ? 'Contraseña actualizada. Inicia sesión con tu nueva contraseña.' : 'Si existe una cuenta con ese correo y se puede enviar el mensaje, recibirás un enlace. Revisa también spam. Si ya lo has pedido, espera unos minutos.')}</p>{!reset && <p>{t('El enlace caduca en 30 minutos. Solo funciona el último enlace solicitado.')}</p>}</div>
        : reset && !hasToken ? <p role="alert">{t('El enlace no es válido o ha caducado. Solicita uno nuevo.')}</p>
        : <><p>{t(reset ? 'Escribe y confirma la nueva contraseña. Después tendrás que iniciar sesión de nuevo.' : 'Introduce el correo con el que te registraste. Te enviaremos un enlace para elegir otra contraseña.')}</p>
          <form onSubmit={submit} noValidate aria-busy={loading}>
            <FormErrors errors={errors} prefix="recovery" />
            {!reset ? <label htmlFor="recovery-email">{t('Email')}<input id="recovery-email" name="email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'recovery-email-error' : undefined} />{errors.email && <small className="field-error" id="recovery-email-error">{t(errors.email)}</small>}</label>
              : <>{['password', 'confirmation'].map(field => <div className="form-field" key={field}>
                <label htmlFor={`recovery-${field}`}>{t(field === 'password' ? 'Nueva contraseña' : 'Repite la contraseña')}</label>
                <span className="password-field"><input id={`recovery-${field}`} name={field} type={visible ? 'text' : 'password'} autoComplete="new-password" required value={field === 'password' ? password : confirmation} onChange={event => (field === 'password' ? setPassword : setConfirmation)(event.target.value)} aria-invalid={Boolean(errors[field])} aria-describedby={`recovery-hint${errors[field] ? ` recovery-${field}-error` : ''}`} />
                  <button type="button" aria-controls={`recovery-${field}`} onClick={() => setVisible(value => !value)} aria-label={t(visible ? 'Ocultar contraseña' : 'Mostrar contraseña')}>{visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></span>
                {errors[field] && <small id={`recovery-${field}-error`} className="field-error">{t(errors[field])}</small>}
              </div>)}<p id="recovery-hint" className="muted">{t('Usa al menos 8 caracteres. Se permiten hasta 72 bytes; las tildes y los emojis pueden ocupar más de un byte.')}</p></>}
            <button className="button button--accent button--wide" disabled={loading}>{t(loading ? 'Procesando…' : reset ? 'Guardar nueva contraseña' : 'Enviar enlace de recuperación')}</button>
          </form></>}
      <div className="recovery-links"><Link className="text-link" to="/auth">{t('Volver a iniciar sesión')}</Link>{reset && !done && <Link className="text-link" to="/forgot-password">{t('Solicitar un enlace nuevo')}</Link>}</div>
    </div></div>
  </section>;
};
