import axios from "axios";

// Determine API base URL based on environment
// Priority: 1. VITE_API_URL env var, 2. localhost for dev, 3. production URL
const getApiBaseUrl = () => {
  // If explicit VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Check if we're on localhost (development)
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("local");

  if (isLocalhost) {
    return "http://localhost:5000";
  }

  // Production URL
  return "https://zenithapp-5onhx.ondigitalocean.app";
};

const API_BASE_URL = getApiBaseUrl();

console.log("🌐 API Base URL:", API_BASE_URL);
console.log("🔧 Environment Mode:", import.meta.env.MODE);
console.log("🔧 VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("🏠 Hostname:", window.location.hostname);

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 second timeout for large media uploads
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// Also export base URL for backward compatibility
export {API_BASE_URL};
