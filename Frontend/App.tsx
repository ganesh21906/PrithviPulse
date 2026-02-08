import React, { useState, useRef } from 'react';
import './index.css';
import { LOCALES, MOCK_WEATHER, MOCK_MARKET_DATA, MOCK_NOTIFICATIONS } from './constants';
import { Language, ViewState, DiagnosisResult } from './types';
import { analyzeLeafImage } from './services/geminiService';
import { analyzeLeafImageBackend } from './services/backendService';
import { LanguageSelector } from './components/LanguageSelector';
import { MobileNavigation, DesktopSidebar } from './components/Navigation';
import { WeatherCard, AlertsCard, ActionCard } from './components/DashboardCards';
import { MarketView } from './components/MarketView';
import { CropCalendar } from './components/CropCalendar';
import { MyCropStatusCard } from './components/MyCropStatusCard';
import { MiniCalendarWidget } from './components/MiniCalendarWidget';
import { FarmMapWidget } from './components/FarmMapWidget';
import { ScanLine, Sprout, Bell, ChevronRight, Calendar } from 'lucide-react';
import { ScanResult } from './components/ScanResult';
import { ScanView } from './components/ScanView';
import { WeatherView } from './components/WeatherView';
import { CropCalendarView } from './components/CropCalendarView';
import { MyCropsView } from './components/MyCropsView';
import { FarmPlannerView } from './components/FarmPlannerView';
import { CropAdvisorView } from './components/CropAdvisorView';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.ENGLISH);
  const [view, setView] = useState<ViewState>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  
  // Data State
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const t = LOCALES[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- TTS Helper ---
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = { 'en': 'en-IN', 'hi': 'hi-IN', 'ta': 'ta-IN' };
    utterance.lang = langMap[lang] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // --- Image Handling ---
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setView('scan_result');
      setIsLoading(true);
      
      // USE BACKEND API INSTEAD OF GEMINI
      const result = await analyzeLeafImageBackend(file, lang);
      
      setDiagnosis(result);
      setIsLoading(false);

      if (result.healthy) {
        speak(`${t.healthy}.`);
      } else {
        speak(`${t.diseased}. ${result.diseaseName}.`);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Sub-Views ---

  const Dashboard = () => (
    <div className="space-y-6 animate-fade-in p-4 pb-24 md:pb-6">
      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* LEFT COLUMN: Weather & Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <button
            onClick={() => setView('weather')}
            className="w-full text-left transition-transform hover:-translate-y-0.5"
            aria-label={t.weatherTitle}
          >
            <WeatherCard data={MOCK_WEATHER} t={t} />
          </button>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.quickActions}</h3>
            <span className="text-xs text-gray-400">Smart & reliable</span>
          </div>
          
          <div className="space-y-3">
            <ActionCard 
              title={t.scanLeaf} 
              desc={t.scanDesc} 
              icon={<ScanLine size={24} />} 
              color="green" 
              onClick={() => setView('scan')} 
            />
            <ActionCard 
              title={t.navFarmPlanner} 
              desc="Build a full season plan" 
              icon={<Sprout size={24} />} 
              color="orange" 
              onClick={() => setView('farm_planner')} 
            />
            <ActionCard 
              title={t.smartAdvisory} 
              desc="Financial plan & precision timeline" 
              icon={<Sprout size={24} />} 
              color="green" 
              onClick={() => setView('crop_advisor')} 
            />
            <ActionCard 
              title="My Timeline" 
              desc="Track your crops" 
              icon={<Sprout size={24} />} 
              color="blue" 
              onClick={() => setView('live_calendar')} 
            />
          </div>
        </div>

        {/* MIDDLE COLUMN: My Crop Status + Farm Map */}
        <div className="lg:col-span-1 space-y-4">
          <MyCropStatusCard onViewTimeline={() => setView('live_calendar')} />
          <FarmMapWidget />
        </div>

        {/* RIGHT COLUMN: Mini Calendar & Alerts */}
        <div className="lg:col-span-1 space-y-4">
          <MiniCalendarWidget />
          <AlertsCard alerts={MOCK_NOTIFICATIONS} t={t} />
        </div>
      </div>

      {/* Market Prices Row (Full Width) */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.marketPrices}</h3>
        <MarketView items={MOCK_MARKET_DATA} t={t} />
      </div>
    </div>
  );

  const CropsDashboard = () => (
    <div className="space-y-4 animate-fade-in">
      <MyCropsView onViewTimeline={() => setView('live_calendar')} />
      
      <div className="p-4">
        <button 
          onClick={() => setView('crop_advisor')}
          className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition-transform card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <Sprout size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800 text-lg">{t.smartAdvisory}</h3>
              <p className="text-gray-500 text-xs">Smart financial & risk plan</p>
            </div>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-orange-500 transition-colors" />
        </button>
      </div>
    </div>
  );

  const ScanView = () => (
    <div className="p-4 flex flex-col h-[80vh] items-center justify-center text-center animate-fade-in">
      <div className="bg-green-50 p-8 rounded-full mb-6 relative animate-pulse">
        <ScanLine size={64} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.scanLeaf}</h2>
      <p className="text-gray-500 mb-8 max-w-xs">{t.scanDesc}</p>
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="bg-green-600 text-white w-full max-w-sm py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
      >
        <ScanLine /> {t.takePhoto}
      </button>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        onChange={handleImageUpload}
      />
    </div>
  );

  const ResultView = () => (
    <div className="p-4 pb-24 animate-slide-up">
      <button onClick={() => { setView('scan'); setDiagnosis(null); setSelectedImage(null); }} className="mb-4 text-green-700 font-bold flex items-center gap-2">
        ← {t.back}
      </button>

      {selectedImage && (
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6 border-4 border-white">
          <img src={selectedImage} alt="Scanned Leaf" className="w-full h-64 object-cover" />
          {isLoading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
              <p className="font-semibold animate-pulse">{t.analyzing}</p>
            </div>
          )}
        </div>
      )}

      {!isLoading && diagnosis && (
        <div className="space-y-4">
          <div className={`p-6 rounded-2xl text-white shadow-lg ${diagnosis.healthy ? 'bg-green-600' : 'bg-red-500'}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{diagnosis.healthy ? '🌿' : '⚠️'}</span>
              <h2 className="text-2xl font-bold">
                {diagnosis.healthy ? t.healthy : t.diseased}
              </h2>
            </div>
            {!diagnosis.healthy && (
              <p className="text-white/90 font-medium text-lg mt-1">
                {diagnosis.localName || diagnosis.diseaseName}
              </p>
            )}
            <div className="mt-2 text-xs bg-black/20 inline-block px-2 py-1 rounded">
              Confidence: {Math.round(diagnosis.confidence * 100)}%
            </div>
            <button onClick={() => speak(diagnosis.healthy ? t.healthy : `${t.diseased}. ${diagnosis.localName || diagnosis.diseaseName}`)} className="mt-4 bg-white/20 p-2 rounded-full w-full flex items-center justify-center gap-2 hover:bg-white/30">
               🔊 {t.listen}
            </button>
          </div>

          {!diagnosis.healthy && (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-green-800 text-lg mb-3 flex items-center gap-2">
                  💊 {t.treatment}
                </h3>
                <ul className="space-y-3">
                  {diagnosis.treatment.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700">
                      <span className="bg-green-100 text-green-700 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-blue-800 text-lg mb-3 flex items-center gap-2">
                  🛡️ {t.prevention}
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  {diagnosis.preventativeMeasures.map((measure, idx) => (
                    <li key={idx}>{measure}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

  const ProfileView = () => (
    <div className="p-4 animate-fade-in space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
          👨‍🌾
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Ramesh Kumar</h2>
        <p className="text-gray-500">Nashik, Maharashtra</p>
        <div className="mt-4 flex justify-center gap-2">
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Small Farmer</span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Organic</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">{t.myDetails}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-bold uppercase">Phone</label>
            <p className="font-medium">+91 98765 43210</p>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-bold uppercase">Land Size</label>
            <p className="font-medium">2.5 Acres</p>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-bold uppercase">Primary Crops</label>
            <p className="font-medium">Tomato, Wheat</p>
          </div>
        </div>
        <button className="w-full mt-6 border border-green-600 text-green-600 py-3 rounded-xl font-bold hover:bg-green-50">
          Edit Profile
        </button>
      </div>
    </div>
  );

  // --- Main Layout Render ---
  return (
    <div className="min-h-screen bg-[#f0fdf4] font-sans flex text-gray-900">
      {/* Sidebar for Desktop */}
      <DesktopSidebar currentView={view} onChange={setView} t={t} />

      <div className="flex-1 flex flex-col w-full relative">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 px-3 py-2 md:px-4 md:py-3 border-b border-green-100 flex justify-between items-center gap-2 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="bg-white p-1 rounded-full shadow-md flex-shrink-0">
              <img
                src="/logo.png"
                alt="PrithviPulse logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="truncate">
              <h1 className="text-base md:text-lg font-bold text-green-900 leading-none truncate">{t.appTitle}</h1>
              <p className="text-[10px] md:text-xs text-green-600 font-bold mt-0.5 truncate opacity-90">{t.greeting}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
             <button 
               className="p-2.5 text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-full relative transition-colors"
               aria-label="Notifications"
             >
               <Bell size={22} />
               <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <LanguageSelector current={lang} onChange={setLang} />
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 pb-20 md:pb-6">
          {view === 'dashboard' && <Dashboard />}
          {view === 'weather' && (
            <div className="p-4 pb-24 animate-fade-in">
              <button
                onClick={() => setView('dashboard')}
                className="mb-4 text-green-700 font-bold flex items-center gap-2"
              >
                ← {t.back}
              </button>
              <WeatherView />
            </div>
          )}
          {view === 'live_calendar' && (
            <div className="p-4 pb-24 animate-fade-in">
              <button
                onClick={() => setView('dashboard')}
                className="mb-4 text-green-700 font-bold flex items-center gap-2"
              >
                ← {t.back}
              </button>
              <CropCalendarView />
            </div>
          )}
          {view === 'scan' && (
            <ScanView 
              onBack={() => {
                setView('dashboard');
                setDiagnosis(null);
                setSelectedImage(null);
              }}
            />
          )}
          {view === 'scan_result' && (
            <ScanResult
              diagnosis={diagnosis}
              selectedImage={selectedImage}
              t={t}
              onBack={() => {
                setView('dashboard');
                setDiagnosis(null);
                setSelectedImage(null);
              }}
            />
          )}
          {view === 'crops' && <CropsDashboard />}
          {view === 'crop_advisor' && <CropAdvisorView />}
          {view === 'farm_planner' && <FarmPlannerView />}
          {view === 'crop_calendar' && <CropCalendar t={t} onBack={() => setView('dashboard')} />}
          {view === 'market' && <MarketView items={MOCK_MARKET_DATA} t={t} />}
          {view === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation currentView={view} onChange={setView} t={t} />

      {/* Styles */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
};

export default App;