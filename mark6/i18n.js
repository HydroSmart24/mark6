import i18n from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your translation files
import en from './locales/en.json';
import si from './locales/si.json';

// Set up translations
i18n.translations = {
  en: en,
  si: si,
};

// Enable fallbacks for missing translations
i18n.fallbacks = true;

// Load saved language or fallback to device's locale
export const loadAppLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('appLanguage');
    if (savedLanguage) {
      i18n.locale = savedLanguage;
    } else {
      // Use device's locale if no saved language is found
      i18n.locale = Localization.locale.startsWith('si') ? 'si' : 'en';
    }
  } catch (error) {
    console.error('Failed to load app language', error);
    i18n.locale = 'en'; // Fallback to English in case of error
  }
};

// Save selected language
export const setAppLanguage = async (language) => {
  try {
    i18n.locale = language; // Set i18n locale
    await AsyncStorage.setItem('appLanguage', language); // Save to AsyncStorage
  } catch (error) {
    console.error('Failed to save app language', error);
  }
};

export default i18n;
