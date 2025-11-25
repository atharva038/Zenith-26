import { useState } from "react";
import { motion } from "framer-motion";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Animated Background Component
const AnimatedBackground = ({theme}) => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <motion.div
      className={`absolute inset-0 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
      animate={
        theme === "dark"
          ? {
              background: [
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
                "linear-gradient(135deg, #0f172a 0%, #831843 50%, #0f172a 100%)",
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
              ],
            }
          : {
              background: [
                "linear-gradient(135deg, #eff6ff 0%, #fae8ff 50%, #fce7f3 100%)",
                "linear-gradient(135deg, #fce7f3 0%, #eff6ff 50%, #fae8ff 100%)",
                "linear-gradient(135deg, #eff6ff 0%, #fae8ff 50%, #fce7f3 100%)",
              ],
            }
      }
      transition={{duration: 10, repeat: Infinity, ease: "linear"}}
    />
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute w-1 h-1 ${
          theme === "dark" ? "bg-blue-400" : "bg-blue-400"
        } rounded-full`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{y: [0, -30, 0], opacity: [0, 1, 0], scale: [0, 1.5, 0]}}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@zenith2026.com");
  const [password, setPassword] = useState("Admin@2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {theme, toggleTheme} = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(email, password);

      if (response.success) {
        // Navigate to admin panel
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.8}}
      className={`relative min-h-screen ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-white text-gray-900"
      } flex items-center justify-center p-4`}
    >
      <AnimatedBackground theme={theme} />
      
      {/* Theme Toggle Button */}
      <motion.button
        initial={{opacity: 0, scale: 0.8}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.5, delay: 0.3}}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-4 rounded-full ${
          theme === "dark"
            ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
            : "bg-gradient-to-br from-orange-400 to-pink-400 text-white"
        } shadow-lg hover:scale-110 transition-transform duration-300`}
        whileHover={{rotate: 180}}
        whileTap={{scale: 0.9}}
      >
        {theme === "dark" ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className={`backdrop-blur-lg rounded-2xl p-8 shadow-2xl border-2 ${
          theme === "dark" 
            ? "bg-slate-900/50 border-slate-700" 
            : "bg-white/70 border-gray-200"
        }`}>
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`font-orbitron text-4xl font-bold text-transparent bg-clip-text mb-2 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500"
                  : "bg-gradient-to-r from-orange-500 via-blue-600 to-pink-600"
              }`}
            >
              ZENITH 2026
            </motion.h1>
            <p className={`font-rajdhani text-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>Admin Panel</p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6"
            >
              <p className="font-rajdhani">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className={`block font-rajdhani text-sm font-semibold mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={`w-full px-4 py-3 border rounded-lg font-rajdhani focus:outline-none transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                }`}
                placeholder="admin@zenith2026.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block font-rajdhani text-sm font-semibold mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className={`w-full px-4 py-3 border rounded-lg font-rajdhani focus:outline-none transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                }`}
                placeholder="Enter your password"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`w-full font-rajdhani font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === "dark"
                  ? "bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className={`font-rajdhani text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              Protected by JWT Authentication 🔒
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <motion.a
            href="/home"
            whileHover={{ scale: 1.05 }}
            className={`font-rajdhani transition-colors ${
              theme === "dark" 
                ? "text-blue-400 hover:text-blue-300" 
                : "text-blue-600 hover:text-blue-500"
            }`}
          >
            ← Back to Homepage
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
