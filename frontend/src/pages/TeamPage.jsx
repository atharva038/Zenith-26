import {useState, useEffect, useRef} from "react";
import {motion, AnimatePresence, useMotionValue, useSpring} from "framer-motion";
import api from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TeamPage = () => {
  const [activeCommittee, setActiveCommittee] = useState("ALL");
  const [teamData, setTeamData] = useState({});
  const [loading, setLoading] = useState(true);

  // ============ REVEAL CIRCLE STATE ============
  const heroRef = useRef(null);
  const [isInHero, setIsInHero] = useState(false);
  
  // Smooth spring-based mouse following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 });
  const [displayPos, setDisplayPos] = useState({ x: 0, y: 0 });

  // Update display position from spring values
  useEffect(() => {
    const unsubX = smoothX.on("change", (x) => {
      setDisplayPos(prev => ({ ...prev, x }));
    });
    const unsubY = smoothY.on("change", (y) => {
      setDisplayPos(prev => ({ ...prev, y }));
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [smoothX, smoothY]);

  // Committee configurations with unique vibes
  const committees = {
    "EVENT MANAGEMENT & FOOD": {
      title: "Event Management & Food",
      sjcTitle: "The Conductor",
      color: "from-red-500 to-amber-500",
      bgGradient: "from-red-500/10 to-amber-500/10",
      accentColor: "text-orange-400",
      borderColor: "border-orange-500/30",
      shadowColor: "shadow-orange-500/20",
    },
    "GUEST MANAGEMENT & HOSPITALITY": {
      title: "Guest Management & Hospitality",
      sjcTitle: "The Host",
      color: "from-blue-600 to-cyan-500",
      bgGradient: "from-blue-600/10 to-cyan-500/10",
      accentColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      shadowColor: "shadow-blue-500/20",
    },
    "GROUND & SITE + DISCIPLINE": {
      title: "Ground & Site + Discipline",
      sjcTitle: "The Guardian",
      color: "from-gray-700 to-slate-600",
      bgGradient: "from-gray-700/10 to-slate-600/10",
      accentColor: "text-gray-400",
      borderColor: "border-gray-500/30",
      shadowColor: "shadow-gray-500/20",
    },
    DECORATION: {
      title: "Decoration",
      sjcTitle: "The Visionary",
      color: "from-pink-500 to-purple-500",
      bgGradient: "from-pink-500/10 to-purple-500/10",
      accentColor: "text-pink-400",
      borderColor: "border-pink-500/30",
      shadowColor: "shadow-pink-500/20",
    },
    SPONSORSHIP: {
      title: "Sponsorship",
      sjcTitle: "The Negotiator",
      color: "from-green-700 to-emerald-600",
      bgGradient: "from-green-700/10 to-emerald-600/10",
      accentColor: "text-green-400",
      borderColor: "border-green-500/30",
      shadowColor: "shadow-green-500/20",
    },
    "MEDIA & WEB": {
      title: "Media & Web",
      sjcTitle: "The Architect",
      color: "from-indigo-600 to-violet-600",
      bgGradient: "from-indigo-600/10 to-violet-600/10",
      accentColor: "text-indigo-400",
      borderColor: "border-indigo-500/30",
      shadowColor: "shadow-indigo-500/20",
    },
    "PRC/PERMISSION": {
      title: "PRC / Permission",
      sjcTitle: "The Strategist",
      color: "from-slate-600 to-blue-700",
      bgGradient: "from-slate-600/10 to-blue-700/10",
      accentColor: "text-slate-400",
      borderColor: "border-slate-500/30",
      shadowColor: "shadow-slate-500/20",
    },
    FINANCE: {
      title: "Finance",
      sjcTitle: "The Custodian",
      color: "from-blue-800 to-indigo-800",
      bgGradient: "from-blue-800/10 to-indigo-800/10",
      accentColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      shadowColor: "shadow-blue-500/20",
    },
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/team-members");
      const groupedMembers = response.data.data.groupedMembers;
      
      // Merge "EVENT MANAGEMENT" and "FOOD & SITE" into "EVENT MANAGEMENT & FOOD"
      const mergedData = { ...groupedMembers };
      const eventMembers = mergedData["EVENT MANAGEMENT"] || [];
      const foodMembers = mergedData["FOOD & SITE"] || [];
      const combinedMembers = mergedData["EVENT MANAGEMENT & FOOD"] || [];
      
      // Combine all into the new committee
      if (eventMembers.length > 0 || foodMembers.length > 0 || combinedMembers.length > 0) {
        mergedData["EVENT MANAGEMENT & FOOD"] = [...combinedMembers, ...eventMembers, ...foodMembers];
      }
      
      // Remove old separate committees
      delete mergedData["EVENT MANAGEMENT"];
      delete mergedData["FOOD & SITE"];
      
      setTeamData(mergedData);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCommittees = () => {
    if (activeCommittee === "ALL") {
      return Object.keys(teamData);
    }
    return [activeCommittee];
  };

  // ============ MAGNETIC PORTRAITS SYSTEM ============
  
  // Magnetic wrapper - cards respond to cursor proximity
  const MagneticPortrait = ({ children, intensity = 1 }) => {
    const cardRef = useRef(null);
    const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0, rotate: 0 });
    const [isNear, setIsNear] = useState(false);
    
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Distance from cursor to card center
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      // Magnetic pull radius (150px)
      const pullRadius = 150;
      
      if (distance < pullRadius) {
        setIsNear(true);
        // Calculate pull strength (stronger when closer)
        const pullStrength = (1 - distance / pullRadius) * intensity;
        
        // Subtle translation toward cursor (max 4px)
        const translateX = (distX / pullRadius) * 4 * pullStrength;
        const translateY = (distY / pullRadius) * 4 * pullStrength;
        
        // Subtle rotation based on cursor position (max 2deg)
        const rotateZ = (distX / pullRadius) * 2 * pullStrength;
        
        setMagneticPos({ x: translateX, y: translateY, rotate: rotateZ });
      } else {
        setIsNear(false);
        setMagneticPos({ x: 0, y: 0, rotate: 0 });
      }
    };
    
    const handleMouseLeave = () => {
      setIsNear(false);
      setMagneticPos({ x: 0, y: 0, rotate: 0 });
    };
    
    useEffect(() => {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    
    return (
      <motion.div
        ref={cardRef}
        animate={{
          x: magneticPos.x,
          y: magneticPos.y,
          rotateZ: magneticPos.rotate,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.5,
        }}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </motion.div>
    );
  };

  // ============ GALLERY ART FRAME COMPONENTS ============
  
  // SJC Card - Thicker frame, same style, appears first
  const SJCCard = ({member, config}) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Inspirational quotes for SJC members
    const quotes = [
      "Leading with passion",
      "Building tomorrow's legacy",
      "Where vision meets action",
      "The spark behind the team",
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    return (
      <MagneticPortrait intensity={1.2}>
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94]}}
          className="relative flex flex-col items-center mb-8 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Frame Container */}
          <div className="relative">
            {/* Animated Frame Border - THICKER for SJC */}
            <svg 
              className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <rect
                x="2" y="2" width="96" height="96"
                rx="12" ry="12"
                fill="none"
                className={`stroke-current ${config.accentColor}`}
                strokeWidth="0.8"
                strokeDasharray="400"
                strokeDashoffset="400"
                style={{
                  transition: 'stroke-dashoffset 0.8s ease-out',
                }}
              />
              <rect
                x="2" y="2" width="96" height="96"
                rx="12" ry="12"
                fill="none"
                className="stroke-white/20"
                strokeWidth="0.8"
              />
            </svg>
            
            {/* Glow on hover */}
            <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
            
            {/* Photo - slightly overflows frame feel */}
            <motion.div
              animate={{scale: isHovered ? 1.03 : 1}}
              transition={{duration: 0.4, ease: "easeOut"}}
              className="relative w-52 h-52 md:w-60 md:h-60 rounded-xl overflow-hidden"
            >
              {/* Muted by default, sharp on hover */}
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover object-center filter saturate-[0.7] group-hover:saturate-100 transition-all duration-500"
                loading="lazy"
              />
              
              {/* Soft vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]" />
              
              {/* Quote overlay on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 5}}
                    transition={{duration: 0.3}}
                    className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                  >
                    <p className="text-xs text-white/80 italic text-center">
                      "{randomQuote}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Name - fades in on hover (but visible by default for SJC) */}
          <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3, duration: 0.5}}
            className="mt-6 text-center"
          >
            <h3 className="text-xl md:text-2xl font-medium text-white tracking-wide">
              {member.name}
            </h3>
            <p className={`mt-1 text-sm ${config.accentColor} font-light tracking-wider`}>
              {config.sjcTitle}
            </p>
          </motion.div>
          
          {/* Frame draw animation on hover via CSS */}
          <style>{`
            .group:hover svg rect:first-child {
              stroke-dashoffset: 0 !important;
            }
          `}</style>
        </motion.div>
      </MagneticPortrait>
    );
  };

  // Main Member Card - Gallery Art Frame (thinner than SJC)
  const MainCard = ({member, config, index}) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <MagneticPortrait intensity={0.8}>
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5, delay: index * 0.05}}
          className="relative group flex flex-col items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Frame Container */}
          <div className="relative">
            {/* Animated Frame Border - Thin metallic line */}
            <svg 
              className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Animated colored frame */}
              <rect
                x="3" y="3" width="94" height="94"
                rx="10" ry="10"
                fill="none"
                className={`stroke-current ${config.accentColor}`}
                strokeWidth="0.5"
                strokeDasharray="400"
                strokeDashoffset="400"
                style={{
                  transition: 'stroke-dashoffset 0.6s ease-out',
                }}
              />
              {/* Static subtle frame */}
              <rect
                x="3" y="3" width="94" height="94"
                rx="10" ry="10"
                fill="none"
                className="stroke-white/10"
                strokeWidth="0.5"
              />
            </svg>
            
            {/* Glow on hover */}
            <div className={`absolute -inset-1 rounded-xl bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-15 blur-lg transition-opacity duration-500`} />
            
            {/* Photo Container - soft rounded square */}
            <motion.div
              animate={{scale: isHovered ? 1.02 : 1}}
              transition={{duration: 0.3, ease: "easeOut"}}
              className="relative w-36 h-36 md:w-44 md:h-44 rounded-xl overflow-hidden"
            >
              {/* Muted by default, sharp on hover */}
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover object-center filter saturate-[0.6] brightness-[0.9] group-hover:saturate-100 group-hover:brightness-100 transition-all duration-400"
                loading="lazy"
              />
              
              {/* Soft vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(0,0,0,0.3)]" />
            </motion.div>
          </div>
          
          {/* Name - fades in more on hover */}
          <div className="mt-4 text-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <h4 className="text-base md:text-lg font-medium text-white">
              {member.name}
            </h4>
          </div>
          
          {/* Frame draw animation on hover */}
          <style>{`
            .group:hover svg rect:first-child {
              stroke-dashoffset: 0 !important;
            }
          `}</style>
        </motion.div>
      </MagneticPortrait>
    );
  };

  // Committee Section
  const CommitteeSection = ({committeeKey, members}) => {
    const config = committees[committeeKey];
    if (!config || !members || members.length === 0) return null;

    // Separate SJC and Mains - position comes as lowercase "sjc" or "main" from backend
    const sjc = members.find(m => 
      m.position && m.position.toLowerCase() === "sjc"
    );
    const mains = members.filter(m => 
      m.position && m.position.toLowerCase() === "main"
    );

    return (
      <motion.section
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.8}}
        className="mb-32"
      >
        {/* Committee Header */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="text-center mb-20"
        >
          <h2 className={`text-4xl md:text-6xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent mb-4`}>
            {config.title}
          </h2>
          <div className={`h-1.5 w-40 mx-auto bg-gradient-to-r ${config.color} rounded-full`} />
        </motion.div>

        {/* ============ SJC SECTION - COMPLETELY SEPARATE ROW ============ */}
        {sjc && (
          <div className="mb-16 pb-12 border-b border-white/5">
            {/* SJC Card - centered, no heavy header */}
            <div className="relative flex justify-center">
              <SJCCard member={sjc} config={config} />
            </div>
          </div>
        )}

        {/* ============ MAIN MEMBERS - GALLERY GRID ============ */}
        {mains.length > 0 && (
          <div>
            {/* Minimal separator */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px w-12 bg-white/10" />
              <span className="text-xs text-white/30 uppercase tracking-[0.3em]">Team</span>
              <div className="h-px w-12 bg-white/10" />
            </div>
            
            {/* Gallery Grid - centered items */}
            <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
              {mains.map((member, index) => (
                <MainCard
                  key={member._id}
                  member={member}
                  config={config}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0604] to-black text-white">
      <Navbar />

      {/* ============ REVEAL CIRCLE HERO ============ */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
        onMouseMove={(e) => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
          }
        }}
        onMouseEnter={(e) => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Instantly set position on enter to avoid animation from corner
            mouseX.set(x);
            mouseY.set(y);
            smoothX.set(x);
            smoothY.set(y);
            setDisplayPos({ x, y });
          }
          setIsInHero(true);
        }}
        onMouseLeave={() => setIsInHero(false)}
      >
        {/* Layer 1: Background Image - revealed through feathered circle */}
        <div
          className="absolute inset-0 bg-cover hidden md:block"
          style={{
            backgroundImage: 'url("/img/team-front-optimized.jpg")',
            backgroundPosition: 'center 60%',
            maskImage: isInHero 
              ? `radial-gradient(circle 160px at ${displayPos.x}px ${displayPos.y}px, black 0%, black 60%, transparent 100%)`
              : `radial-gradient(circle 0px at ${displayPos.x}px ${displayPos.y}px, black 0%, transparent 100%)`,
            WebkitMaskImage: isInHero 
              ? `radial-gradient(circle 160px at ${displayPos.x}px ${displayPos.y}px, black 0%, black 60%, transparent 100%)`
              : `radial-gradient(circle 0px at ${displayPos.x}px ${displayPos.y}px, black 0%, transparent 100%)`,
          }}
        />

        {/* Mobile: Show image with dark overlay */}
        <div
          className="absolute inset-0 bg-cover md:hidden"
          style={{
            backgroundImage: 'url("/img/team-front-optimized.jpg")',
            backgroundPosition: 'center 60%',
          }}
        />
        <div className="absolute inset-0 bg-black/60 md:hidden" />

        {/* Layer 2: Text Content - Always visible */}
        <div className="relative z-20 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            TEAM ZENITH
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-white/60 tracking-[0.2em] uppercase"
          >
            Different roles. One heartbeat.
          </motion.p>

          {/* Hover hint - desktop only */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2, duration: 1 }}
            className="hidden md:block mt-16 text-xs text-white/30 tracking-widest uppercase"
          >
            Move cursor to explore
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white/40 text-2xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* Committee Selector */}
      <section className="relative py-12 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveCommittee("ALL")}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeCommittee === "ALL"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              All Teams
            </button>
            {Object.keys(committees).map((key) => (
              <button
                key={key}
                onClick={() => setActiveCommittee(key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeCommittee === key
                    ? `bg-gradient-to-r ${committees[key].color} text-white shadow-lg ${committees[key].shadowColor}`
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {committees[key].title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCommittee}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -20}}
                transition={{duration: 0.5}}
              >
                {getFilteredCommittees().map((committeeKey) => (
                  <CommitteeSection
                    key={committeeKey}
                    committeeKey={committeeKey}
                    members={teamData[committeeKey]}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Behind Zenith Section */}
      <section className="relative py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Behind Zenith
            </h2>
            <p className="text-gray-400 text-lg">
              Moments that matter. No names. Just memories.
            </p>
          </motion.div>

          {/* Candid Photos Grid - Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{opacity: 0, scale: 0.8}}
                whileInView={{opacity: 1, scale: 1}}
                viewport={{once: true}}
                transition={{duration: 0.5, delay: i * 0.1}}
                whileHover={{scale: 1.05}}
                className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20" />
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
                  📸
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* End Message */}
      <section className="relative py-32 px-6">
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 1}}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed italic">
            "This page will change every year.
            <br />
            <span className="text-orange-400">But the memories won't."</span>
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default TeamPage;
