import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CinematicIntro from "./components/CinematicIntro";
import Homepage from "./pages/Homepage";
import GameVerse from "./pages/GameVerse";
import MarathonPage from "./pages/MarathonPage";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMarathon from "./pages/admin/AdminMarathon";
import AdminWomenTournament from "./pages/admin/AdminWomenTournament";
import AdminSportsRegistrations from "./pages/admin/AdminSportsRegistrations";
import AdminOnSpotRegistration from "./pages/admin/AdminOnSpotRegistration";
import AdminAdmins from "./pages/admin/AdminAdmins";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminSettings from "./pages/admin/AdminSettings";

// Media Team
import MediaTeamLogin from "./pages/media-team/MediaTeamLogin";
import MediaTeamDashboard from "./pages/media-team/MediaTeamDashboard";
import "lenis/dist/lenis.css";
import UniversalRegistration from "./pages/UniversalRegistration";
import RegisterPage from "./pages/RegisterPage";
import MarathonRegistration from "./pages/MarathonRegistration";
import MarathonTermsAndConditions from "./pages/MarathonTermsAndConditions";
import WomenTournamentPage from "./pages/WomenTournamentPage";
import TshirtDistribution from "./pages/TshirtDistribution";
import Gallery from "./pages/Gallery";
import MeetOurTeam from "./pages/MeetOurTeam";
import TeamPage from "./pages/TeamPage";
import NotFound from "./pages/NotFound";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import "./App.css";

function App() {
  // Enable smooth scrolling globally
  useSmoothScroll();

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<CinematicIntro />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/gameverse" element={<GameVerse />} />

              {/* Universal Sports Registration */}
              <Route path="/register-sports" element={<UniversalRegistration />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Marathon Routes */}
              <Route path="/marathon-event" element={<MarathonPage />} />
              <Route path="/marathon" element={<MarathonRegistration />} />
              <Route
                path="/marathon/terms-and-conditions"
                element={<MarathonTermsAndConditions />}
              />

              {/* Women's Tournament Route - NEW */}
              <Route
                path="/women-tournament"
                element={<WomenTournamentPage />}
              />

              {/* Gallery Route */}
              <Route path="/gallery" element={<Gallery />} />

              {/* Team Page - Public */}
              <Route path="/team" element={<TeamPage />} />

              {/* Team Management Route - Restricted Access */}
              <Route
                path="/zenith-internal-team-management-2026"
                element={<MeetOurTeam />}
              />

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

              {/* Media Team Routes */}
              <Route path="/media-team/login" element={<MediaTeamLogin />} />
              <Route
                path="/media-team/dashboard"
                element={<MediaTeamDashboard />}
              />
              <Route
                path="/admin/marathon"
                element={
                  <ProtectedRoute>
                    <AdminMarathon />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/women-tournament"
                element={
                  <ProtectedRoute>
                    <AdminWomenTournament />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sports-registrations"
                element={
                  <ProtectedRoute>
                    <AdminSportsRegistrations />
                  </ProtectedRoute>
                }
              />
              {/* 🔒 HIDDEN: On-Spot Registration Route (Tournament Closed) */}
              {/* <Route
                path="/admin/onspot-registration"
                element={
                  <ProtectedRoute>
                    <AdminOnSpotRegistration />
                  </ProtectedRoute>
                }
              /> */}
              
              {/* T-shirt Distribution - Public access for team members */}
              <Route
                path="/tshirt-distribution"
                element={<TshirtDistribution />}
              />
              
              <Route
                path="/admin/admins"
                element={
                  <ProtectedRoute>
                    <AdminAdmins />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/gallery"
                element={
                  <ProtectedRoute>
                    <AdminGallery />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />

              {/* 404 - Catch all unmatched routes */}
              <Route path="*" element={<NotFound />} />
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
