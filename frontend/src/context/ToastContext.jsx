import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, CircleAlert, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback((id) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const notify = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => remove(id), 4500);
  }, [remove]);
  const value = useMemo(() => ({ notify }), [notify]);

  return <ToastContext.Provider value={value}>
    {children}
    <div className="toast-region" aria-live="polite">
      {toasts.map((toast) => <div className={`toast toast--${toast.type}`} key={toast.id}>
        {toast.type === 'error' ? <CircleAlert /> : <CheckCircle2 />}
        <span>{toast.message}</span>
        <button onClick={() => remove(toast.id)} aria-label="Cerrar aviso"><X /></button>
      </div>)}
    </div>
  </ToastContext.Provider>;
};

export const useToast = () => useContext(ToastContext);

