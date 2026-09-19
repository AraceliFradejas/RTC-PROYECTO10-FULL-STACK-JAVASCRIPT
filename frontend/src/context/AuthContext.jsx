import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiRequest, onUnauthorized } from "../services/api.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "kelsets_talks_session";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [checkingSession, setCheckingSession] = useState(Boolean(token));

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Session also works in memory. */
    }
    setToken(null);
    setUser(null);
  }, []);

  useEffect(
    () =>
      onUnauthorized((failedToken) => {
        if (failedToken !== token) return;
        logout();
        setSessionExpired(true);
      }),
    [token, logout],
  );

  useEffect(() => {
    if (!token) return setCheckingSession(false);
    const controller = new AbortController();
    setCheckingSession(true);
    apiRequest("/auth/me", { token, signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setUser(data);
      })
      .catch((error) => {
        if (!controller.signal.aborted && error.status === 401) logout();
      })
      .finally(() => {
        if (!controller.signal.aborted) setCheckingSession(false);
      });
    return () => controller.abort();
  }, [token, logout]);

  const authenticate = async (mode, values) => {
    const { data } = await apiRequest(`/auth/${mode}`, {
      method: "POST",
      body: values,
    });
    try {
      localStorage.setItem(STORAGE_KEY, data.token);
    } catch {
      /* Session also works in memory. */
    }
    setSessionExpired(false);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      checkingSession,
      sessionExpired,
      login: (values) => authenticate("login", values),
      register: (values) => authenticate("register", values),
      logout,
      setUser,
    }),
    [user, token, checkingSession, sessionExpired, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
