import { createContext, useContext, useEffect, useState } from "react";
import { THEMES, THEMES_ENUM } from "../consts/themes";

interface ThemeContext {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  toggleTheme: (title: string) => void;
}

const ThemeContext = createContext<ThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const getInitialTheme = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedTheme = localStorage.getItem("theme");
      if (THEMES.some((item) => item.title === storedTheme)) {
        return String(storedTheme);
      } else {
        return THEMES_ENUM.light;
      }
    }
    return THEMES_ENUM.light;
  };
  const [theme, setTheme] = useState<string>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("theme", String(theme));
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = (title: string) => {
    setTheme(title);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContext => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
