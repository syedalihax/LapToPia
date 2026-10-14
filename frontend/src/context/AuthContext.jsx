import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest, getAuthToken, parseApiResponse, setAuthToken } from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getAuthToken()));

  const clearSession = useCallback(() => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => clearSession();
    window.addEventListener('laptopia:auth-expired', handleAuthExpired);
    return () => window.removeEventListener('laptopia:auth-expired', handleAuthExpired);
  }, [clearSession]);

  useEffect(() => {
    const savedToken = getAuthToken();
    if (!savedToken) {
      setIsLoading(false);
      return undefined;
    }

    let isMounted = true;
    apiRequest('/api/auth/me', {}, savedToken)
      .then(parseApiResponse)
      .then(response => {
        if (isMounted) {
          setUser(response.data);
          setToken(savedToken);
        }
      })
      .catch(() => {
        if (isMounted) clearSession();
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [clearSession]);

  const authenticate = useCallback(async (endpoint, credentials) => {
    const response = await apiRequest(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }, null);
    const result = await parseApiResponse(response);
    if (!result.token || !result.user) {
      throw new Error('Authentication response was incomplete.');
    }

    setAuthToken(result.token);
    setToken(result.token);
    setUser(result.user);
    setIsLoading(false);
    return result.user;
  }, []);

  const login = useCallback(credentials => authenticate('/api/auth/login', credentials), [authenticate]);
  const register = useCallback(credentials => authenticate('/api/auth/register', credentials), [authenticate]);
  const updateUser = useCallback(updates => {
    setUser(current => current ? { ...current, ...updates } : current);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    updateUser,
    logout: clearSession,
  }), [user, token, isLoading, login, register, updateUser, clearSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
