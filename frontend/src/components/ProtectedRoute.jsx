import {Navigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const ProtectedRoute = ({children}) => {
  const {isAuthenticated, loading} = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a18] to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
