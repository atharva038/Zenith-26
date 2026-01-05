// eslint-disable-next-line no-unused-vars
import {motion} from "framer-motion";
import {useState} from "react";

// Mentor data structure
const MENTORS_DATA = [
  {
    id: 1,
    name: "Manesh Kokare",
    role: "Director",
    designation: "SGGSIE&T",
    image:
      "https://res.cloudinary.com/dvmsho3pj/image/upload/v1767594715/zenith-26/img/mentors/director-manesh-kokare.jpg",
    gradient: "from-purple-600 to-blue-600",
    description:
      "ZENITH is an exhilarating State Level Sports event of SGGSIE&T, it's a platform for every student to showcase their talents and athletic skills. The beauty of it lies in its ability to bring together the entire sports enthusiasts and student community, since it is completely organised by students. In an era where sedentary lifestyles and academic pressures can affect our health, it is utmost crucial to emphasize the significance of physical activity and its positive impact on both mental and physical well being.",
  },
  {
    id: 2,
    name: "Prof.S.B.Dethe",
    role: "Dean",
    designation: "Student Affairs",
    image:
      "https://res.cloudinary.com/dvmsho3pj/image/upload/v1767595192/zenith-26/img/mentors/dean-sb-dethe.jpg",
    gradient: "from-pink-600 to-purple-600",
    description:
      "Zenith is a state level sports event organized by the students of SGGSIE&T consisting of various sports like basketball, football, volleyball, etc. various teams from all over the state of Maharashtra compete to celebrate the eternal glory. In an all one of the best events in the state, with all the fun and enjoyment for complete 3 days.",
  },
  {
    id: 3,
    name: "Dr. Jeet Patil",
    role: "Faculty Coordinator",
    // designation: "Sports Committee",
    image:
      "https://res.cloudinary.com/dvmsho3pj/image/upload/v1767595478/zenith-26/img/mentors/faculty-coordinator-jeet-patil.jpg",
    gradient: "from-orange-600 to-red-600",
    description:
      "Zenith is the festival of the sports organised by the sggs from decade for all the students around the Maharashtra. zenith sports teach us organized, well structure, dynamic behaviour of life so enjoy zenith 6. खेळाच्या जिद्धिने, खेळाच्या सामर्थ्याने, खेळाचे भविष्य बनवुया चला zenith २५ खेळुया",
  },
  {
    id: 4,
    name: "Mr. Tilak Jadhao",
    role: "Faculty Coordinator",
    // designation: "Sports Committee",
    image:
      "https://res.cloudinary.com/dvmsho3pj/image/upload/e_background_removal/v1767595695/zenith-26/img/mentors/faculty-coordinator-tilak-jadhao",
    gradient: "from-teal-600 to-cyan-600",
    description:
      "As a dedicated faculty coordinator, I believe in fostering a spirit of healthy competition and sportsmanship among students. Zenith provides an excellent platform for students to develop leadership skills, teamwork, and resilience while pursuing sporting excellence. Together, we create memories that last a lifetime.",
  },
  {
    id: 5,
    name: "Prof. Bhaskar Kadam",
    role: "Sports Incharge",
    // designation: "Current",
    image: "🏃‍♂️",
    gradient: "from-green-600 to-emerald-600",
    description:
      "As a sports incharge, it's my duty to encourage athletes to praticipate in such events. This event is bound to enhance your gameplay and team synergy. So teams, get warmed-up and be ready to give it all you got!!",
  },
  {
    id: 6,
    name: "Late Prof. R. B. Reddy",
    role: "Former Sports Incharge",
    // designation: "Legacy Builder",
    image: "🏅",
    gradient: "from-yellow-600 to-orange-600",
    description:
      "The previous Sports Incharge of the institute who has helped all the student athletes in their preparation and has set the bar sky high. Under his guidance the sports level of the institute had elevated and SGGS became a force to be reckoned with. We hope to grow under the shadow of your blessings reddy sir😇",
  },
];

// Mentor Card component with read more functionality
const MentorCard = ({mentor, index}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Truncate description to 2 lines (approximately 80 characters)
  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return {text, isTruncated: false};
    const truncated = text.slice(0, maxLength).trim();
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    return {
      text:
        lastSpaceIndex > 0
          ? truncated.slice(0, lastSpaceIndex) + "..."
          : truncated + "...",
      isTruncated: true,
    };
  };

  const {text: truncatedText, isTruncated} = truncateText(mentor.description);

  return (
    <motion.div
      className="group relative h-full"
      initial={{opacity: 0, y: 40}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-50px"}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-2xl p-8 border-2 border-[#3a2416] hover:border-[#ffb36a] transition-all duration-500 overflow-hidden h-full flex flex-col">
        {/* Hover Sparkles */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(6)].map((_, i) => (
            <Sparkle key={i} delay={i * 0.1} size={4} />
          ))}
        </div>

        {/* Gradient Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${mentor.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Avatar with Animation */}
          <motion.div
            className="mb-6 flex justify-center"
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{duration: 0.5}}
          >
            {mentor.image.startsWith("http") ? (
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-lg"
              />
            ) : (
              <span className="text-8xl">{mentor.image}</span>
            )}
          </motion.div>

          {/* Name and Role */}
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#ffb36a] transition-colors duration-300">
              {mentor.name}
            </h3>
            <p
              className={`text-lg font-semibold bg-gradient-to-r ${mentor.gradient} bg-clip-text text-transparent`}
            >
              {mentor.role}
            </p>
            <p className="text-sm text-gray-400 mt-1">{mentor.designation}</p>
          </div>

          {/* Description with Read More */}
          <div className="text-center text-sm group-hover:text-gray-300 transition-colors duration-300 flex-grow">
            <p className="text-gray-400 leading-relaxed">
              {isExpanded ? mentor.description : truncatedText}
            </p>
            {isTruncated && (
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-[#ffb36a] hover:text-[#ffd4a8] font-semibold text-xs transition-colors duration-300"
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
              >
                {isExpanded ? "▲ Read Less" : "▼ Read More"}
              </motion.button>
            )}
          </div>

          {/* Decorative Line */}
          <motion.div
            className="mt-6 h-1 bg-gradient-to-r from-transparent via-[#ffb36a] to-transparent rounded-full"
            initial={{scaleX: 0}}
            whileInView={{scaleX: 1}}
            viewport={{once: true}}
            transition={{duration: 0.8, delay: 0.3}}
          />
        </div>
      </div>

      {/* Floating Effect on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#ffb36a]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
        style={{transform: "translateY(10px)"}}
      />
    </motion.div>
  );
};

// Sparkle animation component
const Sparkle = ({delay = 0, size = 4}) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200"
    style={{
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      willChange: "transform, opacity",
      transform: "translate3d(0,0,0)",
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

export default function MentorsSection() {
  return (
    <section
      id="mentors"
      className="relative py-20 px-6 bg-gradient-to-b from-black via-[#0a0604] to-black overflow-hidden"
    >
      {/* Background Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Sparkle key={i} delay={i * 0.4} size={5} />
        ))}
      </div>

      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: "-50px"}}
          transition={{duration: 0.7, ease: "easeOut"}}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{scale: 0.8, opacity: 0}}
            whileInView={{scale: 1, opacity: 1}}
            viewport={{once: true}}
            transition={{duration: 0.6, ease: "backOut"}}
          >
            <span className="text-6xl">🌟</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] via-[#ff8b1f] to-[#ffb36a]">
            Our Guiding Lights
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            The visionaries and mentors who make Zenith a legendary sporting
            spectacle
          </p>
        </motion.div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MENTORS_DATA.map((mentor, index) => (
            <MentorCard key={mentor.id} mentor={mentor} index={index} />
          ))}
        </div>

        {/* Bottom Decorative Quote */}
        <motion.div
          className="mt-16 text-center"
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once: true}}
          transition={{duration: 1, delay: 0.5}}
        >
          <p className="text-xl italic text-gray-500 max-w-3xl mx-auto">
            "Behind every champion, there's a mentor who believed in their
            potential."
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="text-[#ffb36a] text-2xl"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ⭐
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
