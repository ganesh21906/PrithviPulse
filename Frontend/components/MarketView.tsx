import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, ChevronDown, ChevronUp, AlertCircle, Loader } from 'lucide-react';
import { MarketCrop, MarketTrendsResponse, getMarketTrendsBackend } from '../services/backendService';
import { getSmartImage } from '../utils/SmartImageMapper';
import { Translation } from '../types';

interface Props {
  t: Translation;
}

type Region = 'Nashik, Maharashtra' | 'Punjab' | 'Andhra Pradesh' | 'Karnataka' | 'Coimbatore, Tamil Nadu';

const REGIONS: Region[] = ['Nashik, Maharashtra', 'Punjab', 'Andhra Pradesh', 'Karnataka', 'Coimbatore, Tamil Nadu'];

const MARKET_NEWS = [
  '🌾 Wheat procurement reaches record high',
  '📈 Tomato prices surge due to seasonal demand',
  '🚜 New MSP announced for Kharif crops',
  '💰 Cotton exports up 15% this quarter',
  '🌱 Organic farming subsidies increased',
  '🌧️ Monsoon forecast positive for farming',
  '📊 Soybean futures trading near 5-month high',
  '🏪 Government food grain storage at record levels',
];

export const MarketView: React.FC<Props> = ({ t }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>('Nashik, Maharashtra');
  const [marketData, setMarketData] = useState<MarketTrendsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);

  // Fetch market trends when region changes
  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        const data = await getMarketTrendsBackend(selectedRegion);
        setMarketData(data);
      } catch (err) {
        console.error('Failed to fetch market trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [selectedRegion]);

  // Rotate news every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % MARKET_NEWS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (cropId: string) => {
    setExpandedCrop(expandedCrop === cropId ? null : cropId);
  };

  if (!marketData && loading) {
    return (
      <div className="space-y-4 animate-fade-in p-4 pb-24">
        <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 p-6 rounded-3xl text-white shadow-lg flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3">
            <Loader size={32} className="animate-spin" />
            <p className="font-bold">Loading market data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className="space-y-4 animate-fade-in p-4 pb-24">
        <div className="bg-red-50 rounded-2xl p-5 border-2 border-red-200">
          <p className="text-red-800 font-semibold">Unable to load market data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in p-4 pb-24">
      {/* Header with Region Selector */}
      <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 p-6 rounded-3xl text-white shadow-lg overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Title and Region Selector */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">🌾 Mandi Prices</h2>
              <p className="text-white/80 text-sm">AI-Powered Market Intelligence</p>
            </div>

            {/* Region Dropdown */}
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value as Region);
                  setExpandedCrop(null);
                }}
                disabled={loading}
                className="appearance-none bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white font-bold text-sm rounded-xl px-4 py-2 pr-8 cursor-pointer hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
              >
                {REGIONS.map((region) => (
                  <option key={region} value={region} className="text-gray-800">
                    📍 {region}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
            </div>
          </div>

          {/* Live Status */}
          <div className="flex items-center gap-2 text-xs text-white/70">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Updated {marketData.last_updated}</span>
          </div>
        </div>
      </div>

      {/* AI Market Insight Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">💡</div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider mb-1">
              Gemini Market Insight
            </h3>
            <p className="text-sm text-amber-800 leading-relaxed font-medium">
              {marketData.analyst_note}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-xs font-bold">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  marketData.market_status === 'Bullish'
                    ? 'bg-green-600'
                    : marketData.market_status === 'Bearish'
                    ? 'bg-red-600'
                    : 'bg-yellow-600'
                }`}
              />
              <span className={
                marketData.market_status === 'Bullish'
                  ? 'text-green-700'
                  : marketData.market_status === 'Bearish'
                  ? 'text-red-700'
                  : 'text-yellow-700'
              }>
                Market: {marketData.market_status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Market News Ticker */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="text-xl flex-shrink-0 animate-bounce">📰</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-blue-900 animate-pulse">
              {MARKET_NEWS[newsIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Market Status Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Best to Sell */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-200">
          <h4 className="text-xs font-black text-green-900 uppercase tracking-wider mb-2">Best to Sell</h4>
          {marketData.crops.filter(c => c.trend === 'up').length > 0 ? (
            <>
              <p className="text-lg font-black text-green-900">
                {marketData.crops.find(c => c.trend === 'up')?.name.split('(')[0]}
              </p>
              <p className="text-xs text-green-700 mt-1 font-semibold">
                ↗ {marketData.crops.find(c => c.trend === 'up')?.change}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600">No rising crops</p>
          )}
        </div>

        {/* Highest Price */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-200">
          <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider mb-2">Highest Price</h4>
          {marketData.crops.length > 0 && (
            <>
              <p className="text-lg font-black text-purple-900">
                ₹{Math.max(...marketData.crops.map(c => c.price))}
              </p>
              <p className="text-xs text-purple-700 mt-1 font-semibold">
                {marketData.crops.find(c => c.price === Math.max(...marketData.crops.map(c => c.price)))?.name.split('(')[0]}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Crop Prices List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} />
            Current Prices ({marketData.crops.length} Crops)
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {marketData.crops.map((crop) => {
            const isExpanded = expandedCrop === crop.id;
            const cropImage = getSmartImage(crop.name);
            const trendColor =
              crop.trend === 'up'
                ? 'text-green-600'
                : crop.trend === 'down'
                ? 'text-red-600'
                : 'text-gray-600';
            const trendBg =
              crop.trend === 'up'
                ? 'bg-green-50'
                : crop.trend === 'down'
                ? 'bg-red-50'
                : 'bg-gray-50';

            return (
              <div
                key={crop.id}
                className={`transition-colors ${isExpanded ? 'bg-green-50' : 'hover:bg-gray-50'}`}
              >
                {/* Main Row - Clickable */}
                <button
                  onClick={() => toggleExpand(crop.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  {/* Crop Info */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Crop Image */}
                    <img
                      src={cropImage}
                      alt={crop.name}
                      className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-200 flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = getSmartImage('farming');
                      }}
                    />

                    {/* Crop Name & Note */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm">{crop.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{crop.market_note}</p>
                    </div>
                  </div>

                  {/* Price & Trend */}
                  <div className="flex items-center gap-4 ml-3">
                    <div className="text-right">
                      <p className="font-black text-lg text-gray-900">₹{crop.price}</p>
                      <p className="text-xs text-gray-500">{crop.unit}</p>
                    </div>

                    {/* Trend Indicator */}
                    <div className={`flex flex-col items-center gap-1 ${trendColor} font-bold`}>
                      {crop.trend === 'up' ? (
                        <ArrowUpRight size={20} />
                      ) : crop.trend === 'down' ? (
                        <ArrowDownRight size={20} />
                      ) : (
                        <Minus size={20} />
                      )}
                      <span className="text-xs">{crop.change}%</span>
                    </div>

                    {/* Expand Icon */}
                    {isExpanded ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={`border-t border-gray-100 p-4 space-y-3 ${trendBg} animate-fade-in`}>
                    {/* Forecast */}
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                        📊 Price Forecast
                      </p>
                      <p className="text-sm font-semibold text-gray-800">{crop.forecast}</p>
                    </div>

                    {/* Market Note */}
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                        📝 Market Note
                      </p>
                      <p className="text-sm text-gray-700">{crop.market_note}</p>
                    </div>

                    {/* Action */}
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-2">
                      <TrendingUp size={16} />
                      View More Details
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 italic">
            💾 Prices updated every 2 hours | Data from regional Mandis | Powered by Gemini 3 Analysis
          </p>
        </div>
      </div>

      {/* Information Cards */}
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-blue-900 uppercase tracking-wider mb-1">
              💡 Farmer's Tip
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              Use the expandable crop cards to view detailed market forecasts. Green arrows indicate rising prices (good time to sell), red arrows show falling prices (stock up for next season).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
