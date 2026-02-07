import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

// Inline style for shine animation
const shineKeyframes = `
@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
`;

// All sports data from GameVerse
const sportsData = [
  {
    id: 1,
    name: "FOOTBALL",
    icon: "⚽",
    color: "#16A34A",
    gradient: "from-green-600 to-emerald-500",
    tier: "Premium",
    tagline: "The Beautiful Game",
    description:
      "Experience the thrill of competitive football at ZENITH 2026. Join teams from across the nation in an epic battle for glory on the pitch.",
    date: "February 20-22, 2026",
    venue: "Main Stadium Arena",
    teamSize: "11 vs 11",
    registrationFee: "₹3000 per team",
    rules: [
      "Standard FIFA rules apply",
      "Each match is 20 minutes (10 min per half)",
      "Maximum 15 players per squad",
      "Knockout tournament format",
      "Yellow/Red card suspensions in effect",
    ],
    registrationStatus: "open",
  },
  {
    id: 2,
    name: "BASKETBALL",
    icon: "🏀",
    color: "#F97316",
    gradient: "from-orange-600 to-amber-500",
    tier: "Premium",
    tagline: "Hoop Dreams",
    description:
      "Dribble, shoot, and slam your way to victory in high-energy basketball matches. Show off your court skills and teamwork.",
    date: "February 20-22, 2026",
    venue: "Outdoor Basketball Courts",
    teamSize: "5 vs 5",
    registrationFee: "Men: ₹2500 | Women: ₹1500 per team",
    rules: [
      "4 quarters of 10 minutes each",
      "Shot clock: 24 seconds",
      "FIBA rules apply",
      "Maximum 12 players per squad",
      "Substitutions allowed during stoppages",
    ],
    registrationStatus: "open",
  },
  {
    id: 3,
    name: "CRICKET",
    icon: "🏏",
    color: "#1D4ED8",
    gradient: "from-blue-700 to-sky-500",
    tier: "Premium",
    tagline: "Gentleman's Game",
    description:
      "Step up to the crease and showcase your batting, bowling, and fielding skills in the most exciting cricket tournament of the year.",
    date: "February 20-22, 2026",
    venue: "Cricket Ground",
    teamSize: "11 vs 11",
    registrationFee: "₹6500 per team",
    rules: [
      "T20 format matches",
      "Each team gets 20 overs",
      "Powerplay rules in effect",
      "DRS available for semi-finals onwards",
      "Maximum 16 players per squad",
    ],
    registrationStatus: "open",
  },
  {
    id: 4,
    name: "VOLLEYBALL",
    icon: "🏐",
    color: "#2563EB",
    gradient: "from-blue-600 to-cyan-500",
    tier: "Premium",
    tagline: "Spike It High",
    description:
      "Bump, set, spike! Join the volleyball championship and demonstrate your team coordination and athletic prowess.",
    date: "February 20-22, 2026",
    venue: "Beach Volleyball Arena",
    teamSize: "6 vs 6",
    registrationFee: "Men: ₹2200 | Women: ₹1500 per team",
    rules: [
      "Best of 5 sets (25 points each)",
      "Rally point scoring",
      "Maximum 3 touches per side",
      "Rotation rules enforced",
      "Maximum 14 players per squad",
    ],
    registrationStatus: "open",
  },
  {
    id: 5,
    name: "BADMINTON",
    icon: "🏸",
    color: "#22C55E",
    gradient: "from-green-500 to-lime-400",
    tier: "Popular",
    tagline: "Smash & Win",
    description:
      "Fast-paced rallies and powerful smashes await! Compete in singles and doubles categories to claim the championship.",
    date: "February 20-21, 2026",
    venue: "Indoor Sports Complex",
    teamSize: "Singles/Doubles",
    registrationFee: "Men: ₹500 | Women: ₹400 per player",
    rules: [
      "Best of 3 games (21 points each)",
      "Rally scoring system",
      "Service rules as per BWF",
      "Singles and Doubles categories",
      "Knockout bracket format",
    ],
    registrationStatus: "open",
  },
  {
    id: 6,
    name: "HANDBALL",
    icon: "🤾",
    color: "#DC2626",
    gradient: "from-red-600 to-rose-500",
    tier: "Popular",
    tagline: "Fast & Furious",
    description:
      "High-speed action with quick passes and powerful shots! Showcase your agility and teamwork in this exciting handball tournament.",
    date: "February 20-22, 2026",
    venue: "Indoor Sports Arena",
    teamSize: "7 vs 7",
    registrationFee: "₹1500 per team",
    rules: [
      "IHF rules apply",
      "Two 30-minute halves",
      "No more than 3 steps with ball",
      "Goal area is restricted",
      "Maximum 14 players per squad",
    ],
    registrationStatus: "open",
  },
  {
    id: 7,
    name: "KABADDI",
    icon: "🤼",
    color: "#92400E",
    gradient: "from-amber-800 to-yellow-600",
    tier: "Popular",
    tagline: "Raid & Defend",
    description:
      "Traditional Indian sport combining strength, strategy, and stamina. Raid the opponent's court while holding your breath!",
    date: "February 20-22, 2026",
    venue: "Kabaddi Arena",
    teamSize: "7 vs 7",
    registrationFee: "Men: ₹2200 | Women: ₹1500 per team",
    rules: [
      "Pro Kabaddi League format",
      "Each raid: 30 seconds max",
      "Super tackles and super raids",
      "Best of 3 matches",
      "Maximum 12 players per squad",
    ],
    registrationStatus: "open",
  },
  {
    id: 8,
    name: "CHESS",
    icon: "♟️",
    color: "#1F2937",
    gradient: "from-gray-800 to-slate-600",
    tier: "Popular",
    tagline: "Checkmate Mastery",
    description:
      "Battle of minds! Outthink your opponents in intense chess matches. Strategic thinking and tactical brilliance will reign supreme.",
    date: "February 20-22, 2026",
    venue: "Conference Hall A",
    teamSize: "1 vs 1",
    registrationFee: "₹200 per player (Open to all age groups)",
    rules: [
      "Standard FIDE rules",
      "Time control: 15 min + 10 sec increment",
      "Touch-move rule enforced",
      "Swiss system tournament",
      "Digital boards with live streaming",
    ],
    registrationStatus: "open",
  },
  {
    id: 9,
    name: "TABLE TENNIS",
    icon: "🏓",
    color: "#DC2626",
    gradient: "from-red-600 to-pink-500",
    tier: "Indoor",
    tagline: "Ping Pong Power",
    description:
      "Lightning-fast reflexes meet precision control. Compete in the ultimate table tennis showdown with spin, speed, and strategy.",
    date: "February 20-21, 2026",
    venue: "Indoor Sports Hall",
    teamSize: "Singles/Doubles",
    registrationFee: "₹400 per player",
    rules: [
      "Best of 5 games (11 points each)",
      "Two-point lead required to win",
      "Service alternates every 2 points",
      "ITTF regulations apply",
      "Singles and doubles events",
    ],
    registrationStatus: "open",
  },
  {
    id: 10,
    name: "CARROM",
    icon: "🎯",
    color: "#D6A56F",
    gradient: "from-yellow-700 to-amber-400",
    tier: "Indoor",
    tagline: "Strike & Pocket",
    description:
      "Traditional board game of precision and skill. Pocket the carrom men and the queen to claim victory!",
    date: "February 20-21, 2026",
    venue: "Indoor Gaming Hall",
    teamSize: "Singles/Doubles",
    registrationFee: "₹300 per player",
    rules: [
      "International Carrom Federation rules",
      "Best of 3 boards",
      "25 points to win each board",
      "Queen must be covered",
      "Singles and doubles categories",
    ],
    registrationStatus: "open",
  },
  {
    id: 11,
    name: "ATHLETICS",
    icon: "🏃",
    color: "#B91C1C",
    gradient: "from-red-700 to-orange-600",
    tier: "Indoor",
    tagline: "Track & Field Glory",
    description:
      "Sprint, jump, throw! Compete in various track and field events. Show your athletic excellence across multiple disciplines.",
    date: "February 20-22, 2026",
    venue: "Athletic Stadium",
    teamSize: "Individual",
    registrationFee: "Individual: ₹200 | Team: ₹700",
    rules: [
      "Multiple event categories",
      "World Athletics rules",
      "Electronic timing and measurement",
      "100m, 200m, relay, long jump, javelin",
      "Qualifying rounds and finals",
    ],
    registrationStatus: "open",
  },
  {
    id: 12,
    name: "POWERLIFTING",
    icon: "🏋️",
    color: "#4B5563",
    gradient: "from-gray-700 to-slate-500",
    tier: "Strength",
    tagline: "Strength Supreme",
    description:
      "Lift heavy, lift strong! Compete in squat, bench press, and deadlift. Show your raw power and technique in this ultimate strength competition.",
    date: "February 21-22, 2026",
    venue: "Fitness Arena",
    teamSize: "Individual",
    registrationFee: "₹300 per player",
    rules: [
      "IPF (International Powerlifting Federation) rules",
      "Three attempts per lift",
      "Squat, Bench Press, Deadlift",
      "Weight classes enforced",
      "Professional judging panel",
    ],
    registrationStatus: "open",
  },
];

const SportsGrid = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [filterTier, setFilterTier] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedSport) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedSport]);

  // Memoized filtered sports - only recalculates when dependencies change
  const filteredSports = useMemo(() => {
    return sportsData.filter((sport) => {
      const matchesTier = filterTier === "all" || sport.tier === filterTier;
      const matchesSearch = sport.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesTier && matchesSearch;
    });
  }, [filterTier, searchQuery]);

  // Memoized tiers array - calculated once
  const tiers = useMemo(() => {
    return ["all", ...new Set(sportsData.map((s) => s.tier))];
  }, []);

  // Optimized modal close handler
  const handleCloseModal = useCallback(() => {
    setSelectedSport(null);
  }, []);

  // Optimized sport selection handler
  const handleSportClick = useCallback((sport) => {
    setSelectedSport(sport);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Inject shine animation */}
      <style>{shineKeyframes}</style>
      
      <Navbar />

      {/* Animated background elements - pure CSS, no canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center"
        >
          {/* ZENITH Title */}
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent tracking-tight"
          >
            ZENITH 2026
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-4 font-light"
          >
            Choose Your Sport, Claim Your Glory
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 text-sm text-gray-400"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              12 Sports
            </span>
            <span className="text-gray-600">|</span>
            <span>February 20-22, 2026</span>
            <span className="text-gray-600">|</span>
            <span>SGGSIE&T, Nanded</span>
          </motion.div>

          {/* 🏏 Cricket Featured Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Link to="/register-sports?sport=Cricket">
              <button className="relative px-8 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group">
                {/* Animated shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                <span className="relative flex items-center gap-2">
                  🏏 Cricket Registration - OPEN NOW!
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </button>
            </Link>
            <p className="text-sm text-gray-400 mt-2 text-center">
              Main Sport • Early Registration • Matches Start First
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Search & Filter Bar */}
      <section className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="w-full md:w-96"
            >
              <input
                type="text"
                placeholder="Search sports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </motion.div>

            {/* Tier Filters */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-2 flex-wrap justify-center"
            >
              {tiers.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterTier(tier)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    filterTier === tier
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sports Grid */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredSports.map((sport, index) => (
                <motion.div
                  key={sport.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSportClick(sport)}
                  className="group relative cursor-pointer"
                >
                  {/* Card */}
                  <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2">
                    {/* Tier Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm rounded-full text-gray-400 border border-white/10">
                        {sport.tier}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br ${sport.gradient} flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      {sport.icon}
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-orange-400 group-hover:to-pink-400 transition-all">
                      {sport.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-sm text-gray-400 mb-4">
                      {sport.tagline}
                    </p>

                    {/* Quick Info */}
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">📅</span>
                        <span>{sport.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">👥</span>
                        <span>{sport.teamSize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">💰</span>
                        <span className="truncate">
                          {sport.registrationFee}
                        </span>
                      </div>
                    </div>

                    {/* Hover CTA */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-medium text-sm hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                        View Details →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredSports.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-2xl text-gray-500">
                No sports found matching your criteria
              </p>
              <button
                onClick={() => {
                  setFilterTier("all");
                  setSearchQuery("");
                }}
                className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-full text-white font-medium transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Sport Detail Modal - Redesigned Compact */}
      <AnimatePresence>
        {selectedSport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[1000] flex items-center justify-center p-6 md:p-8"
            style={{ overflow: 'hidden', touchAction: 'none' }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl shadow-orange-500/10 overflow-hidden flex flex-col"
            >
              {/* Compact Header with Sport Icon & Name */}
              <div
                className={`relative bg-gradient-to-r ${selectedSport.gradient} px-6 py-6`}
              >
                {/* Close Button - Inside header, top-right */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-30 w-9 h-9 bg-red-600/90 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110 active:scale-95"
                >
                  <span className="text-lg font-bold leading-none">✕</span>
                </button>

                <div className="flex items-center gap-4 pr-12">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                    {selectedSport.icon}
                  </div>
                  {/* Name & Tagline */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-white truncate">
                      {selectedSport.name}
                    </h2>
                    <p className="text-sm text-white/80 truncate">
                      {selectedSport.tagline}
                    </p>
                  </div>
                  {/* Tier Badge */}
                  <span className="px-3 py-1.5 text-xs font-semibold bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/30 flex-shrink-0">
                    {selectedSport.tier}
                  </span>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ overscrollBehavior: 'contain' }}>
                <div className="p-6 md:p-7 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-orange-500">📋</span> About
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {selectedSport.description}
                    </p>
                  </div>

                  {/* Quick Info Grid - Compact */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <p className="text-xs text-gray-500 mb-1.5">📅 Date</p>
                      <p className="text-sm text-white font-semibold">
                        {selectedSport.date}
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <p className="text-xs text-gray-500 mb-1.5">📍 Venue</p>
                      <p className="text-sm text-white font-semibold truncate">
                        {selectedSport.venue}
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <p className="text-xs text-gray-500 mb-1.5">👥 Team Size</p>
                      <p className="text-sm text-white font-semibold">
                        {selectedSport.teamSize}
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <p className="text-xs text-gray-500 mb-1.5">💰 Fee</p>
                      <p className="text-sm text-white font-semibold truncate">
                        {selectedSport.registrationFee}
                      </p>
                    </div>
                  </div>

                  {/* Rules - Compact List */}
                  <div>
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-orange-500">📜</span> Rules & Regulations
                    </h3>
                    <ul className="space-y-2.5">
                      {selectedSport.rules.map((rule, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2.5 text-sm text-gray-400"
                        >
                          <span className="text-orange-500 mt-0.5 flex-shrink-0 text-xs">▪</span>
                          <span className="leading-relaxed">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Fixed Footer with CTA */}
              <div className="border-t border-white/10 bg-gradient-to-t from-black/80 to-transparent p-5 md:p-6">
                <Link
                  to="/register-sports"
                  state={{ 
                    preselectedSport: selectedSport.name,
                    sportId: selectedSport.id,
                    fromSportsGrid: true 
                  }}
                  className="block w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl text-white font-bold text-center text-base shadow-lg shadow-orange-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Register for {selectedSport.name} →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.8);
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default SportsGrid;
