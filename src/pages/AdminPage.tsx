import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedDiv } from '../components/AnimatedDiv';
import { Users, LogOut, Calendar, Shield, CreditCard } from 'lucide-react';

export default function AdminPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchCompanies();
  }, [navigate]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/admin/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error('Failed to fetch companies', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('companyId');
    localStorage.removeItem('companyName');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <AnimatedDiv className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Shield className="text-sky-600" size={32} />
          Administrace
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition font-medium"
        >
          <LogOut size={20} /> Odhlásit se
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <Users className="text-sky-500" />
            Seznam zákazníků ({companies.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Název</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Plán</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Expirace</th>
                <th className="p-4 font-semibold">Registrace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-slate-500 font-mono text-sm">#{company.id}</td>
                  <td className="p-4 font-medium text-slate-900">{company.name}</td>
                  <td className="p-4 text-slate-600">{company.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      company.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {company.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      company.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {company.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 flex items-center gap-2">
                    {company.expires_at ? (
                      <>
                        <Calendar size={16} className="text-slate-400" />
                        {new Date(company.expires_at).toLocaleDateString('cs-CZ')}
                      </>
                    ) : (
                      <span className="text-slate-400 italic">Neomezeně</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    {new Date(company.created_at).toLocaleDateString('cs-CZ')}
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Zatím žádní zákazníci.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedDiv>
  );
}
