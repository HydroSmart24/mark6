import i18n from 'i18n-js';
import * as Localization from 'expo-localization';

// Import your translation files
import en from './locales/en.json';
import si from './locales/si.json';

// Set up translations
i18n.translations = {
  en: en,
  si: si,
};

// Use the device's locale
i18n.locale = Localization.locale.startsWith('si') ? 'si' : 'en';

// Enable fallbacks for missing translations
i18n.fallbacks = true;

export default i18n;
