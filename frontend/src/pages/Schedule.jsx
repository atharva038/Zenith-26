import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Schedule = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Animated Calendar Icon */}
          {/* <motion.div
            className="text-9xl mb-8"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            
          </motion.div> */}

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl font-black mb-6"
            style={{
              background:
                "linear-gradient(135deg, #ffb36a 0%, #ff8b1f 50%, #ffb36a 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(255,179,106,0.6))",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Event Schedule
          </motion.h1>

          {/* Coming Soon Text */}
          <motion.div
            className="mb-12"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <p className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
              COMING SOON
            </p>
            <p className="text-xl md:text-2xl text-gray-300 mb-3">
              The complete event schedule will be announced soon!
            </p>
            <p className="text-base md:text-lg text-gray-400">
              Stay tuned for updates on match timings, venues, and more
            </p>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="flex justify-center gap-3 mb-8"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-[#ffb36a]"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </motion.div>

          {/* Back to Home Button */}
          <Link to="/home">
            <motion.button
              className="px-8 py-4 text-lg font-bold
                        bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]
                        text-black rounded-xl
                        hover:scale-105 transition-transform duration-300
                        shadow-lg shadow-[#ffb36a]/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </Link>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
            >
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="text-xl font-bold text-[#ffb36a] mb-2">
                Match Timings
              </h3>
              <p className="text-gray-400 text-sm">
                Detailed schedule with match timings coming soon
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
            >
              <div className="text-4xl mb-3">📍</div>
              <h3 className="text-xl font-bold text-[#ffb36a] mb-2">
                Venue Details
              </h3>
              <p className="text-gray-400 text-sm">
                Location and venue information for each sport
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
            >
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold text-[#ffb36a] mb-2">
                Tournament Format
              </h3>
              <p className="text-gray-400 text-sm">
                Competition format and knockout rounds structure
              </p>
            </motion.div>
          </div>

          {/* Event Dates Teaser */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/30"
          >
            <p className="text-gray-300 text-lg">
              <span className="font-bold text-[#ffb36a]">ZENITH 2026</span> - The biggest sports fest of the year
            </p>
            <p className="text-gray-400 mt-2">
              📅 <span className="font-semibold text-white">20th - 22nd February 2026</span>
            </p>
            <p className="text-gray-400 mt-1">
              Multiple sports • Exciting prizes • Unforgettable experience
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Schedule;
