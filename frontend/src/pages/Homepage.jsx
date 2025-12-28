import {useState, useRef, useEffect, useMemo} from "react";
import {Link} from "react-router-dom";
import {motion, useInView} from "framer-motion";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import ThreeScene from "../components/ThreeScene";
import VIPCarousel from "../components/VIPCarousel";
import WormholePortal from "../components/WormholePortal";
import NextLevelCountdown from "../components/NextLevelCountdown";
import MarathonPreview from "../components/MarathonPreview";
import MentorsSection from "../components/MentorsSection";

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
      window.removeEventListener("mousemove", handleMouseMove, {passive: true});
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
          style={{textShadow: "0 2px 12px rgba(255,140,40,0.18)"}}
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
          <a
            href="#gallery"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            Gallery
          </a>
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
              <a
                href="#gallery"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </a>
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
            initial={{opacity: 0, y: 30, filter: "blur(8px)"}}
            animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
            transition={{duration: 1, ease: "easeOut"}}
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
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.3, ease: "easeOut"}}
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
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.6, delay: 0.6, ease: "easeOut"}}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
              >
                🏆 Register for Sports
              </motion.button>
            </Link>

            <Link to="/marathon">
              <motion.button
                className="inline-block px-8 py-3 rounded-full font-extrabold text-[#2c1506] no-underline transition-transform hover:scale-105"
                style={{
                  background: "linear-gradient(90deg, #ffd700, #ffa500)",
                  boxShadow:
                    "0 12px 28px rgba(255,165,0,0.25), inset 0 -2px 6px rgba(0,0,0,0.12)",
                  willChange: "transform", // Performance hint
                  transform: "translate3d(0,0,0)", // GPU layer
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

      {/* Marathon Preview Section */}
      <MarathonPreview />

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
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Zenith is not just a sports festival — it's where legends are
                born. Since its inception, Zenith has been the ultimate platform
                for student athletes to showcase their skills, compete at the
                highest level, and forge lifelong memories.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                From the roaring cricket grounds to the intense chess battles,
                from the electrifying e-sports arena to the adrenaline-pumping
                athletics track — Zenith 2026 promises to be the most
                spectacular edition yet.
              </p>
            </motion.div>
            <div ref={aboutCardsRef} className="grid grid-cols-2 gap-6">
              {[
                {icon: "🏆", number: "6+", label: "Sports Events"},
                {icon: "👥", number: "1000+", label: "Participants"},
                {icon: "🎯", number: "50+", label: "Matches"},
                {icon: "⚡", number: "3", label: "Days of Action"},
              ].map((stat, index) => (
                <div
                  key={index}
                  className="stat-card relative bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] p-6 rounded-xl border border-[#3a2416] overflow-hidden"
                >
                  {/* Subtle sparkles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(2)].map((_, i) => (
                      <Sparkle key={i} delay={index * 0.3 + i * 0.8} size={3} />
                    ))}
                  </div>
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-[#ffb36a] mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
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

      <footer className="relative py-12 px-6 bg-black border-t border-[#3a2416]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h3
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] mb-6"
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, ease: "easeOut"}}
          >
            ZENITH 2026
          </motion.h3>
          <div className="flex gap-6 justify-center mb-8">
            {["📘", "📷", "🐦", "▶️", "💼"].map((icon, i) => (
              <motion.a
                key={i}
                href="#"
                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#3a2416] bg-[#1a0f08] hover:border-[#ffb36a] hover:scale-110 transition-all duration-300"
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.4, delay: i * 0.08, ease: "easeOut"}}
              >
                <span className="text-2xl">{icon}</span>
              </motion.a>
            ))}
          </div>
          <p className="text-gray-500 mb-2">
            © 2026 SGGSIE&T Zenith. All rights reserved.
          </p>
          <p className="text-sm text-gray-600">Where Champions Rise 🏆</p>
        </div>
      </footer>
    </div>
  );
}
