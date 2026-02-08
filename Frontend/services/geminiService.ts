import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, CropAdvice } from "../types";
import { API_KEYS } from "./api";

const apiKey = API_KEYS.gemini;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const buildMockAdvisory = (soil: string, season: string): CropAdvice[] => [
  {
    cropName: "Tomato",
    suitability: 86,
    reason: `Best for ${season} with ${soil} soil. High demand and quick turnover.`,
    marketTrend: "Up",
  },
  {
    cropName: "Okra (Bhindi)",
    suitability: 78,
    reason: `Performs well in warm conditions and tolerates ${soil} soils.`,
    marketTrend: "Stable",
  },
  {
    cropName: "Onion",
    suitability: 72,
    reason: `Suitable for ${season} sowing with good storage potential.`,
    marketTrend: "Down",
  },
];

/**
 * Analyzes a leaf image using Gemini Vision model.
 */
export const analyzeLeafImage = async (base64Image: string, language: string): Promise<DiagnosisResult> => {
  try {
    const prompt = `
      You are an expert agricultural plant pathologist.
      Analyze this image of a crop leaf.
      1. Identify if it is Healthy or Diseased.
      2. If diseased, identify the disease name.
      3. Provide 3 steps for treatment.
      4. Provide 2 preventative measures.
      5. Provide the disease name in the local language: ${language} if possible.

      Respond in strictly VALID JSON format. Do not use Markdown code blocks.
      Structure:
      {
        "healthy": boolean,
        "diseaseName": "string",
        "confidence": number,
        "treatment": ["string", "string"],
        "preventativeMeasures": ["string"],
        "localName": "string"
      }
    `;

    // Note: gemini-2.5-flash-image does NOT support responseMimeType or responseSchema.
    // We must parse the text output manually.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }
    });

    if (!response.text) throw new Error("No response from AI");
    
    // Clean potential markdown formatting if the model adds it despite instructions
    let jsonStr = response.text.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }
    
    return JSON.parse(jsonStr) as DiagnosisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback for demo purposes if API fails
    return {
      healthy: false,
      diseaseName: "Error Analyzing Image",
      confidence: 0,
      treatment: ["Check internet connection", "Ensure image is clear"],
      preventativeMeasures: [],
      localName: "Unknown"
    };
  }
};

/**
 * Generates crop advisory using Gemini Text model.
 */
export const getCropAdvisory = async (
  soil: string, 
  season: string, 
  language: string
): Promise<CropAdvice[]> => {
  try {
    if (!ai) {
      return buildMockAdvisory(soil, season);
    }
    const prompt = `
      Act as an Indian agricultural expert.
      Suggest 3 profitable crops for:
      Soil: ${soil}
      Season: ${season}
      
      Translate content to ${language} if it is not English.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cropName: { type: Type.STRING },
              suitability: { type: Type.NUMBER },
              reason: { type: Type.STRING },
              marketTrend: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (!response.text) throw new Error("No advisory generated");
    return JSON.parse(response.text) as CropAdvice[];

  } catch (error) {
    console.error("Advisory Generation Failed:", error);
    return buildMockAdvisory(soil, season);
  }
};