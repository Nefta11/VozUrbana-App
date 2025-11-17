import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/ApiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
    // Omitimos el test de conexión para evitar errores
    // testAPIConnection();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log(' Loaded stored auth for:', JSON.parse(storedUser).email);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log(' Attempting login for:', email);

    // Verificar si es login de administrador
    if (email === 'admin@vozurbana.com' && password === '12345678') {
      const adminUser = {
        id: 'admin-001',
        nombre: 'Administrador',
        email: 'admin@vozurbana.com',
        role: 'admin',
        fechaRegistro: new Date().toISOString(),
      };
      const adminToken = 'admin-token-' + Date.now();

      await AsyncStorage.setItem('authToken', adminToken);
      await AsyncStorage.setItem('user', JSON.stringify(adminUser));

      setToken(adminToken);
      setUser(adminUser);

      console.log('✅ Admin login successful');
      return { success: true, user: adminUser };
    }

    try {
      const response = await ApiService.login(email, password);
      console.log('Login response:', response);

      const { token: authToken, user: userData } = response;

      // Asegurar que el usuario tenga un role por defecto
      const userWithRole = {
        ...userData,
        role: userData.role || 'user',
      };

      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userWithRole));

      setToken(authToken);
      setUser(userWithRole);

      return { success: true, user: userWithRole };
    } catch (error) {
      console.error(' Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    console.log('📝 Attempting register for:', userData.email);
    
    try {
      const response = await ApiService.register(userData);
      console.log(' Register response:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error(' Register error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};