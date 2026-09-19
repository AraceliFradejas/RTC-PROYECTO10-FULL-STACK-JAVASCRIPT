import { useLanguage } from "../context/LanguageContext.jsx";
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, CircleAlert, X } from 'lucide-react';
const ToastContext = createContext(null);
export const ToastProvider = ({
  children
}) => {
  const {
    t
  } = useLanguage();
  const [toasts, setToasts] = useState([]);
  const remove = useCallback(id => setToasts(items => items.filter(item => item.id !== id)), []);
  const notify = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts([{
      id,
      message,
      type
    }]);
    // Show only the latest feedback, until dismissed or replaced by a new message.
  }, []);
  const value = useMemo(() => ({
    notify
  }), [notify]);
  return <ToastContext.Provider value={value}>
    {children}
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toasts.map(toast => <div className={`toast toast--${toast.type}`} key={toast.id}>
        {toast.type === 'error' ? <CircleAlert /> : <CheckCircle2 />}
        <span>{t(toast.message)}</span>
        <button onClick={() => remove(toast.id)} aria-label={t("Cerrar aviso")}><X /></button>
      </div>)}
    </div>
  </ToastContext.Provider>;
};
export const useToast = () => useContext(ToastContext);
