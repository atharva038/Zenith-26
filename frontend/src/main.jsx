import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Suppress React DevTools semver errors
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("Invalid argument not valid semver")
  ) {
    // Silently ignore DevTools semver errors
    return;
  }
  originalError.apply(console, args);
};

createRoot(document.getElementById("root")).render(<App />);
