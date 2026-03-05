import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

type Language = 'cz' | 'en' | 'de' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('cz');

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (['cs', 'cz'].includes(browserLang)) setLanguage('cz');
    else if (['de'].includes(browserLang)) setLanguage('de');
    else if (['es'].includes(browserLang)) setLanguage('es');
    else if (['en'].includes(browserLang)) setLanguage('en');
    else setLanguage('cz'); // Default fallback to Czech
    
    // Check local storage override
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && ['cz', 'en', 'de', 'es'].includes(storedLang)) {
      setLanguage(storedLang);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
