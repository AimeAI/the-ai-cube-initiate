import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importing translation files
import translationEN from './locales/en.json';
import translationFRCA from './locales/fr-CA.json';

const resources = {
  en: {
    translation: translationEN,
  },
  'fr-CA': {
    translation: translationFRCA,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // use en if detected lng is not available
    debug: process.env.NODE_ENV === 'development', // enable debug messages in development
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;