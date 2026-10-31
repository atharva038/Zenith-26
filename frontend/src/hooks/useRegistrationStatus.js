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
      // Backend is offline — use static fallback so 3D pages remain fully visible
      console.warn("⚠️ Backend offline — using static fallback for registration status:", error.message);
      setStatus({
        isCricketOpen: true,
        isOtherSportsOpen: true,
        isOpen: true,
        loading: false,
        message: "Registration closed",
        startDate: null,
        endDate: null,
        paymentQrUrl: "",
        error: null, // Don't surface the error to UI — degrade gracefully
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
