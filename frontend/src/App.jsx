import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {AnimatePresence} from "framer-motion";
import {ThemeProvider} from "./context/ThemeContext";
import {AuthProvider} from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CinematicIntro from "./components/CinematicIntro";
import Homepage from "./pages/Homepage";
import ParallaxDemo from "./pages/ParallaxDemo";
import Homepage_ScrollAnimations from "./pages/Homepage_ScrollAnimations";
import GameVerse from "./pages/GameVerse";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<CinematicIntro />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/gameverse" element={<GameVerse />} />
              <Route path="/parallax-demo" element={<ParallaxDemo />} />
              <Route
                path="/scroll-animations"
                element={<Homepage_ScrollAnimations />}
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
