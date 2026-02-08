import React from 'react';
import { DiagnosisResult } from '../types';
import { AlertCircle, CheckCircle, Droplet, Shield, ChevronLeft, Zap } from 'lucide-react';
import { VisualTreatment } from './VisualTreatment';

interface ScanResultProps {
  diagnosis: DiagnosisResult | null;
  selectedImage: string | null;
  t: any;
  onBack: () => void;
}

export const ScanResult: React.FC<ScanResultProps> = ({ diagnosis, selectedImage, t, onBack }) => {
  if (!diagnosis) {
    return <div className="p-4">{t.loading}</div>;
  }

  const confidencePercent = Math.round(diagnosis.confidence * 100);

  return (
    <div className="space-y-6 animate-fade-in p-4 pb-24 md:pb-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
      >
        <ChevronLeft size={20} />
        {t.back || 'Back'}
      </button>

      {/* Image Display */}
      {selectedImage && (
        <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <img src={selectedImage} alt="Scanned leaf" className="w-full h-64 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white text-sm font-bold">Analyzed Image</p>
          </div>
        </div>
      )}

      {/* Status Banner */}
      <div
        className={`rounded-3xl p-6 shadow-lg ${
          diagnosis.healthy
            ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-lg'
            : 'bg-gradient-to-br from-orange-500 to-red-600 shadow-red-lg'
        } text-white`}
      >
        <div className="flex items-center gap-3 mb-4">
          {diagnosis.healthy ? (
            <CheckCircle size={32} strokeWidth={3} />
          ) : (
            <AlertCircle size={32} strokeWidth={3} />
          )}
          <div>
            <h2 className="text-2xl font-black">{diagnosis.healthy ? t.healthy : t.diseased}</h2>
            <p className="text-sm opacity-90">{diagnosis.adviceTitle || diagnosis.diseaseName}</p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Confidence</span>
            <span className="text-lg font-black">{confidencePercent}%</span>
          </div>
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Symptoms Section */}
      {!diagnosis.healthy && diagnosis.visual_symptoms && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Visual Symptoms Detected</h4>
              <p className="text-sm text-gray-700">{diagnosis.visual_symptoms}</p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Treatment Guide (NEW) */}
      {diagnosis.visualAdvice && (
        <VisualTreatment advice={diagnosis.visualAdvice} />
      )}

      {/* Treatment Section */}
      {!diagnosis.healthy && diagnosis.treatment.length > 0 && (
        <div className="bg-white p-5 rounded-2xl shadow-blue border border-gray-200 card-hover">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Droplet size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-black text-gray-800">{t.treatment || 'Treatment'}</h3>
          </div>
          <ul className="space-y-3">
            {diagnosis.treatment.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prevention Section */}
      {!diagnosis.healthy && diagnosis.preventativeMeasures.length > 0 && (
        <div className="bg-white p-5 rounded-2xl shadow-green border border-gray-200 card-hover">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Shield size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-black text-gray-800">{t.prevention || 'Prevention'}</h3>
          </div>
          <ul className="space-y-3">
            {diagnosis.preventativeMeasures.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                <CheckCircle size={20} className="flex-shrink-0 text-green-600 mt-0.5" />
                <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Healthy Plant Message */}
      {diagnosis.healthy && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200 shadow-green">
          <div className="flex items-center gap-3">
            <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-semibold">
              {t.plantHealthy || 'Your plant appears to be healthy. Continue monitoring regularly.'}
            </p>
          </div>
        </div>
      )}

      {/* Retake Button */}
      <button
        onClick={onBack}
        className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
      >
        Scan Another Leaf
      </button>
    </div>
  );
};
