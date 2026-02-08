import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle, Clock, Sprout, AlertCircle, Droplets, Sun, Leaf, Package } from 'lucide-react';

type CropStage = { 
  day: number; 
  task: string; 
  duration: number;
  image: string;
  taskList: string[];
  tips: string;
};
type CropKey = 'Tomato' | 'Corn' | 'Potato';

const CROP_DATA: Record<CropKey, CropStage[]> = {
  Tomato: [
    { 
      day: 0, 
      task: 'Sow Seeds', 
      duration: 7,
      image: '🌱',
      taskList: [
        'Prepare seed trays with potting mix',
        'Sow seeds 0.5cm deep',
        'Water gently and cover with plastic',
        'Maintain 25-30°C temperature'
      ],
      tips: 'Keep soil moist but not waterlogged'
    },
    { 
      day: 20, 
      task: 'Transplanting', 
      duration: 3,
      image: '🪴',
      taskList: [
        'Select healthy seedlings (4-5 leaves)',
        'Water seedlings 2 hours before transplant',
        'Plant 60cm apart in prepared beds',
        'Water immediately after planting'
      ],
      tips: 'Transplant in evening to reduce stress'
    },
    { 
      day: 40, 
      task: 'Apply Nitrogen Fertilizer', 
      duration: 2,
      image: '💧',
      taskList: [
        'Mix 2kg Urea per 100 sq.m',
        'Apply around plant base (not touching stem)',
        'Water thoroughly after application',
        'Check for pest damage'
      ],
      tips: 'Apply in split doses for better absorption'
    },
    { 
      day: 60, 
      task: 'Flowering Stage', 
      duration: 15,
      image: '🌸',
      taskList: [
        'Monitor flower formation daily',
        'Reduce nitrogen, increase potassium',
        'Ensure consistent watering',
        'Hand pollinate if needed (shake flowers)'
      ],
      tips: 'Flowers need 6+ hours of sunlight'
    },
    { 
      day: 80, 
      task: 'First Harvest', 
      duration: 20,
      image: '🍅',
      taskList: [
        'Pick when fully colored but firm',
        'Harvest in morning for best flavor',
        'Use clean scissors to cut stem',
        'Continue watering regularly'
      ],
      tips: 'Harvest every 2-3 days during peak season'
    },
  ],
  Corn: [
    { 
      day: 0, 
      task: 'Sow Seeds', 
      duration: 7,
      image: '🌱',
      taskList: [
        'Sow seeds 2-3cm deep',
        'Space 20cm apart in rows',
        'Water immediately after sowing',
        'Mark rows for identification'
      ],
      tips: 'Plant in blocks for better pollination'
    },
    { 
      day: 18, 
      task: 'Thinning & Gap Filling', 
      duration: 3,
      image: '🌾',
      taskList: [
        'Remove weak seedlings',
        'Maintain 20-25cm spacing',
        'Replant in gaps if needed',
        'Apply light compost'
      ],
      tips: 'Thin when plants reach 10cm height'
    },
    { 
      day: 35, 
      task: 'Top Dressing (Nitrogen)', 
      duration: 2,
      image: '💧',
      taskList: [
        'Apply 3kg Urea per 100 sq.m',
        'Side-dress along rows',
        'Incorporate lightly into soil',
        'Irrigate after application'
      ],
      tips: 'Critical stage for yield formation'
    },
    { 
      day: 55, 
      task: 'Tasseling', 
      duration: 10,
      image: '🌾',
      taskList: [
        'Monitor silk emergence',
        'Ensure adequate moisture',
        'Control pests (borers)',
        'No fertilizer during this stage'
      ],
      tips: 'Silks must be fresh for good pollination'
    },
    { 
      day: 75, 
      task: 'Harvest Green Cobs', 
      duration: 15,
      image: '🌽',
      taskList: [
        'Check silk color (brown = ready)',
        'Press kernel (milky = harvest)',
        'Harvest early morning',
        'Store in cool place immediately'
      ],
      tips: 'Harvest within 20 days of silking'
    },
  ],
  Potato: [
    { 
      day: 0, 
      task: 'Plant Seed Tubers', 
      duration: 5,
      image: '🥔',
      taskList: [
        'Cut seed potatoes with 2-3 eyes',
        'Plant 10cm deep',
        'Space 30cm apart in rows',
        'Cover with soil, water well'
      ],
      tips: 'Use certified disease-free seed'
    },
    { 
      day: 20, 
      task: 'First Earthing Up', 
      duration: 3,
      image: '⛰️',
      taskList: [
        'Mound soil around plant base',
        'Cover stems up to lower leaves',
        'Remove weeds during earthing',
        'Water after earthing up'
      ],
      tips: 'Prevents tubers from greening'
    },
    { 
      day: 35, 
      task: 'Top Dressing (N + K)', 
      duration: 2,
      image: '💧',
      taskList: [
        'Mix 2kg Urea + 1kg Muriate of Potash',
        'Apply around plant base',
        'Do second earthing up',
        'Ensure good drainage'
      ],
      tips: 'Potassium critical for tuber quality'
    },
    { 
      day: 50, 
      task: 'Tuber Initiation', 
      duration: 20,
      image: '🌿',
      taskList: [
        'Maintain consistent moisture',
        'Monitor for blight disease',
        'Control aphids and beetles',
        'Mulch to conserve moisture'
      ],
      tips: 'Most critical stage for yield'
    },
    { 
      day: 90, 
      task: 'Final Harvest', 
      duration: 15,
      image: '🥔',
      taskList: [
        'Wait 2 weeks after vine death',
        'Dig carefully to avoid damage',
        'Cure in shade for 1 week',
        'Store in cool, dark place'
      ],
      tips: 'Do not wash before storage'
    },
  ],
};

const addDays = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

export const CropCalendarView: React.FC = () => {
  const [crop, setCrop] = useState<CropKey>('Tomato');
  const [sowingDate, setSowingDate] = useState<string>('');
  const [completedStages, setCompletedStages] = useState<Record<string, number[]>>({
    Tomato: [],
    Corn: [],
    Potato: [],
  });
  const [manualProgress, setManualProgress] = useState<Record<string, number | null>>({
    Tomato: null,
    Corn: null,
    Potato: null,
  });
  const [activityLog, setActivityLog] = useState<Record<string, string[]>>({
    Tomato: [],
    Corn: [],
    Potato: [],
  });
  const [showGuide, setShowGuide] = useState<{ stage: string; tips: string } | null>(null);
  const [activityNote, setActivityNote] = useState<string>('');
  const [selectedStageDay, setSelectedStageDay] = useState<number | null>(null);

  const daysSince = useMemo(() => {
    if (!sowingDate) return null;
    const start = new Date(sowingDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, [sowingDate]);

  const stages = CROP_DATA[crop];

  const getStageStatus = (day: number, duration: number): 'done' | 'active' | 'future' => {
    // Check if manually marked as completed
    if (completedStages[crop]?.includes(day)) return 'done';

    const effectiveDaysSince = manualProgress[crop] ?? daysSince;
    if (effectiveDaysSince === null || effectiveDaysSince === undefined) return 'future';

    const stageEnd = day + duration;
    if (effectiveDaysSince > stageEnd) return 'done';
    if (effectiveDaysSince >= day && effectiveDaysSince <= stageEnd) return 'active';
    return 'future';
  };

  const handleMarkComplete = (stageDay: number, duration: number) => {
    const nextDay = stageDay + duration + 1;

    setCompletedStages(prev => ({
      ...prev,
      [crop]: [...new Set([...prev[crop], stageDay])]
    }));

    setManualProgress(prev => ({
      ...prev,
      [crop]: nextDay,
    }));
  };

  const handleLogActivity = (stageDay: number) => {
    setSelectedStageDay(stageDay);
  };

  const submitActivity = () => {
    if (selectedStageDay !== null && activityNote.trim()) {
      const timestamp = new Date().toLocaleString('en-IN');
      setActivityLog(prev => ({
        ...prev,
        [crop]: [...prev[crop], `Day ${selectedStageDay}: ${activityNote} (${timestamp})`]
      }));
      setActivityNote('');
      setSelectedStageDay(null);
    }
  };

  const handleViewGuide = (stageName: string, tips: string) => {
    setShowGuide({ stage: stageName, tips });
  };

  return (
    <div className="space-y-6 pb-8 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Header with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-xl shadow-2xl">
              <Calendar size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white mb-1">My Crop Timeline</h1>
              <p className="text-green-100 text-sm font-medium">Track your crop from seed to harvest with real-time guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Form with Glassmorphism */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 space-y-5">
        <div>
          <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Leaf size={14} className="text-green-600" />
            Select Your Crop
          </label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value as CropKey)}
            className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-green-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-semibold text-gray-800 shadow-sm"
          >
            {Object.keys(CROP_DATA).map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sun size={14} className="text-orange-600" />
            Planting Date
          </label>
          <input
            type="date"
            value={sowingDate}
            onChange={(e) => setSowingDate(e.target.value)}
            className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-green-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-semibold text-gray-800 shadow-sm"
          />
        </div>

        {/* Progress Summary */}
        {daysSince !== null && daysSince >= 0 && (
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-green-100 uppercase tracking-wider mb-1">Days Since Planting</p>
                <p className="text-5xl font-black mb-1">{daysSince}</p>
                <p className="text-sm text-green-100">Keep it growing strong! 💪</p>
              </div>
              <div className="text-6xl opacity-20">
                <Sprout size={80} />
              </div>
            </div>
          </div>
        )}

        {daysSince !== null && daysSince < 0 && (
          <div className="bg-orange-50/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-orange-200 text-orange-800 text-sm flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="font-semibold">Your planting date is in the future. Adjust the date to start tracking.</span>
          </div>
        )}

        {!sowingDate && (
          <div className="bg-blue-50/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-blue-200 text-blue-800 text-sm flex items-center gap-3">
            <Calendar size={20} />
            <span className="font-semibold">Select a planting date above to see your personalized crop timeline.</span>
          </div>
        )}
      </div>

      {/* Professional Vertical Stepper with Glassmorphism */}
      {sowingDate && (
        <div className="relative">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage.day, stage.duration);
            const isLast = index === stages.length - 1;
            const isActive = status === 'active';
            const isDone = status === 'done';
            const startDate = formatDate(addDays(new Date(sowingDate), stage.day));
            const endDate = formatDate(addDays(new Date(sowingDate), stage.day + stage.duration));

            return (
              <div key={stage.day} className="relative pl-16 pb-12 last:pb-0">
                {/* Vertical Connector Line */}
                {!isLast && (
                  <div
                    className={`absolute left-[31px] top-16 bottom-0 w-1 transition-all duration-500 ${
                      isDone ? 'bg-gradient-to-b from-green-500 to-green-400' : 'bg-gray-300'
                    }`}
                  />
                )}

                {/* Step Icon Node */}
                <div
                  className={`absolute left-0 top-3 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 border-4 ${
                    isDone
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-200 scale-100'
                      : isActive
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-200 scale-110 animate-pulse'
                      : 'bg-white border-gray-300 scale-90'
                  }`}
                >
                  {isDone && <CheckCircle size={32} className="text-white" strokeWidth={3} />}
                  {isActive && <Sprout size={32} className="text-white animate-bounce" />}
                  {!isDone && !isActive && <Clock size={28} className="text-gray-400" />}
                </div>

                {/* Stage Card with Glassmorphism */}
                <div
                  className={`relative transition-all duration-500 ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border-2 border-blue-300/50 scale-105'
                      : isDone
                      ? 'bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-green-200/50'
                      : 'bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-md border border-gray-200/50'
                  }`}
                >
                  {/* Stage Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-5xl">{stage.image}</span>
                      <div>
                        <h3
                          className={`text-xl font-black leading-tight ${
                            isActive ? 'text-blue-900' : isDone ? 'text-green-800' : 'text-gray-600'
                          }`}
                        >
                          {stage.task}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs font-semibold">
                          <span className={`${isActive ? 'text-blue-700' : isDone ? 'text-green-700' : 'text-gray-500'}`}>
                            Day {stage.day}–{stage.day + stage.duration}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className={`${isActive ? 'text-blue-700' : isDone ? 'text-green-700' : 'text-gray-500'}`}>
                            {startDate} → {endDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${
                        isDone
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                          : isActive
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 animate-pulse'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isDone ? '✓ Done' : isActive ? '● Active' : 'Upcoming'}
                    </span>
                  </div>

                  {/* Active Stage: Expanded Card with Task List */}
                  {isActive && (
                    <div className="mt-5 space-y-4 animate-fade-in">
                      {/* Task Checklist */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-blue-200">
                        <h4 className="text-sm font-black text-blue-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Package size={16} />
                          Tasks for This Stage
                        </h4>
                        <ul className="space-y-3">
                          {stage.taskList.map((task, idx) => (
                            <li key={idx} className="flex items-start gap-3 group">
                              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500 transition-colors">
                                <span className="text-xs font-bold text-blue-700 group-hover:text-white">{idx + 1}</span>
                              </div>
                              <span className="text-sm text-gray-800 font-medium leading-relaxed">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Expert Tip */}
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">💡</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-amber-900 uppercase tracking-wider mb-1">Expert Tip</p>
                          <p className="text-sm text-amber-800 font-medium">{stage.tips}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button 
                          onClick={() => handleMarkComplete(stage.day, stage.duration)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group active:scale-95"
                        >
                          <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                          Mark Complete
                        </button>
                        <button 
                          onClick={() => handleLogActivity(stage.day)}
                          className="bg-white/80 backdrop-blur-sm text-blue-700 text-sm font-bold py-3 px-4 rounded-xl hover:bg-white transition-all border-2 border-blue-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                        >
                          <Droplets size={18} />
                          Log Activity
                        </button>
                        <button 
                          onClick={() => handleViewGuide(stage.task, stage.tips)}
                          className="bg-white/80 backdrop-blur-sm text-green-700 text-sm font-bold py-3 px-4 rounded-xl hover:bg-white transition-all border-2 border-green-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                        >
                          <Leaf size={18} />
                          Guide
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Completed Stage Summary */}
                  {isDone && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-green-700 font-semibold">
                      <CheckCircle size={14} />
                      <span>Completed successfully</span>
                    </div>
                  )}

                  {/* Future Stage Lock */}
                  {!isDone && !isActive && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 font-semibold">
                      <Clock size={14} />
                      <span>Starts in {stage.day - (daysSince ?? 0)} days</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Activity Log Section */}
      {sowingDate && activityLog[crop]?.length > 0 && (
          <div className="mt-8 bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-green-200/50">
            <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
              <Droplets size={20} className="text-blue-600" />
              Activity Log
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activityLog[crop].map((log, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700 border-l-4 border-blue-500">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-gray-800">{showGuide.stage}</h2>
              <button 
                onClick={() => setShowGuide(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
                <p className="text-sm font-black text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  Expert Guide
                </p>
                <p className="text-base text-gray-800 leading-relaxed font-medium">{showGuide.tips}</p>
              </div>
              <button 
                onClick={() => setShowGuide(null)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {selectedStageDay !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-gray-800">Log Activity</h2>
              <button 
                onClick={() => {
                  setSelectedStageDay(null);
                  setActivityNote('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  What did you do? (Day {selectedStageDay})
                </label>
                <textarea 
                  value={activityNote}
                  onChange={(e) => setActivityNote(e.target.value)}
                  placeholder="E.g., Applied fertilizer, watered plants, checked for diseases..."
                  className="w-full p-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none h-32 font-medium text-gray-800"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setSelectedStageDay(null);
                    setActivityNote('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitActivity}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
                  disabled={!activityNote.trim()}
                >
                  Save Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
