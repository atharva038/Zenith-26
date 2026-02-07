import {useState} from "react";
import {Link, useLocation} from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/home" || location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 px-9 py-5 flex justify-between items-center z-[600] bg-black/40 backdrop-blur-md border-b border-[#3a2416]">
      <Link
        to="/home"
        className="text-[#ffb77a] font-bold text-xl tracking-wide"
        style={{textShadow: "0 2px 12px rgba(255,140,40,0.18)"}}
      >
        Zenith 2026
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6">
        {!isHomePage && (
          <Link
            to="/home"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            Home
          </Link>
        )}
        <Link
          to="/sports"
          className={`font-semibold transition-colors ${
            location.pathname === "/sports"
              ? "text-[#ffd4a8] underline decoration-2 underline-offset-4"
              : "text-[#ffb77a] hover:text-[#ffd4a8]"
          }`}
        >
          Sports
        </Link>
        <Link
          to="/team"
          className={`font-semibold transition-colors ${
            location.pathname === "/team"
              ? "text-[#ffd4a8] underline decoration-2 underline-offset-4"
              : "text-[#ffb77a] hover:text-[#ffd4a8]"
          }`}
        >
          Team
        </Link>
        <Link
          to="/gallery"
          className={`font-semibold transition-colors ${
            location.pathname === "/gallery"
              ? "text-[#ffd4a8] underline decoration-2 underline-offset-4"
              : "text-[#ffb77a] hover:text-[#ffd4a8]"
          }`}
        >
          Gallery
        </Link>
        <Link
          to="/register"
          className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
        >
          Register
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-[#ffb77a] z-[700]"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[650] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-black/90 backdrop-blur-xl p-6 z-[700] border-b border-[#3a2416] animate-slideDown md:hidden">
          <div className="flex flex-col gap-4">
            {!isHomePage && (
              <Link
                to="/home"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            )}
            <Link
              to="/sports"
              className={`font-semibold ${
                location.pathname === "/sports"
                  ? "text-[#ffd4a8]"
                  : "text-[#ffb77a]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sports
            </Link>
            <Link
              to="/team"
              className={`font-semibold ${
                location.pathname === "/team"
                  ? "text-[#ffd4a8]"
                  : "text-[#ffb77a]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Team
            </Link>
            <Link
              to="/gallery"
              className={`font-semibold ${
                location.pathname === "/gallery"
                  ? "text-[#ffd4a8]"
                  : "text-[#ffb77a]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/register"
              className="text-[#ffb77a] font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
