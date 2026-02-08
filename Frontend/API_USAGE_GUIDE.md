# API Configuration Guide

## Overview

All API endpoints, configurations, and keys are centralized in `/Frontend/services/api.ts`. This file provides a single source of truth for all API-related configurations across the project.

## Usage

### Importing API Configuration

```typescript
// Import specific items
import { API_ENDPOINTS, BASE_URL, API_KEYS } from '../services/api';

// Or import everything
import API from '../services/api';
```

### Using API Endpoints

```typescript
// In your service or component
import { API_ENDPOINTS } from '../services/api';

// Use predefined endpoints
const response = await fetch(API_ENDPOINTS.scanDisease, {
  method: 'POST',
  body: formData
});
```

### Available Endpoints

| Endpoint | URL | Purpose |
|----------|-----|---------|
| `scanDisease` | `/scan_disease` | Disease detection from leaf images |
| `weather` | `/weather` | Weather information |
| `marketPrices` | `/market-prices` | Market price trends |
| `cropAdvisory` | `/crop-advisory` | Crop recommendations |
| `farmPlanner` | `/farm-planner` | Farm planning tools |
| `healthCheck` | `/health` | Backend health check |
| `status` | `/status` | Backend status |

### Environment Variables

Create a `.env` file in the Frontend directory:

```env
# API Keys
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_WEATHER_API_KEY=your_weather_key_here
VITE_MAPS_API_KEY=your_maps_key_here

# Production URLs (optional)
VITE_BACKEND_URL=https://api.prithvipulse.com
VITE_FRONTEND_URL=https://prithvipulse.com
```

### Accessing API Keys

```typescript
import { API_KEYS } from '../services/api';

const geminiKey = API_KEYS.gemini;
```

### Helper Functions

#### 1. Build URL with Query Parameters

```typescript
import { buildUrl } from '../services/api';

const url = buildUrl(API_ENDPOINTS.weather, {
  lat: 28.7041,
  lon: 77.1025,
  lang: 'en'
});
// Result: http://localhost:8000/weather?lat=28.7041&lon=77.1025&lang=en
```

#### 2. Check Backend Health

```typescript
import { checkBackendHealth } from '../services/api';

const isHealthy = await checkBackendHealth();
if (!isHealthy) {
  console.error('Backend is not responding');
}
```

#### 3. Make API Request with Timeout

```typescript
import { apiRequest, API_ENDPOINTS } from '../services/api';

try {
  const data = await apiRequest<DiagnosisResult>(
    API_ENDPOINTS.scanDisease,
    {
      method: 'POST',
      body: formData
    }
  );
  console.log(data);
} catch (error) {
  console.error('API request failed:', error);
}
```

## Configuration Options

### API Config

```typescript
API_CONFIG = {
  timeout: 30000,        // 30 seconds
  retries: 3,            // Number of retry attempts
  retryDelay: 1000,      // 1 second between retries
  headers: {
    'Content-Type': 'application/json'
  }
}
```

### HTTP Methods

```typescript
import { HTTP_METHODS } from '../services/api';

fetch(url, { method: HTTP_METHODS.POST });
```

### Status Codes

```typescript
import { STATUS_CODES } from '../services/api';

if (response.status === STATUS_CODES.NOT_FOUND) {
  // Handle 404
}
```

### Error Messages

```typescript
import { ERROR_MESSAGES } from '../services/api';

throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
```

## Environment-Based URLs

The configuration automatically switches between development and production:

### Development (default)
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

### Production
- Backend: Set via `VITE_BACKEND_URL` or defaults to `https://api.prithvipulse.com`
- Frontend: Set via `VITE_FRONTEND_URL` or defaults to `https://prithvipulse.com`

## Examples

### Example 1: Disease Detection

```typescript
import { API_ENDPOINTS } from '../services/api';

const analyzeImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_ENDPOINTS.scanDisease, {
    method: 'POST',
    body: formData
  });

  return await response.json();
};
```

### Example 2: Using Helper with Retry

```typescript
import { apiRequest, API_ENDPOINTS } from '../services/api';

const fetchCropAdvisory = async (region: string) => {
  try {
    const data = await apiRequest(
      buildUrl(API_ENDPOINTS.cropAdvisory, { region }),
      { method: 'GET' }
    );
    return data;
  } catch (error) {
    console.error('Failed to fetch crop advisory:', error);
    throw error;
  }
};
```

### Example 3: Health Check on App Load

```typescript
import { checkBackendHealth } from '../services/api';

useEffect(() => {
  const checkHealth = async () => {
    const isHealthy = await checkBackendHealth();
    setBackendStatus(isHealthy ? 'online' : 'offline');
  };
  
  checkHealth();
}, []);
```

## Adding New Endpoints

To add a new endpoint, update `/Frontend/services/api.ts`:

```typescript
export const API_ENDPOINTS = {
  // Existing endpoints...
  scanDisease: `${BASE_URL}/scan_disease`,
  
  // Add your new endpoint
  newEndpoint: `${BASE_URL}/new-endpoint`,
} as const;
```

Then use it anywhere in your project:

```typescript
import { API_ENDPOINTS } from '../services/api';

fetch(API_ENDPOINTS.newEndpoint);
```

## Benefits

✅ **Single Source of Truth**: All API configurations in one place  
✅ **Environment Management**: Automatic switching between dev/prod  
✅ **Type Safety**: TypeScript support with `as const`  
✅ **Easy Updates**: Change URLs once, apply everywhere  
✅ **Helper Functions**: Built-in utilities for common tasks  
✅ **Error Handling**: Consistent error messages and status codes  

## Files Updated

The following files now use centralized API configuration:

- ✅ `Frontend/services/api.ts` (New centralized config)
- ✅ `Frontend/services/backendService.ts`
- ✅ `Frontend/services/geminiService.ts`
- ✅ `Frontend/components/ScanView.tsx`

## Migration Checklist

When adding new API calls:

- [ ] Import from `../services/api`
- [ ] Use `API_ENDPOINTS.*` instead of hardcoded URLs
- [ ] Use `API_KEYS.*` for API keys
- [ ] Consider using `apiRequest()` helper for timeout handling
- [ ] Add new endpoints to `API_ENDPOINTS` object
