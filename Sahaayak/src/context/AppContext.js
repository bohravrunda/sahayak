import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [language, setLanguage] = useState("English");

  const theme = darkTheme
    ? {
        bg: "#121212",
        card: "#1e1e1e",
        text: "#ffffff",
        subText: "#aaaaaa",
        primary: "#4CAF50",
        border: "#2c2c2c",
      }
    : {
        bg: "#f4f6f8",
        card: "#ffffff",
        text: "#222",
        subText: "#666",
        primary: "#007AFF",
        border: "#e0e0e0",
      };

  return (
    <AppContext.Provider
      value={{
        darkTheme,
        setDarkTheme,
        language,
        setLanguage,
        theme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};