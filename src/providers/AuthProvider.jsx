import { useState, useCallback, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { decodeToken } from '../services/authToken.js';
import { validateLogin, validateRegistration } from '../domain/authValidation.js';

const SESSION_KEY = 'session-token';

// Відновлення сесії під час першого рендеру: прострочений або пошкоджений
// токен видаляється, тому користувач одразу бачить коректний стан інтерфейсу.
function restoreSession() {
  const token = localStorage.getItem(SESSION_KEY);
  const payload = decodeToken(token);
  if (!payload) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  return { id: payload.sub, name: payload.name, email: payload.email, createdAt: payload.createdAt };
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreSession);

  const startSession = useCallback(({ token, user: account }) => {
    localStorage.setItem(SESSION_KEY, token);
    setUser(account);
  }, []);

  const login = useCallback(
    async (input) => {
      const validation = validateLogin(input);
      if (!validation.ok) return validation;
      try {
        startSession(await api.login(validation.value));
        return { ok: true };
      } catch (err) {
        return { ok: false, errors: { form: err.message } };
      }
    },
    [startSession]
  );

  const register = useCallback(
    async (input) => {
      const validation = validateRegistration(input);
      if (!validation.ok) return validation;
      try {
        startSession(await api.register(validation.value));
        return { ok: true };
      } catch (err) {
        const field = err.status === 409 ? 'email' : 'form';
        return { ok: false, errors: { [field]: err.message } };
      }
    },
    [startSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, register, logout }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
