import React, { useState } from 'react';
import { SprayCan, Scissors, Droplets, Leaf, Package, Eye, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import { VisualAdvice, TreatmentStep } from '../types';
import { getSmartImage, preloadSmartImages } from '../utils/SmartImageMapper';
import { StepCard } from './StepCard';

interface Props {
  advice: VisualAdvice;
}

const ICON_MAP = {
  spray: SprayCan,
  cut: Scissors,
  water: Droplets,
  leaf: Leaf,
  package: Package,
  eye: Eye,
  sun: Sun,
  droplets: Droplets,
};

export const VisualTreatment: React.FC<Props> = ({ advice }) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));

  // Normalize steps: handle both string[] and TreatmentStep[] formats
  const normalizedSteps = Array.isArray(advice.steps) 
    ? advice.steps.map((step: any, idx: number) => {
        // If step is a string, parse it
        if (typeof step === 'string') {
          const colonIndex = step.indexOf(':');
          const actionTitle = colonIndex > 0 
            ? step.substring(0, colonIndex).trim()
            : step.split('.')[0].trim();
          const description = colonIndex > 0
            ? step.substring(colonIndex + 1).trim()
            : step;
          return {
            step: idx + 1,
            action: actionTitle,
            description: description,
            icon: 'leaf'
          };
        }
        // If step is an object, return as-is with defaults
        return {
          step: step.step || idx + 1,
          action: step.action || 'Treatment Step',
          description: step.description || '',
          icon: step.icon || 'leaf'
        };
      })
    : [];

  React.useEffect(() => {
    // Preload all treatment step images
    if (normalizedSteps.length > 0) {
      preloadSmartImages(normalizedSteps.map((step: any) => step.action || 'farm'));
    }
  }, [normalizedSteps]);

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSteps(newExpanded);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-blue-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Package size={20} />
            </div>
            <h3 className="text-xl font-black">Visual Treatment Guide</h3>
          </div>
          
          <p className="text-sm text-white/90 mb-4">
            Follow these step-by-step instructions with visual references for effective treatment.
          </p>

          {/* Medicine Card */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="bg-white/30 p-2 rounded-lg">
                <span className="text-2xl">💊</span>
              </div>
              <div>
                <p className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
                  Recommended Medicine
                </p>
                <p className="text-lg font-black">{advice.medicine_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Summary Cards (if provided) */}
      {(advice.treatment || advice.prevention) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {advice.treatment && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-xs font-black text-blue-900 uppercase tracking-wider mb-2">
                Treatment Approach
              </p>
              <p className="text-sm text-blue-800 font-medium leading-relaxed">
                {advice.treatment}
              </p>
            </div>
          )}
          
          {advice.prevention && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-xs font-black text-green-900 uppercase tracking-wider mb-2">
                Prevention Tips
              </p>
              <p className="text-sm text-green-800 font-medium leading-relaxed">
                {advice.prevention}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Visual Steps with StepCard */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-600 p-3 rounded-xl">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h4 className="text-xl font-black text-gray-900">Step-by-Step Instructions</h4>
            <p className="text-sm text-gray-600 mt-1">Follow these actions in sequence for best results</p>
          </div>
        </div>

        <div className="space-y-4">
          {normalizedSteps && normalizedSteps.length > 0 ? (
            normalizedSteps.map((step: any, index: number) => {
              const action = step?.action || 'Step';
              const description = step?.description || '';
              return (
                <StepCard
                  key={index}
                  stepNumber={index + 1}
                  action={action}
                  description={description}
                  isChemicalStep={
                    action?.toLowerCase?.().includes('spray') || 
                    action?.toLowerCase?.().includes('chemical') ||
                    description?.toLowerCase?.().includes('spray') ||
                    description?.toLowerCase?.().includes('chemical')
                  }
                />
              );
            })
          ) : (
            <p className="text-gray-500 text-sm py-4">No treatment steps available</p>
          )}
        </div>

        {/* Pro Tip Card */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-green-300">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <p className="text-xs font-black text-green-900 uppercase tracking-wider mb-1">
                Farmer's Tip
              </p>
              <p className="text-sm text-green-800 font-medium leading-relaxed">
                Click the speaker icon 🔊 to hear each step read aloud in your language. 
                Mark steps as complete ✓ to track your progress. Always wear safety gear when handling chemicals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Checklist */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border-2 border-green-200">
        <div className="flex items-start gap-3">
          <div className="bg-green-500 p-3 rounded-xl flex-shrink-0">
            <span className="text-white text-2xl">✓</span>
          </div>
          <div className="flex-1">
            <h5 className="text-lg font-black text-green-900 mb-3">
              Treatment Checklist
            </h5>
            <ul className="space-y-2.5 text-sm text-gray-800">
              <li className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">1</span>
                <span className="font-medium">Follow all steps in sequence</span>
              </li>
              <li className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">2</span>
                <span className="font-medium">Refer to visual guides for proper technique</span>
              </li>
              <li className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">3</span>
                <span className="font-medium">Repeat treatment as recommended</span>
              </li>
              <li className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">4</span>
                <span className="font-medium">Monitor crop health daily</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
