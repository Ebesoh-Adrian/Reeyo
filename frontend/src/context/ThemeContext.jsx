// src/ThemeContext.jsx (or src/context/ThemeContext.jsx)
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

// 1. Create the Context object
const ThemeContext = createContext(null);

/**
 * Custom hook to easily use the theme context.
 * It throws an error if called outside the Provider, ensuring strict usage.
 * @returns {{theme: 'light'|'dark', toggleTheme: function}}
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    // This is the error message you are seeing, correctly enforced here.
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 2. The Provider Component
function ThemeProvider({ children }) {
  // State initialization: prioritize localStorage, then system preference, default to 'light'.
  const [theme, setTheme] = useState(() => {
    // Check local storage first
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }

    // Check system preference if running in a browser environment
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  // 3. Side Effect: Apply class to the root HTML element and persist the choice
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Ensure the correct class is applied for Tailwind/CSS theme matching
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Persist the choice
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Memoize the value to ensure stability and prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Export default on the last line
export default ThemeProvider;

