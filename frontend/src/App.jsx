import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {AnimatePresence} from "framer-motion";
import {ThemeProvider} from "./context/ThemeContext";
import CinematicIntro from "./components/CinematicIntro";
import Homepage from "./pages/Homepage";
import ParallaxDemo from "./pages/ParallaxDemo";
import Homepage_ScrollAnimations from "./pages/Homepage_ScrollAnimations";
import GameVerse from "./pages/GameVerse";
import Glimpses from "./pages/Glimpses";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { getToken } from "./services/api";
import "./App.css";

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<CinematicIntro />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/gameverse" element={<GameVerse />} />
            <Route path="/glimpses" element={<Glimpses />} />
            <Route path="/parallax-demo" element={<ParallaxDemo />} />
            <Route
              path="/scroll-animations"
              element={<Homepage_ScrollAnimations />}
            />
            <Route path="/admin/login" element={<AdminLogin />} />
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
    </ThemeProvider>
  );
}

export default App;
