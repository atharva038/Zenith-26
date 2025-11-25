import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import StadiumIntro from "./components/StadiumIntro";
import Homepage from "./pages/Homepage";
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
            <Route path="/" element={<StadiumIntro />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/glimpses" element={<Glimpses />} />
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
