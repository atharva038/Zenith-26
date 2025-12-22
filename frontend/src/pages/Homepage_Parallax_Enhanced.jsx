import {useState, useRef, useEffect} from "react";
import {gsap} from "gsap";

/**
 * Enhanced Homepage with Multi-layer Parallax
 * - Stadium background moves subtly
 * - Text moves in opposite direction (more dramatic)
 * - Additional layers for depth effect
 * - Smooth, butter-like animations
 */
export default function HomepageEnhanced() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for parallax layers
  const stadiumRef = useRef(null);
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Disable parallax on mobile for performance
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      const {clientX, clientY} = e;
      const {innerWidth, innerHeight} = window;

      // Normalize mouse position to -0.5 to 0.5
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      // Layer 1: Stadium (subtle, WITH mouse)
      gsap.to(stadiumRef.current, {
        x: xPercent * 25,
        y: yPercent * 25,
        duration: 1.0,
        ease: "power2.out",
      });

      // Layer 2: Overlay (medium, WITH mouse)
      gsap.to(overlayRef.current, {
        x: xPercent * 15,
        y: yPercent * 15,
        duration: 0.8,
        ease: "power2.out",
      });

      // Layer 3: Text (dramatic, OPPOSITE)
      gsap.to(textRef.current, {
        x: -xPercent * 35,
        y: -yPercent * 35,
        duration: 0.6,
        ease: "power3.out",
      });

      // Layer 4: Button (extra dramatic, OPPOSITE)
      gsap.to(buttonRef.current, {
        x: -xPercent * 40,
        y: -yPercent * 40,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    // Add mouse move listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 px-9 py-5 flex justify-between items-center z-[100]">
        <span
          className="text-[#ffb77a] font-bold text-xl tracking-wide"
          style={{textShadow: "0 2px 12px rgba(255,140,40,0.18)"}}
        >
          Zenith 2026
        </span>

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
            href="#gallery"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            Gallery
          </a>
          <a
            href="#register"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            Register
          </a>
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

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md p-6 md:hidden">
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
                href="#gallery"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </a>
              <a
                href="#register"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </a>
            </div>
          </div>
        )}
      </nav>

      <section id="hero" className="relative w-screen h-screen overflow-hidden">
        {/* Layer 1: Stadium Background (moves WITH mouse) */}
        <div
          ref={stadiumRef}
          className="absolute inset-0 z-[1] will-change-transform"
          style={{
            backgroundImage: 'url("https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1/zenith-26/img/stadium?_a=BAMAMiB80")',
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
            filter: "brightness(0.45) saturate(0.9) contrast(0.95)",
            // Scale up slightly to prevent edges showing during movement
            transform: "scale(1.1)",
          }}
        />

        {/* Layer 2: Gradient Overlay (moves WITH mouse, but less) */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-[10] pointer-events-none will-change-transform"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Static vignette (doesn't move) */}
        <div
          className="absolute inset-0 z-[100] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% 30%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Layer 3: Main Text (moves OPPOSITE to mouse) */}
        <div
          ref={textRef}
          className="absolute top-[20%] left-0 right-0 z-[200] text-center px-5 will-change-transform"
        >
          <h1
            className="m-0 text-[#ffe7c3] tracking-[6px] font-bold"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              textShadow:
                "0 18px 40px rgba(255,120,40,0.12), 0 0 30px rgba(255,150,50,0.18)",
            }}
          >
            ZENITH 2026
          </h1>
          <p
            className="mt-3 mb-0 text-[#ffdcb3]"
            style={{fontSize: "clamp(1rem, 2vw, 1.2rem)"}}
          >
            SGGSIE&T Annual Sports Festival • Where Champions Rise
          </p>
        </div>

        {/* Layer 4: Button (moves OPPOSITE, even more) */}
        <div
          ref={buttonRef}
          className="absolute top-[35%] left-0 right-0 z-[200] text-center will-change-transform"
        >
          <a
            href="#register"
            className="inline-block px-8 py-3 rounded-full font-extrabold text-[#2c1506] no-underline transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(90deg, #ffb36a, #ff8b1f)",
              boxShadow:
                "0 12px 28px rgba(255,140,40,0.18), inset 0 -2px 6px rgba(0,0,0,0.12)",
            }}
          >
            Register Now
          </a>
        </div>

        {/* Bottom gradient (static) */}
        <div
          className="absolute left-0 right-0 bottom-0 h-[22%] z-[210] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.0) 80%)",
          }}
        />
      </section>

      {/* Rest of your sections (About, Events, Footer) */}
      <section
        id="about"
        className="relative py-20 px-6 bg-gradient-to-b from-black to-[#0a0604]"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]">
            About Zenith
          </h2>
          <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto">
            Experience the most immersive sports festival website with
            cutting-edge parallax effects. Move your mouse and feel the depth!
            🏟️✨
          </p>
        </div>
      </section>
    </div>
  );
}
