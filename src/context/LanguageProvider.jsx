import { createContext, useContext, useState } from "react";
import { LANGUAGES } from "../constants/languagesList";
import { useEffect } from "react";
import i18n from "@/i18n";
import { useProfile } from "@/hooks/useProfile";

// Create language context
const LanguageContext = createContext();

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default function LanguageProvider({ children }) {
  // Default language is English
  const { configurations, updateProfile } = useProfile("user/configurations");
  const [currentLanguage, setCurrentLanguage] = useState("en");
  useEffect(() => {
    if (configurations?.language) {
      setCurrentLanguage(configurations.language);
      i18n.changeLanguage(configurations.language);
    }
  }, [configurations]);

  // Function to change language
  const changeLanguage = (languageCode) => {
    if (LANGUAGES[languageCode]) {
      setCurrentLanguage(languageCode);
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

  const value = {
    currentLanguage,
    languageName: LANGUAGES[currentLanguage],
    changeLanguage,
    languages: LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
