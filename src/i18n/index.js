import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

import en from "./en.json";
import hi from "./hi.json";
// import fr from "./fr.json";
// import es from "./es.json";
// import de from "./de.json";
// import it from "./it.json";
// import pt from "./pt.json";
// import ru from "./ru.json";
// import zh from "./zh.json";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
  //   fr: {
  //     translation: fr,
  //   },
  //   es: {
  //     translation: es,
  //   },
  //   de: {
  //     translation: de,
  //   },
  //   it: {
  //     translation: it,
  //   },
  //   pt: {
  //     translation: pt,
  //   },
  //   ru: {
  //     translation: ru,
  //   },
  //   zh: {
  //     translation: zh,
  //   },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: import.meta.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    // backend: {
    //   loadPath: "/locales/{{lng}}/{{ns}}.json",
    // },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
