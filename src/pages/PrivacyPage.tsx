import { AnimatedDiv } from '../components/AnimatedDiv';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <AnimatedDiv className="max-w-4xl mx-auto py-12 px-4">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-8 transition">
        <ArrowLeft size={20} /> Zpět na úvod
      </Link>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Zásady ochrany osobních údajů (GDPR)</h1>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">1. Správce osobních údajů</h2>
          <p>
            Správcem vašich osobních údajů je společnost <strong>MESCON DIGITAL s.r.o.</strong>, se sídlem Příčná 1892/4, 
            Nové Město (Praha 1), 110 00 Praha, IČO: 23580763, zapsaná v obchodním rejstříku vedeném Městským soudem v Praze, 
            oddíl C, vložka 429578 (dále jen „Správce“).
          </p>
          <p>
            Kontaktní údaje správce: <a href="mailto:info@recenzia.cz" className="text-sky-600 hover:underline">info@recenzia.cz</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">2. Jaké údaje zpracováváme</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Identifikační údaje:</strong> Jméno a příjmení, název firmy, IČO, DIČ.</li>
            <li><strong>Kontaktní údaje:</strong> E-mailová adresa, telefonní číslo, fakturační adresa.</li>
            <li><strong>Údaje o využívání služby:</strong> Historie přihlášení, IP adresa, statistiky recenzí.</li>
            <li><strong>Platební údaje:</strong> Informace o provedených platbách (číslo účtu, variabilní symbol).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">3. Účel zpracování</h2>
          <p>
            Vaše údaje zpracováváme za účelem:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Poskytování služby Recenzia.cz a plnění smlouvy.</li>
            <li>Vystavování daňových dokladů a vedení účetnictví (zákonná povinnost).</li>
            <li>Zasílání obchodních sdělení a novinek týkajících se služby (oprávněný zájem).</li>
            <li>Zlepšování kvality našich služeb a technická podpora.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">4. Doba uchování údajů</h2>
          <p>
            Osobní údaje uchováváme po dobu trvání smluvního vztahu a následně po dobu nezbytnou k uplatnění právních nároků 
            (zpravidla 3 roky) nebo po dobu stanovenou právními předpisy (např. zákon o účetnictví – 10 let).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">5. Vaše práva</h2>
          <p>
            Jako subjekt údajů máte právo na přístup k vašim údajům, právo na jejich opravu, výmaz („právo být zapomenut“), 
            omezení zpracování, přenositelnost údajů a právo vznést námitku proti zpracování. Máte také právo podat stížnost 
            u Úřadu pro ochranu osobních údajů.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">6. Zabezpečení údajů</h2>
          <p>
            Správce prohlašuje, že přijal veškerá vhodná technická a organizační opatření k zabezpečení osobních údajů. 
            Přístup k údajům mají pouze pověřené osoby.
          </p>
        </section>
      </div>
    </AnimatedDiv>
  );
}
