import React, { useState } from 'react';
import { 
  SprayCan, 
  Scissors, 
  Droplets, 
  Leaf, 
  Package, 
  Eye, 
  Sun, 
  Volume2,
  CheckCircle,
  Circle,
  AlertTriangle,
  Zap,
  Beaker,
  Sprout
} from 'lucide-react';

interface TreatmentStep {
  step: number;
  action: string;
  description: string;
  icon: 'spray' | 'cut' | 'water' | 'leaf' | 'package' | 'eye' | 'sun' | 'droplets' | 'harvest' | 'fertilizer' | 'monitor' | 'mix';
}

interface TreatmentTimelineProps {
  steps: TreatmentStep[];
  cropName?: string;
}

// Map icon names to Lucide components
const ICON_COMPONENTS: Record<string, React.ReactNode> = {
  spray: <SprayCan size={24} className="text-blue-600" />,
  cut: <Scissors size={24} className="text-orange-600" />,
  water: <Droplets size={24} className="text-cyan-600" />,
  leaf: <Leaf size={24} className="text-green-600" />,
  package: <Package size={24} className="text-purple-600" />,
  eye: <Eye size={24} className="text-indigo-600" />,
  sun: <Sun size={24} className="text-amber-600" />,
  droplets: <Droplets size={24} className="text-blue-500" />,
  harvest: <Sprout size={24} className="text-yellow-600" />,
  fertilizer: <Zap size={24} className="text-green-700" />,
  monitor: <Eye size={24} className="text-indigo-600" />,
  mix: <Beaker size={24} className="text-purple-600" />,
};

// Get dynamic image URL for each action
const getActionImageUrl = (action: string, icon: string): string => {
  // Map action to relevant search terms
  const searchTerms: Record<string, string> = {
    'IMMEDIATE CURE': 'farmer-spraying-pesticide',
    'SPRAY': 'farmer-spraying-crops',
    'APPLY': 'applying-fertilizer-farm',
    'MIX': 'mixing-chemicals-farm',
    'PRUNE': 'pruning-plants-gardening',
    'WATER': 'watering-crops-farm',
    'FERTILIZE': 'fertilizing-agriculture',
    'MONITOR': 'farmer-inspecting-crops',
    'HARVEST': 'harvesting-crops-farm',
    'REMOVE': 'removing-diseased-leaves',
    'WAIT': 'crop-growth-timeline',
    'CHECK': 'checking-plant-health',
  };

  const searchTerm = searchTerms[action.toUpperCase()] || 'farming-agriculture';
  
  // Using static placeholder for images (hackathon-friendly)
  return `https://via.placeholder.com/150x150/10b981/ffffff?text=${action.charAt(0)}`;
};

// Get background color for step badge based on step number
const getStepColor = (stepNumber: number, totalSteps: number): string => {
  if (stepNumber === 1) return 'from-red-500 to-red-600'; // First step - urgent
  if (stepNumber === totalSteps) return 'from-yellow-500 to-amber-600'; // Last step - harvest
  if (stepNumber <= 2) return 'from-orange-500 to-orange-600'; // Early steps - critical
  return 'from-green-500 to-emerald-600'; // Regular steps
};

// Get badge for special steps
const getStepBadge = (stepNumber: number, totalSteps: number): { icon: string; text: string; color: string } | null => {
  if (stepNumber === 1) {
    return { icon: '⚠️', text: 'Urgent', color: 'bg-red-100 text-red-800 border-red-300' };
  }
  if (stepNumber === totalSteps) {
    return { icon: '💰', text: 'Ready to Harvest', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
  }
  if (stepNumber === 2) {
    return { icon: '🔥', text: 'Critical', color: 'bg-orange-100 text-orange-800 border-orange-300' };
  }
  return null;
};

export const TreatmentTimeline: React.FC<TreatmentTimelineProps> = ({ steps, cropName = 'Crop' }) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [speakingStep, setSpeakingStep] = useState<number | null>(null);

  const toggleComplete = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  const handleSpeak = (action: string, description: string, stepNumber: number) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setSpeakingStep(stepNumber);

    const utterance = new SpeechSynthesisUtterance(`Step ${stepNumber}. ${action}. ${description}`);
    utterance.lang = 'en-IN';
    utterance.rate = 0.85;

    utterance.onend = () => setSpeakingStep(null);
    utterance.onerror = () => setSpeakingStep(null);

    window.speechSynthesis.speak(utterance);
  };

  if (!steps || steps.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
        <Leaf size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No treatment steps available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Leaf size={24} />
          </div>
          <h2 className="text-2xl font-black">Treatment Timeline</h2>
        </div>
        <p className="text-green-100 text-sm font-medium">
          {steps.length} steps to restore {cropName} health • Follow in order for best results
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative space-y-6">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-emerald-500 to-green-600 rounded-full" />

        {/* Treatment Steps */}
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.step);
          const isSpeaking = speakingStep === step.step;
          const badge = getStepBadge(step.step, steps.length);
          const stepColor = getStepColor(step.step, steps.length);
          const imageUrl = getActionImageUrl(step.action, step.icon);

          return (
            <div key={step.step} className="relative pl-20">
              {/* Step Indicator Circle */}
              <div
                className={`
                  absolute left-0 top-3 w-12 h-12 rounded-full flex items-center justify-center font-black text-lg
                  bg-gradient-to-br ${stepColor} text-white shadow-lg border-4 border-white
                  transition-all duration-300 z-20
                  ${isCompleted ? 'ring-4 ring-green-200 scale-110' : ''}
                `}
              >
                {isCompleted ? (
                  <CheckCircle size={28} strokeWidth={3} />
                ) : (
                  <span className="font-black">{step.step}</span>
                )}
              </div>

              {/* Step Card */}
              <div
                className={`
                  bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 overflow-hidden
                  ${isCompleted 
                    ? 'border-green-300 bg-green-50/50' 
                    : 'border-gray-100 hover:border-green-200 hover:shadow-lg'
                  }
                  ${isCompleted ? 'opacity-75' : ''}
                `}
              >
                <div className="p-5 flex gap-4">
                  {/* Left: Icon + Action */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Action Title with Badge */}
                    <div className="flex items-start gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                          {ICON_COMPONENTS[step.icon] || ICON_COMPONENTS.leaf}
                        </div>
                        <h3
                          className={`font-black text-lg leading-tight ${
                            isCompleted ? 'text-green-700 line-through' : 'text-gray-900'
                          }`}
                        >
                          {step.action}
                        </h3>
                      </div>

                      {/* Step Badge (Urgent/Ready to Harvest) */}
                      {badge && (
                        <div className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${badge.color}`}>
                          <span>{badge.icon}</span>
                          {badge.text}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p
                      className={`text-sm leading-relaxed ${
                        isCompleted ? 'text-gray-500' : 'text-gray-700'
                      }`}
                    >
                      {step.description}
                    </p>

                    {/* Safety Warning for Chemical Steps */}
                    {(step.icon === 'spray' || step.action.toLowerCase().includes('chemical')) && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
                        <p className="text-xs text-red-900 font-semibold flex items-center gap-2">
                          <AlertTriangle size={14} className="flex-shrink-0" />
                          <span>Use protective equipment: gloves, mask, apron</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Image + Actions */}
                  <div className="flex flex-col items-center gap-3 flex-shrink-0">
                    {/* Action Image */}
                    <img
                      src={imageUrl}
                      alt={step.action}
                      className="w-28 h-28 rounded-xl object-cover shadow-md border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/150x150?text=${encodeURIComponent(step.action.substring(0, 10))}`;
                      }}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full">
                      {/* Text-to-Speech Button */}
                      <button
                        onClick={() => handleSpeak(step.action, step.description, step.step)}
                        disabled={isSpeaking}
                        className={`
                          flex-1 w-10 h-10 rounded-full flex items-center justify-center transition-all text-sm font-bold
                          ${
                            isSpeaking
                              ? 'bg-blue-500 text-white animate-pulse'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:scale-95'
                          }
                        `}
                        title="Listen"
                        aria-label={`Listen to step ${step.step}`}
                      >
                        <Volume2 size={16} />
                      </button>

                      {/* Mark Complete Button */}
                      <button
                        onClick={() => toggleComplete(step.step)}
                        className={`
                          flex-1 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                          ${
                            isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-white border-gray-300 text-gray-300 hover:border-green-400 hover:text-green-500 active:scale-95'
                          }
                        `}
                        title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                        aria-label={isCompleted ? 'Mark step incomplete' : 'Mark step complete'}
                      >
                        {isCompleted ? (
                          <CheckCircle size={18} strokeWidth={3} />
                        ) : (
                          <Circle size={18} strokeWidth={2} />
                        )}
                      </button>
                    </div>

                    {/* Completion Status */}
                    {isCompleted && (
                      <p className="text-xs font-bold text-green-700 text-center">Completed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Progress Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-green-700 uppercase tracking-wider mb-1">Progress</p>
            <p className="text-2xl font-black text-green-900">
              {completedSteps.size} / {steps.length} Steps
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-24 h-24 rounded-full relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray={`${(completedSteps.size / steps.length) * 283} 283`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center">
              <p className="text-lg font-black text-green-700">
                {Math.round((completedSteps.size / steps.length) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {completedSteps.size === steps.length && (
          <div className="mt-4 p-4 bg-white rounded-xl border-2 border-green-400 text-center">
            <p className="text-lg font-black text-green-700 mb-1">🎉 All Steps Complete!</p>
            <p className="text-sm text-green-600">Monitor your crop regularly for full recovery</p>
          </div>
        )}
      </div>

      {/* Farmer Tips Card */}
      <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-200 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div className="flex-1">
            <p className="text-xs font-black text-amber-900 uppercase tracking-wider mb-1">Farmer's Tips</p>
            <ul className="text-sm text-amber-900 space-y-1 list-disc list-inside">
              <li>Follow steps in order for best results</li>
              <li>Use the speaker button 🔊 to hear instructions in your language</li>
              <li>Check off each step as you complete it</li>
              <li>Re-read any step if needed before proceeding</li>
              <li>Contact local agricultural expert if issues persist</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
