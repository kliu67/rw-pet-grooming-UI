import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import en from "./locales/en/translation.json"
import cn from "./locales/cn/translation.json"

i18n
  .use(LanguageDetector) // auto-detect browser language
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,

    resources: {
      en: {
       translation: en
      },
      cn:{
        translation: en
      },
      fr: {
        translation: {
          services: {
            title: "Services (FR)",
            description: "Gérer vos services",
            add: "Ajouter un service",
            search: "Rechercher..."
          }
        }
      }
    },

    interpolation: {
      escapeValue: false
    }
  })

export default i18n