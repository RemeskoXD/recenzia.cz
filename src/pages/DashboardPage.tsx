import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { AnimatedDiv } from '../components/AnimatedDiv';
import { Download, Filter, Star, Archive, LogOut, LayoutDashboard, QrCode, MessageSquare, TrendingUp, AlertCircle, PieChart as PieChartIcon, Tag, Settings, Save, Code, User, Mail, Phone, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

export default function DashboardPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [company, setCompany] = useState(null);
  const [usage, setUsage] = useState(null);
  const [statsData, setStatsData] = useState({ daily: [], sources: [] });
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, reviews, qrcode, settings
  const [filterRating, setFilterRating] = useState('all'); // all, positive, negative
  const [qrSource, setQrSource] = useState('');
  
  // Settings state
  const [settingsName, setSettingsName] = useState('');
  const [settingsUrl, setSettingsUrl] = useState('');
  const [settingsQuestion, setSettingsQuestion] = useState('');
  const [settingsPassword, setSettingsPassword] = useState('');
  const [settingsThreshold, setSettingsThreshold] = useState(5);
  const [settingsUrlFacebook, setSettingsUrlFacebook] = useState('');
  const [settingsUrlFirmy, setSettingsUrlFirmy] = useState('');
  const [settingsUrlTripadvisor, setSettingsUrlTripadvisor] = useState('');
  const [settingsQrColor, setSettingsQrColor] = useState('#0ea5e9');
  const [settingsQrBgColor, setSettingsQrBgColor] = useState('#ffffff');
  const [settingsQrStyle, setSettingsQrStyle] = useState('squares');
  const [settingsQrLogo, setSettingsQrLogo] = useState('none');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const qrRef = useRef(null);

  const baseUrl = `${window.location.origin}/review/${companyId}`;
  const reviewUrl = qrSource ? `${baseUrl}?source=${encodeURIComponent(qrSource)}` : baseUrl;

  useEffect(() => {
    const loggedInId = localStorage.getItem('companyId');
    if (!loggedInId || loggedInId !== companyId) {
      navigate('/login');
      return;
    }

    fetch(`/api/companies/${companyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) navigate('/404');
        else {
          setCompany(data);
          setSettingsName(data.name);
          setSettingsUrl(data.redirect_url || '');
          setSettingsQuestion(data.custom_question || '');
          setSettingsThreshold(data.positive_threshold || 5);
          setSettingsUrlFacebook(data.url_facebook || '');
          setSettingsUrlFirmy(data.url_firmy || '');
          setSettingsUrlTripadvisor(data.url_tripadvisor || '');
          setSettingsQrColor(data.qr_color || '#0ea5e9');
          setSettingsQrBgColor(data.qr_bg_color || '#ffffff');
          setSettingsQrStyle(data.qr_style || 'squares');
          setSettingsQrLogo(data.qr_logo || 'none');
        }
      });

    fetch(`/api/companies/${companyId}/usage`)
      .then(res => res.json())
      .then(setUsage);

    fetch(`/api/reviews/${companyId}?archived=${showArchived}`)
      .then(res => res.json())
      .then(setReviews);

    fetch(`/api/companies/${companyId}/stats`)
      .then(res => res.json())
      .then(setStatsData);
  }, [companyId, navigate, showArchived]);

  const handleArchive = async (reviewId) => {
    await fetch(`/api/reviews/${reviewId}/archive`, { method: 'PUT' });
    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  const handleLogout = () => {
    localStorage.removeItem('companyId');
    localStorage.removeItem('companyName');
    navigate('/');
  };
  
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaved(false);
    
    const body: any = {
      name: settingsName,
      redirect_url: settingsUrl,
      custom_question: settingsQuestion,
      positive_threshold: settingsThreshold,
      url_facebook: settingsUrlFacebook,
      url_firmy: settingsUrlFirmy,
      url_tripadvisor: settingsUrlTripadvisor,
      qr_color: settingsQrColor,
      qr_bg_color: settingsQrBgColor,
      qr_style: settingsQrStyle,
      qr_logo: settingsQrLogo
    };

    if (settingsPassword) {
      body.password = settingsPassword;
    }
    
    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        setSettingsSaved(true);
        setSettingsPassword(''); // Clear password field after save
        setCompany({ ...company, ...body });
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `recenzia-qr-${company?.name || 'code'}${qrSource ? '-' + qrSource : ''}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(40, 40, 40);
    doc.text(company?.name || "Vaše firma", width / 2, 30, { align: "center" });
    
    // Subtitle
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("Vaše spokojenost je pro nás důležitá!", width / 2, 45, { align: "center" });
    
    // QR Code
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      doc.addImage(pngFile, 'PNG', (width - 100) / 2, 60, 100, 100);
      
      // Call to action
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text("Naskenujte QR kód a ohodnoťte nás", width / 2, 180, { align: "center" });
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Děkujeme za vaši zpětnou vazbu.", width / 2, 280, { align: "center" });
      
      doc.save(`letak-${company?.name || 'review'}.pdf`);
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const filteredReviews = reviews.filter(review => {
    if (filterRating === 'positive') return review.rating >= (company?.positive_threshold || 5);
    if (filterRating === 'negative') return review.rating < (company?.positive_threshold || 5);
    return true;
  });

  const stats = {
    total: reviews.length,
    negative: reviews.filter(r => r.rating < (company?.positive_threshold || 5)).length,
    positive: reviews.filter(r => r.rating >= (company?.positive_threshold || 5)).length,
  };

  const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6'];

  if (!company) return <div className="flex items-center justify-center h-screen text-slate-500">Načítání...</div>;

  return (
    <AnimatedDiv className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {company.name}
            {usage && (
              <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide ${usage.plan === 'premium' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'}`}>
                {usage.plan}
              </span>
            )}
          </h2>
          <p className="text-slate-500 text-sm mt-1">{t('adminTitle')}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition text-sm font-medium">
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'overview' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} /> {t('dashboard')}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'reviews' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            <MessageSquare size={20} /> {t('reviews')}
          </button>
          <button 
            onClick={() => setActiveTab('qrcode')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'qrcode' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            <QrCode size={20} /> {t('qrCode')}
          </button>
          {usage?.plan === 'premium' && (
            <button 
              onClick={() => setActiveTab('widget')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'widget' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              <Code size={20} /> {t('webWidget')}
            </button>
          )}
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'settings' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            <Settings size={20} /> {t('settings')}
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <AnimatedDiv className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{t('totalReviews')}</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{t('positive')}</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.positive}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{t('negative')}</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.negative}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Charts */}
              {usage && usage.plan === 'premium' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Daily Trend Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-4 text-slate-900">{t('recentReviews')}</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={statsData.daily}>
                          <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" tickFormatter={(str) => format(new Date(str), 'd.M')} stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelFormatter={(label) => format(new Date(label), 'd. MMMM yyyy')}
                          />
                          <Area type="monotone" dataKey="total" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Sources Pie Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-4 text-slate-900">{t('reviewSources')}</h3>
                    {statsData.sources.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statsData.sources}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="count"
                            >
                              {statsData.sources.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                        {t('noSourceData')}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Basic Plan Upsell */
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">{t('premiumUpsellTitle')}</h3>
                    <p className="text-slate-300 mb-6 max-w-md">
                      {t('premiumUpsellDesc')}
                    </p>
                    <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg font-semibold transition">
                      {t('upgradePremium')}
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                </div>
              )}

              {/* Usage Limit (Basic Only) */}
              {usage && usage.plan === 'basic' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900">{t('monthlyLimit')}</h3>
                    <span className="text-sm text-slate-500">{usage.usage} / 300</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${usage.usage >= 300 ? 'bg-red-500' : 'bg-sky-500'}`} 
                      style={{ width: `${Math.min((usage.usage / 300) * 100, 100)}%` }}
                    ></div>
                  </div>
                  {usage.usage >= 250 && (
                    <p className="text-sm text-amber-600 mt-3 flex items-center gap-2">
                      <AlertCircle size={16} /> {t('limitWarning')}
                    </p>
                  )}
                </div>
              )}
            </AnimatedDiv>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <AnimatedDiv className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-lg font-bold text-slate-900">{t('reviewsList')}</h3>
                <div className="flex gap-2">
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setFilterRating('all')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${filterRating === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {t('all')}
                    </button>
                    <button 
                      onClick={() => setFilterRating('negative')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${filterRating === 'negative' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {t('negative')}
                    </button>
                    <button 
                      onClick={() => setFilterRating('positive')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${filterRating === 'positive' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {t('positive')}
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowArchived(!showArchived)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition ${showArchived ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Archive size={16} /> {showArchived ? t('hideArchive') : t('archive')}
                  </button>
                  {usage?.plan === 'premium' && (
                    <a 
                      href={`/api/companies/${companyId}/export`}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                      download
                    >
                      <Download size={16} /> {t('exportCsv')}
                    </a>
                  )}
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map(review => (
                    <div key={review.id} className="p-6 hover:bg-slate-50 transition flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        {review.rating >= (company?.positive_threshold || 5) ? (
                          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <Star size={20} fill="currentColor" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <Star size={20} fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold px-2 py-0.5 rounded ${review.rating >= (company?.positive_threshold || 5) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {review.rating} {review.rating === 1 ? t('star') : review.rating >= 2 && review.rating <= 4 ? t('stars24') : t('stars')}
                            </span>
                            {review.source && (
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                                <Tag size={10} /> {review.source}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {format(new Date(review.created_at), 'd. M. yyyy HH:mm')}
                          </span>
                        </div>
                        <p className="text-slate-800 mt-2">{review.comment}</p>
                        
                        {(review.customer_name || review.customer_email || review.customer_phone) && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">{t('customerContact')}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              {review.customer_name && (
                                <div className="flex items-center gap-2 text-slate-700">
                                  <User size={14} className="text-slate-400" />
                                  <span>{review.customer_name}</span>
                                </div>
                              )}
                              {review.customer_email && (
                                <div className="flex items-center gap-2 text-slate-700">
                                  <Mail size={14} className="text-slate-400" />
                                  <a href={`mailto:${review.customer_email}`} className="hover:text-sky-600 hover:underline">
                                    {review.customer_email}
                                  </a>
                                </div>
                              )}
                              {review.customer_phone && (
                                <div className="flex items-center gap-2 text-slate-700">
                                  <Phone size={14} className="text-slate-400" />
                                  <a href={`tel:${review.customer_phone}`} className="hover:text-sky-600 hover:underline">
                                    {review.customer_phone}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {review.archived && (
                          <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                            {t('archived')}
                          </span>
                        )}
                      </div>
                      {!showArchived && review.rating < (company?.positive_threshold || 5) && (
                        <div className="flex-shrink-0 self-center sm:self-start">
                          <button 
                            onClick={() => handleArchive(review.id)}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Archivovat"
                          >
                            <Archive size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-500">
                    <Filter size={48} className="mx-auto mb-4 text-slate-300" />
                    <p>{t('noReviewsFilter')}</p>
                  </div>
                )}
              </div>
            </AnimatedDiv>
          )}

          {/* QR Code Tab */}
          {activeTab === 'qrcode' && (
            <AnimatedDiv className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <h3 className="text-xl font-bold mb-6 text-slate-900">{t('qrCodeTitle')}</h3>
              
              <div className="flex flex-col lg:flex-row items-start justify-center gap-12">
                {/* Preview */}
                <div className="flex flex-col items-center gap-6 flex-1">
                  <div className="p-6 rounded-2xl border-4 shadow-xl inline-block transition-colors duration-300" style={{ borderColor: settingsQrColor, backgroundColor: settingsQrBgColor }}>
                    <QRCodeSVG 
                      id="qr-code-svg"
                      value={reviewUrl} 
                      size={256} 
                      fgColor={settingsQrColor}
                      bgColor={settingsQrBgColor}
                      imageSettings={settingsQrLogo !== 'none' ? {
                        src: settingsQrLogo === 'google' 
                          ? "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                          : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwZWE1ZTkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMjAiIHg9IjQiIHk9IjIiIHJ4PSIyIi8+PHBhdGggZD0iTTkgMjJ2LTRoNnY0Ii8+PHBhdGggZD0iTTggNmgwLjAxIi8+PHBhdGggZD0iTTE2IDZoMC4wMSIvPjxwYXRoIGQ9Ik0xMiA2aDAuMDEiLz48cGF0aCBkPSJNMTIgMTBoMC4wMSIvPjxwYXRoIGQ9Ik0xMiAxNGgwLjAxIi8+PHBhdGggZD0iTTE2IDEwaDAuMDEiLz48cGF0aCBkPSJNMTYgMTRoMC4wMSIvPjxwYXRoIGQ9Ik04IDEwaDAuMDEiLz48cGF0aCBkPSJNOCAxNGgwLjAxIi8+PC9zdmc+",
                        height: 48,
                        width: 48,
                        excavate: true,
                      } : undefined}
                      level="H"
                    />
                  </div>
                  
                  <div className="w-full max-w-xs space-y-3">
                    <button 
                      onClick={downloadQRCode}
                      className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition shadow-lg hover:shadow-sky-500/25"
                    >
                      <Download size={20} /> {t('downloadPng')}
                    </button>
                    <button 
                      onClick={generatePDF}
                      className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 py-3 rounded-xl font-semibold hover:bg-slate-50 transition shadow-sm"
                    >
                      <FileText size={20} /> {t('downloadPdf')}
                    </button>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex-1 w-full max-w-md space-y-6 text-left bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 border-b pb-2 mb-4">{t('designCustomization')}</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('qrColor')}</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={settingsQrColor}
                        onChange={(e) => setSettingsQrColor(e.target.value)}
                        className="h-10 w-full cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('bgColor')}</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={settingsQrBgColor}
                        onChange={(e) => setSettingsQrBgColor(e.target.value)}
                        className="h-10 w-full cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('logoCenter')}</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setSettingsQrLogo('none')}
                        className={`p-2 border rounded-lg text-sm ${settingsQrLogo === 'none' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                      >
                        {t('none')}
                      </button>
                      <button
                        onClick={() => setSettingsQrLogo('google')}
                        className={`p-2 border rounded-lg text-sm ${settingsQrLogo === 'google' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                      >
                        Google
                      </button>
                      <button
                        onClick={() => setSettingsQrLogo('star')}
                        className={`p-2 border rounded-lg text-sm ${settingsQrLogo === 'star' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                      >
                        {t('starIcon')}
                      </button>
                    </div>
                  </div>

                  {usage && usage.plan === 'premium' && (
                    <div className="pt-4 border-t border-slate-200 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-700">
                          {t('sourceLabel')}
                        </label>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">PRO</span>
                      </div>
                      <input 
                        type="text" 
                        value={qrSource}
                        onChange={(e) => setQrSource(e.target.value)}
                        placeholder={t('sourcePlaceholder')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        {t('sourceNote')}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 mt-4">
                    <button
                      onClick={handleSaveSettings}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition font-medium"
                    >
                      <Save size={18} /> {t('saveAppearance')}
                    </button>
                    {settingsSaved && (
                      <p className="text-green-600 text-sm text-center mt-2 font-medium">{t('appearanceSaved')}</p>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedDiv>
          )}

          {/* Widget Tab (Premium Only) */}
          {activeTab === 'widget' && usage?.plan === 'premium' && (
            <AnimatedDiv className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-6 text-slate-900">{t('webWidgetTitle')}</h3>
              <p className="text-slate-600 mb-6">
                {t('webWidgetDesc')}
              </p>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-700 mb-2">{t('widgetPreview')}</h4>
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 inline-block">
                  <iframe 
                    src={`/widget/${companyId}`} 
                    width="250" 
                    height="80" 
                    frameBorder="0" 
                    scrolling="no"
                    className="bg-transparent"
                  ></iframe>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">{t('embedCode')}</h4>
                <div className="relative">
                  <textarea 
                    readOnly 
                    className="w-full h-24 p-4 bg-slate-900 text-sky-300 font-mono text-sm rounded-xl focus:outline-none"
                    value={`<iframe src="${window.location.origin}/widget/${companyId}" width="250" height="80" frameborder="0" scrolling="no" style="background:transparent;"></iframe>`}
                  />
                  <button 
                    onClick={() => navigator.clipboard.writeText(`<iframe src="${window.location.origin}/widget/${companyId}" width="250" height="80" frameborder="0" scrolling="no" style="background:transparent;"></iframe>`)}
                    className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded text-xs font-medium transition"
                  >
                    {t('copyCode')}
                  </button>
                </div>
              </div>
            </AnimatedDiv>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <AnimatedDiv className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-6 text-slate-900">{t('companySettings')}</h3>
              
              <form onSubmit={handleSaveSettings} className="space-y-8 max-w-2xl">
                
                {/* Základní nastavení */}
                <div className="space-y-4">
                  <h4 className="text-md font-bold text-slate-900 border-b pb-2">{t('basicInfo')}</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('companyName')}</label>
                    <input
                      type="text"
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('customQuestion')}</label>
                    <p className="text-xs text-slate-500 mb-2">{t('customQuestionDesc')}</p>
                    <input
                      type="text"
                      value={settingsQuestion}
                      onChange={(e) => setSettingsQuestion(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      placeholder={t('customQuestionPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('satisfactionThreshold')}</label>
                    <p className="text-xs text-slate-500 mb-2">{t('satisfactionThresholdDesc')}</p>
                    <select
                      value={settingsThreshold}
                      onChange={(e) => setSettingsThreshold(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value={5}>{t('only5')}</option>
                      <option value={4}>{t('4and5')}</option>
                    </select>
                  </div>
                </div>

                {/* Odkazy na platformy */}
                <div className="space-y-4">
                  <h4 className="text-md font-bold text-slate-900 border-b pb-2">{t('reviewPlatforms')}</h4>
                  <p className="text-sm text-slate-500">{t('reviewPlatformsDesc')}</p>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('mainUrl')}</label>
                    <input
                      type="url"
                      value={settingsUrl}
                      onChange={(e) => setSettingsUrl(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      placeholder="https://g.page/r/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
                    <input
                      type="url"
                      value={settingsUrlFacebook}
                      onChange={(e) => setSettingsUrlFacebook(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Firmy.cz URL</label>
                    <input
                      type="url"
                      value={settingsUrlFirmy}
                      onChange={(e) => setSettingsUrlFirmy(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      placeholder="https://www.firmy.cz/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">TripAdvisor URL</label>
                    <input
                      type="url"
                      value={settingsUrlTripadvisor}
                      onChange={(e) => setSettingsUrlTripadvisor(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      placeholder="https://www.tripadvisor.com/..."
                    />
                  </div>
                </div>

                {/* Premium nastavení */}
                {usage?.plan === 'premium' && (
                  <div className="space-y-4">
                    <h4 className="text-md font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                      <Star size={18} className="text-amber-500" fill="currentColor" /> {t('premiumFeatures')}
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('qrColor')}</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={settingsQrColor}
                          onChange={(e) => setSettingsQrColor(e.target.value)}
                          className="h-10 w-20 cursor-pointer border-0 p-0"
                        />
                        <span className="text-sm text-slate-500">{t('colorMatch')}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-md font-bold text-slate-900 mb-4">{t('changePassword')}</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('newPassword')}</label>
                    <p className="text-xs text-slate-500 mb-2">{t('newPasswordDesc')}</p>
                    <input
                      type="password"
                      value={settingsPassword}
                      onChange={(e) => setSettingsPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      placeholder={t('newPassword')}
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-sky-600 text-white px-6 py-2.5 rounded-lg hover:bg-sky-700 transition font-semibold shadow-sm"
                  >
                    <Save size={20} /> {t('saveChanges')}
                  </button>
                  
                  {settingsSaved && (
                    <span className="text-green-600 font-medium flex items-center gap-2 animate-fade-in">
                      <span className="text-xl">✓</span> {t('saved')}
                    </span>
                  )}
                </div>
              </form>
            </AnimatedDiv>
          )}



        </div>
      </div>
    </AnimatedDiv>
  );
}
