import React, { useState } from 'react';
import { Sprout, Droplets, Coins, ArrowRight, Loader, Package, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { getExecutionPlanBackend, ExecutionPlanResponse } from '../services/backendService';
import { getSmartImage, preloadSmartImages } from '../utils/SmartImageMapper';

const POPULAR_CROPS = [
  'Rice', 'Wheat', 'Tomato', 'Potato', 'Onion', 
  'Corn', 'Cotton', 'Soybean', 'Chilli', 'Sugarcane'
];

const SOIL_TYPES = ['Black', 'Red', 'Alluvial', 'Clay', 'Sandy', 'Loamy'];
const WATER_SOURCES = ['Borewell', 'Canal', 'Rainfed', 'Drip'];

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

export const FarmPlannerView: React.FC = () => {
  const [step, setStep] = useState(1);
  
  // Step 1: Target
  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  
  // Step 2: Context
  const [landSize, setLandSize] = useState('');
  const [soilType, setSoilType] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ExecutionPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canProceedStep1 = !!cropName;
  const canProceedStep2 = !!landSize && !!soilType && !!waterSource && !!sowingDate;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const result = await getExecutionPlanBackend({
        crop_name: cropName,
        variety: variety || undefined,
        land_size: landSize,
        soil_type: soilType,
        water_source: waterSource,
        sowing_date: sowingDate,
      });
      setPlan(result);
      
      // Preload timeline images
      if (result.critical_timeline) {
        preloadSmartImages(result.critical_timeline.map(t => t.action));
      }
    } catch (err) {
      setError('Unable to generate execution plan. Please try again.');
      console.error('Execution plan error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setCropName('');
    setVariety('');
    setLandSize('');
    setSoilType('');
    setWaterSource('');
    setSowingDate('');
    setPlan(null);
    setError(null);
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      {!plan && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-800">Precision Farm Planner</h2>
              <p className="text-sm text-gray-500">Scientific execution manual for your chosen crop</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-500">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>1</span>
              <span className="w-6 h-px bg-gray-300" />
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>2</span>
              <span className="w-6 h-px bg-gray-300" />
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>3</span>
            </div>
          </div>

          {/* Step 1: The Target */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-gray-700 font-bold">
                <Sprout size={18} />
                <span>Step 1: Choose Your Crop</span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Crop Name</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {POPULAR_CROPS.map((crop) => (
                    <OptionCard
                      key={crop}
                      label={crop}
                      selected={cropName === crop}
                      onClick={() => setCropName(crop)}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="Or type custom crop name..."
                  className="w-full mt-3 p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Variety (Optional)</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g., Basmati 370, Pusa Ruby (Gemini will suggest if blank)"
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: The Context */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-gray-700 font-bold">
                <Droplets size={18} />
                <span>Step 2: Farm Context</span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Land Size</label>
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
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Soil Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SOIL_TYPES.map((soil) => (
                    <OptionCard
                      key={soil}
                      label={soil}
                      selected={soilType === soil}
                      onClick={() => setSoilType(soil)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Water Source</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {WATER_SOURCES.map((water) => (
                    <OptionCard
                      key={water}
                      label={water}
                      selected={waterSource === water}
                      onClick={() => setWaterSource(water)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Planned Sowing Date</label>
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-gray-700 font-bold">
                <CheckCircle size={18} />
                <span>Step 3: Review & Generate</span>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
                <h3 className="text-sm font-black text-green-900 uppercase tracking-wider mb-3">Your Inputs</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-green-700 font-semibold">Crop:</span>
                    <p className="text-green-900 font-bold">{cropName} {variety && `(${variety})`}</p>
                  </div>
                  <div>
                    <span className="text-green-700 font-semibold">Land:</span>
                    <p className="text-green-900 font-bold">{landSize} Acres</p>
                  </div>
                  <div>
                    <span className="text-green-700 font-semibold">Soil:</span>
                    <p className="text-green-900 font-bold">{soilType}</p>
                  </div>
                  <div>
                    <span className="text-green-700 font-semibold">Water:</span>
                    <p className="text-green-900 font-bold">{waterSource}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-green-700 font-semibold">Sowing Date:</span>
                    <p className="text-green-900 font-bold">{new Date(sowingDate).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-800 text-sm">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {step < 3 && (
              <button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
                className="px-6 py-2 rounded-xl bg-green-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next <ArrowRight size={16} />
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Generating Protocol...
                  </>
                ) : (
                  <>
                    <Sprout size={20} />
                    Generate Execution Plan
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
      {/* Results: Protocol Dashboard */}
      {plan && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-gray-800">🎯 Execution Protocol: {cropName}</h2>
              <button
                onClick={resetWizard}
                className="text-orange-600 text-sm font-bold hover:text-orange-700"
              >
                New Plan
              </button>
            </div>
            <p className="text-sm text-gray-600">Scientific manual generated by Gemini 3</p>
          </div>

          {/* Yield Potential Gauge */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-3">Yield Forecast</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-blue-900">{plan.yield_forecast.potential_percentage}%</span>
                  <span className="text-sm font-semibold text-blue-700">Potential</span>
                </div>
                <p className="text-sm text-blue-800 font-bold">Estimated Output: {plan.yield_forecast.estimated_output}</p>
              </div>
              <div className="w-24 h-24 rounded-full border-8 border-blue-300 flex items-center justify-center bg-white">
                <span className="text-2xl font-black text-blue-900">{plan.yield_forecast.potential_percentage}%</span>
              </div>
            </div>
            {plan.yield_forecast.limiting_factor && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-900 font-medium">{plan.yield_forecast.limiting_factor}</p>
                </div>
              </div>
            )}
          </div>

          {/* Input Requirements Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Package size={16} />
                Input Requirements (Shopping List)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-black text-gray-700 uppercase">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-black text-gray-700 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-black text-gray-700 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {plan.input_requirements.map((input, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-gray-800">{input.item}</td>
                      <td className="px-4 py-3 text-sm font-black text-green-700">{input.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{input.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 p-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 italic">💡 Screenshot this table and take it to your local shop</p>
            </div>
          </div>

          {/* Critical Timeline */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-green-600" />
              Critical Timeline
            </h3>

            <div className="space-y-4 border-l-2 border-green-200 pl-4">
              {plan.critical_timeline.map((event, idx) => (
                <div key={idx} className="relative flex gap-4">
                  {/* Timeline Node */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                  
                  {/* Image */}
                  <img
                    src={getSmartImage(event.action)}
                    alt={event.action}
                    className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = getSmartImage('farming');
                    }}
                  />
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-500 uppercase">{event.day}</p>
                    <p className="text-sm font-black text-gray-800">{event.action}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Tip */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🎯</span>
              <div>
                <h4 className="text-sm font-black text-purple-900 uppercase tracking-wider mb-1">
                  Precision Execution Mode
                </h4>
                <p className="text-sm text-purple-800 leading-relaxed">
                  This plan is calculated specifically for {landSize} acres of {cropName} on {soilType} soil. 
                  Follow the timeline strictly for maximum yield. All quantities are scientifically calculated by Gemini 3.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
