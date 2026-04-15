import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import zhCnTranslation from "./locales/cn/translation.json";

const storedLanguage = localStorage.getItem("lang");
const initialLanguage =
  storedLanguage === "cn" || storedLanguage === "zh-CN"
    ? "zh-CN"
    : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    "zh-CN": {
      translation: zhCnTranslation,
    },
  },
  lng: initialLanguage,
  supportedLngs: ["en", "zh-CN"],
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
