import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    saveTheme();
  }, [darkTheme]);

  const saveTheme = async () => {
    await AsyncStorage.setItem("darkTheme", JSON.stringify(darkTheme));
  };

  const loadTheme = async () => {
    const value = await AsyncStorage.getItem("darkTheme");
    if (value !== null) setDarkTheme(JSON.parse(value));
  };

  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};