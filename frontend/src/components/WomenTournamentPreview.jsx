import {motion} from "framer-motion";
import {Link} from "react-router-dom";

const WomenTournamentPreview = () => {
  const sports = [
    {icon: "🏀", name: "Basketball", color: "from-orange-500 to-red-500"},
    {icon: "🏐", name: "Volleyball", color: "from-blue-500 to-cyan-500"},
    {icon: "⚽", name: "Football", color: "from-green-500 to-emerald-500"},
    {icon: "🏸", name: "Badminton", color: "from-purple-500 to-pink-500"},
    {icon: "🎾", name: "Tennis", color: "from-yellow-500 to-orange-500"},
    {icon: "🏑", name: "Hockey", color: "from-teal-500 to-blue-500"},
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glowing Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-[120px] opacity-20"
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[120px] opacity-20"
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

        {/* Floating Sparkles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-400 rounded-full"
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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.8}}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-8xl">⚡</span>
          </motion.div>

          <h2 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Women's Tournament
            </span>
          </h2>

          <motion.p
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true}}
            transition={{delay: 0.3}}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Celebrating Excellence, Strength & Unity
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-bold">
              Empowering Women Athletes
            </span>
          </motion.p>
        </motion.div>

        {/* Sports Grid */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{delay: 0.4}}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16"
        >
          {sports.map((sport, index) => (
            <motion.div
              key={sport.name}
              initial={{opacity: 0, scale: 0.8}}
              whileInView={{opacity: 1, scale: 1}}
              viewport={{once: true}}
              transition={{delay: 0.1 * index}}
              whileHover={{scale: 1.1, rotate: [0, -5, 5, 0]}}
              className="group relative"
            >
              <div
                className={`bg-gradient-to-br ${sport.color} p-1 rounded-2xl`}
              >
                <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center h-full transition-all group-hover:bg-black/60">
                  <span className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
                    {sport.icon}
                  </span>
                  <p className="text-white font-bold text-sm text-center">
                    {sport.name}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{delay: 0.6}}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: "🏆",
              title: "Championship Glory",
              description: "Compete for prestigious titles and recognition",
            },
            {
              icon: "💪",
              title: "Skill Showcase",
              description: "Display your talent on the grand stage",
            },
            {
              icon: "🌟",
              title: "Networking",
              description: "Connect with athletes and sports professionals",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: 0.7 + index * 0.1}}
              whileHover={{y: -10}}
              className="bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-8 text-center"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tournament Details */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{delay: 0.8}}
          className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-pink-500/20 rounded-3xl p-8 md:p-12 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Tournament Highlights
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">Multiple sports categories</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">Team & individual events</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">
                    Professional coaching sessions
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">
                    Prizes & recognition for winners
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">Networking opportunities</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/20">
                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-3xl">📅</span>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="text-white font-bold text-xl">
                      February 20-23, 2026
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-3xl">📍</span>
                  <div>
                    <p className="text-gray-400 text-sm">Venue</p>
                    <p className="text-white font-bold text-xl">
                      SGGSIE&T Campus
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/20">
                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-3xl">💰</span>
                  <div>
                    <p className="text-gray-400 text-sm">Registration Fee</p>
                    <p className="text-white font-bold text-xl">
                      ₹200 per person
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{delay: 1}}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link to="/women-tournament">
            <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              className="px-10 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg rounded-full shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/70 transition-all"
            >
              <span className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Register Now</span>
              </span>
            </motion.button>
          </Link>

          <Link to="/women-tournament#details">
            <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              className="px-10 py-4 bg-white/5 backdrop-blur-sm border-2 border-pink-500 text-pink-400 font-bold text-lg rounded-full hover:bg-white/10 transition-all"
            >
              <span className="flex items-center space-x-2">
                <span>📋</span>
                <span>View Details</span>
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WomenTournamentPreview;
