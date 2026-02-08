import React, { useState, useMemo } from 'react';
import { Sprout, Calendar, TrendingUp, Plus, Clock, Droplets, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import { getSmartImage } from '../utils/SmartImageMapper';

interface Crop {
  id: number;
  name: string;
  variety: string;
  sownDate: string;
  stage: string;
  health: 'Good' | 'Needs Attention' | 'Excellent';
  nextTask: string;
  image: string;
  area: number; // in acres
  expectedHarvest: string; // date string
}

interface Props {
  onViewTimeline?: () => void;
}

const MOCK_CROPS: Crop[] = [
  {
    id: 1,
    name: 'Tomato',
    variety: 'Hybrid F1',
    sownDate: '2025-01-10',
    stage: 'Flowering',
    health: 'Good',
    nextTask: 'Watering due tomorrow',
    image: '/actions/water.jpg',
    area: 1.5,
    expectedHarvest: '2025-04-15'
  },
  {
    id: 2,
    name: 'Corn',
    variety: 'Sweet Corn',
    sownDate: '2025-02-01',
    stage: 'Germination',
    health: 'Needs Attention',
    nextTask: 'Apply Nitrogen Fertilizer',
    image: '/actions/mix.jpg',
    area: 2.0,
    expectedHarvest: '2025-05-20'
  }
];

export const MyCropsView: React.FC<Props> = ({ onViewTimeline }) => {
  const [crops] = useState<Crop[]>(MOCK_CROPS);

  // Calculate days since sowing
  const getDaysSinceSowing = (sownDate: string): number => {
    const sown = new Date(sownDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - sown.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate days until harvest
  const getDaysUntilHarvest = (harvestDate: string): number => {
    const harvest = new Date(harvestDate);
    const today = new Date();
    const diffTime = harvest.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Farm statistics
  const farmStats = useMemo(() => {
    const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
    const activeCrops = crops.length;
    const nextHarvest = Math.min(...crops.map(c => getDaysUntilHarvest(c.expectedHarvest)));
    
    return {
      activeCrops,
      totalArea: totalArea.toFixed(1),
      nextHarvest: nextHarvest > 0 ? nextHarvest : 0
    };
  }, [crops]);


  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Good':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Needs Attention':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'Excellent':
      case 'Good':
        return <CheckCircle size={16} />;
      case 'Needs Attention':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-green-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Sprout size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black">My Farm</h1>
              <p className="text-sm text-green-100 mt-1">Active crop management dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Farm Statistics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 card-hover">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Sprout size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Crops</span>
          </div>
          <p className="text-3xl font-black text-gray-800">{farmStats.activeCrops}</p>
          <p className="text-xs text-gray-500 mt-1">Growing strong</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 card-hover">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <MapPin size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Area</span>
          </div>
          <p className="text-3xl font-black text-gray-800">{farmStats.totalArea}</p>
          <p className="text-xs text-gray-500 mt-1">Acres</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 card-hover">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Calendar size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Next Harvest</span>
          </div>
          <p className="text-3xl font-black text-gray-800">{farmStats.nextHarvest}</p>
          <p className="text-xs text-gray-500 mt-1">Days</p>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-800">Active Crops</h2>
          <p className="text-xs text-gray-500 mt-0.5">Monitor and manage your growing crops</p>
        </div>
        <button
          disabled
          className="bg-gray-200 text-gray-500 px-4 py-2 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 cursor-not-allowed"
        >
          <Plus size={16} />
          Add Crop
          <span className="ml-1 text-[10px] bg-white/80 text-gray-500 px-2 py-0.5 rounded-full">Coming soon</span>
        </button>
      </div>

      {/* Active Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crops.map((crop) => {
          const daysSinceSowing = getDaysSinceSowing(crop.sownDate);
          const daysUntilHarvest = getDaysUntilHarvest(crop.expectedHarvest);
          const cropImageUrl = getSmartImage(crop.name.toLowerCase());

          return (
            <div
              key={crop.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Card Header with Crop Image from Unsplash */}
              <div className="relative h-32 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                <img
                  src={cropImageUrl}
                  alt={crop.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.src = getSmartImage('healthy');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                {/* Health Badge */}
                <div className="absolute top-3 right-3">
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${getHealthColor(crop.health)}`}>
                    {getHealthIcon(crop.health)}
                    <span>{crop.health}</span>
                  </div>
                </div>

                {/* Days Badge */}
                <div className="absolute bottom-3 left-3">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-black text-gray-800">Day {daysSinceSowing}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-lg text-gray-800 leading-tight truncate">
                      {crop.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{crop.variety}</p>
                  </div>
                  <div className="ml-3 text-right flex-shrink-0">
                    <p className="text-2xl">{crop.name === 'Tomato' ? '🍅' : crop.name === 'Corn' ? '🌽' : '🌱'}</p>
                  </div>
                </div>

                {/* Stage Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">Growth Stage</span>
                    <span className="text-xs font-bold text-green-600">{crop.stage}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        crop.stage === 'Flowering' ? 'bg-gradient-to-r from-green-400 to-green-600 w-3/4' :
                        crop.stage === 'Germination' ? 'bg-gradient-to-r from-blue-400 to-blue-600 w-1/4' :
                        'bg-gradient-to-r from-orange-400 to-orange-600 w-full'
                      }`}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <span className="text-gray-500 font-semibold block mb-0.5">Area</span>
                    <span className="text-gray-800 font-bold">{crop.area} acres</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <span className="text-gray-500 font-semibold block mb-0.5">Harvest in</span>
                    <span className="text-gray-800 font-bold">{daysUntilHarvest} days</span>
                  </div>
                </div>

                {/* Next Task */}
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 p-1.5 rounded-md">
                      <Clock size={12} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-0.5">
                        Next Task
                      </p>
                      <p className="text-xs font-semibold text-blue-900 leading-tight">
                        {crop.nextTask}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer - Action Buttons */}
              <div className="px-4 pb-4 flex gap-2">
                <button
                  disabled
                  className="flex-1 bg-gray-100 text-gray-400 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-not-allowed"
                >
                  <Droplets size={14} />
                  Log Activity
                </button>
                <button
                  onClick={onViewTimeline}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <TrendingUp size={14} />
                  View Timeline
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Crop Card */}
        <div
          className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 min-h-[300px] flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center mb-4 transition-colors">
            <Plus size={32} className="text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
          <h3 className="font-black text-lg text-gray-800 mb-1">Add New Crop</h3>
          <p className="text-sm text-gray-500 text-center">
            Start tracking a new crop in your farm
          </p>
          <span className="mt-3 text-[10px] uppercase tracking-wider bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Coming soon</span>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="bg-amber-500 p-2 rounded-lg flex-shrink-0">
            <span className="text-white text-xl">💡</span>
          </div>
          <div>
            <h4 className="text-sm font-black text-amber-900 uppercase tracking-wider mb-1">
              Farm Tip
            </h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              Regular monitoring helps catch issues early. Check your crops daily and log activities 
              to maintain healthy growth patterns and maximize yield.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
