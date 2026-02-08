import React from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets } from 'lucide-react';

const weather = {
  location: 'Coimbatore, India',
  temp: 28,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  rainChance: 70,
  feelsLike: 31,
  updatedAt: 'Today, 9:30 AM'
};

const forecast = [
  { day: 'Mon', temp: 29, condition: 'Sunny', icon: Sun },
  { day: 'Tue', temp: 28, condition: 'Cloudy', icon: Cloud },
  { day: 'Wed', temp: 27, condition: 'Rain', icon: CloudRain },
  { day: 'Thu', temp: 30, condition: 'Sunny', icon: Sun },
  { day: 'Fri', temp: 28, condition: 'Cloudy', icon: Cloud }
];

const getAdvisories = () => {
  const items: string[] = [];

  if (weather.rainChance >= 60) {
    items.push('High chance of rain: avoid pesticide spraying today and ensure proper drainage.');
  }

  if (weather.temp >= 32 || weather.feelsLike >= 32) {
    items.push('High heat expected: irrigate in the evening to reduce water loss.');
  }

  if (weather.humidity >= 70) {
    items.push('High humidity: monitor for fungal diseases and improve airflow between plants.');
  }

  if (weather.windSpeed >= 18) {
    items.push('Windy conditions: secure young plants and avoid foliar spraying.');
  }

  if (items.length === 0) {
    items.push('Stable conditions: good day for fieldwork and routine crop inspection.');
  }

  return items;
};

export const WeatherView: React.FC = () => {
  const advisories = getAdvisories();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div>
            <p className="text-sm font-semibold text-blue-100">Current Weather</p>
            <h2 className="text-2xl font-bold mt-1">{weather.location}</h2>
            <p className="text-xs text-blue-100 mt-1">Updated: {weather.updatedAt}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl">
            <Cloud size={28} />
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-6">
          <div>
            <div className="text-5xl font-extrabold tracking-tight">{weather.temp}°C</div>
            <p className="text-blue-100 text-sm mt-1">Feels like {weather.feelsLike}°C • {weather.condition}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-blue-100">
              <Droplets size={16} /> Humidity: {weather.humidity}%
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Wind size={16} /> Wind: {weather.windSpeed} km/h
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <CloudRain size={16} /> Rain Chance: {weather.rainChance}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase">
            <Sun size={14} /> UV & Heat
          </div>
          <div className="text-2xl font-bold text-gray-800 mt-2">Moderate</div>
          <p className="text-xs text-gray-500 mt-1">Limit midday field work</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase">
            <CloudRain size={14} /> Rain Outlook
          </div>
          <div className="text-2xl font-bold text-gray-800 mt-2">High</div>
          <p className="text-xs text-gray-500 mt-1">Reschedule spraying</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase">
            <Droplets size={14} /> Humidity
          </div>
          <div className="text-2xl font-bold text-gray-800 mt-2">{weather.humidity}%</div>
          <p className="text-xs text-gray-500 mt-1">Watch for leaf spots</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase">
            <Wind size={14} /> Wind
          </div>
          <div className="text-2xl font-bold text-gray-800 mt-2">{weather.windSpeed} km/h</div>
          <p className="text-xs text-gray-500 mt-1">Low drift risk</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-bold mb-4">5-Day Forecast</h3>
        <div className="flex justify-between gap-3">
          {forecast.map((day) => {
            const Icon = day.icon;
            return (
              <div key={day.day} className="flex-1 bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
                <p className="text-xs font-semibold text-gray-500">{day.day}</p>
                <div className="my-2 flex justify-center text-blue-500">
                  <Icon size={20} />
                </div>
                <p className="text-sm font-bold text-gray-800">{day.temp}°C</p>
                <p className="text-[10px] text-gray-500 mt-1">{day.condition}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-5 border border-green-100">
        <h3 className="text-green-800 font-bold text-lg mb-3">Farmer&apos;s Advisory</h3>
        <ul className="space-y-2 text-sm text-green-900">
          {advisories.map((item, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-green-600">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
