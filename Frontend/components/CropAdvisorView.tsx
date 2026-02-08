import React, { useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Sprout, Coins, Loader } from 'lucide-react';
import { getSmartPlanBackend, SmartPlanResponse } from '../services/backendService';
import { getSmartImage, preloadSmartImages } from '../utils/SmartImageMapper';

const SOIL_TYPES = ['Black', 'Red', 'Alluvial', 'Clay', 'Loamy'];
const WATER_SOURCES = ['Borewell', 'Canal', 'Rainfed', 'Drip'];
const SEASONS = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'];
const SOWING_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type OptionCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

const OptionCard: React.FC<OptionCardProps> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full px-4 py-3 rounded-xl border text-sm font-bold transition-all duration-200 ${
      selected
        ? 'bg-green-700 text-white border-green-700'
        : 'bg-white border-gray-200 text-gray-700'
    }`}
  >
    {label}
  </button>
);

export const CropAdvisorView: React.FC = () => {
  const [soilType, setSoilType] = useState('');
  const [landSize, setLandSize] = useState('');
  const [budget, setBudget] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [season, setSeason] = useState('');
  const [sowingMonth, setSowingMonth] = useState<string>(SOWING_MONTHS[new Date().getMonth()]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<SmartPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canGenerate =
    !!soilType && !!waterSource && !!season && !!sowingMonth && !!landSize && !!budget;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const result = await getSmartPlanBackend({
        soil_type: soilType,
        land_size: landSize,
        budget,
        water_source: waterSource,
        season,
        sowing_month: sowingMonth,
      });
      setPlan(result);
      
      if (result.timeline_weeks) {
        preloadSmartImages(result.timeline_weeks.map(step => step.action));
      }
    } catch (err) {
      setError('Unable to generate smart plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      {!plan && (
        <form onSubmit={handleGenerate} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-2xl font-black text-gray-800">Smart Farm Strategy Engine</h2>
          <p className="text-sm text-gray-500">Precision planning with finance, risk, and timeline</p>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Soil Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SOIL_TYPES.map((type) => (
                <OptionCard
                  key={type}
                  label={type}
                  selected={soilType === type}
                  onClick={() => setSoilType(type)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Water Source</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {WATER_SOURCES.map((source) => (
                <OptionCard
                  key={source}
                  label={source}
                  selected={waterSource === source}
                  onClick={() => setWaterSource(source)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Season</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SEASONS.map((seasonLabel) => (
                <OptionCard
                  key={seasonLabel}
                  label={seasonLabel}
                  selected={season === seasonLabel}
                  onClick={() => setSeason(seasonLabel)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Planned Sowing Month</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SOWING_MONTHS.map((month) => (
                <OptionCard
                  key={month}
                  label={month}
                  selected={sowingMonth === month}
                  onClick={() => setSowingMonth(month)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Land Size</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                <input
                  type="number"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  placeholder="2"
                  className="w-full p-3 outline-none"
                />
                <span className="px-3 text-sm font-bold text-gray-500 bg-gray-50">Acres</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Budget</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                <span className="px-3 text-sm font-bold text-gray-500 bg-gray-50">₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="50000"
                  className="w-full p-3 outline-none"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !canGenerate}
            className="w-full bg-gradient-to-r from-green-700 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader size={18} className="animate-spin" />
                Generating plan...
              </span>
            ) : (
              'Generate Smart Plan'
            )}
          </button>
        </form>
      )}

      {plan && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-gray-800">🤖 Smart Plan</h2>
              <button
                onClick={() => {
                  setPlan(null);
                  setSoilType('');
                  setSeason('');
                }}
                className="text-orange-600 text-sm font-bold hover:text-orange-700"
              >
                New Plan
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{soilType} • {season} • {sowingMonth}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900 to-emerald-700 text-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xs uppercase tracking-wider text-green-200 mb-2">Net Profit</h3>
            <p className="text-3xl font-black">{plan.summary.net_profit}</p>
            <p className="text-lg font-bold mt-1">ROI: {plan.summary.roi}</p>
            <p className="text-sm text-green-100 mt-2">Estimated earnings: {plan.summary.net_profit}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h4 className="text-sm font-black text-gray-700 mb-4 flex items-center gap-2">
                <Coins size={16} className="text-green-600" />
                Financial Breakdown
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={plan.financial_breakdown}>
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="percent" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-5 border border-orange-200">
              <h4 className="text-sm font-black text-orange-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} />
                Risk Alert
              </h4>
              <p className="text-sm font-bold text-red-900">{plan.risk_analysis.primary_risk}</p>
              <p className="text-sm text-orange-800 mt-2">{plan.risk_analysis.mitigation}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h4 className="text-sm font-black text-gray-700 mb-4 flex items-center gap-2">
              <Sprout size={16} className="text-green-600" />
              Timeline
            </h4>

            <div className="space-y-4 border-l-2 border-green-200 pl-4">
              {plan.timeline_weeks.map((step, idx) => (
                <div key={idx} className="relative flex gap-4">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                  <img
                    src={getSmartImage(step.action)}
                    alt={step.action}
                    className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = getSmartImage('farming');
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-500 uppercase">{step.phase}</p>
                    <p className="text-sm font-black text-gray-800">{step.action}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Crop:</strong> {plan.summary.crop_name}</p>
            <p><strong>Suitability:</strong> {plan.summary.suitability_score}</p>
            <p><strong>Revenue:</strong> {plan.summary.expected_revenue}</p>
            <p><strong>Duration:</strong> {plan.summary.duration}</p>
          </div>
        </div>
      )}
    </div>
  );
};
