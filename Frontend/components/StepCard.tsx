import React, { useState } from 'react';
import { 
  Sprout, 
  Droplets, 
  Scissors, 
  Eye, 
  Clock, 
  Package, 
  SprayCan,
  Beaker,
  AlertTriangle,
  Volume2,
  CheckCircle,
  Circle
} from 'lucide-react';

interface StepCardProps {
  stepNumber: number;
  action: string;
  description: string;
  isChemicalStep?: boolean;
}

// Helper function to determine icon based on action keyword
const getActionIcon = (action: string) => {
  const actionLower = action.toLowerCase();
  
  if (actionLower.includes('spray') || actionLower.includes('apply')) {
    return <SprayCan size={24} className="text-blue-600" />;
  }
  if (actionLower.includes('mix') || actionLower.includes('blend') || actionLower.includes('prepare')) {
    return <Beaker size={24} className="text-purple-600" />;
  }
  if (actionLower.includes('prune') || actionLower.includes('cut') || actionLower.includes('trim') || actionLower.includes('remove')) {
    return <Scissors size={24} className="text-orange-600" />;
  }
  if (actionLower.includes('water') || actionLower.includes('irrigat')) {
    return <Droplets size={24} className="text-cyan-600" />;
  }
  if (actionLower.includes('monitor') || actionLower.includes('check') || actionLower.includes('inspect') || actionLower.includes('observe')) {
    return <Eye size={24} className="text-indigo-600" />;
  }
  if (actionLower.includes('wait') || actionLower.includes('time')) {
    return <Clock size={24} className="text-amber-600" />;
  }
  
  // Default icon
  return <Sprout size={24} className="text-green-600" />;
};

// Check if step involves chemicals
const isChemicalAction = (text: string): boolean => {
  const chemicalKeywords = ['spray', 'chemical', 'pesticide', 'fungicide', 'insecticide', 'poison', 'toxic'];
  return chemicalKeywords.some(keyword => text.toLowerCase().includes(keyword));
};

export const StepCard: React.FC<StepCardProps> = ({ 
  stepNumber, 
  action, 
  description, 
  isChemicalStep 
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto-detect chemical step if not explicitly provided
  const showSafetyBadge = isChemicalStep || isChemicalAction(action) || isChemicalAction(description);

  // Text-to-Speech Handler
  const handleSpeak = () => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(`${action}. ${description}`);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-sm border-2 transition-all duration-300 overflow-hidden
        ${isCompleted ? 'border-green-300 bg-green-50/30' : 'border-gray-100 hover:border-green-200'}
        ${isCompleted ? 'opacity-75' : 'hover:shadow-md'}
      `}
    >
      <div className="p-4 flex items-start gap-4">
        {/* Left: Step Number + Icon */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          {/* Step Number Badge */}
          <div 
            className={`
              w-12 h-12 rounded-full flex items-center justify-center font-black text-lg
              ${isCompleted 
                ? 'bg-green-600 text-white ring-4 ring-green-100' 
                : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
              }
            `}
          >
            {isCompleted ? <CheckCircle size={24} strokeWidth={3} /> : stepNumber}
          </div>

          {/* Dynamic Action Icon */}
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
            {getActionIcon(action)}
          </div>
        </div>

        {/* Center: Action Title + Description */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Action Title */}
          <div className="flex items-start gap-2 flex-wrap">
            <h4 className={`font-black text-lg leading-tight ${isCompleted ? 'text-green-800 line-through' : 'text-gray-900'}`}>
              {action}
            </h4>
            
            {/* Safety Badge (Conditional) */}
            {showSafetyBadge && (
              <div className="inline-flex items-center gap-1 bg-red-100 border border-red-300 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                <AlertTriangle size={12} />
                Safety First
              </div>
            )}
          </div>

          {/* Description */}
          <p className={`text-sm leading-relaxed ${isCompleted ? 'text-gray-500' : 'text-gray-700'}`}>
            {description}
          </p>

          {/* Safety Warning (if chemical step) */}
          {showSafetyBadge && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-3 rounded-r-lg">
              <p className="text-xs text-red-900 font-semibold flex items-center gap-2">
                <AlertTriangle size={14} className="flex-shrink-0" />
                <span>Wear protective gear (gloves, mask). Keep away from children and animals.</span>
              </p>
            </div>
          )}
        </div>

        {/* Right: TTS Button + Completion Checkbox */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          {/* Text-to-Speech Button */}
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all
              ${isSpeaking 
                ? 'bg-blue-500 text-white animate-pulse' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:scale-95'
              }
            `}
            aria-label="Read aloud"
          >
            <Volume2 size={18} />
          </button>

          {/* Mark as Done Checkbox */}
          <button
            onClick={() => setIsCompleted(!isCompleted)}
            className={`
              w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all active:scale-95
              ${isCompleted 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'bg-white border-gray-300 text-gray-300 hover:border-green-400 hover:text-green-500'
              }
            `}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted ? (
              <CheckCircle size={20} strokeWidth={3} />
            ) : (
              <Circle size={20} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
