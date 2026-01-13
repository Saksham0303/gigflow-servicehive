import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser({
        authenticated: true,
        userId: res.data.userId, 
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });

    setUser({
      authenticated: true,
      userId: res.data.user.id, 
    });

    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });

    setUser({
      authenticated: true,
      userId: res.data.user.id,
    });

    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
