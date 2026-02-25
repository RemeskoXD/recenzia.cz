import { Link } from 'react-router-dom';
import { AnimatedDiv } from '../components/AnimatedDiv';
import { Star, CheckCircle, ArrowRight, ShieldCheck, TrendingUp, Users, HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const isLoggedIn = !!localStorage.getItem('companyId');
  const companyId = localStorage.getItem('companyId');

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <AnimatedDiv className="text-center max-w-5xl mx-auto py-20 px-4">
        <div className="inline-block bg-sky-50 border border-sky-100 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
          <span className="text-sky-700 font-medium text-sm flex items-center gap-2">
            <Star size={14} fill="currentColor" /> Důvěřuje nám již 500+ firem v ČR
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-slate-900 leading-tight tracking-tight">
          Proměňte zákazníky v <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">5-hvězdičkové recenze</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Získejte automaticky více pozitivních recenzí na Google a Seznam. 
          Negativní zpětnou vazbu zachytíme dříve, než se dostane na internet.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          {isLoggedIn ? (
            <Link 
              to={`/dashboard/${companyId}`} 
              className="bg-sky-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-sky-700 transition shadow-lg hover:shadow-sky-500/30 flex items-center justify-center gap-2"
            >
              Přejít do Dashboardu <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link 
                to="/register" 
                className="bg-sky-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-sky-700 transition shadow-lg hover:shadow-sky-500/30 flex items-center justify-center gap-2"
              >
                Vyzkoušet zdarma <ArrowRight size={20} />
              </Link>
              <Link 
                to="/login" 
                className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition shadow-sm hover:shadow-md"
              >
                Přihlásit se
              </Link>
            </>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm font-medium uppercase tracking-wider">
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Bez nutnosti instalace</span>
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Funguje na všech mobilech</span>
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Okamžité výsledky</span>
        </div>
      </AnimatedDiv>

      {/* Problem vs Solution Section */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Proč ztrácíte zákazníky?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Většina lidí se rozhoduje podle recenzí. Jedna špatná recenze vás může stát desítky zákazníků. Recenzia.cz to mění.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 text-red-600">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Ochranný štít</h3>
              <p className="text-slate-500 leading-relaxed">
                Nespokojený zákazník? Náš systém ho zachytí. Místo veřejné hanby na Googlu vám pošle soukromou zprávu. Máte šanci vše napravit.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
              <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6 text-sky-600">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Raketový růst hodnocení</h3>
              <p className="text-slate-500 leading-relaxed">
                Spokojené zákazníky automaticky směrujeme tam, kde to nejvíc potřebujete – na Google Maps, Facebook nebo Seznam Firmy.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Analytika zákazníků</h3>
              <p className="text-slate-500 leading-relaxed">
                Zjistěte, který číšník, pobočka nebo služba má nejlepší hodnocení. Sledujte trendy a zlepšujte své podnikání na základě dat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16 text-center">Jak to funguje? Jednoduše.</h2>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10"></div>

            <div className="text-center relative">
              <div className="w-24 h-24 bg-white border-4 border-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-sky-600 shadow-sm">1</div>
              <h3 className="text-xl font-bold mb-2">Zákazník naskenuje QR</h3>
              <p className="text-slate-500">Umístíte QR kód na stůl, účtenku nebo vizitku. Zákazník ho jednoduše naskenuje mobilem.</p>
            </div>
            <div className="text-center relative">
              <div className="w-24 h-24 bg-white border-4 border-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-sky-600 shadow-sm">2</div>
              <h3 className="text-xl font-bold mb-2">Ohodnotí zážitek</h3>
              <p className="text-slate-500">Jedním kliknutím vybere, jak byl spokojený. Rychlé, anonymní a bez registrace.</p>
            </div>
            <div className="text-center relative">
              <div className="w-24 h-24 bg-white border-4 border-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-sky-600 shadow-sm">3</div>
              <h3 className="text-xl font-bold mb-2">Chytré přesměrování</h3>
              <p className="text-slate-500">5 hvězd? Jde na Google. 1 hvězda? Jde do vašeho soukromého inboxu. Geniální.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">Investice, která se vrátí s prvním zákazníkem</h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">Vyberte si plán, který odpovídá velikosti vašeho podnikání. Žádné skryté poplatky.</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 relative overflow-hidden flex flex-col hover:-translate-y-1 transition duration-300">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Basic</h3>
              <p className="text-slate-500 mb-6">Pro začínající firmy a živnostníky</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">
                249 Kč <span className="text-lg font-normal text-slate-500">/ měsíc</span>
              </div>
              <ul className="text-left space-y-4 mb-8 text-slate-600 flex-grow">
                <li className="flex items-center gap-3">
                  <span className="text-green-500 bg-green-50 rounded-full p-1"><CheckCircle size={14} /></span> Max. 300 recenzí měsíčně
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500 bg-green-50 rounded-full p-1"><CheckCircle size={14} /></span> Generování QR kódu
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500 bg-green-50 rounded-full p-1"><CheckCircle size={14} /></span> Ochrana před negativními recenzemi
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500 bg-green-50 rounded-full p-1"><CheckCircle size={14} /></span> Základní přehled
                </li>
              </ul>
              <Link 
                to="/register?plan=basic" 
                className="block w-full bg-slate-100 text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-200 transition text-center"
              >
                Vybrat Basic
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 text-white relative overflow-hidden transform md:-translate-y-4 flex flex-col hover:-translate-y-5 transition duration-300">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">NEJOBLÍBENĚJŠÍ</div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-slate-400 mb-6">Pro rostoucí firmy bez limitů</p>
              <div className="text-4xl font-extrabold mb-6">
                499 Kč <span className="text-lg font-normal text-slate-400">/ měsíc</span>
              </div>
              <ul className="text-left space-y-4 mb-8 text-slate-300 flex-grow">
                <li className="flex items-center gap-3">
                  <span className="text-sky-400 bg-sky-900/50 rounded-full p-1"><CheckCircle size={14} /></span> <strong>Neomezený</strong> počet recenzí
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-sky-400 bg-sky-900/50 rounded-full p-1"><CheckCircle size={14} /></span> <strong>Pokročilé grafy a trendy</strong>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-sky-400 bg-sky-900/50 rounded-full p-1"><CheckCircle size={14} /></span> <strong>Sledování zdrojů (stoly, pobočky)</strong>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-sky-400 bg-sky-900/50 rounded-full p-1"><CheckCircle size={14} /></span> Vlastní otázky pro zákazníky
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-sky-400 bg-sky-900/50 rounded-full p-1"><CheckCircle size={14} /></span> Prioritní podpora
                </li>
              </ul>
              <Link 
                to="/register?plan=premium" 
                className="block w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-sky-500 hover:to-blue-500 transition shadow-lg hover:shadow-sky-500/25 text-center"
              >
                Vybrat Premium
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Často kladené otázky</h2>
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-2xl p-6 hover:border-sky-200 transition bg-slate-50/50">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-3 text-slate-900"><HelpCircle size={20} className="text-sky-600" /> Je to legální?</h3>
              <p className="text-slate-600">Ano, naprosto. Pouze usnadňujete zákazníkům cestu k recenzi. Nikoho nenutíte ani neplatíte za falešné recenze. Pouze filtrujete zpětnou vazbu.</p>
            </div>
            <div className="border border-slate-200 rounded-2xl p-6 hover:border-sky-200 transition bg-slate-50/50">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-3 text-slate-900"><HelpCircle size={20} className="text-sky-600" /> Kam se ukládají negativní recenze?</h3>
              <p className="text-slate-600">Negativní recenze (méně než 5 hvězd) se uloží pouze do vašeho interního Dashboardu. Zákazník není přesměrován na Google. Vy tak máte šanci situaci vyřešit soukromě.</p>
            </div>
            <div className="border border-slate-200 rounded-2xl p-6 hover:border-sky-200 transition bg-slate-50/50">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-3 text-slate-900"><HelpCircle size={20} className="text-sky-600" /> Mohu kdykoliv zrušit předplatné?</h3>
              <p className="text-slate-600">Samozřejmě. Žádné závazky. Pokud nebudete spokojeni, můžete službu kdykoliv přestat používat.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 bg-slate-900 text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Připraveni ovládnout recenze?</h2>
        <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">Přidejte se k firmám, které už neřeší špatné hodnocení, ale užívají si růst.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center gap-2 bg-white text-slate-900 px-10 py-5 rounded-xl font-bold text-xl hover:bg-sky-50 transition shadow-xl hover:shadow-2xl hover:scale-105 transform duration-200"
        >
          Začít sbírat recenze <ArrowRight size={24} />
        </Link>
        <p className="mt-6 text-slate-500 text-sm">Bez nutnosti kreditní karty pro registraci.</p>
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
