import {useState, useEffect, useCallback} from "react";
import {motion} from "framer-motion";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const fetchDashboardData = useCallback(async (token) => {
    try {
      const [statsRes, adminsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/dashboard/stats", {
          headers: {Authorization: `Bearer ${token}`},
        }),
        axios.get("http://localhost:5000/api/admin/admins", {
          headers: {Authorization: `Bearer ${token}`},
        }),
      ]);

      setStats(statsRes.data.data.stats);
      setAdmins(adminsRes.data.data.admins);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const adminData = localStorage.getItem("adminData");
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
    const token = localStorage.getItem("adminToken");
    if (token) {
      fetchDashboardData(token);
    }
  }, [fetchDashboardData]);

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/admin/admins/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      setAdmins(admins.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Failed to delete admin");
    }
  };

  return (
    <AdminLayout title={activeTab}>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{rotate: 360}}
            transition={{duration: 1, repeat: Infinity, ease: "linear"}}
            className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-3 rounded-lg font-rajdhani font-semibold transition-all ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-neon-blue/20 to-electric-cyan/20 border border-neon-blue/50 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`px-6 py-3 rounded-lg font-rajdhani font-semibold transition-all ${
                activeTab === "admins"
                  ? "bg-gradient-to-r from-neon-blue/20 to-electric-cyan/20 border border-neon-blue/50 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              👥 Admins
            </button>
          </div>

          {activeTab === "dashboard" && (
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: "Total Admins",
                    value: stats?.totalAdmins || 0,
                    icon: "👥",
                    color: "neon-blue",
                  },
                  {
                    label: "Active Admins",
                    value: stats?.activeAdmins || 0,
                    icon: "✅",
                    color: "green-500",
                  },
                  {
                    label: "Inactive Admins",
                    value: stats?.inactiveAdmins || 0,
                    icon: "❌",
                    color: "red-500",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: index * 0.1}}
                    whileHover={{y: -5}}
                    className={`bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-${stat.color}/20 shadow-xl`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">{stat.icon}</span>
                      <div
                        className={`text-4xl font-bold bg-gradient-to-r from-${stat.color} to-${stat.color}/50 bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </div>
                    </div>
                    <h3 className="text-gray-400 font-rajdhani">
                      {stat.label}
                    </h3>
                  </motion.div>
                ))}
              </div>

              {/* Welcome Message */}
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.3}}
                className="bg-gradient-to-r from-neon-blue/10 to-neon-orange/10 border border-neon-blue/30 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold mb-2 font-rajdhani">
                  Welcome, {admin?.username}! 👋
                </h2>
                <p className="text-gray-300">
                  Manage your Zenith 2026 platform from this central dashboard.
                  Navigate through the sidebar to access different sections.
                </p>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "admins" && (
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl border border-neon-blue/20 overflow-hidden">
                <div className="p-6 border-b border-gray-700/50">
                  <h2 className="text-xl font-bold font-rajdhani">
                    Admin Management
                  </h2>
                  <p className="text-gray-400 text-sm">
                    View and manage all admin accounts
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {admins.map((adminItem) => (
                        <tr
                          key={adminItem._id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {adminItem.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                            {adminItem.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-neon-blue/20 text-neon-blue">
                              {adminItem.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                adminItem.isActive
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {adminItem.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {adminItem._id !== admin?._id && (
                              <button
                                onClick={() => handleDeleteAdmin(adminItem._id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
