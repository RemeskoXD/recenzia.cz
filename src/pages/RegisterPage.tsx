import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AnimatedDiv } from '../components/AnimatedDiv';
import { useLanguage } from '../contexts/LanguageContext';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [plan, setPlan] = useState('basic');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam === 'premium') {
      setPlan('premium');
    }
  }, [searchParams]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, redirect_url: redirectUrl, plan }),
      });

      if (response.ok) {
        const data = await response.json();
        // Auto login after register
        localStorage.setItem('companyId', data.companyId);
        localStorage.setItem('companyName', name);

        // If plan is paid, redirect to Stripe Checkout
        if (plan === 'basic' || plan === 'premium') {
          try {
            const checkoutResponse = await fetch('/api/create-checkout-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ plan, companyId: data.companyId }),
            });
            
            if (checkoutResponse.ok) {
              const { url } = await checkoutResponse.json();
              window.location.href = url;
              return;
            } else {
              console.error('Failed to create checkout session');
              // Fallback to dashboard if checkout fails, but warn user?
              // For now, just go to dashboard
            }
          } catch (e) {
            console.error('Error redirecting to checkout:', e);
          }
        }

        navigate(`/dashboard/${data.companyId}`);
      } else {
        const data = await response.json();
        setError(data.error || t('registrationFailed'));
      }
    } catch (err) {
      setError(t('genericError'));
    }
  };

  return (
    <AnimatedDiv className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">{t('registerTitle')}</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('companyNameLabel')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('emailLabel')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('passwordLabel')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('redirectUrlLabel')}</label>
          <input
            type="url"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            placeholder={t('redirectUrlPlaceholder')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('selectedPlanLabel')}</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPlan('basic')}
              className={`p-3 rounded-lg border text-center transition ${plan === 'basic' ? 'border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="font-bold">{t('planBasic')}</div>
              <div className="text-xs text-slate-500">{t('planBasicPriceShort')}</div>
            </button>
            <button
              type="button"
              onClick={() => setPlan('premium')}
              className={`p-3 rounded-lg border text-center transition ${plan === 'premium' ? 'border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="font-bold">{t('planPremium')}</div>
              <div className="text-xs text-slate-500">{t('planPremiumPriceShort')}</div>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition font-semibold mt-6"
        >
          {t('registerButton')}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        {t('alreadyHaveAccount')} <Link to="/login" className="text-sky-600 hover:underline">{t('loginLink')}</Link>
      </p>
    </AnimatedDiv>
  );
}
