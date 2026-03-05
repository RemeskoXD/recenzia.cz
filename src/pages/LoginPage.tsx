import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatedDiv } from '../components/AnimatedDiv';
import { useLanguage } from '../contexts/LanguageContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('companyId', data.companyId);
        localStorage.setItem('companyName', data.companyName);
        navigate(`/dashboard/${data.companyId}`);
      } else {
        const data = await response.json();
        setError(data.error || t('loginFailed'));
      }
    } catch (err) {
      setError(t('genericError'));
    }
  };

  return (
    <AnimatedDiv className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">{t('loginTitle')}</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
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
        <button
          type="submit"
          className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition font-semibold"
        >
          {t('loginButton')}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        {t('noAccount')} <Link to="/register" className="text-sky-600 hover:underline">{t('registerLink')}</Link>
      </p>
    </AnimatedDiv>
  );
}
