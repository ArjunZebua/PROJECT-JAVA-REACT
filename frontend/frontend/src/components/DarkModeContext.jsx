/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

// Dark Mode Context
const DarkModeContext = createContext();

// Hook untuk menggunakan Dark Mode
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

// Provider untuk Dark Mode
export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Ambil dari localStorage, default true (dark mode)
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : true;
    } catch (error) {
      return true; // Default dark mode
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      // Simpan ke localStorage
      try {
        localStorage.setItem('darkMode', JSON.stringify(newMode));
      } catch (error) {
        console.warn('Failed to save dark mode preference');
      }
      return newMode;
    });
  };

  // Apply dark mode ke document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (isDarkMode) {
      root.classList.add('dark');
      body.style.backgroundColor = '#111827'; // gray-900
      body.style.color = '#ffffff';
    } else {
      root.classList.remove('dark');
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#111827';
    }

    // Cleanup function
    return () => {
      root.classList.remove('dark');
    };
  }, [isDarkMode]);

  const value = {
    isDarkMode,
    toggleDarkMode,
    // Helper functions
    getBackgroundClass: () => isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
    getCardClass: () => isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    getTextClass: () => isDarkMode ? 'text-white' : 'text-gray-900',
    getSecondaryTextClass: () => isDarkMode ? 'text-gray-300' : 'text-gray-600',
    getHoverClass: () => isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    getBorderClass: () => isDarkMode ? 'border-gray-700' : 'border-gray-200'
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};