import {useState, useEffect, useMemo} from "react";
import {motion} from "framer-motion";

/**
 * NextLevelCountdown - A stunning, animated countdown timer
 * Features: Flip animations, glowing effects, particle effects, responsive design
 */
const NextLevelCountdown = ({targetDate, eventName = "ZENITH 2026"}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  // Calculate time remaining
  useEffect(() => {
    setIsClient(true);

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return {days: 0, hours: 0, minutes: 0, seconds: 0};
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Memoized particles for performance
  const particles = useMemo(
    () =>
      [...Array(20)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 3,
      })),
    []
  );

  if (!isClient) return null;

  const timeUnits = [
    {label: "DAYS", value: timeLeft.days, max: 365},
    {label: "HOURS", value: timeLeft.hours, max: 24},
    {label: "MINUTES", value: timeLeft.minutes, max: 60},
    {label: "SECONDS", value: timeLeft.seconds, max: 60},
  ];

  return (
    <div className="relative w-full py-8 overflow-hidden">
      {/* Background glow effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,140,50,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-t from-orange-500 to-yellow-300"
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.left,
              bottom: "-10px",
            }}
            animate={{
              y: [0, -400],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Event name badge */}
      <motion.div
        className="text-center mb-6"
        initial={{opacity: 0, y: -20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
      >
        <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[3px] text-orange-300 border border-orange-500/30 rounded-full bg-orange-500/10 backdrop-blur-sm">
          ⚡ COUNTDOWN TO {eventName}
        </span>
      </motion.div>

      {/* Main countdown grid */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 px-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{opacity: 0, scale: 0.5, rotateX: -90}}
            animate={{opacity: 1, scale: 1, rotateX: 0}}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
            className="relative group"
          >
            <CountdownCard
              value={unit.value}
              label={unit.label}
              max={unit.max}
            />

            {/* Separator dots (not after last item) */}
            {index < timeUnits.length - 1 && (
              <div className="absolute -right-1 sm:-right-2 md:-right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-400"
                  animate={{opacity: [1, 0.3, 1]}}
                  transition={{duration: 1, repeat: Infinity}}
                />
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-400"
                  animate={{opacity: [1, 0.3, 1]}}
                  transition={{duration: 1, repeat: Infinity, delay: 0.5}}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Event date display */}
      <motion.p
        className="text-center mt-6 text-orange-200/70 text-sm tracking-wider"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.8}}
      >
        20 - 22 FEBRUARY 2026 • SGGSIE&T NANDED
      </motion.p>
    </div>
  );
};

/**
 * Individual countdown card with flip animation and progress ring
 */
const CountdownCard = ({value, label, max}) => {
  const formattedValue = String(value).padStart(2, "0");
  const progress = (value / max) * 100;

  return (
    <div className="relative flex flex-col items-center">
      {/* Main card */}
      <div
        className="relative w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-32 rounded-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, rgba(40,20,10,0.9) 0%, rgba(20,10,5,0.95) 100%)",
          boxShadow: `
            0 10px 40px rgba(0,0,0,0.5),
            0 0 20px rgba(255,140,50,0.1),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.3)
          `,
          border: "1px solid rgba(255,140,50,0.2)",
        }}
      >
        {/* Progress ring background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,140,50,0.3)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={283}
            strokeDashoffset={283 - (283 * progress) / 100}
            transform="rotate(-90 50 50)"
            initial={{strokeDashoffset: 283}}
            animate={{strokeDashoffset: 283 - (283 * progress) / 100}}
            transition={{duration: 0.5}}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb36a" />
              <stop offset="100%" stopColor="#ff6b1f" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center divider line */}
        <div
          className="absolute left-0 right-0 top-1/2 h-[1px] z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,140,50,0.3), transparent)",
          }}
        />

        {/* Number display */}
        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <motion.span
            key={value}
            className="font-bold text-transparent bg-clip-text"
            style={{
              fontSize: "clamp(1.5rem, 5vw, 3rem)",
              background:
                "linear-gradient(180deg, #fff 0%, #ffb36a 50%, #ff8b1f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 40px rgba(255,140,50,0.5)",
            }}
            initial={{rotateX: -90, opacity: 0}}
            animate={{rotateX: 0, opacity: 1}}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            {formattedValue}
          </motion.span>
        </div>

        {/* Shine effect on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, transparent 100%)",
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-orange-500/40 rounded-tl" />
        <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-orange-500/40 rounded-tr" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-orange-500/40 rounded-bl" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-orange-500/40 rounded-br" />
      </div>

      {/* Label */}
      <motion.span
        className="mt-2 text-[10px] sm:text-xs font-semibold tracking-[2px] text-orange-300/80"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.5}}
      >
        {label}
      </motion.span>
    </div>
  );
};

export default NextLevelCountdown;
