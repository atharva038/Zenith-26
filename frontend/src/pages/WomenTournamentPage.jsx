import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {toast} from "react-toastify";
import api from "../config/api";
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
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registrationNumber: "",
    mobileNumber: "",
    selectedSports: [],
    category3TeamName: "",
    paymentScreenshotUrl: "",
  });

  const sports = [
    // 1st Category: 49/- (Unlimited Pool)
    {
      id: "sack-race",
      name: "Sack Race",
      icon: SackRaceIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767510042/zenith-26/img/Female-Tournament/1st-Category/SackRace",
      color: "from-yellow-500 to-orange-500",
      teamSize: 1,
      category: "category1",
      fee: 49,
      description: "Fun-filled hopping race in sacks",
    },
    {
      id: "3-leg-race",
      name: "3 Leg Race",
      icon: ThreeLegRaceIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767510044/zenith-26/img/Female-Tournament/1st-Category/3leg",
      color: "from-green-500 to-teal-500",
      teamSize: 2,
      category: "category1",
      fee: 49,
      description: "Teamwork race with legs tied together",
    },
    {
      id: "balloon-bursting",
      name: "Balloon Bursting",
      icon: BalloonIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767510045/zenith-26/img/Female-Tournament/1st-Category/BallonBursting",
      color: "from-pink-500 to-rose-500",
      teamSize: 1,
      category: "category1",
      fee: 49,
      description: "Fast-paced balloon popping challenge",
    },
    {
      id: "brick-race",
      name: "Brick Race",
      icon: BrickIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767510046/zenith-26/img/Female-Tournament/1st-Category/BrickRace",
      color: "from-red-500 to-orange-600",
      teamSize: 1,
      category: "category1",
      fee: 49,
      description: "Balance and speed with bricks",
    },
    {
      id: "musical-chair",
      name: "Musical Chair",
      icon: MusicalChairIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767510047/zenith-26/img/Female-Tournament/1st-Category/MusicalChair",
      color: "from-purple-500 to-pink-500",
      teamSize: 1,
      category: "category1",
      fee: 49,
      description: "Classic game of quick reflexes",
    },
    {
      id: "nimbu-chamach",
      name: "Nimbu Chamach",
      icon: LemonSpoonIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767510048/zenith-26/img/Female-Tournament/1st-Category/NimbuChamcha",
      color: "from-lime-500 to-green-500",
      teamSize: 1,
      category: "category1",
      fee: 49,
      description: "Lemon and spoon balance race",
    },
    {
      id: "powerlifting",
      name: "Powerlifting",
      icon: PowerliftingIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767510049/zenith-26/img/Female-Tournament/1st-Category/PowerLifting",
      color: "from-gray-600 to-gray-800",
      teamSize: 1,
      category: "category1",
      fee: 49,
      description: "Strength competition event",
    },
    {
      id: "weightlifting",
      name: "Weightlifting",
      icon: WeightliftingIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767510050/zenith-26/img/Female-Tournament/1st-Category/WeighLifting",
      color: "from-blue-600 to-indigo-600",
      teamSize: 1,
      category: "category1",
      fee: 49,
      description: "Olympic-style lifting competition",
    },
    {
      id: "hankerchief-snash",
      name: "Hankerchief Snash",
      icon: HandkerchiefIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767510051/zenith-26/img/Female-Tournament/1st-Category/HankerChiefSnash",
      color: "from-cyan-500 to-blue-500",
      teamSize: 1,
      category: "category1",
      fee: 49,
      description: "Quick grab and dash game",
    },

    // 2nd Category: 49/- Per Game
    {
      id: "badminton",
      name: "Badminton",
      icon: BadmintonIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767543425/zenith-26/img/category2/Badminton.png",
      color: "from-purple-500 to-pink-500",
      teamSize: 1,
      category: "category2",
      fee: 49,
      description: "Swift racket sport testing reflexes",
    },
    {
      id: "chess",
      name: "Chess",
      icon: ChessIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767543428/zenith-26/img/category2/Chess.png",
      color: "from-slate-700 to-slate-900",
      teamSize: 1,
      category: "category2",
      fee: 49,
      description: "Strategic board game of intellect",
    },
    {
      id: "carrom",
      name: "Carrom",
      icon: CarromIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767543431/zenith-26/img/category2/Carrom.png",
      color: "from-amber-600 to-yellow-700",
      teamSize: 1,
      category: "category2",
      fee: 49,
      description: "Strike and pocket board game",
    },
    {
      id: "athletics",
      name: "Athletics",
      icon: ThreeLegRaceIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767543732/zenith-26/img/category2/Athletics.png",
      color: "from-red-500 to-orange-600",
      teamSize: 1,
      category: "category2",
      fee: 49,
      description: "Track and field running events",
    },

    // 3rd Category: 199/- Per Team
    {
      id: "tug-of-war",
      name: "Tug of War",
      icon: TugOfWarIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508886/zenith-26/img/Female-Tournament/tug-of-war",
      color: "from-orange-500 to-red-600",
      teamSize: 8,
      category: "category3",
      fee: 199,
      description: "Ultimate team strength battle",
    },
    {
      id: "volleyball",
      name: "Volleyball",
      icon: VolleyballIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508885/zenith-26/img/Female-Tournament/Vollyball",
      color: "from-blue-500 to-cyan-500",
      teamSize: 6,
      category: "category3",
      fee: 199,
      description: "Dynamic court game of teamwork",
    },
    {
      id: "cricket",
      name: "Cricket",
      icon: CricketIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508880/zenith-26/img/Female-Tournament/Cricket",
      color: "from-green-600 to-emerald-600",
      teamSize: 11,
      category: "category3",
      fee: 199,
      description: "Classic batting and bowling sport",
    },
    {
      id: "basketball-3x3",
      name: "Basketball 3x3",
      icon: BasketballIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508879/zenith-26/img/Female-Tournament/BasketBall",
      color: "from-orange-600 to-red-500",
      teamSize: 3,
      category: "category3",
      fee: 199,
      description: "Fast-paced half-court basketball",
    },
    {
      id: "rink-football",
      name: "Rink Football",
      icon: FootballIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508883/zenith-26/img/Female-Tournament/Ring-Football",
      color: "from-green-500 to-teal-600",
      teamSize: 5,
      category: "category3",
      fee: 199,
      description: "Indoor mini football competition",
    },
    {
      id: "box-cricket",
      name: "Box Cricket",
      icon: BoxCricketIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767508884/zenith-26/img/Female-Tournament/TurfCricket",
      color: "from-indigo-600 to-purple-600",
      teamSize: 6,
      category: "category3",
      fee: 199,
      description: "Compact cricket in enclosed space",
    },
  ];

  // QR Codes for each category (dummy QR codes for now)
  const qrCodes = {
    category1:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CATEGORY1-PAYMENT-49-RUPEES",
    category2:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CATEGORY2-PAYMENT-49-RUPEES",
    category3:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CATEGORY3-PAYMENT-199-RUPEES",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!formData.email) {
      toast.error("Please enter your email address!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    // Validate at least one sport is selected
    if (formData.selectedSports.length === 0) {
      toast.error("Please select at least one sport!");
      return;
    }

    // Validate team name for category 3
    const hasCategory3Sports = formData.selectedSports.some((sport) => {
      const category3Sports = [
        "Tug of War",
        "Volleyball",
        "Cricket",
        "Basketball",
        "Football",
        "Box Cricket",
      ];
      return category3Sports.includes(sport);
    });

    if (hasCategory3Sports && !formData.category3TeamName) {
      toast.error("Please enter a team name for Category 3 sports!");
      return;
    }

    // Validate payment screenshot is uploaded
    if (!formData.paymentScreenshotUrl) {
      toast.error("Please upload payment screenshot!");
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Submitting registration...");

      // Submit to backend
      const response = await api.post("/women-tournament/register", {
        name: formData.name,
        email: formData.email,
        registrationNumber: formData.registrationNumber,
        mobileNumber: formData.mobileNumber,
        selectedCategory: formData.selectedCategory,
        selectedSports: formData.selectedSports,
        category3TeamName: formData.category3TeamName || undefined,
        paymentScreenshot: formData.paymentScreenshotUrl, // Cloudinary URL
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.data.success) {
        toast.success(
          `Registration submitted successfully! Your registration is pending admin approval. Total Amount: ₹${response.data.data.totalAmount}`,
          {
            duration: 6000, // Show for 6 seconds
          }
        );

        // Show additional info toast
        toast.info(
          "Admin will review your payment screenshot and approve your registration soon.",
          {
            duration: 5000,
          }
        );

        // Reset form
        setFormData({
          name: "",
          email: "",
          registrationNumber: "",
          mobileNumber: "",
          selectedSports: [],
          category3TeamName: "",
          selectedCategory: "",
          paymentScreenshotUrl: "",
        });
        setPaymentScreenshot(null);
        setScreenshotPreview(null);
        setShowRegistrationForm(false);
      }
    } catch (error) {
      console.error("Registration Error:", error);

      // Dismiss loading toast if any
      toast.dismiss();

      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit registration. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleCheckboxChange = (sportName) => {
    setFormData((prev) => {
      const currentSports = prev.selectedSports;

      if (currentSports.includes(sportName)) {
        // Remove sport
        return {
          ...prev,
          selectedSports: currentSports.filter((s) => s !== sportName),
        };
      } else {
        // Add sport
        return {
          ...prev,
          selectedSports: [...currentSports, sportName],
        };
      }
    });
  };

  const handleScreenshotChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG) or PDF file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setPaymentScreenshot(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setScreenshotPreview("PDF");
    }

    // Upload the file immediately
    try {
      setIsUploadingScreenshot(true);
      const uploadToast = toast.loading("Uploading payment screenshot...");

      const formDataToUpload = new FormData();
      formDataToUpload.append("screenshot", file);

      const response = await api.post(
        "/women-tournament/upload-payment-screenshot",
        formDataToUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss(uploadToast);

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          paymentScreenshotUrl: response.data.url,
        }));
        toast.success("Payment screenshot uploaded successfully!");
      }
    } catch (error) {
      console.error("Screenshot upload error:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload screenshot"
      );
      setPaymentScreenshot(null);
      setScreenshotPreview(null);
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const handleRemoveScreenshot = () => {
    setPaymentScreenshot(null);
    setScreenshotPreview(null);
    setFormData((prev) => ({
      ...prev,
      paymentScreenshotUrl: "",
    }));
  };

  const handleChange = (e) => {
    const {name, value} = e.target;

    // If category is being changed, clear selected sports and team name
    if (name === "selectedCategory") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        selectedSports: [], // Clear sports when category changes
        category3TeamName: "", // Clear team name when category changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const scrollToForm = () => {
    setShowRegistrationForm(true);
    // Use setTimeout to ensure the form is rendered before scrolling
    setTimeout(() => {
      const formSection = document.getElementById("registration-form");
      if (formSection) {
        formSection.scrollIntoView({behavior: "smooth", block: "start"});
      }
    }, 100);
  };

  useEffect(() => {
    if (showRegistrationForm) {
      const formSection = document.getElementById("registration-form");
      if (formSection) {
        formSection.scrollIntoView({behavior: "smooth", block: "start"});
      }
    }
  }, [showRegistrationForm]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Image with Subtle Overlay */}
      <div className="fixed inset-0 z-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:good/v1767513046/zenith-26/img/backgrounds/women-tournament-bg')`,
          }}
        ></div>
        {/* Dark overlay for better readability - no pink tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/75 to-black/80"></div>
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 px-9 py-5 flex justify-between items-center z-[600] bg-black/10 backdrop-blur-md">
          <span
            className="text-[#ffb77a] font-bold text-xl tracking-wide"
            style={{textShadow: "0 2px 12px rgba(255,140,40,0.18)"}}
          >
            Zenith 2026
          </span>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            <Link
              to="/home"
              className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
            >
              Home
            </Link>
            <a
              href="/home#about"
              className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
            >
              About
            </a>
            <a
              href="/home#events"
              className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
            >
              Events
            </a>
            <a
              href="/home#wormhole"
              className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors flex items-center gap-1"
            >
              🌀 Portal
            </a>
            <a
              href="/home#vip-guests"
              className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
            >
              VIP Guests
            </a>
            <Link
              to="/gallery"
              className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
            >
              Gallery
            </Link>
            <Link
              to="/register"
              className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#ffb77a] z-[700]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* BACKDROP */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/70 z-[650] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* MOBILE MENU */}
          {mobileMenuOpen && (
            <div className="fixed top-16 left-0 right-0 bg-black/90 backdrop-blur-xl p-6 z-[700] border-b border-[#3a2416] animate-slideDown md:hidden">
              <div className="flex flex-col gap-4">
                <Link
                  to="/home"
                  className="text-[#ffb77a] font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <a
                  href="/home#about"
                  className="text-[#ffb77a] font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
                <a
                  href="/home#events"
                  className="text-[#ffb77a] font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Events
                </a>
                <a
                  href="/home#wormhole"
                  className="text-[#ffb77a] font-semibold flex items-center gap-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🌀 Portal
                </a>
                <a
                  href="/home#vip-guests"
                  className="text-[#ffb77a] font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  VIP Guests
                </a>
                <Link
                  to="/gallery"
                  className="text-[#ffb77a] font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gallery
                </Link>
                <Link
                  to="/register"
                  className="text-[#ffb77a] font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center"
        >
          <motion.div
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
            className="inline-block px-6 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full mb-6"
          >
            <span className="text-pink-400 font-semibold text-sm uppercase tracking-wider">
              Women's Tournament 2026
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight">
            Women's Tournament <span className="text-pink-400">2026</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Celebrating strength, skill, and sportsmanship. Join us for an
            unforgettable tournament experience!
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={scrollToForm}
              className="px-8 py-4 bg-pink-500 hover:bg-pink-600 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg shadow-pink-500/50"
            >
              Register Now
            </button>
            <Link
              to="/"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all text-white"
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
          className="max-w-7xl mx-auto px-4 py-16"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Sport
            </h2>
            <p className="text-gray-400 text-lg">
              Select from our exciting range of sports and events
            </p>
          </div>

          {/* Category 1: 49/- Unlimited Pool */}
          <motion.div
            className="mb-20"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.4}}
          >
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-8 mb-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    1ST CATEGORY: ₹49/- (UNLIMITED POOL)
                  </h3>
                  <p className="text-gray-300 text-lg">
                    Join multiple events at a fixed price! Best value for
                    multiple sports.
                  </p>
                </div>
                <button
                  onClick={scrollToForm}
                  className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-bold text-black transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30 whitespace-nowrap"
                >
                  Register Now
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {sports
                .filter((s) => s.category === "category1")
                .map((sport, index) => (
                  <motion.div
                    key={sport.id}
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: 0.1 * index}}
                    whileHover={{scale: 1.02, y: -5}}
                    className="cursor-pointer group"
                  >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl overflow-hidden h-full hover:border-yellow-400/50 hover:bg-white/10 transition-all duration-300">
                      {/* Image Section - Square box on mobile, wide on desktop */}
                      {sport.image && (
                        <div className="relative w-full h-32 md:h-56 overflow-hidden">
                          <img
                            src={sport.image}
                            alt={sport.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </div>
                      )}

                      {/* Content Section - Very compact on mobile */}
                      <div className="p-2 md:p-6">
                        {!sport.image && (
                          <div className="mb-1 md:mb-4 flex justify-center">
                            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-yellow-500/10 flex items-center justify-center">
                              <sport.icon className="w-8 h-8 md:w-12 md:h-12 text-yellow-400" />
                            </div>
                          </div>
                        )}
                        <h4 className="text-sm md:text-2xl font-bold text-white mb-0.5 md:mb-2 line-clamp-1">
                          {sport.name}
                        </h4>
                        <p className="text-gray-400 text-[10px] md:text-sm mb-1.5 md:mb-4 leading-tight md:leading-relaxed line-clamp-2 hidden md:block">
                          {sport.description}
                        </p>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 md:gap-0">
                          <div className="px-1.5 py-0.5 md:px-4 md:py-2 bg-white/10 rounded md:rounded-lg border border-white/10 w-full md:w-auto">
                            <span className="text-[8px] md:text-xs text-gray-400 block">
                              Type
                            </span>
                            <span className="text-[10px] md:text-sm font-semibold text-white">
                              {sport.teamSize === 1
                                ? "Individual"
                                : `Team ${sport.teamSize}`}
                            </span>
                          </div>
                          <div className="text-left md:text-right w-full md:w-auto">
                            <span className="text-[8px] md:text-xs text-gray-400 block">
                              Price
                            </span>
                            <span className="text-base md:text-2xl font-bold text-yellow-400">
                              ₹{sport.fee}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          {/* Category 2: 49/- Per Game */}
          <motion.div
            className="mb-20"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.5}}
          >
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-8 mb-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    2ND CATEGORY: ₹49/- PER GAME
                  </h3>
                  <p className="text-gray-300 text-lg">
                    Individual sport competitions - Pay per game basis.
                  </p>
                </div>
                <button
                  onClick={scrollToForm}
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30 whitespace-nowrap"
                >
                  Register Now
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {sports
                .filter((s) => s.category === "category2")
                .map((sport, index) => (
                  <motion.div
                    key={sport.id}
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: 0.1 * index}}
                    whileHover={{scale: 1.02, y: -5}}
                    className="cursor-pointer group"
                  >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl overflow-hidden h-full hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300">
                      {/* Image Section - Square box on mobile, wide on desktop */}
                      {sport.image && (
                        <div className="relative w-full h-32 md:h-56 overflow-hidden">
                          <img
                            src={sport.image}
                            alt={sport.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </div>
                      )}

                      {/* Content Section - Very compact on mobile */}
                      <div className="p-2 md:p-6">
                        {!sport.image && (
                          <div className="mb-1 md:mb-4 flex justify-center">
                            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                              <sport.icon className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />
                            </div>
                          </div>
                        )}
                        <h4 className="text-sm md:text-2xl font-bold text-white mb-0.5 md:mb-2 line-clamp-1">
                          {sport.name}
                        </h4>
                        <p className="text-gray-400 text-[10px] md:text-sm mb-1.5 md:mb-4 leading-tight md:leading-relaxed line-clamp-2 hidden md:block">
                          {sport.description}
                        </p>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 md:gap-0">
                          <div className="px-1.5 py-0.5 md:px-4 md:py-2 bg-white/10 rounded md:rounded-lg border border-white/10 w-full md:w-auto">
                            <span className="text-[8px] md:text-xs text-gray-400 block">
                              Type
                            </span>
                            <span className="text-[10px] md:text-sm font-semibold text-white">
                              {sport.teamSize === 1
                                ? "Individual"
                                : `Team ${sport.teamSize}`}
                            </span>
                          </div>
                          <div className="text-left md:text-right w-full md:w-auto">
                            <span className="text-[8px] md:text-xs text-gray-400 block">
                              Price
                            </span>
                            <span className="text-base md:text-2xl font-bold text-blue-400">
                              ₹{sport.fee}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          {/* Category 3: 199/- Per Team */}
          <motion.div
            className="mb-20"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.6}}
          >
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8 mb-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    3RD CATEGORY: ₹199/- PER TEAM
                  </h3>
                  <p className="text-gray-300 text-lg">
                    Team sports for competitive group events.
                  </p>
                </div>
                <button
                  onClick={scrollToForm}
                  className="px-8 py-4 bg-green-500 hover:bg-green-600 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg shadow-green-500/30 whitespace-nowrap"
                >
                  Register Now
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {sports
                .filter((s) => s.category === "category3")
                .map((sport, index) => (
                  <motion.div
                    key={sport.id}
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: 0.1 * index}}
                    whileHover={{scale: 1.02, y: -5}}
                    className="cursor-pointer group"
                  >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl overflow-hidden h-full hover:border-green-400/50 hover:bg-white/10 transition-all duration-300">
                      {/* Image Section - Square box on mobile, wide on desktop */}
                      {sport.image && (
                        <div className="relative w-full h-32 md:h-56 overflow-hidden">
                          <img
                            src={sport.image}
                            alt={sport.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </div>
                      )}

                      {/* Content Section - Very compact on mobile */}
                      <div className="p-2 md:p-6">
                        {!sport.image && (
                          <div className="mb-1 md:mb-4 flex justify-center">
                            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                              <sport.icon className="w-8 h-8 md:w-12 md:h-12 text-green-400" />
                            </div>
                          </div>
                        )}
                        <h4 className="text-sm md:text-2xl font-bold text-white mb-0.5 md:mb-2 line-clamp-1">
                          {sport.name}
                        </h4>
                        <p className="text-gray-400 text-[10px] md:text-sm mb-1.5 md:mb-4 leading-tight md:leading-relaxed line-clamp-2 hidden md:block">
                          {sport.description}
                        </p>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 md:gap-0">
                          <div className="px-1.5 py-0.5 md:px-4 md:py-2 bg-white/10 rounded md:rounded-lg border border-white/10 w-full md:w-auto">
                            <span className="text-[8px] md:text-xs text-gray-400 block">
                              Type
                            </span>
                            <span className="text-[10px] md:text-sm font-semibold text-white">
                              Team {sport.teamSize}
                            </span>
                          </div>
                          <div className="text-left md:text-right w-full md:w-auto">
                            <span className="text-[8px] md:text-xs text-gray-400 block">
                              Price
                            </span>
                            <span className="text-base md:text-2xl font-bold text-green-400">
                              ₹{sport.fee}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Registration Form - Google Forms Style */}
        {showRegistrationForm && (
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            id="registration-form"
            className="max-w-3xl mx-auto px-4 py-16"
          >
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-white">
                <h2 className="text-4xl font-bold mb-2">
                  Women's Tournament Registration
                </h2>
                <p className="text-pink-100">
                  Fill out this form to register for the tournament
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Name */}
                <div className="border-b border-white/10 pb-6">
                  <label className="block text-white font-medium mb-4 text-lg">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your answer"
                    className="w-full border-b-2 border-white/20 focus:border-pink-500 outline-none py-2 text-white placeholder-gray-400 bg-transparent transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="border-b border-white/10 pb-6">
                  <label className="block text-white font-medium mb-4 text-lg">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full border-b-2 border-white/20 focus:border-pink-500 outline-none py-2 text-white placeholder-gray-400 bg-transparent transition-colors"
                  />
                </div>

                {/* Registration Number */}
                <div className="border-b border-white/10 pb-6">
                  <label className="block text-white font-medium mb-4 text-lg">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                    placeholder="Your answer"
                    className="w-full border-b-2 border-white/20 focus:border-pink-500 outline-none py-2 text-white placeholder-gray-400 bg-transparent transition-colors"
                  />
                </div>

                {/* Mobile Number */}
                <div className="border-b border-white/10 pb-6">
                  <label className="block text-white font-medium mb-4 text-lg">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    placeholder="Your answer"
                    className="w-full border-b-2 border-white/20 focus:border-pink-500 outline-none py-2 text-white placeholder-gray-400 bg-transparent transition-colors"
                  />
                </div>

                {/* Category Selection Dropdown */}
                <div className="border-b border-white/10 pb-6">
                  <label className="block text-white font-medium mb-4 text-lg">
                    Select Tournament Category{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.selectedCategory}
                    onChange={handleChange}
                    name="selectedCategory"
                    required
                    className="w-full border-2 border-white/20 focus:border-pink-500 outline-none py-3 px-4 text-white bg-black/40 rounded-lg transition-colors"
                  >
                    <option value="" className="bg-gray-900">
                      Choose a category
                    </option>
                    <option value="category1" className="bg-gray-900">
                      Category 1 - Individual Sports (₹49 Unlimited Pool)
                    </option>
                    <option value="category2" className="bg-gray-900">
                      Category 2 - Indoor Games (₹49 Per Game)
                    </option>
                    <option value="category3" className="bg-gray-900">
                      Category 3 - Fun & Team Events (₹199 Per Team)
                    </option>
                  </select>
                </div>

                {/* Category 1 */}
                {formData.selectedCategory === "category1" && (
                  <div className="border-b border-white/10 pb-6">
                    <div className="mb-4">
                      <h3 className="text-white font-medium text-lg mb-1">
                        Category 1:
                      </h3>
                      <p className="text-sm text-gray-400">
                        ₹49/- (Unlimited Pool) - Select all that apply
                      </p>
                    </div>
                    <div className="space-y-3">
                      {sports
                        .filter((s) => s.category === "category1")
                        .map((sport) => (
                          <label
                            key={sport.id}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedSports.includes(
                                sport.name
                              )}
                              onChange={() => handleCheckboxChange(sport.name)}
                              className="w-5 h-5 text-pink-600 border-white/20 rounded focus:ring-pink-500 bg-black/40"
                            />
                            <span className="text-gray-300 group-hover:text-pink-400 transition-colors">
                              {sport.name}
                            </span>
                          </label>
                        ))}
                    </div>
                    {formData.selectedSports.some((s) =>
                      sports.find(
                        (sp) => sp.name === s && sp.category === "category1"
                      )
                    ) && (
                      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-yellow-400 mb-2">
                              Payment QR Code - Category 1
                            </p>
                            <p className="text-sm text-yellow-300">
                              Scan to pay ₹49 for unlimited pool access
                            </p>
                          </div>
                          <img
                            src={qrCodes.category1}
                            alt="Category 1 QR Code"
                            className="w-32 h-32 bg-white p-2 rounded-lg shadow"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Category 2 */}
                {formData.selectedCategory === "category2" && (
                  <div className="border-b border-white/10 pb-6">
                    <div className="mb-4">
                      <h3 className="text-white font-medium text-lg mb-1">
                        Category 2:
                      </h3>
                      <p className="text-sm text-gray-400">
                        ₹49/- Per Game - Select one sport
                      </p>
                    </div>
                    <div className="space-y-3">
                      {sports
                        .filter((s) => s.category === "category2")
                        .map((sport) => (
                          <label
                            key={sport.id}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="category2Sport"
                              checked={formData.selectedSports.includes(
                                sport.name
                              )}
                              onChange={() => {
                                // For radio, replace the selection with only this sport
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedSports: [sport.name],
                                }));
                              }}
                              className="w-5 h-5 text-pink-600 border-white/20 focus:ring-pink-500 bg-black/40"
                            />
                            <span className="text-gray-300 group-hover:text-pink-400 transition-colors">
                              {sport.name}
                            </span>
                          </label>
                        ))}
                    </div>
                    {formData.selectedSports.some((s) =>
                      sports.find(
                        (sp) => sp.name === s && sp.category === "category2"
                      )
                    ) && (
                      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-blue-400 mb-2">
                              Payment QR Code - Category 2
                            </p>
                            <p className="text-sm text-blue-300">
                              Scan to pay ₹49 for {formData.selectedSports[0]}
                            </p>
                          </div>
                          <img
                            src={qrCodes.category2}
                            alt="Category 2 QR Code"
                            className="w-32 h-32 bg-white p-2 rounded-lg shadow"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Category 3 */}
                {formData.selectedCategory === "category3" && (
                  <div className="border-b border-white/10 pb-6">
                    <div className="mb-4">
                      <h3 className="text-white font-medium text-lg mb-1">
                        Category 3:
                      </h3>
                      <p className="text-sm text-gray-400">
                        ₹199/- Per Team - Select one sport
                      </p>
                    </div>
                    <div className="space-y-3">
                      {sports
                        .filter((s) => s.category === "category3")
                        .map((sport) => (
                          <label
                            key={sport.id}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="category3Sport"
                              checked={formData.selectedSports.includes(
                                sport.name
                              )}
                              onChange={() => {
                                // For radio, replace the selection with only this sport
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedSports: [sport.name],
                                }));
                              }}
                              className="w-5 h-5 text-pink-600 border-white/20 focus:ring-pink-500 bg-black/40"
                            />
                            <span className="text-gray-300 group-hover:text-pink-400 transition-colors">
                              {sport.name}
                            </span>
                          </label>
                        ))}
                    </div>

                    {/* Team Name for Category 3 */}
                    {formData.selectedSports.some((s) =>
                      sports.find(
                        (sp) => sp.name === s && sp.category === "category3"
                      )
                    ) && (
                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">
                            Team Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="category3TeamName"
                            value={formData.category3TeamName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your team name"
                            className="w-full border-2 border-white/20 focus:border-pink-500 outline-none py-2 px-4 text-white placeholder-gray-400 bg-black/40 rounded-lg transition-colors"
                          />
                        </div>

                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-green-400 mb-2">
                                Payment QR Code - Category 3
                              </p>
                              <p className="text-sm text-green-300">
                                Scan to pay ₹199 for{" "}
                                {formData.selectedSports[0]}
                              </p>
                            </div>
                            <img
                              src={qrCodes.category3}
                              alt="Category 3 QR Code"
                              className="w-32 h-32 bg-white p-2 rounded-lg shadow"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Screenshot Upload - Show if any sports selected */}
                {formData.selectedSports.length > 0 && (
                  <div className="border-b border-white/10 pb-6">
                    <label className="block text-white font-medium mb-4 text-lg">
                      Upload Payment Screenshot{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-400 mb-4">
                      Please upload a screenshot of your payment transaction.
                      Accepted formats: JPG, PNG, PDF (Max 10MB)
                    </p>

                    {!screenshotPreview ? (
                      <div className="relative">
                        <input
                          type="file"
                          id="payment-screenshot"
                          accept="image/jpeg,image/jpg,image/png,application/pdf"
                          onChange={handleScreenshotChange}
                          disabled={isUploadingScreenshot}
                          className="hidden"
                        />
                        <label
                          htmlFor="payment-screenshot"
                          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-pink-500 transition-colors ${
                            isUploadingScreenshot
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <svg
                            className="w-12 h-12 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="text-gray-300 text-sm">
                            {isUploadingScreenshot
                              ? "Uploading..."
                              : "Click to upload payment screenshot"}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            JPG, PNG or PDF (MAX. 10MB)
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="bg-black/40 border border-white/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {screenshotPreview === "PDF" ? (
                              <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <img
                                src={screenshotPreview}
                                alt="Payment Screenshot"
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <p className="text-white font-medium">
                                {paymentScreenshot?.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {(
                                  paymentScreenshot?.size /
                                  1024 /
                                  1024
                                ).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveScreenshot}
                            className="text-red-500 hover:text-red-400 transition-colors"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegistrationForm(false);
                      setFormData({
                        name: "",
                        registrationNumber: "",
                        mobileNumber: "",
                        selectedSports: [],
                        category3TeamName: "",
                        selectedCategory: "",
                        paymentScreenshotUrl: "",
                      });
                      setPaymentScreenshot(null);
                      setScreenshotPreview(null);
                    }}
                    className="px-8 py-3 bg-gray-600/50 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors border border-white/10"
                  >
                    Clear form
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="bg-black/50 backdrop-blur-md border-t border-white/5 mt-20 py-12">
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
