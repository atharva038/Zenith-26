import React from "react";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  FiSettings, 
  FiToggleLeft, 
  FiCode, 
  FiDatabase,
  FiActivity,
  FiLock
} from "react-icons/fi";

const DevPortal = () => {
  const location = useLocation();
  const isMainPage = location.pathname === "/dev";

  const devTools = [
    {
      title: "Registration Control",
      description: "Toggle sports registration on/off globally",
      icon: FiToggleLeft,
      path: "/dev/registration-control",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: FiSettings,
      path: "/dev/settings",
      color: "from-blue-500 to-cyan-500",
      comingSoon: true
    },
    {
      title: "API Monitor",
      description: "Monitor API calls and performance",
      icon: FiActivity,
      path: "/dev/api-monitor",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Database Tools",
      description: "Database management utilities",
      icon: FiDatabase,
      path: "/dev/database",
      color: "from-orange-500 to-red-500",
      comingSoon: true
    }
  ];

  if (!isMainPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiCode className="text-5xl text-purple-500" />
            <h1 className="text-5xl font-bold text-white">
              Developer Portal
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            System administration and development tools
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <FiLock className="text-yellow-500" />
            <span className="text-yellow-500 text-sm font-semibold">
              Restricted Access - Admin Only
            </span>
          </div>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {devTools.map((tool, index) => (
            <motion.div
              key={tool.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {tool.comingSoon ? (
                <div className="relative h-full">
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full opacity-50 cursor-not-allowed">
                    <div className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center mb-6`}>
                      <tool.icon className="text-3xl text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {tool.title}
                    </h3>
                    <p className="text-gray-400">
                      {tool.description}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-yellow-500/20 border border-yellow-500/50 text-yellow-500 px-3 py-1 rounded-full text-xs font-semibold">
                    Coming Soon
                  </div>
                </div>
              ) : (
                <Link to={tool.path}>
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 h-full group">
                    <div className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <tool.icon className="text-3xl text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      {tool.description}
                    </p>
                    <div className="mt-6 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                      <span className="text-sm font-semibold">Open Tool</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6"
          >
            <h4 className="text-lg font-bold text-blue-400 mb-2">🔒 Secure Access</h4>
            <p className="text-gray-400 text-sm">
              All tools require admin authentication and are logged for security
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
          >
            <h4 className="text-lg font-bold text-purple-400 mb-2">⚡ Real-time Updates</h4>
            <p className="text-gray-400 text-sm">
              Changes take effect immediately across all user sessions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-900/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6"
          >
            <h4 className="text-lg font-bold text-green-400 mb-2">📊 Full Control</h4>
            <p className="text-gray-400 text-sm">
              Monitor and manage all system features from one central location
            </p>
          </motion.div>
        </div>

        {/* Back to Admin */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center"
        >
          <Link
            to="/admin/sports-registrations"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default DevPortal;
