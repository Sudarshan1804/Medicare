const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get user from localStorage
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  signup: (userData) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiCall('/auth/profile'),
  
  updateLocation: (latitude, longitude) => apiCall('/auth/location', {
    method: 'PUT',
    body: JSON.stringify({ latitude, longitude }),
  }),
};

// Hospital APIs
export const hospitalAPI = {
  getNearby: (latitude, longitude, radius = 10, options = {}) => {
    let url = `/hospitals/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
    if (options.specialty) url += `&specialty=${options.specialty}`;
    if (options.useGooglePlaces) url += `&useGooglePlaces=${options.useGooglePlaces}`;
    return apiCall(url);
  },
  
  getAll: () => apiCall('/hospitals'),
  
  getById: (id) => apiCall(`/hospitals/${id}`),
};

// Pharmacy APIs
export const pharmacyAPI = {
  getNearby: (latitude, longitude, radius = 10, options = {}) => {
    let url = `/pharmacies/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
    if (options.open24x7) url += `&open24x7=${options.open24x7}`;
    if (options.useGooglePlaces) url += `&useGooglePlaces=${options.useGooglePlaces}`;
    return apiCall(url);
  },
  
  getAll: () => apiCall('/pharmacies'),
  
  getById: (id) => apiCall(`/pharmacies/${id}`),
};

// Location APIs - NEW: Uses Google Places API with MongoDB fallback
export const locationAPI = {
  // Get nearby places (hospitals, pharmacies, or both) using Google Places API
  getNearby: (latitude, longitude, radius = 5, type = 'both') => {
    const url = `/location/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}&type=${type}`;
    return apiCall(url);
  },
  
  // Get directions from origin to destination
  getDirections: (originLat, originLng, destLat, destLng, placeId = null) => {
    let url = `/location/directions?originLat=${originLat}&originLng=${originLng}`;
    if (placeId) {
      url += `&placeId=${placeId}`;
    } else {
      url += `&destLat=${destLat}&destLng=${destLng}`;
    }
    return apiCall(url);
  },
};

// AI Assistant APIs - NEW: OpenRouter-powered medical assistant
export const assistantAPI = {
  // Chat with AI medical assistant
  chat: (query, conversationHistory = []) => apiCall('/assistant/chat', {
    method: 'POST',
    body: JSON.stringify({ query, conversationHistory }),
  }),
  
  // Identify pill from image (base64)
  identifyPill: (imageBase64, query = 'Identify this pill') => apiCall('/assistant/identify-pill', {
    method: 'POST',
    body: JSON.stringify({ image: imageBase64, query }),
  }),
  
  // Get medicine information
  getMedicineInfo: (medicineName) => apiCall(`/assistant/medicine/${encodeURIComponent(medicineName)}`),
};

export default {
  auth: authAPI,
  hospitals: hospitalAPI,
  pharmacies: pharmacyAPI,
  location: locationAPI,
  assistant: assistantAPI,
};
