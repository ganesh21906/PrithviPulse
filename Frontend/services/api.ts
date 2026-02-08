/**
 * Centralized API Configuration
 * All API endpoints and configurations for the entire project
 */

// Environment-based configuration
const ENV = import.meta.env.MODE || 'development';

// API Base URLs
export const API_BASE_URLS = {
  development: {
    backend: 'http://localhost:8000',
    frontend: 'http://localhost:3000'
  },
  production: {
    backend: import.meta.env.VITE_BACKEND_URL || 'https://api.prithvipulse.com',
    frontend: import.meta.env.VITE_FRONTEND_URL || 'https://prithvipulse.com'
  }
} as const;

// Get current environment URLs
const getCurrentUrls = () => {
  return API_BASE_URLS[ENV as keyof typeof API_BASE_URLS] || API_BASE_URLS.development;
};

export const BASE_URL = getCurrentUrls().backend;

// API Endpoints
export const API_ENDPOINTS = {
  // Disease Detection
  scanDisease: `${BASE_URL}/scan_disease`,
  
  // Future endpoints (ready for expansion)
  weather: `${BASE_URL}/weather`,
  marketPrices: `${BASE_URL}/market-prices`,
  cropAdvisory: `${BASE_URL}/crop-advisory`,
  farmPlanner: `${BASE_URL}/farm-planner`,
  
  // Health check
  healthCheck: `${BASE_URL}/health`,
  status: `${BASE_URL}/status`
} as const;

// API Keys (from environment variables)
export const API_KEYS = {
  gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
  weather: import.meta.env.VITE_WEATHER_API_KEY || '',
  maps: import.meta.env.VITE_MAPS_API_KEY || ''
} as const;

// API Request Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  headers: {
    'Content-Type': 'application/json'
  }
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
} as const;

// Response Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Unauthorized access.',
  BACKEND_OFFLINE: 'Backend server is offline. Please ensure the server is running.',
  INVALID_RESPONSE: 'Invalid response from server.'
} as const;

/**
 * Helper function to construct full URL
 */
export const buildUrl = (endpoint: string, params?: Record<string, string | number>): string => {
  const url = new URL(endpoint);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  
  return url.toString();
};

/**
 * Helper function to check if backend is available
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.healthCheck, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Helper function for API requests with timeout
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT);
      }
      throw error;
    }
    
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
};

// Export everything as a single object (optional convenience export)
export default {
  BASE_URL,
  API_ENDPOINTS,
  API_KEYS,
  API_CONFIG,
  HTTP_METHODS,
  STATUS_CODES,
  ERROR_MESSAGES,
  buildUrl,
  checkBackendHealth,
  apiRequest
};
