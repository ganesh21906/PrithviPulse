import React from 'react';
import { CloudRain, Sun, Wind, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { WeatherData, Notification, Translation } from '../types';

export const WeatherCard: React.FC<{ data: WeatherData; t: Translation }> = ({ data, t }) => (
  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5 text-white shadow-blue-lg relative overflow-hidden ring-1 ring-white/10 card-hover">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <h2 className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">{t.weatherTitle}</h2>
        <div className="flex items-center gap-2">
          <span className="text-4xl font-black">{data.temp}°</span>
          <div className="flex flex-col text-xs font-medium text-blue-100">
            <span>{data.condition}</span>
            <span>H: {data.humidity}%</span>
          </div>
        </div>
        <div className="mt-2 inline-flex items-center gap-2 text-[10px] text-blue-100/90 bg-white/15 px-2 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          Reliable forecast • {data.updatedAt ?? 'Updated recently'}
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-sm">{data.location}</p>
        <div className="flex items-center justify-end gap-1 mt-1 text-xs text-blue-100">
          <Wind size={12} /> {data.windSpeed} km/h
        </div>
      </div>
    </div>
    
    <div className="mt-6 flex justify-between gap-2">
      {data.forecast.map((day, idx) => (
        <div key={idx} className="flex flex-col items-center bg-white/20 rounded-xl p-2 min-w-[60px] backdrop-blur-sm">
          <span className="text-xs font-medium text-blue-50">{day.day}</span>
          <span className="text-lg my-1">{day.icon}</span>
          <span className="text-sm font-bold">{day.temp}°</span>
        </div>
      ))}
    </div>
  </div>
);

export const AlertsCard: React.FC<{ alerts: Notification[]; t: Translation }> = ({ alerts, t }) => (
  <div className="bg-white rounded-3xl p-5 shadow-green border border-gray-100 card-hover">
    <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
      <AlertTriangle size={18} className="text-orange-500" />
      {t.alertsTitle}
    </h3>
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div key={alert.id} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${alert.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 leading-tight">{alert.title}</h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{alert.message}</p>
            <span className="text-[10px] text-gray-400 mt-1 block">{alert.time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ActionCard: React.FC<{ 
  title: string; 
  desc: string; 
  icon: React.ReactNode; 
  color: string; 
  onClick: () => void 
}> = ({ title, desc, icon, color, onClick }) => {
  const colorStyles: Record<string, { bgIcon: string, textIcon: string, bgCard: string, shadowClass: string }> = {
    green: {
      bgIcon: 'bg-green-100',
      textIcon: 'text-green-600',
      bgCard: 'from-white to-green-50',
      shadowClass: 'shadow-green'
    },
    orange: {
      bgIcon: 'bg-orange-100',
      textIcon: 'text-orange-600',
      bgCard: 'from-white to-orange-50',
      shadowClass: 'shadow-orange'
    },
    blue: {
      bgIcon: 'bg-blue-100',
      textIcon: 'text-blue-600',
      bgCard: 'from-white to-blue-50',
      shadowClass: 'shadow-blue'
    }
  };

  const style = colorStyles[color] || colorStyles.green;

  return (
    <button 
      onClick={onClick}
      className={`w-full p-5 rounded-2xl ${style.shadowClass} border border-gray-100 text-left transition-all active:scale-95 bg-gradient-to-br ${style.bgCard} hover:-translate-y-1 card-hover`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${style.bgIcon} ${style.textIcon}`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </button>
  );
};