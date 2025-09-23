import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import pt from "./locales/pt.json";

i18n
  .use(LanguageDetector) // detecta idioma do navegador
  .use(initReactI18next) // conecta com React
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt },
    },
    lng: "pt",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React já faz escape
    },
  });

export default i18n;
