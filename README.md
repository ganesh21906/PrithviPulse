# PrithviPulse - AI-Powered Farm Disease Diagnosis

> 🏆 **Built for Gemini API Developer Competition** - Showcasing Google Gemini's vision capabilities for agricultural disease detection

A full-stack agricultural AI application that diagnoses plant diseases using hybrid cloud + local AI models with guaranteed uptime.

## 🌾 Features

- **AI Disease Detection**: Upload leaf images for instant disease diagnosis
- **Hybrid AI Architecture**: Google Gemini 3 Vision (primary) → Local CNN Model (fallback)
- **Professional Treatment Plans**: Step-by-step chemical & physical treatment recommendations
- **Interactive UI**: Text-to-speech, progress tracking, dynamic farm images
- **100% Uptime**: Automatic fallback to local H5 model when cloud API is unavailable

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - UI Framework
- **TypeScript** - Type safety
- **Vite** 6.4.1 - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Web Speech API** - Text-to-speech

### Backend
- **Python** - Server language
- **FastAPI** - Web framework
- **TensorFlow/Keras** - AI/ML
- **Pillow** - Image processing
- **NumPy** - Numerical computing

### AI Models
- **Google Gemini 3 Vision** - Primary AI for disease detection (Gemini Hackathon)
- **plant_disease_model.h5** - Local 38-class CNN (fallback when offline)

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- Google Cloud API key (for Gemini 3)

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/PrithviPulse.git
cd PrithviPulse
```

### 2. Backend Setup
```bash
cd Backend
pip install -r requirements.txt
```

Create `.env` file in Backend folder:
```
GOOGLE_API_KEY=your_google_api_key_here
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
```

**Configure API Keys** - Open `Frontend/.env` file and paste your API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

📍 **Where to get API key:**
- **Gemini API**: https://aistudio.google.com/app/apikey (Required for Gemini Hackathon)

💡 **Tip**: The `.env` file is already created in `Frontend/.env` - just open it and paste your keys!

## 🏃 Running the Application

### Start Backend (Terminal 1)
```bash
cd Backend
python main.py
```
Backend runs on: `http://localhost:8000`

### Start Frontend (Terminal 2)
```bash
cd Frontend
npm run dev
```
Frontend runs on: `http://localhost:3001`

## 📸 Usage

1. Open `http://localhost:3001` in your browser
2. Navigate to the Scan section
3. Upload a leaf image
4. Receive instant diagnosis with:
   - Disease name & confidence score
   - Professional summary
   - Step-by-step treatment instructions
   - Chemical recommendations
   - Preventative measures

## 🏗️ Project Structure

```
PrithviPulse/
├── Backend/
│   ├── main.py              # FastAPI server
│   ├── plant_disease_model.h5  # Local CNN model
│   └── requirements.txt
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   └── utils/           # Utilities
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔄 Hybrid AI Architecture

The application uses a fault-tolerant 2-tier system:

1. **TIER 1 (Primary)**: Google Gemini 3 Vision API
   - Cloud-based, most accurate
   - Returns professional diagnosis with detailed recommendations

2. **TIER 2 (Fallback)**: Local H5 CNN Model
   - Automatically activated if Gemini is unavailable
   - 38-class plant disease classifier
   - 81-99% accuracy on test images
   - Zero latency

## 📊 Disease Classes Supported

Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

Each with various disease conditions and healthy classification.

## 🔧 Configuration

### API Keys
- Get Google API key: https://ai.google.dev/
- Add to Backend/.env

### Model Customization
- Replace `plant_disease_model.h5` with your own trained model
- Update class names in Backend/main.py

## 📝 API Endpoints

### `/scan_disease` (POST)
Upload an image and get diagnosis
```bash
curl -X POST -F "file=@leaf.jpg" http://localhost:8000/scan_disease
```

Response:
```json
{
  "diseaseName": "Tomato - Early Blight",
  "confidence": 0.92,
  "healthy": false,
  "treatment": ["Step 1", "Step 2", ...],
  "preventativeMeasures": ["Measure 1", ...],
  "source": "⚡ Local H5 Model"
}
```

## 🌐 Components

- **ScanView** - Main scan interface
- **TreatmentTimeline** - Interactive treatment display
- **StepCard** - Individual treatment steps with TTS
- **DashboardCards** - Overview cards
- **WeatherView** - Weather integration
- **FarmMapWidget** - Farm location mapping

## 🎙️ Features

- **Text-to-Speech**: Hear treatment instructions
- **Progress Tracking**: Track completed treatment steps
- **Visual Treatment Guide**: Interactive step-by-step UI with icons
- **Safety Warnings**: Auto-detect chemical treatments
- **Responsive Design**: Works on desktop and mobile
- **Powered by Gemini**: Built for Gemini API Developer Competition

## 🧪 Testing

### Test with Sample Image
```bash
curl -X POST -F "file=@test_leaf.jpg" http://localhost:8000/scan_disease
```

## 📦 Build for Production

### Frontend
```bash
cd Frontend
npm run build
```
Output: `Frontend/dist/`

### Backend
Deploy using Docker or cloud platform:
```dockerfile
FROM python:3.9
WORKDIR /app
COPY Backend . 
RUN pip install -r requirements.txt
CMD ["python", "main.py"]
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file

## 📧 Support

For issues and questions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Plant diseases dataset from Kaggle
- Gemini 3 Vision AI by Google
- TensorFlow/Keras community
- React and Vite communities

---

**Built with ❤️ for farmers worldwide**
PrithviPulse is going to help Farmers
