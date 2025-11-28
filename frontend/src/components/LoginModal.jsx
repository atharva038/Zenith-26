import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    onClose();
    // Student can access without authentication - just navigate to home
    navigate("/home");
  };

  const handleAdminLogin = () => {
    onClose();
    navigate("/admin/login");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[800]"
          />

          {/* Modal */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[900] w-[90%] max-w-md"
          >
            <div className="bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-2xl border-2 border-[#ffb36a] p-8 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
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

              {/* Title */}
              <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]">
                Welcome to Zenith 2026
              </h2>
              <p className="text-center text-gray-400 mb-8">
                Choose your login type
              </p>

              {/* Login Options */}
              <div className="space-y-4">
                {/* Student Login */}
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStudentLogin}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">🎓</span>
                  <span>Student Login</span>
                </Motion.button>

                {/* Admin Login */}
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdminLogin}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] hover:from-[#ffc280] hover:to-[#ffa040] text-[#2c1506] font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/50 flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">🔐</span>
                  <span>Admin Login</span>
                </Motion.button>
              </div>

              {/* Info Text */}
              <p className="text-center text-gray-500 text-sm mt-6">
                Students can browse freely • Admins manage content
              </p>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
