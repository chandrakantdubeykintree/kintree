import { useProfile } from "@/hooks/useProfile";
import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "kintree-theme",
  ...props
}) {
  const { configurations, updateProfile } = useProfile("user/configurations");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) return savedTheme;

    if (configurations?.theme) return configurations.theme;

    return defaultTheme;
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (configurations?.theme) {
      setTheme(configurations.theme);
      localStorage.setItem(storageKey, configurations.theme);
    }
  }, [configurations, storageKey]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);

      // Always update configurations to keep everything in sync
      updateProfile({
        url: "user/configurations",
        data: {
          theme: newTheme,
          language: configurations?.language,
        },
      });
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
