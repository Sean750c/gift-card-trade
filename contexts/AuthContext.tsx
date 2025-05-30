import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  countryId: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  verifyOtp: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tempUserData, setTempUserData] = useState<any>(null);

  // Load user data from storage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('authToken');
        
        if (userData && token) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user data', error);
      }
    };

    loadUser();
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    try {
      // Mock successful login
      const mockUser = {
        id: '12345',
        fullName: 'John Doe',
        email: email,
        phone: '+234 812 345 6789',
        countryId: 14,
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('authToken', 'mock-token-12345');
      
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  // Mock register function
  const register = async (fullName: string, email: string, phone: string, password: string) => {
    // In a real app, this would make an API call to register
    try {
      // Store temporary user data for verification
      const tempUser = {
        fullName,
        email,
        phone,
        password,
      };
      
      setTempUserData(tempUser);
      // In a real app, this would trigger sending of OTP
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  // Mock OTP verification
  const verifyOtp = async (otp: string) => {
    // In a real app, this would verify the OTP with an API
    try {
      if (!tempUserData) {
        throw new Error('No registration in progress');
      }
      
      // Mock successful verification
      const mockUser = {
        id: '12346',
        fullName: tempUserData.fullName,
        email: tempUserData.email,
        phone: tempUserData.phone,
        countryId: 14,
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('authToken', 'mock-token-12346');
      
      setUser(mockUser);
      setIsAuthenticated(true);
      setTempUserData(null);
    } catch (error) {
      throw new Error('Verification failed');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};