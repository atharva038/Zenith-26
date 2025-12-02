import {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("adminData");

    if (!token || !adminData) {
      navigate("/admin/login");
      return;
    }

    setAdmin(JSON.parse(adminData));
    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
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
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/admin/admins/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      // Refresh admins list
      setAdmins(admins.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Failed to delete admin");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a18] to-black flex items-center justify-center">
        <motion.div
          animate={{rotate: 360}}
          transition={{duration: 1, repeat: Infinity, ease: "linear"}}
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
            initial={{x: -300}}
            animate={{x: 0}}
            exit={{x: -300}}
            className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-neon-blue/20 z-50"
          >
            {/* Logo */}
            <div className="p-6 border-b border-gray-700/50">
              <Link to="/home">
                <h2 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-neon-blue to-electric-cyan bg-clip-text text-transparent">
                  ZENITH 2026
                </h2>
              </Link>
              <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {[
                {id: "dashboard", label: "Dashboard", icon: "📊"},
                {id: "admins", label: "Admins", icon: "👥"},
                {id: "events", label: "Events", icon: "🎪"},
                {id: "gallery", label: "Gallery", icon: "🖼️"},
                {id: "settings", label: "Settings", icon: "⚙️"},
              ].map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{x: 5}}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-neon-blue/20 to-electric-cyan/20 border border-neon-blue/50 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </motion.button>
              ))}
            </nav>

            {/* Admin Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-orange flex items-center justify-center font-bold">
                  {admin?.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{admin?.username}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {admin?.email}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={handleLogout}
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.98}}
                className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 font-rajdhani transition-all"
              >
                Logout
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
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold font-rajdhani capitalize">
              {activeTab}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
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

          {["events", "gallery", "settings"].includes(activeTab) && (
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-12 border border-neon-orange/20 text-center"
            >
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold mb-2 font-rajdhani">
                Coming Soon
              </h2>
              <p className="text-gray-400">
                This feature is under development and will be available soon.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
