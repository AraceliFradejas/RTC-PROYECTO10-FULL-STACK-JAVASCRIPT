import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../services/api.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'lumina_session';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(Boolean(token));

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) return setCheckingSession(false);
    apiRequest('/auth/me', { token })
      .then(({ data }) => setUser(data))
      .catch(logout)
      .finally(() => setCheckingSession(false));
  }, [token, logout]);

  const authenticate = async (mode, values) => {
    const { data } = await apiRequest(`/auth/${mode}`, { method: 'POST', body: values });
    localStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(() => ({ user, token, checkingSession, login: (values) => authenticate('login', values), register: (values) => authenticate('register', values), logout, setUser }), [user, token, checkingSession, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

