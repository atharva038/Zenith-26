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

// Add auth token to requests - use appropriate token based on API endpoint
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    const coordinatorToken = localStorage.getItem("coordinatorToken");
    const mediaTeamToken = localStorage.getItem("mediaTeamToken");

    // Determine which token to use based on the URL path
    const url = config.url || "";
    let token = null;

    if (url.includes("/game-coordinator") || url.includes("/coordinator")) {
      // Coordinator API calls should use coordinator token
      token = coordinatorToken;
    } else if (url.includes("/media-team")) {
      // Media team API calls should use media team token
      token = mediaTeamToken;
    } else if (url.includes("/admin")) {
      // Admin API calls should use admin token
      token = adminToken;
    } else {
      // For other endpoints, prefer the most specific token available
      // based on which user type is likely making the request
      token = adminToken || coordinatorToken || mediaTeamToken;
    }

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
      // Determine which user type based on the failed request URL
      const url = error.config?.url || "";

      if (url.includes("/game-coordinator") || url.includes("/coordinator")) {
        // Coordinator session expired
        localStorage.removeItem("coordinatorToken");
        localStorage.removeItem("coordinatorData");
        window.location.href = "/coordinator/login";
      } else if (url.includes("/media-team")) {
        // Media team session expired
        localStorage.removeItem("mediaTeamToken");
        localStorage.removeItem("mediaTeamData");
        window.location.href = "/media-team/login";
      } else if (url.includes("/admin")) {
        // Admin session expired
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        window.location.href = "/admin/login";
      }
      // For other endpoints, don't auto-redirect
    }
    return Promise.reject(error);
  },
);

export default api;

// Also export base URL for backward compatibility
export { API_BASE_URL };
