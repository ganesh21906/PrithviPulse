import React from 'react';
import { Home, ScanLine, Sprout, TrendingUp, User, Calendar, CalendarClock, Lightbulb } from 'lucide-react';
import { ViewState, Language, Translation } from '../types';

interface Props {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
  t: Translation;
}

export const MobileNavigation: React.FC<Props> = ({ currentView, onChange, t }) => {
  const navItems = [
    { id: 'dashboard', label: t.navHome, icon: Home },
    { id: 'crops', label: t.navCrops, icon: Sprout },
    { id: 'crop_advisor', label: t.smartAdvisory, icon: Lightbulb },
    { id: 'farm_planner', label: t.navFarmPlanner, icon: Sprout },
    { id: 'crop_calendar', label: 'Crop Guide', icon: Calendar },
    { id: 'live_calendar', label: 'My Timeline', icon: CalendarClock },
    { id: 'scan', label: t.navScan, icon: ScanLine },
    { id: 'market', label: t.navMarket, icon: TrendingUp },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:hidden">
      <div className="flex justify-between items-end pb-2 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id || (item.id === 'scan' && (currentView === 'scan_result'));
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id as ViewState)}
              className={`flex flex-col items-center gap-1 min-w-[60px] flex-shrink-0 transition-all duration-300 ${
                isActive ? 'text-green-600 -translate-y-1' : 'text-gray-400'
              }`}
            >
              <div className={`p-2 rounded-full transition-all ${isActive ? 'bg-green-100 shadow-green' : 'bg-transparent'}`}>
                <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const DesktopSidebar: React.FC<Props> = ({ currentView, onChange, t }) => {
  const navItems = [
    { id: 'dashboard', label: t.navHome, icon: Home },
    { id: 'crops', label: t.navCrops, icon: Sprout },
    { id: 'crop_advisor', label: t.smartAdvisory, icon: Lightbulb },
    { id: 'farm_planner', label: t.navFarmPlanner, icon: Sprout },
    { id: 'crop_calendar', label: 'Crop Guide', icon: Calendar },
    { id: 'live_calendar', label: 'My Timeline', icon: CalendarClock },
    { id: 'scan', label: t.navScan, icon: ScanLine },
    { id: 'market', label: t.navMarket, icon: TrendingUp },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-green-800 via-green-900 to-green-950 h-screen sticky top-0 left-0 shadow-2xl border-r border-green-700/50">
      {/* Header */}
      <div className="p-6 border-b border-green-700/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white p-1.5 rounded-full shadow-lg">
            <img
              src="/logo.png"
              alt="PrithviPulse logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">PrithviPulse</h1>
            <p className="text-xs text-green-200 font-medium">AI Farm Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id || (item.id === 'scan' && currentView === 'scan_result');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id as ViewState)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-white/15 text-white shadow-lg shadow-white/10 border border-white/20' 
                  : 'text-green-100 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              <Icon size={20} className={`${isActive ? 'text-white' : 'text-green-200 group-hover:text-white'}`} />
              <span className="font-semibold text-sm flex-1 text-left">{item.label}</span>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Version Info */}
      <div className="border-t border-green-700/30 p-4">
        <p className="text-xs text-green-300 text-center font-medium">v1.0.0</p>
        <p className="text-[10px] text-green-400/60 text-center mt-1">Made with 🌾 for farmers</p>
      </div>
    </aside>
  );
};
