import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../config/api";

const SPORTS_LIST = [
  "All Sports",
  "Cricket",
  "Football",
  "Basketball",
  "Volleyball",
  "Badminton",
  "Table Tennis",
  "Chess",
  "Carrom",
  "Athletics",
  "Swimming",
  "Kabaddi",
  "Kho-Kho",
  "Hockey",
  "Lawn Tennis",
  "Squash",
  "Handball",
  "Rink Football",
  "Tug of War",
  "Power Lifting",
];

const isSoloRegistration = (eventName, formData) => {
  const genderCategory =
    formData?.gender_category ||
    formData?.get?.("gender_category") ||
    formData?.sportDetails?.selectedGender;

  const alwaysSoloSports = ["Power Lifting"];
  if (alwaysSoloSports.includes(eventName)) return true;

  if (eventName === "Chess" && genderCategory === "individual") return true;
  if (eventName === "Athletics" && genderCategory === "individual") return true;

  return false;
};

const getCategoryBadgeInfo = (eventName, formData) => {
  const genderCategory =
    formData?.gender_category ||
    formData?.get?.("gender_category") ||
    formData?.sportDetails?.selectedGender;

  if (eventName === "Power Lifting") {
    return {
      label: "🎯 Solo",
      shortLabel: "🎯 Solo",
      className: "bg-cyan-500/20 text-cyan-300 border-cyan-500/20",
    };
  }

  if (!genderCategory) return null;

  if (eventName === "Chess" || eventName === "Athletics") {
    if (genderCategory === "team") {
      return {
        label: eventName === "Athletics" ? "👥 Relay Team" : "👥 Team",
        shortLabel: eventName === "Athletics" ? "👥 Relay" : "👥 Team",
        className: "bg-purple-500/20 text-purple-300 border-purple-500/20",
      };
    } else if (genderCategory === "individual") {
      return {
        label: "🎯 Solo",
        shortLabel: "🎯 Solo",
        className: "bg-cyan-500/20 text-cyan-300 border-cyan-500/20",
      };
    }
  }

  if (genderCategory === "men") {
    return {
      label: "👨 Men's Registration",
      shortLabel: "👨 Men's",
      className: "bg-blue-500/20 text-blue-300",
    };
  } else if (genderCategory === "women") {
    return {
      label: "👩 Women's Registration",
      shortLabel: "👩 Women's",
      className: "bg-pink-500/20 text-pink-300",
    };
  }

  return null;
};

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const [coordinator, setCoordinator] = useState(null);
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    sport: "",
    status: "",
    search: "",
    needAccommodation: "",
    page: 1,
    limit: 50,
  });
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Calculate statistics from registrations - matches admin dashboard logic
  const calculateStats = (data) => {
    const sportCounts = {};
    let totalTeams = 0;
    let totalPlayers = 0;
    let needAccommodation = 0;
    let pendingStatus = 0;
    let confirmed = 0;
    let cancelled = 0;

    data.forEach((reg) => {
      // Count status for all registrations
      if (reg.status === "pending") pendingStatus++;
      if (reg.status === "confirmed") confirmed++;
      if (reg.status === "cancelled") {
        cancelled++;
        return; // Skip cancelled registrations from other counts
      }

      // Only count active registrations (confirmed/pending) for the following:

      // Sport counts (exclude cancelled)
      const sport = reg.eventName;
      sportCounts[sport] = (sportCounts[sport] || 0) + 1;

      // Total teams (exclude cancelled)
      totalTeams++;

      // Total players (exclude cancelled)
      const numPlayers = parseInt(
        reg.formData?.num_players || reg.formData?.get?.("num_players") || 0,
      );
      totalPlayers += numPlayers;

      // Accommodation (exclude cancelled)
      const needAccom =
        reg.accommodation?.needed ||
        reg.formData?.needs_accommodation ||
        reg.formData?.need_accommodation ||
        reg.formData?.get?.("need_accommodation");
      if (needAccom) needAccommodation++;
    });

    setStats({
      sportCounts,
      totalTeams,
      totalPlayers,
      needAccommodation,
      pendingStatus,
      confirmed,
      cancelled,
    });
  };

  // Fetch ALL registrations for statistics
  const fetchAllRegistrationsForStats = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("limit", "9999"); // Get all registrations

      const response = await api.get(`/registrations?${queryParams}`);

      if (response.data.success) {
        let allRegistrations = response.data.data || [];

        // Filter by sports only (exclude Marathon, Women's Tournament, etc.)
        allRegistrations = allRegistrations.filter((reg) =>
          SPORTS_LIST.includes(reg.eventName),
        );

        // Calculate stats from ALL registrations
        calculateStats(allRegistrations);
      }
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("coordinatorToken");
        localStorage.removeItem("coordinatorData");
        navigate("/coordinator/login");
      }
    }
  }, [navigate]);

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      // Filter by sport using eventName field
      if (filters.sport && filters.sport !== "All Sports") {
        queryParams.append("eventName", filters.sport);
      }

      if (filters.status) queryParams.append("status", filters.status);
      if (filters.search) queryParams.append("search", filters.search);
      queryParams.append("page", filters.page);
      queryParams.append("limit", filters.limit);

      const response = await api.get(`/registrations?${queryParams}`);

      if (response.data.success) {
        let allRegistrations = response.data.data || [];

        // Filter by sports only (exclude Marathon, Women's Tournament, etc.)
        allRegistrations = allRegistrations.filter((reg) =>
          SPORTS_LIST.includes(reg.eventName),
        );

        // Additional filter for accommodation if set
        if (filters.needAccommodation) {
          allRegistrations = allRegistrations.filter((reg) => {
            const needAccom =
              reg.accommodation?.needed ||
              reg.formData?.needs_accommodation ||
              reg.formData?.need_accommodation ||
              reg.formData?.get?.("need_accommodation");
            return filters.needAccommodation === "yes"
              ? needAccom === true
              : needAccom === false;
          });
        }

        setRegistrations(allRegistrations);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("coordinatorToken");
        localStorage.removeItem("coordinatorData");
        navigate("/coordinator/login");
      } else {
        toast.error("Failed to fetch registrations");
      }
      console.error(error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [filters, navigate]);

  useEffect(() => {
    const coordinatorData = localStorage.getItem("coordinatorData");
    if (!coordinatorData) {
      navigate("/coordinator/login");
      return;
    }

    setCoordinator(JSON.parse(coordinatorData));
  }, [navigate]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Fetch all registrations for statistics on initial load
  useEffect(() => {
    fetchAllRegistrationsForStats();
  }, [fetchAllRegistrationsForStats]);

  const handleLogout = () => {
    localStorage.removeItem("coordinatorToken");
    localStorage.removeItem("coordinatorData");
    navigate("/coordinator/login");
  };

  // Unified filter handler that resets page when any filter changes
  const handleFilterChange = (newFilters) => {
    const isOnlyPageChange =
      Object.keys(newFilters).length === 1 && "page" in newFilters;

    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: isOnlyPageChange ? newFilters.page : 1,
    }));
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setFilters({
      sport: "",
      status: "",
      search: "",
      needAccommodation: "",
      page: 1,
      limit: 50,
    });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.sport ||
      filters.status ||
      filters.search ||
      filters.needAccommodation
    );
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const sportFilter =
      filters.sport && filters.sport !== "All Sports"
        ? filters.sport
        : "All Sports";

    doc.setFontSize(18);
    doc.text(`Sports Registrations - ${sportFilter}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Coordinator: ${coordinator?.username}`, 14, 34);

    const tableData = registrations
      .filter((reg) => reg.status !== "cancelled")
      .map((reg, index) => {
        const formData = reg.formData || {};
        const isSolo = isSoloRegistration(reg.eventName, formData);
        return [
          index + 1,
          reg.registrationNumber || "N/A",
          reg.eventName || "N/A",
          isSolo
            ? "-"
            : formData.team_name || formData.get?.("team_name") || "N/A",
          isSolo
            ? "-"
            : formData.captain_name || formData.get?.("captain_name") || "N/A",
          formData.captain_contact ||
            formData.get?.("captain_contact") ||
            "N/A",
          reg.institution || "N/A",
          isSolo
            ? "1"
            : formData.num_players || formData.get?.("num_players") || "N/A",
          reg.status || "N/A",
        ];
      });

    autoTable(doc, {
      startY: 40,
      head: [
        [
          "#",
          "Reg No.",
          "Sport",
          "Team Name",
          "Captain",
          "Contact",
          "Institution",
          "Players",
          "Status",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] },
    });

    doc.save(
      `sports-registrations-${sportFilter.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.pdf`,
    );
    toast.success("PDF exported successfully");
  };

  const exportToCSV = () => {
    const sportFilter =
      filters.sport && filters.sport !== "All Sports"
        ? filters.sport
        : "All Sports";

    const csvData = registrations
      .filter((reg) => reg.status !== "cancelled")
      .map((reg, index) => {
        const formData = reg.formData || {};
        const isSolo = isSoloRegistration(reg.eventName, formData);
        return {
          "#": index + 1,
          "Registration Number": reg.registrationNumber || "N/A",
          Sport: reg.eventName || "N/A",
          "Team Name": isSolo
            ? "-"
            : formData.team_name || formData.get?.("team_name") || "N/A",
          "Captain Name": isSolo
            ? "-"
            : formData.captain_name || formData.get?.("captain_name") || "N/A",
          Contact:
            formData.captain_contact ||
            formData.get?.("captain_contact") ||
            "N/A",
          Email: reg.email || "N/A",
          Institution: reg.institution || "N/A",
          City: reg.city || "N/A",
          "Number of Players": isSolo
            ? "1"
            : formData.num_players || formData.get?.("num_players") || "N/A",
          "Need Accommodation":
            formData.need_accommodation || formData.get?.("need_accommodation")
              ? "Yes"
              : "No",
          Status: reg.status || "N/A",
          "Registered On": new Date(reg.createdAt).toLocaleDateString(),
        };
      });

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sports-registrations-${sportFilter.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.csv`;
    a.click();
    toast.success("CSV exported successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a18] to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                ZENITH 2026
              </h1>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300 font-rajdhani">
                Game Coordinator
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Coordinator</p>
                <p className="text-white font-semibold">
                  {coordinator?.username}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all font-rajdhani"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sports Registrations
          </h1>
          <p className="text-gray-400">
            Monitor all sports event registrations for Zenith 2026
          </p>
        </div>

        {initialLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">
                      Total Teams
                    </span>
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {stats.totalTeams}
                  </p>
                  <p className="text-xs text-gray-500">Registered teams</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">
                      Total Players
                    </span>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {stats.totalPlayers}
                  </p>
                  <p className="text-xs text-gray-500">All participants</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl p-6 border border-gray-800 hover:border-green-500/50 transition-all duration-300 shadow-lg hover:shadow-green-500/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">
                      Need Accommodation
                    </span>
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🏨</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {stats.needAccommodation}
                  </p>
                  <p className="text-xs text-gray-500">
                    Accommodation required
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl p-6 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">
                      Pending Review
                    </span>
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⏳</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {stats.pendingStatus}
                  </p>
                  <p className="text-xs text-gray-500">Awaiting verification</p>
                </motion.div>
              </div>
            )}

            {/* Sport-wise Stats */}
            {stats &&
              stats.sportCounts &&
              Object.keys(stats.sportCounts).length > 0 && (
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl p-6 border border-gray-800 mb-8 shadow-lg">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                    Sport-wise Registrations
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(stats.sportCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([sport, count]) => (
                        <div
                          key={sport}
                          className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 text-center hover:border-purple-500/50 hover:bg-[#151515] transition-all duration-300 cursor-pointer group"
                          onClick={() => handleFilterChange({ sport })}
                        >
                          <p className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform">
                            {count}
                          </p>
                          <p className="text-sm text-gray-400 mt-2 group-hover:text-gray-300">
                            {sport}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* Filters */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl p-6 border border-gray-800 mb-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                  Filters
                </h2>
                {hasActiveFilters() && (
                  <button
                    onClick={handleClearAllFilters}
                    className="text-sm text-pink-400 hover:text-pink-300 transition-colors px-4 py-2 bg-pink-500/10 rounded-lg hover:bg-pink-500/20"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={filters.sport}
                  onChange={(e) =>
                    handleFilterChange({ sport: e.target.value })
                  }
                  className="bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white"
                >
                  {SPORTS_LIST.map((sport) => (
                    <option key={sport} value={sport} className="bg-[#1a1a1a]">
                      {sport}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) =>
                    handleFilterChange({ status: e.target.value })
                  }
                  className="bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white"
                >
                  <option value="" className="bg-[#1a1a1a]">
                    All Status
                  </option>
                  <option value="confirmed" className="bg-[#1a1a1a]">
                    Confirmed
                  </option>
                  <option value="pending" className="bg-[#1a1a1a]">
                    Pending
                  </option>
                  <option value="cancelled" className="bg-[#1a1a1a]">
                    Cancelled
                  </option>
                </select>

                <select
                  value={filters.needAccommodation}
                  onChange={(e) =>
                    handleFilterChange({ needAccommodation: e.target.value })
                  }
                  className="bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white"
                >
                  <option value="" className="bg-[#1a1a1a]">
                    All Accommodation
                  </option>
                  <option value="yes" className="bg-[#1a1a1a]">
                    Need Accommodation
                  </option>
                  <option value="no" className="bg-[#1a1a1a]">
                    No Accommodation
                  </option>
                </select>

                <input
                  type="text"
                  placeholder="Search team, captain, email..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange({ search: e.target.value })
                  }
                  className="bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={exportToPDF}
                disabled={registrations.length === 0}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
              >
                <span>📄</span>
                Export to PDF
              </button>
              <button
                onClick={exportToCSV}
                disabled={registrations.length === 0}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
              >
                <span>📊</span>
                Export to CSV
              </button>
            </div>

            {/* Registrations Table */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📭</span>
                  </div>
                  <p className="text-gray-400 text-lg mb-2">
                    No registrations found
                  </p>
                  {hasActiveFilters() && (
                    <button
                      onClick={handleClearAllFilters}
                      className="mt-4 text-purple-400 hover:text-purple-300 transition-colors px-6 py-2 bg-purple-500/10 rounded-xl hover:bg-purple-500/20"
                    >
                      Clear filters to see all registrations
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0a0a0a]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Reg. No.
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Sport
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Team Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Captain
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Institution
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Players
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {registrations
                        .filter((reg) => reg.status !== "cancelled")
                        .map((reg, index) => {
                          const formData = reg.formData || {};
                          return (
                            <motion.tr
                              key={reg._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-[#0a0a0a] transition-colors"
                            >
                              <td className="px-6 py-4 text-sm text-gray-400">
                                {(filters.page - 1) * filters.limit + index + 1}
                              </td>
                              <td className="px-6 py-4 text-sm text-white font-mono">
                                {reg.registrationNumber || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <div className="flex flex-col gap-1">
                                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg font-medium">
                                    {reg.eventName}
                                  </span>
                                  {(() => {
                                    const badgeInfo = getCategoryBadgeInfo(
                                      reg.eventName,
                                      formData,
                                    );
                                    if (!badgeInfo) return null;
                                    return (
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-md font-semibold w-fit ${badgeInfo.className}`}
                                      >
                                        {badgeInfo.shortLabel}
                                      </span>
                                    );
                                  })()}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-white font-medium">
                                {isSoloRegistration(reg.eventName, formData) ? (
                                  <span className="text-gray-500">-</span>
                                ) : (
                                  formData.team_name ||
                                  formData.get?.("team_name") ||
                                  "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">
                                {isSoloRegistration(reg.eventName, formData) ? (
                                  <span className="text-gray-500">-</span>
                                ) : (
                                  formData.captain_name ||
                                  formData.get?.("captain_name") ||
                                  "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">
                                {formData.captain_contact ||
                                  formData.get?.("captain_contact") ||
                                  "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300 max-w-[200px] truncate">
                                {reg.institution || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">
                                {(() => {
                                  if (
                                    isSoloRegistration(reg.eventName, formData)
                                  ) {
                                    return (
                                      <span className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded-lg font-medium">
                                        1
                                      </span>
                                    );
                                  }
                                  return (
                                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg font-medium">
                                      {formData.num_players ||
                                        formData.get?.("num_players") ||
                                        "N/A"}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                                    reg.status === "confirmed"
                                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                      : reg.status === "pending"
                                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                  }`}
                                >
                                  {reg.status || "N/A"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <button
                                  onClick={() => handleViewDetails(reg)}
                                  className="text-purple-400 hover:text-purple-300 transition-colors font-semibold hover:underline"
                                >
                                  View Details
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => handleFilterChange({ page: filters.page - 1 })}
                  disabled={filters.page === 1}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border border-gray-800 text-white px-6 py-3 rounded-xl hover:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  ← Previous
                </button>
                <span className="text-gray-300 px-4 py-3 bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-xl border border-gray-800">
                  Page{" "}
                  <span className="text-white font-bold">{filters.page}</span>{" "}
                  of{" "}
                  <span className="text-white font-bold">
                    {pagination.totalPages}
                  </span>
                </span>
                <button
                  onClick={() => handleFilterChange({ page: filters.page + 1 })}
                  disabled={filters.page === pagination.totalPages}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border border-gray-800 text-white px-6 py-3 rounded-xl hover:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-800 sticky top-0 bg-[#1a1a1a]/95 backdrop-blur-sm z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">
                    Registration Details
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
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
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Registration Number
                    </p>
                    <p className="text-white font-semibold">
                      {selectedRegistration.registrationNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Sport</p>
                    <p className="text-white font-semibold">
                      {selectedRegistration.eventName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                        selectedRegistration.status === "confirmed"
                          ? "bg-green-500/10 text-green-400"
                          : selectedRegistration.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {selectedRegistration.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Registered On</p>
                    <p className="text-white font-semibold">
                      {new Date(
                        selectedRegistration.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Team Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!isSoloRegistration(
                      selectedRegistration.eventName,
                      selectedRegistration.formData,
                    ) && (
                      <>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            Team Name
                          </p>
                          <p className="text-white">
                            {selectedRegistration.formData?.team_name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            Captain Name
                          </p>
                          <p className="text-white">
                            {selectedRegistration.formData?.captain_name ||
                              "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Contact</p>
                      <p className="text-white">
                        {selectedRegistration.formData?.captain_contact ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Email</p>
                      <p className="text-white">
                        {selectedRegistration.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Institution</p>
                      <p className="text-white">
                        {selectedRegistration.institution || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">City</p>
                      <p className="text-white">
                        {selectedRegistration.city || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">
                        Number of Players
                      </p>
                      <p className="text-white">
                        {isSoloRegistration(
                          selectedRegistration.eventName,
                          selectedRegistration.formData,
                        )
                          ? "1 (Solo)"
                          : selectedRegistration.formData?.num_players || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">
                        Accommodation
                      </p>
                      <p className="text-white">
                        {selectedRegistration.formData?.need_accommodation
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoordinatorDashboard;
