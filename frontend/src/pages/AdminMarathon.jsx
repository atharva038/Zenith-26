import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import api from "../config/api";

const AdminMarathon = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchRegistrations();
  }, [navigate, filters]);

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.search) queryParams.append("search", filters.search);

      const response = await api.get(`/marathon/registrations?${queryParams}`);
      if (response.data.success) {
        setRegistrations(response.data.data);
        setStats(response.data.stats);
      }
    } catch (error) {
      toast.error("Failed to fetch registrations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Update registration status
  const updateStatus = async (id, status) => {
    try {
      const response = await api.put(`/marathon/registrations/${id}`, {
        status,
      });
      if (response.data.success) {
        toast.success("Status updated successfully");
        fetchRegistrations();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Delete registration
  const deleteRegistration = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    try {
      const response = await api.delete(`/marathon/registrations/${id}`);
      if (response.data.success) {
        toast.success("Registration deleted successfully");
        setShowDetailsModal(false);
        fetchRegistrations();
      }
    } catch (error) {
      toast.error("Failed to delete registration");
    }
  };

  // Confirm registration
  const confirmRegistration = async (id) => {
    try {
      const response = await api.put(`/marathon/registrations/${id}`, {
        status: "confirmed",
      });
      if (response.data.success) {
        toast.success("Registration confirmed successfully");
        setShowDetailsModal(false);
        fetchRegistrations();
      }
    } catch (error) {
      toast.error("Failed to confirm registration");
    }
  };

  // Reject registration
  const rejectRegistration = async (id) => {
    if (!window.confirm("Are you sure you want to reject this registration?")) {
      return;
    }

    try {
      const response = await api.put(`/marathon/registrations/${id}`, {
        status: "cancelled",
      });
      if (response.data.success) {
        toast.success("Registration rejected");
        setShowDetailsModal(false);
        fetchRegistrations();
      }
    } catch (error) {
      toast.error("Failed to reject registration");
    }
  };

  // Verify payment
  const verifyPayment = async (id) => {
    try {
      const response = await api.put(`/marathon/registrations/${id}`, {
        paymentStatus: "verified",
      });
      if (response.data.success) {
        toast.success("Payment verified successfully");
        fetchRegistrations();
        // Update the modal data
        if (selectedRegistration && selectedRegistration._id === id) {
          setSelectedRegistration({
            ...selectedRegistration,
            paymentDetails: {
              ...selectedRegistration.paymentDetails,
              paymentStatus: "verified",
            },
          });
        }
      }
    } catch (error) {
      toast.error("Failed to verify payment");
      console.error(error);
    }
  };

  // View details
  const viewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  // Export to CSV
  const exportToCSV = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.status) queryParams.append("status", filters.status);

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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a18] to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a18] to-black text-white">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-neon-blue/20 z-50"
          >
            {/* Logo */}
            <div className="p-6 border-b border-gray-700/50">
              <Link to="/admin/dashboard">
                <h2 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-neon-blue to-electric-cyan bg-clip-text text-transparent">
                  ZENITH 2026
                </h2>
              </Link>
              <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              <motion.button
                onClick={() => navigate("/admin/dashboard")}
                whileHover={{ x: 5 }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani text-gray-400 hover:text-white hover:bg-white/5"
              >
                <span className="text-xl">📊</span>
                <span className="font-semibold">Dashboard</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/admin/events")}
                whileHover={{ x: 5 }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani text-gray-400 hover:text-white hover:bg-white/5"
              >
                <span className="text-xl">�</span>
                <span className="font-semibold">Events</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/admin/marathon")}
                whileHover={{ x: 5 }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani bg-gradient-to-r from-neon-blue/20 to-electric-cyan/20 border border-neon-blue/50 text-white"
              >
                <span className="text-xl">🏃</span>
                <span className="font-semibold">Marathon</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/admin/dashboard")}
                whileHover={{ x: 5 }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani text-gray-400 hover:text-white hover:bg-white/5"
              >
                <span className="text-xl">👥</span>
                <span className="font-semibold">Admins</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/admin/dashboard")}
                whileHover={{ x: 5 }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani text-gray-400 hover:text-white hover:bg-white/5"
              >
                <span className="text-xl">🖼️</span>
                <span className="font-semibold">Gallery</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/admin/dashboard")}
                whileHover={{ x: 5 }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani text-gray-400 hover:text-white hover:bg-white/5"
              >
                <span className="text-xl">⚙️</span>
                <span className="font-semibold">Settings</span>
              </motion.button>
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-6 left-0 right-0 px-4">
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-red-600/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-600/30 transition-all font-rajdhani font-semibold"
              >
                🚪 Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-neon-blue/20">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                <span className="text-2xl">☰</span>
              </motion.button>
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-neon-blue to-electric-cyan bg-clip-text text-transparent">
                🏃 Marathon Registrations
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-600/20 to-blue-400/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1 font-rajdhani">
                      Total Registrations
                    </p>
                    <p className="text-4xl font-bold font-orbitron text-blue-400">
                      {stats.total}
                    </p>
                  </div>
                  <div className="text-4xl opacity-50">📋</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-600/20 to-green-400/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-green-500/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1 font-rajdhani">
                      Confirmed
                    </p>
                    <p className="text-4xl font-bold font-orbitron text-green-400">
                      {stats.confirmed}
                    </p>
                  </div>
                  <div className="text-4xl opacity-50">✅</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-yellow-600/20 to-yellow-400/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1 font-rajdhani">
                      Pending
                    </p>
                    <p className="text-4xl font-bold font-orbitron text-yellow-400">
                      {stats.pending}
                    </p>
                  </div>
                  <div className="text-4xl opacity-50">⏳</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-red-600/20 to-red-400/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-red-500/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1 font-rajdhani">
                      Cancelled
                    </p>
                    <p className="text-4xl font-bold font-orbitron text-red-400">
                      {stats.cancelled}
                    </p>
                  </div>
                  <div className="text-4xl opacity-50">❌</div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Filters and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-neon-blue/20 rounded-2xl p-6 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="🔍 Search by name, email, or reg number..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 font-rajdhani"
              />

              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 font-rajdhani"
              >
                <option value="">All Categories</option>
                <option value="5K">5K</option>
                <option value="10K">10K</option>
                <option value="Half Marathon">Half Marathon</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 font-rajdhani"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportToCSV}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-600 transition-all font-rajdhani font-semibold shadow-lg shadow-green-500/20"
              >
                📥 Export CSV
              </motion.button>
            </div>
          </motion.div>

          {/* Registrations Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-neon-blue/20 rounded-2xl overflow-hidden"
          >
            {registrations.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-lg font-rajdhani">
                  No registrations found
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-neon-blue/10 to-electric-cyan/10 border-b border-neon-blue/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                        Reg No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider font-rajdhani">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {registrations.map((reg, index) => (
                      <motion.tr
                        key={reg._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-white/5 transition-all"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-electric-cyan font-mono">
                          {reg.registrationNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-rajdhani">
                          {reg.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-rajdhani">
                          {reg.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-rajdhani">
                          {reg.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-rajdhani">
                            {reg.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full font-rajdhani border ${
                                reg.paymentDetails?.paymentStatus === "verified"
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : reg.paymentDetails?.paymentStatus === "pending"
                                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30"
                              }`}
                            >
                              {reg.paymentDetails?.paymentStatus || "pending"}
                            </span>
                            {reg.paymentDetails?.paymentStatus === "pending" && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => verifyPayment(reg._id)}
                                className="text-green-400 hover:text-green-300 transition-colors text-xs"
                                title="Verify Payment"
                              >
                                ✓
                              </motion.button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => viewDetails(reg)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="View Details"
                            >
                              👁️
                            </motion.button>
                            {reg.status === "pending" && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => confirmRegistration(reg._id)}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                  title="Confirm"
                                >
                                  ✅
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => rejectRegistration(reg._id)}
                                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                  title="Reject"
                                >
                                  ❌
                                </motion.button>
                              </>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteRegistration(reg._id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete"
                            >
                              🗑️
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* View Details Modal */}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-neon-blue/30 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 border-b border-neon-blue/20 pb-4">
                <h2 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-neon-blue to-electric-cyan bg-clip-text text-transparent">
                  Registration Details
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </motion.button>
              </div>

              {/* Registration Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neon-blue font-rajdhani mb-3">
                    Personal Information
                  </h3>
                  <div>
                    <p className="text-gray-400 text-sm">Registration Number</p>
                    <p className="text-white font-mono font-semibold">
                      {selectedRegistration.registrationNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="text-white font-semibold">
                      {selectedRegistration.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">{selectedRegistration.phone}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Age</p>
                      <p className="text-white">{selectedRegistration.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Gender</p>
                      <p className="text-white">{selectedRegistration.gender}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">College/Organization</p>
                    <p className="text-white">{selectedRegistration.college}</p>
                  </div>
                </div>

                {/* Marathon Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neon-blue font-rajdhani mb-3">
                    Marathon Details
                  </h3>
                  <div>
                    <p className="text-gray-400 text-sm">Category</p>
                    <p className="text-white font-semibold">
                      {selectedRegistration.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">T-Shirt Size</p>
                    <p className="text-white">
                      {selectedRegistration.tshirtSize}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full font-rajdhani border ${
                        selectedRegistration.status === "confirmed"
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : selectedRegistration.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {selectedRegistration.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Medical Conditions</p>
                    <p className="text-white">
                      {selectedRegistration.medicalConditions || "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Registration Date</p>
                    <p className="text-white">
                      {new Date(
                        selectedRegistration.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neon-blue font-rajdhani mb-3">
                    Emergency Contact
                  </h3>
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white">
                      {selectedRegistration.emergencyContact?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">
                      {selectedRegistration.emergencyContact?.phone}
                    </p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neon-blue font-rajdhani mb-3">
                    Payment Details
                  </h3>
                  <div>
                    <p className="text-gray-400 text-sm">Transaction ID</p>
                    <p className="text-white font-mono">
                      {selectedRegistration.paymentDetails?.transactionId ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Amount</p>
                    <p className="text-white font-semibold">
                      ₹{selectedRegistration.paymentDetails?.amount || 500}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment Status</p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full font-rajdhani border ${
                          selectedRegistration.paymentDetails?.paymentStatus ===
                          "verified"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : selectedRegistration.paymentDetails
                                ?.paymentStatus === "pending"
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            : "bg-red-500/20 text-red-300 border-red-500/30"
                        }`}
                      >
                        {selectedRegistration.paymentDetails?.paymentStatus ||
                          "pending"}
                      </span>
                      {selectedRegistration.paymentDetails?.paymentStatus ===
                        "pending" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            verifyPayment(selectedRegistration._id)
                          }
                          className="px-3 py-1 bg-green-600/20 border border-green-500/50 rounded-lg text-green-300 hover:bg-green-600/30 transition-all text-xs font-semibold"
                        >
                          Verify Payment
                        </motion.button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment Date</p>
                    <p className="text-white">
                      {selectedRegistration.paymentDetails?.paymentDate
                        ? new Date(
                            selectedRegistration.paymentDetails.paymentDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-neon-blue/20">
                {selectedRegistration.status === "pending" && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        confirmRegistration(selectedRegistration._id)
                      }
                      className="px-6 py-3 bg-green-600/20 border border-green-500/50 rounded-lg text-green-300 hover:bg-green-600/30 transition-all font-rajdhani font-semibold"
                    >
                      ✅ Confirm Registration
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        rejectRegistration(selectedRegistration._id)
                      }
                      className="px-6 py-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg text-yellow-300 hover:bg-yellow-600/30 transition-all font-rajdhani font-semibold"
                    >
                      ❌ Reject
                    </motion.button>
                  </>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteRegistration(selectedRegistration._id)}
                  className="px-6 py-3 bg-red-600/20 border border-red-500/50 rounded-lg text-red-300 hover:bg-red-600/30 transition-all font-rajdhani font-semibold"
                >
                  🗑️ Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
    </div>
  );
};

export default AdminMarathon;
