import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeScene from "../components/ThreeScene";
import VIPCarousel from "../components/VIPCarousel";
import WormholePortal from "../components/WormholePortal";
import NextLevelCountdown from "../components/NextLevelCountdown";
// import MarathonPreview from "../components/MarathonPreview"; // COMMENTED OUT
import WomenTournamentPreview from "../components/WomenTournamentPreview";
import MentorsSection from "../components/MentorsSection";
import logo from "../assets/logo.png";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Subtle Sparkle component for blink dots - GPU ACCELERATED
const Sparkle = ({ delay = 0, size = 4 }) => (
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
    initial={{ opacity: 0, scale: 0 }}
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const stadiumRef = useRef(null);
  const textRef = useRef(null);
  const aboutCardsRef = useRef(null);
  const eventsRef = useRef(null);

  // Subtle mouse parallax effect for hero (reduced intensity) - PASSIVE LISTENER FOR PERFORMANCE
  useEffect(() => {
    // Disable parallax on mobile for performance
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

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
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

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

      eventCards.forEach((card, index) => {
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 px-9 py-5 flex justify-between items-center z-[600] bg-black/10 backdrop-blur-md">
        <span
          className="text-[#ffb77a] font-bold text-xl tracking-wide"
          style={{ textShadow: "0 2px 12px rgba(255,140,40,0.18)" }}
        >
          Zenith 2026
        </span>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          <a
            href="#about"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            About
          </a>
          <a
            href="#events"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            Events
          </a>
          <a
            href="#wormhole"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors flex items-center gap-1"
          >
            � Portal
          </a>
          <a
            href="#vip-guests"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            VIP Guests
          </a>
          <Link
            to="/gallery"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
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
              <a
                href="#about"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#events"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </a>
              <a
                href="#wormhole"
                className="text-[#ffb77a] font-semibold flex items-center gap-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                � Portal
              </a>
              <a
                href="#vip-guests"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                VIP Guests
              </a>
              <Link
                to="/gallery"
                className="text-[#ffb77a] font-semibold"
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
          className="absolute top-[20%] left-0 right-0 z-[200] text-center px-5 will-change-transform"
          style={{
            transform: "translate3d(0,0,0)", // GPU layer for GSAP parallax
            willChange: "transform", // Performance hint
          }}
        >
          <motion.h1
            className="m-0 text-[#ffe7c3] tracking-[6px] font-bold"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              textShadow:
                "0 18px 40px rgba(255,120,40,0.12), 0 0 30px rgba(255,150,50,0.18)",
              willChange: "opacity, transform, filter", // Performance hints
              transform: "translate3d(0,0,0)", // GPU layer
            }}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            ZENITH 2026
          </motion.h1>
          <motion.p
            className="mt-3 mb-0 text-[#ffdcb3]"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              willChange: "opacity, transform", // Performance hints
              transform: "translate3d(0,0,0)", // GPU layer
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            SGGSIE&T Annual Sports Festival • Where Champions Rise
          </motion.p>

          {/* Registration Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center items-center">
            <Link to="/register">
              <motion.button
                className="inline-block px-8 py-3 rounded-full font-extrabold text-[#2c1506] no-underline transition-transform hover:scale-105"
                style={{
                  background: "linear-gradient(90deg, #ffb36a, #ff8b1f)",
                  boxShadow:
                    "0 12px 28px rgba(255,140,40,0.18), inset 0 -2px 6px rgba(0,0,0,0.12)",
                  willChange: "transform", // Performance hint
                  transform: "translate3d(0,0,0)", // GPU layer
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🏆 Register for Sports
              </motion.button>
            </Link>

            {/* MARATHON BUTTON COMMENTED OUT
            <Link to="/marathon">
              <motion.button
                className="inline-block px-8 py-3 rounded-full font-extrabold text-[#2c1506] no-underline transition-transform hover:scale-105"
                style={{
                  background: "linear-gradient(90deg, #ffd700, #ffa500)",
                  boxShadow:
                    "0 12px 28px rgba(255,165,0,0.25), inset 0 -2px 6px rgba(0,0,0,0.12)",
                  willChange: "transform",
                  transform: "translate3d(0,0,0)",
                }}
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.6, delay: 0.7, ease: "easeOut"}}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
              >
                🏃 Marathon Registration
              </motion.button>
            </Link>
            */}

            <Link to="/women-tournament">
              <motion.button
                className="inline-block px-8 py-3 rounded-full font-extrabold text-white no-underline transition-transform hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #ec4899, #8b5cf6, #6366f1)",
                  boxShadow:
                    "0 12px 28px rgba(236,72,153,0.4), inset 0 -2px 6px rgba(0,0,0,0.12)",
                  willChange: "transform",
                  transform: "translate3d(0,0,0)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚡ Women's Tournament
              </motion.button>
            </Link>
          </div>

          {/* Next Level Countdown Timer */}
          <div className="mt-10">
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

      {/* Marathon Preview Section - COMMENTED OUT */}
      {/* <MarathonPreview /> */}

      {/* Women's Tournament Preview Section - NEW */}
      <WomenTournamentPreview />

      <section
        id="about"
        className="relative py-20 px-6 bg-gradient-to-b from-black to-[#0a0604]"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            About Zenith
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
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
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <VIPCarousel />
          </motion.div>
        </div>
      </section>

      {/* Mentors Section */}
      <MentorsSection />

      <footer className="relative py-16 px-6 bg-gradient-to-b from-black via-[#0a0604] to-black border-t border-[#3a2416]">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-3 gap-12 mb-12">
            {/* Logo & Brand Section */}
            <div className="text-center lg:text-left">
              <motion.div
                className="flex justify-center lg:justify-start mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <img src={logo} alt="Zenith Logo" className="h-24 w-auto" />
              </motion.div>

              <motion.h3
                className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              >
                ZENITH 2026
              </motion.h3>

              <motion.p
                className="text-gray-400 text-base leading-relaxed max-w-sm mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                SGGSIE&T Annual Sports Festival
                <br />
                <span className="text-[#ffb36a] font-semibold text-sm">
                  Where Champions Rise
                </span>
              </motion.p>
            </div>

            {/* Quick Links Section */}
            <div className="text-center">
              <motion.h4
                className="text-xl font-semibold text-[#ffb36a] mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                Quick Links
              </motion.h4>

              <motion.div
                className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-sm mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              >
                <a
                  href="#about"
                  className="text-gray-300 hover:text-[#ffb36a] transition-colors duration-300 font-medium py-2 text-sm text-center block"
                >
                  About Zenith
                </a>
                <a
                  href="#events"
                  className="text-gray-300 hover:text-[#ffb36a] transition-colors duration-300 font-medium py-2 text-sm text-center block"
                >
                  Sports Events
                </a>
                <a
                  href="#wormhole"
                  className="text-gray-300 hover:text-[#ffb36a] transition-colors duration-300 font-medium py-2 text-sm text-center block"
                >
                  Portal
                </a>
                <a
                  href="#vip-guests"
                  className="text-gray-300 hover:text-[#ffb36a] transition-colors duration-300 font-medium py-2 text-sm text-center block"
                >
                  VIP Guests
                </a>
                <Link
                  to="/gallery"
                  className="text-gray-300 hover:text-[#ffb36a] transition-colors duration-300 font-medium py-2 text-sm text-center block"
                >
                  Gallery
                </Link>
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-[#ffb36a] transition-colors duration-300 font-medium py-2 text-sm text-center block"
                >
                  Register
                </Link>
              </motion.div>
            </div>

            {/* Connect With Us Section */}
            <div className="text-center">
              <motion.h4
                className="text-xl font-semibold text-[#ffb36a] mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                Connect With Us
              </motion.h4>

              {/* Social Media Icons */}
              <motion.div
                className="flex justify-center gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              >
                <motion.a
                  href="https://www.instagram.com/zenith_sggs?igsh=djNob2lwbXg2aGdi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ffb36a] to-[#ff8b1f] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                    <Instagram size={20} className="text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </motion.a>

                <motion.a
                  href="mailto:zenith@sggs.ac.in"
                  className="group relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#d97706] to-[#ffb36a] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-orange-600/25 transition-all duration-300">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#d97706] to-[#ffb36a] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </motion.a>

                <motion.a
                  href="tel:+919356463943"
                  className="group relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ea580c] to-[#f97316] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-orange-700/25 transition-all duration-300">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </motion.a>

                <motion.a
                  href="https://goo.gl/maps/qdH2ab7UjYGfyPJs6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#b45309] to-[#d97706] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-amber-600/25 transition-all duration-300">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#b45309] to-[#d97706] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </motion.a>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                className="text-gray-400 text-sm space-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              >
                <p className="flex items-center justify-center gap-2">
                  <Mail size={14} className="text-[#ffb36a]" />
                  zenith@sggs.ac.in
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Phone size={14} className="text-[#ffb36a]" />
                  +91 93564 63943
                </p>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section */}
          <motion.div
            className="pt-12 mt-8 border-t border-[#3a2416]/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <div className="text-center space-y-4">
              <p className="text-gray-500 text-sm">
                © 2026 SGGSIE&T Zenith. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-400">
                <span className="hover:text-[#ffb36a] transition-colors cursor-pointer">
                  Privacy Policy
                </span>
                <span className="hover:text-[#ffb36a] transition-colors cursor-pointer">
                  Terms of Service
                </span>
                <span className="hover:text-[#ffb36a] transition-colors cursor-pointer">
                  Support
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background Gradient Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-[#ffb36a]/5 to-[#ff8b1f]/5 rounded-full blur-3xl"></div>
        </div>
      </footer>
    </div>
  );
}
