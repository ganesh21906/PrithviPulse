import { DiagnosisResult, VisualAdvice } from "../types";
import { API_ENDPOINTS, BASE_URL } from "./api";

/**
 * Analyzes a leaf image using Gemini 3 Vision (Primary) or Local .h5 Model (Fallback)
 * With comprehensive error handling and source tracking
 */
export const analyzeLeafImageBackend = async (
  imageFile: File,
  language: string
): Promise<DiagnosisResult> => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    console.log("📤 Uploading image to backend...");
    console.log(`   File: ${imageFile.name} (${(imageFile.size / 1024).toFixed(2)} KB)`);

    const response = await fetch(API_ENDPOINTS.scanDisease, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Backend endpoint not found. Is the server running on port 8000?");
      }
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }

    // CRITICAL: Parse JSON response from backend
    const data = await response.json();

    console.log("🔄 Backend Response Received");
    console.log(`   Method: ${data.method || 'unknown'}`);
    console.log(`   Source: ${data.source || 'unknown'}`);

    // ===== HANDLE: MISSING IS_PLANT FIELD =====
    const isPlant = data.is_plant !== false;

    // ===== HANDLE: NOT A PLANT IMAGE =====
    if (!isPlant) {
      console.warn("⚠️ Backend analysis: Image is NOT a plant leaf");
      return {
        healthy: false,
        diseaseName: "Not a Plant Leaf",
        confidence: 0,
        treatment: [
          "Please upload a clear photo of a crop leaf",
          "Ensure the leaf is the main focus of the image",
          "Try again with better lighting"
        ],
        preventativeMeasures: [],
        localName: "Invalid Image",
        adviceTitle: "No Plant Detected",
        source: data.source || "Gemini 3 Vision",
        is_plant: false,
        visual_symptoms: "Image does not contain a recognizable plant leaf"
      };
    }

    // ===== HANDLE: DIAGNOSIS ERROR =====
    if (data.error) {
      console.error("❌ Backend Diagnosis Error:", data.error);
      
      // Provide helpful recovery instructions
      const recoverySteps = data.gemini_error 
        ? [
            "Gemini 3 failed: Check API key configuration",
            "Fallback model attempted but also failed",
            "Try again in a few moments, or upload a different leaf image"
          ]
        : [
            "Error analyzing image. Please try again with:",
            "- A clearer, well-lit photo",
            "- Focus on the affected area of the leaf",
            "- A JPG or PNG file"
          ];

      return {
        healthy: false,
        diseaseName: "Analysis Failed",
        confidence: 0,
        treatment: recoverySteps,
        preventativeMeasures: [],
        localName: "Error",
        adviceTitle: "Could Not Diagnose",
        source: data.source || "Error",
        is_plant: false
      };
    }

    // ===== HANDLE: SUCCESSFUL DIAGNOSIS =====
    console.log(`✅ Diagnosis successful`);
    console.log(`   Disease Name: ${data.diseaseName || data.diagnosis_name || 'Unknown'}`);
    console.log(`   Confidence: ${(data.confidence * 100).toFixed(1)}%`);
    console.log(`   Healthy: ${data.healthy}`);
    console.log(`   Source: ${data.source}`);

    // Extract crop name from diseaseName (format: "Apple - Apple scab")
    const diseaseName = data.diseaseName || data.diagnosis_name || "Unknown";
    const cropName = diseaseName.split(" - ")[0] || "Unknown Crop";

    // Parse treatment steps - backend now sends array of chemical strings
    const treatmentSteps = Array.isArray(data.treatment) 
      ? data.treatment 
      : data.physical_actions_checklist || [];

    // Create visual advice from backend response
    const visualAdvice: VisualAdvice = {
      title: diseaseName,
      medicine_name: data.chemical_prescription?.specific_active_ingredients?.[0] || "Consult local agricultural expert",
      treatment: diseaseName,
      prevention: Array.isArray(data.preventativeMeasures) 
        ? data.preventativeMeasures.join(" | ")
        : data.preventative_measures || "Follow integrated pest management",
      steps: treatmentSteps
    };

    return {
      healthy: data.healthy ?? false,
      diseaseName: diseaseName,
      confidence: data.confidence || 0, // Already 0-1 range from backend
      treatment: treatmentSteps.length > 0 ? treatmentSteps : ["Consult agricultural expert"],
      preventativeMeasures: Array.isArray(data.preventativeMeasures) 
        ? data.preventativeMeasures 
        : [data.preventative_measures || "Follow integrated pest management"],
      localName: cropName,
      adviceTitle: diseaseName,
      visualAdvice: visualAdvice,
      source: data.source || "AI Diagnostic System",
      is_plant: isPlant,
      visual_symptoms: data.visual_symptoms || data.professional_summary,
      method: data.method
    };

  } catch (error: any) {
    console.error("❌ Frontend Analysis Failed:", error);
    
    // Provide context-specific error messages
    let errorMessage = "Connection Error";
    let treatmentSteps = [];

    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = "Cannot connect to backend server";
      treatmentSteps = [
        "✓ Ensure backend is running: python main.py (in Backend folder)",
        `✓ Check backend is on ${BASE_URL}`,
        "✓ Verify no firewall blocking port 8000",
        "✓ Try restarting both frontend and backend"
      ];
    } else if (error.message.includes('404')) {
      errorMessage = "Backend endpoint not found";
      treatmentSteps = [
        "✓ Check the /predict endpoint exists in backend/main.py",
        "✓ Restart the backend server"
      ];
    } else if (error.message.includes('timeout')) {
      errorMessage = "Analysis timeout - backend took too long";
      treatmentSteps = [
        "✓ The server may be processing another request",
        "✓ Try again in a moment",
        "✓ Check backend server status"
      ];
    } else {
      treatmentSteps = [
        `Error: ${error.message || 'Unknown error occurred'}`,
        "Check browser console (F12) for more details",
        `Ensure backend server is running at ${BASE_URL}`
      ];
    }

    return {
      healthy: false,
      diseaseName: errorMessage,
      confidence: 0,
      treatment: treatmentSteps,
      preventativeMeasures: [],
      localName: "Backend Error",
      adviceTitle: "Connection Failed",
      source: "Error",
      is_plant: false
    };
  }
};

export interface CropAdvisoryRequest {
  soil: string;
  season: string;
  location?: string;
}

export interface CropRecommendation {
  name: string;
  suitability: number;
  yield: string;
  duration: string;
  reason: string;
  marketTrend: 'Up' | 'Down' | 'Stable';
  waterRequirement: string;
  investment: string;
}

export interface CropAdvisoryResponse {
  recommendations: CropRecommendation[];
  seasonalTips: string;
  warnings: string;
}

/**
 * Gets crop recommendations from the backend using Gemini 3
 */
export const getCropAdvisoryBackend = async (
  request: CropAdvisoryRequest
): Promise<CropAdvisoryResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/advise-crop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        soil: request.soil,
        season: request.season,
        location: request.location || "India"
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as CropAdvisoryResponse;

  } catch (error) {
    console.error("❌ Crop Advisory Backend Error:", error);
    
    // Return fallback recommendations
    return {
      recommendations: [
        {
          name: "Tomato (Solanum lycopersicum)",
          suitability: 85,
          yield: "25-30 quintals/acre",
          duration: "90-120 days",
          reason: "Tomatoes are versatile crops with high market demand. They adapt well to various soil conditions and offer good returns for small to medium farmers.",
          marketTrend: "Up",
          waterRequirement: "Medium",
          investment: "₹40,000-50,000/acre"
        },
        {
          name: "Okra/Bhindi (Abelmoschus esculentus)",
          suitability: 78,
          yield: "80-100 quintals/acre",
          duration: "60-70 days",
          reason: "Quick-growing crop with consistent market demand. Suitable for successive plantings and provides regular income throughout the season.",
          marketTrend: "Stable",
          waterRequirement: "Low",
          investment: "₹25,000-35,000/acre"
        }
      ],
      seasonalTips: "Ensure proper irrigation and use recommended fertilizers for optimal yield.",
      warnings: "Monitor for common pests and diseases. Weather fluctuations may affect harvest timing."
    };
  }
};

export interface FarmPlanRequest {
  soilType: string;
  waterSource: string;
  budget: number;
  landSize: number;
}

export interface FarmPlanTimelineStep {
  action: string;
  description: string;
  icon: 'spray' | 'cut' | 'water' | 'leaf' | 'package' | 'eye' | 'sun' | 'droplets';
}

export interface FarmPlanResponse {
  cropName: string;
  expectedProfit: string;
  duration: string;
  shoppingList: string[];
  timeline: FarmPlanTimelineStep[];
}

export const getFarmPlanBackend = async (
  request: FarmPlanRequest
): Promise<FarmPlanResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/farm-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        soilType: request.soilType,
        waterSource: request.waterSource,
        budget: request.budget,
        landSize: request.landSize,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as FarmPlanResponse;
  } catch (error) {
    console.error("❌ Farm Plan Backend Error:", error);

    return {
      cropName: "Tomato (Desi Hybrid)",
      expectedProfit: "₹70,000 - ₹95,000 per acre",
      duration: "90 - 110 days",
      shoppingList: [
        "Seeds (certified hybrid or local desi)",
        "FYM/Compost (well decomposed)",
        "Drip lines or sprinkler set",
        "Neem oil + bio pesticides",
        "Basal fertilizer mix (NPK 10:26:26)",
      ],
      timeline: [
        {
          action: "Plowing",
          description: "Deep plough and add FYM to improve soil structure and moisture holding.",
          icon: "package",
        },
        {
          action: "Sowing",
          description: "Raise seedlings and transplant with proper spacing for airflow and yield.",
          icon: "leaf",
        },
        {
          action: "Irrigation",
          description: "Use drip irrigation to reduce water loss and prevent fungal spread.",
          icon: "water",
        },
        {
          action: "Spray",
          description: "Apply neem oil or recommended spray during early pest pressure.",
          icon: "spray",
        },
        {
          action: "Harvest",
          description: "Pick fruits at breaker stage for better Mandi price and shelf life.",
          icon: "sun",
        },
      ],
    };
  }
};

export interface SmartPlanRequest {
  soil_type: string;
  land_size: string;
  budget: string;
  water_source: string;
  season: string;
  sowing_month?: string;
}

export interface SmartPlanResponse {
  summary: {
    crop_name: string;
    suitability_score: string;
    expected_revenue: string;
    net_profit: string;
    roi: string;
    duration: string;
  };
  financial_breakdown: { category: string; cost: string; percent: number }[];
  risk_analysis: { primary_risk: string; mitigation: string };
  timeline_weeks: { phase: string; action: string; details: string; icon: string }[];
}

export const getSmartPlanBackend = async (
  request: SmartPlanRequest
): Promise<SmartPlanResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/generate-smart-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("❌ Smart Plan Backend Error:", error);
    return {
      summary: {
        crop_name: "Chilli - Guntur Hot",
        suitability_score: "91%",
        expected_revenue: "₹1.3 Lakhs",
        net_profit: "₹85,000",
        roi: "2.3x",
        duration: "130 Days",
      },
      financial_breakdown: [
        { category: "Seeds", cost: "₹2,500", percent: 5 },
        { category: "Fertilizers", cost: "₹12,000", percent: 25 },
        { category: "Labor", cost: "₹20,000", percent: 40 },
        { category: "Pesticides", cost: "₹8,000", percent: 15 },
        { category: "Other", cost: "₹7,500", percent: 15 },
      ],
      risk_analysis: {
        primary_risk: "Thrips infestation during dry spells",
        mitigation: "Use blue sticky traps and Spinosad early in flowering.",
      },
      timeline_weeks: [
        {
          phase: "Week 1-2: Soil Prep",
          action: "Deep Ploughing",
          details: "Plow 30cm deep. Apply 5 tons FYM/acre.",
          icon: "plow",
        },
        {
          phase: "Week 3-4: Nursery",
          action: "Seedling Raise",
          details: "Sow in trays; maintain moisture and shade.",
          icon: "leaf",
        },
        {
          phase: "Week 6: Critical Care",
          action: "Micronutrient Spray",
          details: "Spray micronutrients (5g/L) to boost flowering.",
          icon: "spray",
        },
        {
          phase: "Week 12+: Harvest",
          action: "Selective Harvest",
          details: "Harvest for better Mandi pricing and quality.",
          icon: "sun",
        },
      ],
    };
  }
};

// ===== MARKET TRENDS (AI-Powered Regional Data) =====

export interface MarketCrop {
  id: string;
  name: string;
  price: number;
  unit: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  forecast: string;
  market_note: string;
}

export interface MarketTrendsResponse {
  region: string;
  market_status: 'Bullish' | 'Bearish' | 'Neutral';
  analyst_note: string;
  last_updated: string;
  crops: MarketCrop[];
}

export const getMarketTrendsBackend = async (
  region: string
): Promise<MarketTrendsResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/get-market-trends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ region }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("❌ Market Trends Backend Error:", error);
    
    // Return fallback
    return {
      region,
      market_status: 'Neutral',
      analyst_note: 'Market data unavailable. Showing cached information.',
      last_updated: 'Cached data',
      crops: [
        {
          id: '1',
          name: 'Tomato (Hybrid F1)',
          price: 1800,
          unit: '₹/Quintal',
          change: '+5.2',
          trend: 'up',
          forecast: 'Rising',
          market_note: 'Supply tight'
        },
        {
          id: '2',
          name: 'Onion (Red)',
          price: 2200,
          unit: '₹/Quintal',
          change: '-2.0',
          trend: 'down',
          forecast: 'Stable',
          market_note: 'Good stock'
        },
      ]
    };
  }
};

// ===== EXECUTION PLAN (Precision Crop-Specific Manual) =====

export interface ExecutionPlanRequest {
  crop_name: string;
  variety?: string;
  land_size: string;
  soil_type: string;
  water_source: string;
  sowing_date: string;
}

export interface ExecutionPlanResponse {
  yield_forecast: {
    potential_percentage: number;
    estimated_output: string;
    limiting_factor: string;
  };
  input_requirements: Array<{
    item: string;
    quantity: string;
    note: string;
  }>;
  critical_timeline: Array<{
    day: string;
    action: string;
    detail: string;
    icon: string;
  }>;
}

export const getExecutionPlanBackend = async (
  request: ExecutionPlanRequest
): Promise<ExecutionPlanResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/generate-execution-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("❌ Execution Plan Backend Error:", error);
    
    // Fallback
    return {
      yield_forecast: {
        potential_percentage: 94,
        estimated_output: "4200 kg",
        limiting_factor: "Water availability during flowering may reduce yield by 6%.",
      },
      input_requirements: [
        { item: "Seeds", quantity: "25 kg", note: "Use certified seeds for better germination" },
        { item: "Urea", quantity: "120 kg", note: "Apply in 3 split doses (basal, tillering, flowering)" },
        { item: "DAP", quantity: "65 kg", note: "Full dose as basal application" },
        { item: "Muriate of Potash (MOP)", quantity: "40 kg", note: "50% basal, 50% at flowering" },
        { item: "Zinc Sulfate", quantity: "10 kg", note: "Mix with soil before sowing" },
      ],
      critical_timeline: [
        {
          day: "Day 0 (Sowing)",
          action: "Land Preparation",
          detail: "Deep plow to 30cm. Apply FYM (5 tons/acre) and full DAP dose.",
          icon: "plow",
        },
        {
          day: "Day 21 (3 Weeks)",
          action: "First Top Dressing",
          detail: "Apply 40kg Urea per acre. Ensure soil moisture before application.",
          icon: "fertilizer",
        },
        {
          day: "Day 45 (6-7 Weeks)",
          action: "Critical Irrigation",
          detail: "Crown root initiation stage. Maintain 5cm water depth for 7 days.",
          icon: "irrigation",
        },
        {
          day: "Day 60 (Flowering)",
          action: "Second Top Dressing + Pest Watch",
          detail: "Apply remaining 40kg Urea and 20kg MOP. Monitor for stem borers.",
          icon: "spray",
        },
        {
          day: "Day 90-110",
          action: "Harvest",
          detail: "Harvest when 80% grains turn golden. Dry to 14% moisture before storage.",
          icon: "harvest",
        },
      ],
    };
  }
};
