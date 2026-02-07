import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../../config/api";

const DevRegistrationControl = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    registrationMessage: "",
    registrationStartDate: "",
    registrationEndDate: "",
  });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (response.data.success) {
        setSettings(response.data.data);
        setFormData({
          registrationMessage: response.data.data.registrationMessage || "",
          registrationStartDate: response.data.data.registrationStartDate
            ? new Date(response.data.data.registrationStartDate)
                .toISOString()
                .split("T")[0]
            : "",
          registrationEndDate: response.data.data.registrationEndDate
            ? new Date(response.data.data.registrationEndDate)
                .toISOString()
                .split("T")[0]
            : "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    try {
      setUpdating(true);
      const response = await api.post(
        "/settings/toggle",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (response.data.success) {
        setSettings(response.data.data);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling registration:", error);
      toast.error(
        error.response?.data?.message || "Failed to toggle registration"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const response = await api.put("/settings", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (response.data.success) {
        setSettings(response.data.data);
        toast.success("Settings updated successfully");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(
        error.response?.data?.message || "Failed to update settings"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Back Button */}
        <Link
          to="/dev"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-6 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Developer Portal
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Registration Control
            </span>
          </h1>
          <p className="text-gray-400">
            Control global registration availability for all sports and events
          </p>
        </div>

        {/* Main Toggle Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Registration Status
              </h2>
              <p className="text-gray-400 text-sm">
                Toggle to open or close all registrations globally
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={handleToggle}
              disabled={updating}
              className={`relative inline-flex h-16 w-32 items-center rounded-full transition-all duration-300 ${
                settings?.isRegistrationOpen
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-red-500 to-pink-500"
              } ${updating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-12 w-12 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                  settings?.isRegistrationOpen
                    ? "translate-x-16"
                    : "translate-x-2"
                }`}
              />
            </button>
          </div>

          {/* Status Display */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl ${
              settings?.isRegistrationOpen
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full ${
                settings?.isRegistrationOpen
                  ? "bg-green-400 animate-pulse"
                  : "bg-red-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                settings?.isRegistrationOpen
                  ? "text-green-300"
                  : "text-red-300"
              }`}
            >
              {settings?.isRegistrationOpen
                ? "🎉 Registrations are OPEN - Users can register for all sports"
                : "🔒 Registrations are CLOSED - Coming Soon will be displayed"}
            </span>
          </div>
        </motion.div>

        {/* Settings Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8"
        >
          <h2 className="text-xl font-bold mb-6">Additional Settings</h2>

          <form onSubmit={handleUpdateSettings} className="space-y-6">
            {/* Coming Soon Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Coming Soon Message
              </label>
              <textarea
                value={formData.registrationMessage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationMessage: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Message to display when registration is closed"
              />
              <p className="text-gray-500 text-xs mt-1">
                This message will be shown to users when registrations are closed
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Registration Start Date (Optional)
              </label>
              <input
                type="date"
                value={formData.registrationStartDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationStartDate: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Registration End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.registrationEndDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationEndDate: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={updating}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update Settings"}
            </button>
          </form>

          {/* Last Modified Info */}
          {settings?.updatedAt && (
            <div className="mt-6 p-4 bg-gray-900/30 rounded-lg">
              <p className="text-gray-400 text-sm">
                Last updated:{" "}
                {new Date(settings.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DevRegistrationControl;
