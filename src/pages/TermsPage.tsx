import { AnimatedDiv } from '../components/AnimatedDiv';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <AnimatedDiv className="max-w-4xl mx-auto py-12 px-4">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-8 transition">
        <ArrowLeft size={20} /> Zpět na úvod
      </Link>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Všeobecné obchodní podmínky</h1>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">1. Úvodní ustanovení</h2>
          <p>
            Tyto obchodní podmínky (dále jen „Podmínky“) upravují vzájemná práva a povinnosti mezi společností 
            <strong> MESCON DIGITAL s.r.o.</strong>, se sídlem Příčná 1892/4, Nové Město (Praha 1), 110 00 Praha, 
            IČO: 23580763, zapsanou v obchodním rejstříku vedeném Městským soudem v Praze, oddíl C, vložka 429578 
            (dále jen „Poskytovatel“) a uživatelem služeb aplikace Recenzia.cz (dále jen „Uživatel“).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">2. Předmět služby</h2>
          <p>
            Poskytovatel provozuje webovou aplikaci Recenzia.cz, která slouží ke správě zákaznických recenzí, 
            generování QR kódů a analytice zpětné vazby (dále jen „Služba“). Služba je poskytována jako software as a service (SaaS).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">3. Uživatelský účet</h2>
          <p>
            Pro využívání Služby je nutná registrace. Uživatel je povinen uvádět při registraci správné a pravdivé údaje. 
            Uživatel je povinen chránit své přihlašovací údaje. Poskytovatel nenese odpovědnost za zneužití účtu třetí osobou.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">4. Cena a platební podmínky</h2>
          <p>
            Služba je poskytována formou předplatného (Basic nebo Premium). Ceny jsou uvedeny na webových stránkách aplikace.
            Předplatné se hradí předem na zvolené období (měsíčně).
          </p>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
            <h3 className="font-bold text-red-700 mb-1">Nevratnost plateb</h3>
            <p className="text-red-600 text-sm">
              Vzhledem k povaze digitální služby (dodání digitálního obsahu bez hmotného nosiče) Uživatel výslovně souhlasí s tím, 
              že započetím poskytování služby před uplynutím lhůty pro odstoupení od smlouvy <strong>zaniká právo na odstoupení od smlouvy</strong>. 
              Uhrazené předplatné je nevratné. Při zrušení služby v průběhu fakturačního období se poměrná část peněz nevrací 
              a služba zůstává aktivní do konce předplaceného období.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">5. Odpovědnost za vady a dostupnost</h2>
          <p>
            Poskytovatel garantuje dostupnost služby 99 % času. Nenese však odpovědnost za výpadky způsobené třetími stranami 
            (hosting, internetové připojení). Aplikace je poskytována „tak jak je“. Poskytovatel neodpovídá za ušlý zisk 
            nebo jiné nepřímé škody vzniklé užíváním aplikace.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">6. Závěrečná ustanovení</h2>
          <p>
            Právní vztahy se řídí právním řádem České republiky. Poskytovatel si vyhrazuje právo tyto podmínky měnit. 
            Změnu oznámí Uživateli e-mailem nebo v rozhraní aplikace.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Tyto podmínky nabývají účinnosti dnem 22. 2. 2026.
          </p>
        </section>
      </div>
    </AnimatedDiv>
  );
}
