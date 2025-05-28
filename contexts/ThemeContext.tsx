import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
const lightColors = {
  primary: '#00A86B', // Green
  primaryLight: '#E0F7EF',
  secondary: '#0077B6', // Blue
  accent: '#FFD700', // Gold
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  background: '#F8F9FA',
  card: '#FFFFFF',
  cardAlt: '#F0F0F0',
  text: '#212529',
  textSecondary: '#6C757D',
  border: '#DEE2E6',
  errorLight: '#F8D7DA',
};

const darkColors = {
  primary: '#00A86B', // Keep primary consistent
  primaryLight: '#1C3832',
  secondary: '#0077B6', // Blue
  accent: '#FFD700', // Gold
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  background: '#121212',
  card: '#1E1E1E',
  cardAlt: '#2C2C2C',
  text: '#F8F9FA',
  textSecondary: '#ADB5BD',
  border: '#343A40',
  errorLight: '#3B2A2D',
};

type ThemeContextType = {
  isDark: boolean;
  colors: typeof lightColors;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          // Use system theme if no preference is saved
          setIsDark(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference', error);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  // Toggle theme function
  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? darkColors : lightColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};