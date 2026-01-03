import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {
  SackRaceIcon,
  ThreeLegRaceIcon,
  BalloonIcon,
  BrickIcon,
  MusicalChairIcon,
  LemonSpoonIcon,
  PowerliftingIcon,
  WeightliftingIcon,
  HandkerchiefIcon,
  BadmintonIcon,
  ChessIcon,
  CarromIcon,
  TugOfWarIcon,
  VolleyballIcon,
  CricketIcon,
  BasketballIcon,
  FootballIcon,
  BoxCricketIcon,
} from "../components/SportIcons";

const WomenTournamentPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    sport: "",
    category: "individual",
    teamName: "",
    teamSize: 1,
  });

  const sports = [
    // 1st Category: 49/- (Unlimited Pool)
    {
      id: "sack-race",
      name: "Sack Race",
      icon: SackRaceIcon,
      color: "from-yellow-500 to-orange-500",
      teamSize: 1,
      category: "1st Category",
      fee: 49,
      description: "Fun-filled hopping race in sacks",
    },
    {
      id: "3-leg-race",
      name: "3 Leg Race",
      icon: ThreeLegRaceIcon,
      color: "from-green-500 to-teal-500",
      teamSize: 2,
      category: "1st Category",
      fee: 49,
      description: "Teamwork race with legs tied together",
    },
    {
      id: "balloon-bursting",
      name: "Balloon Bursting",
      icon: BalloonIcon,
      color: "from-pink-500 to-rose-500",
      teamSize: 1,
      category: "1st Category",
      fee: 49,
      description: "Fast-paced balloon popping challenge",
    },
    {
      id: "brick-race",
      name: "Brick Race",
      icon: BrickIcon,
      color: "from-red-500 to-orange-600",
      teamSize: 1,
      category: "1st Category",
      fee: 49,
      description: "Balance and speed with bricks",
    },
    {
      id: "musical-chair",
      name: "Musical Chair",
      icon: MusicalChairIcon,
      color: "from-purple-500 to-pink-500",
      teamSize: 1,
      category: "1st Category",
      fee: 49,
      description: "Classic game of quick reflexes",
    },
    {
      id: "nimbu-chamach",
      name: "Nimbu Chamach",
      icon: LemonSpoonIcon,
      color: "from-lime-500 to-green-500",
      teamSize: 1,
      category: "1st Category",
      fee: 49,
      description: "Lemon and spoon balance race",
    },
    {
      id: "powerlifting",
      name: "Powerlifting",
      icon: PowerliftingIcon,
      color: "from-gray-600 to-gray-800",
      teamSize: 1,
      category: "1st Category",
      fee: 49,
      description: "Strength competition event",
    },
    {
      id: "weightlifting",
      name: "Weightlifting",
      icon: WeightliftingIcon,
      color: "from-blue-600 to-indigo-600",
      teamSize: 1,
      category: "1st Category",
      fee: 49,
      description: "Olympic-style lifting competition",
    },
    {
      id: "hankerchief-snash",
      name: "Hankerchief Snash",
      icon: HandkerchiefIcon,
      color: "from-cyan-500 to-blue-500",
      teamSize: 1,
      category: "1st Category",
      fee: 49,
      description: "Quick grab and dash game",
    },

    // 2nd Category: 49/- Per Game
    {
      id: "badminton",
      name: "Badminton",
      icon: BadmintonIcon,
      color: "from-purple-500 to-pink-500",
      teamSize: 1,
      category: "2nd Category",
      fee: 49,
      description: "Swift racket sport testing reflexes",
    },
    {
      id: "chess",
      name: "Chess",
      icon: ChessIcon,
      color: "from-slate-700 to-slate-900",
      teamSize: 1,
      category: "2nd Category",
      fee: 49,
      description: "Strategic board game of intellect",
    },
    {
      id: "carrom",
      name: "Carrom",
      icon: CarromIcon,
      color: "from-amber-600 to-yellow-700",
      teamSize: 1,
      category: "2nd Category",
      fee: 49,
      description: "Strike and pocket board game",
    },

    // 3rd Category: 199/- Per Team
    {
      id: "tug-of-war",
      name: "Tug of War",
      icon: TugOfWarIcon,
      color: "from-orange-500 to-red-600",
      teamSize: 8,
      category: "3rd Category",
      fee: 199,
      description: "Ultimate team strength battle",
    },
    {
      id: "volleyball",
      name: "Volleyball",
      icon: VolleyballIcon,
      color: "from-blue-500 to-cyan-500",
      teamSize: 6,
      category: "3rd Category",
      fee: 199,
      description: "Dynamic court game of teamwork",
    },
    {
      id: "cricket",
      name: "Cricket",
      icon: CricketIcon,
      color: "from-green-600 to-emerald-600",
      teamSize: 11,
      category: "3rd Category",
      fee: 199,
      description: "Classic batting and bowling sport",
    },
    {
      id: "basketball-3x3",
      name: "Basketball 3x3",
      icon: BasketballIcon,
      color: "from-orange-600 to-red-500",
      teamSize: 3,
      category: "3rd Category",
      fee: 199,
      description: "Fast-paced half-court basketball",
    },
    {
      id: "rink-football",
      name: "Rink Football",
      icon: FootballIcon,
      color: "from-green-500 to-teal-600",
      teamSize: 5,
      category: "3rd Category",
      fee: 199,
      description: "Indoor mini football competition",
    },
    {
      id: "box-cricket",
      name: "Box Cricket",
      icon: BoxCricketIcon,
      color: "from-indigo-600 to-purple-600",
      teamSize: 6,
      category: "3rd Category",
      fee: 199,
      description: "Compact cricket in enclosed space",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Registration submitted! We'll contact you soon.");
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (selectedSport) {
      const detailsSection = document.getElementById("registration-form");
      if (detailsSection) {
        detailsSection.scrollIntoView({behavior: "smooth", block: "start"});
      }
    }
  }, [selectedSport]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-black"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
              >
                Zenith'26
              </Link>

              <div className="hidden md:flex space-x-8">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/events"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Events
                </Link>
                <Link
                  to="/gallery"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Gallery
                </Link>
              </div>

              <button
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{opacity: 0, height: 0}}
                animate={{opacity: 1, height: "auto"}}
                exit={{opacity: 0, height: 0}}
                className="md:hidden bg-black/60 backdrop-blur-md border-t border-white/10"
              >
                <div className="px-4 py-4 space-y-3">
                  <Link
                    to="/"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/events"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Events
                  </Link>
                  <Link
                    to="/gallery"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Gallery
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="max-w-7xl mx-auto px-4 py-16 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Women's Tournament 2026
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Celebrating strength, skill, and sportsmanship. Join us for an
            unforgettable tournament experience!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#details"
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105"
            >
              Register Now
            </a>
            <Link
              to="/"
              className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>

        {/* Sports Selection */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.3}}
          id="details"
          className="max-w-7xl mx-auto px-4 py-12"
        >
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Choose Your Sport
          </h2>

          {/* Category 1: 49/- Unlimited Pool */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                1ST CATEGORY: ₹49/- (UNLIMITED POOL)
              </h3>
              <p className="text-gray-300">
                Join multiple events at a fixed price!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sports
                .filter((s) => s.category === "1st Category")
                .map((sport, index) => (
                  <motion.div
                    key={sport.id}
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: 0.1 * index}}
                    whileHover={{scale: 1.05, y: -10}}
                    onClick={() => {
                      setSelectedSport(sport);
                      setFormData({...formData, sport: sport.name});
                    }}
                    className={`cursor-pointer bg-gradient-to-br ${
                      sport.color
                    } p-1 rounded-2xl ${
                      selectedSport?.id === sport.id ? "ring-4 ring-white" : ""
                    }`}
                  >
                    <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 h-full">
                      <div className="text-center">
                        <div className="mb-3 flex justify-center">
                          <sport.icon className="w-16 h-16 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">
                          {sport.name}
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                          {sport.description}
                        </p>
                        <div className="inline-block px-3 py-1.5 bg-white/10 rounded-full mb-2">
                          <span className="text-sm font-semibold">
                            {sport.teamSize === 1
                              ? "Individual"
                              : `Team of ${sport.teamSize}`}
                          </span>
                        </div>
                        <div className="text-yellow-400 font-bold text-lg">
                          ₹{sport.fee}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Category 2: 49/- Per Game */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                2ND CATEGORY: ₹49/- PER GAME
              </h3>
              <p className="text-gray-300">Individual sport competitions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sports
                .filter((s) => s.category === "2nd Category")
                .map((sport, index) => (
                  <motion.div
                    key={sport.id}
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: 0.1 * index}}
                    whileHover={{scale: 1.05, y: -10}}
                    onClick={() => {
                      setSelectedSport(sport);
                      setFormData({...formData, sport: sport.name});
                    }}
                    className={`cursor-pointer bg-gradient-to-br ${
                      sport.color
                    } p-1 rounded-2xl ${
                      selectedSport?.id === sport.id ? "ring-4 ring-white" : ""
                    }`}
                  >
                    <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 h-full">
                      <div className="text-center">
                        <div className="mb-3 flex justify-center">
                          <sport.icon className="w-16 h-16 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">
                          {sport.name}
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                          {sport.description}
                        </p>
                        <div className="inline-block px-3 py-1.5 bg-white/10 rounded-full mb-2">
                          <span className="text-sm font-semibold">
                            {sport.teamSize === 1
                              ? "Individual"
                              : `Team of ${sport.teamSize}`}
                          </span>
                        </div>
                        <div className="text-purple-400 font-bold text-lg">
                          ₹{sport.fee}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Category 3: 199/- Per Team */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-6 mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                3RD CATEGORY: ₹199/- PER TEAM
              </h3>
              <p className="text-gray-300">Team-based competitions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sports
                .filter((s) => s.category === "3rd Category")
                .map((sport, index) => (
                  <motion.div
                    key={sport.id}
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: 0.1 * index}}
                    whileHover={{scale: 1.05, y: -10}}
                    onClick={() => {
                      setSelectedSport(sport);
                      setFormData({...formData, sport: sport.name});
                    }}
                    className={`cursor-pointer bg-gradient-to-br ${
                      sport.color
                    } p-1 rounded-2xl ${
                      selectedSport?.id === sport.id ? "ring-4 ring-white" : ""
                    }`}
                  >
                    <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 h-full">
                      <div className="text-center">
                        <div className="mb-3 flex justify-center">
                          <sport.icon className="w-16 h-16 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">
                          {sport.name}
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                          {sport.description}
                        </p>
                        <div className="inline-block px-3 py-1.5 bg-white/10 rounded-full mb-2">
                          <span className="text-sm font-semibold">
                            Team of {sport.teamSize}
                          </span>
                        </div>
                        <div className="text-blue-400 font-bold text-lg">
                          ₹{sport.fee}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.div>

        {/* Registration Form */}
        {selectedSport && (
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            id="registration-form"
            className="max-w-4xl mx-auto px-4 py-16"
          >
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              <h3 className="text-3xl font-bold mb-6 text-center">
                Register for {selectedSport.name}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    College/Organization
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {selectedSport.teamSize > 1 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Team size required: {selectedSport.teamSize} members
                    </p>
                  </div>
                )}

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Selected Sport:</span>{" "}
                    {selectedSport.name}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    <span className="font-semibold">Registration Fee:</span> ₹
                    {selectedSport.fee}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105"
                >
                  Submit Registration
                </button>
              </form>

              <button
                onClick={() => setSelectedSport(null)}
                className="mt-6 w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Choose Different Sport
              </button>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 mt-20 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400">© 2026 Zenith. All rights reserved.</p>
            <p className="text-gray-500 text-sm mt-2">
              Empowering women through sports
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WomenTournamentPage;
