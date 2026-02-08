import { Language, Translation, WeatherData, MarketItem, Notification, CropCalendarEntry } from './types';

export const LOCALES: Record<Language, Translation> = {
  [Language.ENGLISH]: {
    navHome: "Home",
    navCrops: "My Farm",
    navFarmPlanner: "Farm Planner",
    navScan: "Scan",
    navMarket: "Market",
    navProfile: "Profile",

    appTitle: "PrithviPulse",
    greeting: "Namaste, Farmer",
    
    weatherTitle: "Weather Forecast",
    alertsTitle: "Alerts & Updates",
    quickActions: "Quick Actions",
    
    scanLeaf: "Scan Disease",
    scanDesc: "Identify crop diseases instantly",
    smartAdvisory: "Smart Strategy",
    advisoryDesc: "Plan your next sowing",
    marketPrices: "Mandi Prices",
    
    takePhoto: "Take Photo / Upload",
    analyzing: "Consulting AI Expert...",
    healthy: "Healthy Crop",
    diseased: "Disease Detected",
    treatment: "Treatment",
    prevention: "Prevention",
    askAdvice: "Get Recommendations",
    soilType: "Soil Type",
    season: "Current Season",
    enterSoil: "e.g., Red Loam",
    enterSeason: "e.g., Winter",
    submit: "Get Advice",
    listen: "Listen",
    speak: "Tap to Speak",
    back: "Back",
    uploadImage: "Upload Image",
    
    marketTitle: "Market Trends",
    price: "Price",
    trend: "Trend",

    profileTitle: "My Profile",
    myDetails: "Personal Details",
    save: "Save Changes",

    calendarTitle: "Crop Calendar",
    calendarDesc: "Sowing & Harvest Planner",
    myCalendar: "My Calendar",
    viewCalendar: "View Calendar",
    stageSowing: "Sowing",
    stageGrowth: "Growth",
    stageFlowering: "Flowering",
    stageHarvest: "Harvest",
    currentStage: "Current Stage",
    days: "days",
    
    filterSeason: "Season",
    filterType: "Type",
    myCropsOnly: "My Crops",
    sowing: "Sowing",
    harvest: "Harvest"
  },
  [Language.HINDI]: {
    navHome: "मुखपृष्ठ",
    navCrops: "मेरी फसलें",
    navFarmPlanner: "फार्म प्लानर",
    navScan: "स्कैन",
    navMarket: "बाज़ार",
    navProfile: "प्रोफ़ाइल",

    appTitle: "पृथ्वी पल्स",
    greeting: "नमस्ते किसान",
    
    weatherTitle: "मौसम का पूर्वानुमान",
    alertsTitle: "चेतावनी और अपडेट",
    quickActions: "त्वरित कार्य",
    
    scanLeaf: "रोग स्कैन करें",
    scanDesc: "फसल रोगों की पहचान करें",
    smartAdvisory: "स्मार्ट रणनीति",
    advisoryDesc: "अगली बुवाई की योजना बनाएं",
    marketPrices: "मंडी भाव",
    
    takePhoto: "फोटो लें",
    analyzing: "विशेषज्ञ से पूछ रहे हैं...",
    healthy: "स्वस्थ फसल",
    diseased: "रोग का पता चला",
    treatment: "उपचार",
    prevention: "बचाव",
    askAdvice: "सलाह लें",
    soilType: "मिट्टी का प्रकार",
    season: "मौसम",
    enterSoil: "जैसे, काली मिट्टी",
    enterSeason: "जैसे, सर्दी",
    submit: "सलाह लें",
    listen: "सुनें",
    speak: "बोलें",
    back: "वापस",
    uploadImage: "फोटो अपलोड करें",
    
    marketTitle: "बाज़ार रुझान",
    price: "भाव",
    trend: "रुझान",

    profileTitle: "मेरी प्रोफ़ाइल",
    myDetails: "व्यक्तिगत विवरण",
    save: "सहेजें",

    calendarTitle: "फसल कैलेंडर",
    calendarDesc: "बुवाई और कटाई योजना",
    myCalendar: "मेरा कैलेंडर",
    viewCalendar: "कैलेंडर देखें",
    stageSowing: "बुवाई",
    stageGrowth: "विकास",
    stageFlowering: "फूल आना",
    stageHarvest: "कटाई",
    currentStage: "वर्तमान चरण",
    days: "दिन",
    
    filterSeason: "सीज़न",
    filterType: "प्रकार",
    myCropsOnly: "मेरी फसलें",
    sowing: "बुवाई",
    harvest: "कटाई"
  },
  [Language.TAMIL]: {
    navHome: "முகப்பு",
    navCrops: "பயிர்கள்",
    navFarmPlanner: "பண்ணை திட்டம்",
    navScan: "ஸ்கேன்",
    navMarket: "சந்தை",
    navProfile: "சுயவிவரம்",

    appTitle: "பிரித்வி பல்ஸ்",
    greeting: "வணக்கம்",
    
    weatherTitle: "வானிலை",
    alertsTitle: "எச்சரிக்கைகள்",
    quickActions: "விரைவு செயல்கள்",
    
    scanLeaf: "நோய் ஸ்கேன்",
    scanDesc: "நோய்களை கண்டறியவும்",
    smartAdvisory: "ஸ்மார்ட் திட்டம்",
    advisoryDesc: "அடுத்த பயிரை திட்டமிடுங்கள்",
    marketPrices: "சந்தை விலை",
    
    takePhoto: "புகைப்படம் எடு",
    analyzing: "ஆய்வு செய்கிறது...",
    healthy: "ஆரோக்கியமான பயிர்",
    diseased: "நோய் கண்டறியப்பட்டது",
    treatment: "சிகிச்சை",
    prevention: "தடுப்பு",
    askAdvice: "ஆலோசனை",
    soilType: "மண் வகை",
    season: "பருவம்",
    enterSoil: "எ.கா., செம்மண்",
    enterSeason: "எ.கா., குளிர்காலம்",
    submit: "சமர்ப்பிக்கவும்",
    listen: "கேளுங்கள்",
    speak: "பேசுங்கள்",
    back: "திரும்ப",
    uploadImage: "பதிவேற்றவும்",
    
    marketTitle: "சந்தை நிலவரம்",
    price: "விலை",
    trend: "போக்கு",

    profileTitle: "என் விவரம்",
    myDetails: "தனிப்பட்ட விவரங்கள்",
    save: "சேமி",

    calendarTitle: "பயிர் நாட்காட்டி",
    calendarDesc: "திட்டமிடல்",
    myCalendar: "என் நாட்காட்டி",
    viewCalendar: "நாட்காட்டியைப் பார்க்கவும்",
    stageSowing: "விதைப்பு",
    stageGrowth: "வளர்ச்சி",
    stageFlowering: "பூக்கும்",
    stageHarvest: "அறுவடை",
    currentStage: "தற்போதைய நிலை",
    days: "நாட்கள்",
    
    filterSeason: "பருவம்",
    filterType: "வகை",
    myCropsOnly: "என் பயிர்கள்",
    sowing: "விதைப்பு",
    harvest: "அறுவடை"
  }
};

export const MOCK_WEATHER: WeatherData = {
  temp: 28,
  condition: 'Partly Cloudy',
  location: 'Coimbatore, India',
  humidity: 65,
  windSpeed: 12,
  updatedAt: 'Today, 9:30 AM',
  forecast: [
    { day: 'Tue', icon: '☀️', temp: 29 },
    { day: 'Wed', icon: '⛅', temp: 27 },
    { day: 'Thu', icon: '🌧️', temp: 24 },
  ]
};

export const MOCK_MARKET_DATA: MarketItem[] = [
  { id: '1', crop: 'Tomato (Hybrid)', price: 1800, unit: '₹/Quintal', trend: 'up', change: '+5%' },
  { id: '2', crop: 'Onion (Red)', price: 2200, unit: '₹/Quintal', trend: 'down', change: '-2%' },
  { id: '3', crop: 'Wheat (Lokwan)', price: 2600, unit: '₹/Quintal', trend: 'stable', change: '0%' },
  { id: '4', crop: 'Soybean', price: 4800, unit: '₹/Quintal', trend: 'up', change: '+8%' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'alert', title: 'Heavy Rain Alert', message: 'Heavy rainfall expected in next 24h. Secure harvested crops.', time: '2h ago' },
  { id: '2', type: 'info', title: 'Subsidy Scheme', message: 'New solar pump subsidy applications open today.', time: '5h ago' },
];

// Months: 0 = Jan, 11 = Dec
export const MOCK_ADVANCED_CALENDAR_DATA: CropCalendarEntry[] = [
  // CEREALS
  {
    id: '1',
    crop: 'Rice (Paddy)',
    type: 'Cereal',
    season: 'Kharif',
    sowingMonths: [5, 6], // June, July
    harvestMonths: [9, 10], // Oct, Nov
    durationDays: 120,
    note: "Requires heavy water and warm climate. Main Kharif crop in India."
  },
  {
    id: '2',
    crop: 'Wheat',
    type: 'Cereal',
    season: 'Rabi',
    sowingMonths: [10, 11], // Nov, Dec
    harvestMonths: [2, 3], // March, April
    durationDays: 140,
    note: "Cool weather essential. Major Rabi crop requiring moderate irrigation."
  },
  {
    id: '3',
    crop: 'Corn (Maize)',
    type: 'Cereal',
    season: 'Kharif',
    sowingMonths: [5, 6, 7], // June, July, Aug
    harvestMonths: [9, 10, 11], // Sept, Oct, Nov
    durationDays: 90,
    note: "Versatile crop, grows in warm weather. Good rainfall required."
  },
  
  // FRUITS
  {
    id: '4',
    crop: 'Apple',
    type: 'Vegetable',
    season: 'All',
    sowingMonths: [11, 0, 1], // Dec, Jan, Feb (planting season)
    harvestMonths: [7, 8, 9], // Aug, Sept, Oct
    durationDays: 150,
    note: "Temperate climate fruit. Requires cold winters for proper growth."
  },
  {
    id: '5',
    crop: 'Blueberry',
    type: 'Vegetable',
    season: 'All',
    sowingMonths: [9, 10, 11], // Oct, Nov, Dec
    harvestMonths: [4, 5, 6], // May, June, July
    durationDays: 180,
    note: "Requires acidic soil. Cool climate preferred for quality berries."
  },
  {
    id: '6',
    crop: 'Cherry',
    type: 'Vegetable',
    season: 'All',
    sowingMonths: [10, 11, 0], // Nov, Dec, Jan
    harvestMonths: [4, 5, 6], // May, June, July
    durationDays: 150,
    note: "Temperate fruit. Requires chilling hours and well-drained soil."
  },
  {
    id: '7',
    crop: 'Grape',
    type: 'Vegetable',
    season: 'All',
    sowingMonths: [0, 1, 2], // Jan, Feb, March
    harvestMonths: [1, 2, 3, 4], // Feb, March, April, May (next year)
    durationDays: 150,
    note: "Requires warm, dry climate. Multiple harvests possible per year."
  },
  {
    id: '8',
    crop: 'Orange',
    type: 'Vegetable',
    season: 'All',
    sowingMonths: [5, 6, 7], // June, July, Aug
    harvestMonths: [11, 0, 1], // Dec, Jan, Feb
    durationDays: 180,
    note: "Tropical citrus fruit. Requires warm climate and adequate water."
  },
  {
    id: '9',
    crop: 'Peach',
    type: 'Vegetable',
    season: 'All',
    sowingMonths: [11, 0, 1], // Dec, Jan, Feb
    harvestMonths: [4, 5, 6], // May, June, July
    durationDays: 120,
    note: "Stone fruit requiring cold winters. Well-drained soil essential."
  },
  {
    id: '10',
    crop: 'Strawberry',
    type: 'Vegetable',
    season: 'Rabi',
    sowingMonths: [9, 10, 11], // Oct, Nov, Dec
    harvestMonths: [1, 2, 3], // Feb, March, April
    durationDays: 90,
    note: "Cool season crop. Requires well-drained soil and regular watering."
  },
  {
    id: '11',
    crop: 'Raspberry',
    type: 'Vegetable',
    season: 'All',
    sowingMonths: [10, 11, 0], // Nov, Dec, Jan
    harvestMonths: [5, 6, 7], // June, July, Aug
    durationDays: 180,
    note: "Perennial berry crop. Prefers cool climates and acidic soil."
  },
  
  // VEGETABLES
  {
    id: '12',
    crop: 'Tomato',
    type: 'Vegetable',
    season: 'All',
    sowingMonths: [0, 1, 5, 6, 9, 10], // Jan, Feb, June, July, Oct, Nov
    harvestMonths: [3, 4, 8, 9, 0, 1], // April, May, Sept, Oct, Jan, Feb
    durationDays: 75,
    note: "Year-round cultivation possible. Requires warm weather and support."
  },
  {
    id: '13',
    crop: 'Potato',
    type: 'Vegetable',
    season: 'Rabi',
    sowingMonths: [9, 10, 11], // Oct, Nov, Dec
    harvestMonths: [1, 2, 3], // Feb, March, April
    durationDays: 90,
    note: "Cool season crop. Requires loose, well-drained soil."
  },
  {
    id: '14',
    crop: 'Bell Pepper',
    type: 'Vegetable',
    season: 'All',
    sowingMonths: [1, 2, 6, 7], // Feb, March, July, Aug
    harvestMonths: [4, 5, 9, 10], // May, June, Oct, Nov
    durationDays: 75,
    note: "Warm season vegetable. Requires full sunlight and fertile soil."
  },
  {
    id: '15',
    crop: 'Squash',
    type: 'Vegetable',
    season: 'Kharif',
    sowingMonths: [5, 6, 7], // June, July, Aug
    harvestMonths: [8, 9, 10], // Sept, Oct, Nov
    durationDays: 60,
    note: "Summer squash grows quickly. Needs warm soil and regular watering."
  },
  
  // PULSES
  {
    id: '16',
    crop: 'Gram (Chana)',
    type: 'Pulse',
    season: 'Rabi',
    sowingMonths: [9, 10], // Oct, Nov
    harvestMonths: [1, 2], // Feb, March
    durationDays: 110,
    note: "Drought resistant pulse. Grows well in semi-arid regions."
  },
  {
    id: '17',
    crop: 'Soybean',
    type: 'Pulse',
    season: 'Kharif',
    sowingMonths: [5, 6], // June, July
    harvestMonths: [9, 10], // Oct, Nov
    durationDays: 100,
    note: "Oilseed and protein crop. Requires warm weather and good drainage."
  },
  
  // COMMERCIAL CROPS
  {
    id: '18',
    crop: 'Cotton',
    type: 'Commercial',
    season: 'Kharif',
    sowingMonths: [4, 5], // May, June
    harvestMonths: [10, 11, 0], // Nov, Dec, Jan
    durationDays: 160,
    note: "Black soil preferred. Major commercial crop requiring warm climate."
  },
  {
    id: '19',
    crop: 'Sugarcane',
    type: 'Commercial',
    season: 'All',
    sowingMonths: [0, 1, 2, 8, 9, 10], // Jan, Feb, March, Sept, Oct, Nov
    harvestMonths: [11, 0, 1, 2], // Dec, Jan, Feb, March
    durationDays: 365,
    note: "Long duration crop (12-18 months). Requires abundant water."
  }
];