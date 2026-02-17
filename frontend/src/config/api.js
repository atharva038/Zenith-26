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
    // Check for admin token first, then coordinator token
    const adminToken = localStorage.getItem("adminToken");
    const coordinatorToken = localStorage.getItem("coordinatorToken");

    const token = adminToken || coordinatorToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check which type of user is logged in and redirect appropriately
      const coordinatorToken = localStorage.getItem("coordinatorToken");
      const adminToken = localStorage.getItem("adminToken");

      if (coordinatorToken) {
        // Coordinator session expired
        localStorage.removeItem("coordinatorToken");
        localStorage.removeItem("coordinatorData");
        window.location.href = "/coordinator/login";
      } else if (adminToken) {
        // Admin session expired
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        window.location.href = "/admin/login";
      }
      // If neither token exists, don't redirect (user is not logged in)
    }
    return Promise.reject(error);
  },
);

export default api;

// Also export base URL for backward compatibility
export { API_BASE_URL };
