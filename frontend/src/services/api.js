// API Configuration
const API_BASE_URL = "http://localhost:5000/api";

// Get token from localStorage
const getToken = () => localStorage.getItem("adminToken");

// Set token in localStorage
const setToken = (token) => localStorage.setItem("adminToken", token);

// Remove token from localStorage
const removeToken = () => localStorage.removeItem("adminToken");

// API call wrapper with error handling
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();

  const defaultHeaders = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  login: async (email, password) => {
    const data = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.success && data.data.token) {
      setToken(data.data.token);
    }
    return data;
  },

  logout: async () => {
    await apiCall("/auth/logout", {
      method: "POST",
    });
    removeToken();
  },

  getProfile: async () => {
    return await apiCall("/auth/me");
  },

  changePassword: async (currentPassword, newPassword) => {
    return await apiCall("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// Media APIs
export const mediaAPI = {
  upload: async (formData) => {
    return await apiCall("/media/upload", {
      method: "POST",
      body: formData,
    });
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    return await apiCall(`/media${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id) => {
    return await apiCall(`/media/${id}`);
  },

  update: async (id, updateData) => {
    return await apiCall(`/media/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  },

  delete: async (id) => {
    return await apiCall(`/media/${id}`, {
      method: "DELETE",
    });
  },

  getStats: async () => {
    return await apiCall("/media/admin/stats");
  },
};

// Health check
export const healthCheck = async () => {
  return await apiCall("/health");
};

export { getToken, removeToken };
