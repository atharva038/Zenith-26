import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const MarathonRegistration = () => {
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);

  const GOOGLE_FORM_URL = "https://forms.gle/DeT25fzZWWyKHZ317";
  const MARATHON_DATE = "01 Nov 2026";
  const ROUTE_FULL = "SP Office → Shivajinagar → ITI Corner → Workshop Corner → Bhagyanagar → Anandnagar → Nagarjuna Hotel";

  const routeCheckpoints = [
    { title: "SP Office", tag: "Start Point", isStart: true },
    { title: "Shivajinagar", tag: "Checkpoint 1" },
    { title: "ITI Corner", tag: "Checkpoint 2" },
    { title: "Workshop Corner", tag: "Checkpoint 3" },
    { title: "Bhagyanagar", tag: "Checkpoint 4" },
    { title: "Anandnagar", tag: "Checkpoint 5" },
    { title: "Nagarjuna Hotel", tag: "Finish Line", isFinish: true },
  ];

  const contacts = [
    {
      name: "1. Kanwalpreet Singh",
      role: "Marathon Head",
      phone: "9561922066",
      displayPhone: "+91 9561922066",
    },
    {
      name: "Amarja Dhepe",
      role: "Sports Secretary",
      phone: "9552110021",
      displayPhone: "+91 9552110021",
    },
  ];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const copyToClipboard = (text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      toast.success("Google Form link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-xl border-b border-orange-500/20 shadow-lg shadow-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 group">
            <span className="text-2xl transform group-hover:scale-110 transition-transform">🏃</span>
            <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500">
              ZENITH MARATHON 2026-27
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/home"
              className="text-gray-300 hover:text-orange-400 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/marathon-event"
              className="text-gray-300 hover:text-orange-400 text-sm font-medium transition-colors"
            >
              Event Details
            </Link>
            <Link
              to="/register"
              className="text-gray-300 hover:text-orange-400 text-sm font-medium transition-colors"
            >
              Sports Registration
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/marathon-event"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-orange-300 text-sm border border-orange-500/30 hover:bg-orange-500/15 hover:border-orange-500/60 transition-all"
            >
              <span>←</span> Back to Event
            </Link>
            <Link
              to="/home"
              className="px-4 py-2 rounded-full font-bold text-sm text-black bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>REGISTRATIONS NOW LIVE</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#ffcf87] via-[#ff8b1f] to-[#ff5722] tracking-tight"
            >
              🏃 Zenith Marathon 2026-27
            </motion.h1>

            <p className="text-orange-200/90 text-base sm:text-lg max-w-2xl mx-auto">
              Join us for an unforgettable running experience through the heart of Nanded!
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2">
              <div className="px-4 py-2 bg-zinc-900/80 border border-orange-500/30 rounded-xl shadow-md">
                <span className="text-white/60 text-xs uppercase block">Date</span>
                <span className="text-orange-400 font-bold text-base sm:text-lg">01 Nov 2026</span>
              </div>
              <div className="px-4 py-2 bg-zinc-900/80 border border-orange-500/30 rounded-xl shadow-md">
                <span className="text-white/60 text-xs uppercase block">Distance</span>
                <span className="text-white font-bold text-base sm:text-lg">5 KM Run</span>
              </div>
              <div className="px-4 py-2 bg-zinc-900/80 border border-orange-500/30 rounded-xl shadow-md">
                <span className="text-white/60 text-xs uppercase block">Entry Fee</span>
                <span className="text-amber-400 font-bold text-base sm:text-lg">₹99</span>
              </div>
              <div className="px-4 py-2 bg-zinc-900/80 border border-orange-500/30 rounded-xl shadow-md">
                <span className="text-white/60 text-xs uppercase block">Start Point</span>
                <span className="text-white font-bold text-base sm:text-lg">SP Office</span>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-b from-zinc-900/90 via-black/95 to-zinc-950/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-orange-500/30 shadow-2xl shadow-orange-500/10 space-y-8"
          >
            {/* Primary Google Form Registration Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-orange-950/40 border-2 border-orange-500/40 p-6 sm:p-8 text-center space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-black shadow-lg shadow-orange-500/30 mb-1">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  Official Registration via Google Form
                </h2>
                <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
                  Click the button below to register online for the Zenith 2026-27 Marathon. Submit your runner details and payment confirmation through the Google Form.
                </p>
              </div>

              {/* Big CTA Button */}
              <div className="pt-2">
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base sm:text-lg font-bold text-black rounded-xl transition-all duration-300 shadow-xl shadow-orange-500/40 hover:shadow-orange-500/70 hover:scale-[1.03] active:scale-[0.98] group"
                  style={{
                    background: "linear-gradient(90deg, #ffb36a 0%, #ff8b1f 50%, #ea580c 100%)",
                  }}
                >
                  <span>Register Now (Google Form)</span>
                  <span className="text-xl transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform">↗</span>
                </a>
              </div>

              {/* URL Display Box */}
              <div className="pt-3 max-w-lg mx-auto">
                <div className="flex items-center justify-between gap-2 bg-black/60 border border-orange-500/25 rounded-xl px-4 py-2.5">
                  <span className="text-xs sm:text-sm text-orange-300/90 font-mono truncate select-all">
                    {GOOGLE_FORM_URL}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(GOOGLE_FORM_URL)}
                    className="shrink-0 px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {copiedLink ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            {/* Official Route Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🗺️</span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Official Marathon Route</h3>
                    <p className="text-xs text-orange-400 font-medium">5 KM Course through Nanded</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs text-orange-300 font-semibold">
                  7 Checkpoints
                </span>
              </div>

              {/* Full Route Banner */}
              <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/30 rounded-xl p-4">
                <div className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-1">
                  Full Route Path:
                </div>
                <div className="text-sm sm:text-base font-semibold text-white tracking-wide leading-relaxed">
                  {ROUTE_FULL}
                </div>
              </div>

              {/* Route checkpoints progression */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {routeCheckpoints.map((cp, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl p-3.5 border transition-all ${
                      cp.isStart
                        ? "bg-emerald-950/30 border-emerald-500/40 shadow-sm shadow-emerald-500/10"
                        : cp.isFinish
                        ? "bg-red-950/30 border-red-500/40 shadow-sm shadow-red-500/10"
                        : "bg-white/[0.03] border-white/10 hover:border-orange-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center text-xs font-bold font-mono">
                        {idx + 1}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          cp.isStart
                            ? "bg-emerald-500/20 text-emerald-300"
                            : cp.isFinish
                            ? "bg-red-500/20 text-red-300"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {cp.tag}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm sm:text-base">
                      {cp.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Coordinators Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="text-2xl">📞</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Event Contacts & Support</h3>
                  <p className="text-xs text-gray-400">Reach out to the coordinators for any help or queries</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="bg-black/50 border border-orange-500/25 rounded-2xl p-5 hover:border-orange-500/50 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30">
                          {contact.role}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white mt-1">
                        {contact.name}
                      </h4>
                      <p className="text-orange-300 font-mono text-base font-semibold mt-0.5">
                        {contact.displayPhone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 font-semibold text-xs sm:text-sm transition-all"
                      >
                        <span>📞 Call</span>
                      </a>
                      <a
                        href={`https://wa.me/91${contact.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs sm:text-sm transition-all"
                      >
                        <span>💬 WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Perks / Inclusions */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
                Runner Inclusions & Highlights
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="text-xl mb-1">🏅</div>
                  <div className="text-xs font-semibold text-white">Medals for Winners</div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="text-xl mb-1">👕</div>
                  <div className="text-xs font-semibold text-white">Official T-Shirt</div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="text-xl mb-1">📜</div>
                  <div className="text-xs font-semibold text-white">E-Certificate</div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="text-xl mb-1">💵</div>
                  <div className="text-xs font-semibold text-white">Cash Prizes (Top 3)</div>
                </div>
              </div>
            </div>

            {/* Action Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 text-center font-bold text-white rounded-xl transition-all text-sm sm:text-base shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                style={{
                  background: "linear-gradient(90deg, #ff8b1f, #ea580c)",
                }}
              >
                Register via Google Form ↗
              </a>
              <button
                type="button"
                onClick={() => navigate("/marathon-event")}
                className="flex-1 py-3.5 px-4 font-semibold rounded-xl transition-all text-sm sm:text-base text-orange-300 bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20"
              >
                View Event Details
              </button>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="flex-1 py-3.5 px-4 font-semibold rounded-xl transition-all text-sm sm:text-base text-white bg-white/5 border border-white/15 hover:bg-white/10"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarathonRegistration;
