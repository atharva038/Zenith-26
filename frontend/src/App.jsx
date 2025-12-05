import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {AnimatePresence} from "framer-motion";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ThemeProvider} from "./context/ThemeContext";
import {AuthProvider} from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CinematicIntro from "./components/CinematicIntro";
import Homepage from "./pages/Homepage";
import ParallaxDemo from "./pages/ParallaxDemo";
import Homepage_ScrollAnimations from "./pages/Homepage_ScrollAnimations";
import GameVerse from "./pages/GameVerse";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import EventManagement from "./pages/EventManagement";
import SportEventForm from "./pages/SportEventForm";
import EventAnalytics from "./pages/EventAnalytics";
import EventsPage from "./pages/EventsPage";
import EventRegistrationPage from "./pages/EventRegistrationPage";
import UniversalRegistration from "./pages/UniversalRegistration";
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

              {/* Public Event Routes */}
              <Route path="/events" element={<EventsPage />} />
              <Route
                path="/events/:eventId"
                element={<EventRegistrationPage />}
              />
              <Route path="/register" element={<UniversalRegistration />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute>
                    <EventManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/create"
                element={
                  <ProtectedRoute>
                    <SportEventForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:eventId/edit"
                element={
                  <ProtectedRoute>
                    <SportEventForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:eventId/analytics"
                element={
                  <ProtectedRoute>
                    <EventAnalytics />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
