import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {motion} from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/home");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Floating animation for the trophy
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Glitch effect for 404 text
  const glitchVariants = {
    hidden: {opacity: 0, x: -100},
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0a0604] to-black overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff8b1f] rounded-full filter blur-[120px] opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffb36a] rounded-full filter blur-[120px] opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#ffb36a] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* 404 Text with Glitch Effect */}
        <motion.div
          variants={glitchVariants}
          initial="hidden"
          animate="visible"
          className="relative mb-8"
        >
          <motion.h1
            className="text-[12rem] md:text-[16rem] font-black leading-none"
            style={{
              background:
                "linear-gradient(135deg, #ffb36a 0%, #ff8b1f 50%, #ff6b3d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 80px rgba(255, 140, 31, 0.3)",
            }}
            animate={{
              filter: [
                "drop-shadow(0 0 10px rgba(255, 140, 31, 0.5))",
                "drop-shadow(0 0 20px rgba(255, 140, 31, 0.8))",
                "drop-shadow(0 0 10px rgba(255, 140, 31, 0.5))",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            404
          </motion.h1>
          {/* Glitch overlay effect */}
          <motion.h1
            className="absolute inset-0 text-[12rem] md:text-[16rem] font-black leading-none text-[#ff6b3d] opacity-0"
            animate={{
              opacity: [0, 0.7, 0],
              x: [0, -5, 5, 0],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Trophy Icon with Animation */}
        <motion.div
          className="mb-8 flex justify-center"
          animate={floatingAnimation}
        >
          <div className="text-9xl filter drop-shadow-[0_0_30px_rgba(255,179,106,0.6)]">
            🏆
          </div>
        </motion.div>

        {/* Creative Messages */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.3}}
          className="space-y-4 mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] bg-clip-text text-transparent">
              Out of Bounds!
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 font-medium">
            Looks like this page fumbled the ball and ran off the field! 🏈
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Even champions take wrong turns sometimes. But don't worry,
            <br />
            we'll get you back in the game!
          </p>
        </motion.div>

        {/* Fun Sports-Themed Messages */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.5}}
          className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto"
        >
          {[
            {
              icon: "⚽",
              text: "Goal Missed!",
              color: "from-green-500 to-emerald-600",
            },
            {icon: "🏀", text: "Airball!", color: "from-orange-500 to-red-600"},
            {
              icon: "🎯",
              text: "Off Target!",
              color: "from-blue-500 to-purple-600",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{scale: 1.05, rotate: [0, -5, 5, 0]}}
              className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} bg-opacity-10 border border-white/10 backdrop-blur-sm`}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.6 + index * 0.1}}
            >
              <div className="text-5xl mb-3">{item.icon}</div>
              <p className="text-white font-semibold">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Buttons */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.8}}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/home">
            <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              className="relative px-8 py-4 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] text-black font-bold text-lg rounded-full overflow-hidden group shadow-lg shadow-[#ff8b1f]/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>🏠</span>
                <span>Return to Home Base</span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#ff8b1f] to-[#ff6b3d]"
                initial={{x: "-100%"}}
                whileHover={{x: 0}}
                transition={{duration: 0.3}}
              />
            </motion.button>
          </Link>

          <Link to="/gallery">
            <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-[#ffb36a] text-[#ffb36a] font-bold text-lg rounded-full hover:bg-white/10 transition-all"
            >
              <span className="flex items-center gap-2">
                <span>📸</span>
                <span>View Gallery</span>
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Auto-redirect Countdown */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 1}}
          className="mt-12"
        >
          <div className="inline-block px-6 py-3 rounded-full bg-black/40 border border-[#3a2416] backdrop-blur-sm">
            <p className="text-gray-400 text-sm">
              Auto-redirecting to home in{" "}
              <motion.span
                key={countdown}
                initial={{scale: 1.5, color: "#ff8b1f"}}
                animate={{scale: 1, color: "#ffb36a"}}
                className="font-bold text-lg"
              >
                {countdown}
              </motion.span>{" "}
              seconds
            </p>
          </div>
        </motion.div>

        {/* Fun Quote */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 1.2}}
          className="mt-8"
        >
          <p className="text-gray-500 italic text-sm">
            "Every champion was once a contender that refused to give up."
          </p>
          <p className="text-[#ffb36a] font-semibold mt-2">
            — Even on wrong pages! 💪
          </p>
        </motion.div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-[#ffb36a] opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-[#ffb36a] opacity-30"></div>

      {/* Animated Lines */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffb36a] to-transparent"
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff8b1f] to-transparent"
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1,
        }}
      />
    </div>
  );
};

export default NotFound;
