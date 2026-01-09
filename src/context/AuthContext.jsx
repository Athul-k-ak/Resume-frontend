import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ----------------------------------
     Check auth on app load (cookie)
  ---------------------------------- */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authService.getProfile();
        setUser(res.user); // ✅ correct
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /* ----------------------------------
     LOGIN
  ---------------------------------- */
  const login = async (credentials) => {
    try {
      const res = await authService.login(credentials);

      setUser(res.user); // ✅ correct

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Login failed',
      };
    }
  };

  /* ----------------------------------
     REGISTER
  ---------------------------------- */
  const register = async (userData) => {
    try {
      const res = await authService.register(userData);

      setUser(res.user); // ✅ correct

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Registration failed',
      };
    }
  };

  /* ----------------------------------
     LOGOUT
  ---------------------------------- */
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
