import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import api from "../config/api";
import AdminLayout from "../components/AdminLayout";

const AdminWomenTournament = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    page: 1,
    limit: 50,
  });
  const [pagination, setPagination] = useState({});
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, [filters]);

  const fetchRegistrations = async () => {
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
      toast.error("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="p-8">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
              onChange={(e) =>
                setFilters({...filters, category: e.target.value, page: 1})
              }
              className="px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-pink-500 outline-none"
            >
              <option value="">All Categories</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
              <option value="category3">Category 3</option>
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
        </div>

        {/* Registrations Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"></div>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center p-12 text-gray-400">
              <div className="text-6xl mb-4">📋</div>
              <div className="text-xl">No registrations found</div>
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
                    {registrations.map((reg, index) => (
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
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} registrations
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

        {/* Details Modal */}
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
                className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-white">
                    Registration Details
                  </h2>
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

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Name</div>
                      <div className="text-white font-semibold">
                        {selectedRegistration.name}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">
                        Registration No
                      </div>
                      <div className="text-white font-semibold">
                        {selectedRegistration.registrationNumber}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Mobile</div>
                      <div className="text-white font-semibold">
                        {selectedRegistration.mobileNumber}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">
                        Registration Date
                      </div>
                      <div className="text-white font-semibold">
                        {new Date(
                          selectedRegistration.createdAt
                        ).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">Category</div>
                    <div className="text-white font-semibold">
                      {getCategoryLabel(selectedRegistration.selectedCategory)}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2">
                      Selected Sports (
                      {selectedRegistration.selectedSports.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedRegistration.selectedSports.map(
                        (sport, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm"
                          >
                            {sport}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {selectedRegistration.category3TeamName && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">
                        Team Name
                      </div>
                      <div className="text-white font-semibold">
                        {selectedRegistration.category3TeamName}
                      </div>
                    </div>
                  )}

                  {/* Payment Screenshot Section */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-3">
                      Payment Screenshot
                    </div>
                    {selectedRegistration.paymentScreenshot ? (
                      <div className="space-y-3">
                        {selectedRegistration.paymentScreenshot.endsWith(
                          ".pdf"
                        ) ? (
                          <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <svg
                              className="w-8 h-8 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <p className="text-white font-medium">
                                PDF Document
                              </p>
                              <a
                                href={selectedRegistration.paymentScreenshot}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm"
                              >
                                Open PDF
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <img
                              src={selectedRegistration.paymentScreenshot}
                              alt="Payment Screenshot"
                              className="w-full max-h-64 object-contain bg-black/40 rounded-lg border border-white/10"
                            />
                            <a
                              href={selectedRegistration.paymentScreenshot}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-center text-blue-400 hover:text-blue-300 text-sm"
                            >
                              View Full Size
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm italic">
                        No screenshot uploaded
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Status</div>
                      <select
                        value={selectedRegistration.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            selectedRegistration._id,
                            e.target.value,
                            selectedRegistration.paymentStatus
                          )
                        }
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white mt-2"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">
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
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white mt-2"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="not_required">Not Required</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">
                      Total Amount
                    </div>
                    <div className="text-3xl font-bold text-green-400">
                      ₹{selectedRegistration.totalAmount}
                    </div>
                  </div>

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
      </div>
    </AdminLayout>
  );
};

export default AdminWomenTournament;
