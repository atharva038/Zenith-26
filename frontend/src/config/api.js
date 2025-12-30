import axios from "axios";

// Determine API base URL based on environment
const API_BASE_URL =
  import.meta.env.VITE_API_URL || // Use env var if available
  import.meta.env.MODE === "production"
    ? "https://zenithapp-5onhx.ondigitalocean.app" // Production URL
    : "http://localhost:5000"; // Development URL

console.log("🌐 API Base URL:", API_BASE_URL);
console.log("🔧 Environment Mode:", import.meta.env.MODE);

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
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
