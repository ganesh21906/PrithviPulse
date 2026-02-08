import React, { useState } from 'react';
import { Filter, Calendar as CalendarIcon, Info, Sprout, Tractor, LayoutGrid, List, Cloud, Wind, Droplets } from 'lucide-react';
import { Translation, CropCalendarEntry } from '../types';
import { MOCK_ADVANCED_CALENDAR_DATA, MOCK_WEATHER } from '../constants';

interface Props {
  t: Translation;
  onBack: () => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Helper to get seasonal icon
const getMonthIcon = (index: number) => {
  if (index >= 5 && index <= 8) return '🌧️'; // Monsoon
  if (index >= 10 || index <= 1) return '❄️'; // Winter
  return '🌞'; // Summer
};

export const CropCalendar: React.FC<Props> = ({ t, onBack }) => {
  const [filterSeason, setFilterSeason] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [myCropsOnly, setMyCropsOnly] = useState<boolean>(false);
  const [selectedCrop, setSelectedCrop] = useState<CropCalendarEntry | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock "My Crops" IDs for the toggle feature
  const myCropIds = ['2', '4']; // Wheat, Tomato

  const filteredData = MOCK_ADVANCED_CALENDAR_DATA.filter(crop => {
    if (myCropsOnly && !myCropIds.includes(crop.id)) return false;
    if (filterSeason !== 'All' && crop.season !== filterSeason && crop.season !== 'All') return false;
    if (filterType !== 'All' && crop.type !== filterType) return false;
    return true;
  });

  return (
    <div className="animate-fade-in pb-24 h-full flex flex-col bg-slate-50 min-h-screen">
      {/* Top Navigation Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-green-700 font-bold flex items-center gap-2 text-sm hover:bg-green-50 px-2 py-1 rounded-lg transition-colors">
            ← {t.back}
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Crop Planting Guide</h2>
            <p className="text-xs text-gray-500">See when to plant different crops</p>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="bg-gray-100 p-1 rounded-lg flex items-center">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4">
        
        {/* Filters Panel */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar items-center">
              <span className="text-xs font-semibold uppercase tracking-wider mr-2 text-gray-600">Filters:</span>
              <select 
                value={filterSeason} 
                onChange={(e) => setFilterSeason(e.target.value)}
                className="text-sm rounded-lg block p-2 outline-none min-w-[110px] cursor-pointer bg-gray-50 border border-gray-200 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="All">{t.filterSeason}: All</option>
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>

              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm rounded-lg block p-2 outline-none min-w-[110px] cursor-pointer bg-gray-50 border border-gray-200 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="All">{t.filterType}: All</option>
                <option value="Cereal">Cereal</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Pulse">Pulse</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <button 
              onClick={() => setMyCropsOnly(!myCropsOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap border ${
                myCropsOnly 
                  ? 'bg-green-600 text-white border-green-600 shadow-md' 
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Filter size={16} />
              {t.myCropsOnly}
            </button>
          </div>
        </div>

        {/* Legend (Visual Guide) */}
        <div className="flex gap-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-emerald-600 border border-emerald-700"></div>
            <span className="text-xs font-medium text-gray-700">{t.sowing}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-amber-600 border border-amber-700"></div>
            <span className="text-xs font-medium text-gray-700">{t.harvest}</span>
          </div>
        </div>

        {/* --- PROFESSIONAL TABLE VIEW --- */}
        {viewMode === 'grid' ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col animate-fade-in">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full">
                {/* Table Header */}
                <thead className="bg-gradient-to-r from-green-700 to-green-600">
                  <tr>
                    <th className="sticky left-0 z-30 bg-gradient-to-r from-green-700 to-green-600 px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider shadow-[4px_0_8px_-2px_rgba(0,0,0,0.1)] min-w-[180px]">
                      Crop Name
                    </th>
                    {MONTHS.map((month, i) => (
                      <th key={i} className="px-3 py-3 text-center border-l border-green-500/30">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs opacity-70">{getMonthIcon(i)}</span>
                          <span className="text-xs font-semibold text-white uppercase tracking-wide">{month}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredData.map((crop, idx) => (
                    <tr 
                      key={crop.id} 
                      className={`hover:bg-green-50/50 transition-colors cursor-pointer ${selectedCrop?.id === crop.id ? 'bg-green-50/70' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                      onClick={() => setSelectedCrop(selectedCrop?.id === crop.id ? null : crop)}
                    >
                      {/* Sticky Crop Name Column */}
                      <td className={`sticky left-0 z-20 px-4 py-4 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)] ${selectedCrop?.id === crop.id ? 'bg-green-50/70' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-green-50/50 transition-colors`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-1 h-10 rounded-full transition-colors ${selectedCrop?.id === crop.id ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                          <div>
                            <h4 className={`font-semibold text-sm leading-tight transition-colors ${selectedCrop?.id === crop.id ? 'text-green-700' : 'text-gray-800'}`}>
                              {crop.crop}
                            </h4>
                            <span className="text-xs text-gray-500 mt-0.5 block font-medium">{crop.type}</span>
                          </div>
                        </div>
                      </td>

                      {/* Month Columns */}
                      {MONTHS.map((_, monthIndex) => {
                        const isSowing = crop.sowingMonths.includes(monthIndex);
                        const isHarvest = crop.harvestMonths.includes(monthIndex);
                        
                        return (
                          <td key={monthIndex} className="px-2 py-4 border-l border-gray-100/50 text-center align-middle">
                            <div className="flex items-center justify-center h-6">
                              {isSowing && (
                                <div className="w-full max-w-[40px] h-5 bg-emerald-600 rounded border border-emerald-700 shadow-sm"></div>
                              )}
                              {isHarvest && (
                                <div className="w-full max-w-[40px] h-5 bg-amber-600 rounded border border-amber-700 shadow-sm"></div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={13} className="p-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Filter size={48} className="mb-4 opacity-20" />
                          <p className="text-gray-600 mb-2">No crops match your filters.</p>
                          <button 
                            onClick={() => {setFilterSeason('All'); setFilterType('All'); setMyCropsOnly(false)}} 
                            className="mt-2 text-green-600 text-sm font-semibold hover:text-green-700 hover:underline"
                          >
                            Clear Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Weather Strip */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-t border-gray-200 p-4 flex items-center justify-between overflow-x-auto">
               <div className="flex items-center gap-3 text-gray-600 mr-8">
                  <Cloud size={20} className="text-blue-500" />
                  <span className="text-xs font-semibold uppercase whitespace-nowrap">Weather Forecast</span>
               </div>
               <div className="flex gap-6 min-w-max">
                 {MOCK_WEATHER.forecast.map((f, i) => (
                   <div key={i} className="flex items-center gap-2 text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                      <span className="text-xs text-gray-500 font-medium">{f.day}</span>
                      <span className="text-base">{f.icon}</span>
                      <span className="text-sm font-bold text-gray-800">{f.temp}°</span>
                   </div>
                 ))}
                 <div className="w-[1px] h-8 bg-gray-300 mx-2"></div>
                 <div className="flex items-center gap-2 text-gray-600 text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <Droplets size={14} className="text-blue-500" />
                    <span className="font-medium">Humidity: <span className="font-bold text-gray-800">{MOCK_WEATHER.humidity}%</span></span>
                 </div>
                 <div className="flex items-center gap-2 text-gray-600 text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <Wind size={14} className="text-gray-500" />
                    <span className="font-medium">Wind: <span className="font-bold text-gray-800">{MOCK_WEATHER.windSpeed} km/h</span></span>
                 </div>
               </div>
            </div>
          </div>
        ) : (
          /* --- LIST VIEW (Light Theme for Mobile) --- */
          <div className="space-y-4 animate-fade-in">
            {filteredData.map(crop => (
               <div key={crop.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.99] transition-transform" onClick={() => setSelectedCrop(crop)}>
                {/* List Item Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-inner">
                       <Sprout size={24} />
                     </div>
                     <div>
                       <h3 className="font-bold text-lg text-gray-800">{crop.crop}</h3>
                       <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{crop.type}</span>
                          <span>•</span>
                          <span>{crop.season}</span>
                       </div>
                     </div>
                  </div>
                  <div className="text-center">
                    <span className="block text-xl font-black text-gray-800">{crop.durationDays}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Days</span>
                  </div>
                </div>

                {/* Timeline Visualization for List */}
                <div className="relative h-3 bg-gray-100 rounded-full mt-6 mb-2 overflow-hidden">
                   {/* Grid lines */}
                   {[0,3,6,9].map(m => (
                      <div key={m} className="absolute top-0 bottom-0 w-[1px] bg-white z-10" style={{ left: `${(m/12)*100}%` }}></div>
                   ))}
                   
                   {/* Sowing Bar */}
                   {crop.sowingMonths.map(m => (
                      <div 
                        key={`s-${m}`} 
                        className="absolute top-0 bottom-0 bg-green-500"
                        style={{ left: `${(m/12)*100}%`, width: `${(1/12)*100}%` }}
                      />
                   ))}
                   {/* Harvest Bar */}
                   {crop.harvestMonths.map(m => (
                      <div 
                        key={`h-${m}`} 
                        className="absolute top-0 bottom-0 bg-orange-500"
                        style={{ left: `${(m/12)*100}%`, width: `${(1/12)*100}%` }}
                      />
                   ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono uppercase tracking-widest px-1">
                  <span>Jan</span>
                  <span>Apr</span>
                  <span>Aug</span>
                  <span>Dec</span>
                </div>
                
                {/* Minimized details */}
                <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex justify-between items-center text-xs">
                   <div className="flex items-center gap-1.5 text-green-700 font-medium bg-green-50 px-2 py-1 rounded-md">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Sow: {crop.sowingMonths.map(m => MONTHS[m]).slice(0,2).join(', ')}
                   </div>
                   <div className="flex items-center gap-1.5 text-orange-700 font-medium bg-orange-50 px-2 py-1 rounded-md">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      Harv: {crop.harvestMonths.map(m => MONTHS[m]).slice(0,2).join(', ')}
                   </div>
                </div>
               </div>
            ))}
            {filteredData.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-gray-100">
                <Filter size={48} className="mx-auto mb-4 text-gray-200" />
                <p className="text-gray-500">No crops found.</p>
                <button onClick={() => {setFilterSeason('All'); setFilterType('All'); setMyCropsOnly(false)}} className="mt-2 text-green-600 font-bold text-sm">Clear Filters</button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Selected Crop Detail Modal / Bottom Sheet */}
      {selectedCrop && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={() => setSelectedCrop(null)}></div>
          <div className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-[400px] bg-white p-6 shadow-2xl rounded-t-3xl md:rounded-3xl z-50 animate-slide-up">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1 block">{selectedCrop.type}</span>
                <h3 className="font-bold text-2xl text-gray-900 leading-none">{selectedCrop.crop}</h3>
              </div>
              <button onClick={() => setSelectedCrop(null)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                ✕
              </button>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 text-sm mb-6 flex items-start gap-3">
              <Info size={18} className="mt-0.5 text-slate-400 flex-shrink-0" />
              <p className="leading-relaxed">{selectedCrop.note}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                 <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block mb-2 opacity-70">Best Time to Sow</span>
                 <div className="text-green-900 font-bold text-lg leading-tight">
                   {selectedCrop.sowingMonths.map(m => MONTHS[m]).join(', ')}
                 </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                 <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-2 opacity-70">Harvest Period</span>
                 <div className="text-orange-900 font-bold text-lg leading-tight">
                   {selectedCrop.harvestMonths.map(m => MONTHS[m]).join(', ')}
                 </div>
              </div>
            </div>
            
            <button className="w-full mt-4 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <Tractor size={18} />
              Add to My Plan
            </button>
          </div>
        </>
      )}
    </div>
  );
};
