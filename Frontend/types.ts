export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  TAMIL = 'ta'
}

export type ViewState = 'dashboard' | 'crops' | 'crop_advisor' | 'farm_planner' | 'crop_calendar' | 'scan' | 'market' | 'profile' | 'scan_result' | 'weather' | 'live_calendar';

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
  updatedAt?: string;
  forecast: { day: string; icon: string; temp: number }[];
}

export interface DiagnosisResult {
  healthy: boolean;
  diseaseName: string;
  confidence: number;
  treatment: string[];
  preventativeMeasures: string[];
  localName?: string;
  adviceTitle?: string;
  visualAdvice?: VisualAdvice;
  source?: string;  // "Gemini 3 Vision (Primary)" or "Local Model (.h5 CNN) - FALLBACK"
  is_plant?: boolean;
  visual_symptoms?: string;
  method?: string;  // "gemini_vision" or "local_model_fallback"
}

export interface VisualAdvice {
  title: string;
  medicine_name: string;
  treatment?: string;
  prevention?: string;
  steps: TreatmentStep[];
}

export interface TreatmentStep {
  action: string;
  description: string;
  icon: 'spray' | 'cut' | 'water' | 'leaf' | 'package' | 'eye' | 'sun' | 'droplets';
  image_query: string;
}

export interface CropAdvice {
  cropName: string;
  suitability: number; // 0-100
  reason: string;
  marketTrend: 'Up' | 'Down' | 'Stable';
}

export interface MarketItem {
  id: string;
  crop: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
}

export interface CropCalendarEntry {
  id: string;
  crop: string;
  type: 'Cereal' | 'Pulse' | 'Vegetable' | 'Commercial' | 'Fruit';
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'All';
  sowingMonths: number[]; // 0-11 (Jan-Dec)
  harvestMonths: number[]; // 0-11
  durationDays: number;
  note?: string;
}

export interface Translation {
  // Navigation
  navHome: string;
  navCrops: string;
  navFarmPlanner: string;
  navScan: string;
  navMarket: string;
  navProfile: string;

  // Header
  appTitle: string;
  greeting: string;
  
  // Dashboard
  weatherTitle: string;
  alertsTitle: string;
  quickActions: string;
  
  // Actions
  scanLeaf: string;
  scanDesc: string;
  smartAdvisory: string;
  advisoryDesc: string;
  marketPrices: string;
  
  // Scan/Advisory
  takePhoto: string;
  analyzing: string;
  healthy: string;
  diseased: string;
  treatment: string;
  prevention: string;
  askAdvice: string;
  soilType: string;
  season: string;
  enterSoil: string;
  enterSeason: string;
  submit: string;
  listen: string;
  speak: string;
  back: string;
  uploadImage: string;
  
  // Market
  marketTitle: string;
  price: string;
  trend: string;

  // Profile
  profileTitle: string;
  myDetails: string;
  save: string;

  // Calendar
  calendarTitle: string;
  calendarDesc: string;
  myCalendar: string;
  viewCalendar: string;
  stageSowing: string;
  stageGrowth: string;
  stageFlowering: string;
  stageHarvest: string;
  currentStage: string;
  days: string;
  
  // Calendar Filters
  filterSeason: string;
  filterType: string;
  myCropsOnly: string;
  sowing: string;
  harvest: string;
}