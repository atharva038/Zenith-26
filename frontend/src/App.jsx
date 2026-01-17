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
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MediaTeamLogin from "./pages/MediaTeamLogin";
import MediaTeamDashboard from "./pages/MediaTeamDashboard";
import "lenis/dist/lenis.css";
import EventManagement from "./pages/EventManagement";
import SportEventForm from "./pages/SportEventForm";
import EventAnalytics from "./pages/EventAnalytics";
import EventsPage from "./pages/EventsPage";
import EventRegistrationPage from "./pages/EventRegistrationPage";
import UniversalRegistration from "./pages/UniversalRegistration";
import RegisterPage from "./pages/RegisterPage";
import MarathonRegistration from "./pages/MarathonRegistration";
import WomenTournamentPage from "./pages/WomenTournamentPage";
import AdminMarathon from "./pages/AdminMarathon";
import AdminWomenTournament from "./pages/AdminWomenTournament";
import AdminOnSpotRegistration from "./pages/AdminOnSpotRegistration";
import AdminAdmins from "./pages/AdminAdmins";
import AdminGallery from "./pages/AdminGallery";
import AdminSettings from "./pages/AdminSettings";
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

              {/* Public Event Routes */}
              <Route path="/events" element={<EventsPage />} />
              <Route
                path="/events/:eventId"
                element={<EventRegistrationPage />}
              />
              <Route path="/register" element={<RegisterPage />} />

              {/* Universal Registration - Hidden for now */}
              {/* <Route path="/register-sports" element={<UniversalRegistration />} /> */}

              {/* Marathon Routes */}
              <Route path="/marathon-event" element={<MarathonPage />} />
              <Route path="/marathon" element={<MarathonRegistration />} />

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
                path="/admin/onspot-registration"
                element={
                  <ProtectedRoute>
                    <AdminOnSpotRegistration />
                  </ProtectedRoute>
                }
              />
              
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
