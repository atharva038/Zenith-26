import {createContext, useContext} from "react";

// ==================== BALL TRACKING CONTEXT ====================
// Context for sharing ball position between FootballPlayer and AnimatedCamera
export const BallContext = createContext();

// Custom hook to access ball tracking state
export const useBallTracking = () => useContext(BallContext);
