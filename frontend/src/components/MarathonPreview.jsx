import {useRef} from "react";
import {Link} from "react-router-dom";
import {motion, useInView} from "framer-motion";

/**
 * MarathonPreview - Eye-catching marathon teaser section for homepage
 * Displays highlights and CTA to full marathon page (Postponed to March)
 */
const MarathonPreview = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {once: true, margin: "-100px"});

  // Marathon postponed to March - no specific date yet

  const highlights = [
    {icon: "🏃", text: "5K Run"},
    {icon: "👕", text: "Free T-Shirt"},
    {icon: "�", text: "Medals for Winners"},
    {icon: "�", text: "Cash Prizes"},
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden min-h-[90vh]"
    >
      {/* Marathon Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dvmsho3pj/image/upload/v1768496483/zenith-26/marathon/marathon-bg.png')",
        }}
      />
      
      {/* Dark Overlays for Text Visibility */}
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 100px,
              rgba(255,140,50,0.1) 100px,
              rgba(255,140,50,0.1) 101px
            )`,
          }}
        />
        {/* Running track lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[2px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              right: 0,
            }}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header removed */}

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Visual/Runner illustration */}
          <motion.div
            className="relative"
            initial={{opacity: 0, x: -50}}
            animate={isInView ? {opacity: 1, x: 0} : {}}
            transition={{duration: 0.6, delay: 0.2}}
          >
            <div
              className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden backdrop-blur-md"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,100,50,0.15) 0%, rgba(0,0,0,0.7) 100%)",
                border: "1px solid rgba(255,140,50,0.3)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            >
              {/* Animated runner silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-[150px] md:text-[200px] drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))" }}
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🏃‍♂️
                </motion.div>
              </div>

              {/* Speedlines effect */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-[3px] rounded-full"
                    style={{
                      top: `${15 + i * 10}%`,
                      right: "20%",
                      width: `${30 + Math.random() * 40}%`,
                      background: `linear-gradient(90deg, rgba(255,140,50,${
                        0.1 + i * 0.05
                      }) 0%, transparent 100%)`,
                    }}
                    animate={{
                      x: [100, -200],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              {/* Date badge */}
              <div className="absolute bottom-4 left-4 right-4">
                <div
                  className="backdrop-blur-md rounded-xl p-4 text-center"
                  style={{
                    background: "rgba(127, 29, 29, 0.7)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                  }}
                >
                  <p className="text-red-300 font-bold text-lg">
                    🚫 CANCELLED
                  </p>
                  <p className="text-white/60 text-sm">
                    Not happening this year
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Info and CTA */}
          <motion.div
            initial={{opacity: 0, x: 50}}
            animate={isInView ? {opacity: 1, x: 0} : {}}
            transition={{duration: 0.6, delay: 0.3}}
          >
            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-md"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  initial={{opacity: 0, y: 20}}
                  animate={isInView ? {opacity: 1, y: 0} : {}}
                  transition={{duration: 0.4, delay: 0.4 + i * 0.1}}
                  whileHover={{ background: "rgba(255,140,50,0.15)" }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm text-white font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Registration fee */}
            <div
              className="mb-6 p-5 rounded-xl backdrop-blur-md"
              style={{
                background:
                  "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(220,38,38,0.1) 100%)",
                border: "1px solid rgba(239,68,68,0.3)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Event Status</p>
                  <p className="text-3xl font-black text-red-400">
                    CANCELLED
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-red-400 text-sm font-bold">
                    🚫 Closed
                  </p>
                  <p className="text-white/60 text-xs">
                    Not happening this year
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Registration button removed */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Registration button removed */}

              <Link to="/marathon-event" className="flex-1">
                <motion.button
                  className="w-full py-4 px-6 rounded-xl font-bold text-lg text-orange-200 border-2 border-orange-500/40 transition-all backdrop-blur-md"
                  style={{
                    background: "rgba(255,140,50,0.15)",
                  }}
                  whileHover={{
                    background: "rgba(255,140,50,0.25)",
                    borderColor: "rgba(255,140,50,0.6)",
                    scale: 1.03,
                  }}
                  whileTap={{scale: 0.98}}
                >
                  Learn More →
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MarathonPreview;
