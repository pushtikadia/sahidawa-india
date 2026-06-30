export const saveLanguageCache = (lang: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`lang_cache_${lang}`, JSON.stringify(data));
  }
};

export const getLanguageCache = (lang: string): any | null => {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(`lang_cache_${lang}`);
    return cached ? JSON.parse(cached) : null;
  }
  return null;
};