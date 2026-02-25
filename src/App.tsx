import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ReviewPage from './pages/ReviewPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import WidgetPage from './pages/WidgetPage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import CookieConsent from './components/CookieConsent';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('companyId');
  const companyName = localStorage.getItem('companyName');
  const { t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem('companyId');
    localStorage.removeItem('companyName');
    navigate('/');
  };

  // Hide navigation on review page and widget
  if (location.pathname.startsWith('/review/') || location.pathname.startsWith('/widget/')) {
    return null;
  }

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">R</div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Recenzia.cz</h1>
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden sm:inline">
                Firma: <span className="font-medium text-slate-900">{companyName}</span>
              </span>
              <button 
                onClick={handleLogout} 
                className="text-sm font-medium text-slate-500 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                {t('logout')}
              </button>
              <Link 
                to={`/dashboard/${localStorage.getItem('companyId')}`}
                className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 transition shadow-sm hover:shadow-md"
              >
                {t('dashboard')}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link to="/login" className="text-slate-600 hover:text-sky-600 transition px-2 py-1">Přihlásit se</Link>
              <Link to="/register" className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-sm hover:shadow-md">
                Registrace
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();

  if (location.pathname.startsWith('/review/') || location.pathname.startsWith('/widget/')) return null;

  return (
    <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">R</div>
              <span className="text-xl font-bold text-slate-900">Recenzia.cz</span>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Pomáháme firmám získávat více pozitivních recenzí a chránit jejich reputaci. Jednoduše, efektivně a automatizovaně.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Společnost</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>MESCON DIGITAL s.r.o.</li>
              <li>IČO: 23580763</li>
              <li>Příčná 1892/4, 110 00 Praha 1</li>
              <li>Spisová značka: C 429578/MSPH</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Právní informace</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-slate-500 hover:text-sky-600 transition">{t('termsOfService')}</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-500 hover:text-sky-600 transition">{t('privacyPolicy')}</Link>
              </li>
            </ul>
            
            <h3 className="font-bold text-slate-900 mt-6 mb-2">{t('changeLanguage')}</h3>
            <div className="flex gap-2">
               <button onClick={() => setLanguage('cz')} className={`px-2 py-1 rounded text-xs ${language === 'cz' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>CZ</button>
               <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs ${language === 'en' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>EN</button>
               <button onClick={() => setLanguage('de')} className={`px-2 py-1 rounded text-xs ${language === 'de' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>DE</button>
               <button onClick={() => setLanguage('es')} className={`px-2 py-1 rounded text-xs ${language === 'es' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>ES</button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Recenzia.cz. Všechna práva vyhrazena.</p>
          <p>{t('poweredBy')} <a href="https://www.mescon.digital/" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-600 hover:text-sky-600 transition">Mescon digital s.r.o.</a></p>
        </div>
      </div>
    </footer>
  );
}

import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col">
            <Navigation />
            <main className="flex-grow w-full">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/review/:companyId" element={<ReviewPage />} />
                <Route path="/dashboard/:companyId" element={<DashboardPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/widget/:companyId" element={<WidgetPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <CookieConsent />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </HelmetProvider>
  );
}
