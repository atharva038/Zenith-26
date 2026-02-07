import { useState, useEffect } from "react";
import api from "../config/api";

/**
 * Hook to check if registration is globally enabled
 * Returns: { isOpen, loading, message, error, refetch }
 */
export const useRegistrationStatus = () => {
  const [status, setStatus] = useState({
    isOpen: false,
    loading: true,
    message: "",
    startDate: null,
    endDate: null,
    error: null,
  });

  const fetchStatus = async () => {
    try {
      setStatus((prev) => ({ ...prev, loading: true, error: null }));
      
      const response = await api.get("/settings/status");
      
      console.log("📋 Registration Status Response:", response.data);
      
      if (response.data.success) {
        setStatus({
          isOpen: response.data.isOpen,
          loading: false,
          message: response.data.message,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          error: null,
        });
        
        console.log("✅ Registration Status Set:", {
          isOpen: response.data.isOpen,
          message: response.data.message,
        });
      }
    } catch (error) {
      console.error("❌ Error fetching registration status:", error);
      setStatus({
        isOpen: false,
        loading: false,
        message: "Unable to check registration status",
        startDate: null,
        endDate: null,
        error: error.message,
      });
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    ...status,
    refetch: fetchStatus,
  };
};
