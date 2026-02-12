import {useState, useRef, useEffect} from "react";
import {Link} from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import {motion} from "framer-motion";
import {
  Instagram,
  Mail,
  Phone,
  MapPin,
  Youtube,
  Calendar,
  Trophy,
  Users,
} from "lucide-react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import ThreeScene from "../components/ThreeScene";
import VIPCarousel from "../components/VIPCarousel";
import WormholePortal from "../components/WormholePortal";
import NextLevelCountdown from "../components/NextLevelCountdown";
// import MarathonPreview from "../components/MarathonPreview"; // COMMENTED OUT
import MarathonPreview from "../components/MarathonPreview";
import WomenTournamentPreview from "../components/WomenTournamentPreview";
import MentorsSection from "../components/MentorsSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageLikePoll from "../components/PageLikePoll";
import logo from "../assets/logo.png";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Subtle Sparkle component for blink dots - GPU ACCELERATED
const Sparkle = ({delay = 0, size = 4}) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200"
    style={{
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      willChange: "transform, opacity", // Browser performance hint
      transform: "translate3d(0,0,0)", // Force GPU layer
    }}
    initial={{opacity: 0, scale: 0}}
    animate={{
      opacity: [0, 0.6, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 3 + 1,
      ease: "easeInOut",
    }}
  />
);

export default function Homepage() {
  const stadiumRef = useRef(null);
  const textRef = useRef(null);
  const aboutCardsRef = useRef(null);
  const eventsRef = useRef(null);

  // Subtle mouse parallax effect for hero (reduced intensity) - PASSIVE LISTENER FOR PERFORMANCE
  useEffect(() => {
    // Disable parallax on mobile for performance
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      const {clientX, clientY} = e;
      const {innerWidth, innerHeight} = window;

      // Calculate mouse position as percentage (-0.5 to 0.5)
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      // Stadium moves with mouse (very subtle - reduced from 20 to 12)
      gsap.to(stadiumRef.current, {
        x: xPercent * 12,
        y: yPercent * 12,
        duration: 1,
        ease: "power2.out",
      });

      // Text moves opposite direction (subtle - reduced from 30 to 18)
      gsap.to(textRef.current, {
        x: -xPercent * 18,
        y: -yPercent * 18,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    // Use passive listener for better scroll performance
    window.addEventListener("mousemove", handleMouseMove, {passive: true});

    return () => {
      window.removeEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
    };
  }, []);

  // GSAP ScrollTrigger for stats cards (subtle animation)
  useEffect(() => {
    if (aboutCardsRef.current) {
      const cards = aboutCardsRef.current.querySelectorAll(".stat-card");

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: aboutCardsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Event cards subtle animation
    if (eventsRef.current) {
      const eventCards = eventsRef.current.querySelectorAll(".event-card");

      eventCards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Page Like Poll */}
      <PageLikePoll pageName="home" />

      {/* Navigation */}
      <Navbar />

      <section id="hero" className="relative w-screen h-screen overflow-hidden">
        {/* Stadium Background Image - GPU ACCELERATED */}
        <div
          ref={stadiumRef}
          className="absolute inset-0 z-[1] will-change-transform"
          style={{
            backgroundImage:
              'url("https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1/zenith-26/img/stadium?_a=BAMAMiB80")',
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
            filter: "brightness(0.45) saturate(0.9) contrast(0.95)",
            transform: "translate3d(0,0,0)", // Force GPU layer
            willChange: "transform", // Performance hint for GSAP animations
          }}
        />
        {/* Subtle blinking dots/sparkles */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <Sparkle key={i} delay={i * 0.4} size={Math.random() * 4 + 3} />
          ))}
        </div>
        {/* Subtle overlay UNDER the Three.js scene for depth */}
        <div
          className="absolute inset-0 z-[10] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {/* Three.js Scene - COMMENTED OUT FOR NOW */}
        {/* <ThreeScene /> */}
        {/* Very subtle vignette on top to help title readability */}
        <div
          className="absolute inset-0 z-[100] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% 30%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.4) 100%)",
          }}
        />
        <div
          ref={textRef}
          className="absolute top-[15%] left-0 right-0 z-[200] text-center px-5 will-change-transform pb-8"
          style={{
            transform: "translate3d(0,0,0)", // GPU layer for GSAP parallax
            willChange: "transform", // Performance hint
          }}
        >
          <motion.h1
            className="m-0 tracking-[6px] font-black"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              background: "linear-gradient(180deg, #ffffff 0%, #ffe7c3 50%, #ffb347 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow:
                "0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,140,0,0.6), 0 8px 32px rgba(0,0,0,0.9), 0 20px 60px rgba(255,120,40,0.4)",
              filter: "drop-shadow(0 0 20px rgba(255,215,0,0.6)) drop-shadow(0 4px 8px rgba(0,0,0,0.8))",
              willChange: "opacity, transform, filter",
              transform: "translate3d(0,0,0)",
            }}
            initial={{opacity: 0, y: 30, filter: "blur(8px)"}}
            animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
            transition={{duration: 1, ease: "easeOut"}}
          >
            ZENITH 2026
          </motion.h1>
          <motion.p
            className="mt-3 mb-0 font-bold"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "#ffdcb3",
              textShadow:
                "0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,140,0,0.3), 0 2px 8px rgba(0,0,0,0.9)",
              willChange: "opacity, transform",
              transform: "translate3d(0,0,0)",
            }}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.3, ease: "easeOut"}}
      
          >
            SGGSIE&T Annual Sports Festival • Where Champions Rise
          </motion.p>

          {/* Registration Buttons - Compact Skewed Cards */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl mx-auto px-3 sm:px-4">
            {/* Cricket - Featured with Badge */}
            <Link to="/register-sports?sport=Cricket">
              <motion.div
                className="relative group h-full"
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5, delay: 0.4}}
              >
                <motion.button
                  className="w-full h-full px-3 py-3 sm:px-4 sm:py-4 rounded-lg sm:rounded-xl font-bold text-white backdrop-blur-md transition-all duration-300 text-left relative overflow-hidden"
                  style={{
                    background: "linear-gradient(155deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    transform: "perspective(1000px) rotateY(-2deg)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 0,
                    background: "linear-gradient(155deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.25))",
                    border: "1px solid rgba(16, 185, 129, 0.5)",
                  }}
                  whileTap={{scale: 0.95}}
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full" />
                  
                  {/* Badge */}
                  <motion.div
                    className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black"
                    style={{
                      background: "rgba(16, 185, 129, 0.3)",
                      border: "1px solid rgba(16, 185, 129, 0.5)",
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    OPEN 🔥
                  </motion.div>
                  
                  <div className="relative z-10">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏏</div>
                    <div className="font-black text-base sm:text-lg leading-tight">Cricket</div>
                    <div className="text-xs sm:text-sm font-medium text-green-200 mt-0.5">Main Sport</div>
                  </div>
                </motion.button>
              </motion.div>
            </Link>

            {/* Browse All Sports */}
            <Link to="/sports">
              <motion.div
                className="relative group h-full"
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5, delay: 0.5}}
              >
                <motion.button
                  className="w-full h-full px-3 py-3 sm:px-4 sm:py-4 rounded-lg sm:rounded-xl font-bold text-white backdrop-blur-md transition-all duration-300 text-left relative overflow-hidden"
                  style={{
                    background: "linear-gradient(155deg, rgba(249, 115, 22, 0.15), rgba(220, 38, 38, 0.15))",
                    border: "1px solid rgba(249, 115, 22, 0.3)",
                    transform: "perspective(1000px) rotateY(-2deg)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 0,
                    background: "linear-gradient(155deg, rgba(249, 115, 22, 0.25), rgba(220, 38, 38, 0.25))",
                    border: "1px solid rgba(249, 115, 22, 0.5)",
                  }}
                  whileTap={{scale: 0.95}}
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
                  
                  <div className="relative z-10">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">⚽</div>
                    <div className="font-black text-base sm:text-lg leading-tight">Browse</div>
                    <div className="text-xs sm:text-sm font-medium text-orange-200 mt-0.5">All Sports</div>
                  </div>
                </motion.button>
              </motion.div>
            </Link>

            {/* Register for Sports */}
            <Link to="/register">
              <motion.div
                className="relative group h-full"
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5, delay: 0.6}}
              >
                <motion.button
                  className="w-full h-full px-3 py-3 sm:px-4 sm:py-4 rounded-lg sm:rounded-xl font-bold text-white backdrop-blur-md transition-all duration-300 text-left relative overflow-hidden"
                  style={{
                    background: "linear-gradient(155deg, rgba(255, 179, 106, 0.15), rgba(255, 139, 31, 0.15))",
                    border: "1px solid rgba(255, 179, 106, 0.3)",
                    transform: "perspective(1000px) rotateY(-2deg)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 0,
                    background: "linear-gradient(155deg, rgba(255, 179, 106, 0.25), rgba(255, 139, 31, 0.25))",
                    border: "1px solid rgba(255, 179, 106, 0.5)",
                  }}
                  whileTap={{scale: 0.95}}
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full" />
                  
                  <div className="relative z-10">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏆</div>
                    <div className="font-black text-base sm:text-lg leading-tight">Register</div>
                    <div className="text-xs sm:text-sm font-medium text-amber-200 mt-0.5">Quick Entry</div>
                  </div>
                </motion.button>
              </motion.div>
            </Link>

            {/* Marathon */}
            <Link to="/marathon">
              <motion.div
                className="relative group h-full"
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5, delay: 0.7}}
              >
                <motion.button
                  className="w-full h-full px-3 py-3 sm:px-4 sm:py-4 rounded-lg sm:rounded-xl font-bold text-white backdrop-blur-md transition-all duration-300 text-left relative overflow-hidden"
                  style={{
                    background: "linear-gradient(155deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.15))",
                    border: "1px solid rgba(255, 215, 0, 0.3)",
                    transform: "perspective(1000px) rotateY(-2deg)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 0,
                    background: "linear-gradient(155deg, rgba(255, 215, 0, 0.25), rgba(255, 165, 0, 0.25))",
                    border: "1px solid rgba(255, 215, 0, 0.5)",
                  }}
                  whileTap={{scale: 0.95}}
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-bl-full" />
                  
                  <div className="relative z-10">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏃</div>
                    <div className="font-black text-base sm:text-lg leading-tight">Marathon</div>
                    <div className="text-xs sm:text-sm font-medium text-yellow-200 mt-0.5">Run Wild</div>
                  </div>
                </motion.button>
              </motion.div>
            </Link>

            {/* <Link to="/women-tournament">
              <motion.button
                className="inline-block px-8 py-3 rounded-full font-extrabold text-white no-underline transition-transform hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #6b7280, #4b5563, #374151)",
                  boxShadow:
                    "0 12px 28px rgba(107,114,128,0.3), inset 0 -2px 6px rgba(0,0,0,0.12)",
                  willChange: "transform",
                  transform: "translate3d(0,0,0)",
                }}
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.6, delay: 0.8, ease: "easeOut"}}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
              >
                ✅ Women's Tournament (Completed)
              </motion.button>
            </Link> */}
          </div>

          {/* Next Level Countdown Timer */}
          <div className="mt-6 sm:mt-8">
            <NextLevelCountdown
              targetDate="2026-02-20T09:00:00"
              eventName="ZENITH 2026"
            />
          </div>
        </div>
        <div
          className="absolute left-0 right-0 bottom-0 h-[22%] z-[210] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.0) 80%)",
          }}
        />
      </section>

      {/* Marathon Preview Section */}
      <MarathonPreview />

      {/* Women's Tournament Preview Section - NEW */}
      <WomenTournamentPreview />

      <section
        id="about"
        className="relative py-20 px-6 bg-gradient-to-b from-black to-[#0a0604]"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]"
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-50px"}}
            transition={{duration: 0.7, ease: "easeOut"}}
          >
            About Zenith
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{opacity: 0, x: -30}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.7, ease: "easeOut"}}
            >
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] mb-6">
                ZENITH&apos;26
              </h1>
              <div className="text-lg text-gray-300 leading-relaxed">
                Zenith is state level sports extravaganza of our college started
                in 2016. As we know, sports improve our confidence, health and
                it illuminates team spirit, let&apos;s dive into it and explore
                the enthusiasm of this event. The tagline of something gives
                short but deep insight of what we are getting out of it. So this
                year Zenith comes with the tagline &quot;A Celebration of
                Eternal Glory&quot;. Eternal means existing forever and we are
                celebrating the pride means glory which lasts forever through
                sports. After successful completion of 9 editions we are back
                with its 10th edition.
              </div>
            </motion.div>
            <motion.div
              initial={{opacity: 0, x: 30}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.7, ease: "easeOut", delay: 0.2}}
            >
              <img
                src="https://res.cloudinary.com/ddaxlm9yc/image/upload/v1707427953/jqmii8uwfiub5nlvadxy.png"
                alt="Zenith Sports"
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
          </div>

          {/* Stats/Icons Section */}
          <motion.div
            ref={aboutCardsRef}
            className="mt-16"
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-50px"}}
            transition={{duration: 0.7, ease: "easeOut", delay: 0.3}}
          >
            <div className="grid md:grid-cols-4 gap-8">
              <a
                href="https://www.youtube.com/@zenithsportseventsggsietna7666"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-6 bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-xl border border-[#3a2416] hover:border-[#ffb36a] transition-all duration-300 hover:scale-105"
              >
                <div className="bg-red-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Youtube className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#ffb36a] mb-2">
                  14 Sports +
                </h1>
                <p className="text-gray-400">Over 14 sports and games</p>
              </a>
              <div className="text-center p-6 bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-xl border border-[#3a2416]">
                <div className="bg-blue-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#ffb36a] mb-2">
                  11 Years
                </h1>
                <p className="text-gray-400">
                  11 years of successful execution
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-xl border border-[#3a2416]">
                <div className="bg-yellow-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#ffb36a] mb-2">
                  3.5 Lakh + Prize
                </h1>
                <p className="text-gray-400">Prize worth up to 3.5 Lakh</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-xl border border-[#3a2416]">
                <div className="bg-green-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#ffb36a] mb-2">
                  1000+ Participants
                </h1>
                <p className="text-gray-400">Active participants yearly</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wormhole Portal Section */}
      <section
        id="wormhole"
        className="relative h-screen w-full bg-black overflow-hidden"
        style={{
          willChange: "transform",
          transform: "translate3d(0,0,0)",
        }}
      >
        {/* Wormhole Portal Component */}
        <WormholePortal />
      </section>

      {/* VIP Spotlight Section */}
      <section
        id="vip-guests"
        className="relative py-20 px-6 bg-gradient-to-b from-[#0a0604] to-black overflow-hidden"
      >
        {/* Background Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <Sparkle key={i} delay={i * 0.5} size={5} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <motion.div
            className="text-center mb-16"
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-50px"}}
            transition={{duration: 0.7, ease: "easeOut"}}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]">
              VIP Spotlight
            </h2>
            <p className="text-gray-400 text-xl">
              Legends who graced Zenith over the years
            </p>
          </motion.div>

          {/* VIP Carousel */}
          <motion.div
            initial={{opacity: 0, y: 40}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-100px"}}
            transition={{duration: 0.8, ease: "easeOut"}}
          >
            <VIPCarousel />
          </motion.div>
        </div>
      </section>

      {/* Mentors Section */}
      <MentorsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
