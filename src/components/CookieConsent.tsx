import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { X } from 'lucide-react';

export function CookieConsent() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-lg z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-300 flex-1">
          {t('cookieBannerText')}
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition"
          >
            {t('cookieDecline')}
          </button>
          <button 
            onClick={handleAccept}
            className="px-6 py-2 text-sm font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition shadow-sm"
          >
            {t('cookieAccept')}
          </button>
        </div>
      </div>
    </div>
  );
}
