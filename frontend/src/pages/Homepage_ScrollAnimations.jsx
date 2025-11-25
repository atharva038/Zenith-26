import { useState, useRef, useEffect } from "react";
import {
  motion as Motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DemoNavigation from "../components/DemoNavigation";
import LoginModal from "../components/LoginModal";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Sparkle component for sparkle effects
const Sparkle = ({ delay = 0, size = 6 }) => (
  <Motion.div
    className="absolute rounded-full bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200"
    style={{
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 1.5,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 2,
    }}
  />
);

// Animated Section wrapper component
const AnimatedSection = ({
  children,
  variant = "slideUp",
  className = "",
  id,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    slideUp: {
      hidden: { opacity: 0, y: 100 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] },
      },
    },
    fadeBlur: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 1, ease: "easeOut" },
      },
    },
    rotate: {
      hidden: { opacity: 0, rotateX: 45, scale: 0.8 },
      visible: {
        opacity: 1,
        rotateX: 0,
        scale: 1,
        transition: { duration: 1, ease: [0.25, 0.4, 0.25, 1] },
      },
    },
    slideLeft: {
      hidden: { opacity: 0, x: -100 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] },
      },
    },
    slideRight: {
      hidden: { opacity: 0, x: 100 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] },
      },
    },
  };

  return (
    <Motion.section
      ref={ref}
      id={id}
      className={className}
      variants={variants[variant]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </Motion.section>
  );
};

export default function Homepage_ScrollAnimations() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const stadiumRef = useRef(null);
  const textRef = useRef(null);
  const aboutCardsRef = useRef(null);
  const eventsRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  // Mouse parallax effect for hero
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(stadiumRef.current, {
        x: xPercent * 20,
        y: yPercent * 20,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(textRef.current, {
        x: -xPercent * 30,
        y: -yPercent * 30,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP ScrollTrigger animations for cards
  useEffect(() => {
    // About stats cards animation with stagger
    if (aboutCardsRef.current) {
      const cards = aboutCardsRef.current.querySelectorAll(".stat-card");

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 60,
          rotateX: -15,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutCardsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Events cards with rotation and scale
    if (eventsRef.current) {
      const eventCards = eventsRef.current.querySelectorAll(".event-card");

      eventCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            rotateY: index % 2 === 0 ? -25 : 25,
            scale: 0.7,
            y: 50,
          },
          {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 20%",
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
      {/* Demo Navigation */}
      <DemoNavigation />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 px-9 py-5 flex justify-between items-center z-[100] bg-black/50 backdrop-blur-md">
        <span
          className="text-[#ffb77a] font-bold text-xl tracking-wide"
          style={{ textShadow: "0 2px 12px rgba(255,140,40,0.18)" }}
        >
          Zenith 2026
        </span>

        <div className="hidden md:flex gap-6">
          {["about", "events", "gallery"].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          ))}
          <button
            onClick={() => setLoginModalOpen(true)}
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            Register
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#ffb77a] z-[110]"
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
      </nav>

      {/* Hero Section */}
      <Motion.section
        id="hero"
        className="relative w-screen h-screen overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Stadium Background with Parallax */}
        <div
          ref={stadiumRef}
          className="absolute inset-0 z-[1] will-change-transform"
          style={{
            backgroundImage: 'url("/img/stadium.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
            filter: "brightness(0.45) saturate(0.9) contrast(0.95)",
          }}
        />

        {/* Sparkle effects */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <Sparkle key={i} delay={i * 0.2} size={Math.random() * 8 + 4} />
          ))}
        </div>

        <div
          className="absolute inset-0 z-[10] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Hero Text with Parallax */}
        <Motion.div
          ref={textRef}
          className="absolute top-[20%] left-0 right-0 z-[200] text-center px-5 will-change-transform"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Motion.h1
            className="m-0 text-[#ffe7c3] tracking-[6px] font-bold"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              textShadow:
                "0 18px 40px rgba(255,120,40,0.12), 0 0 30px rgba(255,150,50,0.18)",
            }}
            initial={{ scale: 0.8, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            ZENITH 2026
          </Motion.h1>

          <Motion.p
            className="mt-3 mb-0 text-[#ffdcb3]"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            SGGSIE&T Annual Sports Festival • Where Champions Rise
          </Motion.p>

          <Motion.button
            onClick={() => setLoginModalOpen(true)}
            className="inline-block mt-4 px-8 py-3 rounded-full font-extrabold text-[#2c1506] no-underline cursor-pointer"
            style={{
              background: "linear-gradient(90deg, #ffb36a, #ff8b1f)",
              boxShadow:
                "0 12px 28px rgba(255,140,40,0.18), inset 0 -2px 6px rgba(0,0,0,0.12)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register Now
          </Motion.button>
        </Motion.div>

        <div
          className="absolute left-0 right-0 bottom-0 h-[22%] z-[210] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.0) 80%)",
          }}
        />
      </Motion.section>

      {/* About Section - Slide from bottom */}
      <AnimatedSection
        id="about"
        variant="slideUp"
        className="relative py-20 px-6 bg-gradient-to-b from-black to-[#0a0604]"
      >
        <div className="max-w-6xl mx-auto">
          {/* Title with Fade + Blur */}
          <Motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]"
            initial={{ opacity: 0, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            About Zenith
          </Motion.h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text content - Slide from left */}
            <Motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
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
            </Motion.div>

            {/* Stats cards - GSAP controlled */}
            <div
              ref={aboutCardsRef}
              className="grid grid-cols-2 gap-6"
              style={{ perspective: "1000px" }}
            >
              {[
                { icon: "🏆", number: "6+", label: "Sports Events" },
                { icon: "👥", number: "1000+", label: "Participants" },
                { icon: "🎯", number: "50+", label: "Matches" },
                { icon: "⚡", number: "3", label: "Days of Action" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="stat-card relative bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] p-6 rounded-xl border border-[#3a2416] overflow-hidden"
                >
                  {/* Sparkles for each card */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <Sparkle key={i} delay={index * 0.3 + i * 0.5} size={4} />
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
      </AnimatedSection>

      {/* Events Section - Rotate + Scale */}
      <AnimatedSection
        id="events"
        variant="fadeBlur"
        className="relative py-20 px-6 bg-[#0a0604]"
      >
        <div className="max-w-7xl mx-auto">
          <Motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ff8b1f] to-[#ffb36a]"
            initial={{ opacity: 0, rotateX: 45 }}
            whileInView={{ opacity: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            Choose Your Arena
          </Motion.h2>

          <Motion.p
            className="text-center text-gray-400 text-xl mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Six disciplines. Infinite glory.
          </Motion.p>

          <div
            ref={eventsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            style={{ perspective: "1500px" }}
          >
            {[
              {
                name: "Cricket",
                icon: "🏏",
                color: "from-green-600 to-green-800",
                desc: "Test your batting & bowling skills",
              },
              {
                name: "Volleyball",
                icon: "🏐",
                color: "from-yellow-600 to-orange-600",
                desc: "Spike your way to victory",
              },
              {
                name: "Chess",
                icon: "♟️",
                color: "from-gray-700 to-slate-900",
                desc: "Strategic battles of the mind",
              },
              {
                name: "E-Games",
                icon: "🎮",
                color: "from-purple-600 to-pink-600",
                desc: "Digital arena showdowns",
              },
              {
                name: "Athletics",
                icon: "🏃",
                color: "from-red-600 to-orange-600",
                desc: "Run, jump, throw - dominate",
              },
              {
                name: "Badminton",
                icon: "🏸",
                color: "from-blue-600 to-cyan-600",
                desc: "Shuttle your way to glory",
              },
            ].map((sport) => (
              <Motion.div
                key={sport.name}
                className="event-card group relative bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-2xl p-8 border-2 border-[#3a2416] cursor-pointer overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  borderColor: "#ffb36a",
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Sparkle effect on hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  {[...Array(8)].map((_, i) => (
                    <Sparkle key={i} delay={i * 0.1} size={6} />
                  ))}
                </div>

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl`}
                />

                <div className="relative z-10">
                  <Motion.div
                    className="text-6xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {sport.icon}
                  </Motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {sport.name}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {sport.desc}
                  </p>
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Footer - Slide up with sparkles */}
      <AnimatedSection
        variant="slideUp"
        className="relative py-12 px-6 bg-black border-t border-[#3a2416]"
      >
        <div className="max-w-7xl mx-auto text-center relative">
          {/* Footer sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <Sparkle key={i} delay={i * 0.3} size={5} />
            ))}
          </div>

          <Motion.h3
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            ZENITH 2026
          </Motion.h3>

          <div className="flex gap-6 justify-center mb-8">
            {["📘", "📷", "🐦", "▶️", "💼"].map((icon, i) => (
              <Motion.a
                key={i}
                href="#"
                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#3a2416] bg-[#1a0f08]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{
                  scale: 1.2,
                  borderColor: "#ffb36a",
                  rotate: 360,
                }}
              >
                <span className="text-2xl">{icon}</span>
              </Motion.a>
            ))}
          </div>

          <Motion.p
            className="text-gray-500 mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            © 2026 SGGSIE&T Zenith. All rights reserved.
          </Motion.p>
          <Motion.p
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Where Champions Rise 🏆
          </Motion.p>
        </div>
      </AnimatedSection>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
