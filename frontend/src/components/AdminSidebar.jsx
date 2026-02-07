import {motion} from "framer-motion";
import {Link, useNavigate, useLocation} from "react-router-dom";

const AdminSidebar = ({sidebarOpen, setSidebarOpen, admin}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  const menuItems = [
    // {id: "dashboard", label: "Dashboard", icon: "📊", path: "/admin/dashboard"},
    {
      id: "dev-portal",
      label: "Developer Portal",
      icon: "💻",
      path: "/dev",
    },
    {id: "marathon", label: "Marathon", icon: "🏃", path: "/admin/marathon"},
    {
      id: "women-tournament",
      label: "Women's Tournament",
      icon: "👩‍🎓",
      path: "/admin/women-tournament",
    },
    {
      id: "Main-Zenith-Registrations",
      label: "Main Zenith",
      icon: "🏆",
      path: "/admin/sports-registrations",
    },
    // 🔒 HIDDEN: On-Spot Registration (Tournament Closed)
    // {
    //   id: "onspot-registration",
    //   label: "On-Spot Registration",
    //   icon: "📝",
    //   path: "/admin/onspot-registration",
    // },
    // {id: "admins", label: "Admins", icon: "👥", path: "/admin/admins"},
    {id: "gallery", label: "Gallery", icon: "🖼️", path: "/admin/gallery"},
    // {id: "settings", label: "Settings", icon: "⚙️", path: "/admin/settings"},
  ];

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <>
      {/* Backdrop Blur Overlay - Only on mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{x: -300}}
          animate={{x: 0}}
          exit={{x: -300}}
          transition={{type: "spring", damping: 25, stiffness: 200}}
          className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-neon-blue/20 z-50 shadow-2xl shadow-neon-blue/20"
        >
          {/* Logo & Toggle */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <Link to="/home">
                <h2 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-neon-blue to-electric-cyan bg-clip-text text-transparent">
                  ZENITH 2026
                </h2>
              </Link>
              {/* Close button - only on mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all group lg:hidden"
              >
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
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
            <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                whileHover={{x: 5}}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani ${
                  isActive(item.path)
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
                <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
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
    </>
  );
};

export default AdminSidebar;
