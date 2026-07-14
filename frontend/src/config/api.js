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
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Handle authentication errors (401) and authorization errors (403)
    if (status === 401 || status === 403) {
      // Get current tokens to determine who is actually logged in
      const adminToken = localStorage.getItem("adminToken");
      const coordinatorToken = localStorage.getItem("coordinatorToken");
      const mediaTeamToken = localStorage.getItem("mediaTeamToken");

      // Determine which user type based on the failed request URL and which token is present
      if (url.includes("/game-coordinator") || url.includes("/coordinator")) {
        // Only clear/redirect if coordinator was actually trying to use this endpoint
        if (coordinatorToken) {
          localStorage.removeItem("coordinatorToken");
          localStorage.removeItem("coordinatorData");
          if (!window.location.pathname.includes("/coordinator/login")) {
            window.location.href = "/coordinator/login";
          }
        }
        // If no coordinator token but admin/media token exists, don't redirect
        // (admin/media might be on wrong page, let them handle it)
      } else if (url.includes("/media-team")) {
        // Only clear/redirect if media team was actually trying to use this endpoint
        if (mediaTeamToken) {
          localStorage.removeItem("mediaTeamToken");
          localStorage.removeItem("mediaTeamData");
          if (!window.location.pathname.includes("/media-team/login")) {
            window.location.href = "/media-team/login";
          }
        }
      } else if (url.includes("/admin")) {
        // Only clear/redirect if admin was actually trying to use this endpoint
        if (adminToken) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminData");
          if (!window.location.pathname.includes("/admin/login")) {
            window.location.href = "/admin/login";
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// Also export base URL for backward compatibility
export { API_BASE_URL };
