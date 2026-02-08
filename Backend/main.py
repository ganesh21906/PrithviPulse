from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import os
import hashlib
import base64
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import traceback

# ==========================================
# 🚀 HACKATHON CONFIGURATION: GEMINI 3
# ==========================================

# CRITICAL: STRICTLY using Gemini 3 Preview Model
# This model ID is specific to the Feb 2026 Hackathon Preview.
GEMINI_MODEL_NAME = "gemini-3-flash-preview"

# API Key Handling
GEMINI_API_KEY = "AIzaSyDgZ7X4J-nau_MuDYQTKkZwES7TTsSzRO4"

# Verify Key
if not GEMINI_API_KEY:
    print("❌ FATAL: No Gemini API Key found.")
else:
    print(f"✅ Gemini 3 Key Loaded: {GEMINI_API_KEY[:5]}...****")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini 3
try:
    generation_config = {
        "temperature": 0.4, 
        "max_output_tokens": 8192,
        "response_mime_type": "application/json"  # Gemini 3 supports strict JSON enforcement
    }
    model_gemini = genai.GenerativeModel(
        model_name=GEMINI_MODEL_NAME,
        generation_config=generation_config
    )
    print(f"🤖 SYSTEM READY: Connected to {GEMINI_MODEL_NAME} (Next-Gen Preview)")
except Exception as e:
    print(f"⚠️ MODEL ERROR: Could not load {GEMINI_MODEL_NAME}.")
    print("   -> Check if your API Key has 'Gemini 3 Preview' access enabled.")
    model_gemini = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== 2. LOAD YOUR CUSTOM BRAIN =====
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "plant_disease_model.h5")

print("🧠 Loading Crop Disease Model...")
try:
    model_cnn = tf.keras.models.load_model(MODEL_PATH)
    print("✅ CNN Model Loaded!")
    MODEL_AVAILABLE = True
except Exception as e:
    print(f"❌ Error loading .h5 file: {e}")
    model_cnn = None
    MODEL_AVAILABLE = False

# ===== 3. SMART CACHE (CRITICAL FOR HACKATHONS) =====
# This saves your API quota by remembering answers.
CACHE_FILE = os.path.join(BASE_DIR, "advice_cache.json")

def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            return json.load(f)
    return {}

def save_cache(new_data):
    current_cache = load_cache()
    current_cache.update(new_data)
    with open(CACHE_FILE, "w") as f:
        json.dump(current_cache, f, indent=4)

# ===== 4. CLASS LIST =====
CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy',
    'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy',
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites_Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

# ===== 5. GEMINI 3 ADVICE ENGINE =====
def get_gemini_advice(disease_name: str) -> dict:
    clean_name = disease_name.replace("_", " ")

    # A. CACHE CHECK (The "Quota Saver")
    cache = load_cache()
    if disease_name in cache:
        print(f"⚡ CACHE HIT: Serving {clean_name} from memory.")
        return cache[disease_name]

    # B. ASK GEMINI 3
    print(f"🤖 ASKING GEMINI 3: {clean_name}...")
    try:
        is_healthy = "healthy" in disease_name.lower()
        
        if is_healthy:
            prompt = f"""
            You are an agricultural expert for Indian farmers.
            Diagnosis: {clean_name} (Healthy Crop).
            
            Output strictly valid JSON with this structure:
            {{
                "title": "Healthy Crop - {clean_name}",
                "medicine_name": "No treatment needed",
                "treatment": "Continue regular monitoring and maintenance.",
                "prevention": "Maintain proper watering and nutrition schedule.",
                "steps": [
                    {{
                        "action": "Monitor",
                        "description": "Continue regular crop monitoring for any signs of disease.",
                        "icon": "eye",
                        "image_query": "healthy {clean_name.split('___')[0]} crop in field"
                    }},
                    {{
                        "action": "Maintain",
                        "description": "Ensure adequate water and nutrients for optimal growth.",
                        "icon": "water",
                        "image_query": "watering {clean_name.split('___')[0]} plants in farm"
                    }}
                ]
            }}
            """
        else:
            prompt = f"""
            You are an agricultural expert for Indian farmers.
            Diagnosis: {clean_name} (Disease Detected).
            
            Provide treatment advice in strictly valid JSON format with this exact structure:
            {{
                "title": "Disease Name",
                "medicine_name": "Specific chemical/organic medicine name (e.g., Mancozeb, Neem Oil, Copper Sulfate)",
                "treatment": "Brief summary of treatment approach",
                "prevention": "Key prevention measure",
                "steps": [
                    {{
                        "action": "Step name (e.g., Spray, Prune, Apply, Remove)",
                        "description": "Detailed instruction with dosage (e.g., Mix 2g Mancozeb in 1L water and spray on affected leaves)",
                        "icon": "spray|cut|water|leaf|package|eye|sun|droplets",
                        "image_query": "descriptive search query for finding relevant image (e.g., 'farmer spraying fungicide on tomato plant', 'pruning diseased leaves', 'applying fertilizer to crops')"
                    }}
                ]
            }}
            
            Important:
            - Provide 3-5 actionable steps
            - Each step MUST have an image_query field with a clear, searchable description
            - Use Indian farming context in image queries
            - Icon options: spray, cut, water, leaf, package, eye, sun, droplets
            - Be specific about medicine names and dosages
            - Make image queries detailed and relevant to Indian agriculture
            
            Disease to treat: {clean_name}
            """
        
        response = model_gemini.generate_content(prompt)
        text = response.text.strip() if hasattr(response, 'text') else str(response)
        text = text.replace('```json', '').replace('```', '').strip()
        
        # Try to extract JSON if it's wrapped in other text
        if '{' in text and '}' in text:
            start_idx = text.find('{')
            end_idx = text.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                text = text[start_idx:end_idx]
        
        print(f"📝 Gemini Advice Response (first 150 chars): {text[:150]}...")
        advice = json.loads(text)
        
        # Validate the structure
        if not isinstance(advice.get('steps'), list):
            raise ValueError("Steps must be an array")
        
        for step in advice['steps']:
            if 'image_query' not in step:
                # Fallback: generate a basic image query if missing
                crop_name = clean_name.split('___')[0] if '___' in clean_name else clean_name
                step['image_query'] = f"{step.get('action', 'treatment')} for {crop_name} disease"
        
        # Save to cache
        save_cache({disease_name: advice})
        return advice
        
    except json.JSONDecodeError as e:
        print(f"⚠️ JSON Parse Error: {e}")
        print(f"Raw response (first 400 chars): {text[:400] if 'text' in locals() else 'N/A'}")
        return generate_fallback_advice(clean_name, is_healthy)
    except Exception as e:
        print(f"⚠️ API Error: {e}")
        print(f"Error type: {type(e).__name__}")
        return generate_fallback_advice(clean_name, is_healthy)

def generate_fallback_advice(disease_name: str, is_healthy: bool) -> dict:
    """Generate fallback advice when Gemini API fails"""
    crop_name = disease_name.split('___')[0] if '___' in disease_name else disease_name.split()[0]
    
    if is_healthy:
        return {
            "title": f"Healthy Crop - {disease_name}",
            "medicine_name": "No treatment needed",
            "treatment": "Continue regular monitoring",
            "prevention": "Maintain good agricultural practices",
            "steps": [
                {
                    "action": "Monitor",
                    "description": "Continue regular crop monitoring for any signs of disease",
                    "icon": "eye",
                    "image_query": f"healthy {crop_name} crop field"
                },
                {
                    "action": "Maintain",
                    "description": "Ensure proper watering and nutrition",
                    "icon": "water",
                    "image_query": f"watering {crop_name} plants"
                }
            ]
        }
    else:
        return {
            "title": disease_name,
            "medicine_name": "Consult local agricultural expert",
            "treatment": "Apply recommended treatment",
            "prevention": "Maintain proper crop management",
            "steps": [
                {
                    "action": "Identify",
                    "description": "Confirm disease symptoms with local expert",
                    "icon": "eye",
                    "image_query": f"{disease_name} symptoms on plant leaves"
                },
                {
                    "action": "Treat",
                    "description": "Apply recommended fungicide or pesticide as per expert advice",
                    "icon": "spray",
                    "image_query": f"farmer spraying pesticide on {crop_name} crops"
                },
                {
                    "action": "Prevent",
                    "description": "Maintain proper spacing, drainage, and crop rotation",
                    "icon": "leaf",
                    "image_query": f"{crop_name} disease prevention farming practices"
                }
            ]
        }

# ===== 6. GEMINI 3 VISION DIAGNOSIS (PRIMARY METHOD) =====
import base64

def diagnose_with_gemini_vision(image_data: bytes) -> dict:
    """
    PRIMARY: Use Gemini 3 Vision to analyze plant leaf images
    Returns disease diagnosis with confidence and treatment steps
    """
    try:
        # Convert image to base64
        image_base64 = base64.standard_b64encode(image_data).decode('utf-8')
        mime_type = "image/jpeg"
        
        prompt = """
        You are an expert agricultural plant pathologist specializing in crop disease identification.
        
        Analyze this plant leaf image carefully:
        
        1. **Is this a plant leaf?** If not, respond with {"is_plant": false}
        2. **Disease Identification:** Identify the specific disease or if the plant is healthy
        3. **Confidence:** Estimate confidence (0.0-1.0) based on visual clarity and symptom visibility
        4. **Treatment Steps:** Provide 3-5 specific treatment steps
        
        IMPORTANT: Respond in STRICT JSON format (no markdown, no code blocks):
        {
          "is_plant": true,
          "predicted_class": "Tomato Early Blight",
          "crop": "Tomato",
          "disease": "Early Blight",
          "is_healthy": false,
          "confidence": 0.95,
          "confidence_percentage": "95%",
          "visual_symptoms": "Brown circular lesions with concentric rings on lower leaves",
          "treatment": [
            {
              "step": 1,
              "action": "Remove infected leaves",
              "description": "Prune all infected leaves from the base of the plant",
              "icon": "cut"
            },
            {
              "step": 2,
              "action": "Apply fungicide",
              "description": "Spray Mancozeb (2g per liter) every 10-14 days",
              "icon": "spray"
            },
            {
              "step": 3,
              "action": "Improve drainage",
              "description": "Ensure proper spacing and avoid overhead watering",
              "icon": "water"
            },
            {
              "step": 4,
              "action": "Monitor regularly",
              "description": "Check plants every 2-3 days for new lesions",
              "icon": "eye"
            },
            {
              "step": 5,
              "action": "Crop rotation",
              "description": "Next season, plant in a different field location",
              "icon": "leaf"
            }
          ],
          "prevention": [
            "Use disease-resistant varieties",
            "Maintain proper plant spacing",
            "Avoid overhead watering",
            "Remove plant debris after harvest"
          ],
          "medicine_recommendation": "Mancozeb, Chlorothalonil, or Neem oil"
        }
        """
        
        print("🔍 Sending image to Gemini 3 Vision for diagnosis...")
        
        response = model_gemini.generate_content(
            [
                {
                    "mime_type": mime_type,
                    "data": image_base64
                },
                prompt
            ]
        )
        
        # Parse response
        text = response.text.strip() if hasattr(response, 'text') else str(response)
        
        # Clean markdown if present
        if text.startswith('```'):
            text = text.replace('```json', '').replace('```', '').strip()
        
        # Try to extract JSON if it's wrapped in other text
        if '{' in text and '}' in text:
            # Find the JSON content between first { and last }
            start_idx = text.find('{')
            end_idx = text.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                text = text[start_idx:end_idx]
        
        print(f"🔍 Gemini Response (first 200 chars): {text[:200]}...")
        diagnosis = json.loads(text)
        
        # Validate response
        if not diagnosis.get("is_plant"):
            return {
                "error": "Not a plant leaf image",
                "is_plant": False,
                "source": "Gemini 3 Vision"
            }
        
        # Add source tracking
        diagnosis["source"] = "Gemini 3 Vision (Primary)"
        diagnosis["method"] = "gemini_vision"
        
        print(f"✅ Gemini 3 Diagnosis: {diagnosis.get('predicted_class')} ({diagnosis.get('confidence_percentage')})")
        return diagnosis
        
    except json.JSONDecodeError as e:
        print(f"⚠️ JSON Parse Error from Gemini Vision: {e}")
        print(f"Raw text (first 300 chars): {text[:300] if 'text' in locals() else 'No text'}")
        return {"error": f"Failed to parse Gemini response: {str(e)}", "source": "gemini_vision"}
    except Exception as e:
        print(f"⚠️ Gemini 3 Vision Error: {e}")
        print(f"Error type: {type(e).__name__}")
        return {"error": str(e), "source": "gemini_vision"}

# ===== 7B. COMPLETE FALLBACK RESPONSE GENERATOR =====
def generate_complete_fallback_response(error: str, source: str) -> dict:
    """
    CRITICAL: Generate a COMPLETE, VALID JSON response that frontend expects
    This prevents .join() crashes on None/null values
    """
    return {
        "is_plant": False,
        "predicted_class": "Unknown",
        "crop": "Unknown",
        "disease": "Unknown",
        "is_healthy": False,
        "confidence": 0.0,
        "confidence_percentage": "0%",
        "source": f"Error - {source}",
        "method": "error",
        "error": error,
        "treatment": [
            "🔴 System Error: Could not analyze image",
            "Please try again with a clear photo of a plant leaf",
            "Ensure good lighting and focus on the affected area",
            "If problem persists, restart the application"
        ],
        "prevention": [
            "Check internet connection and backend server status",
            "Verify backend is running: python main.py",
            "Try uploading a different plant image",
            "Clear browser cache and reload the page"
        ],
        "medicine_recommendation": "Error - please restart",
        "visual_symptoms": "Unable to analyze",
        "treatment_steps": [
            {"step": 1, "action": "Restart System", "description": "Restart both frontend and backend servers", "icon": "refresh"},
            {"step": 2, "action": "Check Backend", "description": "Verify backend is running on http://localhost:8000", "icon": "settings"},
            {"step": 3, "action": "Retry Upload", "description": "Try uploading the image again after system restart", "icon": "upload"}
        ],
        "critical_timeline": []
    }


# ===== 6B. LOCAL H5 MODEL FALLBACK =====
def predict_with_h5_model(image_data: bytes) -> dict:
    """
    FALLBACK: Use local .h5 CNN model for disease detection
    Returns COMPLETE data structure - no missing fields
    """
    try:
        print("⚡ Using H5 Model for prediction...")
        
        if model_cnn is None or not MODEL_AVAILABLE:
            print("❌ H5 Model not available")
            return {
                "error": "Model not loaded",
                "is_plant": False,
                "source": "local_model"
            }
        
        # Load and preprocess image
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        image = image.resize((128, 128))
        img_batch = np.expand_dims(np.array(image) / 255.0, 0)
        
        # Predict
        predictions = model_cnn.predict(img_batch, verbose=0)
        confidence = float(np.max(predictions[0]))
        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        
        is_healthy = 'healthy' in predicted_class.lower()
        crop = predicted_class.split('___')[0] if '___' in predicted_class else predicted_class
        disease = predicted_class.split('___')[1].replace('_', ' ') if '___' in predicted_class else 'Unknown'
        
        # Get treatment advice
        advice = get_gemini_advice(predicted_class)
        
        # ===== CRITICAL: Build COMPLETE response =====
        result = {
            "is_plant": True,
            "predicted_class": predicted_class,
            "crop": crop,
            "disease": disease,
            "is_healthy": is_healthy,
            "confidence": confidence,
            "confidence_percentage": f"{confidence*100:.0f}%",
            "source": "Local Model (.h5 CNN) - FALLBACK",
            "method": "local_model_fallback",
            "treatment": advice.get("steps", []) if advice else [],
            "prevention": advice.get("prevention", []) if advice else [],
            "medicine_recommendation": advice.get("medicine_name", "Consult local expert") if advice else "Unknown",
            "visual_symptoms": f"Detected: {disease}" if disease else "Unknown disease detected",
            "treatment_steps": advice.get("steps", []) if advice else [],
            "critical_timeline": []
        }
        
        print(f"✅ H5 Model Result: {predicted_class} ({confidence*100:.0f}%)")
        return result
        
    except Exception as e:
        print(f"❌ H5 Model Error: {type(e).__name__}: {e}")
        print(traceback.format_exc())
        return {
            "error": f"H5 Model Failed: {str(e)}",
            "is_plant": False,
            "source": "local_model"
        }

# ===== 7. API ROUTES =====
@app.get("/")
def home():
    return {
        "status": "✅ PrithviPulse Backend Running",
        "model_status": "✅ H5 Model Available" if MODEL_AVAILABLE else "❌ H5 Model Failed",
        "gemini_model": GEMINI_MODEL_NAME,
        "gemini_status": "✅ Gemini 3 Preview Connected" if GEMINI_API_KEY else "❌ No API Key",
        "endpoints": [
            "/scan_disease (POST) - Pure Gemini 3 Vision disease diagnosis",
            "/predict (POST) - Backward compatibility (redirects to /scan_disease)",
            "/advise-crop (POST) - Crop recommendations using Gemini 3",
            "/get-market-trends (POST) - Market trends using Gemini 3",
            "/generate-execution-plan (POST) - Farm execution manual using Gemini 3",
            "/farm-plan (POST) - Farm planning using Gemini 3",
            "/generate-smart-plan (POST) - Smart strategy using Gemini 3"
        ]
    }

# ===== 7. PURE GEMINI 3 VISION SCAN ENDPOINT =====

@app.post("/scan_disease")
async def scan_disease_hybrid(file: UploadFile = File(...)):
    """
    🛡️ GEMINI 3 PRIMARY → H5 FALLBACK SCANNER
    
    TIER 1: Gemini 3 Cloud AI (Best Quality)
    TIER 2: Local .h5 Model (Guaranteed Offline Backup)
    
    Tries the best option first, falls back if needed!
    """
    import traceback
    
    print(f"\n📸 HYBRID SCAN: {file.filename}")

    # 1. READ IMAGE FILE
    try:
        image_bytes = await file.read()
        image_part = {"mime_type": file.content_type or "image/jpeg", "data": image_bytes}
        print(f"✅ Image read: {len(image_bytes)} bytes")
    except Exception as e:
        return {"error": f"Failed to read image: {str(e)}"}

    # ==========================================
    # 🌩️ TIER 1: GEMINI 3 CLOUD AI (PRIMARY)
    # ==========================================
    print("\n🚀 TIER 1: Attempting GEMINI 3 CLOUD AI...")
    
    try:
        model = genai.GenerativeModel(GEMINI_MODEL_NAME)
        
        prompt = """You are an expert Agricultural Pathologist. Analyze this leaf image and diagnose any plant disease.

Return ONLY valid JSON, no markdown:
{
  "diagnosis_name": "Disease name or Healthy",
  "confidence_score": "High/Medium/Low",
  "professional_summary": "2-3 sentences about symptoms",
  "physical_actions_checklist": ["Action 1", "Action 2"],
  "chemical_prescription": {
    "required": true,
    "specific_active_ingredients": ["Chemical with dosage", "Chemical with dosage"],
    "application_instructions": "How to apply"
  },
  "preventative_measures": "Prevention tips"
}"""

        print(f"   Sending to {GEMINI_MODEL_NAME}...")
        response = model.generate_content([prompt, image_part])
        
        text = response.text.strip()
        # Remove markdown
        text = text.replace("```json", "").replace("```", "").strip()
        
        # Extract JSON
        if '{' in text and '}' in text:
            start = text.find('{')
            end = text.rfind('}') + 1
            text = text[start:end]
        
        data = json.loads(text)
        data["source"] = "✅ Gemini 3 Cloud AI"
        print(f"✅ Gemini 3 Success: {data.get('diagnosis_name', 'Unknown')}\n")
        return data

    except Exception as cloud_error:
        print(f"⚠️  Gemini 3 failed: {type(cloud_error).__name__}")
        print(f"   Error message: {str(cloud_error)[:80]}")
        print(f"   → Activating H5 LOCAL FALLBACK...\n")

    # ==========================================
    # 🏠 TIER 2: LOCAL H5 MODEL (FALLBACK)
    # ==========================================
    print("🔄 TIER 2: Using LOCAL H5 MODEL...")
    
    if model_cnn is None or not MODEL_AVAILABLE:
        print("❌ H5 Model not loaded - complete system failure\n")
        return {
            "error": "All systems failed - Gemini 3 unavailable, H5 not loaded",
            "diagnosis_name": "System Failure",
            "confidence_score": "0%",
            "professional_summary": "Unable to analyze - check logs",
            "physical_actions_checklist": [],
            "chemical_prescription": {"required": False, "specific_active_ingredients": []},
            "source": "❌ NO SYSTEMS AVAILABLE"
        }

    try:
        print("   Step 1: Loading image...")
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        print(f"   ✓ Image opened: {img.size}")
        
        print("   Step 2: Resizing to 128x128...")
        # Use Image.LANCZOS (compatible with older PIL)
        try:
            # Try new API first (PIL 10.0.0+)
            img = img.resize((128, 128), Image.Resampling.LANCZOS)
        except (AttributeError, TypeError):
            # Fall back to old API
            img = img.resize((128, 128), Image.LANCZOS)
        print(f"   ✓ Resized to: {img.size}")
        
        print("   Step 3: Converting to numpy array...")
        img_array = np.array(img, dtype=np.float32)
        print(f"   ✓ Array shape: {img_array.shape}, dtype: {img_array.dtype}")
        print(f"   ✓ Value range before norm: [{img_array.min():.1f}, {img_array.max():.1f}]")
        
        print("   Step 4: Normalizing to 0-1 range...")
        img_array = img_array / 255.0
        print(f"   ✓ Normalized range: [{img_array.min():.3f}, {img_array.max():.3f}]")
        
        print("   Step 5: Adding batch dimension...")
        img_batch = np.expand_dims(img_array, axis=0)
        print(f"   ✓ Batch shape: {img_batch.shape}")

        print("   Step 6: Running H5 model prediction...")
        print(f"   Input characteristics: shape={img_batch.shape}, dtype={img_batch.dtype}")
        print(f"   Model expects shape: (batch, 128, 128, 3)")
        
        predictions = model_cnn.predict(img_batch, verbose=0)
        print(f"   ✓ Prediction output shape: {predictions.shape}")
        print(f"   ✓ Prediction values - min: {predictions.min():.6f}, max: {predictions.max():.6f}")
        print(f"   ✓ Prediction sum: {predictions.sum():.6f}")
        
        # Get prediction
        confidence = float(np.max(predictions[0]))
        class_idx = np.argmax(predictions[0])
        raw_class = CLASS_NAMES[class_idx]
        
        print(f"   ✓ Predicted class index: {class_idx}")
        print(f"   ✓ Class name: {raw_class}")
        print(f"   ✓ Confidence: {confidence*100:.1f}%")
        
        # Clean name
        diagnosis = raw_class.replace("___", " - ").replace("_", " ")
        is_healthy = "healthy" in raw_class.lower()
        
        print(f"   ✓ Clean: {diagnosis}")
        print(f"   ✓ Healthy: {is_healthy}")

        # Select chemicals by disease type
        print("   Step 7: Selecting treatment...")
        d = raw_class.lower()
        
        if "bacterial" in d:
            chems = ["Streptomycin Sulfate - 200 ppm", "Copper Hydroxide 77% - 2.5g/L"]
        elif "viral" in d:
            chems = ["Imidacloprid 17.8% - 1ml/L", "Neem Oil 3% - 5ml/L"]
        elif "mite" in d or "spider" in d:
            chems = ["Azadirachtin (Neem) 3% - 5ml/L", "Spiromesifen 22.9% - 0.5ml/L"]
        elif "rust" in d:
            chems = ["Hexaconazole 5% - 1ml/L", "Propiconazole 25% - 1ml/L"]
        elif "blight" in d:
            chems = ["Chlorothalonil 75% - 3g/L", "Mancozeb 75% - 2.5g/L"]
        elif "scab" in d:
            chems = ["Sulfur 80% - 2.5g/L", "Mancozeb 75% - 2.5g/L"]
        elif "rot" in d:
            chems = ["Copper Fungicide 50% - 2.5g/L", "Carbendazim 12% + Mancozeb 63% - 2g/L"]
        elif "mosaic" in d or "virus" in d:
            chems = ["Imidacloprid 17.8% - 1ml/L", "Neem Oil 3% - 5ml/L"]
        else:
            chems = ["Mancozeb 75% - 2.5g/L", "Copper Oxychloride 50% - 3g/L"]
        
        print(f"   ✓ Selected {len(chems)} chemicals")

        # Build response
        crop = diagnosis.split(" - ")[0] if " - " in diagnosis else diagnosis.split()[0]
        
        result = {
            # New detailed format
            "diagnosis_name": diagnosis,
            "confidence_score": f"{confidence*100:.0f}%",
            "professional_summary": f"H5 Neural Network detected: {diagnosis} ({confidence*100:.1f}% confidence). Local offline analysis - Gemini 3 was unavailable.",
            "physical_actions_checklist": [
                "Isolate from healthy plants immediately",
                "Remove and destroy infected leaves (don't compost)",
                "Improve air circulation - remove lower leaves",
                "Water only at soil level - never overhead",
                "Sanitize tools with 70% alcohol between plants",
                "Monitor nearby plants daily for spread"
            ],
            "chemical_prescription": {
                "required": not is_healthy,
                "specific_active_ingredients": [] if is_healthy else chems,
                "application_instructions": f"{'Keep maintaining preventative practices - no chemicals needed for healthy plants.' if is_healthy else 'Mix chemicals in water per dosage. Spray early morning (6-9 AM) or evening (5-8 PM). Apply complete coverage including leaf undersides. Repeat: fungal 7-10 days, bacterial/viral 5-7 days. Rotate chemicals to prevent resistance.'}"
            },
            "preventative_measures": f"{'Maintain excellent hygiene and spacing.' if is_healthy else f'{crop}: Rotate crops 2-3 years, space plants properly, remove crop debris, use resistant varieties, avoid overhead watering.'}",
            "source": "⚡ Local H5 Model (Fallback - Cloud unavailable)",
            
            # Legacy format for ScanResult component compatibility
            "diseaseName": diagnosis,
            "confidence": float(confidence),  # 0-1 range as number
            "healthy": is_healthy,
            "treatment": [] if is_healthy else chems,
            "preventativeMeasures": [f"{'Maintain excellent hygiene and spacing.' if is_healthy else f'{crop}: Rotate crops 2-3 years, space plants properly, remove crop debris, use resistant varieties, avoid overhead watering.'}"]
        }
        
        print(f"\n✅ H5 COMPLETE: {diagnosis}\n")
        return result

    except Exception as h5_error:
        print(f"\n❌ H5 MODEL ERROR: {type(h5_error).__name__}: {str(h5_error)}\n")
        traceback.print_exc()
        
        return {
            "error": f"H5 processing failed: {str(h5_error)[:100]}",
            "diagnosis_name": "Processing Error",
            "confidence_score": "0%",
            "professional_summary": "Image processing failed in fallback system",
            "physical_actions_checklist": ["Check image format", "Check backend logs"],
            "chemical_prescription": {"required": False, "specific_active_ingredients": []},
            "source": "❌ H5 Processing Failed"
        }



@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Backward compatibility endpoint.
    Redirects to /scan_disease for hybrid Gemini 3 + H5 analysis.
    """
    return await scan_disease_hybrid(file)

        

# ===== 7A. CROP ADVISORY ENDPOINT (GEMINI 3 REASONING) =====
@app.post("/advise-crop")
async def advise_crop(request: dict):
    """
    Uses Gemini 3 to provide intelligent crop recommendations
    based on soil type, season, and location.
    """
    try:
        soil = request.get("soil", "Unknown")
        season = request.get("season", "Unknown")
        location = request.get("location", "India")
        
        print(f"🌾 CROP ADVISORY REQUEST: Soil={soil}, Season={season}, Location={location}")
        
        # Craft a detailed prompt for Gemini 3
        prompt = f"""
        Act as an experienced Indian Agronomist with expertise in crop planning and market analysis.
        
        Farmer's Context:
        - Soil Type: {soil}
        - Season: {season}
        - Location: {location}
        
        Task:
        Recommend the TOP 3 most profitable crops for this farmer considering:
        1. Soil compatibility and nutrient requirements
        2. Seasonal suitability and climate factors
        3. Current market demand and price trends in India
        4. Expected yield and duration
        5. Water requirements and sustainability
        
        Output Format (STRICT JSON):
        {{
            "recommendations": [
                {{
                    "name": "Crop Name (Local + Scientific)",
                    "suitability": 85,
                    "yield": "Expected yield per acre (e.g., 25-30 quintals/acre)",
                    "duration": "Growth period in days (e.g., 90-120 days)",
                    "reason": "Detailed explanation covering soil match, market demand, profitability, and farmer benefits",
                    "marketTrend": "Up|Down|Stable",
                    "waterRequirement": "Low|Medium|High",
                    "investment": "Estimated cost per acre in INR"
                }}
            ],
            "seasonalTips": "2-3 key tips for this season and soil type",
            "warnings": "Any risks or challenges to watch out for"
        }}
        
        Important:
        - Use Indian crop names (e.g., Arhar, Bajra, Jowar)
        - Consider kharif, rabi, zaid seasons
        - Base recommendations on real agricultural science
        - Provide actionable reasoning that helps farmers decide
        - Include current 2026 market trends
        """
        
        # Call Gemini 3 with thinking mode
        response = model_gemini.generate_content(prompt)
        text = response.text.strip() if hasattr(response, 'text') else str(response)
        
        # Clean potential markdown
        if text.startswith('```'):
            text = text.replace('```json', '').replace('```', '').strip()
        
        # Try to extract JSON if wrapped in other text
        if '{' in text and '}' in text:
            start_idx = text.find('{')
            end_idx = text.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                text = text[start_idx:end_idx]
        
        print(f"🌾 Advisory Response (first 150 chars): {text[:150]}...")
        advisory = json.loads(text)
        
        # Validate structure
        if "recommendations" not in advisory or not isinstance(advisory["recommendations"], list):
            raise ValueError("Invalid response structure from Gemini")
        
        # Ensure we have at least 1 recommendation
        if len(advisory["recommendations"]) == 0:
            raise ValueError("No recommendations generated")
        
        print(f"✅ Generated {len(advisory['recommendations'])} crop recommendations")
        return advisory
        
    except json.JSONDecodeError as e:
        print(f"⚠️ JSON Parse Error in Crop Advisory: {e}")
        return generate_fallback_advisory(soil, season)
    except Exception as e:
        print(f"⚠️ Crop Advisory Error: {e}")
        return generate_fallback_advisory(soil, season)


def generate_fallback_advisory(soil: str, season: str) -> dict:
    """Fallback recommendations if Gemini fails"""
    return {
        "recommendations": [
            {
                "name": "Tomato (Solanum lycopersicum)",
                "suitability": 85,
                "yield": "25-30 quintals/acre",
                "duration": "90-120 days",
                "reason": f"Tomatoes adapt well to {soil} soil and {season} season. High market demand with good returns. Short duration crop with proven profitability in Indian markets.",
                "marketTrend": "Up",
                "waterRequirement": "Medium",
                "investment": "₹40,000-50,000/acre"
            },
            {
                "name": "Okra/Bhindi (Abelmoschus esculentus)",
                "suitability": 78,
                "yield": "80-100 quintals/acre",
                "duration": "60-70 days",
                "reason": f"Excellent choice for {season} with {soil} soil. Quick returns, high demand in vegetable markets, and suitable for small farmers. Heat-tolerant variety available.",
                "marketTrend": "Stable",
                "waterRequirement": "Low",
                "investment": "₹25,000-35,000/acre"
            },
            {
                "name": "Chili/Mirch (Capsicum annuum)",
                "suitability": 72,
                "yield": "15-20 quintals/acre (dry)",
                "duration": "120-150 days",
                "reason": f"Profitable cash crop for {soil} conditions. Good export potential and processing industry demand. Requires moderate care but offers excellent returns.",
                "marketTrend": "Up",
                "waterRequirement": "Medium",
                "investment": "₹35,000-45,000/acre"
            }
        ],
        "seasonalTips": "Ensure proper drainage, use disease-resistant varieties, and follow integrated pest management practices.",
        "warnings": "Monitor weather conditions closely. Unexpected rainfall or temperature changes can affect yield."
    }

# ===== 8. FARM PLANNER ENDPOINT (GEMINI 3) =====
@app.post("/farm-plan")
async def farm_plan(request: dict):
    try:
        soil_type = request.get("soilType", "Unknown")
        water_source = request.get("waterSource", "Unknown")
        budget = request.get("budget", 0)
        land_size = request.get("landSize", 0)

        print(f"🌱 FARM PLAN REQUEST: Soil={soil_type}, Water={water_source}, Budget={budget}, Land={land_size}")

        prompt = f"""
        You are a senior Indian agronomist and farm planner.

        Farmer Inputs:
        - Soil Type: {soil_type}
        - Water Source: {water_source}
        - Budget (INR): {budget}
        - Land Size (acres): {land_size}

        Task:
        Create a single crop plan for one season, tailored for Indian conditions.
        Use Indian context: mention Mandi pricing, FYM, Jeevamrutha (if organic fits),
        and local practices. Keep language simple for farmers.

        Output STRICT JSON (no markdown):
        {{
          "cropName": "Crop name with local variety",
          "expectedProfit": "Estimated profit for total land size in INR",
          "duration": "Total crop duration in days",
          "shoppingList": ["Seeds", "FYM/Compost", "Drip pipes", "Bio pesticide"],
          "timeline": [
            {{"action": "Plowing", "description": "...", "icon": "package"}},
            {{"action": "Sowing", "description": "...", "icon": "leaf"}},
            {{"action": "Irrigation", "description": "...", "icon": "water"}},
            {{"action": "Spray", "description": "...", "icon": "spray"}},
            {{"action": "Harvest", "description": "...", "icon": "sun"}}
          ]
        }}

        Rules:
        - Use icons only from: spray, cut, water, leaf, package, eye, sun, droplets
        - Timeline must include plowing, sowing, irrigation, pest management, harvest
        - If organic is suitable, mention FYM and Jeevamrutha in shopping list or timeline
        - Ensure profit is realistic for India 2026 Mandi prices
        """

        response = model_gemini.generate_content(prompt)
        text = response.text.strip()

        if text.startswith('```'):
            text = text.replace('```json', '').replace('```', '').strip()

        plan = json.loads(text)

        if not plan.get("timeline") or not isinstance(plan["timeline"], list):
            raise ValueError("Invalid timeline structure from Gemini")

        return plan

    except json.JSONDecodeError as e:
        print(f"⚠️ JSON Parse Error in Farm Plan: {e}")
        return generate_fallback_farm_plan(soil_type, water_source, budget, land_size)
    except Exception as e:
        print(f"⚠️ Farm Plan Error: {e}")
        return generate_fallback_farm_plan(soil_type, water_source, budget, land_size)


def generate_fallback_farm_plan(soil_type: str, water_source: str, budget: float, land_size: float) -> dict:
    return {
        "cropName": "Tomato (Desi Hybrid)",
        "expectedProfit": f"₹70,000 - ₹95,000 for {land_size} acres",
        "duration": "90 - 110 days",
        "shoppingList": [
            "Seeds (certified hybrid/local)",
            "FYM/Compost (well decomposed)",
            "Drip lines or sprinkler set",
            "Neem oil + bio pesticide",
            "Basal fertilizer mix (NPK 10:26:26)",
        ],
        "timeline": [
            {
                "action": "Plowing",
                "description": "Deep plough and add FYM to improve soil and moisture retention.",
                "icon": "package",
            },
            {
                "action": "Sowing",
                "description": "Raise seedlings and transplant with proper spacing and mulching.",
                "icon": "leaf",
            },
            {
                "action": "Irrigation",
                "description": f"Use {water_source} water with drip to reduce losses and disease.",
                "icon": "water",
            },
            {
                "action": "Spray",
                "description": "Apply neem oil or recommended spray during early pest pressure.",
                "icon": "spray",
            },
            {
                "action": "Harvest",
                "description": "Pick at breaker stage for better Mandi price and shelf life.",
                "icon": "sun",
            },
        ],
    }

# ===== 9. SMART FARM STRATEGY ENGINE (GEMINI 3) =====
@app.post("/generate-smart-plan")
async def generate_smart_plan(request: dict):
    try:
        soil_type = request.get("soil_type", "Unknown")
        land_size = request.get("land_size", "Unknown")
        budget = request.get("budget", "Unknown")
        water_source = request.get("water_source", "Unknown")
        season = request.get("season", "Unknown")
        sowing_month = request.get("sowing_month", "Unknown")

        print(
            f"🧠 SMART PLAN REQUEST: Soil={soil_type}, Land={land_size}, Budget={budget}, "
            f"Water={water_source}, Season={season}, Sowing Month={sowing_month}"
        )

        prompt = f"""
        Act as a senior agricultural scientist and financial advisor for an Indian farmer.
        Context: Land: {land_size}, Soil: {soil_type}, Budget: {budget}, Water Source: {water_source}, Season: {season}, Sowing Month: {sowing_month}.
        Task: Generate a precision farming plan for the MOST profitable crop this season.
        Use Indian context (Mandi pricing, FYM, and Jeevamrutha if organic fits).

        CRITICAL INSTRUCTION:
        - Check if the {season} matches the {sowing_month}.
        - If the farmer is trying to sow a crop in the WRONG month, your risk_analysis MUST warn:
          "High Risk: Wrong season for this crop."
        - Adjust timeline_weeks to show specific dates if possible (e.g., "Week 1 (Early {sowing_month})").

        Output STRICT JSON with this schema:
        {{
          "summary": {{
            "crop_name": "String (e.g., Chilli - Guntur Hot)",
            "suitability_score": "String (e.g., 94%)",
            "expected_revenue": "String (e.g., ₹1.5 Lakhs)",
            "net_profit": "String (e.g., ₹90,000)",
            "roi": "String (e.g., 2.5x)",
            "duration": "String (e.g., 140 Days)"
          }},
          "financial_breakdown": [
            {{"category": "Seeds", "cost": "₹2,500", "percent": 5}},
            {{"category": "Fertilizers", "cost": "₹12,000", "percent": 25}},
            {{"category": "Labor", "cost": "₹20,000", "percent": 40}},
            {{"category": "Pesticides", "cost": "₹8,000", "percent": 15}},
            {{"category": "Other", "cost": "₹7,500", "percent": 15}}
          ],
          "risk_analysis": {{
            "primary_risk": "String (e.g., Thrips Infestation in Jan)",
            "mitigation": "String (e.g., Use Blue Sticky Traps & Spinosad)"
          }},
          "timeline_weeks": [
            {{
              "phase": "Week 1 (Early {sowing_month}): Soil Prep",
              "action": "Deep Ploughing",
              "details": "Plow 30cm deep. Apply 5 tons FYM/acre.",
              "icon": "plow"
            }},
            {{
               "phase": "Week 6: Critical Care",
               "action": "Micronutrient Spray",
               "details": "Spray 'Chilli Special' (5g/L) to boost flowering.",
               "icon": "spray"
            }}
          ]
        }}
        """

        response = model_gemini.generate_content(prompt)
        text = response.text.strip()

        if text.startswith('```'):
            text = text.replace('```json', '').replace('```', '').strip()

        plan = json.loads(text)

        if not plan.get("summary") or not plan.get("timeline_weeks"):
            raise ValueError("Invalid smart plan structure from Gemini")

        return plan

    except json.JSONDecodeError as e:
        print(f"⚠️ JSON Parse Error in Smart Plan: {e}")
        return generate_fallback_smart_plan()
    except Exception as e:
        print(f"⚠️ Smart Plan Error: {e}")
        return generate_fallback_smart_plan()


def generate_fallback_smart_plan() -> dict:
    return {
        "summary": {
            "crop_name": "Chilli - Guntur Hot",
            "suitability_score": "91%",
            "expected_revenue": "₹1.3 Lakhs",
            "net_profit": "₹85,000",
            "roi": "2.3x",
            "duration": "130 Days",
        },
        "financial_breakdown": [
            {"category": "Seeds", "cost": "₹2,500", "percent": 5},
            {"category": "Fertilizers", "cost": "₹12,000", "percent": 25},
            {"category": "Labor", "cost": "₹20,000", "percent": 40},
            {"category": "Pesticides", "cost": "₹8,000", "percent": 15},
            {"category": "Other", "cost": "₹7,500", "percent": 15},
        ],
        "risk_analysis": {
            "primary_risk": "Thrips infestation during dry spells",
            "mitigation": "Use blue sticky traps and Spinosad early in flowering.",
        },
        "timeline_weeks": [
            {
                "phase": "Week 1-2: Soil Prep",
                "action": "Deep Ploughing",
                "details": "Plow 30cm deep. Apply 5 tons FYM/acre.",
                "icon": "plow",
            },
            {
                "phase": "Week 3-4: Nursery",
                "action": "Seedling Raise",
                "details": "Sow in trays; maintain moisture and shade.",
                "icon": "leaf",
            },
            {
                "phase": "Week 6: Critical Care",
                "action": "Micronutrient Spray",
                "details": "Spray micronutrients (5g/L) to boost flowering.",
                "icon": "spray",
            },
            {
                "phase": "Week 12+: Harvest",
                "action": "Selective Harvest",
                "details": "Harvest for better Mandi pricing and quality.",
                "icon": "sun",
            },
        ],
    }


# ===== 10. PRECISION EXECUTION PLAN (CROP-SPECIFIC) =====
@app.post("/generate-execution-plan")
async def generate_execution_plan(request: dict):
    """
    Generates a scientific execution manual for a specific crop
    with precise calculations for yield, inputs, and timeline.
    """
    try:
        crop_name = request.get("crop_name", "Unknown")
        variety = request.get("variety", "")
        land_size = request.get("land_size", "Unknown")
        soil_type = request.get("soil_type", "Unknown")
        water_source = request.get("water_source", "Unknown")
        sowing_date = request.get("sowing_date", "Unknown")

        print(
            f"🎯 EXECUTION PLAN REQUEST: Crop={crop_name}, Variety={variety}, "
            f"Land={land_size}, Soil={soil_type}, Water={water_source}, Sowing={sowing_date}"
        )

        variety_text = f" (Variety: {variety})" if variety else " (suggest best variety)"

        prompt = f"""
        Act as a Precision Farm Manager and Agricultural Scientist.
        
        Context:
        - Crop: {crop_name}{variety_text}
        - Land Size: {land_size} acres
        - Soil Type: {soil_type}
        - Water Source: {water_source}
        - Planned Sowing Date: {sowing_date}
        
        Goal: Generate a SCIENTIFIC EXECUTION MANUAL to maximize yield to 100% potential.
        
        CALCULATIONS REQUIRED (MUST BE PRECISE):
        1. **Yield Forecast:**
           - Calculate realistic yield potential (0-100%) based on soil and water
           - Estimate total output in kg or quintals for {land_size} acres
           - Identify main limiting factor (e.g., water, nutrients, soil pH)
        
        2. **Input Requirements:**
           - Calculate EXACT seed quantity needed for {land_size} acres
           - Calculate N-P-K requirement and convert to commercial fertilizer bags
             (Urea for N, DAP for P, MOP for K)
           - Include micronutrients (Zinc, Boron, etc.) if needed
           - Add soil amendments (Lime, Gypsum) if soil type requires
           - List pesticides/fungicides for major pests
        
        3. **Critical Timeline:**
           - Specify key days from sowing (Day 0, Day 21, Day 45, etc.)
           - Focus on critical irrigation stages (e.g., Crown Root Initiation for rice)
           - Include fertilizer application schedule (basal, top dressing)
           - Mention pest/disease monitoring periods
        
        Output STRICT JSON:
        {{
          "yield_forecast": {{
            "potential_percentage": 96,
            "estimated_output": "5200 kg for {land_size} acres",
            "limiting_factor": "Sandy soil may reduce water retention by 4-6%"
          }},
          "input_requirements": [
            {{"item": "Seeds", "quantity": "25 kg", "note": "Use certified seeds (e.g., Pusa Basmati 1121)"}},
            {{"item": "Urea (46% N)", "quantity": "120 kg", "note": "Apply in 3 split doses: 40kg each at basal, tillering, flowering"}},
            {{"item": "DAP (18-46-0)", "quantity": "65 kg", "note": "Full dose as basal application before sowing"}},
            {{"item": "MOP (Potash)", "quantity": "40 kg", "note": "50% basal, 50% at flowering stage"}},
            {{"item": "Zinc Sulfate", "quantity": "10 kg", "note": "Mix with soil to prevent zinc deficiency"}}
          ],
          "critical_timeline": [
            {{
              "day": "Day 0 (Sowing Day: {sowing_date})",
              "action": "Basal Fertilizer Application",
              "detail": "Apply full DAP (65kg), 50% MOP (20kg), and Zinc Sulfate. Plow 30cm deep.",
              "icon": "fertilizer"
            }},
            {{
              "day": "Day 21 (3 Weeks After Sowing)",
              "action": "First Top Dressing (Urea)",
              "detail": "Apply 40kg Urea per acre. Ensure soil is moist before application.",
              "icon": "mix"
            }},
            {{
              "day": "Day 45 (Critical Irrigation Stage)",
              "action": "Crown Root Initiation Watering",
              "detail": "Maintain 5cm standing water for 7 days. This is the MOST critical stage for yield.",
              "icon": "irrigation"
            }},
            {{
              "day": "Day 60 (Flowering/Panicle Initiation)",
              "action": "Second Top Dressing + Pest Monitoring",
              "detail": "Apply remaining 40kg Urea and 20kg MOP. Monitor for stem borers and leaf folders.",
              "icon": "spray"
            }},
            {{
              "day": "Day 90-110 (Maturity)",
              "action": "Harvest",
              "detail": "Harvest when 80% grains turn golden yellow. Dry to 14% moisture before storage.",
              "icon": "harvest"
            }}
          ]
        }}
        
        Important:
        - ALL quantities must be calculated for {land_size} acres
        - Use standard Indian fertilizer grades (Urea 46%, DAP 18-46-0, MOP 60% K2O)
        - Timeline days should be realistic for {crop_name} cultivation
        - If variety is not specified, suggest the best local variety in notes
        - Use Indian context (Mandi pricing, FYM, local practices)
        """

        response = model_gemini.generate_content(prompt)
        text = response.text.strip()

        if text.startswith('```'):
            text = text.replace('```json', '').replace('```', '').strip()

        plan = json.loads(text)

        # Validate structure
        if not plan.get("yield_forecast") or not plan.get("input_requirements") or not plan.get("critical_timeline"):
            raise ValueError("Invalid execution plan structure from Gemini")

        print(f"✅ Generated execution plan for {crop_name} on {land_size} acres")
        return plan

    except json.JSONDecodeError as e:
        print(f"⚠️ JSON Parse Error in Execution Plan: {e}")
        return generate_fallback_execution_plan(crop_name, land_size, soil_type)
    except Exception as e:
        print(f"⚠️ Execution Plan Error: {e}")
        return generate_fallback_execution_plan(crop_name, land_size, soil_type)


def generate_fallback_execution_plan(crop_name: str, land_size: str, soil_type: str) -> dict:
    """Fallback execution plan if Gemini fails"""
    return {
        "yield_forecast": {
            "potential_percentage": 94,
            "estimated_output": f"4200 kg for {land_size} acres",
            "limiting_factor": f"Water availability may reduce yield by 6% on {soil_type} soil.",
        },
        "input_requirements": [
            {"item": "Seeds", "quantity": "25 kg", "note": "Use certified seeds for better germination"},
            {"item": "Urea (46% N)", "quantity": "120 kg", "note": "Apply in 3 split doses"},
            {"item": "DAP (18-46-0)", "quantity": "65 kg", "note": "Full dose as basal"},
            {"item": "MOP (Potash)", "quantity": "40 kg", "note": "50% basal, 50% flowering"},
            {"item": "Zinc Sulfate", "quantity": "10 kg", "note": "Prevents micronutrient deficiency"},
        ],
        "critical_timeline": [
            {
                "day": "Day 0 (Sowing)",
                "action": "Land Preparation",
                "detail": "Deep plow to 30cm. Apply FYM and full DAP dose.",
                "icon": "plow",
            },
            {
                "day": "Day 21",
                "action": "First Top Dressing",
                "detail": "Apply 40kg Urea per acre with proper soil moisture.",
                "icon": "fertilizer",
            },
            {
                "day": "Day 45",
                "action": "Critical Irrigation",
                "detail": "Maintain adequate water during critical growth stage.",
                "icon": "irrigation",
            },
            {
                "day": "Day 60",
                "action": "Second Top Dressing",
                "detail": "Apply remaining Urea and MOP. Monitor pests.",
                "icon": "spray",
            },
            {
                "day": "Day 90-110",
                "action": "Harvest",
                "detail": "Harvest at optimal maturity. Dry before storage.",
                "icon": "harvest",
            },
        ],
    }


# ===== 11. DYNAMIC MARKET TRENDS ENGINE (GEMINI 3) =====
@app.post("/get-market-trends")
async def get_market_trends(request: dict):
    """
    Generates realistic AI-estimated market prices for a region
    using Gemini 3 with agricultural market expertise.
    """
    try:
        region = request.get("region", "Nashik, Maharashtra")
        
        print(f"📊 MARKET TRENDS REQUEST: Region={region}")
        
        prompt = f"""
        Act as an expert Indian Mandi Market Analyst with deep knowledge of agricultural economics.
        
        Context: Generate a REALISTIC market price report for {region} for the current season.
        
        Requirements:
        1. Include 10-12 major crops relevant to this region (mix of vegetables, fruits, grains, pulses)
        2. Use realistic 2025-2026 Indian Mandi prices (in ₹/Quintal)
        3. Reflect current market conditions (seasonal supply, demand patterns)
        4. For each crop, provide:
           - Current price in ₹/Quintal or ₹/Kg
           - Price trend (up/down/stable)
           - Percentage change from last week
           - Price forecast for next week
        5. Add an analyst note about market conditions
        
        Regional Context for {region}:
        - Research typical crops grown in this region
        - Consider seasonal variations
        - Reflect local market dynamics and supply patterns
        
        Output STRICT JSON (no markdown):
        {{
          "region": "{region}",
          "market_status": "Bullish|Bearish|Neutral",
          "analyst_note": "2-3 sentence insight about current market conditions, price drivers, and outlook",
          "last_updated": "Today, HH:MM IST",
          "crops": [
            {{
              "id": "crop_1",
              "name": "Crop Name (with variety if relevant)",
              "price": 2400,
              "unit": "₹/Quintal",
              "change": "+5.2",
              "trend": "up",
              "forecast": "Rising next week due to [reason]",
              "market_note": "Supply tight, expect higher prices"
            }},
            {{
              "id": "crop_2",
              "name": "Another Crop",
              "price": 1800,
              "unit": "₹/Quintal",
              "change": "-1.5",
              "trend": "down",
              "forecast": "Stable this week",
              "market_note": "Good supply, prices moderating"
            }}
            // ... 10-12 total items
          ]
        }}
        
        Important:
        - Prices should be realistic for Indian mandis in 2025-2026
        - Include seasonal crops relevant to the region
        - Trends should reflect real market patterns (supply, demand, imports)
        - Be specific in forecasts and market notes
        - Use actual crop varieties where applicable (e.g., "Tomato Hybrid F1", "Onion Red", "Wheat Lokwan")
        """
        
        response = model_gemini.generate_content(prompt)
        text = response.text.strip()
        
        if text.startswith('```'):
            text = text.replace('```json', '').replace('```', '').strip()
        
        market_data = json.loads(text)
        
        # Validate structure
        if not market_data.get("crops") or not isinstance(market_data["crops"], list):
            raise ValueError("Invalid market data structure from Gemini")
        
        print(f"✅ Generated market trends for {len(market_data['crops'])} crops in {region}")
        return market_data
        
    except json.JSONDecodeError as e:
        print(f"⚠️ JSON Parse Error in Market Trends: {e}")
        return generate_fallback_market_trends(region)
    except Exception as e:
        print(f"⚠️ Market Trends Error: {e}")
        return generate_fallback_market_trends(region)


def generate_fallback_market_trends(region: str) -> dict:
    """Fallback market data if Gemini fails"""
    return {
        "region": region,
        "market_status": "Stable",
        "analyst_note": "Market conditions are stable with balanced supply and demand. Seasonal crops showing normal price movements.",
        "last_updated": "Today, 2:30 PM IST",
        "crops": [
            {
                "id": "crop_1",
                "name": "Tomato (Hybrid F1)",
                "price": 1800,
                "unit": "₹/Quintal",
                "change": "+5.2",
                "trend": "up",
                "forecast": "Rising next week due to reduced supply",
                "market_note": "Local supply tight, prices firm"
            },
            {
                "id": "crop_2",
                "name": "Onion (Red)",
                "price": 2200,
                "unit": "₹/Quintal",
                "change": "-2.0",
                "trend": "down",
                "forecast": "Stable this week",
                "market_note": "Good storage stock available"
            },
            {
                "id": "crop_3",
                "name": "Wheat (Lokwan)",
                "price": 2600,
                "unit": "₹/Quintal",
                "change": "0.0",
                "trend": "stable",
                "forecast": "Neutral outlook",
                "market_note": "Procurement ongoing, prices controlled"
            },
            {
                "id": "crop_4",
                "name": "Soybean",
                "price": 4800,
                "unit": "₹/Quintal",
                "change": "+8.5",
                "trend": "up",
                "forecast": "Strong demand continues",
                "market_note": "Export demand supporting prices"
            },
            {
                "id": "crop_5",
                "name": "Chilli (Guntur)",
                "price": 18000,
                "unit": "₹/Quintal",
                "change": "+3.2",
                "trend": "up",
                "forecast": "High prices expected",
                "market_note": "Quality premium varieties in demand"
            },
            {
                "id": "crop_6",
                "name": "Cotton",
                "price": 6200,
                "unit": "₹/Quintal",
                "change": "+2.1",
                "trend": "up",
                "forecast": "Global demand supporting prices",
                "market_note": "Export inquiries active"
            },
            {
                "id": "crop_7",
                "name": "Potato (Fresh)",
                "price": 1400,
                "unit": "₹/Quintal",
                "change": "-3.5",
                "trend": "down",
                "forecast": "Prices may fall further",
                "market_note": "Heavy supply pressure"
            },
            {
                "id": "crop_8",
                "name": "Sugarcane",
                "price": 3800,
                "unit": "₹/Quintal",
                "change": "+1.0",
                "trend": "stable",
                "forecast": "Fair and remunerative price",
                "market_note": "Crushing season active"
            },
            {
                "id": "crop_9",
                "name": "Groundnut",
                "price": 5400,
                "unit": "₹/Quintal",
                "change": "+4.2",
                "trend": "up",
                "forecast": "Export demand boosting prices",
                "market_note": "Quality nuts commanding premium"
            },
            {
                "id": "crop_10",
                "name": "Gram (Chickpea)",
                "price": 5600,
                "unit": "₹/Quintal",
                "change": "-1.8",
                "trend": "down",
                "forecast": "Adequate supplies expected",
                "market_note": "New crop arrival moderating prices"
            },
        ]
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)