import { Link } from 'react-router-dom';
import { AnimatedDiv } from '../components/AnimatedDiv';
import { Star, CheckCircle, ArrowRight, ShieldCheck, TrendingUp, Users, HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomePage() {
  const isLoggedIn = !!localStorage.getItem('companyId');
  const companyId = localStorage.getItem('companyId');
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <AnimatedDiv className="text-center max-w-5xl mx-auto py-20 px-4">
        <div className="inline-block bg-sky-50 border border-sky-100 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
          <span className="text-sky-700 font-medium text-sm flex items-center gap-2">
            <Star size={14} fill="currentColor" /> {t('heroBadge')}
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-slate-900 leading-tight tracking-tight">
          {t('heroTitle1')} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">{t('heroTitle2')}</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('heroSubtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          {isLoggedIn ? (
            <Link 
              to={`/dashboard/${companyId}`} 
              className="bg-sky-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-sky-700 transition shadow-lg hover:shadow-sky-500/30 flex items-center justify-center gap-2"
            >
              {t('heroButtonDashboard')} <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link 
                to="/register" 
                className="bg-sky-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-sky-700 transition shadow-lg hover:shadow-sky-500/30 flex items-center justify-center gap-2"
              >
                {t('heroButtonTry')} <ArrowRight size={20} />
              </Link>
              <Link 
                to="/login" 
                className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition shadow-sm hover:shadow-md"
              >
                {t('heroButtonLogin')}
              </Link>
            </>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm font-medium uppercase tracking-wider">
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> {t('heroFeature1')}</span>
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> {t('heroFeature2')}</span>
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> {t('heroFeature3')}</span>
        </div>
      </AnimatedDiv>

      {/* Problem vs Solution Section */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('problemTitle')}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{t('problemSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 text-red-600">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{t('featureShieldTitle')}</h3>
              <p className="text-slate-500 leading-relaxed">
                {t('featureShieldText')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
              <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6 text-sky-600">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{t('featureGrowthTitle')}</h3>
              <p className="text-slate-500 leading-relaxed">
                {t('featureGrowthText')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{t('featureAnalyticsTitle')}</h3>
              <p className="text-slate-500 leading-relaxed">
                {t('featureAnalyticsText')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16 text-center">{t('howItWorksTitle')}</h2>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10"></div>

            <div className="text-center relative">
              <div className="w-24 h-24 bg-white border-4 border-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-sky-600 shadow-sm">1</div>
              <h3 className="text-xl font-bold mb-2">{t('step1Title')}</h3>
              <p className="text-slate-500">{t('step1Text')}</p>
            </div>
            <div className="text-center relative">
              <div className="w-24 h-24 bg-white border-4 border-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-sky-600 shadow-sm">2</div>
              <h3 className="text-xl font-bold mb-2">{t('step2Title')}</h3>
              <p className="text-slate-500">{t('step2Text')}</p>
            </div>
            <div className="text-center relative">
              <div className="w-24 h-24 bg-white border-4 border-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-sky-600 shadow-sm">3</div>
              <h3 className="text-xl font-bold mb-2">{t('step3Title')}</h3>
              <p className="text-slate-500">{t('step3Text')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">{t('pricingTitle')}</h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">{t('pricingSubtitle')}</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 relative overflow-hidden flex flex-col hover:-translate-y-1 transition duration-300">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('planBasic')}</h3>
              <p className="text-slate-500 mb-6">{t('planBasicDesc')}</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">
                {t('planBasicPrice')} <span className="text-lg font-normal text-slate-500">{t('planBasicPeriod')}</span>
              </div>
              <ul className="text-left space-y-4 mb-8 text-slate-600 flex-grow">
                <li className="flex items-center gap-3">
                  <span className="text-green-500 bg-green-50 rounded-full p-1"><CheckCircle size={14} /></span> {t('planBasicFeature1')}
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500 bg-green-50 rounded-full p-1"><CheckCircle size={14} /></span> {t('planBasicFeature2')}
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500 bg-green-50 rounded-full p-1"><CheckCircle size={14} /></span> {t('planBasicFeature3')}
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500 bg-green-50 rounded-full p-1"><CheckCircle size={14} /></span> {t('planBasicFeature4')}
                </li>
              </ul>
              <Link 
                to="/register?plan=basic" 
                className="block w-full bg-slate-100 text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-200 transition text-center"
              >
                {t('planBasicButton')}
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 text-white relative overflow-hidden transform md:-translate-y-4 flex flex-col hover:-translate-y-5 transition duration-300">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">{t('planPremiumBadge')}</div>
              <h3 className="text-2xl font-bold mb-2">{t('planPremium')}</h3>
              <p className="text-slate-400 mb-6">{t('planPremiumDesc')}</p>
              <div className="text-4xl font-extrabold mb-6">
                {t('planPremiumPrice')} <span className="text-lg font-normal text-slate-400">{t('planPremiumPeriod')}</span>
              </div>
              <ul className="text-left space-y-4 mb-8 text-slate-300 flex-grow">
                <li className="flex items-center gap-3">
                  <span className="text-sky-400 bg-sky-900/50 rounded-full p-1"><CheckCircle size={14} /></span> <strong>{t('planPremiumFeature1')}</strong>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-sky-400 bg-sky-900/50 rounded-full p-1"><CheckCircle size={14} /></span> <strong>{t('planPremiumFeature2')}</strong>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-sky-400 bg-sky-900/50 rounded-full p-1"><CheckCircle size={14} /></span> <strong>{t('planPremiumFeature3')}</strong>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-sky-400 bg-sky-900/50 rounded-full p-1"><CheckCircle size={14} /></span> {t('planPremiumFeature4')}
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-sky-400 bg-sky-900/50 rounded-full p-1"><CheckCircle size={14} /></span> {t('planPremiumFeature5')}
                </li>
              </ul>
              <Link 
                to="/register?plan=premium" 
                className="block w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-sky-500 hover:to-blue-500 transition shadow-lg hover:shadow-sky-500/25 text-center"
              >
                {t('planPremiumButton')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">{t('faqTitle')}</h2>
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-2xl p-6 hover:border-sky-200 transition bg-slate-50/50">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-3 text-slate-900"><HelpCircle size={20} className="text-sky-600" /> {t('faq1Q')}</h3>
              <p className="text-slate-600">{t('faq1A')}</p>
            </div>
            <div className="border border-slate-200 rounded-2xl p-6 hover:border-sky-200 transition bg-slate-50/50">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-3 text-slate-900"><HelpCircle size={20} className="text-sky-600" /> {t('faq2Q')}</h3>
              <p className="text-slate-600">{t('faq2A')}</p>
            </div>
            <div className="border border-slate-200 rounded-2xl p-6 hover:border-sky-200 transition bg-slate-50/50">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-3 text-slate-900"><HelpCircle size={20} className="text-sky-600" /> {t('faq3Q')}</h3>
              <p className="text-slate-600">{t('faq3A')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 bg-slate-900 text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('ctaTitle')}</h2>
        <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">{t('ctaSubtitle')}</p>
        <Link 
          to="/register" 
          className="inline-flex items-center gap-2 bg-white text-slate-900 px-10 py-5 rounded-xl font-bold text-xl hover:bg-sky-50 transition shadow-xl hover:shadow-2xl hover:scale-105 transform duration-200"
        >
          {t('ctaButton')} <ArrowRight size={24} />
        </Link>
        <p className="mt-6 text-slate-500 text-sm">{t('ctaNote')}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-medium text-slate-900 hover:text-sky-600 transition"
      >
        {question}
        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <p className="mt-2 text-slate-600 leading-relaxed">{answer}</p>}
    </div>
  );
}
