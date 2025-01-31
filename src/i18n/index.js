import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

import en from "./en.json";
import zh from "./zh.json";
import hi from "./hi.json";
import es from "./es.json";
import fr from "./fr.json";
import ar from "./ar.json";
import bn from "./bn.json";
import ur from "./ur.json";
import mr from "./mr.json";
import gu from "./gu.json";
import te from "./te.json";
import ta from "./ta.json";
import kn from "./kn.json";
import ml from "./ml.json";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: { translation: en },
  zh: { translation: zh },
  hi: { translation: hi },
  es: { translation: es },
  fr: { translation: fr },
  ar: { translation: ar },
  bn: { translation: bn },
  ur: { translation: ur },
  mr: { translation: mr },
  gu: { translation: gu },
  te: { translation: te },
  ta: { translation: ta },
  kn: { translation: kn },
  ml: { translation: ml },
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
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    // Add support for RTL languages
    supportedLngs: Object.keys(resources),
    load: "languageOnly",

    // Handle RTL languages
    detection: {
      order: ["localStorage", "navigator"],
    },
  });

i18n.on("languageChanged", (lng) => {
  // Set RTL attribute on html tag
  const dir = ["ar", "ur"].includes(lng) ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

export default i18n;
