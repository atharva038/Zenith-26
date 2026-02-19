import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../config/api";
import AdminLayout from "../../components/AdminLayout";
import useScrollLock from "../../hooks/useScrollLock";

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

// Sport fees data - matches registration form
const SPORTS_FEES = {
  Cricket: { amount: 6500, note: "per team" },
  "Box Cricket": { amount: 3000, note: "per team" },
  Football: { amount: 3000, note: "per team" },
  Basketball: { men: 2500, women: 1500, note: "per team" },
  Volleyball: { men: 2200, women: 1500, note: "per team" },
  Badminton: { boys: 1000, girls: 800, mixed: 600, note: "per team" },
  "Table Tennis": { amount: 400, note: "per player" },
  Chess: {
    team: 500,
    individual: 200,
    note: "Team: ₹500 per team | Solo: ₹200 per player (mixed)",
  },
  Carrom: { amount: 300, note: "per player" },
  Athletics: {
    individual: 200,
    team: 700,
    note: "Individual: ₹200 (100m, Long Jump) | Team: ₹700 (Relay, Mixed Relay)",
  },
  Swimming: { amount: 300, note: "per athlete" },
  Kabaddi: { men: 2200, women: 1500, note: "per team" },
  "Kho-Kho": { amount: 1500, note: "per team" },
  Hockey: { amount: 2500, note: "per team" },
  "Lawn Tennis": { amount: 500, note: "per player" },
  Squash: { amount: 400, note: "per player" },
  Handball: { boys: 1500, girls: 1500, note: "per team" },
  "Rink Football": { men: 2200, women: 1500, note: "per team" },
  "Tug of War": { men: 1000, women: 1000, note: "per team" },
  "Power Lifting": { amount: 300, note: "per player" },
};

// Helper function to get expected fee for a sport
const getExpectedFee = (sportName) => {
  const feeInfo = SPORTS_FEES[sportName];
  if (!feeInfo) return "N/A";

  if (feeInfo.amount) {
    return `₹${feeInfo.amount} (${feeInfo.note})`;
  } else if (feeInfo.boys && feeInfo.girls && feeInfo.mixed) {
    // Badminton with three categories
    return `Boys: ₹${feeInfo.boys} | Girls: ₹${feeInfo.girls} | Mixed: ₹${feeInfo.mixed} (${feeInfo.note})`;
  } else if (feeInfo.men && feeInfo.women) {
    return `Men: ₹${feeInfo.men} | Women: ₹${feeInfo.women} (${feeInfo.note})`;
  } else if (feeInfo.individual && feeInfo.team) {
    return `${feeInfo.note}`;
  } else if (feeInfo.team && !feeInfo.individual) {
    return `₹${feeInfo.team} (${feeInfo.note})`;
  }
  return "N/A";
};

// Helper function to check if a registration is solo (no captain/team required)
const isSoloRegistration = (eventName, formData) => {
  const genderCategory =
    formData?.gender_category ||
    formData?.get?.("gender_category") ||
    formData?.sportDetails?.selectedGender;

  // Solo sports: Power Lifting (always solo)
  const alwaysSoloSports = ["Power Lifting"];
  if (alwaysSoloSports.includes(eventName)) return true;

  // Chess with individual selection is solo
  if (eventName === "Chess" && genderCategory === "individual") return true;

  // Athletics with individual selection is solo (otherwise it's 4x100m relay team)
  if (eventName === "Athletics" && genderCategory === "individual") return true;

  // Badminton is always a team sport (team of players, not individual)
  // But if you want Badminton to be solo, uncomment this:
  // if (eventName === 'Badminton') return true;

  return false;
};

// Helper function to get category badge info for a registration
// Handles Chess Team/Solo separately from Men's/Women's sports
const getCategoryBadgeInfo = (eventName, formData) => {
  const genderCategory =
    formData?.gender_category ||
    formData?.get?.("gender_category") ||
    formData?.sportDetails?.selectedGender;

  // Power Lifting is always individual - show Solo badge
  if (eventName === "Power Lifting") {
    return {
      label: "🎯 Solo",
      shortLabel: "🎯 Solo",
      className: "bg-cyan-500/20 text-cyan-300 border-cyan-500/20",
      detailClassName: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      isTeam: false,
    };
  }

  if (!genderCategory) return null;

  // Badminton has three team categories
  if (eventName === "Badminton") {
    if (genderCategory === "boys") {
      return {
        label: "👨 Boys Team (5 Players)",
        shortLabel: "👨 Boys",
        className: "bg-blue-500/20 text-blue-300 border-blue-500/20",
        detailClassName:
          "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        isTeam: true,
      };
    } else if (genderCategory === "girls") {
      return {
        label: "👩 Girls Team (5 Players)",
        shortLabel: "👩 Girls",
        className: "bg-pink-500/20 text-pink-300 border-pink-500/20",
        detailClassName:
          "bg-pink-500/10 text-pink-400 border border-pink-500/20",
        isTeam: true,
      };
    } else if (genderCategory === "mixed") {
      return {
        label: "👥 Mixed Team (2 Players)",
        shortLabel: "👥 Mixed",
        className: "bg-purple-500/20 text-purple-300 border-purple-500/20",
        detailClassName:
          "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        isTeam: true,
      };
    }
  }

  // Chess and Athletics are dual-mode sports - show Team/Solo instead of Men/Women
  if (eventName === "Chess" || eventName === "Athletics") {
    if (genderCategory === "team") {
      return {
        label: eventName === "Athletics" ? "👥 Relay Team" : "👥 Team",
        shortLabel: eventName === "Athletics" ? "👥 Relay" : "👥 Team",
        className: "bg-purple-500/20 text-purple-300 border-purple-500/20",
        detailClassName:
          "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        isTeam: true,
      };
    } else if (genderCategory === "individual") {
      return {
        label: "🎯 Solo",
        shortLabel: "🎯 Solo",
        className: "bg-cyan-500/20 text-cyan-300 border-cyan-500/20",
        detailClassName:
          "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
        isTeam: false,
      };
    }
  }

  // For all other sports with gender categories
  if (genderCategory === "men") {
    return {
      label: "👨 Men's Registration",
      shortLabel: "👨 Men's",
      className: "bg-blue-500/20 text-blue-300",
      detailClassName: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      isTeam: true, // Men's sports are typically team sports
    };
  } else if (genderCategory === "women") {
    return {
      label: "👩 Women's Registration",
      shortLabel: "👩 Women's",
      className: "bg-pink-500/20 text-pink-300",
      detailClassName: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
      isTeam: true, // Women's sports are typically team sports
    };
  }

  return null;
};

// Helper function to check if URL is a PDF
const isPdfUrl = (url) => {
  if (!url) return false;
  return (
    url.includes(".pdf") ||
    url.includes("application/pdf") ||
    url.includes("/raw/")
  ); // Cloudinary raw uploads are typically PDFs
};

const AdminSportsRegistrations = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  useScrollLock(showDetailsModal, "sports-details-modal");
  useScrollLock(showScreenshotModal, "sports-screenshot-modal");

  const [filters, setFilters] = useState({
    sport: "",
    status: "",
    search: "",
    needAccommodation: "",
    page: 1,
    limit: 50,
  });
  const [pagination, setPagination] = useState({});

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

  // Fetch ALL registrations for statistics (without pagination)
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
    }
  }, []);

  // Fetch registrations for current page
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
      toast.error("Failed to fetch registrations");
      console.error(error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Fetch all registrations for statistics on initial load
  useEffect(() => {
    fetchAllRegistrationsForStats();
  }, [fetchAllRegistrationsForStats]);

  // Calculate statistics
  const calculateStats = (data) => {
    const sportCounts = {};
    let totalTeams = 0;
    let totalPlayers = 0;
    let needAccommodation = 0;
    let pendingStatus = 0;
    let confirmed = 0;
    let cancelled = 0;
    let totalRegistrationFee = 0;
    let totalAccommodationFee = 0;

    data.forEach((reg) => {
      // Count status for all registrations
      if (reg.status === "pending") pendingStatus++;
      if (reg.status === "confirmed") {
        confirmed++;
        // Calculate fee only for confirmed registrations
        totalRegistrationFee += reg.amount || 0;
        totalAccommodationFee += reg.accommodation?.totalFee || 0;
      }
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
      totalRegistrationFee,
      totalAccommodationFee,
      totalFeeCollected: totalRegistrationFee + totalAccommodationFee,
    });
  };

  // View registration details
  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  // View screenshot
  const handleViewScreenshot = (
    screenshotUrl,
    type = "Transaction Receipt",
  ) => {
    setSelectedScreenshot({ url: screenshotUrl, type });
    setShowScreenshotModal(true);
  };

  // Update registration status
  const handleUpdateStatus = async (registrationId, newStatus) => {
    try {
      const response = await api.patch(
        `/registrations/${registrationId}/status`,
        {
          status: newStatus,
        },
      );

      if (response.data.success) {
        toast.success(`Registration ${newStatus} successfully`);
        fetchRegistrations();
        setShowDetailsModal(false);
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const sportFilter =
      filters.sport && filters.sport !== "All Sports"
        ? filters.sport
        : "All Sports";

    // Add title
    doc.setFontSize(18);
    doc.text(`Sports Registrations - ${sportFilter}`, 14, 20);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    // Prepare table data (exclude cancelled registrations)
    const tableData = registrations
      .filter((reg) => reg.status !== "cancelled")
      .map((reg, index) => {
        const formData = reg.formData || {};
        const isSolo = isSoloRegistration(reg.eventName, formData);
        // For Athletics, include the event name (100m, Long Jump, etc.)
        const sportDisplay =
          reg.eventName === "Athletics" && formData.athleticsEvent
            ? `${reg.eventName} - ${formData.athleticsEvent}`
            : reg.eventName || "N/A";
        return [
          index + 1,
          reg.registrationNumber || "N/A",
          sportDisplay,
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

    // Add table
    autoTable(doc, {
      startY: 35,
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
      headStyles: { fillColor: [147, 51, 234] },
    });

    // Save PDF
    doc.save(
      `sports-registrations-${sportFilter.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.pdf`,
    );
    toast.success("PDF exported successfully");
  };

  // Export to CSV
  const exportToCSV = () => {
    const sportFilter =
      filters.sport && filters.sport !== "All Sports"
        ? filters.sport
        : "All Sports";

    // Exclude cancelled registrations from export
    const csvData = registrations
      .filter((reg) => reg.status !== "cancelled")
      .map((reg, index) => {
        const formData = reg.formData || {};
        const isSolo = isSoloRegistration(reg.eventName, formData);
        // For Athletics, include the event name (100m, Long Jump, etc.)
        const sportDisplay =
          reg.eventName === "Athletics" && formData.athleticsEvent
            ? `${reg.eventName} - ${formData.athleticsEvent}`
            : reg.eventName || "N/A";
        return {
          "#": index + 1,
          "Registration Number": reg.registrationNumber || "N/A",
          Sport: sportDisplay,
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
          "College Address":
            formData.college_address ||
            formData.get?.("college_address") ||
            "N/A",
          "Number of Players": isSolo
            ? "1"
            : formData.num_players || formData.get?.("num_players") || "N/A",
          "Alternate Contact":
            formData.alternate_contact ||
            formData.get?.("alternate_contact") ||
            "N/A",
          "Need Accommodation":
            formData.need_accommodation || formData.get?.("need_accommodation")
              ? "Yes"
              : "No",
          Status: reg.status || "N/A",
          Amount: reg.amount || "N/A",
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
    <AdminLayout>
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sports Registrations
          </h1>
          <p className="text-gray-400">
            Manage all sports event registrations for Zenith 2026
          </p>
        </div>

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
              <p className="text-xs text-gray-500">Accommodation required</p>
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

        {/* Fee Collection Section - Confirmed Payments Only */}
        {stats && (
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl p-6 border border-gray-800 mb-8 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></span>
              Fee Collection
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({stats.confirmed || 0} Confirmed Payments)
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#0a0a0a] rounded-xl p-5 border border-green-500/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📝</span>
                  <span className="text-gray-400 text-sm">Registration Fees</span>
                </div>
                <p className="text-3xl font-bold text-green-400">
                  ₹{(stats.totalRegistrationFee || 0).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  From {stats.confirmed || 0} confirmed registrations
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#0a0a0a] rounded-xl p-5 border border-orange-500/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-gray-400 text-sm">Total Collected</span>
                </div>
                <p className="text-3xl font-bold text-orange-400">
                  ₹{(stats.totalRegistrationFee || 0).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Excluding {stats.pendingStatus || 0} pending
                </p>
              </motion.div>
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
            {/* Sport Filter */}
            <select
              value={filters.sport}
              onChange={(e) => handleFilterChange({ sport: e.target.value })}
              className="bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white"
            >
              {SPORTS_LIST.map((sport) => (
                <option key={sport} value={sport} className="bg-[#1a1a1a]">
                  {sport}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
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

            {/* Accommodation Filter */}
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

            {/* Search */}
            <input
              type="text"
              placeholder="Search team, captain, email..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
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

        {/* Loading State */}
        {initialLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
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
                                  {/* Category Badge (Team/Solo for Chess, Men's/Women's for others) */}
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
                                {isSoloRegistration(reg.eventName, formData) ? (
                                  <span className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded-lg font-medium">
                                    1
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg font-medium">
                                    {formData.num_players ||
                                      formData.get?.("num_players") ||
                                      "N/A"}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                                    reg.status === "confirmed"
                                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                      : reg.status === "pending"
                                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                        : reg.status === "cancelled"
                                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
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

        {/* Cancelled/Rejected Registrations Section */}
        {registrations.filter((reg) => reg.status === "cancelled").length >
          0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-br from-red-900/20 to-red-800/10 backdrop-blur-sm border border-red-500/20 rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="px-6 py-4 border-b border-red-500/20">
              <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                <span className="text-2xl">❌</span>
                Cancelled Registrations (
                {
                  registrations.filter((reg) => reg.status === "cancelled")
                    .length
                }
                )
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-red-500/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-red-400 uppercase tracking-wider">
                      Reg No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-red-400 uppercase tracking-wider">
                      Sport
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-red-400 uppercase tracking-wider">
                      Team Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-red-400 uppercase tracking-wider">
                      Captain
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-red-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-red-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-red-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-500/10">
                  {registrations
                    .filter((reg) => reg.status === "cancelled")
                    .map((reg) => {
                      const formData = reg.formData || {};
                      return (
                        <tr
                          key={reg._id}
                          className="hover:bg-red-500/5 transition-colors"
                        >
                          <td className="px-6 py-3 text-sm font-mono text-red-300">
                            {reg.registrationNumber || "N/A"}
                          </td>
                          <td className="px-6 py-3 text-sm">
                            <div className="flex flex-col gap-1">
                              <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs">
                                {reg.eventName}
                              </span>
                              {/* Athletics Event Display */}
                              {reg.eventName === "Athletics" &&
                                formData.athleticsEvent && (
                                  <span className="text-xs px-2 py-0.5 rounded-md font-semibold w-fit bg-orange-500/10 text-orange-400">
                                    {formData.athleticsEvent}
                                  </span>
                                )}
                              {/* Category Badge (Team/Solo for Chess, Men's/Women's for others) */}
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
                          <td className="px-6 py-3 text-sm text-gray-300">
                            {isSoloRegistration(reg.eventName, formData) ? (
                              <span className="text-gray-500">-</span>
                            ) : (
                              formData.team_name ||
                              formData.get?.("team_name") ||
                              "N/A"
                            )}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-400">
                            {isSoloRegistration(reg.eventName, formData) ? (
                              <span className="text-gray-500">-</span>
                            ) : (
                              formData.captain_name ||
                              formData.get?.("captain_name") ||
                              "N/A"
                            )}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-400">
                            {formData.captain_contact ||
                              formData.get?.("captain_contact") ||
                              "N/A"}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-400">
                            {new Date(reg.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewDetails(reg)}
                                className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-xs font-semibold hover:bg-blue-500/30 transition-colors"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(reg._id, "pending")
                                }
                                className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs font-semibold hover:bg-yellow-500/30 transition-colors"
                              >
                                Restore
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedRegistration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setShowDetailsModal(false)}
              onWheel={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{ overflow: "hidden", touchAction: "none" }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-3xl max-w-5xl w-full max-h-[90vh] border border-gray-800 shadow-2xl flex flex-col"
                style={{ overflow: "hidden" }}
              >
                {/* Header - Fixed at Top */}
                <div className="flex justify-between items-start p-8 pb-6 flex-shrink-0 border-b border-gray-800">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Registration Details
                    </h2>
                    <p className="text-purple-400 font-mono text-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      {selectedRegistration.registrationNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-gray-400 hover:text-white"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>

                {/* Scrollable Content */}
                <div
                  className="flex-1 p-8 pt-6 custom-scrollbar"
                  style={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    maxHeight: "calc(90vh - 120px)",
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sport Information */}
                    <div className="bg-gradient-to-br from-[#151515] to-[#1f1f1f] rounded-2xl p-5 border border-gray-800">
                      <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                        Sport Information
                      </h3>
                      <div className="space-y-3">
                        <p className="text-gray-300">
                          <span className="text-white font-semibold">
                            Sport:
                          </span>{" "}
                          <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg ml-2">
                            {selectedRegistration.eventName}
                          </span>
                        </p>
                        {/* Athletics Event Display */}
                        {selectedRegistration.eventName === "Athletics" &&
                          selectedRegistration.formData?.athleticsEvent && (
                            <p className="text-gray-300">
                              <span className="text-white font-semibold">
                                Event:
                              </span>{" "}
                              <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded-lg ml-2 font-semibold">
                                {selectedRegistration.formData.athleticsEvent}
                              </span>
                            </p>
                          )}
                        {/* Category Badge (Team/Solo for Chess, Men's/Women's for others) */}
                        {(() => {
                          const badgeInfo = getCategoryBadgeInfo(
                            selectedRegistration.eventName,
                            selectedRegistration.formData,
                          );
                          if (!badgeInfo) return null;
                          return (
                            <p className="text-gray-300">
                              <span className="text-white font-semibold">
                                Category:
                              </span>{" "}
                              <span
                                className={`px-3 py-1 rounded-lg ml-2 font-semibold ${badgeInfo.detailClassName}`}
                              >
                                {badgeInfo.label}
                              </span>
                            </p>
                          );
                        })()}
                        <p className="text-gray-300">
                          <span className="text-white font-semibold">
                            Registration Date:
                          </span>{" "}
                          {new Date(
                            selectedRegistration.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Team Information - Only show for team registrations (not Chess solo) */}
                  {(() => {
                    const badgeInfo = getCategoryBadgeInfo(
                      selectedRegistration.eventName,
                      selectedRegistration.formData,
                    );
                    // Show team info if: no badge info (default team sport) OR isTeam is true
                    const showTeamInfo = !badgeInfo || badgeInfo.isTeam;
                    if (!showTeamInfo) return null;
                    return (
                      <div className="bg-gradient-to-br from-[#151515] to-[#1f1f1f] rounded-2xl p-5 border border-gray-800">
                        <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                          <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                          Team Information
                        </h3>
                        <div className="space-y-3">
                          <p className="text-gray-300">
                            <span className="text-white font-semibold">
                              Team Name:
                            </span>{" "}
                            {selectedRegistration.formData?.team_name ||
                              selectedRegistration.formData?.get?.(
                                "team_name",
                              ) ||
                              "N/A"}
                          </p>
                          <p className="text-gray-300">
                            <span className="text-white font-semibold">
                              Number of Players:
                            </span>{" "}
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg ml-2">
                              {selectedRegistration.formData?.num_players ||
                                selectedRegistration.formData?.get?.(
                                  "num_players",
                                ) ||
                                "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Captain Information */}
                  <div className="bg-gradient-to-br from-[#151515] to-[#1f1f1f] rounded-2xl p-5 border border-gray-800">
                    <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-green-500 rounded-full"></span>
                      Captain Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        <span className="text-white font-semibold">Name:</span>{" "}
                        {selectedRegistration.formData?.captain_name ||
                          selectedRegistration.formData?.get?.(
                            "captain_name",
                          ) ||
                          "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-white font-semibold">
                          Contact:
                        </span>{" "}
                        {selectedRegistration.formData?.captain_contact ||
                          selectedRegistration.formData?.get?.(
                            "captain_contact",
                          ) ||
                          "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-white font-semibold">Email:</span>{" "}
                        {selectedRegistration.email || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-white font-semibold">
                          Alternate Contact:
                        </span>{" "}
                        {selectedRegistration.formData?.alternate_contact ||
                          selectedRegistration.formData?.get?.(
                            "alternate_contact",
                          ) ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Institution Information */}
                  <div className="bg-gradient-to-br from-[#151515] to-[#1f1f1f] rounded-2xl p-5 border border-gray-800">
                    <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
                      Institution Information
                    </h3>
                    <div className="space-y-3">
                      <p className="text-gray-300">
                        <span className="text-white font-semibold">
                          Institution:
                        </span>{" "}
                        {selectedRegistration.institution || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-white font-semibold">City:</span>{" "}
                        {selectedRegistration.city || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-white font-semibold">
                          Address:
                        </span>{" "}
                        {selectedRegistration.formData?.college_address ||
                          selectedRegistration.formData?.get?.(
                            "college_address",
                          ) ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div className="bg-gradient-to-br from-[#151515] to-[#1f1f1f] rounded-2xl p-5 border border-gray-800">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-cyan-500 rounded-full"></span>
                      Accommodation
                    </h3>
                    <p className="text-gray-300">
                      {selectedRegistration.formData?.need_accommodation ||
                      selectedRegistration.formData?.get?.(
                        "need_accommodation",
                      ) ? (
                        <span className="flex items-center gap-2 px-3 py-2 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20 w-fit">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Accommodation Required
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 px-3 py-2 bg-gray-500/10 text-gray-400 rounded-xl border border-gray-500/20 w-fit">
                          <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                          No Accommodation Required
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-gradient-to-br from-[#151515] to-[#1f1f1f] rounded-2xl p-5 border border-gray-800">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-yellow-500 rounded-full"></span>
                      Payment Information
                    </h3>
                    <div className="space-y-3">
                      <p className="text-gray-300">
                        <span className="text-white font-semibold">
                          Expected Registration Fee:
                        </span>{" "}
                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg ml-2 font-bold">
                          {getExpectedFee(selectedRegistration.eventName)}
                        </span>
                      </p>
                      <div className="pt-3 mt-3 border-t border-gray-700">
                        <p className="text-sm text-orange-400 flex items-start gap-2">
                          <span className="text-lg">⚠️</span>
                          <span className="flex-1">
                            <strong>Important:</strong> Please verify the
                            payment screenshot in the documents section below to
                            confirm the actual amount received matches the
                            registration fee.
                          </span>
                        </p>
                        {/* Category Badge (Team/Solo for Chess, Men's/Women's for others) */}
                        {(() => {
                          const badgeInfo = getCategoryBadgeInfo(
                            selectedRegistration.eventName,
                            selectedRegistration.formData,
                          );
                          if (!badgeInfo) return null;
                          return (
                            <p className="text-gray-300">
                              <span className="text-white font-semibold">
                                Category:
                              </span>{" "}
                              <span
                                className={`px-3 py-1 rounded-lg ml-2 font-semibold ${badgeInfo.detailClassName}`}
                              >
                                {badgeInfo.label}
                              </span>
                            </p>
                          );
                        })()}
                        <p className="text-gray-300">
                          <span className="text-white font-semibold">
                            Registration Date:
                          </span>{" "}
                          {new Date(
                            selectedRegistration.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  {selectedRegistration.documents && (
                    <div className="mt-6 bg-gradient-to-br from-[#151515] to-[#1f1f1f] rounded-2xl p-6 border border-gray-800">
                      <h3 className="text-lg font-semibold text-pink-400 mb-5 flex items-center gap-2">
                        <span className="w-1 h-5 bg-pink-500 rounded-full"></span>
                        Documents
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedRegistration.documents.permissionLetter && (
                          <button
                            onClick={() =>
                              handleViewScreenshot(
                                selectedRegistration.documents.permissionLetter,
                                "Permission Letter",
                              )
                            }
                            className="bg-[#0a0a0a] border border-gray-800 hover:border-purple-500/50 rounded-xl p-4 transition-all text-left group overflow-hidden"
                          >
                            <div className="w-full h-32 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors overflow-hidden">
                              {isPdfUrl(
                                selectedRegistration.documents.permissionLetter,
                              ) ? (
                                <div className="flex flex-col items-center justify-center">
                                  <span className="text-4xl">📄</span>
                                  <span className="text-purple-400 text-xs mt-1">
                                    PDF
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <img
                                    src={
                                      selectedRegistration.documents
                                        .permissionLetter
                                    }
                                    alt="Permission Letter Preview"
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextElementSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                  <span className="text-4xl hidden">📄</span>
                                </>
                              )}
                            </div>
                            <p className="text-white font-semibold mb-1">
                              Permission Letter
                            </p>
                            <p className="text-purple-400 text-sm group-hover:text-purple-300">
                              Click to view
                            </p>
                          </button>
                        )}
                        {selectedRegistration.documents.transactionReceipt && (
                          <button
                            onClick={() =>
                              handleViewScreenshot(
                                selectedRegistration.documents
                                  .transactionReceipt,
                                "Transaction Receipt",
                              )
                            }
                            className="bg-[#0a0a0a] border border-gray-800 hover:border-blue-500/50 rounded-xl p-4 transition-all text-left group overflow-hidden"
                          >
                            <div className="w-full h-32 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors overflow-hidden">
                              {isPdfUrl(
                                selectedRegistration.documents
                                  .transactionReceipt,
                              ) ? (
                                <div className="flex flex-col items-center justify-center">
                                  <span className="text-4xl">🧾</span>
                                  <span className="text-blue-400 text-xs mt-1">
                                    PDF
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <img
                                    src={
                                      selectedRegistration.documents
                                        .transactionReceipt
                                    }
                                    alt="Transaction Receipt Preview"
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextElementSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                  <span className="text-4xl hidden">🧾</span>
                                </>
                              )}
                            </div>
                            <p className="text-white font-semibold mb-1">
                              Transaction Receipt
                            </p>
                            <p className="text-blue-400 text-sm group-hover:text-blue-300">
                              Click to view
                            </p>
                          </button>
                        )}
                        {selectedRegistration.documents.captainIdCard && (
                          <button
                            onClick={() =>
                              handleViewScreenshot(
                                selectedRegistration.documents.captainIdCard,
                                "Captain ID Card",
                              )
                            }
                            className="bg-[#0a0a0a] border border-gray-800 hover:border-green-500/50 rounded-xl p-4 transition-all text-left group overflow-hidden"
                          >
                            <div className="w-full h-32 bg-green-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-colors overflow-hidden">
                              {isPdfUrl(
                                selectedRegistration.documents.captainIdCard,
                              ) ? (
                                <div className="flex flex-col items-center justify-center">
                                  <span className="text-4xl">🪪</span>
                                  <span className="text-green-400 text-xs mt-1">
                                    PDF
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <img
                                    src={
                                      selectedRegistration.documents
                                        .captainIdCard
                                    }
                                    alt="Captain ID Card Preview"
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextElementSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                  <span className="text-4xl hidden">🪪</span>
                                </>
                              )}
                            </div>
                            <p className="text-white font-semibold mb-1">
                              Captain ID Card
                            </p>
                            <p className="text-green-400 text-sm group-hover:text-green-300">
                              Click to view
                            </p>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Team Members List - MOVED BELOW DOCUMENTS */}
                  {(() => {
                    // Try multiple possible keys for team members
                    let teamMembers =
                      selectedRegistration.formData?.teamMembers ||
                      selectedRegistration.formData?.team_members ||
                      selectedRegistration.formData?.get?.("teamMembers") ||
                      selectedRegistration.formData?.get?.("team_members");

                    // If it's a string (JSON), parse it
                    if (typeof teamMembers === "string") {
                      try {
                        teamMembers = JSON.parse(teamMembers);
                      } catch (e) {
                        console.error("Failed to parse team members:", e);
                        teamMembers = [];
                      }
                    }

                    // Ensure it's an array
                    if (!Array.isArray(teamMembers)) {
                      teamMembers = [];
                    }

                    if (teamMembers.length > 0) {
                      return (
                        <div className="mt-6 bg-gradient-to-br from-[#151515] to-[#1f1f1f] rounded-2xl p-6 border border-gray-800">
                          <h3 className="text-lg font-semibold text-blue-400 mb-5 flex items-center gap-2">
                            <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                            All Team Members ({teamMembers.length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teamMembers.map((member, index) => (
                              <div
                                key={index}
                                className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-400 font-bold text-sm">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold mb-1 truncate">
                                      {member.name || "N/A"}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                      📱{" "}
                                      {member.contact || member.phone || "N/A"}
                                    </p>
                                    {member.email && (
                                      <p className="text-gray-400 text-sm truncate">
                                        ✉️ {member.email}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Status Update Actions */}
                  <div className="mt-8 flex gap-4">
                    {selectedRegistration.status !== "confirmed" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            selectedRegistration._id,
                            "confirmed",
                          )
                        }
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">✓</span>
                        Confirm Registration
                      </button>
                    )}
                    {selectedRegistration.status !== "cancelled" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            selectedRegistration._id,
                            "cancelled",
                          )
                        }
                        className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">✗</span>
                        Cancel Registration
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screenshot Modal */}
        <AnimatePresence>
          {showScreenshotModal && selectedScreenshot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setShowScreenshotModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-3xl p-6 max-w-5xl w-full max-h-[90vh] overflow-auto border border-gray-800 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    {selectedScreenshot.type}
                  </h3>
                  <div className="flex items-center gap-3">
                    <a
                      href={selectedScreenshot.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors text-white text-sm font-medium"
                    >
                      Open in New Tab
                    </a>
                    <button
                      onClick={() => setShowScreenshotModal(false)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-gray-400 hover:text-white"
                    >
                      <span className="text-2xl">×</span>
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4">
                  {/* Check if it's a PDF */}
                  {selectedScreenshot.url?.includes(".pdf") ||
                  selectedScreenshot.url?.includes("application/pdf") ||
                  selectedScreenshot.url?.includes("/raw/") ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">📄</div>
                      <p className="text-gray-800 font-semibold mb-2">
                        PDF Document
                      </p>
                      <p className="text-gray-600 mb-6">
                        Click the button below to view or download the PDF
                      </p>
                      <a
                        href={selectedScreenshot.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors text-white font-medium"
                      >
                        <span>📥</span> View/Download PDF
                      </a>
                    </div>
                  ) : (
                    <img
                      src={selectedScreenshot.url}
                      alt={selectedScreenshot.type}
                      className="w-full h-auto rounded-xl"
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminSportsRegistrations;
