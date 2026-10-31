import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RegistrationClosed = ({ message, startDate, endDate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/home" className="flex items-center gap-3">
            <img
              src="/zenith-logo.svg"
              alt="Zenith"
              className="h-10 w-10 md:h-12 md:w-12"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="text-white font-bold text-xl md:text-2xl">
              ZENITH <span className="text-purple-400">'26</span>
            </span>
          </Link>
          <Link
            to="/home"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <span className="text-6xl">🎉</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Event
            </span>
            <br />
            <span className="text-white/90">Ended!</span>
          </h1>

          {/* Message */}
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            {message || "Thank you for participating in ZENITH 2026! We hope you had an amazing experience. See you next year!"}
          </p>

          {/* Dates Display */}
          {(startDate || endDate) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex flex-col sm:flex-row items-center gap-4 mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20"
            >
              {startDate && (
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-1">Opens On</p>
                  <p className="text-white font-semibold">
                    {new Date(startDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}

              {startDate && endDate && (
                <div className="text-purple-400 text-2xl">→</div>
              )}

              {endDate && (
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-1">Closes On</p>
                  <p className="text-white font-semibold">
                    {new Date(endDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Event Ended Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30 mb-8"
          >
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-300 text-sm font-medium">
              Thank you for an amazing event! 🙏
            </span>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/home"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg shadow-green-500/25"
            >
              ← Back to Home
            </Link>
            <Link
              to="/sports"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold text-white transition-all transform hover:scale-105 border border-white/20"
            >
              View Past Events
            </Link>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50"
          >
            <p className="text-gray-400 text-sm leading-relaxed">
              � Thanks for making ZENITH 2026 memorable! Stay connected with us for updates on next year's events and announcements.
              <br />
              We'll notify you as soon as registration opens!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationClosed;
