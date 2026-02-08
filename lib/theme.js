import { createContext, useContext, useState } from "react";

const themes = {
  dark: {
    bg: "#0B1B2B",
    text: "#FFFFFF",
    card: "#132B44",
    primary: "#1E90FF",
    secondary: "#4DA3FF",
    muted: "#B8C1D9",
  },
  light: {
    bg: "#FFFFFF",
    text: "#0B1B2B",
    card: "#F2F5F8",
    primary: "#1E90FF",
    secondary: "#4DA3FF",
    muted: "#5A6475",
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");

  const toggleTheme = () =>
    setMode((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme: themes[mode], mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
