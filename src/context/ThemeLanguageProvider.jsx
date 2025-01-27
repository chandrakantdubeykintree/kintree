import { useProfile } from "@/hooks/useProfile";
import { createContext, useContext, useEffect, useState } from "react";
import i18n from "@/i18n";
import { LANGUAGES } from "@/constants/languages";
const initialState = {
  theme: "light",
  language: "en",
  setTheme: () => null,
  setLanguage: () => null,
};

const ThemeLanguageProviderContext = createContext(initialState);

export function ThemeLanguageProvider({
  children,
  defaultTheme = "light",
  defaultLanguage = "en",
  storageKey = "kintree-theme",
  languageStorageKey = "kintree-language",
  ...props
}) {
  const { configurations, updateProfile } = useProfile("user/configurations");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) return savedTheme;

    if (configurations?.theme) return configurations.theme;

    return defaultTheme;
  });

  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    if (savedLanguage) return savedLanguage;

    if (configurations?.language) return configurations.language;

    return defaultLanguage;
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

  useEffect(() => {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else if (configurations?.language) {
      setLanguage(configurations.language);
      localStorage.setItem(languageStorageKey, configurations.language);
    }
  }, [configurations, languageStorageKey]);

  const changeLanguage = (languageCode) => {
    if (LANGUAGES[languageCode]) {
      setLanguage(languageCode);
      i18n.changeLanguage(languageCode);

      // Always update configurations to keep everything in sync
      updateProfile({
        url: "user/configurations",
        data: {
          language: languageCode,
          theme: configurations?.theme,
        },
      });
    }
  };

  useEffect(() => {
    if (configurations?.language) {
      setLanguage(configurations.language);
      i18n.changeLanguage(configurations.language);
    }
  }, [configurations]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    language,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
      updateProfile({
        url: "user/configurations",
        data: {
          theme: newTheme,
          language: configurations?.language,
        },
      });
    },
    setLanguage: (newLanguage) => {
      localStorage.setItem(languageStorageKey, newLanguage);
      setLanguage(newLanguage);
      changeLanguage(newLanguage); // Call changeLanguage to update i18n
    },
  };

  return (
    <ThemeLanguageProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeLanguageProviderContext.Provider>
  );
}

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageProviderContext);

  if (context === undefined)
    throw new Error(
      "useThemeLanguage must be used within a ThemeLanguageProvider"
    );

  return context;
};
