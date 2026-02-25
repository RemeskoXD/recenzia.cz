import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatedDiv } from '../components/AnimatedDiv';
import { Star, Globe } from 'lucide-react';

const translations = {
  cs: {
    question: "Jak jste spokojeni s",
    feedback: "Vaše zpětná vazba je pro nás důležitá.",
    bad: "Něco se nepovedlo?",
    badDesc: "Dejte nám vědět, co můžeme zlepšit.",
    placeholder: "Váš komentář...",
    send: "Odeslat zpětnou vazbu",
    thanks: "Děkujeme za zpětnou vazbu!",
    saved: "Vaše recenze byla uložena.",
    where: "Kde nám chcete nechat recenzi?",
    whereDesc: "Vyberte si platformu, která vám nejvíce vyhovuje.",
    loading: "Načítání..."
  },
  en: {
    question: "How satisfied are you with",
    feedback: "Your feedback is important to us.",
    bad: "Something went wrong?",
    badDesc: "Let us know how we can improve.",
    placeholder: "Your comment...",
    send: "Send feedback",
    thanks: "Thank you for your feedback!",
    saved: "Your review has been saved.",
    where: "Where would you like to leave a review?",
    whereDesc: "Choose the platform that suits you best.",
    loading: "Loading..."
  },
  de: {
    question: "Wie zufrieden sind Sie mit",
    feedback: "Ihr Feedback ist uns wichtig.",
    bad: "Ist etwas schiefgelaufen?",
    badDesc: "Lassen Sie uns wissen, was wir verbessern können.",
    placeholder: "Ihr Kommentar...",
    send: "Feedback senden",
    thanks: "Vielen Dank für Ihr Feedback!",
    saved: "Ihre Bewertung wurde gespeichert.",
    where: "Wo möchten Sie eine Bewertung hinterlassen?",
    whereDesc: "Wählen Sie die Plattform, die Ihnen am besten passt.",
    loading: "Wird geladen..."
  }
};

export default function ReviewPage() {
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [step, setStep] = useState('rating'); // 'rating', 'negative', 'redirect', 'thanks'
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [lang, setLang] = useState('cs');

  const source = searchParams.get('source');

  useEffect(() => {
    // Detect language
    const browserLang = navigator.language.split('-')[0];
    if (['cs', 'en', 'de'].includes(browserLang)) {
      setLang(browserLang);
    }

    fetch(`/api/companies/${companyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          navigate('/404');
        } else {
          setCompany(data);
        }
      });
  }, [companyId, navigate]);

  const t = translations[lang];

  const getAvailableUrls = () => {
    if (!company) return [];
    return [
      { name: 'Google', url: company.redirect_url || company.url_google, icon: 'G', color: 'bg-white text-slate-800 border-slate-200 hover:border-blue-400' },
      { name: 'Facebook', url: company.url_facebook, icon: 'f', color: 'bg-[#1877F2] text-white border-transparent hover:bg-[#166FE5]' },
      { name: 'Firmy.cz', url: company.url_firmy, icon: 'F', color: 'bg-[#CC0000] text-white border-transparent hover:bg-[#B30000]' },
      { name: 'TripAdvisor', url: company.url_tripadvisor, icon: 'T', color: 'bg-[#34E0A1] text-black border-transparent hover:bg-[#2BBF89]' }
    ].filter(u => u.url);
  };

  const handleRating = async (selectedRating) => {
    setRating(selectedRating);
    const threshold = company.positive_threshold || 5;

    if (selectedRating >= threshold) {
      // Positive feedback
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          company_id: companyId, 
          rating: selectedRating, 
          comment: 'Positive rating',
          source: source
        })
      });

      const urls = getAvailableUrls();

      if (urls.length > 1) {
        setStep('redirect');
      } else if (urls.length === 1) {
        window.location.href = urls[0].url;
      } else {
        setStep('thanks');
      }
    } else {
      // Negative feedback
      setStep('negative');
    }
  };

  const handleNegativeSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        company_id: companyId, 
        rating: rating, 
        comment,
        source: source,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone
      })
    });
    setStep('thanks');
  };

  if (!company) return <div className="text-center text-slate-500 mt-20">{t.loading}</div>;

  const availableUrls = getAvailableUrls();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
        <Globe size={16} className="text-slate-400" />
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer"
        >
          <option value="cs">Čeština</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      {step === 'thanks' && (
        <AnimatedDiv className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center max-w-lg w-full mx-auto">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-slate-900">{t.thanks}</h2>
          <p className="text-slate-500">{t.saved}</p>
        </AnimatedDiv>
      )}

      {step === 'negative' && (
        <AnimatedDiv className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center text-slate-900">{t.bad}</h2>
          <p className="text-slate-500 mb-8 text-center">{t.badDesc}</p>
          <form onSubmit={handleNegativeSubmit} className="space-y-4">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm shadow-inner placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 h-32 resize-none transition"
              placeholder={t.placeholder}
              required
            />
            
            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-3">Kontakt na vás (nepovinné)</p>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Jméno"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Zanechte nám kontakt, abychom mohli situaci napravit.
              </p>
            </div>

            <button type="submit" className="mt-6 w-full bg-slate-900 text-white py-3.5 px-4 rounded-xl hover:bg-slate-800 font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              {t.send}
            </button>
          </form>
        </AnimatedDiv>
      )}

      {step === 'redirect' && (
        <AnimatedDiv className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center max-w-lg w-full mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-slate-900">{t.where}</h2>
          <p className="text-slate-500 mb-8">{t.whereDesc}</p>
          <div className="flex flex-col gap-3">
            {availableUrls.map((platform, idx) => (
              <a 
                key={idx}
                href={platform.url}
                className={`flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg border transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${platform.color}`}
              >
                {platform.name}
              </a>
            ))}
          </div>
        </AnimatedDiv>
      )}

      {step === 'rating' && (
        <AnimatedDiv className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 text-center max-w-lg w-full mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900 leading-tight">
            {company.custom_question || `${t.question} ${company.name}?`}
          </h2>
          <p className="text-slate-500 mb-10">{t.feedback}</p>
          
          <div className="flex justify-center gap-2 md:gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <Star 
                  size={48} 
                  className={`transition-colors duration-200 ${
                    (hoverRating || rating) >= star 
                      ? 'text-amber-400 fill-amber-400 drop-shadow-sm' 
                      : 'text-slate-200 fill-slate-100'
                  }`} 
                />
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <span>Špatné</span>
            <span>Skvělé</span>
          </div>
        </AnimatedDiv>
      )}
    </div>
  );
}
