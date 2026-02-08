import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Zap, Droplet, Shield, Upload, Loader, ChevronLeft } from 'lucide-react';
import { StepCard } from './StepCard';
import { TreatmentTimeline } from './TreatmentTimeline';

interface DiagnosisData {
  diagnosis_name: string;
  confidence_score: string;
  professional_summary: string;
  physical_actions_checklist: string[];
  chemical_prescription: {
    required: boolean;
    specific_active_ingredients: string[];
    application_instructions: string;
  };
  preventative_measures: string;
  error?: string;
}

interface ScanViewProps {
  onBack?: () => void;
}

export const ScanView: React.FC<ScanViewProps> = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setImageFile(file);
        setDiagnosis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('http://localhost:8000/scan_disease', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data: DiagnosisData = await response.json();

      if (data.error) {
        setError(data.error);
        setDiagnosis(null);
      } else {
        setDiagnosis(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      setDiagnosis(null);
    } finally {
      setLoading(false);
    }
  };

  const isHealthy = diagnosis?.diagnosis_name?.toLowerCase().includes('healthy');

  // If no image selected, show upload screen
  if (!selectedImage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        )}

        <div className="max-w-md w-full space-y-6">
          {/* Upload Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-dashed border-green-300">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                <Upload size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Crop Health Scan
              </h2>
              <p className="text-gray-600 mb-6">
                Upload a photo of your crop leaf for instant AI diagnosis
              </p>

              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl cursor-pointer hover:shadow-lg transition-all active:scale-95">
                  Choose Image
                </div>
              </label>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Gemini 3 Vision AI Analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <Droplet size={20} className="text-orange-600 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Specific Chemical Recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Professional Treatment Plans</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If image selected but no diagnosis yet, show analysis screen
  if (loading || !diagnosis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        )}

        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          {/* Selected Image with Cybernetic Scanner */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white max-w-md w-full">
            <img src={selectedImage} alt="Selected leaf" className="w-full h-64 object-cover" />
            
            {/* Scanner Grid Background */}
            <div className="absolute inset-0 scanner-grid pointer-events-none" />

            {/* Scanner Corners */}
            {loading && (
              <>
                <div className="scanner-corner top-left" />
                <div className="scanner-corner top-right" />
                <div className="scanner-corner bottom-left" />
                <div className="scanner-corner bottom-right" />
              </>
            )}

            {/* Loading State - Professional Scanning Laser */}
            {loading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center scan-backdrop">
                {/* Moving Laser Line */}
                <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
                  <div className="scanner-line">
                    <div className="scanner-overlay"></div>
                  </div>
                </div>

                {/* Centered Scanning Animation */}
                <div className="relative z-30 flex flex-col items-center">
                  <div className="scanner-pulse mb-4"></div>
                  <h3 className="text-lg font-bold text-white tracking-widest scanner-text">
                    AI ANALYZING...
                  </h3>
                  <p className="text-sm text-green-300 mt-2 animate-pulse">
                    Plant Pathologist Mode
                  </p>
                </div>
              </div>
            )}
          </div>

          {!loading && (
            <div className="w-full max-w-md space-y-3">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                Analyze with AI
              </button>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setImageFile(null);
                  setDiagnosis(null);
                  setError(null);
                }}
                className="w-full bg-white text-gray-800 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-200"
              >
                Choose Different Image
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Display diagnosis report
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-green-50 p-4 pb-24">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4"
        >
          <ChevronLeft size={20} />
          Back
        </button>
      )}

      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Selected Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          <img src={selectedImage} alt="Analyzed leaf" className="w-full h-64 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white text-sm font-bold">Analyzed Image</p>
          </div>
        </div>

        {/* Header Card with Diagnosis and Confidence */}
        <div
          className={`rounded-3xl p-6 shadow-xl text-white ${
            isHealthy
              ? 'bg-gradient-to-br from-green-500 to-emerald-600'
              : 'bg-gradient-to-br from-orange-500 to-red-600'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-black mb-2">{diagnosis.diagnosis_name}</h2>
              <p className="text-white/80 text-sm">
                {isHealthy ? 'Crop is in excellent condition' : 'Disease detected - immediate action recommended'}
              </p>
            </div>
            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
              {diagnosis.confidence_score}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500">
          <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
            <Zap size={24} className="text-indigo-600" />
            Professional Summary
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm">
            {diagnosis.professional_summary}
          </p>
        </div>

        {/* Physical Actions (Step-by-Step Treatment using TreatmentTimeline) */}
        {diagnosis.physical_actions_checklist && diagnosis.physical_actions_checklist.length > 0 && (
          <TreatmentTimeline 
            steps={diagnosis.physical_actions_checklist.map((action, idx) => {
              // Parse action into title and description
              const colonIndex = action.indexOf(':');
              const dashIndex = action.indexOf('-');
              const separatorIndex = colonIndex > 0 ? colonIndex : (dashIndex > 0 ? dashIndex : -1);
              
              const actionTitle = separatorIndex > 0 
                ? action.substring(0, separatorIndex).trim()
                : action.split('.')[0].trim();
              
              const actionDescription = separatorIndex > 0
                ? action.substring(separatorIndex + 1).trim()
                : action.substring(actionTitle.length).trim() || action;

              // Detect icon from action text
              let icon: 'spray' | 'cut' | 'water' | 'leaf' | 'package' | 'eye' | 'sun' | 'droplets' | 'harvest' | 'fertilizer' | 'monitor' | 'mix' = 'leaf';
              
              const lowerAction = actionTitle.toLowerCase();
              if (lowerAction.includes('spray') || lowerAction.includes('apply')) icon = 'spray';
              else if (lowerAction.includes('prune') || lowerAction.includes('cut') || lowerAction.includes('remove')) icon = 'cut';
              else if (lowerAction.includes('water') || lowerAction.includes('irrigat')) icon = 'water';
              else if (lowerAction.includes('harvest')) icon = 'harvest';
              else if (lowerAction.includes('fertiliz') || lowerAction.includes('nitrogen') || lowerAction.includes('feeding')) icon = 'fertilizer';
              else if (lowerAction.includes('monitor') || lowerAction.includes('check') || lowerAction.includes('inspect')) icon = 'monitor';
              else if (lowerAction.includes('mix') || lowerAction.includes('blend') || lowerAction.includes('prepare')) icon = 'mix';

              return {
                step: idx + 1,
                action: actionTitle,
                description: actionDescription,
                icon: icon
              };
            })}
            cropName={diagnosis.diagnosis_name?.split(' - ')[0] || 'Crop'}
          />
        )}

        {/* Chemical Prescription */}
        {diagnosis.chemical_prescription.required && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-300">
            <div className="mb-4 flex items-start gap-3 bg-red-50 p-4 rounded-xl">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-black text-red-900 mb-1">🧪 Chemical Prescription</h3>
                <p className="text-sm text-red-800">Professional chemical treatment required</p>
              </div>
            </div>

            {/* Chemical Names as Badges */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-600 uppercase mb-2">Required Active Ingredients:</p>
              <div className="flex flex-wrap gap-2">
                {diagnosis.chemical_prescription.specific_active_ingredients.map(
                  (chemical, idx) => (
                    <div
                      key={idx}
                      className="inline-block bg-gradient-to-br from-red-500 to-orange-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-shadow"
                    >
                      {chemical}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Application Instructions */}
            <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-orange-500">
              <p className="text-xs font-bold text-gray-600 uppercase mb-2">Application Instructions:</p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {diagnosis.chemical_prescription.application_instructions}
              </p>
            </div>
          </div>
        )}

        {/* Healthy Plant Message */}
        {isHealthy && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-300 shadow-lg">
            <div className="flex items-start gap-4">
              <CheckCircle size={28} className="text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-black text-green-900 mb-1">Healthy Plant</h3>
                <p className="text-sm text-green-800">
                  Your crop appears to be in excellent condition. Continue monitoring regularly and maintain good agricultural practices.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Preventative Measures */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={24} className="text-green-600" />
            Long-Term Prevention
          </h3>
          <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-800 leading-relaxed">
              {diagnosis.preventative_measures}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sticky bottom-4">
          <button
            onClick={() => {
              setSelectedImage(null);
              setImageFile(null);
              setDiagnosis(null);
              setError(null);
            }}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            Scan Another Leaf
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full bg-white text-gray-800 font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-200"
            >
              Exit to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
