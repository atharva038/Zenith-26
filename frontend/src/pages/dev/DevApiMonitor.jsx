import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiRefreshCw,
  FiFilter,
  FiDownload,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";
import { toast } from "react-toastify";
// import api from "../../config/api";

const DevApiMonitor = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, success, error
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    error: 0,
    avgResponseTime: 0,
  });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration - In production, this would come from your backend
  const mockLogs = [
    {
      id: 1,
      method: "GET",
      endpoint: "/api/settings/status",
      status: 200,
      responseTime: 45,
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
      requestBody: null,
      responseBody: { success: true, isOpen: true },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 2,
      method: "POST",
      endpoint: "/api/auth/login",
      status: 200,
      responseTime: 234,
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      requestBody: { email: "admin@zenith.com" },
      responseBody: {
        success: true,
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 3,
      method: "GET",
      endpoint: "/api/registrations/sports",
      status: 200,
      responseTime: 123,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      requestBody: null,
      responseBody: { success: true, count: 45, data: "..." },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 4,
      method: "GET",
      endpoint: "/api/marathon/registrations",
      status: 200,
      responseTime: 156,
      timestamp: new Date(Date.now() - 1000 * 60 * 7),
      requestBody: null,
      responseBody: { success: true, count: 89, data: "..." },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: 5,
      method: "POST",
      endpoint: "/api/settings/toggle",
      status: 200,
      responseTime: 89,
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      requestBody: {},
      responseBody: { success: true, isOpen: false },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 6,
      method: "GET",
      endpoint: "/api/gallery/images",
      status: 200,
      responseTime: 342,
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      requestBody: null,
      responseBody: { success: true, images: "..." },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15",
    },
    {
      id: 7,
      method: "POST",
      endpoint: "/api/registrations/sports",
      status: 201,
      responseTime: 567,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      requestBody: {
        sport: "Football",
        teamName: "Warriors",
        captain: "John Doe",
      },
      responseBody: { success: true, registrationId: "REG123456" },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: 8,
      method: "GET",
      endpoint: "/api/admin/dashboard/stats",
      status: 200,
      responseTime: 78,
      timestamp: new Date(Date.now() - 1000 * 60 * 18),
      requestBody: null,
      responseBody: { success: true, totalRegistrations: 134, activeEvents: 8 },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 9,
      method: "PUT",
      endpoint: "/api/settings",
      status: 200,
      responseTime: 145,
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      requestBody: { registrationMessage: "Registrations open now!" },
      responseBody: { success: true, updated: true },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 10,
      method: "GET",
      endpoint: "/api/women-tournament/registrations",
      status: 200,
      responseTime: 112,
      timestamp: new Date(Date.now() - 1000 * 60 * 22),
      requestBody: null,
      responseBody: { success: true, count: 23, data: "..." },
      userAgent:
        "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15",
    },
    {
      id: 11,
      method: "POST",
      endpoint: "/api/media-team/upload",
      status: 200,
      responseTime: 2340,
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      requestBody: { imageData: "base64..." },
      responseBody: { success: true, url: "https://cloudinary.com/..." },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: 12,
      method: "GET",
      endpoint: "/api/events/upcoming",
      status: 200,
      responseTime: 67,
      timestamp: new Date(Date.now() - 1000 * 60 * 28),
      requestBody: null,
      responseBody: { success: true, events: "..." },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 13,
      method: "DELETE",
      endpoint: "/api/registrations/sports/REG999",
      status: 200,
      responseTime: 234,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      requestBody: null,
      responseBody: { success: true, deleted: true },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 14,
      method: "GET",
      endpoint: "/api/registrations",
      status: 500,
      responseTime: 1203,
      timestamp: new Date(Date.now() - 1000 * 60 * 32),
      requestBody: null,
      responseBody: { success: false, error: "Database connection failed" },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: 15,
      method: "POST",
      endpoint: "/api/auth/refresh",
      status: 401,
      responseTime: 34,
      timestamp: new Date(Date.now() - 1000 * 60 * 35),
      requestBody: { refreshToken: "invalid_token" },
      responseBody: { success: false, error: "Invalid refresh token" },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15",
    },
    {
      id: 16,
      method: "GET",
      endpoint: "/api/team/members",
      status: 200,
      responseTime: 89,
      timestamp: new Date(Date.now() - 1000 * 60 * 38),
      requestBody: null,
      responseBody: { success: true, members: "..." },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 17,
      method: "POST",
      endpoint: "/api/marathon/register",
      status: 201,
      responseTime: 456,
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
      requestBody: { name: "Jane Smith", category: "5K" },
      responseBody: { success: true, registrationId: "MAR789" },
      userAgent: "Mozilla/5.0 (Android; Mobile) AppleWebKit/537.36",
    },
    {
      id: 18,
      method: "GET",
      endpoint: "/api/sports/available",
      status: 200,
      responseTime: 45,
      timestamp: new Date(Date.now() - 1000 * 60 * 42),
      requestBody: null,
      responseBody: {
        success: true,
        sports: ["Football", "Cricket", "Basketball"],
      },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: 19,
      method: "GET",
      endpoint: "/api/nonexistent/endpoint",
      status: 404,
      responseTime: 23,
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      requestBody: null,
      responseBody: { success: false, message: "Endpoint not found" },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 20,
      method: "PUT",
      endpoint: "/api/admin/marathon/update/123",
      status: 200,
      responseTime: 178,
      timestamp: new Date(Date.now() - 1000 * 60 * 48),
      requestBody: { status: "approved" },
      responseBody: { success: true, updated: true },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 21,
      method: "GET",
      endpoint: "/api/admin/gallery",
      status: 200,
      responseTime: 289,
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      requestBody: null,
      responseBody: { success: true, images: "..." },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: 22,
      method: "POST",
      endpoint: "/api/contact/submit",
      status: 429,
      responseTime: 12,
      timestamp: new Date(Date.now() - 1000 * 60 * 52),
      requestBody: { email: "spam@test.com", message: "..." },
      responseBody: { success: false, error: "Too many requests" },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: 23,
      method: "GET",
      endpoint: "/api/health",
      status: 200,
      responseTime: 8,
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
      requestBody: null,
      responseBody: { status: "healthy", uptime: 345678 },
      userAgent: "StatusCake/1.0",
    },
    {
      id: 24,
      method: "POST",
      endpoint: "/api/payments/verify",
      status: 200,
      responseTime: 1567,
      timestamp: new Date(Date.now() - 1000 * 60 * 58),
      requestBody: { transactionId: "TXN123456" },
      responseBody: { success: true, verified: true },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15",
    },
    {
      id: 25,
      method: "GET",
      endpoint: "/api/registrations/export",
      status: 503,
      responseTime: 5002,
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      requestBody: null,
      responseBody: {
        success: false,
        error: "Service temporarily unavailable",
      },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchLogs();
      }, 5000); // Refresh every 5 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchLogs = () => {
    setLoading(true);
    // Simulate API call - In production, replace with actual API call
    setTimeout(() => {
      setLogs(mockLogs);
      calculateStats(mockLogs);
      setLoading(false);
    }, 500);
  };

  const calculateStats = (logData) => {
    const total = logData.length;
    const success = logData.filter(
      (log) => log.status >= 200 && log.status < 300,
    ).length;
    const error = logData.filter((log) => log.status >= 400).length;
    const avgResponseTime = Math.round(
      logData.reduce((sum, log) => sum + log.responseTime, 0) / total,
    );

    setStats({ total, success, error, avgResponseTime });
  };

  const getFilteredLogs = () => {
    let filtered = logs;

    if (filter === "success") {
      filtered = filtered.filter(
        (log) => log.status >= 200 && log.status < 300,
      );
    } else if (filter === "error") {
      filtered = filtered.filter((log) => log.status >= 400);
    }

    if (searchTerm) {
      filtered = filtered.filter((log) =>
        log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  };

  const getStatusBg = (status) => {
    if (status >= 200 && status < 300)
      return "bg-green-500/20 border-green-500/50";
    if (status >= 400 && status < 500)
      return "bg-yellow-500/20 border-yellow-500/50";
    if (status >= 500) return "bg-red-500/20 border-red-500/50";
    return "bg-gray-500/20 border-gray-500/50";
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "GET":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "POST":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "PUT":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "DELETE":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(getFilteredLogs(), null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `api-logs-${new Date().toISOString()}.json`;
    link.click();
    toast.success("Logs exported successfully!");
  };

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear all logs?")) {
      setLogs([]);
      setStats({ total: 0, success: 0, error: 0, avgResponseTime: 0 });
      toast.success("Logs cleared!");
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
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
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FiActivity className="text-purple-400" />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                API Monitor
              </span>
            </h1>
            <p className="text-gray-400">
              Real-time monitoring of API requests and responses
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                autoRefresh
                  ? "bg-green-500/20 border-green-500/50 text-green-400"
                  : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-gray-600"
              }`}
            >
              <FiRefreshCw className={autoRefresh ? "animate-spin" : ""} />
              {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
            </button>
            <button
              onClick={fetchLogs}
              className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2"
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Requests</span>
              <FiActivity className="text-purple-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-green-500/30 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Successful</span>
              <FiCheckCircle className="text-green-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-green-400">{stats.success}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.total > 0
                ? Math.round((stats.success / stats.total) * 100)
                : 0}
              % success rate
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-red-500/30 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Errors</span>
              <FiXCircle className="text-red-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-red-400">{stats.error}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.total > 0
                ? Math.round((stats.error / stats.total) * 100)
                : 0}
              % error rate
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Avg Response</span>
              <FiClock className="text-blue-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {stats.avgResponseTime}ms
            </p>
          </motion.div>
        </div>

        {/* Filters and Actions Bar */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <FiFilter className="text-gray-400" />
              <span className="text-gray-400 text-sm">Filter:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    filter === "all"
                      ? "bg-purple-500/30 text-purple-400 border border-purple-500/50"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"
                  }`}
                >
                  All ({logs.length})
                </button>
                <button
                  onClick={() => setFilter("success")}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    filter === "success"
                      ? "bg-green-500/30 text-green-400 border border-green-500/50"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"
                  }`}
                >
                  Success ({stats.success})
                </button>
                <button
                  onClick={() => setFilter("error")}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    filter === "error"
                      ? "bg-red-500/30 text-red-400 border border-red-500/50"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"
                  }`}
                >
                  Errors ({stats.error})
                </button>
              </div>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-purple-500 focus:border-purple-500 transition-all w-64"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportLogs}
              className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all flex items-center gap-2 text-sm"
            >
              <FiDownload />
              Export
            </button>
            <button
              onClick={handleClearLogs}
              className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2 text-sm"
            >
              <FiTrash2 />
              Clear
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : getFilteredLogs().length === 0 ? (
            <div className="text-center p-12">
              <FiActivity className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No API logs found</p>
              <p className="text-gray-600 text-sm mt-2">
                Logs will appear here as requests are made
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gray-700/50">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-semibold text-sm">
                      Method
                    </th>
                    <th className="text-left p-4 text-gray-400 font-semibold text-sm">
                      Endpoint
                    </th>
                    <th className="text-left p-4 text-gray-400 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left p-4 text-gray-400 font-semibold text-sm">
                      Response Time
                    </th>
                    <th className="text-left p-4 text-gray-400 font-semibold text-sm">
                      Timestamp
                    </th>
                    <th className="text-left p-4 text-gray-400 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredLogs().map((log, index) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold border ${getMethodColor(log.method)}`}
                        >
                          {log.method}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300 font-mono text-sm">
                          {log.endpoint}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusBg(log.status)}`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-sm ${log.responseTime > 1000 ? "text-red-400" : log.responseTime > 500 ? "text-yellow-400" : "text-green-400"}`}
                        >
                          {log.responseTime}ms
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-400 text-sm">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-purple-400 hover:text-purple-300 text-sm underline"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl"
        >
          <p className="text-blue-400 text-sm">
            <strong>Note:</strong> This is a demonstration of API monitoring
            capabilities. In production, this would connect to a real logging
            service to track actual API requests.
          </p>
        </motion.div>
      </motion.div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLog(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Request Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">
                  Method & Endpoint
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold border ${getMethodColor(selectedLog.method)}`}
                  >
                    {selectedLog.method}
                  </span>
                  <span className="text-white font-mono">
                    {selectedLog.endpoint}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Status Code</label>
                  <div
                    className={`mt-1 px-3 py-2 rounded border ${getStatusBg(selectedLog.status)} inline-block`}
                  >
                    {selectedLog.status}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Response Time</label>
                  <p className="text-white mt-1">
                    {selectedLog.responseTime}ms
                  </p>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Timestamp</label>
                <p className="text-white mt-1">
                  {selectedLog.timestamp.toLocaleString()}
                </p>
              </div>

              {selectedLog.requestBody && (
                <div>
                  <label className="text-gray-400 text-sm">Request Body</label>
                  <pre className="mt-1 bg-gray-900/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                    {JSON.stringify(selectedLog.requestBody, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <label className="text-gray-400 text-sm">Response Body</label>
                <pre className="mt-1 bg-gray-900/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                  {JSON.stringify(selectedLog.responseBody, null, 2)}
                </pre>
              </div>

              <div>
                <label className="text-gray-400 text-sm">User Agent</label>
                <p className="text-gray-400 text-xs mt-1 break-all">
                  {selectedLog.userAgent}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DevApiMonitor;
