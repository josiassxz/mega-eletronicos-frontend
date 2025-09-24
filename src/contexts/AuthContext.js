
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData && userData !== 'undefined') {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Mapear username para login como esperado pelo backend
      const loginData = {
        login: credentials.username,
        senha: credentials.password
      };
      
      // Tentar autenticação com backend
      try {
        const response = await authService.login(loginData);
        const { token, user: userData } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setIsAuthenticated(true);
        setUser(userData);
        
        return { success: true };
      } catch (backendError) {
        // Se o backend falhar, simular login para demonstração
        console.warn('Backend auth failed, using demo mode:', backendError.message);
        
        // Login de demonstração (remover em produção)
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          const demoUser = { username: 'admin', name: 'Administrador' };
          const demoToken = 'demo-token-' + Date.now();
          
          localStorage.setItem('token', demoToken);
          localStorage.setItem('user', JSON.stringify(demoUser));
          
          setIsAuthenticated(true);
          setUser(demoUser);
          
          return { success: true };
        } else {
          return { 
            success: false, 
            message: 'Credenciais inválidas. Use admin/admin123 para demonstração.' 
          };
        }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Erro ao fazer login' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
