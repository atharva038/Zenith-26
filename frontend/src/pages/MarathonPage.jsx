import {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import {motion, useInView, AnimatePresence} from "framer-motion";
import {toast} from "react-toastify";
import api from "../config/api";

/**
 * MarathonPage - Full marketing and registration page for Zenith Marathon
 */
const MarathonPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("hero");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Marathon date
  const marathonDate = new Date("2026-02-08T06:00:00");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = marathonDate - new Date();
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
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    {
      name: "5K Fun Run",
      distance: "5 KM",
      difficulty: "Beginner",
      price: "₹500",
      color: "from-green-400 to-emerald-600",
      icon: "🏃",
      description: "Perfect for beginners and fitness enthusiasts",
      benefits: ["Finisher Medal", "T-Shirt", "Refreshments", "E-Certificate"],
    },
    {
      name: "10K Challenge",
      distance: "10 KM",
      difficulty: "Intermediate",
      price: "₹500",
      color: "from-orange-400 to-red-600",
      icon: "🏃‍♂️",
      description: "For experienced runners seeking a challenge",
      benefits: [
        "Finisher Medal",
        "T-Shirt",
        "Refreshments",
        "E-Certificate",
        "Cash Prizes for Top 3",
      ],
    },
  ];

  const timeline = [
    {time: "5:00 AM", event: "Gates Open & Check-in", icon: "🚪"},
    {time: "5:30 AM", event: "Warm-up Session", icon: "🤸"},
    {time: "5:45 AM", event: "Flag-off Ceremony", icon: "🎌"},
    {time: "6:00 AM", event: "Race Starts!", icon: "🏁"},
    {time: "8:00 AM", event: "Prize Distribution", icon: "🏆"},
    {time: "9:00 AM", event: "Breakfast & Networking", icon: "☕"},
  ];

  const faqs = [
    {
      q: "Who can participate?",
      a: "Anyone above 16 years of age can participate. Students, faculty, and external participants are all welcome!",
    },
    {
      q: "What's included in the registration?",
      a: "Registration includes a race bib, timing chip, finisher medal, event t-shirt, refreshments, and e-certificate.",
    },
    {
      q: "Is there parking available?",
      a: "Yes, free parking is available at SGGSIE&T campus. We recommend arriving early.",
    },
    {
      q: "What if it rains?",
      a: "The marathon will proceed rain or shine. In case of severe weather, we'll notify all participants.",
    },
    {
      q: "Can I get a refund?",
      a: "Registrations are non-refundable but transferable to another participant up to 5 days before the event.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <span className="text-2xl">🏃</span>
            <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              ZENITH MARATHON
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#about"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              About
            </a>
            <a
              href="#categories"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              Categories
            </a>
            <a
              href="#schedule"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              Schedule
            </a>
            <a
              href="#faq"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              FAQ
            </a>
          </div>

          <button
            onClick={() => navigate("/marathon")}
            className="px-6 py-2 rounded-full font-bold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            Register Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(255,100,50,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,200,50,0.1) 0%, transparent 50%)",
            }}
          />

          {/* Running track pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {[...Array(8)].map((_, i) => (
              <motion.line
                key={i}
                x1="0"
                y1={10 + i * 12}
                x2="100"
                y2={10 + i * 12}
                stroke="rgba(255,140,50,0.5)"
                strokeWidth="0.3"
                initial={{pathLength: 0}}
                animate={{pathLength: 1}}
                transition={{duration: 2, delay: i * 0.1}}
              />
            ))}
          </svg>

          {/* Animated runner silhouettes */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-6xl opacity-10"
                style={{
                  top: `${20 + i * 15}%`,
                  left: "-100px",
                }}
                animate={{
                  x: ["0vw", "120vw"],
                }}
                transition={{
                  duration: 15 + i * 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 2,
                }}
              >
                🏃‍♂️
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* Pre-event badge */}
          <motion.div
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300">
              🔥 PRE-ZENITH EVENT • FEBRUARY 8, 2026
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.1}}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">
              ZENITH
            </span>
            <br />
            <span className="text-white">MARATHON 2026</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6, delay: 0.3}}
          >
            Run through history. Race towards glory.
            <br />
            <span className="text-orange-400">
              The first-ever SGGSIE&T campus marathon.
            </span>
          </motion.p>

          {/* Countdown */}
          <motion.div
            className="flex justify-center gap-4 md:gap-8 mb-10"
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.6, delay: 0.4}}
          >
            {[
              {value: timeLeft.days, label: "Days"},
              {value: timeLeft.hours, label: "Hours"},
              {value: timeLeft.minutes, label: "Minutes"},
              {value: timeLeft.seconds, label: "Seconds"},
            ].map((item, i) => (
              <div key={i} className="text-center">
                <motion.div
                  className="w-16 h-16 md:w-24 md:h-24 rounded-xl flex items-center justify-center mb-2"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,100,50,0.2) 0%, rgba(0,0,0,0.5) 100%)",
                    border: "1px solid rgba(255,140,50,0.3)",
                    boxShadow: "0 10px 30px rgba(255,100,50,0.1)",
                  }}
                  key={item.value}
                  initial={{scale: 1}}
                  animate={{scale: [1, 1.05, 1]}}
                  transition={{duration: 0.3}}
                >
                  <span className="text-2xl md:text-4xl font-bold text-white">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </motion.div>
                <span className="text-xs md:text-sm text-gray-400">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.5}}
          >
            <button
              onClick={() => navigate("/marathon")}
              className="px-8 py-4 rounded-full font-bold text-lg text-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105"
            >
              🏃 Register Now - ₹500
            </button>
            <a
              href="#categories"
              className="px-8 py-4 rounded-full font-bold text-lg text-orange-300 border-2 border-orange-500/50 hover:bg-orange-500/10 transition-all"
            >
              View Categories
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex justify-center gap-8 md:gap-16 mt-12 pt-8 border-t border-gray-800"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6, delay: 0.7}}
          >
            {[
              {number: "500+", label: "Expected Runners"},
              {number: "2", label: "Race Categories"},
              {number: "₹50K+", label: "Prize Pool"},
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  {stat.number}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{y: [0, 10, 0]}}
          transition={{duration: 2, repeat: Infinity}}
        >
          <div className="w-6 h-10 rounded-full border-2 border-orange-500/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-orange-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="About The Race" subtitle="Why Run With Us?" />

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{opacity: 0, x: -30}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6}}
            >
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The{" "}
                <span className="text-orange-400 font-semibold">
                  Zenith Marathon 2026
                </span>{" "}
                marks a historic moment as the first-ever marathon organized at
                SGGSIE&T Nanded. This pre-Zenith event sets the stage for the
                main sports festival, bringing together runners from across
                Maharashtra.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Run through the beautiful campus roads, experience the morning
                breeze, and be part of something that will become an annual
                tradition. Whether you're a seasoned marathoner or a first-time
                runner, this is your chance to make history.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {icon: "📍", text: "SGGSIE&T Campus"},
                  {icon: "📅", text: "February 8, 2026"},
                  {icon: "⏰", text: "6:00 AM Start"},
                  {icon: "🎖️", text: "Medals for All"},
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{opacity: 0, x: 30}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, delay: 0.2}}
            >
              {/* Route map placeholder */}
              <div
                className="aspect-square rounded-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,100,50,0.1) 0%, rgba(0,0,0,0.8) 100%)",
                  border: "1px solid rgba(255,140,50,0.2)",
                }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                  <span className="text-8xl mb-4">🗺️</span>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Race Route
                  </h3>
                  <p className="text-gray-400">
                    A scenic route through SGGSIE&T campus covering iconic
                    landmarks
                  </p>
                  <div className="mt-4 flex gap-4">
                    <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm">
                      5K Route
                    </div>
                    <div className="px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm">
                      10K Route
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle
            title="Race Categories"
            subtitle="Choose Your Challenge"
          />

          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, i) => (
              <motion.div
                key={i}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(30,30,30,1) 0%, rgba(20,20,20,1) 100%)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.5, delay: i * 0.1}}
                whileHover={{scale: 1.02}}
              >
                {/* Gradient header */}
                <div className={`h-2 bg-gradient-to-r ${category.color}`} />

                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="text-5xl mb-2 block">
                        {category.icon}
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        {category.name}
                      </h3>
                      <p className="text-gray-400">{category.description}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-4xl font-black bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                      >
                        {category.distance}
                      </span>
                      <p className="text-sm text-gray-500">
                        {category.difficulty}
                      </p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2 mb-6">
                    {category.benefits.map((benefit, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 text-gray-300"
                      >
                        <span className="text-green-400">✓</span>
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                    <div>
                      <span className="text-3xl font-bold text-white">
                        {category.price}
                      </span>
                      <span className="text-gray-400 ml-2">/ person</span>
                    </div>
                    <button
                      onClick={() => navigate("/marathon")}
                      className={`px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r ${category.color} hover:shadow-lg transition-all`}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle title="Race Day Schedule" subtitle="February 8, 2026" />

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-yellow-500 to-orange-500" />

            {timeline.map((item, i) => (
              <motion.div
                key={i}
                className="relative pl-20 pb-8"
                initial={{opacity: 0, x: -20}}
                whileInView={{opacity: 1, x: 0}}
                viewport={{once: true}}
                transition={{duration: 0.4, delay: i * 0.1}}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 border-4 border-black" />

                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="text-orange-400 font-bold">{item.time}</p>
                      <p className="text-white text-lg">{item.event}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4">
          <SectionTitle title="FAQ" subtitle="Got Questions?" />

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6}}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">
                Ready to Run?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 500+ runners in making history at the first-ever SGGSIE&T
              campus marathon.
            </p>

            <button
              onClick={() => navigate("/marathon")}
              className="px-12 py-5 rounded-full font-bold text-xl text-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 hover:shadow-2xl hover:shadow-orange-500/40 transition-all transform hover:scale-105"
            >
              🏃 Register for ₹500
            </button>

            <p className="mt-6 text-gray-500">
              Limited slots available. Early bird registration closes soon!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏃</span>
              <span className="font-bold text-orange-400">
                ZENITH MARATHON 2026
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              A pre-event of Zenith 2026 • SGGSIE&T Annual Sports Festival
            </p>
            <Link
              to="/home"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              ← Back to Zenith
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Section Title Component
const SectionTitle = ({title, subtitle}) => (
  <motion.div
    className="text-center mb-12"
    initial={{opacity: 0, y: 20}}
    whileInView={{opacity: 1, y: 0}}
    viewport={{once: true}}
    transition={{duration: 0.5}}
  >
    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{title}</h2>
    <p className="text-orange-400">{subtitle}</p>
  </motion.div>
);

// FAQ Item Component
const FAQItem = ({question, answer, index}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.4, delay: index * 0.05}}
    >
      <button
        className="w-full p-5 text-left flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-white">{question}</span>
        <motion.span
          className="text-orange-400 text-2xl"
          animate={{rotate: isOpen ? 45 : 0}}
          transition={{duration: 0.2}}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.2}}
            className="px-5 pb-5 text-gray-400"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MarathonPage;
