import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
      <div className="text-sm">
        <p className="font-bold mb-1">{t('cookiesTitle')}</p>
        <p>{t('cookiesText')}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={handleAccept} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          {t('accept')}
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
