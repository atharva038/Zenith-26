import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {AnimatePresence} from "framer-motion";
import {ThemeProvider} from "./context/ThemeContext";
import StadiumIntro from "./components/StadiumIntro";
import Homepage from "./pages/Homepage";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<StadiumIntro />} />
            <Route path="/home" element={<Homepage />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
}

export default App;
