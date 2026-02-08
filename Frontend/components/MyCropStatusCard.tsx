import React from 'react';
import { Leaf, AlertCircle, TrendingUp } from 'lucide-react';

interface Props {
  onViewTimeline?: () => void;
}

export const MyCropStatusCard: React.FC<Props> = ({ onViewTimeline }) => {
  // Mock data - in real app this would be dynamic
  const cropStatus = {
    crop: 'Tomato',
    stage: 'Flowering',
    daysElapsed: 65,
    health: 92,
    nextTask: 'Fertilizer Application',
    daysUntilTask: 5
  };

  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-green border border-green-100 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Leaf size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{cropStatus.crop}</h3>
            <p className="text-xs text-gray-500">Current Status</p>
          </div>
        </div>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
          ✓ Healthy
        </span>
      </div>

      {/* Stage Info */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-600">Growth Stage</span>
            <span className="text-xs font-bold text-green-600">{cropStatus.stage}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600"
              style={{ width: `${(cropStatus.daysElapsed / 90) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1">Day {cropStatus.daysElapsed} of ~90</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-600">Plant Health</span>
            <span className="text-xs font-bold text-green-600">{cropStatus.health}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
              style={{ width: `${cropStatus.health}%` }}
            />
          </div>
        </div>
      </div>

      {/* Next Task */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-blue-900">Next Task</p>
            <p className="text-sm font-semibold text-blue-800 mt-0.5">{cropStatus.nextTask}</p>
            <p className="text-xs text-blue-700 mt-1">In {cropStatus.daysUntilTask} days</p>
          </div>
        </div>
      </div>

      <button 
        onClick={onViewTimeline}
        className="w-full mt-4 bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2">
        <TrendingUp size={16} />
        View Full Timeline
      </button>
    </div>
  );
};
