import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../services/api.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'kelsets_talks_session';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } });
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(Boolean(token));

  const logout = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Session also works in memory. */ }
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
    try { localStorage.setItem(STORAGE_KEY, data.token); } catch { /* Session also works in memory. */ }
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(() => ({ user, token, checkingSession, login: (values) => authenticate('login', values), register: (values) => authenticate('register', values), logout, setUser }), [user, token, checkingSession, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
