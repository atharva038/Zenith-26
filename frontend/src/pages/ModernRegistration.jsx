import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import api from "../config/api";
import { useRegistrationStatus } from "../hooks/useRegistrationStatus";
import RegistrationClosed from "../components/RegistrationClosed";

// Import all sports data from SportsGrid
const SPORTS_DATA = {
  Football: {
    name: "Football Championship",
    venue: "SGGSIE&T Football Ground",
    fees: { amount: 3000, note: "per team" },
    rules: [
      "Maximum 16 players per team (11 playing + 5 substitutes)",
      "Two halves of 45 minutes each",
      "FIFA rules apply",
      "Proper football boots mandatory",
    ],
    coordinators: [
      { name: "Rohan Pundkare", phone: "7249886133" },
      { name: "Srujan Pal", phone: "8788766970" },
    ],
  },
  Basketball: {
    name: "Basketball Tournament",
    venue: "Basketball Court",
    fees: { men: 2500, women: 1500, note: "per team" },
    rules: [
      "Maximum 12 players per team (5 playing + 7 substitutes)",
      "Four quarters of 10 minutes each",
      "FIBA rules apply",
    ],
    coordinators: [
      { name: "Uday Naukarkar", phone: "9322684201" },
      { name: "Krushna Jadhav", phone: "8208422959" },
    ],
  },
  Cricket: {
    name: "Cricket Tournament",
    venue: "SGGSIE&T Cricket Ground",
    fees: { amount: 6500, note: "per team" },
    rules: [
      "Maximum 15 players per team (11 playing + 4 substitutes)",
      "Leather ball match - 20 overs per side",
      "All ICC rules apply",
      "Proper cricket kit mandatory",
    ],
    coordinators: [
      { name: "Pranav Godle", phone: "9028783635" },
      { name: "Shahaji Bhosle", phone: "8308949481" },
    ],
  },
  Volleyball: {
    name: "Volleyball Championship",
    fees: { men: 2200, women: 1500, note: "per team" },
    venue: "Outdoor Volleyball Court",
    rules: [
      "Maximum 12 players per team (6 playing + 6 substitutes)",
      "Best of 5 sets",
      "Rally point system",
    ],
    coordinators: [
      { name: "Maitreyi Bhumbar", phone: "8788183714" },
      { name: "Harsh Marodkar", phone: "8208016898" },
    ],
  },
  Badminton: {
    name: "Badminton Tournament",
    fees: { boys: 1000, soloWomen: 250, mixed: 600, note: "per team" },
    venue: "Indoor Badminton Courts",
    rules: [
      "Boys Team: 5 players - ₹1000",
      "Solo Women: 1 player - ₹250",
      "Mixed Team: 2 players (1 boy + 1 girl) - ₹600",
      "Best of 3 games to 21 points",
      "BWF rules apply",
    ],
    coordinators: [
      { name: "Harsh Keshkar", phone: "8010529661" },
      { name: "Aditi Phulare", phone: "8669995909" },
    ],
  },
  Handball: {
    name: "Handball Championship",
    venue: "Outdoor Sports Ground",
    fees: { amount: 1500, note: "per team" },
    rules: [
      "Maximum 14 players per team (7 playing + 7 substitutes)",
      "Two halves of 30 minutes each",
      "IHF rules apply",
    ],
    coordinators: [
      { name: "Aditya Joshi", phone: "7820939780" },
      { name: "Amarja Dhepe", phone: "9552110021" },
    ],
  },
  Kabaddi: {
    name: "Kabaddi Tournament",
    venue: "Outdoor Sports Ground",
    fees: { men: 2200, women: 1500, note: "per team" },
    rules: [
      "Maximum 12 players per team (7 playing + 5 substitutes)",
      "Two halves of 20 minutes each",
      "Pro Kabaddi League style rules",
    ],
    coordinators: [
      { name: "Shubham Kale", phone: "7378409793" },
      { name: "Sonam Chandel", phone: "8329513257" },
      { name: "Chetan Bante", phone: "8263945881" },
    ],
  },
  Chess: {
    fees: { amount: 200, note: "per player (Open to all age groups)" },
    name: "Chess Tournament",
    venue: "Auditorium",
    rules: [
      "Individual event",
      "Time control: 15 minutes + 10 seconds increment",
      "FIDE rules apply",
    ],
    coordinators: [
      { name: "Sarthak Rahut", phone: "8788380729" },
      { name: "Akshit Tupkar", phone: "7028455126" },
    ],
  },
  "Rink Football": {
    name: "Rink Football Tournament",
    venue: "Outdoor Sports Hall",
    fees: { men: 2200, women: 1500, note: "per team" },
    rules: ["5-a-side football", "Smaller playing area", "Modified FIFA rules"],
    coordinators: [
      { name: "Onkar Sahane", phone: "8767192671" },
      { name: "Vipakshi Mate", phone: "7972776597" },
    ],
  },
  "Kho-Kho": {
    name: "Kho-Kho Championship",
    venue: "Outdoor Sports Ground",
    fees: { men: 1500, women: 1200, note: "per team" },
    rules: [
      "Maximum 15 players per team (9 playing + 6 substitutes)",
      "Two innings of 9 minutes each",
      "Official Kho-Kho Federation rules",
    ],
    coordinators: [
      { name: "Sairaj Shinde", phone: "8767179744" },
      { name: "Prem Dhande", phone: "8421230555" },
    ],
  },
  Athletics: {
    fees: {
      individual: 200,
      team: 700,
      note: "Individual: ₹200 per athlete | Team: ₹700 per team",
    },
    name: "Athletics Meet",
    venue: "SGGSIE&T Athletics Track",
    events: {
      individual: ["100m", "Long Jump"],
      team: ["Relay", "Mixed Relay (2 Boys + 2 Girls)"]
    },
    rules: [
      "Open for both Boys and Girls",
      "Individual Events: 100m, Long Jump (₹200 per athlete)",
      "Team Events: Relay, Mixed Relay - 2 Boys + 2 Girls (₹700 per team)",
      "20 minutes early reporting required",
      "Player identification verification final",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Dipanshu Sahatpute", phone: "7620666188" },
      { name: "Shrujan Pal", phone: "8788766970" },
    ],
  },
  Powerlifting: {
    name: "Power Lifting Competition",
    venue: "Gymnasium",
    fees: { amount: 300, note: "per player" },
    rules: [
      "Individual event",
      "Squat, Bench Press, Deadlift",
      "IPF rules apply",
    ],
    coordinators: [
      { name: "Tejas Borole", phone: "8767386695" },
      { name: "Sakshi Done", phone: "9028684180" },
    ],
  },
};

// Payment QR Code
const PAYMENT_QR_URL =
  "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:best/v1767592627/zenith-26/img/payment/payment-qr-sagar-ubale";

const BACKUP_QR_URLS = [
  {
    name: "Balaji Anil Kalyankar (PhonePe)",
    upiId: "balajianil.kalyankar@ybl",
    url: "/img/balajiQR.png",
  },
  {
    name: "Atharva Joshi (Bank of Baroda)",
    upiId: "atharvsjoshi2005-1@okicici",
    url: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1768722815/zenith-26/img/payment/backup-qr-atharva-bob.png",
  },
];

// Sport icons mapping
const SPORT_ICONS = {
  Football: "⚽",
  Basketball: "🏀",
  Cricket: "�",
  Volleyball: "🏐",
  Badminton: "🏸",
  Handball: "🤾",
  Kabaddi: "🤼",
  Chess: "♟️",
  "Rink Football": "⚽",
  "Kho-Kho": "🏃‍♂️",
  Athletics: "�",
  Powerlifting: "🏋️",
};

// Team sports that require team setup
const TEAM_SPORTS = [
  "Football",
  "Basketball",
  "Cricket",
  "Volleyball",
  "Handball",
  "Kabaddi",
  "Rink Football",
  "Kho-Kho",
];

const ModernRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check registration status
  const { isOpen, loading: statusLoading, message, startDate, endDate } = useRegistrationStatus();
  
  console.log("🎛️ ModernRegistration - Status:", { isOpen, loading: statusLoading });
  
  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState("");
  const [formData, setFormData] = useState({
    captain_name: "",
    institution: "",
    captain_contact: "",
    email: "",
    team_name: "",
    num_players: "",
    city: "",
    college_address: "",
    alternate_contact: "",
    need_accommodation: false,
    accommodation_days: "",
    accommodation_people: "",
    teamGender: "", // "male" or "female" for sports with gender-specific fees
    athleticsEventType: "", // "individual" or "team" for Athletics
    athleticsEvent: "", // specific event name for Athletics
  });

  // Show registration closed page if not open
  if (statusLoading) {
    console.log("⏳ Showing loading state...");
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking registration status...</p>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    console.log("🔒 Registration is CLOSED - Showing RegistrationClosed component");
    return <RegistrationClosed message={message} startDate={startDate} endDate={endDate} />;
  }
  
  console.log("✅ Registration is OPEN - Showing registration form");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedCaptain, setSelectedCaptain] = useState(0);
  const [documents, setDocuments] = useState({
    permissionLetter: null,
    transactionReceipt: null,
    captainIdCard: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [showBackupQR, setShowBackupQR] = useState(false);

  // Handle preselection from SportsGrid or GameVerse
  useEffect(() => {
    if (location.state?.fromSportsGrid && location.state?.preselectedSport) {
      const sportName = location.state.preselectedSport.toUpperCase();
      const sportMapping = {
        FOOTBALL: "Football",
        BASKETBALL: "Basketball",
        CRICKET: "Cricket",
        VOLLEYBALL: "Volleyball",
        BADMINTON: "Badminton",
        "TABLE TENNIS": "Table Tennis",
        CHESS: "Chess",
        CARROM: "Carrom",
        ATHLETICS: "Athletics",
        POWERLIFTING: "Power Lifting",
        KABADDI: "Kabaddi",
        HANDBALL: "Handball",
      };
      const mappedSport = sportMapping[sportName];
      if (mappedSport && SPORTS_DATA[mappedSport]) {
        setSelectedSport(mappedSport);
        toast.success(`${mappedSport} selected! 🎯`);
      }
    }
  }, [location.state]);

  const selectedSportData = selectedSport ? SPORTS_DATA[selectedSport] : null;
  
  // Dynamic team sport check - Athletics depends on event type, Badminton Solo Women is individual
  const isTeamSport = selectedSport === "Athletics" 
    ? formData.athleticsEventType === "team"
    : selectedSport === "Badminton" && formData.teamGender === "soloWomen"
    ? false  // Solo Women badminton is individual, skip team pages
    : TEAM_SPORTS.includes(selectedSport);

  // Calculate total steps dynamically (removed sport selection step)
  const totalSteps = isTeamSport ? 5 : 4; // Details, Team (optional), Captain (optional), Payment, Review

  // Progress calculation
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!formData.captain_name || !formData.captain_contact || !formData.email || !formData.institution) {
        toast.error("Please fill all required fields");
        return;
      }
      // Validate phone
      if (!/^\d{10}$/.test(formData.captain_contact)) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }
      // Validate email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      // Validate Athletics event selection
      if (selectedSport === "Athletics") {
        if (!formData.athleticsEventType) {
          toast.error("Please select Athletics event type (Individual or Team)");
          return;
        }
        if (!formData.athleticsEvent) {
          toast.error("Please select a specific Athletics event");
          return;
        }
      }
    }
    if (currentStep === 2 && isTeamSport) {
      if (!formData.team_name || !formData.num_players) {
        toast.error("Please enter team name and number of players");
        return;
      }
      if (teamMembers.length < 1) {
        toast.error("Please add at least one team member");
        return;
      }
      if (selectedCaptain === null) {
        toast.error("Please select a team captain");
        return;
      }
    }

    // Skip team setup steps for individual sports
    if (currentStep === 1 && !isTeamSport) {
      setCurrentStep(3); // Jump to payment
    } else if (currentStep === 2 && !isTeamSport) {
      setCurrentStep(3);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep === 3 && !isTeamSport) {
      setCurrentStep(1); // Jump back from payment to details for individual sports
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    toast.success(`${sport} selected!`, { autoClose: 1500 });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const addTeamMember = () => {
    const newMember = {
      id: Date.now(),
      name: "",
      contact: "",
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const updateTeamMember = (id, field, value) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const removeTeamMember = (id) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  const handleFileChange = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = null;
        return;
      }
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, and PDF files are allowed");
        e.target.value = null;
        return;
      }
      setDocuments({ ...documents, [documentType]: file });
      toast.success(`${documentType} uploaded!`, { autoClose: 1500 });
    }
  };

  const handleSubmit = async () => {
    // Final validation
    if (!documents.transactionReceipt) {
      toast.error("Please upload payment screenshot");
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = new FormData();
      
      // Add sport selection
      submissionData.append("eventId", "sports-registration");
      submissionData.append("eventName", selectedSportData.name);
      
      // Add all form fields
      Object.keys(formData).forEach((key) => {
        submissionData.append(key, formData[key]);
      });

      // Add team members if team sport
      if (isTeamSport) {
        submissionData.append("team_members", JSON.stringify(teamMembers));
        submissionData.append("captain_index", selectedCaptain);
      }

      // Add documents
      Object.keys(documents).forEach((key) => {
        if (documents[key]) {
          submissionData.append(key, documents[key]);
        }
      });

      const response = await api.post("/api/registration/register", submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setRegistrationNumber(response.data.data.registrationNumber);
        setRegistrationComplete(true);
        setCurrentStep(totalSteps + 1); // Move to success screen
        toast.success("Registration successful! 🎉");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const slideIn = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0604] via-[#1a0e08] to-[#0a0604] text-white">
      {/* Progress Bar */}
      {!registrationComplete && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-[#2a1810] z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff6b35] via-[#ff8c42] to-[#ffa600]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      )}

      {/* Container */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        {!registrationComplete && (
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#ff6b35] via-[#ff8c42] to-[#ffa600] bg-clip-text text-transparent mb-2">
              ZENITH Registration
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Step {currentStep} of {totalSteps}
            </p>
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Participant Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">{SPORT_ICONS[selectedSport] || "🏆"}</div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#ffb77a] mb-2">
                  {selectedSport === "Athletics" && !formData.athleticsEvent 
                    ? "Select Your Event"
                    : "Your Details"}
                </h2>
                <p className="text-gray-400">
                  {selectedSport === "Athletics" && !formData.athleticsEvent
                    ? "Choose event type and specific event to continue"
                    : "Tell us about yourself"}
                </p>
                
                {/* Show selected sport */}
                {selectedSport && (
                  <div className="mt-4 inline-block bg-[#1a1410]/50 backdrop-blur-sm border border-[#3a2416] rounded-xl px-6 py-3">
                    <p className="text-sm text-gray-400 mb-2">Registering for</p>
                    <p className="text-lg font-semibold text-[#ff6b35]">{selectedSport}</p>
                  </div>
                )}
              </div>

              {/* Athletics Event Selection - MUST be completed before showing form */}
              {selectedSport === "Athletics" && (
                <div className="bg-[#1a1410]/30 backdrop-blur-sm border border-[#3a2416] rounded-2xl p-6 md:p-8 space-y-6 mb-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-[#ffb77a] mb-2">
                      Step 1: Select Event Type
                    </h3>
                    <p className="text-sm text-gray-400">Individual or Team Competition</p>
                  </div>
                  
                  <div className="max-w-md mx-auto">
                    <select
                      value={formData.athleticsEventType || ""}
                      onChange={(e) => {
                        handleInputChange("athleticsEventType", e.target.value);
                        handleInputChange("athleticsEvent", ""); // Reset event selection
                      }}
                      className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#ff6b35] cursor-pointer text-center font-semibold"
                    >
                      <option value="" disabled className="bg-[#1a1410] text-gray-400">
                        -- Select Event Type --
                      </option>
                      <option value="individual" className="bg-[#1a1410] text-white">
                        🏃 Individual Events (₹200 per athlete)
                      </option>
                      <option value="team" className="bg-[#1a1410] text-white">
                        👥 Team Events (₹700 per team)
                      </option>
                    </select>
                  </div>
                  
                  {formData.athleticsEventType && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-md mx-auto"
                    >
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-[#ffb77a] mb-2">
                          Step 2: Select Specific Event
                        </h3>
                        <p className="text-sm text-gray-400">
                          {formData.athleticsEventType === "individual" 
                            ? "Choose your individual event"
                            : "Choose your team event"}
                        </p>
                      </div>
                      
                      <select
                        value={formData.athleticsEvent || ""}
                        onChange={(e) => handleInputChange("athleticsEvent", e.target.value)}
                        className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#ff6b35] cursor-pointer text-center font-semibold"
                      >
                        <option value="" disabled className="bg-[#1a1410] text-gray-400">
                          -- Select Specific Event --
                        </option>
                        {formData.athleticsEventType === "individual" && (
                          <>
                            <option value="100m" className="bg-[#1a1410] text-white">
                              🏃 100m Sprint
                            </option>
                            <option value="Long Jump" className="bg-[#1a1410] text-white">
                              🦘 Long Jump
                            </option>
                          </>
                        )}
                        {formData.athleticsEventType === "team" && (
                          <>
                            <option value="Relay" className="bg-[#1a1410] text-white">
                              🏃‍♂️ Relay Race (4 members)
                            </option>
                            <option value="Mixed Relay" className="bg-[#1a1410] text-white">
                              👥 Mixed Relay (2 Boys + 2 Girls)
                            </option>
                          </>
                        )}
                      </select>
                      
                      {formData.athleticsEvent && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center"
                        >
                          <p className="text-green-400 font-semibold">
                            ✓ Event Selected: {formData.athleticsEvent}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Fee: ₹{formData.athleticsEventType === "individual" ? "200" : "700"}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                  
                  {!formData.athleticsEvent && (
                    <div className="text-center text-sm text-gray-500 mt-4">
                      Please complete event selection to continue with registration
                    </div>
                  )}
                </div>
              )}

              {/* Gender Selection Dropdown for Badminton with three options */}
              {selectedSport === "Badminton" && selectedSportData?.fees?.boys && selectedSportData?.fees?.soloWomen && selectedSportData?.fees?.mixed && (
                <div className="bg-[#1a1410]/30 backdrop-blur-sm border border-[#3a2416] rounded-2xl p-6 md:p-8 mb-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-[#ffb77a] mb-2">Select Team Category</h3>
                  </div>
                  <div className="max-w-md mx-auto">
                    <select
                      value={formData.teamGender || ""}
                      onChange={(e) => handleInputChange("teamGender", e.target.value)}
                      className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#ff6b35] cursor-pointer text-center font-semibold"
                    >
                      <option value="" disabled className="bg-[#1a1410] text-gray-400">
                        -- Select Team Category --
                      </option>
                      <option value="boys" className="bg-[#1a1410] text-white">
                        👨 Boys Team - 5 Players (₹{selectedSportData.fees.boys})
                      </option>
                      <option value="soloWomen" className="bg-[#1a1410] text-white">
                        👩 Solo Women - 1 Player (₹{selectedSportData.fees.soloWomen})
                      </option>
                      <option value="mixed" className="bg-[#1a1410] text-white">
                        👥 Mixed Team - 2 Players (1 Boy + 1 Girl) (₹{selectedSportData.fees.mixed})
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* Gender Selection Dropdown for sports with gender-specific fees (not Badminton) */}
              {selectedSport !== "Badminton" && selectedSportData?.fees?.men && selectedSportData?.fees?.women && (
                <div className="bg-[#1a1410]/30 backdrop-blur-sm border border-[#3a2416] rounded-2xl p-6 md:p-8 mb-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-[#ffb77a] mb-2">Select Category</h3>
                  </div>
                  <div className="max-w-md mx-auto">
                    <select
                      value={formData.teamGender || ""}
                      onChange={(e) => handleInputChange("teamGender", e.target.value)}
                      className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#ff6b35] cursor-pointer text-center font-semibold"
                    >
                      <option value="" disabled className="bg-[#1a1410] text-gray-400">
                        -- Select Category --
                      </option>
                      <option value="male" className="bg-[#1a1410] text-white">
                        👨 Men's Team (₹{selectedSportData.fees.men})
                      </option>
                      <option value="female" className="bg-[#1a1410] text-white">
                        👩 Women's Team (₹{selectedSportData.fees.women})
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* Only show form fields after Athletics event selection is complete OR for non-Athletics sports */}
              {(selectedSport !== "Athletics" || (selectedSport === "Athletics" && formData.athleticsEvent)) && (
                <div className="bg-[#1a1410]/30 backdrop-blur-sm border border-[#3a2416] rounded-2xl p-6 md:p-8 space-y-6">
                  {selectedSport === "Athletics" && (
                    <div className="text-center mb-6 pb-6 border-b border-[#3a2416]">
                      <p className="text-sm text-gray-400">Selected Event</p>
                      <p className="text-lg font-bold text-[#ff6b35]">
                        {formData.athleticsEventType === "individual" ? "Individual" : "Team"} - {formData.athleticsEvent}
                      </p>
                    </div>
                  )}
                  
                  {/* Full Name */}
                  <div className="relative">
                  <input
                    type="text"
                    value={formData.captain_name}
                    onChange={(e) => handleInputChange("captain_name", e.target.value)}
                    className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white placeholder-transparent peer focus:outline-none focus:border-[#ff6b35] transition-colors"
                    placeholder="Full Name"
                    id="captain_name"
                  />
                  <label
                    htmlFor="captain_name"
                    className="absolute left-4 -top-2.5 bg-[#0a0604] px-2 text-sm text-[#ff6b35] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-[#ff6b35] peer-focus:text-sm"
                  >
                    Full Name *
                  </label>
                  {formData.captain_name && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-4 text-green-500"
                    >
                      ✓
                    </motion.span>
                  )}
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white placeholder-transparent peer focus:outline-none focus:border-[#ff6b35] transition-colors"
                    placeholder="Email"
                    id="email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 -top-2.5 bg-[#0a0604] px-2 text-sm text-[#ff6b35] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-[#ff6b35] peer-focus:text-sm"
                  >
                    Email Address *
                  </label>
                  {formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-4 text-green-500"
                    >
                      ✓
                    </motion.span>
                  )}
                </div>

                {/* Mobile */}
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.captain_contact}
                    onChange={(e) => handleInputChange("captain_contact", e.target.value)}
                    className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white placeholder-transparent peer focus:outline-none focus:border-[#ff6b35] transition-colors"
                    placeholder="Mobile"
                    id="captain_contact"
                    maxLength="10"
                  />
                  <label
                    htmlFor="captain_contact"
                    className="absolute left-4 -top-2.5 bg-[#0a0604] px-2 text-sm text-[#ff6b35] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-[#ff6b35] peer-focus:text-sm"
                  >
                    Mobile Number *
                  </label>
                  {formData.captain_contact && /^\d{10}$/.test(formData.captain_contact) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-4 text-green-500"
                    >
                      ✓
                    </motion.span>
                  )}
                </div>

                {/* Institution */}
                <div className="relative">
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleInputChange("institution", e.target.value)}
                    className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white placeholder-transparent peer focus:outline-none focus:border-[#ff6b35] transition-colors"
                    placeholder="Institution"
                    id="institution"
                  />
                  <label
                    htmlFor="institution"
                    className="absolute left-4 -top-2.5 bg-[#0a0604] px-2 text-sm text-[#ff6b35] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-[#ff6b35] peer-focus:text-sm"
                  >
                    College / Institution *
                  </label>
                  {formData.institution && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-4 text-green-500"
                    >
                      ✓
                    </motion.span>
                  )}
                </div>

                {/* City */}
                <div className="relative">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white placeholder-transparent peer focus:outline-none focus:border-[#ff6b35] transition-colors"
                    placeholder="City"
                    id="city"
                  />
                  <label
                    htmlFor="city"
                    className="absolute left-4 -top-2.5 bg-[#0a0604] px-2 text-sm text-[#ff6b35] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-[#ff6b35] peer-focus:text-sm"
                  >
                    City
                  </label>
                </div>

                {/* College Address */}
                <div className="relative">
                  <textarea
                    value={formData.college_address}
                    onChange={(e) => handleInputChange("college_address", e.target.value)}
                    className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white placeholder-transparent peer focus:outline-none focus:border-[#ff6b35] transition-colors min-h-[100px]"
                    placeholder="College Address"
                    id="college_address"
                  />
                  <label
                    htmlFor="college_address"
                    className="absolute left-4 -top-2.5 bg-[#0a0604] px-2 text-sm text-[#ff6b35]"
                  >
                    College Address
                  </label>
                </div>

                {/* Accommodation */}
                <div className="flex items-center space-x-3 p-4 bg-[#0a0604] rounded-xl border border-[#3a2416]">
                  <input
                    type="checkbox"
                    id="need_accommodation"
                    checked={formData.need_accommodation}
                    onChange={(e) => handleInputChange("need_accommodation", e.target.checked)}
                    className="w-5 h-5 rounded border-[#3a2416] bg-[#1a1410] text-[#ff6b35] focus:ring-[#ff6b35]"
                  />
                  <label htmlFor="need_accommodation" className="text-gray-300 cursor-pointer">
                    I need accommodation
                  </label>
                </div>

                {formData.need_accommodation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.accommodation_days}
                        onChange={(e) => handleInputChange("accommodation_days", e.target.value)}
                        className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white placeholder-transparent peer focus:outline-none focus:border-[#ff6b35]"
                        placeholder="Days"
                        id="accommodation_days"
                      />
                      <label
                        htmlFor="accommodation_days"
                        className="absolute left-4 -top-2.5 bg-[#0a0604] px-2 text-sm text-[#ff6b35]"
                      >
                        No. of Days
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.accommodation_people}
                        onChange={(e) => handleInputChange("accommodation_people", e.target.value)}
                        className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white placeholder-transparent peer focus:outline-none focus:border-[#ff6b35]"
                        placeholder="People"
                        id="accommodation_people"
                      />
                      <label
                        htmlFor="accommodation_people"
                        className="absolute left-4 -top-2.5 bg-[#0a0604] px-2 text-sm text-[#ff6b35]"
                      >
                        No. of People
                      </label>
                    </div>
                  </motion.div>
                )}
              </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl font-semibold border border-[#3a2416] hover:border-[#ff6b35] transition-all duration-300"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={selectedSport === "Athletics" && !formData.athleticsEvent}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedSport === "Athletics" && !formData.athleticsEvent
                      ? "bg-gray-600 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:shadow-xl hover:shadow-[#ff6b35]/20 hover:scale-105"
                  }`}
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Team Setup (Conditional) */}
          {currentStep === 2 && isTeamSport && (
            <motion.div
              key="step2"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">👥</div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#ffb77a] mb-2">
                  Build Your Team
                </h2>
                <p className="text-gray-400">Add your team members and select captain</p>
              </div>

              <div className="bg-[#1a1410]/30 backdrop-blur-sm border border-[#3a2416] rounded-2xl p-6 md:p-8 space-y-6">
                {/* Team Name */}
                <div className="relative">
                  <input
                    type="text"
                    value={formData.team_name}
                    onChange={(e) => handleInputChange("team_name", e.target.value)}
                    className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white placeholder-transparent peer focus:outline-none focus:border-[#ff6b35] transition-colors"
                    placeholder="Team Name"
                    id="team_name"
                  />
                  <label
                    htmlFor="team_name"
                    className="absolute left-4 -top-2.5 bg-[#0a0604] px-2 text-sm text-[#ff6b35] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-[#ff6b35] peer-focus:text-sm"
                  >
                    Team Name *
                  </label>
                </div>

                {/* Number of Players */}
                <div className="relative">
                  <input
                    type="number"
                    value={formData.num_players}
                    onChange={(e) => handleInputChange("num_players", e.target.value)}
                    className="w-full bg-[#0a0604] border border-[#3a2416] rounded-xl px-4 py-4 text-white placeholder-transparent peer focus:outline-none focus:border-[#ff6b35] transition-colors"
                    placeholder="Number of Players"
                    id="num_players"
                  />
                  <label
                    htmlFor="num_players"
                    className="absolute left-4 -top-2.5 bg-[#0a0604] px-2 text-sm text-[#ff6b35] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-[#ff6b35] peer-focus:text-sm"
                  >
                    Number of Players *
                  </label>
                </div>

                {/* Team Members */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[#ffb77a]">Team Members</h3>
                    <button
                      onClick={addTeamMember}
                      className="px-4 py-2 rounded-lg bg-[#ff6b35]/20 border border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white transition-all duration-300 flex items-center gap-2"
                    >
                      <span>+</span> Add Player
                    </button>
                  </div>

                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-4 bg-[#0a0604] border border-[#3a2416] rounded-xl space-y-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Player {index + 1}</span>
                        <button
                          onClick={() => removeTeamMember(member.id)}
                          className="text-red-500 hover:text-red-400 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, "name", e.target.value)}
                        placeholder="Player Name"
                        className="w-full bg-[#1a1410] border border-[#3a2416] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff6b35]"
                      />
                      <input
                        type="tel"
                        value={member.contact}
                        onChange={(e) => updateTeamMember(member.id, "contact", e.target.value)}
                        placeholder="Contact Number"
                        maxLength="10"
                        className="w-full bg-[#1a1410] border border-[#3a2416] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff6b35]"
                      />
                    </motion.div>
                  ))}

                  {teamMembers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No team members added yet. Click "+ Add Player" to start.
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl font-semibold border border-[#3a2416] hover:border-[#ff6b35] transition-all duration-300"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:shadow-xl hover:shadow-[#ff6b35]/20 hover:scale-105 transition-all duration-300"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Captain Selection (Conditional) */}
          {currentStep === 4 && isTeamSport && teamMembers.length > 0 && (
            <motion.div
              key="step4"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">👑</div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#ffb77a] mb-2">
                  Select Team Captain
                </h2>
                <p className="text-gray-400">Choose your team representative</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedCaptain(index)}
                    className={`
                      p-6 rounded-xl cursor-pointer transition-all duration-300
                      ${
                        selectedCaptain === index
                          ? "bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] shadow-xl shadow-[#ff6b35]/20"
                          : "bg-[#1a1410]/50 border border-[#3a2416] hover:border-[#ff6b35]/50"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Player {index + 1}</span>
                      {selectedCaptain === index && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-2xl"
                        >
                          👑
                        </motion.span>
                      )}
                    </div>
                    <div className="text-lg font-semibold mb-1">{member.name || "Unnamed Player"}</div>
                    <div className="text-sm text-gray-400">{member.contact || "No contact"}</div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl font-semibold border border-[#3a2416] hover:border-[#ff6b35] transition-all duration-300"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={selectedCaptain === null}
                  className={`
                    px-8 py-3 rounded-xl font-semibold transition-all duration-300
                    ${
                      selectedCaptain !== null
                        ? "bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:shadow-xl hover:shadow-[#ff6b35]/20 hover:scale-105"
                        : "bg-gray-700 cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Payment & Documents */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">💳</div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#ffb77a] mb-2">
                  Payment & Documents
                </h2>
                <p className="text-gray-400">Complete your registration</p>
              </div>

              <div className="bg-[#1a1410]/30 backdrop-blur-sm border border-[#3a2416] rounded-2xl p-6 md:p-8 space-y-6">
                {/* Payment Details */}
                <div className="p-6 bg-[#0a0604] rounded-xl border border-[#ff6b35]/30">
                  <h3 className="text-lg font-semibold text-[#ffb77a] mb-4">Registration Fees</h3>
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>Total Amount:</span>
                    <span className="text-[#ff6b35]">
                      ₹
                      {(() => {
                        // Athletics - based on event type
                        if (selectedSport === "Athletics" && formData.athleticsEventType) {
                          return formData.athleticsEventType === "individual" 
                            ? selectedSportData.fees.individual 
                            : selectedSportData.fees.team;
                        }
                        // Check if sport has gender-specific fees
                        if (selectedSportData?.fees?.men && selectedSportData?.fees?.women) {
                          return formData.teamGender === "male" 
                            ? selectedSportData.fees.men 
                            : formData.teamGender === "female"
                            ? selectedSportData.fees.women
                            : "N/A";
                        }
                        // Otherwise use standard fee
                        return selectedSportData?.fees?.amount ||
                               selectedSportData?.fees?.individual ||
                               "N/A";
                      })()}
                    </span>
                  </div>
                  {selectedSportData?.fees?.note && (
                    <p className="text-sm text-gray-400 mt-2">
                      {selectedSportData.fees.note}
                      {formData.teamGender && (
                        <span className="ml-2 text-[#ff6b35]">
                          ({formData.teamGender === "male" ? "Men's" : "Women's"} Category)
                        </span>
                      )}
                      {selectedSport === "Athletics" && formData.athleticsEventType && formData.athleticsEvent && (
                        <span className="ml-2 text-[#ff6b35]">
                          ({formData.athleticsEventType === "individual" ? "Individual" : "Team"} - {formData.athleticsEvent})
                        </span>
                      )}
                    </p>
                  )}
                  
                  {/* Game Coordinators */}
                  {selectedSportData?.coordinators && selectedSportData.coordinators.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#3a2416]">
                      <h4 className="text-sm font-semibold text-[#ffb77a] mb-2 flex items-center gap-2">
                        <span>📞</span> Game Coordinators
                      </h4>
                      <div className="space-y-2">
                        {selectedSportData.coordinators.map((coord, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">{coord.name}</span>
                            <a 
                              href={`tel:${coord.phone}`}
                              className="text-[#ff6b35] hover:text-[#ff8b55] transition-colors font-mono"
                            >
                              {coord.phone}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment QR */}
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-[#ffb77a]">Scan to Pay</h3>
                  <div className="inline-block p-4 bg-white rounded-xl">
                    <img
                      src={PAYMENT_QR_URL}
                      alt="Payment QR"
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-400">UPI ID: sagarubale2004@oksbi</p>
                  
                  <button
                    onClick={() => setShowBackupQR(!showBackupQR)}
                    className="text-sm text-[#ff6b35] hover:underline"
                  >
                    {showBackupQR ? "Hide" : "Show"} Alternative Payment Methods
                  </button>

                  {showBackupQR && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                    >
                      {BACKUP_QR_URLS.map((qr, index) => (
                        <div key={index} className="p-4 bg-[#0a0604] rounded-xl border border-[#3a2416]">
                          <h4 className="text-sm font-semibold text-[#ffb77a] mb-2">{qr.name}</h4>
                          <img src={qr.url} alt={qr.name} className="w-full h-48 object-contain mb-2" />
                          <p className="text-xs text-gray-400">{qr.upiId}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Document Uploads */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#ffb77a]">Upload Documents</h3>
                  
                  {/* Transaction Receipt */}
                  <div className="p-4 bg-[#0a0604] rounded-xl border border-[#3a2416]">
                    <label className="block text-sm font-medium mb-2">
                      Payment Screenshot * <span className="text-red-500">Required</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, "transactionReceipt")}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#ff6b35] file:text-white hover:file:bg-[#ff8c42] cursor-pointer"
                    />
                    {documents.transactionReceipt && (
                      <p className="text-xs text-green-500 mt-2">✓ Uploaded successfully</p>
                    )}
                  </div>

                  {/* Permission Letter */}
                  <div className="p-4 bg-[#0a0604] rounded-xl border border-[#3a2416]">
                    <label className="block text-sm font-medium mb-2">
                      Permission Letter <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, "permissionLetter")}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#3a2416] file:text-gray-300 hover:file:bg-[#4a3426] cursor-pointer"
                    />
                    {documents.permissionLetter && (
                      <p className="text-xs text-green-500 mt-2">✓ Uploaded successfully</p>
                    )}
                  </div>

                  {/* ID Card */}
                  <div className="p-4 bg-[#0a0604] rounded-xl border border-[#3a2416]">
                    <label className="block text-sm font-medium mb-2">
                      ID Card <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, "captainIdCard")}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#3a2416] file:text-gray-300 hover:file:bg-[#4a3426] cursor-pointer"
                    />
                    {documents.captainIdCard && (
                      <p className="text-xs text-green-500 mt-2">✓ Uploaded successfully</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl font-semibold border border-[#3a2416] hover:border-[#ff6b35] transition-all duration-300"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:shadow-xl hover:shadow-[#ff6b35]/20 hover:scale-105 transition-all duration-300"
                >
                  Review & Submit →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Review & Confirm */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">📋</div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#ffb77a] mb-2">
                  Review Your Registration
                </h2>
                <p className="text-gray-400">Make sure everything is correct</p>
              </div>

              <div className="space-y-4">
                {/* Sport */}
                <div className="bg-[#1a1410]/50 backdrop-blur-sm border border-[#3a2416] rounded-xl p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Selected Sport</div>
                      <div className="text-xl font-semibold flex items-center gap-2">
                        <span>{SPORT_ICONS[selectedSport]}</span>
                        <span>{selectedSport}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-[#ff6b35] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="bg-[#1a1410]/50 backdrop-blur-sm border border-[#3a2416] rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-lg font-semibold text-[#ffb77a]">Personal Details</div>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-sm text-[#ff6b35] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Name:</span> {formData.captain_name}
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span> {formData.email}
                    </div>
                    <div>
                      <span className="text-gray-400">Mobile:</span> {formData.captain_contact}
                    </div>
                    <div>
                      <span className="text-gray-400">Institution:</span> {formData.institution}
                    </div>
                    {formData.teamGender && (
                      <div>
                        <span className="text-gray-400">Team Category:</span>{" "}
                        <span className="text-[#ff6b35] font-semibold">
                          {formData.teamGender === "male" ? "Men's" : "Women's"}
                        </span>
                      </div>
                    )}
                    {formData.city && (
                      <div>
                        <span className="text-gray-400">City:</span> {formData.city}
                      </div>
                    )}
                    {formData.need_accommodation && (
                      <div>
                        <span className="text-gray-400">Accommodation:</span> Yes ({formData.accommodation_days} days, {formData.accommodation_people} people)
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Details */}
                {isTeamSport && (
                  <div className="bg-[#1a1410]/50 backdrop-blur-sm border border-[#3a2416] rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-lg font-semibold text-[#ffb77a]">Team Details</div>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="text-sm text-[#ff6b35] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-400">Team Name:</span> {formData.team_name}
                      </div>
                      <div>
                        <span className="text-gray-400">Total Players:</span> {formData.num_players}
                      </div>
                      <div>
                        <span className="text-gray-400">Team Captain:</span>{" "}
                        {teamMembers[selectedCaptain]?.name || "Not selected"} 👑
                      </div>
                      <div className="pt-3 border-t border-[#3a2416]">
                        <span className="text-gray-400 block mb-2">Team Members:</span>
                        <div className="space-y-2">
                          {teamMembers.map((member, index) => (
                            <div key={member.id} className="flex items-center gap-2">
                              <span className="text-gray-500">{index + 1}.</span>
                              <span>{member.name}</span>
                              {index === selectedCaptain && <span className="text-xs">👑</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="bg-[#1a1410]/50 backdrop-blur-sm border border-[#3a2416] rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-lg font-semibold text-[#ffb77a]">Documents</div>
                    <button
                      onClick={() => setCurrentStep(5)}
                      className="text-sm text-[#ff6b35] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={documents.transactionReceipt ? "text-green-500" : "text-red-500"}>
                        {documents.transactionReceipt ? "✓" : "✗"}
                      </span>
                      <span>Payment Screenshot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={documents.permissionLetter ? "text-green-500" : "text-gray-500"}>
                        {documents.permissionLetter ? "✓" : "○"}
                      </span>
                      <span className="text-gray-400">Permission Letter (Optional)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={documents.captainIdCard ? "text-green-500" : "text-gray-500"}>
                        {documents.captainIdCard ? "✓" : "○"}
                      </span>
                      <span className="text-gray-400">ID Card (Optional)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="p-4 bg-[#0a0604] rounded-xl border border-[#3a2416] text-sm text-gray-400">
                <p>
                  By submitting this registration, you confirm that all information provided is accurate
                  and you agree to abide by the rules and regulations of ZENITH 2026.
                </p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl font-semibold border border-[#3a2416] hover:border-[#ff6b35] transition-all duration-300"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`
                    px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2
                    ${
                      !submitting
                        ? "bg-gradient-to-r from-green-600 to-green-500 hover:shadow-xl hover:shadow-green-600/20 hover:scale-105"
                        : "bg-gray-700 cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  {submitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span>🎉</span> Submit Registration
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Success Screen */}
          {registrationComplete && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              {/* Confetti effect */}
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: [0, 1, 0], y: 50 }}
                transition={{ duration: 2, repeat: 3 }}
                className="text-6xl"
              >
                🎊
              </motion.div>

              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-7xl"
                >
                  ✅
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Registration Successful!
                </h2>
                <p className="text-gray-400 text-lg">
                  Welcome to ZENITH 2026
                </p>
              </div>

              {/* Registration Number */}
              <div className="bg-[#1a1410]/50 backdrop-blur-sm border border-[#3a2416] rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-sm text-gray-400 mb-2">Your Registration ID</div>
                <div className="text-3xl font-bold text-[#ff6b35] mb-4 tracking-wider">
                  {registrationNumber}
                </div>
                <div className="text-xs text-gray-500">
                  Please save this ID for future reference
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <button
                  onClick={() => navigate("/schedule")}
                  className="flex-1 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:shadow-xl hover:shadow-[#ff6b35]/20 hover:scale-105 transition-all duration-300"
                >
                  📅 View Schedule
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 px-6 py-4 rounded-xl font-semibold border border-[#3a2416] hover:border-[#ff6b35] transition-all duration-300"
                >
                  🏠 Go to Home
                </button>
              </div>

              {/* Next Steps */}
              <div className="mt-12 p-6 bg-[#1a1410]/30 backdrop-blur-sm border border-[#3a2416] rounded-xl text-left max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-[#ffb77a] mb-4">What's Next?</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex gap-3">
                    <span className="text-[#ff6b35]">✓</span>
                    <span>You'll receive a confirmation email shortly</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[#ff6b35]">✓</span>
                    <span>Check your spam folder if you don't see it in your inbox</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[#ff6b35]">✓</span>
                    <span>Bring a printed copy of your registration ID on event day</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[#ff6b35]">✓</span>
                    <span>Follow our social media for updates and announcements</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernRegistration;
