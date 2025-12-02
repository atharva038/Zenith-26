const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "zenithapp-5onhx.ondigitalocean.app" // Replace with your actual DigitalOcean URL
    : "http://localhost:5000";

export default API_BASE_URL;
