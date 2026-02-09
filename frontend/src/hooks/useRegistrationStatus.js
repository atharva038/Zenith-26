import { useState, useEffect } from "react";
import api from "../config/api";

/**
 * Hook to check if registration is globally enabled
 * Returns: { 
 *   isCricketOpen, 
 *   isOtherSportsOpen, 
 *   isOpen (legacy),
 *   loading, 
 *   message, 
 *   paymentQrUrl,
 *   error, 
 *   refetch 
 * }
 */
export const useRegistrationStatus = () => {
  const [status, setStatus] = useState({
    isCricketOpen: false,
    isOtherSportsOpen: false,
    isOpen: false, // Legacy field
    loading: true,
    message: "",
    startDate: null,
    endDate: null,
    paymentQrUrl: "",
    error: null,
  });

  const fetchStatus = async () => {
    try {
      setStatus((prev) => ({ ...prev, loading: true, error: null }));
      
      const response = await api.get("/settings/status");
      
      console.log("📋 Registration Status Response:", response.data);
      
      if (response.data.success) {
        setStatus({
          isCricketOpen: response.data.isCricketOpen,
          isOtherSportsOpen: response.data.isOtherSportsOpen,
          isOpen: response.data.isOpen, // Legacy field
          loading: false,
          message: response.data.message,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          paymentQrUrl: response.data.paymentQrUrl,
          error: null,
        });
        
        console.log("✅ Registration Status Set:", {
          cricket: response.data.isCricketOpen,
          otherSports: response.data.isOtherSportsOpen,
          legacy: response.data.isOpen,
          message: response.data.message,
        });
      }
    } catch (error) {
      console.error("❌ Error fetching registration status:", error);
      setStatus({
        isCricketOpen: false,
        isOtherSportsOpen: false,
        isOpen: false,
        loading: false,
        message: "Unable to check registration status",
        startDate: null,
        endDate: null,
        paymentQrUrl: "",
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
