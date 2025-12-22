import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {motion, useInView} from "framer-motion";

/**
 * MarathonPreview - Eye-catching marathon teaser section for homepage
 * Displays countdown, highlights, and CTA to full marathon page
 */
const MarathonPreview = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {once: true, margin: "-100px"});

  // Marathon date - February 8, 2026 (before main event)
  const marathonDate = new Date("2026-02-08T06:00:00");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = marathonDate - new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        };
      }
      return {days: 0, hours: 0, minutes: 0};
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(timer);
  }, []);

  const highlights = [
    {icon: "🏃", text: "5K & 10K Categories"},
    {icon: "🎽", text: "Free T-Shirt & Medal"},
    {icon: "🏆", text: "Cash Prizes"},
    {icon: "📍", text: "SGGSIE&T Campus"},
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a0604 0%, #1a0f08 50%, #0a0604 100%)",
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
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

      {/* Glowing orb effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,100,50,0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{opacity: 0, y: 30}}
          animate={isInView ? {opacity: 1, y: 0} : {}}
          transition={{duration: 0.6}}
        >
          <motion.span
            className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-[3px] text-yellow-300 border border-yellow-500/30 rounded-full bg-yellow-500/10"
            initial={{opacity: 0, scale: 0.8}}
            animate={isInView ? {opacity: 1, scale: 1} : {}}
            transition={{duration: 0.4, delay: 0.2}}
          >
            🔥 COMING SOON
          </motion.span>

          <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500">
              ZENITH MARATHON
            </span>
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Kick off the Zenith festivities with our first-ever marathon! Run
            through the historic SGGSIE&T campus before the main sports event.
          </p>
        </motion.div>

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
              className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,100,50,0.1) 0%, rgba(0,0,0,0.5) 100%)",
                border: "1px solid rgba(255,140,50,0.2)",
              }}
            >
              {/* Animated runner silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-[150px] md:text-[200px]"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 0.6,
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
                    className="absolute h-[2px] rounded-full"
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
                    background: "rgba(0,0,0,0.7)",
                    border: "1px solid rgba(255,140,50,0.3)",
                  }}
                >
                  <p className="text-orange-300 font-bold text-lg">
                    📅 February 8, 2026
                  </p>
                  <p className="text-gray-400 text-sm">
                    Race starts at 6:00 AM
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
            {/* Mini countdown */}
            <div className="mb-8">
              <p className="text-sm text-orange-300/70 mb-3 tracking-wider">
                RACE STARTS IN
              </p>
              <div className="flex gap-4">
                {[
                  {value: timeLeft.days, label: "Days"},
                  {value: timeLeft.hours, label: "Hours"},
                  {value: timeLeft.minutes, label: "Mins"},
                ].map((item, i) => (
                  <div
                    key={i}
                    className="text-center px-4 py-3 rounded-lg"
                    style={{
                      background: "rgba(255,140,50,0.1)",
                      border: "1px solid rgba(255,140,50,0.2)",
                    }}
                  >
                    <span className="block text-2xl md:text-3xl font-bold text-white">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-xs text-orange-300/70">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                  initial={{opacity: 0, y: 20}}
                  animate={isInView ? {opacity: 1, y: 0} : {}}
                  transition={{duration: 0.4, delay: 0.4 + i * 0.1}}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-gray-300">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Registration fee */}
            <div
              className="mb-6 p-4 rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,140,50,0.1) 100%)",
                border: "1px solid rgba(255,215,0,0.2)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Registration Fee</p>
                  <p className="text-2xl font-bold text-white">
                    ₹500{" "}
                    <span className="text-sm text-gray-400 font-normal">
                      only
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 text-sm font-semibold">
                    Early Bird
                  </p>
                  <p className="text-gray-400 text-xs">
                    Limited slots available
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/marathon" className="flex-1">
                <motion.button
                  className="w-full py-4 px-6 rounded-xl font-bold text-lg text-black transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffd700 0%, #ffa500 50%, #ff6b1f 100%)",
                    boxShadow: "0 10px 30px rgba(255,165,0,0.3)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 15px 40px rgba(255,165,0,0.4)",
                  }}
                  whileTap={{scale: 0.98}}
                >
                  🏃 Register for Marathon
                </motion.button>
              </Link>

              <Link to="/marathon-event" className="flex-1">
                <motion.button
                  className="w-full py-4 px-6 rounded-xl font-bold text-lg text-orange-300 border border-orange-500/30 transition-all"
                  style={{
                    background: "rgba(255,140,50,0.1)",
                  }}
                  whileHover={{
                    background: "rgba(255,140,50,0.2)",
                    borderColor: "rgba(255,140,50,0.5)",
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
