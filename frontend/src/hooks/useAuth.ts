// Hook personalizado para manejo de autenticación

import { useState, useEffect } from 'react';
import { User, LoginCredentials } from '../types';
import { STORAGE_KEYS } from '../constants';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      // Aquí iría la llamada a la API de login
      // const response = await apiService.post('/auth/login', credentials);
      
      // Simulación temporal
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'Usuario de Prueba',
        role: 'admin',
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Guardar en localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock_token');
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
};
