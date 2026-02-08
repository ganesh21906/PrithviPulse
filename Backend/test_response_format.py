import requests
import time

# Wait for server to be ready
time.sleep(2)

# Path to test image
image_path = r"c:\Users\MR_GK\Desktop\PrithviPulse\Zips\New Plant Diseases Dataset(Augmented)\New Plant Diseases Dataset(Augmented)\train\Apple___Apple_scab\2a59761b-c91c-451c-8e13-d9dc3aff8d29___FREC_Scab 3503.JPG"

# Send request
with open(image_path, 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:8000/scan_disease', files=files)

if response.status_code == 200:
    data = response.json()
    
    print("\n=== RESPONSE FORMAT CHECK ===")
    print(f"\n✅ Old format fields (for ScanView):")
    print(f"   - diagnosis_name: {data.get('diagnosis_name', 'MISSING')}")
    print(f"   - confidence_score: {data.get('confidence_score', 'MISSING')}")
    
    print(f"\n✅ New format fields (for ScanResult):")
    print(f"   - diseaseName: {data.get('diseaseName', 'MISSING')}")
    print(f"   - confidence: {data.get('confidence', 'MISSING')} (type: {type(data.get('confidence')).__name__})")
    print(f"   - healthy: {data.get('healthy', 'MISSING')}")
    print(f"   - treatment: {data.get('treatment', 'MISSING')[:2] if data.get('treatment') else 'MISSING'}... ({len(data.get('treatment', []))} items)")
    
    print(f"\n=== MATH TEST (ScanResult line 18) ===")
    conf = data.get('confidence')
    if conf is not None:
        result = round(conf * 100)
        print(f"   Math.round({conf} * 100) = {result}%")
        print(f"   ✅ This will display correctly!")
    else:
        print(f"   ❌ confidence is None - will show 0%")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
