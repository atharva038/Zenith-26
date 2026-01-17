import {Link} from "react-router-dom";
import {motion} from "framer-motion";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full blur-3xl animate-bounce"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/home" className="flex items-center gap-3">
            <img
              src="/zenith-logo.svg"
              alt="Zenith"
              className="h-10 w-10 md:h-12 md:w-12"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="text-white font-bold text-xl md:text-2xl">
              ZENITH <span className="text-purple-400">'26</span>
            </span>
          </Link>
          <Link
            to="/home"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 py-12">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Coming Soon Badge */}
          <motion.div
            initial={{scale: 0}}
            animate={{scale: 1}}
            transition={{delay: 0.2, type: "spring"}}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-8"
          >
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span className="text-purple-300 text-sm font-medium">
              Coming Soon
            </span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              ZENITH 2026
            </span>
            <br />
            <span className="text-white/90">is Coming!</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed">
            Get ready for the biggest sports fest of SGGSIE&T!
          </p>

          {/* Event Date Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-8">
            <svg
              className="w-5 h-5 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-purple-300 font-semibold">
              February 20 - 22, 2026
            </span>
          </div>

          {/* Registration Coming Soon Message */}
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{delay: 0.3, duration: 0.5}}
            className="mb-12 px-8 py-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Registration Will Start Soon!
            </h2>
            <p className="text-gray-400">
              Stay tuned for updates. We'll notify you when registrations open.
            </p>
          </motion.div>

          {/* Marathon Registration - NOW OPEN! */}
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.4, duration: 0.8}}
            className="mb-12 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-yellow-500/10 border border-orange-500/30 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto backdrop-blur-sm relative overflow-hidden"
          >
            {/* Animated glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

            {/* NOW OPEN Badge with pulse animation */}
            <motion.div
              initial={{scale: 0}}
              animate={{scale: 1}}
              transition={{delay: 0.5, type: "spring", stiffness: 200}}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full border border-orange-500/50 mb-6 relative"
            >
              <motion.span 
                className="w-2 h-2 bg-orange-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              ></motion.span>
              <span className="text-orange-300 text-sm font-bold uppercase tracking-wider">
                Registration Now Open! 🎉
              </span>
            </motion.div>

            {/* Marathon Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-4xl">🏃</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Zenith Marathon 2026
              </span>
            </h2>

            <p className="text-gray-300 text-lg mb-6 max-w-xl mx-auto leading-relaxed">
              While general ZENITH registrations are coming soon, you can register now for our exciting 5K Marathon!
            </p>

            {/* Marathon Details Grid */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-orange-500/20">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-orange-400 font-bold text-sm mb-1">Date</div>
                <div className="text-white text-sm">Feb 14, 2026</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-orange-500/20">
                <div className="text-3xl mb-2">🏃</div>
                <div className="text-orange-400 font-bold text-sm mb-1">Distance</div>
                <div className="text-white text-sm">5 KM Run</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-orange-500/20">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-orange-400 font-bold text-sm mb-1">Entry Fee</div>
                <div className="text-white font-bold text-lg">₹99</div>
              </div>
            </div>

            {/* What's Included - Quick Summary */}
            <div className="mb-8">
              <h3 className="text-orange-400 font-semibold mb-4 text-sm uppercase tracking-wider">What You Get</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { icon: "🏅", name: "Medals for Winners" },
                  { icon: "👕", name: "T-Shirt" },
                  { icon: "📜", name: "E-Certificate" },
                  { icon: "💵", name: "Cash Prizes" },
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{opacity: 0, scale: 0}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: 0.6 + index * 0.1}}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-lg border border-orange-500/20"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-gray-300 text-sm font-medium">{item.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/marathon"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl text-white font-bold text-lg transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
              >
                <span>Register Now</span>
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{x: [0, 5, 0]}}
                  transition={{duration: 1.5, repeat: Infinity}}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </motion.svg>
              </Link>

              <Link
                to="/marathon-event"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-orange-500/30 hover:border-orange-500/50 rounded-xl text-orange-300 font-semibold transition-all"
              >
                <span>Learn More</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Limited Spots Notice */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 1}}
              className="mt-6 flex items-center justify-center gap-2 text-yellow-400/80 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Registration closes on February 10, 2026</span>
            </motion.div>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-purple-500/50"></div>
            <span className="text-gray-500 text-sm">PAST EVENT</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-purple-500/50"></div>
          </div>

          {/* Women Tournament Section - COMPLETED */}
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.5, duration: 0.8}}
            className="bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-pink-500/20 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto backdrop-blur-sm relative overflow-hidden"
          >
            {/* Completed Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30 mb-6">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-300 text-sm font-medium">
                Tournament Completed Successfully! 🎉
              </span>
            </div>

            {/* Women Tournament Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Women's Sports Tournament
            </h2>

            <p className="text-gray-300 text-lg mb-6 max-w-xl mx-auto">
              Thank you to all the incredible athletes who participated! The tournament 
              was a huge success, showcasing amazing talent and sportsmanship from the 
              women of SGGSIE&T.
            </p>

            {/* Event Recap */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                <span className="text-yellow-400">🎮</span>
                <span className="text-gray-300 text-sm">Fun Games</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                <span className="text-blue-400">🏸</span>
                <span className="text-gray-300 text-sm">Individual Sports</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                <span className="text-green-400">⚽</span>
                <span className="text-gray-300 text-sm">Team Sports</span>
              </div>
            </div>

            {/* Event Date - Completed */}
            <div className="flex items-center justify-center gap-3 mb-8 text-gray-400">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Held on: January 11-12, 2026</span>
            </div>

            {/* View Gallery Button */}
            <Link
              to="/women-tournament"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-bold text-lg transition-all"
            >
              <span>View Tournament Details</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </motion.div>

          {/* Upcoming Events Teaser */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.8}}
            className="mt-16"
          >
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-6">
              Coming in Main Registration
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                {icon: "🏃", name: "Marathon"},
                {icon: "🏏", name: "Cricket"},
                {icon: "⚽", name: "Football"},
                {icon: "🏀", name: "Basketball"},
                {icon: "🏐", name: "Volleyball"},
                {icon: "🎾", name: "Badminton"},
              ].map((sport, index) => (
                <motion.div
                  key={sport.name}
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.9 + index * 0.1}}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors cursor-default"
                >
                  <span>{sport.icon}</span>
                  <span className="text-gray-400 text-sm">{sport.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6 border-t border-white/5">
        <p className="text-gray-500 text-sm">
          © 2026 Zenith - SGGSIE&T Sports Fest. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
