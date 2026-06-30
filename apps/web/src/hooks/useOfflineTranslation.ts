import { useState, useEffect } from 'react';
import { getLanguageCache, saveLanguageCache } from '../lib/offlineCache';

export const useOfflineTranslation = (lang: string, fallbackData: any) => {
  const [translations, setTranslations] = useState(fallbackData);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (navigator.onLine) {
      setTranslations(fallbackData);
      saveLanguageCache(lang, fallbackData);
    } else {
      const cachedData = getLanguageCache(lang);
      if (cachedData) {
        setTranslations(cachedData);
      }
    }
  }, [lang, fallbackData]);

  return translations;
};