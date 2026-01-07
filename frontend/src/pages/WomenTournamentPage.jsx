import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {toast} from "react-toastify";
import api from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  SackRaceIcon,
  ThreeLegRaceIcon,
  BalloonIcon,
  BrickIcon,
  MusicalChairIcon,
  LemonSpoonIcon,
  PowerliftingIcon,
  WeightliftingIcon,
  SkippingRopeIcon,
  BadmintonIcon,
  ChessIcon,
  CarromIcon,
  TugOfWarIcon,
  VolleyballIcon,
  CricketIcon,
  BasketballIcon,
  FootballIcon,
  BoxCricketIcon,
  SprintIcon,
  ShotputIcon,
  DiscusIcon,
  JavelinIcon,
  HammerIcon,
} from "../components/SportIcons";

const WomenTournamentPage = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [showBackupQR, setShowBackupQR] = useState({
    category1: false,
    category2: false,
    category3: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registrationNumber: "",
    mobileNumber: "",
    selectedSports: [],
    category3TeamName: "",
    paymentScreenshotUrl: "",
  });

  const toggleCardFlip = (sportId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [sportId]: !prev[sportId],
    }));
  };

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
      rules: [
        "Participant must stay inside the sack",
        "Race distance: 50 meters",
        "Falling means restart from that point",
        "First to cross finish line wins",
      ],
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
      rules: [
        "Teams of 2 participants",
        "Adjacent legs tied together",
        "Race distance: 50 meters",
        "Untying is disqualification",
      ],
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
      rules: [
        "Pop maximum balloons in 1 minute",
        "Only sitting allowed to burst",
        "Hands cannot be used",
        "Highest count wins",
      ],
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
      rules: [
        "Move using 2 bricks only",
        "Feet must not touch ground",
        "Race distance: 20 meters",
        "First to finish wins",
      ],
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
      rules: [
        "Balance lemon on spoon",
        "Spoon held in mouth",
        "Race distance: 50 meters",
        "Dropping lemon restarts",
      ],
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
      rules: [
        "3 attempts per lift",
        "Squat, Bench, Deadlift",
        "Standard weight categories",
        "Best total wins",
      ],
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
      rules: [
        "Snatch and Clean & Jerk",
        "3 attempts per lift",
        "Weight categories apply",
        "Highest total wins",
      ],
    },
    {
      id: "skipping-rope",
      name: "Skipping Rope",
      icon: SkippingRopeIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/zenith-26/img/Female-Tournament/1st-Category/SkippingRope",
      color: "from-cyan-500 to-blue-500",
      teamSize: 1,
      category: "category1",
      fee: 49,
      description: "Jump rope endurance challenge",
      rules: [
        "Each participant gets 1 minute to skip",
        "Count of successful jumps determines winner",
        "Tripping resets count to zero",
        "Standard skipping rope provided",
        "No double-unders allowed",
      ],
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
      rules: [
        "Singles matches only",
        "21 points per game",
        "Best of 3 games",
        "Standard BWF rules apply",
      ],
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
      rules: [
        "15 minutes per player",
        "Touch-move rule applies",
        "Standard FIDE rules",
        "Knockout format",
      ],
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
      rules: [
        "Singles matches",
        "25 points to win",
        "Queen must be covered",
        "Standard carrom rules",
      ],
    },
    {
      id: "100-meter",
      name: "100 Meter",
      icon: SprintIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767543732/zenith-26/img/category2/Athletics.png",
      color: "from-red-500 to-orange-600",
      teamSize: 1,
      category: "category2",
      fee: 49,
      description: "Sprint race - fastest 100 meters",
      rules: [
        "Standard 100m sprint",
        "Heats and finals format",
        "Lane allocation by draw",
        "False start = disqualification",
      ],
    },
    {
      id: "shotput",
      name: "Shotput",
      icon: ShotputIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767543732/zenith-26/img/category2/Athletics.png",
      color: "from-gray-600 to-slate-700",
      teamSize: 1,
      category: "category2",
      fee: 49,
      description: "Shot put throwing event",
      rules: [
        "3 attempts per participant",
        "Best throw counts",
        "Standard throwing technique",
        "Foul = foot over line",
      ],
    },
    {
      id: "discus",
      name: "Discus",
      icon: DiscusIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767543732/zenith-26/img/category2/Athletics.png",
      color: "from-blue-600 to-indigo-700",
      teamSize: 1,
      category: "category2",
      fee: 49,
      description: "Discus throwing event",
      rules: [
        "3 attempts per participant",
        "Best throw counts",
        "Must land in sector",
        "Standard discus technique",
      ],
    },
    {
      id: "javelin",
      name: "Javelin",
      icon: JavelinIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767543732/zenith-26/img/category2/Athletics.png",
      color: "from-green-600 to-teal-700",
      teamSize: 1,
      category: "category2",
      fee: 49,
      description: "Javelin throwing event",
      rules: [
        "3 attempts per participant",
        "Best throw counts",
        "Tip must land first",
        "No crossing foul line",
      ],
    },
    {
      id: "hammer",
      name: "Hammer Throw",
      icon: HammerIcon,
      image:
        "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1767543732/zenith-26/img/category2/Athletics.png",
      color: "from-purple-600 to-violet-700",
      teamSize: 1,
      category: "category2",
      fee: 49,
      description: "Hammer throwing event",
      rules: [
        "3 attempts per participant",
        "Best throw counts",
        "Must land in sector",
        "Standard hammer technique",
      ],
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
      rules: [
        "Music stops, grab a chair",
        "One chair removed each round",
        "Last person standing wins",
        "No pushing allowed",
      ],
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
      rules: [
        "8 players per team",
        "Best of 3 pulls",
        "Center mark decides winner",
        "No anchoring allowed",
      ],
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
      rules: [
        "6 players on court",
        "25 points per set",
        "Best of 3 sets",
        "Rally scoring system",
      ],
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
      rules: [
        "11 players per team",
        "10 overs per innings",
        "Standard cricket rules",
        "Knockout format",
      ],
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
      rules: [
        "3 players per team",
        "10 minutes per game",
        "21 points or time limit",
        "FIBA 3x3 rules",
      ],
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
      rules: [
        "5 players per team",
        "15 minutes per half",
        "Rolling substitutions",
        "No offside rule",
      ],
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
      rules: [
        "6 players per team",
        "6 overs per innings",
        "Boundaries off walls",
        "Tennis ball used",
      ],
    },
  ];

  // QR Codes for each category - Sagar Ubale (sagarubale2004@oksbi)
  const PAYMENT_QR_URL =
    "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:best/v1767592627/zenith-26/img/payment/payment-qr-sagar-ubale";

  // Backup QR Codes - Atharva Joshi
  const BACKUP_QR_URLS = [
    {
      name: "Atharva Joshi (ICICI)",
      upiId: "atharvsjoshi2005-1@okicici",
      url: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1767630215/zenith-26/img/payment/backup-qr-atharva-okicici.png",
    },
    {
      name: "Atharva Joshi (Axis)",
      upiId: "atharvsjoshi2005@okaxis",
      url: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1767630220/zenith-26/img/payment/backup-qr-atharva-okaxis.png",
    },
  ];

  const qrCodes = {
    category1: PAYMENT_QR_URL,
    category2: PAYMENT_QR_URL,
    category3: PAYMENT_QR_URL,
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
        <Navbar />

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
              to="/home"
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
                    className="cursor-pointer group perspective-1000"
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                        flippedCards[sport.id] ? "rotate-y-180" : ""
                      }`}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: flippedCards[sport.id]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      }}
                    >
                      {/* Front of Card */}
                      <div
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl overflow-hidden hover:border-yellow-400/50 hover:bg-white/10 transition-all duration-300"
                        style={{backfaceVisibility: "hidden"}}
                      >
                        {/* Image Section */}
                        {sport.image && (
                          <div className="relative w-full h-32 md:h-56 overflow-hidden">
                            <img
                              src={sport.image}
                              alt={sport.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            {/* Rules Button - appears on hover */}
                            {sport.rules && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCardFlip(sport.id);
                                }}
                                className="absolute top-2 right-2 md:top-3 md:right-3 px-2 py-1 md:px-3 md:py-1.5 bg-yellow-500/90 hover:bg-yellow-400 rounded-lg text-[10px] md:text-xs font-bold text-black opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 shadow-lg"
                              >
                                <svg
                                  className="w-3 h-3 md:w-4 md:h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                                Rules
                              </button>
                            )}
                          </div>
                        )}

                        {/* Content Section */}
                        <div className="p-2 md:p-6">
                          {!sport.image && (
                            <div className="mb-1 md:mb-4 flex justify-center relative">
                              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <sport.icon className="w-8 h-8 md:w-12 md:h-12 text-yellow-400" />
                              </div>
                              {sport.rules && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCardFlip(sport.id);
                                  }}
                                  className="absolute top-0 right-0 px-2 py-1 md:px-3 md:py-1.5 bg-yellow-500/90 hover:bg-yellow-400 rounded-lg text-[10px] md:text-xs font-bold text-black opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1"
                                >
                                  <svg
                                    className="w-3 h-3 md:w-4 md:h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                  </svg>
                                  Rules
                                </button>
                              )}
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

                      {/* Back of Card - Rules */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-yellow-900/90 to-orange-900/90 backdrop-blur-sm border border-yellow-400/30 rounded-xl md:rounded-2xl overflow-hidden p-3 md:p-6 flex flex-col"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2 md:mb-4">
                          <h4 className="text-sm md:text-xl font-bold text-yellow-400 flex items-center gap-2">
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            {sport.name}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardFlip(sport.id);
                            }}
                            className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          <ul className="space-y-1.5 md:space-y-2">
                            {sport.rules?.map((rule, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-[10px] md:text-sm text-white/90"
                              >
                                <span className="text-yellow-400 mt-0.5">
                                  •
                                </span>
                                {rule}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2 md:mt-4 pt-2 md:pt-3 border-t border-yellow-400/20">
                          <span className="text-[10px] md:text-xs text-yellow-400/70">
                            Entry Fee: ₹{sport.fee}
                          </span>
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
                    className="cursor-pointer group perspective-1000"
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                        flippedCards[sport.id] ? "rotate-y-180" : ""
                      }`}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: flippedCards[sport.id]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      }}
                    >
                      {/* Front of Card */}
                      <div
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl overflow-hidden hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300"
                        style={{backfaceVisibility: "hidden"}}
                      >
                        {/* Image Section */}
                        {sport.image && (
                          <div className="relative w-full h-32 md:h-56 overflow-hidden">
                            <img
                              src={sport.image}
                              alt={sport.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            {/* Rules Button */}
                            {sport.rules && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCardFlip(sport.id);
                                }}
                                className="absolute top-2 right-2 md:top-3 md:right-3 px-2 py-1 md:px-3 md:py-1.5 bg-blue-500/90 hover:bg-blue-400 rounded-lg text-[10px] md:text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 shadow-lg"
                              >
                                <svg
                                  className="w-3 h-3 md:w-4 md:h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                                Rules
                              </button>
                            )}
                          </div>
                        )}

                        {/* Content Section */}
                        <div className="p-2 md:p-6">
                          {!sport.image && (
                            <div className="mb-1 md:mb-4 flex justify-center relative">
                              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                <sport.icon className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />
                              </div>
                              {sport.rules && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCardFlip(sport.id);
                                  }}
                                  className="absolute top-0 right-0 px-2 py-1 md:px-3 md:py-1.5 bg-blue-500/90 hover:bg-blue-400 rounded-lg text-[10px] md:text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1"
                                >
                                  <svg
                                    className="w-3 h-3 md:w-4 md:h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                  </svg>
                                  Rules
                                </button>
                              )}
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

                      {/* Back of Card - Rules */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-sm border border-blue-400/30 rounded-xl md:rounded-2xl overflow-hidden p-3 md:p-6 flex flex-col"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2 md:mb-4">
                          <h4 className="text-sm md:text-xl font-bold text-blue-400 flex items-center gap-2">
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            {sport.name}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardFlip(sport.id);
                            }}
                            className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          <ul className="space-y-1.5 md:space-y-2">
                            {sport.rules?.map((rule, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-[10px] md:text-sm text-white/90"
                              >
                                <span className="text-blue-400 mt-0.5">•</span>
                                {rule}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2 md:mt-4 pt-2 md:pt-3 border-t border-blue-400/20">
                          <span className="text-[10px] md:text-xs text-blue-400/70">
                            Entry Fee: ₹{sport.fee}
                          </span>
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
                    className="cursor-pointer group perspective-1000"
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                        flippedCards[sport.id] ? "rotate-y-180" : ""
                      }`}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: flippedCards[sport.id]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      }}
                    >
                      {/* Front of Card */}
                      <div
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl overflow-hidden hover:border-green-400/50 hover:bg-white/10 transition-all duration-300"
                        style={{backfaceVisibility: "hidden"}}
                      >
                        {/* Image Section */}
                        {sport.image && (
                          <div className="relative w-full h-32 md:h-56 overflow-hidden">
                            <img
                              src={sport.image}
                              alt={sport.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            {/* Rules Button */}
                            {sport.rules && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCardFlip(sport.id);
                                }}
                                className="absolute top-2 right-2 md:top-3 md:right-3 px-2 py-1 md:px-3 md:py-1.5 bg-green-500/90 hover:bg-green-400 rounded-lg text-[10px] md:text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 shadow-lg"
                              >
                                <svg
                                  className="w-3 h-3 md:w-4 md:h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                                Rules
                              </button>
                            )}
                          </div>
                        )}

                        {/* Content Section */}
                        <div className="p-2 md:p-6">
                          {!sport.image && (
                            <div className="mb-1 md:mb-4 flex justify-center relative">
                              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                                <sport.icon className="w-8 h-8 md:w-12 md:h-12 text-green-400" />
                              </div>
                              {sport.rules && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCardFlip(sport.id);
                                  }}
                                  className="absolute top-0 right-0 px-2 py-1 md:px-3 md:py-1.5 bg-green-500/90 hover:bg-green-400 rounded-lg text-[10px] md:text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1"
                                >
                                  <svg
                                    className="w-3 h-3 md:w-4 md:h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                  </svg>
                                  Rules
                                </button>
                              )}
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

                      {/* Back of Card - Rules */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-sm border border-green-400/30 rounded-xl md:rounded-2xl overflow-hidden p-3 md:p-6 flex flex-col"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2 md:mb-4">
                          <h4 className="text-sm md:text-xl font-bold text-green-400 flex items-center gap-2">
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            {sport.name}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardFlip(sport.id);
                            }}
                            className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          <ul className="space-y-1.5 md:space-y-2">
                            {sport.rules?.map((rule, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-[10px] md:text-sm text-white/90"
                              >
                                <span className="text-green-400 mt-0.5">•</span>
                                {rule}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2 md:mt-4 pt-2 md:pt-3 border-t border-green-400/20">
                          <span className="text-[10px] md:text-xs text-green-400/70">
                            Entry Fee: ₹{sport.fee}
                          </span>
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
                      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                        <div className="flex flex-col items-center text-center">
                          <p className="font-semibold text-yellow-400 mb-2">
                            Payment QR Code - Category 1
                          </p>
                          <p className="text-sm text-yellow-300 mb-4">
                            Scan to pay ₹49 for unlimited pool access
                          </p>
                          <div className="bg-white p-2 rounded-lg shadow-lg">
                            <img
                              src={qrCodes.category1}
                              alt="Category 1 QR Code"
                              className="w-64 h-auto"
                            />
                          </div>

                          {/* Backup QR Codes Dropdown */}
                          <div className="mt-6 w-full">
                            <button
                              onClick={() =>
                                setShowBackupQR({
                                  ...showBackupQR,
                                  category1: !showBackupQR.category1,
                                })
                              }
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-lg text-yellow-300 font-medium transition-all"
                            >
                              <span>🔄</span>
                              <span>
                                {showBackupQR.category1
                                  ? "Hide Backup Payment Options"
                                  : "Show Backup Payment Options"}
                              </span>
                              <svg
                                className={`w-5 h-5 transition-transform ${
                                  showBackupQR.category1 ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>

                            <AnimatePresence>
                              {showBackupQR.category1 && (
                                <motion.div
                                  initial={{height: 0, opacity: 0}}
                                  animate={{height: "auto", opacity: 1}}
                                  exit={{height: 0, opacity: 0}}
                                  transition={{duration: 0.3}}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-4 space-y-6 pt-4 border-t border-yellow-500/20">
                                    {BACKUP_QR_URLS.map((qr, index) => (
                                      <div
                                        key={index}
                                        className="bg-yellow-500/5 p-6 rounded-lg border border-yellow-500/20"
                                      >
                                        <p className="text-sm text-yellow-300 mb-3 font-medium text-center">
                                          {qr.name}
                                        </p>
                                        <div className="bg-white p-2 rounded-lg shadow-lg w-fit mx-auto">
                                          <img
                                            src={qr.url}
                                            alt={`Backup QR ${index + 1}`}
                                            className="w-64 h-auto"
                                          />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-3 text-center break-all">
                                          UPI ID: {qr.upiId}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
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
                      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                        <div className="flex flex-col items-center text-center">
                          <p className="font-semibold text-blue-400 mb-2">
                            Payment QR Code - Category 2
                          </p>
                          <p className="text-sm text-blue-300 mb-4">
                            Scan to pay ₹49 for {formData.selectedSports[0]}
                          </p>
                          <div className="bg-white p-2 rounded-lg shadow-lg">
                            <img
                              src={qrCodes.category2}
                              alt="Category 2 QR Code"
                              className="w-64 h-auto"
                            />
                          </div>

                          {/* Backup QR Codes Dropdown */}
                          <div className="mt-6 w-full">
                            <button
                              onClick={() =>
                                setShowBackupQR({
                                  ...showBackupQR,
                                  category2: !showBackupQR.category2,
                                })
                              }
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-300 font-medium transition-all"
                            >
                              <span>🔄</span>
                              <span>
                                {showBackupQR.category2
                                  ? "Hide Backup Payment Options"
                                  : "Show Backup Payment Options"}
                              </span>
                              <svg
                                className={`w-5 h-5 transition-transform ${
                                  showBackupQR.category2 ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>

                            <AnimatePresence>
                              {showBackupQR.category2 && (
                                <motion.div
                                  initial={{height: 0, opacity: 0}}
                                  animate={{height: "auto", opacity: 1}}
                                  exit={{height: 0, opacity: 0}}
                                  transition={{duration: 0.3}}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-4 space-y-6 pt-4 border-t border-blue-500/20">
                                    {BACKUP_QR_URLS.map((qr, index) => (
                                      <div
                                        key={index}
                                        className="bg-blue-500/5 p-6 rounded-lg border border-blue-500/20"
                                      >
                                        <p className="text-sm text-blue-300 mb-3 font-medium text-center">
                                          {qr.name}
                                        </p>
                                        <div className="bg-white p-2 rounded-lg shadow-lg w-fit mx-auto">
                                          <img
                                            src={qr.url}
                                            alt={`Backup QR ${index + 1}`}
                                            className="w-64 h-auto"
                                          />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-3 text-center break-all">
                                          UPI ID: {qr.upiId}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
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

                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                          <div className="flex flex-col items-center text-center">
                            <p className="font-semibold text-green-400 mb-2">
                              Payment QR Code - Category 3
                            </p>
                            <p className="text-sm text-green-300 mb-4">
                              Scan to pay ₹199 for {formData.selectedSports[0]}
                            </p>
                            <div className="bg-white p-2 rounded-lg shadow-lg">
                              <img
                                src={qrCodes.category3}
                                alt="Category 3 QR Code"
                                className="w-64 h-auto"
                              />
                            </div>

                            {/* Backup QR Codes Dropdown */}
                            <div className="mt-6 w-full">
                              <button
                                onClick={() =>
                                  setShowBackupQR({
                                    ...showBackupQR,
                                    category3: !showBackupQR.category3,
                                  })
                                }
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg text-green-300 font-medium transition-all"
                              >
                                <span>🔄</span>
                                <span>
                                  {showBackupQR.category3
                                    ? "Hide Backup Payment Options"
                                    : "Show Backup Payment Options"}
                                </span>
                                <svg
                                  className={`w-5 h-5 transition-transform ${
                                    showBackupQR.category3 ? "rotate-180" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>

                              <AnimatePresence>
                                {showBackupQR.category3 && (
                                  <motion.div
                                    initial={{height: 0, opacity: 0}}
                                    animate={{height: "auto", opacity: 1}}
                                    exit={{height: 0, opacity: 0}}
                                    transition={{duration: 0.3}}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-4 space-y-6 pt-4 border-t border-green-500/20">
                                      {BACKUP_QR_URLS.map((qr, index) => (
                                        <div
                                          key={index}
                                          className="bg-green-500/5 p-6 rounded-lg border border-green-500/20"
                                        >
                                          <p className="text-sm text-green-300 mb-3 font-medium text-center">
                                            {qr.name}
                                          </p>
                                          <div className="bg-white p-2 rounded-lg shadow-lg w-fit mx-auto">
                                            <img
                                              src={qr.url}
                                              alt={`Backup QR ${index + 1}`}
                                              className="w-64 h-auto"
                                            />
                                          </div>
                                          <p className="text-xs text-gray-400 mt-3 text-center break-all">
                                            UPI ID: {qr.upiId}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
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

                    {/* Important Notice */}
                    <div className="mb-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-l-4 border-yellow-500 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg
                            className="w-5 h-5 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-yellow-500 font-semibold text-sm mb-1">
                            📌 Important: Transaction ID Required
                          </p>
                          <p className="text-yellow-200/90 text-xs leading-relaxed">
                            Please ensure your screenshot clearly shows the{" "}
                            <span className="font-bold text-yellow-400">
                              Transaction ID / UTR Number
                            </span>
                            . Upload the complete payment receipt from your
                            banking app or UPI app.
                          </p>
                        </div>
                      </div>
                    </div>

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
        <Footer />
      </div>
    </div>
  );
};

export default WomenTournamentPage;

