/**
 * Smart Image Mapper for PrithviPulse
 * Provides high-quality, verified farm images for all farming activities and crops
 * All image URLs are optimized for performance
 */

/**
 * Maps farming keywords to high-quality farm images
 * @param keyword - Activity, crop, or farming term
 * @returns Optimized image URL from CDN
 */
export const getSmartImage = (keyword: string): string => {
  if (!keyword) return getDefaultImage();
  
  const k = keyword.toLowerCase().trim();

  // ==========================================
  // 🚜 FARMING ACTIONS (Timeline Steps)
  // ==========================================
  
  // 1. Plowing / Soil Preparation / Land Prep
  if (k.includes('plow') || k.includes('till') || k.includes('soil prep') || k.includes('land prep') || k.includes('deep plough')) {
    return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800&auto=format&fit=crop';
  }

  // 2. Sowing / Seeding / Nursery / Planting
  if (k.includes('sow') || k.includes('seed') || k.includes('plant') || k.includes('nursery') || k.includes('germinat') || k.includes('transplant')) {
    return 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=800&auto=format&fit=crop';
  }

  // 3. Irrigation / Watering / Drip System
  if (k.includes('water') || k.includes('irrigat') || k.includes('drip') || k.includes('sprinkler') || k.includes('moisture')) {
    return 'https://images.unsplash.com/photo-1563514227146-84914e3e008f?q=80&w=800&auto=format&fit=crop';
  }

  // 4. Fertilizer / Manure / FYM / Nutrition / Compost
  if (k.includes('fertiliz') || k.includes('manure') || k.includes('compost') || k.includes('fym') || k.includes('nutrition') || k.includes('urea') || k.includes('npk')) {
    return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop';
  }

  // 5. Spray / Pesticide / Pest Control / Disease Management
  if (k.includes('spray') || k.includes('pest') || k.includes('insect') || k.includes('fungicid') || k.includes('neem') || k.includes('protection') || k.includes('micronutrient')) {
    return 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop';
  }

  // 6. Pruning / Cutting / Trimming
  if (k.includes('prun') || k.includes('trim') || k.includes('cut leaves') || k.includes('remove')) {
    return 'https://images.unsplash.com/photo-1599599810694-f3ee39e00e4d?q=80&w=800&auto=format&fit=crop';
  }

  // 7. Harvest / Picking / Collection / Yield
  if (k.includes('harvest') || k.includes('pick') || k.includes('collect') || k.includes('yield') || k.includes('reap')) {
    return 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=800&auto=format&fit=crop';
  }

  // 8. Weeding / Weed Removal
  if (k.includes('weed') || k.includes('grass removal')) {
    return 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop';
  }

  // 9. Monitoring / Inspection / Observation
  if (k.includes('monitor') || k.includes('inspect') || k.includes('check') || k.includes('observ') || k.includes('eye')) {
    return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop';
  }

  // 10. Mixing / Preparation / Solution Making
  if (k.includes('mix') || k.includes('blend') || k.includes('prepare solution')) {
    return 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop';
  }

  // ==========================================
  // 🌾 CROP TYPES (Dashboard & Advisor)
  // ==========================================

  // Rice / Paddy
  if (k.includes('rice') || k.includes('paddy') || k.includes('dhan')) {
    return 'https://images.unsplash.com/photo-1536622438883-7c25c38d47b5?q=80&w=800&auto=format&fit=crop';
  }

  // Wheat / Gehu
  if (k.includes('wheat') || k.includes('gehu')) {
    return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop';
  }

  // Tomato / Tamatar
  if (k.includes('tomato') || k.includes('tamatar')) {
    return 'https://images.unsplash.com/photo-1592982537447-788383c31d37?q=80&w=800&auto=format&fit=crop';
  }

  // Chilli / Pepper / Mirchi
  if (k.includes('chilli') || k.includes('chili') || k.includes('pepper') || k.includes('mirch') || k.includes('capsicum')) {
    return 'https://images.unsplash.com/photo-1591181520189-83c93f9dc955?q=80&w=800&auto=format&fit=crop';
  }

  // Cotton / Kapas
  if (k.includes('cotton') || k.includes('kapas')) {
    return 'https://images.unsplash.com/photo-1566932364895-6319a1c9d0e1?q=80&w=800&auto=format&fit=crop';
  }

  // Maize / Corn / Makka
  if (k.includes('maize') || k.includes('corn') || k.includes('makka')) {
    return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800&auto=format&fit=crop';
  }

  // Sugarcane / Ganna
  if (k.includes('sugar') || k.includes('ganna') || k.includes('cane')) {
    return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop';
  }

  // Potato / Aloo
  if (k.includes('potato') || k.includes('aloo')) {
    return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop';
  }

  // Onion / Pyaz
  if (k.includes('onion') || k.includes('pyaz')) {
    return 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?q=80&w=800&auto=format&fit=crop';
  }

  // Groundnut / Peanut / Moongphali
  if (k.includes('groundnut') || k.includes('peanut') || k.includes('moongphali')) {
    return 'https://images.unsplash.com/photo-1563548975-f554625be2e2?q=80&w=800&auto=format&fit=crop';
  }

  // Soybean / Soya
  if (k.includes('soy') || k.includes('soya')) {
    return 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=800&auto=format&fit=crop';
  }

  // Cabbage / Patta Gobi
  if (k.includes('cabbage') || k.includes('gobi')) {
    return 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=800&auto=format&fit=crop';
  }

  // Okra / Bhindi / Lady Finger
  if (k.includes('okra') || k.includes('bhindi') || k.includes('lady finger')) {
    return 'https://images.unsplash.com/photo-1599374982985-34a26193ea0e?q=80&w=800&auto=format&fit=crop';
  }

  // Gram / Chana / Chickpea
  if (k.includes('gram') || k.includes('chana') || k.includes('chickpea')) {
    return 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop';
  }

  // Mustard / Sarson
  if (k.includes('mustard') || k.includes('sarson')) {
    return 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop';
  }

  // ==========================================
  // 🌿 PLANT STAGES & CONDITIONS
  // ==========================================

  // Healthy / Green / Growing
  if (k.includes('healthy') || k.includes('green') || k.includes('good') || k.includes('excellent')) {
    return 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=800&auto=format&fit=crop';
  }

  // Flowering / Blooming
  if (k.includes('flower') || k.includes('bloom') || k.includes('blossom')) {
    return 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop';
  }

  // Leaf / Foliage
  if (k.includes('leaf') || k.includes('foliage') || k.includes('patta')) {
    return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop';
  }

  // ==========================================
  // 🛠️ TOOLS & EQUIPMENT
  // ==========================================

  // Tractor
  if (k.includes('tractor') || k.includes('machine')) {
    return 'https://images.unsplash.com/photo-1589922819940-a5d6d6e07af5?q=80&w=800&auto=format&fit=crop';
  }

  // Sprayer Equipment
  if (k.includes('sprayer') || k.includes('pump')) {
    return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop';
  }

  // Tools / Implements
  if (k.includes('tool') || k.includes('implement') || k.includes('equipment')) {
    return 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=800&auto=format&fit=crop';
  }

  // ==========================================
  // 💰 FINANCIAL & MARKET CONTEXT
  // ==========================================

  // Market / Mandi / Trading
  if (k.includes('market') || k.includes('mandi') || k.includes('price') || k.includes('trading')) {
    return 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=800&auto=format&fit=crop';
  }

  // Money / Profit / Finance / ROI
  if (k.includes('profit') || k.includes('money') || k.includes('cost') || k.includes('finance') || k.includes('roi') || k.includes('revenue')) {
    return 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop';
  }

  // Risk / Warning / Alert
  if (k.includes('risk') || k.includes('warning') || k.includes('alert') || k.includes('danger')) {
    return 'https://images.unsplash.com/photo-1534188753412-5e27b47b2a3b?q=80&w=800&auto=format&fit=crop';
  }

  // ==========================================
  // 🌍 ENVIRONMENTAL & GENERAL
  // ==========================================

  // Field / Farm / Land
  if (k.includes('field') || k.includes('farm') || k.includes('land') || k.includes('agriculture')) {
    return 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop';
  }

  // Soil / Earth
  if (k.includes('soil') || k.includes('earth') || k.includes('mitti')) {
    return 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop';
  }

  // Sun / Sunny / Sunlight
  if (k.includes('sun') || k.includes('sunny') || k.includes('sunlight') || k.includes('bright')) {
    return 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=800&auto=format&fit=crop';
  }

  // Rain / Water Drops / Monsoon
  if (k.includes('rain') || k.includes('monsoon') || k.includes('droplet') || k.includes('wet')) {
    return 'https://images.unsplash.com/photo-1534274988757-a28bf1a4c817?q=80&w=800&auto=format&fit=crop';
  }

  // ==========================================
  // 🌍 DEFAULT FALLBACK
  // ==========================================
  return getDefaultImage();
};

/**
 * Returns the default fallback image (green field)
 */
export const getDefaultImage = (): string => {
  return 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop';
};

/**
 * Preload images for better performance
 * @param keywords - Array of keywords to preload
 */
export const preloadSmartImages = (keywords: string[]): void => {
  if (typeof window === 'undefined') return;
  
  keywords.forEach((keyword) => {
    const img = new Image();
    img.src = getSmartImage(keyword);
  });
};

/**
 * Get optimized image with custom width
 * @param keyword - Image keyword
 * @param width - Desired width (default 800)
 */
export const getOptimizedSmartImage = (keyword: string, width: number = 800): string => {
  const baseUrl = getSmartImage(keyword);
  return baseUrl.replace(/w=\d+/, `w=${width}`);
};

/**
 * Get images for a specific category
 * @param category - Category type
 */
export const getSmartImagesByCategory = (category: 'actions' | 'crops' | 'tools' | 'market'): string[] => {
  const keywords: Record<string, string[]> = {
    actions: ['plowing', 'sowing', 'irrigation', 'fertilizer', 'spray', 'harvest'],
    crops: ['rice', 'wheat', 'tomato', 'chilli', 'cotton', 'maize'],
    tools: ['tractor', 'sprayer', 'tool'],
    market: ['market', 'money', 'profit']
  };

  return (keywords[category] || []).map(k => getSmartImage(k));
};

export default getSmartImage;
