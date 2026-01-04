import {useState, useEffect, useCallback} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import api from "../config/api";
import AdminLayout from "../components/AdminLayout";
import MobileTabNavigation from "../components/MobileTabNavigation";
import WomenTournamentAnalytics from "../components/mobile/WomenTournamentAnalytics";
import WomenTournamentRegistrations from "../components/mobile/WomenTournamentRegistrations";

const AdminWomenTournament = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sport: "",
    status: "",
    page: 1,
    limit: 50,
  });
  const [pagination, setPagination] = useState({});
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState("analytics");

  // Category sports mapping (same as mobile)
  const categorySportsMap = {
    category1: [
      "Sack Race",
      "3 Leg Race",
      "Balloon Bursting",
      "Brick Race",
      "Musical Chair",
      "Nimbu Chamach",
      "Powerlifting",
      "Weightlifting",
      "Hankerchief Snash",
    ],
    category2: ["Badminton", "Chess", "Carrom", "Athletics"],
    category3: [
      "Tug of War",
      "Volleyball",
      "Cricket",
      "Basketball 3x3",
      "Rink Football",
      "Box Cricket",
    ],
  };

  // Get available sports based on selected category
  const getAvailableSports = () => {
    if (!filters.category) {
      // Return all sports if no category selected
      return [
        ...categorySportsMap.category1,
        ...categorySportsMap.category2,
        ...categorySportsMap.category3,
      ];
    }
    return categorySportsMap[filters.category] || [];
  };

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/women-tournament/admin/registrations", {
        params: filters,
      });

      if (response.data.success) {
        setRegistrations(response.data.data.registrations);
        setPagination(response.data.data.pagination);
        setStatistics(response.data.data.statistics);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      if (error.response?.status === 404) {
        toast.error(
          "Women's Tournament admin endpoint not found. Please check backend routes."
        );
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        navigate("/admin/login");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to fetch registrations"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [filters, navigate]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Filter registrations by sport on client-side (since backend doesn't support it yet)
  const filteredRegistrations = registrations.filter((reg) => {
    if (!filters.sport) return true;
    return reg.selectedSports?.includes(filters.sport);
  });

  const handleStatusUpdate = async (id, status, paymentStatus) => {
    try {
      const response = await api.patch(
        `/women-tournament/admin/registrations/${id}/status`,
        {status, paymentStatus}
      );

      if (response.data.success) {
        toast.success("Status updated successfully");
        fetchRegistrations();
        if (selectedRegistration?._id === id) {
          setSelectedRegistration(response.data.data);
        }
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    try {
      const response = await api.delete(
        `/women-tournament/admin/registrations/${id}`
      );

      if (response.data.success) {
        toast.success("Registration deleted successfully");
        fetchRegistrations();
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete registration");
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get(
        "/women-tournament/admin/registrations/export/csv",
        {
          params: {
            category: filters.category,
            status: filters.status,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `women-tournament-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV exported successfully");
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Failed to export CSV");
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      category1: "Category 1 - Individual Sports",
      category2: "Category 2 - Indoor Games",
      category3: "Category 3 - Fun & Team Events",
    };
    return labels[category] || category;
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      completed: "bg-green-500/20 text-green-400",
      pending: "bg-yellow-500/20 text-yellow-400",
      failed: "bg-red-500/20 text-red-400",
      not_required: "bg-gray-500/20 text-gray-400",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <AdminLayout title="Women's Tournament">
      {/* Mobile Tab Navigation - Only visible on mobile */}
      <MobileTabNavigation
        activeTab={mobileActiveTab}
        onTabChange={setMobileActiveTab}
      />

      {/* Mobile View - Separate pages */}
      <div className="md:hidden">
        {mobileActiveTab === "analytics" ? (
          <WomenTournamentAnalytics
            registrations={registrations}
            statistics={statistics}
            onFilterChange={(filter) => setFilters({...filters, ...filter})}
          />
        ) : (
          <WomenTournamentRegistrations
            registrations={registrations}
            loading={loading}
            onViewDetails={(registration) => {
              setSelectedRegistration(registration);
              setShowDetailsModal(true);
            }}
            onUpdateStatus={handleStatusUpdate}
          />
        )}
      </div>

      {/* Desktop View - Combined page (existing layout) */}
      <div className="p-8 hidden md:block">
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6"
            >
              <div className="text-4xl mb-2">👥</div>
              <div className="text-3xl font-bold text-white mb-1">
                {statistics.totalRegistrations}
              </div>
              <div className="text-gray-400 text-sm">Total Registrations</div>
            </motion.div>

            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.1}}
              className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6"
            >
              <div className="text-4xl mb-2">💰</div>
              <div className="text-3xl font-bold text-white mb-1">
                ₹{statistics.totalRevenue.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Total Revenue</div>
            </motion.div>

            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.2}}
              className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-6"
            >
              <div className="text-4xl mb-2">✅</div>
              <div className="text-3xl font-bold text-white mb-1">
                {statistics.confirmedCount}
              </div>
              <div className="text-gray-400 text-sm">Confirmed</div>
            </motion.div>

            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.3}}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6"
            >
              <div className="text-4xl mb-2">⏳</div>
              <div className="text-3xl font-bold text-white mb-1">
                {statistics.pendingCount}
              </div>
              <div className="text-gray-400 text-sm">Pending</div>
            </motion.div>
          </div>
        )}

        {/* Category Breakdown */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-yellow-400 font-semibold mb-2">
                Category 1 (₹49 Unlimited)
              </div>
              <div className="text-2xl font-bold text-white">
                {statistics.category1Count}
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="text-blue-400 font-semibold mb-2">
                Category 2 (₹49/game)
              </div>
              <div className="text-2xl font-bold text-white">
                {statistics.category2Count}
              </div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="text-green-400 font-semibold mb-2">
                Category 3 (₹199/team)
              </div>
              <div className="text-2xl font-bold text-white">
                {statistics.category3Count}
              </div>
            </div>
          </div>
        )}

        {/* Filters & Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name, reg no, mobile..."
              value={filters.search}
              onChange={(e) =>
                setFilters({...filters, search: e.target.value, page: 1})
              }
              className="px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 outline-none"
            />

            <select
              value={filters.category}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  category: e.target.value,
                  sport: "", // Reset sport when category changes
                  page: 1,
                });
              }}
              className="px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-pink-500 outline-none"
            >
              <option value="">All Categories</option>
              <option value="category1">
                Cat 1 - Individual (₹49 Unlimited)
              </option>
              <option value="category2">Cat 2 - Indoor (₹49/game)</option>
              <option value="category3">Cat 3 - Team (₹199/team)</option>
            </select>

            <select
              value={filters.sport}
              onChange={(e) =>
                setFilters({...filters, sport: e.target.value, page: 1})
              }
              className="px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-pink-500 outline-none"
            >
              <option value="">
                {filters.category
                  ? `All ${
                      filters.category === "category1"
                        ? "Cat 1"
                        : filters.category === "category2"
                        ? "Cat 2"
                        : "Cat 3"
                    } Sports`
                  : "All Sports"}
              </option>
              {getAvailableSports().map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({...filters, status: e.target.value, page: 1})
              }
              className="px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-pink-500 outline-none"
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-lg font-semibold text-white transition-all"
            >
              📥 Export CSV
            </button>
          </div>

          {/* Active Filters Display */}
          {(filters.search ||
            filters.category ||
            filters.sport ||
            filters.status) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-400 text-sm">Active filters:</span>
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                  Search: {filters.search}
                  <button
                    onClick={() =>
                      setFilters({...filters, search: "", page: 1})
                    }
                    className="hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                  Category:{" "}
                  {filters.category === "category1"
                    ? "Cat 1"
                    : filters.category === "category2"
                    ? "Cat 2"
                    : "Cat 3"}
                  <button
                    onClick={() =>
                      setFilters({...filters, category: "", sport: "", page: 1})
                    }
                    className="hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filters.sport && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                  Sport: {filters.sport}
                  <button
                    onClick={() => setFilters({...filters, sport: "", page: 1})}
                    className="hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                  Status: {filters.status}
                  <button
                    onClick={() =>
                      setFilters({...filters, status: "", page: 1})
                    }
                    className="hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    category: "",
                    sport: "",
                    status: "",
                    page: 1,
                    limit: 50,
                  })
                }
                className="text-gray-400 text-sm hover:text-white transition-colors underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Registrations Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"></div>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center p-12 text-gray-400">
              <div className="text-6xl mb-4">📋</div>
              <div className="text-xl">No registrations found</div>
              {filters.sport && (
                <p className="text-sm mt-2">
                  No registrations found for "{filters.sport}"
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/40 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Reg No
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Mobile
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Sports
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Screenshot
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRegistrations.map((reg, index) => (
                      <motion.tr
                        key={reg._id}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: index * 0.05}}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(reg.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-sm text-white font-medium">
                          {reg.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {reg.registrationNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {reg.mobileNumber}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                            {reg.selectedCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {reg.selectedSports.length} sport(s)
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-400">
                          ₹{reg.totalAmount}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {reg.paymentScreenshot ? (
                            <button
                              onClick={() => {
                                window.open(reg.paymentScreenshot, "_blank");
                              }}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                          ) : (
                            <span className="text-gray-500 text-xs">
                              No file
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              reg.status
                            )}`}
                          >
                            {reg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => {
                              setSelectedRegistration(reg);
                              setShowDetailsModal(true);
                            }}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-medium transition-all"
                          >
                            View
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between p-6 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    {filters.sport ? (
                      <>
                        Showing {filteredRegistrations.length} filtered results
                        <span className="text-blue-400 ml-1">
                          (from {pagination.total} total)
                        </span>
                      </>
                    ) : (
                      <>
                        Showing {(pagination.page - 1) * pagination.limit + 1}{" "}
                        to{" "}
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}{" "}
                        of {pagination.total} registrations
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setFilters({...filters, page: filters.page - 1})
                      }
                      disabled={filters.page === 1}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-all"
                    >
                      Previous
                    </button>
                    <div className="px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg">
                      {pagination.page} / {pagination.pages}
                    </div>
                    <button
                      onClick={() =>
                        setFilters({...filters, page: filters.page + 1})
                      }
                      disabled={filters.page >= pagination.pages}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {/* End Desktop View */}
      </div>

      {/* Details Modal - Shared between Mobile and Desktop */}
      <AnimatePresence>
        {showDetailsModal && selectedRegistration && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{scale: 0.9, y: 20}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.9, y: 20}}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Registration Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Participant Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span>👤</span> Participant Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Name</div>
                      <div className="text-white font-medium">
                        {selectedRegistration.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">
                        Registration Number
                      </div>
                      <div className="text-white font-medium">
                        {selectedRegistration.registrationNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">
                        Mobile Number
                      </div>
                      <div className="text-white font-medium">
                        {selectedRegistration.mobileNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Category</div>
                      <div className="text-white font-medium">
                        {selectedRegistration.selectedCategory?.replace(
                          "category",
                          "Category "
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Sports */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🏆</span> Selected Sports (
                    {selectedRegistration.selectedSports?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegistration.selectedSports?.map(
                      (sport, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm border border-blue-500/30"
                        >
                          {sport}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Team Name */}
                {selectedRegistration.category3TeamName && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span>👥</span> Team Name
                    </h3>
                    <div className="text-white font-medium">
                      {selectedRegistration.category3TeamName}
                    </div>
                  </div>
                )}

                {/* Status and Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Status</div>
                    <select
                      value={selectedRegistration.status}
                      onChange={(e) =>
                        handleStatusUpdate(
                          selectedRegistration._id,
                          e.target.value,
                          selectedRegistration.paymentStatus
                        )
                      }
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">
                      Payment Status
                    </div>
                    <select
                      value={selectedRegistration.paymentStatus}
                      onChange={(e) =>
                        handleStatusUpdate(
                          selectedRegistration._id,
                          selectedRegistration.status,
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="not_required">Not Required</option>
                    </select>
                  </div>
                </div>

                {/* Payment Screenshot */}
                {selectedRegistration.paymentScreenshot && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span>🖼️</span> Payment Screenshot
                    </h3>
                    <img
                      src={selectedRegistration.paymentScreenshot}
                      alt="Payment Screenshot"
                      className="w-full rounded-lg border border-white/10 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() =>
                        window.open(
                          selectedRegistration.paymentScreenshot,
                          "_blank"
                        )
                      }
                    />
                  </div>
                )}

                {/* Total Amount */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Total Amount</div>
                  <div className="text-3xl font-bold text-green-400">
                    ₹{selectedRegistration.totalAmount}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDelete(selectedRegistration._id)}
                    className="flex-1 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-semibold transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminWomenTournament;
