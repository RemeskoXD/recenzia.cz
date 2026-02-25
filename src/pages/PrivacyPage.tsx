import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition">
          <ArrowLeft size={20} />
          Zpět na hlavní stránku
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('privacyTitle')}</h1>
        
        <div className="prose prose-slate max-w-none">
          {t('privacyContent').split('\n').map((line, index) => (
            <p key={index} className="mb-4 text-slate-600 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
