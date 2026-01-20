import {useState, useEffect, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {toast} from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../config/api";
import AdminLayout from "../../components/AdminLayout";
import useScrollLock from "../../hooks/useScrollLock";

const AdminMarathon = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true); // For full-page spinner on first load
  const [loading, setLoading] = useState(false); // For filter/search operations
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  
  // Centralized scroll locking for modals
  useScrollLock(showDetailsModal, 'marathon-details-modal');
  useScrollLock(showScreenshotModal, 'marathon-screenshot-modal');
  
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    gender: "",
    tshirtSize: "",
    tshirtDistributed: "",
    page: 1,
    limit: 50,
  });
  const [pagination, setPagination] = useState({});

  // Unified filter handler that resets page when any filter changes
  const handleFilterChange = (newFilters) => {
    // Always reset page to 1 when any filter changes (except page itself)
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
      status: "",
      search: "",
      gender: "",
      tshirtSize: "",
      tshirtDistributed: "",
      page: 1,
      limit: 50,
    });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.status ||
      filters.search ||
      filters.gender ||
      filters.tshirtSize ||
      filters.tshirtDistributed
    );
  };

  // Fetch registrations
  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.gender) queryParams.append("gender", filters.gender);
      if (filters.tshirtSize)
        queryParams.append("tshirtSize", filters.tshirtSize);
      if (filters.tshirtDistributed)
        queryParams.append("tshirtDistributed", filters.tshirtDistributed);
      queryParams.append("page", filters.page);
      queryParams.append("limit", filters.limit);

      const response = await api.get(`/marathon/registrations?${queryParams}`);
      if (response.data.success) {
        setRegistrations(response.data.data);
        setStats(response.data.stats);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      toast.error("Failed to fetch registrations");
      console.error(error);
    } finally {
      setLoading(false);
      setInitialLoading(false); // Turn off initial loading after first fetch
    }
  }, [filters]);

  // Fetch registrations when the memoized function changes (which happens when filters change)
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Update registration status (optimistic update)
  const updateStatus = async (id, status) => {
    // Optimistic update - update local state immediately
    const previousRegistrations = [...registrations];
    setRegistrations((prev) =>
      prev.map((reg) => (reg._id === id ? {...reg, status} : reg)),
    );

    // Update selected registration if modal is open
    if (selectedRegistration && selectedRegistration._id === id) {
      setSelectedRegistration((prev) => ({...prev, status}));
    }

    try {
      const response = await api.put(`/marathon/registrations/${id}`, {
        status,
      });
      if (response.data.success) {
        toast.success("Status updated successfully");
      } else {
        // Revert on failure
        setRegistrations(previousRegistrations);
        toast.error("Failed to update status");
      }
    } catch (error) {
      // Revert on error
      setRegistrations(previousRegistrations);
      toast.error("Failed to update status");
    }
  };

  // Confirm registration (optimistic update)
  const confirmRegistration = async (id) => {
    // Optimistic update - update local state immediately
    const previousRegistrations = [...registrations];
    setRegistrations((prev) =>
      prev.map((reg) => (reg._id === id ? {...reg, status: "confirmed"} : reg)),
    );

    // Update selected registration if modal is open
    if (selectedRegistration && selectedRegistration._id === id) {
      setSelectedRegistration((prev) => ({...prev, status: "confirmed"}));
    }

    try {
      const response = await api.put(`/marathon/registrations/${id}`, {
        status: "confirmed",
      });
      if (response.data.success) {
        if (response.data.emailSent) {
          toast.success(
            "Registration confirmed! Confirmation email sent to participant.",
          );
        } else {
          toast.success("Registration confirmed successfully (Email not sent)");
        }
        setShowDetailsModal(false);
      } else {
        // Revert on failure
        setRegistrations(previousRegistrations);
        if (selectedRegistration && selectedRegistration._id === id) {
          setSelectedRegistration((prev) => ({
            ...prev,
            status: previousRegistrations.find((r) => r._id === id)?.status,
          }));
        }
        toast.error("Failed to confirm registration");
      }
    } catch (error) {
      // Revert on error
      setRegistrations(previousRegistrations);
      if (selectedRegistration && selectedRegistration._id === id) {
        setSelectedRegistration((prev) => ({
          ...prev,
          status: previousRegistrations.find((r) => r._id === id)?.status,
        }));
      }
      toast.error("Failed to confirm registration");
    }
  };

  // Reject registration (optimistic update)
  const rejectRegistration = async (id) => {
    if (!window.confirm("Are you sure you want to reject this registration?")) {
      return;
    }

    // Optimistic update - update local state immediately
    const previousRegistrations = [...registrations];
    setRegistrations((prev) =>
      prev.map((reg) => (reg._id === id ? {...reg, status: "cancelled"} : reg)),
    );

    // Update selected registration if modal is open
    if (selectedRegistration && selectedRegistration._id === id) {
      setSelectedRegistration((prev) => ({...prev, status: "cancelled"}));
    }

    try {
      const response = await api.put(`/marathon/registrations/${id}`, {
        status: "cancelled",
      });
      if (response.data.success) {
        if (response.data.emailSent) {
          toast.success(
            "Registration rejected. Notification email sent to participant.",
          );
        } else {
          toast.success("Registration rejected (Email not sent)");
        }
        setShowDetailsModal(false);
      } else {
        // Revert on failure
        setRegistrations(previousRegistrations);
        if (selectedRegistration && selectedRegistration._id === id) {
          setSelectedRegistration((prev) => ({
            ...prev,
            status: previousRegistrations.find((r) => r._id === id)?.status,
          }));
        }
        toast.error("Failed to reject registration");
      }
    } catch (error) {
      // Revert on error
      setRegistrations(previousRegistrations);
      if (selectedRegistration && selectedRegistration._id === id) {
        setSelectedRegistration((prev) => ({
          ...prev,
          status: previousRegistrations.find((r) => r._id === id)?.status,
        }));
      }
      toast.error("Failed to reject registration");
    }
  };

  // View details
  const viewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  // View screenshot
  const viewScreenshot = (screenshotUrl) => {
    setSelectedScreenshot(screenshotUrl);
    setShowScreenshotModal(true);
  };

  // Export to CSV
  const exportToCSV = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.gender) queryParams.append("gender", filters.gender);

      const response = await api.get(`/marathon/export?${queryParams}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `marathon-registrations-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Registrations exported successfully");
    } catch (error) {
      toast.error("Failed to export registrations");
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, pageWidth, 45, "F");

      doc.setTextColor(0, 191, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("ZENITH 2026", pageWidth / 2, 20, {align: "center"});

      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("Marathon Registrations Report", pageWidth / 2, 32, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 40, {
        align: "center",
      });

      // Statistics Summary
      if (stats) {
        doc.setFillColor(30, 30, 30);
        doc.rect(10, 50, pageWidth - 20, 35, "F");

        doc.setTextColor(0, 191, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Registration Summary", 15, 60);

        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "normal");

        const statY = 70;
        doc.text(`Total Registrations: ${stats.total || 0}`, 15, statY);
        doc.text(`Confirmed: ${stats.confirmed || 0}`, 70, statY);
        doc.text(`Pending: ${stats.pending || 0}`, 120, statY);
        doc.text(`Cancelled: ${stats.cancelled || 0}`, 170, statY);

        // Calculate revenue
        const confirmedRevenue = (stats.confirmed || 0) * 99;
        const totalRevenue = (stats.total || 0) * 99;

        doc.setTextColor(0, 255, 100);
        doc.text(
          `Confirmed Revenue: ₹${confirmedRevenue.toLocaleString()}`,
          15,
          statY + 10,
        );
        doc.text(
          `Total Potential: ₹${totalRevenue.toLocaleString()}`,
          100,
          statY + 10,
        );
      }

      // Registrations Table
      const filteredRegs = registrations.filter(
        (reg) => reg.status !== "cancelled",
      );

      const tableData = filteredRegs.map((reg, index) => [
        index + 1,
        reg.registrationNumber || "N/A",
        reg.fullName || "N/A",
        reg.phone || "N/A",
        reg.gender || "N/A",
        reg.age || "N/A",
        reg.college || "N/A",
        reg.status?.toUpperCase() || "PENDING",
        reg.paymentDetails?.paymentScreenshot ? "✓" : "✗",
      ]);

      autoTable(doc, {
        startY: 95,
        head: [
          [
            "#",
            "Reg No",
            "Name",
            "Phone",
            "Gender",
            "Age",
            "College",
            "Status",
            "Screenshot",
          ],
        ],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 3,
          textColor: [255, 255, 255],
          fillColor: [20, 20, 30],
        },
        headStyles: {
          fillColor: [0, 100, 150],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [30, 30, 45],
        },
        columnStyles: {
          0: {halign: "center", cellWidth: 10},
          1: {cellWidth: 25},
          2: {cellWidth: 30},
          3: {cellWidth: 25},
          4: {halign: "center", cellWidth: 18},
          5: {halign: "center", cellWidth: 12},
          6: {cellWidth: 35},
          7: {halign: "center", cellWidth: 20},
          8: {halign: "center", cellWidth: 18},
        },
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${i} of ${pageCount} | ZENITH 2026 Marathon - 5K Run`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          {align: "center"},
        );
      }

      doc.save(`marathon-registrations-${Date.now()}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to export PDF");
    }
  };

  // Use server-side pagination if available, otherwise fall back to client-side
  // Server returns only the items for current page, so no need to slice
  // Client-side: slice the full array based on page/limit
  const currentItems = pagination.totalPages
    ? registrations.filter((reg) => reg.status !== "cancelled") // Server already paginated
    : registrations
        .filter((reg) => reg.status !== "cancelled")
        .slice(
          (filters.page - 1) * filters.limit,
          filters.page * filters.limit,
        );

  const totalPages =
    pagination.totalPages ||
    Math.ceil(
      registrations.filter((reg) => reg.status !== "cancelled").length /
        filters.limit,
    );

  const rejectedRegistrations = registrations.filter(
    (reg) => reg.status === "cancelled",
  );

  // Only show full-page spinner on initial load, not during filtering
  if (initialLoading) {
    return (
      <AdminLayout title="Marathon">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{rotate: 360}}
            transition={{duration: 1, repeat: Infinity, ease: "linear"}}
            className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full"
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Marathon">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="bg-gradient-to-br from-blue-600/20 to-blue-400/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1 font-rajdhani">
                  Total
                </p>
                <p className="text-3xl font-bold font-orbitron text-blue-400">
                  {stats.total}
                </p>
              </div>
              <div className="text-3xl opacity-50">📋</div>
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1}}
            className="bg-gradient-to-br from-green-600/20 to-green-400/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-4 hover:shadow-lg hover:shadow-green-500/20 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1 font-rajdhani">
                  Confirmed
                </p>
                <p className="text-3xl font-bold font-orbitron text-green-400">
                  {stats.confirmed}
                </p>
              </div>
              <div className="text-3xl opacity-50">✅</div>
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
            className="bg-gradient-to-br from-yellow-600/20 to-yellow-400/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-4 hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1 font-rajdhani">
                  Pending
                </p>
                <p className="text-3xl font-bold font-orbitron text-yellow-400">
                  {stats.pending}
                </p>
              </div>
              <div className="text-3xl opacity-50">⏳</div>
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3}}
            className="bg-gradient-to-br from-red-600/20 to-red-400/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4 hover:shadow-lg hover:shadow-red-500/20 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1 font-rajdhani">
                  Cancelled
                </p>
                <p className="text-3xl font-bold font-orbitron text-red-400">
                  {stats.cancelled}
                </p>
              </div>
              <div className="text-3xl opacity-50">❌</div>
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.4}}
            className="bg-gradient-to-br from-emerald-600/20 to-emerald-400/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-4 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1 font-rajdhani">
                  Revenue (Confirmed)
                </p>
                <p className="text-2xl font-bold font-orbitron text-emerald-400">
                  ₹{((stats.confirmed || 0) * 99).toLocaleString()}
                </p>
              </div>
              <div className="text-3xl opacity-50">💰</div>
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.5}}
            className="bg-gradient-to-br from-purple-600/20 to-purple-400/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1 font-rajdhani">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold font-orbitron text-purple-400">
                  ₹{((stats.total || 0) * 99).toLocaleString()}
                </p>
              </div>
              <div className="text-3xl opacity-50">💵</div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters and Actions */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-neon-blue/20 rounded-2xl p-6 mb-6"
      >
        {/* Filter Header with Clear Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-neon-blue font-rajdhani">
            🔍 Filters{" "}
            {hasActiveFilters() &&
              `(${Object.values(filters).filter((v) => v && v !== 1 && v !== 50).length} active)`}
          </h3>
          {hasActiveFilters() && (
            <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              onClick={handleClearAllFilters}
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all text-sm font-semibold"
            >
              ✕ Clear All
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="🔍 Search by name, email, or reg number..."
            value={filters.search}
            onChange={(e) => handleFilterChange({search: e.target.value})}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 font-rajdhani md:col-span-2"
          />

          {/* Gender Filter */}
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange({gender: e.target.value})}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 font-rajdhani"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange({status: e.target.value})}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 font-rajdhani"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* T-shirt Size Filter */}
          <select
            value={filters.tshirtSize}
            onChange={(e) => handleFilterChange({tshirtSize: e.target.value})}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 font-rajdhani"
          >
            <option value="">All T-shirt Sizes</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="XXXL">XXXL</option>
          </select>

          {/* T-shirt Distributed Filter */}
          <select
            value={filters.tshirtDistributed}
            onChange={(e) =>
              handleFilterChange({tshirtDistributed: e.target.value})
            }
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 font-rajdhani"
          >
            <option value="">T-shirt Status</option>
            <option value="true">Distributed ✅</option>
            <option value="false">Pending 📦</option>
          </select>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2 mt-4">
          <motion.button
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
            onClick={exportToCSV}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-green-600 transition-all font-rajdhani font-semibold shadow-lg shadow-green-500/20"
          >
            📥 Export CSV
          </motion.button>
          <motion.button
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
            onClick={exportToPDF}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-3 rounded-lg hover:from-red-700 hover:to-red-600 transition-all font-rajdhani font-semibold shadow-lg shadow-red-500/20"
          >
            📄 Export PDF
          </motion.button>
        </div>
      </motion.div>

      {/* Registrations Table */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-neon-blue/20 rounded-2xl overflow-hidden relative"
      >
        {/* Loading Overlay for filtering - only shows during filter operations, not initial load */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <motion.div
              animate={{rotate: 360}}
              transition={{duration: 1, repeat: Infinity, ease: "linear"}}
              className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full"
            />
          </div>
        )}

        {currentItems.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-lg font-rajdhani">
              No registrations found
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-neon-blue/10 to-electric-cyan/10 border-b border-neon-blue/20">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                      Reg No
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                      Name
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                      Phone
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                      Gender
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                      Age
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                      Screenshot
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentItems.map((reg, index) => (
                    <motion.tr
                      key={reg._id}
                      initial={{opacity: 0, x: -20}}
                      animate={{opacity: 1, x: 0}}
                      transition={{delay: index * 0.03}}
                      className="hover:bg-white/5 transition-all"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-electric-cyan font-mono">
                        {reg.registrationNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-white font-rajdhani">
                        {reg.fullName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 font-rajdhani">
                        {reg.phone}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full font-rajdhani border ${
                            reg.gender === "Male"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : reg.gender === "Female"
                                ? "bg-pink-500/20 text-pink-300 border-pink-500/30"
                                : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          }`}
                        >
                          {reg.gender}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 font-rajdhani">
                        {reg.age}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {reg.paymentDetails?.paymentScreenshot ? (
                          <motion.button
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            onClick={() =>
                              viewScreenshot(
                                reg.paymentDetails.paymentScreenshot,
                              )
                            }
                            className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-all text-xs font-semibold"
                          >
                            📷 View
                          </motion.button>
                        ) : (
                          <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs font-semibold">
                            ❌ None
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full font-rajdhani border ${
                            reg.status === "confirmed"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : reg.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            onClick={() => viewDetails(reg)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            👁️
                          </motion.button>
                          {reg.status === "pending" && (
                            <>
                              <motion.button
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                                onClick={() => confirmRegistration(reg._id)}
                                className="text-green-400 hover:text-green-300 transition-colors"
                                title="Confirm"
                              >
                                ✅
                              </motion.button>
                              <motion.button
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                                onClick={() => rejectRegistration(reg._id)}
                                className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                title="Reject"
                              >
                                ❌
                              </motion.button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {currentItems.map((reg, index) => (
                <motion.div
                  key={reg._id}
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: index * 0.05}}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-neon-blue/20 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-electric-cyan font-mono text-sm">
                        {reg.registrationNumber}
                      </p>
                      <p className="text-white font-semibold text-lg">
                        {reg.fullName}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        reg.status === "confirmed"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : reg.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white ml-2">{reg.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Gender:</span>
                      <span className="text-white ml-2">{reg.gender}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Age:</span>
                      <span className="text-white ml-2">{reg.age}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-green-400 ml-2 font-semibold">
                        ₹99
                      </span>
                    </div>
                  </div>

                  {/* Screenshot */}
                  <div className="mb-3">
                    {reg.paymentDetails?.paymentScreenshot ? (
                      <motion.button
                        whileTap={{scale: 0.95}}
                        onClick={() =>
                          viewScreenshot(reg.paymentDetails.paymentScreenshot)
                        }
                        className="w-full px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm font-semibold"
                      >
                        📷 View Payment Screenshot
                      </motion.button>
                    ) : (
                      <span className="block w-full px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm text-center">
                        ❌ No Screenshot Uploaded
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{scale: 0.95}}
                      onClick={() => viewDetails(reg)}
                      className="flex-1 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm font-semibold"
                    >
                      👁️ Details
                    </motion.button>
                    {reg.status === "pending" && (
                      <>
                        <motion.button
                          whileTap={{scale: 0.95}}
                          onClick={() => confirmRegistration(reg._id)}
                          className="flex-1 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm font-semibold"
                        >
                          ✅
                        </motion.button>
                        <motion.button
                          whileTap={{scale: 0.95}}
                          onClick={() => rejectRegistration(reg._id)}
                          className="flex-1 px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm font-semibold"
                        >
                          ❌
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-neon-blue/20">
                <p className="text-gray-400 text-sm font-rajdhani">
                  {pagination.total ? (
                    <>
                      Showing {(filters.page - 1) * filters.limit + 1} to{" "}
                      {Math.min(filters.page * filters.limit, pagination.total)}{" "}
                      of {pagination.total}
                    </>
                  ) : (
                    <>
                      Showing {(filters.page - 1) * filters.limit + 1} to{" "}
                      {Math.min(
                        filters.page * filters.limit,
                        registrations.filter((r) => r.status !== "cancelled")
                          .length,
                      )}{" "}
                      of{" "}
                      {
                        registrations.filter((r) => r.status !== "cancelled")
                          .length
                      }
                    </>
                  )}
                </p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() =>
                      handleFilterChange({page: Math.max(filters.page - 1, 1)})
                    }
                    disabled={filters.page === 1}
                    className={`px-4 py-2 rounded-lg font-rajdhani font-semibold transition-all ${
                      filters.page === 1
                        ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                        : "bg-neon-blue/20 border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/30"
                    }`}
                  >
                    ← Prev
                  </motion.button>
                  <span className="px-4 py-2 text-white font-rajdhani">
                    {filters.page} / {totalPages}
                  </span>
                  <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() =>
                      handleFilterChange({
                        page: Math.min(filters.page + 1, totalPages),
                      })
                    }
                    disabled={filters.page === totalPages}
                    className={`px-4 py-2 rounded-lg font-rajdhani font-semibold transition-all ${
                      filters.page === totalPages
                        ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                        : "bg-neon-blue/20 border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/30"
                    }`}
                  >
                    Next →
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Rejected Registrations Section */}
      {rejectedRegistrations.length > 0 && (
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="mt-8 bg-gradient-to-br from-red-900/20 to-red-800/10 backdrop-blur-sm border border-red-500/20 rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-red-500/20">
            <h3 className="text-lg font-bold font-orbitron text-red-400">
              ❌ Rejected/Cancelled Registrations (
              {rejectedRegistrations.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-red-500/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-400 uppercase font-rajdhani">
                    Reg No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-400 uppercase font-rajdhani">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-400 uppercase font-rajdhani">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-400 uppercase font-rajdhani">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-400 uppercase font-rajdhani">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-500/10">
                {rejectedRegistrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-red-500/5">
                    <td className="px-4 py-3 text-sm font-mono text-red-300">
                      {reg.registrationNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {reg.fullName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {reg.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{scale: 1.05}}
                          whileTap={{scale: 0.95}}
                          onClick={() => viewDetails(reg)}
                          className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-300 text-xs"
                        >
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{scale: 1.05}}
                          whileTap={{scale: 0.95}}
                          onClick={() => updateStatus(reg._id, "pending")}
                          className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-300 text-xs"
                        >
                          Restore
                        </motion.button>
                        <motion.button
                          whileHover={{scale: 1.05}}
                          whileTap={{scale: 0.95}}
                          onClick={() => viewDetails(reg)}
                          className="px-3 py-1 bg-neon-blue/20 border border-neon-blue/30 rounded text-neon-blue text-xs"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* View Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedRegistration && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
            onClick={() => setShowDetailsModal(false)}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{scale: 0.9, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              exit={{scale: 0.9, opacity: 0}}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-neon-blue/30 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 border-b border-neon-blue/20 pb-4">
                <div>
                  <h2 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-neon-blue to-electric-cyan bg-clip-text text-transparent">
                    Registration Details
                  </h2>
                  <p className="text-electric-cyan font-mono text-sm mt-1">
                    {selectedRegistration.registrationNumber}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full ${
                      selectedRegistration.status === "confirmed"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : selectedRegistration.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {selectedRegistration.status?.toUpperCase()}
                  </span>
                  <motion.button
                    whileHover={{scale: 1.1, rotate: 90}}
                    whileTap={{scale: 0.9}}
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              {/* Registration Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neon-blue font-rajdhani mb-3 flex items-center gap-2">
                    <span>👤</span> Personal Information
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">
                        Full Name
                      </p>
                      <p className="text-white font-semibold text-lg">
                        {selectedRegistration.fullName}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">
                          Email
                        </p>
                        <p className="text-white text-sm">
                          {selectedRegistration.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">
                          Phone
                        </p>
                        <p className="text-white text-sm">
                          {selectedRegistration.phone}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">
                          Age
                        </p>
                        <p className="text-white">{selectedRegistration.age}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">
                          Gender
                        </p>
                        <span
                          className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                            selectedRegistration.gender === "Male"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : selectedRegistration.gender === "Female"
                                ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                                : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          }`}
                        >
                          {selectedRegistration.gender}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">
                        College/Organization
                      </p>
                      <p className="text-white">
                        {selectedRegistration.college}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Marathon & Emergency Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neon-blue font-rajdhani mb-3 flex items-center gap-2">
                    <span>🏃</span> Marathon Details
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">
                          Event
                        </p>
                        <p className="text-orange-400 font-semibold">
                          5K Marathon
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">
                          Amount
                        </p>
                        <p className="text-green-400 font-bold text-lg">₹99</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">
                        Medical Conditions
                      </p>
                      <p className="text-white">
                        {selectedRegistration.medicalConditions || "None"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">
                        Registration Date
                      </p>
                      <p className="text-white">
                        {new Date(
                          selectedRegistration.createdAt,
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-neon-blue font-rajdhani mt-4 flex items-center gap-2">
                    <span>🆘</span> Emergency Contact
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">
                        Name
                      </p>
                      <p className="text-white">
                        {selectedRegistration.emergencyContact?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">
                        Phone
                      </p>
                      <p className="text-white">
                        {selectedRegistration.emergencyContact?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Screenshot Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-neon-blue font-rajdhani mb-3 flex items-center gap-2">
                  <span>💳</span> Payment Screenshot
                </h3>
                <div className="bg-white/5 rounded-lg p-4">
                  {selectedRegistration.paymentDetails?.paymentScreenshot ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <img
                          src={
                            selectedRegistration.paymentDetails
                              .paymentScreenshot
                          }
                          alt="Payment Screenshot"
                          className="w-full max-h-80 object-contain rounded-lg border border-green-500/30 cursor-pointer"
                          onClick={() =>
                            viewScreenshot(
                              selectedRegistration.paymentDetails
                                .paymentScreenshot,
                            )
                          }
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-lg">
                            🔍 Click to enlarge
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm">
                          ✅ Screenshot Uploaded
                        </span>
                        <motion.button
                          whileHover={{scale: 1.05}}
                          whileTap={{scale: 0.95}}
                          onClick={() =>
                            viewScreenshot(
                              selectedRegistration.paymentDetails
                                .paymentScreenshot,
                            )
                          }
                          className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm font-semibold"
                        >
                          📷 View Full Size
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-3 opacity-50">📷</div>
                      <p className="text-red-300 font-semibold">
                        No Payment Screenshot Uploaded
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        The participant has not uploaded a payment screenshot
                        yet
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 mt-6 pt-6 border-t border-neon-blue/20">
                {selectedRegistration.status === "pending" && (
                  <>
                    <motion.button
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                      onClick={() =>
                        confirmRegistration(selectedRegistration._id)
                      }
                      className="px-6 py-3 bg-green-600/20 border border-green-500/50 rounded-lg text-green-300 hover:bg-green-600/30 transition-all font-rajdhani font-semibold"
                    >
                      ✅ Confirm Registration
                    </motion.button>
                    <motion.button
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                      onClick={() =>
                        rejectRegistration(selectedRegistration._id)
                      }
                      className="px-6 py-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg text-yellow-300 hover:bg-yellow-600/30 transition-all font-rajdhani font-semibold"
                    >
                      ❌ Reject
                    </motion.button>
                  </>
                )}
                {selectedRegistration.status === "confirmed" && (
                  <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() => rejectRegistration(selectedRegistration._id)}
                    className="px-6 py-3 bg-red-600/20 border border-red-500/50 rounded-lg text-red-300 hover:bg-red-600/30 transition-all font-rajdhani font-semibold"
                  >
                    ❌ Reject Registration
                  </motion.button>
                )}
                {selectedRegistration.status === "cancelled" && (
                  <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() =>
                      updateStatus(selectedRegistration._id, "pending")
                    }
                    className="px-6 py-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg text-yellow-300 hover:bg-yellow-600/30 transition-all font-rajdhani font-semibold"
                  >
                    🔄 Restore to Pending
                  </motion.button>
                )}
                <motion.button
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.95}}
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-3 bg-gray-600/20 border border-gray-500/50 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-all font-rajdhani font-semibold"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screenshot Modal */}
      <AnimatePresence>
        {showScreenshotModal && selectedScreenshot && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-hidden"
            onClick={() => setShowScreenshotModal(false)}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{scale: 0.8, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              exit={{scale: 0.8, opacity: 0}}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full"
            >
              <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                onClick={() => setShowScreenshotModal(false)}
                className="absolute -top-12 right-0 text-white text-3xl hover:text-red-400 transition-colors z-10"
              >
                ✕
              </motion.button>
              <img
                src={selectedScreenshot}
                alt="Payment Screenshot"
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg border-2 border-neon-blue/30"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                <motion.a
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.95}}
                  href={selectedScreenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-600/80 text-white rounded-lg font-semibold backdrop-blur-sm"
                >
                  🔗 Open in New Tab
                </motion.a>
                <motion.a
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.95}}
                  href={selectedScreenshot}
                  download="payment-screenshot.jpg"
                  className="px-6 py-2 bg-green-600/80 text-white rounded-lg font-semibold backdrop-blur-sm"
                >
                  💾 Download
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminMarathon;
