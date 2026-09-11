import { useLanguage } from "../context/LanguageContext.jsx";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader } from './Loader.jsx';
export const ProtectedRoute = ({
  children
}) => {
  const {
    t
  } = useLanguage();
  const {
    user,
    checkingSession
  } = useAuth();
  const location = useLocation();
  if (checkingSession) return <Loader full label={t("Comprobando tu sesión…")} />;
  return user ? children : <Navigate to="/auth" replace state={{
    from: location.pathname
  }} />;
};
