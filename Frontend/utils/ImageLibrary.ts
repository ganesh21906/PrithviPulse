/**
 * Centralized Image Library for PrithviPulse
 * High-quality Unsplash images for farming activities, crops, tools, and diseases
 */

/**
 * Mapping of farming keywords to Unsplash image URLs
 * Organized by category for easy discovery and maintenance
 */
export const ONLINE_IMAGES: Record<string, string> = {
  // Actions - Farming Operations (All unique images)
  sowing: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=800&h=600&fit=crop', // Hands planting seeds
  spraying: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop', // Sprayer equipment
  spraying_pesticide: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
  spraying_fertilizer: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop',
  mixing: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop', // Soil mixing
  irrigation: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&h=600&fit=crop', // Water irrigation
  watering: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&h=600&fit=crop',
  harvesting: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&h=600&fit=crop', // Harvest hands
  pruning: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop', // Pruning plants
  weeding: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&h=600&fit=crop', // Hands in soil
  plowing: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop', // Tractor plowing
  planting: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&h=600&fit=crop', // Planting hands
  soil_preparation: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
  fertilizing: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop',
  mulching: 'https://images.unsplash.com/photo-1615671524811-0e1a0b50c027?w=800&h=600&fit=crop',

  // Crops (All unique crop images)
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop', // Wheat field
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop', // Rice paddy
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcccf?w=800&h=600&fit=crop', // Tomatoes
  chili: 'https://images.unsplash.com/photo-1583663848850-46af76e88367?w=800&h=600&fit=crop', // Red chilies
  chilli: 'https://images.unsplash.com/photo-1583663848850-46af76e88367?w=800&h=600&fit=crop',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop', // Potatoes
  corn: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&h=600&fit=crop', // Corn field
  maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&h=600&fit=crop',
  cotton: 'https://images.unsplash.com/photo-1566932364895-6319a1c9d0e1?w=800&h=600&fit=crop', // Cotton plants
  sugarcane: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop', // Sugarcane
  groundnut: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=800&h=600&fit=crop', // Peanuts
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&h=600&fit=crop', // Cabbage
  onion: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=800&h=600&fit=crop', // Onions
  apple: 'https://images.unsplash.com/photo-1560806674-9c11aae5fcc5?w=800&h=600&fit=crop', // Apples
  mango: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&h=600&fit=crop', // Mangoes

  // Tools & Equipment (All unique)
  tractor: 'https://images.unsplash.com/photo-1589922819940-a5d6d6e07af5?w=800&h=600&fit=crop', // Red tractor
  sprayer: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop', // Sprayer
  drone: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&h=600&fit=crop', // Agricultural drone
  pump: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop', // Water pump
  pipe: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&h=600&fit=crop', // Irrigation pipe
  hose: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&h=600&fit=crop',
  shovel: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&h=600&fit=crop', // Shovel in soil
  rake: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&h=600&fit=crop',

  // Diseases & Pests (All unique)
  leaf_disease: 'https://images.unsplash.com/photo-1595348020949-87cdfbb44174?w=800&h=600&fit=crop', // Diseased leaf
  powdery_mildew: 'https://images.unsplash.com/photo-1595348020949-87cdfbb44174?w=800&h=600&fit=crop',
  rust: 'https://images.unsplash.com/photo-1585127365443-7f6e57f4b8a4?w=800&h=600&fit=crop', // Rust disease
  blight: 'https://images.unsplash.com/photo-1585127365443-7f6e57f4b8a4?w=800&h=600&fit=crop',
  pest: 'https://images.unsplash.com/photo-1516639913691-ac5ba76ff7a2?w=800&h=600&fit=crop', // Insects on plant
  insect: 'https://images.unsplash.com/photo-1516639913691-ac5ba76ff7a2?w=800&h=600&fit=crop',

  // General / Fallback (All unique)
  farming: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=800&h=600&fit=crop', // General farming
  field: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop', // Green field
  crop: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop', // Growing crops
  farmer: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&h=600&fit=crop', // Farmer hands
  farm: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop', // Farm landscape
  soil: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&h=600&fit=crop', // Rich soil
  seeds: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop', // Seeds in hand
  plants: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=600&fit=crop', // Young plants
  growth: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=600&fit=crop',
  healthy: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop', // Healthy crop
};

/**
 * Get an image URL for a given keyword
 * @param keyword - The farming activity, crop, or tool name
 * @returns - Unsplash image URL with fallback to generic farming image
 */
export const getOnlineImage = (keyword: string): string => {
  if (!keyword) return ONLINE_IMAGES.farming;

  const normalized = keyword.toLowerCase().trim();

  // Try exact match first
  if (ONLINE_IMAGES[normalized]) {
    return ONLINE_IMAGES[normalized];
  }

  // Try partial match (check if keyword is part of any key)
  for (const [key, url] of Object.entries(ONLINE_IMAGES)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return url;
    }
  }

  // Default fallback
  return ONLINE_IMAGES.farming;
};

/**
 * Get all images in a specific category
 * @param category - One of: 'actions', 'crops', 'tools', 'diseases', 'general'
 * @returns - Array of image URLs
 */
export const getImagesByCategory = (category: 'actions' | 'crops' | 'tools' | 'diseases' | 'general'): string[] => {
  const categoryMap: Record<string, string[]> = {
    actions: ['sowing', 'spraying', 'mixing', 'irrigation', 'harvesting', 'pruning', 'weeding', 'plowing', 'planting'],
    crops: ['wheat', 'rice', 'tomato', 'chili', 'potato', 'corn', 'cotton', 'sugarcane', 'apple', 'mango'],
    tools: ['tractor', 'sprayer', 'drone', 'pump', 'pipe', 'shovel', 'rake'],
    diseases: ['leaf_disease', 'powdery_mildew', 'rust', 'blight', 'pest'],
    general: ['farming', 'field', 'crop', 'farmer', 'farm', 'soil', 'seeds', 'plants', 'growth'],
  };

  const keys = categoryMap[category] || [];
  return keys.map((key) => ONLINE_IMAGES[key]).filter(Boolean);
};

/**
 * Get optimized image URL with custom width parameter
 * @param keyword - The farming activity, crop, or tool name
 * @param width - Image width in pixels (default: 800)
 * @returns - Optimized Unsplash image URL
 */
export const getOptimizedImage = (keyword: string, width: number = 800): string => {
  const baseUrl = getOnlineImage(keyword);
  if (baseUrl.includes('?')) {
    return baseUrl.replace(/w=\d+/, `w=${width}`);
  }
  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}w=${width}`;
};

/**
 * Preload images into browser memory for better performance
 * @param keywords - Array of keywords to preload
 */
export const preloadImages = (keywords: string[]): void => {
  keywords.forEach((keyword) => {
    const img = new Image();
    img.src = getOnlineImage(keyword);
  });
};

/**
 * Get a random image from a specific category
 * @param category - One of: 'actions', 'crops', 'tools', 'diseases', 'general'
 * @returns - Random image URL from the category
 */
export const getRandomImageFromCategory = (category: 'actions' | 'crops' | 'tools' | 'diseases' | 'general'): string => {
  const images = getImagesByCategory(category);
  return images.length > 0 ? images[Math.floor(Math.random() * images.length)] : ONLINE_IMAGES.farming;
};

/**
 * Get all available image URLs (useful for debugging)
 * @returns - Flat array of all unique image URLs
 */
export const getAllImageUrls = (): string[] => {
  return Array.from(new Set(Object.values(ONLINE_IMAGES)));
};

export default ONLINE_IMAGES;
