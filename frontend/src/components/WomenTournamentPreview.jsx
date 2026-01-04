import {motion} from "framer-motion";
import {Link} from "react-router-dom";

const WomenTournamentPreview = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-br from-purple-950 via-pink-950 to-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:good/v1767513046/zenith-26/img/backgrounds/women-tournament-bg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/60 via-pink-950/50 to-black/95" />
      </div>

      {/* Animated Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Header */}
        <motion.div
          initial={{opacity: 0, y: 50}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.8}}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{scale: 0}}
            whileInView={{scale: 1}}
            viewport={{once: true}}
            transition={{delay: 0.2, type: "spring"}}
            className="inline-block mb-8"
          >
            <div className="bg-gradient-to-r from-pink-600/80 to-purple-700/80 backdrop-blur-sm px-8 py-3 rounded-full border border-pink-400/30">
              <p className="text-white font-black text-lg tracking-wider uppercase">
                ✨ For The Very First Time! ✨
              </p>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            initial={{opacity: 0, scale: 0.9}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{delay: 0.3}}
            className="text-6xl md:text-8xl font-black mb-6 leading-tight"
          >
            <span className="block text-white mb-2">WOMEN'S</span>
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TOURNAMENT 2026
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.div
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true}}
            transition={{delay: 0.5}}
            className="max-w-3xl mx-auto"
          >
            <p className="text-2xl md:text-3xl text-pink-300/90 font-bold mb-4">
              OPEN FOR GIRLS AND ALL FEMALE FACULTIES
            </p>
            <p className="text-lg text-gray-400">
              Celebrating strength, skill, and sportsmanship in a spectacular
              tournament
            </p>
          </motion.div>
        </motion.div>

        {/* Date and Venue Card */}
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{delay: 0.6}}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="bg-white/5 backdrop-blur-xl border-2 border-pink-500/20 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Date */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-600/70 to-purple-700/70 backdrop-blur-sm rounded-2xl mb-4">
                  <span className="text-3xl">📅</span>
                </div>
                <h3 className="text-lg text-pink-400/90 font-semibold mb-2 uppercase tracking-wider">
                  Tournament Dates
                </h3>
                <p className="text-4xl md:text-5xl font-black text-white mb-2">
                  JAN 10-11
                </p>
                <p className="text-pink-300/80 text-lg">2026</p>
              </div>

              {/* Venue */}
              <div className="text-center md:text-left border-l-0 md:border-l-2 border-t-2 md:border-t-0 border-pink-500/20 pt-8 md:pt-0 md:pl-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-700/70 to-pink-600/70 backdrop-blur-sm rounded-2xl mb-4">
                  <span className="text-3xl">📍</span>
                </div>
                <h3 className="text-lg text-purple-400/90 font-semibold mb-2 uppercase tracking-wider">
                  Venue
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-white mb-2">
                  SGGSIE&T Campus
                </p>
                <p className="text-purple-300/80">Nanded, Maharashtra</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sports Categories with Images */}
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{delay: 0.7}}
          className="mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-black text-center mb-12 text-white">
            COMPETE IN
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              {
                name: "Tug of War",
                img: "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508886/zenith-26/img/Female-Tournament/tug-of-war",
              },
              {
                name: "Volleyball",
                img: "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508885/zenith-26/img/Female-Tournament/Vollyball",
              },
              {
                name: "Cricket",
                img: "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508880/zenith-26/img/Female-Tournament/Cricket",
              },
              {
                name: "Basketball",
                img: "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508879/zenith-26/img/Female-Tournament/BasketBall",
              },
              {
                name: "Football",
                img: "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508883/zenith-26/img/Female-Tournament/Ring-Football",
              },
              {
                name: "Box Cricket",
                img: "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508884/zenith-26/img/Female-Tournament/TurfCricket",
              },
            ].map((sport, index) => (
              <motion.div
                key={sport.name}
                initial={{opacity: 0, scale: 0.8}}
                whileInView={{opacity: 1, scale: 1}}
                viewport={{once: true}}
                transition={{delay: 0.1 * index}}
                whileHover={{scale: 1.05}}
                className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-purple-700/10" />
                <img
                  src={sport.img}
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-center text-sm md:text-base">
                    {sport.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{delay: 0.9}}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-pink-600/10 via-purple-700/10 to-pink-600/10 backdrop-blur-xl border-2 border-pink-500/20 rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
              READY TO COMPETE?
            </h3>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Register now and be part of this historic event. Show your skills
              and make history!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/women-tournament">
                <motion.button
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.95}}
                  className="px-12 py-5 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-xl rounded-full shadow-2xl shadow-pink-600/40 hover:shadow-pink-600/60 transition-all"
                >
                  REGISTER NOW
                </motion.button>
              </Link>

              <Link to="/women-tournament">
                <motion.button
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.95}}
                  className="px-12 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold text-xl rounded-full hover:bg-white/20 transition-all"
                >
                  VIEW DETAILS
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WomenTournamentPreview;
