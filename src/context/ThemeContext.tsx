
import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeColor, Theme } from "@/types";

// Define available themes
const themes: Record<ThemeColor, Theme> = {
  blue: {
    name: "blue",
    primaryColor: "hsl(205, 100%, 50%)",
    primaryHue: 205
  },
  purple: {
    name: "purple",
    primaryColor: "hsl(270, 100%, 60%)",
    primaryHue: 270
  },
  green: {
    name: "green",
    primaryColor: "hsl(145, 80%, 42%)",
    primaryHue: 145
  },
  orange: {
    name: "orange",
    primaryColor: "hsl(25, 95%, 53%)",
    primaryHue: 25
  },
  pink: {
    name: "pink",
    primaryColor: "hsl(330, 95%, 60%)",
    primaryHue: 330
  }
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: ThemeColor) => void;
  allThemes: Record<ThemeColor, Theme>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.blue,
  setTheme: () => {},
  allThemes: themes
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get stored theme or default to blue
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(() => {
    const storedTheme = localStorage.getItem("pomodoro-theme");
    return (storedTheme as ThemeColor) || "blue";
  });

  const theme = themes[currentTheme];

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", `${theme.primaryHue} 100% 50%`);
    
    // Store theme preference
    localStorage.setItem("pomodoro-theme", currentTheme);
  }, [currentTheme, theme]);

  const setTheme = (color: ThemeColor) => {
    setCurrentTheme(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, allThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
