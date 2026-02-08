# 🔑 Where to Paste Your API Keys

## Quick Answer

**Open this file and paste your API keys:**
```
Frontend/.env
```

## Step-by-Step Instructions

### Step 1: Open the .env File
Navigate to:
```
PrithviPulse/Frontend/.env
```

### Step 2: Paste Your API Keys

The file looks like this:
```env
# Google Gemini AI API Key (Required for Gemini Hackathon)
VITE_GEMINI_API_KEY=

# Weather API Key (optional)
VITE_WEATHER_API_KEY=

# Maps API Key (optional)
VITE_MAPS_API_KEY=
```

**Replace the empty values with your actual keys:**
```env
# Google Gemini AI API Key (Required for Gemini Hackathon)
VITE_GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Weather API Key (optional)
VITE_WEATHER_API_KEY=

# Maps API Key (optional)
VITE_MAPS_API_KEY=
```

### Step 3: Save the File

After pasting your keys:
1. Save the file (Ctrl+S or Cmd+S)
2. Close the file
3. Restart the frontend server if it's running

## 📍 Where to Get API Keys

### Google Gemini API Key (Required for Gemini Hackathon)
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in `.env` file next to `VITE_GEMINI_API_KEY=`

**Note**: This project is built for the Gemini API Developer Competition, showcasing Gemini's vision capabilities for agricultural disease detection.

## ⚠️ Important Notes

### ✅ DO:
- Keep your `.env` file in the `Frontend` folder
- Never share your API keys publicly
- Restart frontend server after changing `.env`

### ❌ DON'T:
- Don't commit `.env` file to git (it's already ignored)
- Don't put API keys in quotes
- Don't add spaces before or after the `=` sign

## 📂 File Location Visual

```
PrithviPulse/
├── Backend/
│   └── main.py
├── Frontend/              👈 Go here
│   ├── .env              👈 Open this file
│   ├── .env.example      👈 Template (don't edit this)
│   ├── package.json
│   └── src/
├── README.md
└── .gitignore
```

## 🧪 Testing Your API Keys

After pasting your keys:

1. **Start Backend**:
```bash
cd Backend
python main.py
```

2. **Start Frontend**:
```bash
cd Frontend
npm run dev
```

3. **Test the app**:
   - Open http://localhost:3001
   - Navigate to "Scan & Diagnose"
   - Upload a leaf image
   - If diagnosis works → API key is correct! ✅

## ❓ Common Issues

### Issue: "API key not found"
**Solution**: Make sure the file is named exactly `.env` (with the dot at the beginning)

### Issue: "Invalid API key"
**Solution**: 
- Check for extra spaces or quotes
- Regenerate the API key from Google AI Studio
- Make sure you copied the entire key

### Issue: Changes not working
**Solution**: 
- Restart the frontend server (Ctrl+C, then `npm run dev`)
- Clear browser cache (Ctrl+Shift+R)

## 📞 Need Help?

If you're still having trouble:
1. Check if `.env` file exists in `Frontend` folder
2. Verify API key is valid on Google AI Studio
3. Check browser console (F12) for error messages
4. Ensure no extra spaces or characters in `.env` file

---

**Remember**: The `.env` file path is:
```
Frontend/.env  👈 Paste your API keys here!
```
