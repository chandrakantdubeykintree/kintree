import { useProfile } from "@/hooks/useProfile";
import { createContext, useContext, useEffect, useState } from "react";
import i18n from "@/i18n";
import { LANGUAGE_METADATA, LANGUAGES } from "@/constants/languages";
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
    if (savedLanguage && LANGUAGES[savedLanguage]) return savedLanguage;
    if (configurations?.language && LANGUAGES[configurations.language])
      return configurations.language;
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

  const changeLanguage = async (languageCode) => {
    if (LANGUAGES[languageCode]) {
      setLanguage(languageCode);
      await i18n.changeLanguage(languageCode);

      // Update document direction
      const dir = LANGUAGE_METADATA[languageCode]?.dir || "ltr";
      document.documentElement.dir = dir;
      document.documentElement.lang = languageCode;
      document.documentElement.classList.toggle("rtl", dir === "rtl");

      // Update configurations
      await updateProfile({
        url: "user/configurations",
        data: {
          language: languageCode,
          theme: configurations?.theme,
        },
      });

      // Update localStorage
      localStorage.setItem(languageStorageKey, languageCode);
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
      changeLanguage(newLanguage);
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
