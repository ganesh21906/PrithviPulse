import React, { useState } from 'react';
import { MapPin, Droplets, AlertTriangle, CheckCircle } from 'lucide-react';

interface CropPin {
  id: string;
  crop: string;
  status: 'healthy' | 'needs-water' | 'pest-alert';
  position: { top: string; left: string };
  emoji: string;
}

const CROP_PINS: CropPin[] = [
  {
    id: '1',
    crop: 'Tomato',
    status: 'healthy',
    position: { top: '20%', left: '25%' },
    emoji: '🍅'
  },
  {
    id: '2',
    crop: 'Corn',
    status: 'needs-water',
    position: { top: '65%', left: '70%' },
    emoji: '🌽'
  },
  {
    id: '3',
    crop: 'Chili',
    status: 'pest-alert',
    position: { top: '45%', left: '50%' },
    emoji: '🌶️'
  }
];

export const FarmMapWidget: React.FC = () => {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'healthy':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          icon: CheckCircle,
          label: 'Healthy',
          pulseColor: 'rgba(34, 197, 94, 0.6)'
        };
      case 'needs-water':
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-300',
          icon: Droplets,
          label: 'Needs Water',
          pulseColor: 'rgba(59, 130, 246, 0.6)'
        };
      case 'pest-alert':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300',
          icon: AlertTriangle,
          label: 'Pest Alert',
          pulseColor: 'rgba(239, 68, 68, 0.6)'
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          icon: MapPin,
          label: 'Unknown',
          pulseColor: 'rgba(107, 114, 128, 0.6)'
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 p-2 rounded-lg">
              <MapPin size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-gray-800 text-sm">📍 Field Status</h3>
              <p className="text-xs text-gray-500 mt-0.5">Real-time crop monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-green-700">Live</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-64 overflow-hidden">
        {/* Satellite Map Background */}
        {!imageError ? (
          <img
            src="/farm-map.jpg"
            alt="Farm satellite map"
            className="absolute inset-0 w-full h-full object-cover brightness-75"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Fallback Pattern if image fails to load */
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-50 to-green-100">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #10b981 1px, transparent 1px),
                  linear-gradient(to bottom, #10b981 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
            {/* Contour Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10">
              <path
                d="M0,50 Q100,30 200,50 T400,50"
                stroke="#059669"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M0,100 Q100,80 200,100 T400,100"
                stroke="#059669"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M0,150 Q100,130 200,150 T400,150"
                stroke="#059669"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        )}

        {/* Crop Pins with Pulse Animation */}
        {CROP_PINS.map((pin) => {
          const config = getStatusConfig(pin.status);
          const StatusIcon = config.icon;
          const isHovered = hoveredPin === pin.id;

          return (
            <div
              key={pin.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                top: pin.position.top,
                left: pin.position.left
              }}
              onMouseEnter={() => setHoveredPin(pin.id)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              {/* Pulsing Ring Animation */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                  className={`w-12 h-12 rounded-full ${config.color} opacity-30 animate-ping`}
                  style={{ animationDuration: '2s' }}
                />
              </div>

              {/* Pin Marker with White Border for Visibility */}
              <div
                className={`relative w-10 h-10 rounded-full ${config.color} shadow-md border-2 border-white flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                  isHovered ? 'scale-125 shadow-2xl' : ''
                }`}
              >
                <StatusIcon size={18} className="text-white" strokeWidth={2.5} />
              </div>

              {/* Tooltip on Hover */}
              {isHovered && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 animate-fade-in">
                  <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl px-3 py-2 shadow-xl min-w-max`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{pin.emoji}</span>
                      <span className="font-black text-gray-800 text-sm">{pin.crop}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusIcon size={12} className={config.textColor} />
                      <span className={`text-xs font-bold ${config.textColor}`}>
                        {config.label}
                      </span>
                    </div>
                    {/* Tooltip Arrow */}
                    <div
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 -mb-[1px] w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent ${config.borderColor.replace('border-', 'border-b-')}`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Dark Gradient Overlay for Legend Readability */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-3 px-4 pointer-events-none">
          {/* Legend with White Text */}
          <div className="flex items-center justify-between gap-2 text-xs pointer-events-auto">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-white/50" />
              <span className="text-white font-bold drop-shadow-lg">Healthy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white/50" />
              <span className="text-white font-bold drop-shadow-lg">Water</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white/50" />
              <span className="text-white font-bold drop-shadow-lg">Alert</span>
            </div>
            <button className="text-white font-bold hover:text-green-300 transition-colors text-xs drop-shadow-lg">
              View Full Map →
            </button>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};
