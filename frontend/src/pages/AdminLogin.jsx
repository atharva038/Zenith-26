import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import api from "../config/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);

      if (response.data.success) {
        // Store token and admin data
        localStorage.setItem("adminToken", response.data.data.token);
        localStorage.setItem(
          "adminData",
          JSON.stringify(response.data.data.admin)
        );

        // Navigate to dashboard
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a18] to-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-neon-blue/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-orange/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8}}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <Link to="/home">
            <motion.h1
              className="text-5xl font-bold font-orbitron bg-gradient-to-r from-neon-blue via-electric-cyan to-neon-orange bg-clip-text text-transparent mb-2"
              whileHover={{scale: 1.05}}
            >
              ZENITH 2026
            </motion.h1>
          </Link>
          <p className="text-gray-400 text-sm">Admin Portal</p>
        </div>

        {/* Login Card */}
        <motion.div
          className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-neon-blue/20"
          whileHover={{boxShadow: "0 0 30px rgba(0, 212, 255, 0.3)"}}
        >
          <h2 className="text-3xl font-bold text-white mb-2 font-rajdhani">
            Admin Login
          </h2>
          <p className="text-gray-400 mb-6">
            Sign in to access the admin dashboard
          </p>

          {error && (
            <motion.div
              initial={{opacity: 0, x: -10}}
              animate={{opacity: 1, x: 0}}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-300 mb-2 font-rajdhani"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/50 border border-neon-blue/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all"
                placeholder="admin@zenith2026.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-300 mb-2 font-rajdhani"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/50 border border-neon-blue/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{scale: 1.02}}
              whileTap={{scale: 0.98}}
              className="w-full py-3 bg-gradient-to-r from-neon-blue to-electric-cyan text-white font-bold rounded-lg shadow-lg hover:shadow-neon-blue/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-rajdhani text-lg"
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <Link
              to="/home"
              className="block text-center text-gray-400 hover:text-neon-orange transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2026 Zenith. Secure Admin Access.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
