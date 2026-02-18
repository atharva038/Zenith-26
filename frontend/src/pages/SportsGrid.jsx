import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useRegistrationStatus } from "../hooks/useRegistrationStatus";
import RegistrationClosed from "../components/RegistrationClosed";
import PageLikePoll from "../components/PageLikePoll";

// Enhanced keyframes for premium animations
const premiumKeyframes = `
@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

@keyframes neonGlow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(234, 179, 8, 0.3), 
                0 0 40px rgba(234, 179, 8, 0.2), 
                0 0 60px rgba(234, 179, 8, 0.1),
                inset 0 0 20px rgba(234, 179, 8, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(234, 179, 8, 0.5), 
                0 0 60px rgba(234, 179, 8, 0.3), 
                0 0 90px rgba(234, 179, 8, 0.2),
                inset 0 0 30px rgba(234, 179, 8, 0.15);
  }
}

@keyframes cardGlow {
  0%, 100% { 
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 
                0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  50% { 
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 
                0 0 0 1px rgba(255, 255, 255, 0.1),
                0 0 40px var(--glow-color, rgba(234, 179, 8, 0.3));
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

@keyframes pulse-border {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
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
    premiumGradient: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
    glowColor: "rgba(34, 197, 94, 0.4)",
    statusBadge: "OPEN",
    statusIcon: "🔥",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888310/zenith-26/sports/zenith-26/sports/football.jpg",
    tier: "Premium",
    tagline: "The Beautiful Game",
    description:
      "Experience the thrill of competitive football at ZENITH 2026. Join teams from across the nation in an epic battle for glory on the pitch.",
    date: "February 20-22, 2026",
    venue: "Main Stadium Arena",
    teamSize: "Boys only - Maximum 16 players",
    registrationFee: "₹3000 per team",
    rules: [
      "FIFA rules applicable",
      "Standard kit required",
      "20 minutes early reporting",
      "Disqualification if absent",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Rohan Pundkare", contact: "7249886133" },
      { name: "Srujan Pal", contact: "8788766970" },
    ],
    coordinators: [
      { name: "Rohan Pundkare", phone: "7249886133" },
      { name: "Srujan Pal", phone: "8788766970" },
    ],
    registrationStatus: "open",
  },
  {
    id: 2,
    name: "BASKETBALL (5X5)",
    icon: "🏀",
    color: "#F97316",
    gradient: "from-orange-600 to-amber-500",
    premiumGradient: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)",
    glowColor: "rgba(249, 115, 22, 0.4)",
    statusBadge: "OPEN",
    statusIcon: "🔥",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888299/zenith-26/sports/zenith-26/sports/basketball.jpg",
    tier: "Premium",
    tagline: "Hoop Dreams",
    description:
      "Dribble, shoot, and slam your way to victory in high-energy basketball matches. Show off your court skills and teamwork.",
    date: "February 20-22, 2026",
    venue: "Outdoor Basketball Courts",
    teamSize: "Both (Men & Women) - 5 vs 5, Maximum 12 players per team",
    registrationFee: "Men: ₹2500 | Women: ₹1500 per team",
    rules: [
      "SPPU rules applicable",
      "20 minutes early reporting compulsory",
      "Disqualification if absent",
      "Player ID verification decision final",
      "Age limit: 25 years",
      "Maximum 12 players per team",
    ],
    coordinators: [
      { name: "Uday Naukarkar", contact: "9322684201" },
      { name: "Krushna Jadhav", contact: "8208422959" },
    ],
    coordinators: [
      { name: "Uday Naukarkar", phone: "9322684201" },
      { name: "Krushna Jadhav", phone: "8208422959" },
    ],
    registrationStatus: "open",
  },
  {
    id: 3,
    name: "CRICKET",
    icon: "🏏",
    color: "#1D4ED8",
    gradient: "from-blue-700 to-sky-500",
    premiumGradient: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)",
    glowColor: "rgba(37, 99, 235, 0.4)",
    statusBadge: "POPULAR",
    statusIcon: "⭐",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888308/zenith-26/sports/zenith-26/sports/cricket.jpg",
    tier: "Premium",
    tagline: "Gentleman's Game",
    description:
      "Step up to the crease and showcase your batting, bowling, and fielding skills in the most exciting cricket tournament of the year.",
    date: "February 16-19, 2026",
    venue: "Cricket Ground",
    teamSize: "Boys only - 11 playing players",
    registrationFee: "₹6500 per team (Men)",
    rules: [
      "T20 format matches",
      "Each team gets 20 overs",
      "Powerplay rules in effect",
      "Maximum 16 players per squad",
    ],
    coordinators: [
      { name: "Pranav Godle", phone: "9028783635" },
      { name: "Shahaji Bhosle", phone: "8308949481" },
    ],
    registrationStatus: "open",
  },
  {
    id: 4,
    name: "VOLLEYBALL",
    icon: "🏐",
    color: "#2563EB",
    gradient: "from-blue-600 to-cyan-500",
    premiumGradient: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #06b6d4 100%)",
    glowColor: "rgba(6, 182, 212, 0.4)",
    statusBadge: "OPEN",
    statusIcon: "🔥",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888390/zenith-26/sports/zenith-26/sports/volleyball.jpg",
    tier: "Premium",
    tagline: "Spike It High",
    description:
      "Bump, set, spike! Join the volleyball championship and demonstrate your team coordination and athletic prowess.",
    date: "February 20-22, 2026",
    venue: "Beach Volleyball Arena",
    teamSize: "Both (Men & Women) - 6 playing players, Maximum 12 per team",
    registrationFee: "Men: ₹2200 | Women: ₹1500 per team",
    rules: [
      "Best of 3 sets (25, 25, 15 points)",
      "FIVB rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
      "Maximum 12 players per team",
    ],
    coordinators: [
      { name: "Maitreyi Bhumbar", contact: "8788183714" },
      { name: "Harsh Marodkar", contact: "8208016898" },
    ],
    coordinators: [
      { name: "Maitreyi Bhumbar", phone: "8788183714" },
      { name: "Harsh Marodkar", phone: "8208016898" },
    ],
    registrationStatus: "open",
  },
  {
    id: 5,
    name: "BADMINTON",
    icon: "🏸",
    color: "#22C55E",
    gradient: "from-green-500 to-lime-400",
    premiumGradient: "linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #84cc16 100%)",
    glowColor: "rgba(132, 204, 22, 0.4)",
    statusBadge: "OPEN",
    statusIcon: "⚡",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888297/zenith-26/sports/zenith-26/sports/badminton.jpg",
    tier: "Popular",
    tagline: "Smash & Win",
    description:
      "Fast-paced rallies and powerful smashes await! Choose from Boys, Girls, or Mixed team categories.",
    date: "February 20-21, 2026",
    venue: "Indoor Sports Complex",
    teamSize: "Boys Team: 5 players | Girls Team: 5 players | Mixed Team: 2 players (1 Boy + 1 Girl)",
    registrationFee: "Boys: ₹1000 | Girls: ₹800 | Mixed: ₹600",
    rules: [
      "Three team categories available",
      "Boys Team: 5 players - ₹1000",
      "Girls Team: 5 players - ₹800",
      "Mixed Team: 2 players (1 boy + 1 girl) - ₹600",
      "Best of 3 games (15 points each)",
      "Bring own kit",
      "SPPU rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Harsh Keshkar", contact: "8010529661" },
      { name: "Aditi Phulare", contact: "8669995909" },
    ],
    coordinators: [
      { name: "Harsh Keshkar", phone: "8010529661" },
      { name: "Aditi Phulare", phone: "8669995909" },
    ],
    registrationStatus: "open",
  },
  {
    id: 6,
    name: "HANDBALL",
    icon: "🤾",
    color: "#DC2626",
    gradient: "from-red-600 to-rose-500",
    premiumGradient: "linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #f43f5e 100%)",
    glowColor: "rgba(244, 63, 94, 0.4)",
    statusBadge: "OPEN",
    statusIcon: "🔥",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888318/zenith-26/sports/zenith-26/sports/handball.jpg",
    tier: "Popular",
    tagline: "Fast & Furious",
    description:
      "High-speed action with quick passes and powerful shots! Showcase your agility and teamwork in this exciting handball tournament.",
    date: "February 20-22, 2026",
    venue: "Indoor Sports Arena",
    teamSize: "Boys only - Minimum 9, Maximum 16 players",
    registrationFee: "₹1500 per team",
    rules: [
      "25-minute match (10+10 minutes halves, 5-minute break)",
      "Rolling substitutions allowed",
      "20 minutes early reporting",
      "Disqualification if absent",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Aditya Joshi", phone: "7820939780" },
      { name: "Amarja Dhepe", phone: "9552110021" },
    ],
    registrationStatus: "open",
  },
  {
    id: 7,
    name: "KABADDI",
    icon: "🤼",
    color: "#92400E",
    gradient: "from-amber-800 to-yellow-600",
    premiumGradient: "linear-gradient(135deg, #78350f 0%, #92400e 50%, #ca8a04 100%)",
    glowColor: "rgba(202, 138, 4, 0.4)",
    statusBadge: "POPULAR",
    statusIcon: "⭐",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888338/zenith-26/sports/zenith-26/sports/kabaddi.jpg",
    tier: "Popular",
    tagline: "Raid & Defend",
    description:
      "Traditional Indian sport combining strength, strategy, and stamina. Raid the opponent's court while holding your breath!",
    date: "February 20-22, 2026",
    venue: "Kabaddi Arena",
    teamSize: "Both (Men & Women) - Maximum 12 players per team",
    registrationFee: "Men: ₹2200 | Women: ₹1500 per team",
    rules: [
      "Two halves of 15 minutes",
      "Weight limit: Up to 80 kg",
      "Played on mat",
      "Kabaddi Federation rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Shubham Kale", contact: "7378409793" },
      { name: "Sonam Chandel", contact: "8329513257" },
      { name: "Chetan Bante", contact: "8263945881" },
    ],
    coordinators: [
      { name: "Shubham Kale", phone: "7378409793" },
      { name: "Sonam Chandel", phone: "8329513257" },
      { name: "Chetan Bante", phone: "8263945881" },
    ],
    registrationStatus: "open",
  },
  {
    id: 8,
    name: "CHESS",
    icon: "♟️",
    color: "#1F2937",
    gradient: "from-gray-800 to-slate-600",
    premiumGradient: "linear-gradient(135deg, #111827 0%, #1f2937 50%, #475569 100%)",
    glowColor: "rgba(148, 163, 184, 0.4)",
    statusBadge: "OPEN",
    statusIcon: "🧠",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888307/zenith-26/sports/zenith-26/sports/chess.jpg",
    tier: "Popular",
    tagline: "Checkmate Mastery",
    description:
      "Battle of minds! Outthink your opponents in intense chess matches. Strategic thinking and tactical brilliance will reign supreme.",
    date: "February 20-22, 2026",
    venue: "Conference Hall A",
    teamSize: "Mixed - Team (4 players) & Solo",
    registrationFee: "Team: ₹500 | Solo: ₹200",
    rules: [
      "Team & Individual events (mixed)",
      "Team: 4 players per team",
      "Solo: Individual competition",
      "FIDE & Swiss system rules",
      "No electronic devices",
      "Bring own chess clock",
      "20 minutes early reporting",
    ],
    coordinators: [
      { name: "Sarthak Rahut", phone: "8788380729" },
      { name: "Akshit Tupkar", phone: "7028455126" },
    ],
    registrationStatus: "open",
  },
  {
    id: 9,
    name: "RINK FOOTBALL",
    icon: "⚽",
    color: "#16A34A",
    gradient: "from-green-500 to-emerald-400",
    premiumGradient: "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #10b981 100%)",
    glowColor: "rgba(16, 185, 129, 0.4)",
    statusBadge: "OPEN",
    statusIcon: "🔥",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888349/zenith-26/sports/zenith-26/sports/rinkFootball.jpg",
    tier: "Indoor",
    tagline: "Fast-Paced Football",
    description:
      "Experience football in an enclosed arena! Fast-paced, high-intensity matches with quick turnarounds and non-stop action.",
    date: "February 20-21, 2026",
    venue: "Indoor Sports Arena",
    teamSize: "Both (Men & Women) - Boys: 6 playing | Girls: 7 playing, Max 10",
    registrationFee: "Men: ₹2200 | Women: ₹1500 per team",
    rules: [
      "No offside rule",
      "Rolling substitutions",
      "Yellow card = 2-minute suspension",
      "20 minutes early reporting",
      "Age limit: 25 years",
      "Maximum squad: 10 players",
    ],
    coordinators: [
      { name: "Onkar Sahane", phone: "8767192671" },
      { name: "Vipakshi Mate", phone: "7972776597" },
    ],
    registrationStatus: "open",
  },
  {
    id: 10,
    name: "KHO-KHO",
    icon: "🏃‍♂️",
    color: "#DC2626",
    gradient: "from-red-600 to-orange-500",
    premiumGradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f97316 100%)",
    glowColor: "rgba(249, 115, 22, 0.4)",
    statusBadge: "OPEN",
    statusIcon: "⚡",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888340/zenith-26/sports/zenith-26/sports/khokho.jpg",
    tier: "Indoor",
    tagline: "Chase & Tag",
    description:
      "Traditional Indian sport of speed and agility. Chase your opponents, tag them out, and showcase lightning-fast reflexes!",
    date: "February 20-21, 2026",
    venue: "Outdoor Kho-Kho Court",
    teamSize: "Both (Men & Women) - Minimum 9, Maximum 12 players",
    registrationFee: "Men: ₹1500 | Women: ₹1200 per team",
    rules: [
      "20-minute match (7+7 minutes halves, 6-minute break)",
      "Federation rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Sairaj Shinde", phone: "8767179744" },
      { name: "Prem Dhande", phone: "8421230555" },
    ],
    registrationStatus: "open",
  },
  {
    id: 11,
    name: "ATHLETICS",
    icon: "🏃",
    color: "#B91C1C",
    gradient: "from-red-700 to-orange-600",
    premiumGradient: "linear-gradient(135deg, #991b1b 0%, #b91c1c 50%, #ea580c 100%)",
    glowColor: "rgba(234, 88, 12, 0.4)",
    statusBadge: "OPEN",
    statusIcon: "🏆",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888288/zenith-26/sports/zenith-26/sports/athletics.jpg",
    tier: "Indoor",
    tagline: "Track & Field Glory",
    description:
      "Sprint, jump, throw! Open for both boys and girls. Compete in track and field events. Show your athletic excellence in individual and team competitions.",
    date: "February 20-22, 2026",
    venue: "Athletic Stadium",
    teamSize: "Both Boys & Girls - Team & Individual Events",
    registrationFee: "Individual: ₹200 | Team: ₹700",
    rules: [
      "Individual Events: 100m, Long Jump (₹200 per athlete)",
      "Team Events: Relay, Mixed Relay - 2 Boys + 2 Girls (₹700 per team)",
      "20 minutes early reporting required",
      "Player identification verification final",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Dipanshu Sahatpute", phone: "7620666188" },
      { name: "Shrujan Pal", phone: "8788766970" },
    ],
    registrationStatus: "open",
  },
  {
    id: 12,
    name: "POWERLIFTING",
    icon: "🏋️",
    color: "#4B5563",
    gradient: "from-gray-700 to-slate-500",
    premiumGradient: "linear-gradient(135deg, #374151 0%, #4b5563 50%, #64748b 100%)",
    glowColor: "rgba(100, 116, 139, 0.4)",
    statusBadge: "OPEN",
    statusIcon: "💪",
    ballImage: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888343/zenith-26/sports/zenith-26/sports/powerlifting.jpg",
    tier: "Strength",
    tagline: "Strength Supreme",
    description:
      "Lift heavy, lift strong! Compete in squat, bench press, and deadlift. Show your raw power and technique in this ultimate strength competition.",
    date: "February 21-22, 2026",
    venue: "Fitness Arena",
    teamSize: "Boys only - Individual",
    registrationFee: "₹300 per player",
    rules: [
      "3 attempts each: Squat, Bench Press, Deadlift",
      "Bring own accessories",
      "International weight categories",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Tejas Borole", phone: "8767386695" },
      { name: "Sakshi Done", phone: "9028684180" },
    ],
    registrationStatus: "open",
  },
];

const SportsGrid = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Check registration status for cricket and other sports
  const { 
    isCricketOpen, 
    isOtherSportsOpen, 
    loading: statusLoading, 
    message, 
    startDate, 
    endDate 
  } = useRegistrationStatus();

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
    // Sports to hide from the site (temporarily disabled)
    const HIDDEN_SPORTS = [];
    
    return sportsData.filter((sport) => {
      // Hide disabled sports
      if (HIDDEN_SPORTS.includes(sport.name)) {
        return false;
      }
      
      // Check if sport registration is open based on type
      const isCricket = sport.name.toLowerCase().includes('cricket');
      const isRegistrationOpen = isCricket ? isCricketOpen : isOtherSportsOpen;
      
      // Only show sports with open registration
      if (!isRegistrationOpen) {
        return false;
      }
      
      const matchesSearch = sport.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, isCricketOpen, isOtherSportsOpen]);

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

  // Show loading state while checking registration status
  if (statusLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show registration closed page if BOTH cricket and other sports are closed
  const allRegistrationsClosed = !isCricketOpen && !isOtherSportsOpen;
  if (allRegistrationsClosed) {
    return <RegistrationClosed message={message} startDate={startDate} endDate={endDate} />;
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dvmsho3pj/image/upload/v1770888293/zenith-26/sports/zenith-26/sports/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(26,15,8,0.8) 50%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      
      {/* Inject premium animations */}
      <style>{premiumKeyframes}</style>
      
      <Navbar />

      {/* Page Like Poll */}
      <PageLikePoll pageName="sports" />

      {/* Animated background elements - pure CSS, no canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-red-600/8 rounded-full blur-3xl animate-pulse delay-2000" />
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
            className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent tracking-tight"
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
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              12 Sports
            </span>
            <span className="text-gray-600">|</span>
            <span>February 20-22, 2026</span>
            <span className="text-gray-600">|</span>
            <span>SGGSIE&T, Nanded</span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/register-sports?sport=Cricket">
              <button className="relative px-8 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group">
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
            
            {/* GameVerse Button */}
            <Link to="/gameverse">
              <button className="relative px-8 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group">
                {/* Animated shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                <span className="relative flex items-center gap-2">
                  🌌 Explore GameVerse
                  <motion.span
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎮
                  </motion.span>
                </span>
              </button>
            </Link>
          </motion.div>
          
          {/* Button Descriptions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row justify-center gap-8 mt-4 text-sm text-gray-400 text-center"
          >
            <p>Main Sport • Early Registration • Matches Start First</p>
            <span className="hidden sm:inline text-gray-600">|</span>
            <p>3D Sports Explorer • Interactive Planets</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Search Bar */}
      <section className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="w-full max-w-xl"
            >
              <input
                type="text"
                placeholder="Search sports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sports Grid */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredSports.map((sport) => (
                <motion.div
                  key={sport.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleSportClick(sport)}
                  className="group relative cursor-pointer select-none"
                  style={{ willChange: "transform" }}
                >
                  {/* Main Card - Creative Design */}
                  <div 
                    className="relative h-full backdrop-blur-md border rounded-xl overflow-hidden transition-all duration-100 group active:scale-[0.98] hover:scale-[1.02]"
                    style={{
                      background: sport.ballImage 
                        ? `linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(26,26,26,0.55) 100%), url('${sport.ballImage}')`
                        : `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(26,26,26,0.8) 100%)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "brightness(0.95)",
                      borderColor: "#3a2416",
                      willChange: "transform",
                    }}
                  >
                    {/* Dark Text Backdrop for all sports with background images */}
                    <div 
                      className="absolute inset-0 z-[5]"
                      style={{
                        background: "linear-gradient(135deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.40) 100%)",
                      }}
                    />

                    <div className="relative z-10 p-5 h-full flex flex-col">
                      {/* Sport Name */}
                      <h3 
                        className="text-3xl font-black mb-2 tracking-tight"
                        style={{
                          color: "#d5d5d5",
                          textShadow: "0 0 30px rgba(255, 255, 255, 0.3), 0 2px 8px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.9)",
                          filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))",
                        }}
                      >
                        {sport.name}
                      </h3>

                      {/* Tagline */}
                      <p 
                        className="text-sm mb-6 font-medium"
                        style={{
                          color: "#d5d5d5",
                          textShadow: "0 0 15px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.8)",
                        }}
                      >
                        {sport.tagline}
                      </p>

                      {/* Info Section - Simple */}
                      <div className="space-y-2 mb-5 text-sm flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📅</span>
                          <span 
                            style={{
                              color: "#d5d5d5",
                              textShadow: "0 0 10px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,1), 0 4px 10px rgba(0,0,0,0.8)",
                            }}
                          >
                            {sport.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-lg">👥</span>
                          <span 
                            style={{
                              color: "#d5d5d5",
                              textShadow: "0 0 10px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,1), 0 4px 10px rgba(0,0,0,0.8)",
                            }}
                          >
                            {sport.teamSize}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-lg">💰</span>
                          <span 
                            className="truncate"
                            style={{
                              color: "#d5d5d5",
                              textShadow: "0 0 10px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,1), 0 4px 10px rgba(0,0,0,0.8)",
                            }}
                          >
                            {sport.registrationFee}
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button 
                        className="w-full py-3 rounded-lg font-bold text-sm transition-all duration-100 active:scale-95 group-hover:scale-[1.02] group-hover:shadow-lg uppercase tracking-wider"
                        style={{
                          background: "linear-gradient(135deg, rgba(255, 183, 122, 0.3), rgba(255, 183, 122, 0.4))",
                          border: "1px solid rgba(255, 183, 122, 0.3)",
                          color: "#ffb77a",
                          boxShadow: "0 0 25px rgba(255, 183, 122, 0.3), 0 2px 6px rgba(0,0,0,0.8)",
                          textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                        }}
                      >
                        Register Now →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

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
                  setSearchQuery("");
                }}
                className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-full text-white font-medium transition-colors"
              >
                Clear Search
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
            transition={{ duration: 0.15 }}
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-8"
          >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
                className="relative bg-gradient-to-br from-[#1a0f08]/98 via-black/98 to-[#1a0f08]/98 backdrop-blur-xl border border-orange-500/20 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl shadow-orange-500/20 flex flex-col"
                style={{ overflow: "hidden" }}
              >
              {/* Compact Header with Sport Icon & Name - Fixed */}
              <div
                className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 px-6 py-6 flex-shrink-0"
              >
                {/* Close Button - Inside header, top-right */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-30 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110 active:scale-95 border border-white/20"
                >
                  <span className="text-lg font-bold leading-none">✕</span>
                </button>

                <div className="flex items-center gap-4 pr-12">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-white/25 backdrop-blur-md rounded-xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0 border border-white/30">
                    {selectedSport.icon}
                  </div>
                  {/* Name & Tagline */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-white truncate drop-shadow-lg">
                      {selectedSport.name}
                    </h2>
                    <p className="text-sm text-white/90 truncate">
                      {selectedSport.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div 
                className="flex-1 p-6 md:p-7 space-y-6 custom-scrollbar"
                style={{
                  overflowY: "auto",
                  overflowX: "hidden",
                  maxHeight: "calc(90vh - 180px)",
                }}
              >
                  {/* Description */}
                  <div>
                    <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-orange-400">📋</span> About
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {selectedSport.description}
                    </p>
                  </div>

                  {/* Quick Info Grid - Compact */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-orange-500/5 backdrop-blur-sm rounded-lg p-4 border border-orange-500/20">
                      <p className="text-xs text-orange-400/80 mb-1.5">📅 Date</p>
                      <p className="text-sm text-white font-semibold">
                        {selectedSport.date}
                      </p>
                    </div>
                    <div className="bg-orange-500/5 backdrop-blur-sm rounded-lg p-4 border border-orange-500/20">
                      <p className="text-xs text-orange-400/80 mb-1.5">👥 Team Size</p>
                      <p className="text-sm text-white font-semibold">
                        {selectedSport.teamSize}
                      </p>
                    </div>
                    <div className="bg-orange-500/5 backdrop-blur-sm rounded-lg p-4 border border-orange-500/20">
                      <p className="text-xs text-orange-400/80 mb-1.5">💰 Fee</p>
                      <p className="text-sm text-white font-semibold truncate">
                        {selectedSport.registrationFee}
                      </p>
                    </div>
                  </div>

                  {/* Rules - Compact List */}
                  <div>
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-orange-400">📜</span> Rules & Regulations
                    </h3>
                    <ul className="space-y-2.5">
                      {selectedSport.rules.map((rule, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2.5 text-sm text-gray-300"
                        >
                          <span className="text-orange-400 mt-0.5 flex-shrink-0 text-xs">▪</span>
                          <span className="leading-relaxed">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Game Coordinators */}
                  {selectedSport.coordinators && selectedSport.coordinators.length > 0 && (
                    <div>
                      <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-orange-500">📞</span> Game Coordinators
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedSport.coordinators.map((coord, index) => (
                          <div
                            key={index}
                            className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                          >
                            <p className="text-sm text-white font-semibold mb-1.5">
                              {coord.name}
                            </p>
                            <a
                              href={`tel:${coord.phone || coord.contact}`}
                              className="text-sm text-orange-500 hover:text-orange-400 transition-colors font-mono"
                            >
                              📱 {coord.phone || coord.contact}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Fixed Footer with CTA */}
              <div className="border-t border-white/10 bg-gradient-to-t from-black/80 to-transparent p-5 md:p-6">
                {(() => {
                  // Check if this specific sport's registration is open
                  const isCricket = selectedSport.name.toLowerCase().includes('cricket');
                  const isSportRegistrationOpen = isCricket ? isCricketOpen : isOtherSportsOpen;
                  
                  return isSportRegistrationOpen ? (
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
                  ) : (
                    <div className="block w-full py-4 px-6 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl text-white font-bold text-center text-base cursor-not-allowed opacity-75">
                      Registration Closed
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimal Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(249, 115, 22, 0.3) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.5);
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
