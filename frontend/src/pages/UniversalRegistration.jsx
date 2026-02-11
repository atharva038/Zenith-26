import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import api from "../config/api";
import Navbar from "../components/Navbar";
import { useRegistrationStatus } from "../hooks/useRegistrationStatus";
import RegistrationClosed from "../components/RegistrationClosed";

// Import all sports data from UniversalRegistration
const SPORTS_DATA = {
  Cricket: {
    name: "Cricket Tournament",
    venue: "SGGSIE&T Cricket Ground",
    fees: { amount: 6500, note: "per team (Men)" },
    rules: [
      "11 playing players (standard cricket team)",
      "15 or 20 overs innings",
      "Free hit on no-ball",
      "Super over if tie",
      "Bowl out in rain",
      "Max 3-4 overs per bowler",
      "Turf wickets",
      "Impact player rule allowed",
      "Umpire decision final",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Pranav Godle", phone: "9028783635" },
      { name: "Shahaji Bhosle", phone: "8308949481" },
    ],
  },
  "Box Cricket": {
    name: "Box Cricket Championship",
    venue: "Box Cricket Arena",
    fees: { amount: 3000, note: "per team" },
    rules: [
      "Maximum 8 players per team (6 playing + 2 substitutes)",
      "Shortened pitch format",
      "Tennis ball cricket",
      "Modified cricket rules apply",
    ],
    coordinators: [
      { name: "Pranav Godle", phone: "9028783635" },
      { name: "Shahaji Bhosle", phone: "8308949481" },
    ],
  },
  Football: {
    name: "Football Championship",
    venue: "SGGSIE&T Football Ground",
    fees: { amount: 3000, note: "per team" },
    rules: [
      "Maximum 16 players",
      "FIFA rules applicable",
      "Standard kit required",
      "20 minutes early reporting",
      "Disqualification if absent",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Rohan Pundkare", phone: "7249886133" },
      { name: "Srujan Pal", phone: "8788766970" },
    ],
  },
  Basketball: {
    name: "Basketball (5x5) Tournament",
    venue: "Basketball Court",
    fees: { men: 2500, women: 1500, note: "per team" },
    rules: [
      "Maximum 12 players per team",
      "SPPU rules applicable",
      "20 minutes early reporting compulsory",
      "Disqualification if absent",
      "Player ID verification decision final",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Uday Naukarkar", phone: "9322684201" },
      { name: "Krushna Jadhav", phone: "8208422959" },
    ],
  },
  Volleyball: {
    name: "Volleyball Championship",
    fees: { men: 2200, women: 1500, note: "per team" },
    venue: "Outdoor Volleyball Court",
    rules: [
      "6 playing players",
      "Maximum 12 players per team",
      "Best of 3 sets (25, 25, 15 points)",
      "FIVB rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Maitreyi Bhumbar", phone: "8788183714" },
      { name: "Harsh Marodkar", phone: "8208016898" },
    ],
  },
  Badminton: {
    name: "Badminton Tournament",
    fees: { men: 1000, women: 800, note: "per team" },
    venue: "Indoor Badminton Courts",
    rules: [
      "Maximum 5 players per team",
      "Best of 3 games (15 points each)",
      "Bring own kit",
      "SPPU rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Harsh Keshkar", phone: "8010529661" },
      { name: "Aditi Phulare", phone: "8669995909" },
    ],
  },
  "Table Tennis": {
    name: "Table Tennis Championship",
    fees: { amount: 400, note: "per player" },
    venue: "Indoor TT Hall",
    rules: [
      "Singles and Doubles events",
      "Best of 5 games to 11 points",
      "ITTF rules apply",
    ],
    coordinators: [{ name: "Pooja Reddy", phone: "9876543217" }],
  },
  Chess: {
    fees: { men: 500, women: 400, note: "per team" },
    name: "Chess Tournament",
    venue: "Auditorium",
    rules: [
      "Team & Individual events",
      "FIDE & Swiss system rules", 
      "No electronic devices",
      "Bring own chess clock",
      "20 minutes early reporting",
    ],
    coordinators: [
      { name: "Sarthak Rahut", phone: "8788380729" },
      { name: "Akshit Tupkar", phone: "7028455126" },
    ],
  },
  Carrom: {
    fees: { amount: 300, note: "per player" },
    name: "Carrom Championship",
    venue: "Indoor Games Room",
    rules: [
      "Singles and Doubles events",
      "25 points per game",
      "ICF rules apply",
    ],
    coordinators: [{ name: "Neha Gupta", phone: "9876543219" }],
  },
  Athletics: {
    fees: {
      individual: 200,
      team: 700,
      note: "Individual: ₹200 | Team: ₹700",
    },
    name: "Athletics Meet",
    venue: "SGGSIE&T Athletics Track",
    rules: [
      "Individual Events: 100m, 400m, Shot Put, Discus, Long Jump",
      "Team Events: 4x100m Relay, Mixed Relay (2 Boys + 2 Girls)",
      "20 minutes early reporting",
      "Player identification verification final",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Dipanshu Sahatpute", phone: "7620666188" },
      { name: "Shrujan Pal", phone: "8788766970" },
    ],
  },
  Swimming: {
    fees: { amount: 300, note: "per athlete" },
    name: "Swimming Competition",
    venue: "City Swimming Pool",
    rules: [
      "50m, 100m, 200m Freestyle",
      "50m, 100m Backstroke, Breaststroke, Butterfly",
      "Individual events",
    ],
    coordinators: [{ name: "Divya Nair", phone: "9876543221" }],
  },
  Kabaddi: {
    name: "Kabaddi Tournament",
    venue: "Outdoor Sports Ground",
    fees: { men: 2200, women: 1500, note: "per team" },
    rules: [
      "Maximum 12 players per team",
      "Two halves of 15 minutes",
      "Weight limit: Up to 80 kg",
      "Played on mat",
      "Kabaddi Federation rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Shubham Kale", phone: "7378409793" },
      { name: "Sonam Chandel", phone: "8329513257" },
      { name: "Chetan Bante", phone: "8263945881" },
    ],
  },
  "Kho-Kho": {
    name: "Kho-Kho Championship",
    venue: "Outdoor Sports Ground",
    fees: { men: 1500, women: 1200, note: "per team" },
    rules: [
      "Minimum 9, Maximum 12 players",
      "20-minute match (7+7 minutes halves, 6-minute break)",
      "Federation rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Sairaj Shinde", phone: "8767179744" },
      { name: "Prem Dhande", phone: "8421230555" },
    ],
  },
  Hockey: {
    name: "Hockey Tournament",
    venue: "Hockey Turf",
    fees: { amount: 2500, note: "per team" },
    rules: [
      "Maximum 18 players per team (11 playing + 7 substitutes)",
      "Two halves of 35 minutes each",
      "FIH rules apply",
    ],
    coordinators: [{ name: "Aditya Rao", phone: "9876543224" }],
  },
  "Lawn Tennis": {
    name: "Lawn Tennis Championship",
    venue: "Tennis Courts",
    fees: { amount: 500, note: "per player" },
    rules: [
      "Singles and Doubles events",
      "Best of 3 sets",
      "ATP/WTA rules apply",
    ],
    coordinators: [{ name: "Riya Shah", phone: "9876543225" }],
  },
  Squash: {
    name: "Squash Tournament",
    venue: "Indoor Squash Courts",
    fees: { amount: 400, note: "per player" },
    rules: ["Singles event", "Best of 5 games to 11 points", "PSA rules apply"],
    coordinators: [{ name: "Sameer Khan", phone: "9876543226" }],
  },
  Handball: {
    name: "Handball Championship",
    venue: "Outdoor Sports Ground",
    fees: { amount: 1500, note: "per team" },
    rules: [
      "Minimum 9, Maximum 16 players",
      "25-minute match (10+10 minutes halves, 5-minute break)",
      "Rolling substitutions allowed",
      "20 minutes early reporting",
      "Disqualification if absent",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Aditya Joshi", phone: "7820939780" },
      { name: "Amarja Dhepe", phone: "9552110021" },
    ],
  },
  "Rink Football": {
    name: "Rink Football Tournament",
    venue: "Outdoor Sports Hall",
    fees: { men: 2200, women: 1500, note: "per team" },
    rules: [
      "Boys: 6 playing | Girls: 7 playing",
      "Maximum squad: 10 players",
      "No offside rule",
      "Rolling substitutions",
      "Yellow card = 2-minute suspension",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Onkar Sahane", phone: "8767192671" },
      { name: "Vipakshi Mate", phone: "7972776597" },
    ],
  },
  "Power Lifting": {
    name: "Power Lifting Competition",
    venue: "Gymnasium",
    fees: { amount: 300, note: "per player" },
    rules: [
      "Individual event",
      "3 attempts each: Squat, Bench Press, Deadlift",
      "Bring own accessories",
      "International weight categories",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Tejas Borole", phone: "8767386695" },
      { name: "Sakshi Done", phone: "9028684180" },
    ],
  },
};

// Payment QR Code - Main Zenith QR (Pramila Patil)
const PAYMENT_QR_URL =
  "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770705868/zenith-2026/payment-qr/main-payment-qr.png";

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
  Cricket: "🏏",
  "Box Cricket": "🏏",
  Football: "⚽",
  Basketball: "🏀",
  "Basketball (3x3)": "🏀",
  Volleyball: "🏐",
  Badminton: "🏸",
  "Table Tennis": "🏓",
  Chess: "♟️",
  Carrom: "🎯",
  Athletics: "🏃",
  Swimming: "🏊",
  Kabaddi: "🤼",
  "Kho-Kho": "🏃‍♂️",
  Hockey: "🏒",
  "Lawn Tennis": "🎾",
  Squash: "🎾",
  Handball: "🤾",
  "Rink Football": "⚽",
  "Power Lifting": "🏋️",
};

// Team sports that require team setup
const TEAM_SPORTS = [
  "Cricket",
  "Box Cricket",
  "Football",
  "Basketball",
  "Volleyball",
  "Kabaddi",
  "Kho-Kho",
  "Hockey",
  "Rink Football",
  "Handball",
];

// **STRICT TEAM SIZE VALIDATION CONFIG**
// exactPlayers: MUST have exactly this many players (MANDATORY)
// minPlayers/maxPlayers: Range allowed if exactPlayers is null
const TEAM_SPORTS_CONFIG = {
  "Cricket": { minPlayers: 11, maxPlayers: 15, exactPlayers: null },
  "Box Cricket": { minPlayers: 6, maxPlayers: 8, exactPlayers: null },
  "Football": { minPlayers: 11, maxPlayers: 16, exactPlayers: null },
  "Basketball": { minPlayers: 5, maxPlayers: 12, exactPlayers: null },
  "Volleyball": { minPlayers: 6, maxPlayers: 12, exactPlayers: null },
  "Kabaddi": { minPlayers: 7, maxPlayers: 12, exactPlayers: null },
  "Kho-Kho": { minPlayers: 9, maxPlayers: 15, exactPlayers: null },
  "Hockey": { minPlayers: 11, maxPlayers: 18, exactPlayers: null },
  "Rink Football": { minPlayers: 5, maxPlayers: 10, exactPlayers: null },
  "Handball": { minPlayers: 7, maxPlayers: 14, exactPlayers: null },
};

const UniversalRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check registration status with separate toggles (MUST be before any conditional returns)
  const { 
    isCricketOpen, 
    isOtherSportsOpen, 
    isOpen, 
    loading: statusLoading, 
    message, 
    startDate, 
    endDate,
    paymentQrUrl,
    error: statusError
  } = useRegistrationStatus();
  
  // Filter available sports based on toggle states
  const availableSports = React.useMemo(() => {
    const allSports = Object.keys(SPORTS_DATA);
    
    // If both are closed, show nothing
    if (!isCricketOpen && !isOtherSportsOpen) {
      return [];
    }
    
    // If only cricket is open, show only cricket (NOT Box Cricket)
    if (isCricketOpen && !isOtherSportsOpen) {
      return allSports.filter(sport => sport === "Cricket");
    }
    
    // If only other sports are open, show other sports (excluding cricket, but including Box Cricket)
    if (!isCricketOpen && isOtherSportsOpen) {
      return allSports.filter(sport => sport !== "Cricket");
    }
    
    // If both are open, show all sports
    return allSports;
  }, [isCricketOpen, isOtherSportsOpen]);
  
  // Multi-step state (ALL useState hooks MUST be declared before any conditional returns)
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [sportPreselected, setSportPreselected] = useState(false); // Track if sport was already preselected
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
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedCaptain, setSelectedCaptain] = useState(0);
  const [documents, setDocuments] = useState({
    permissionLetter: null,
    transactionReceipt: null,
    captainIdCard: null,
  });
  const [documentPreviews, setDocumentPreviews] = useState({
    permissionLetter: null,
    transactionReceipt: null,
    captainIdCard: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  // const [showBackupQR, setShowBackupQR] = useState(false); // Unused
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);

  // Check if form has been started (user has entered any data)
  const isFormStarted = () => {
    if (registrationComplete) return false; // Don't block after successful registration
    if (currentStep === 1 && !selectedSport) return false; // On first step with no sport selected
    
    // Check if any form data has been filled
    const hasFormData = Object.values(formData).some(value => {
      if (typeof value === 'boolean') return false; // Ignore boolean fields
      return value && value.toString().trim() !== '';
    });
    
    const hasTeamMembers = teamMembers.length > 0;
    const hasDocuments = Object.values(documents).some(doc => doc !== null);
    const hasSportSelected = selectedSport !== "";
    
    return hasSportSelected || hasFormData || hasTeamMembers || hasDocuments || currentStep > 1;
  };

  // ALL useEffect HOOKS MUST BE BEFORE CONDITIONAL RETURNS
  // Warn user before leaving/refreshing page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormStarted()) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep, selectedSport, formData, teamMembers, documents, registrationComplete, isFormStarted]);

  // Intercept navbar link clicks to show warning
  useEffect(() => {
    const handleClick = (e) => {
      // Check if click is on a navigation link
      const target = e.target.closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      
      // Only intercept if form is started and link is navigating away from current page
      if (href && href !== location.pathname && isFormStarted()) {
        e.preventDefault();
        e.stopPropagation();
        setShowNavigationWarning(true);
        
        // Store the intended destination
        window.pendingNavigationPath = href;
      }
    };

    // Add listener to navbar
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.addEventListener('click', handleClick, true);
      return () => navbar.removeEventListener('click', handleClick, true);
    }
  }, [location.pathname, currentStep, selectedSport, formData, teamMembers, documents, registrationComplete, isFormStarted]);

  // Handle confirmed navigation
  const handleConfirmNavigation = () => {
    setShowNavigationWarning(false);
    if (window.pendingNavigationPath) {
      navigate(window.pendingNavigationPath);
      window.pendingNavigationPath = null;
    }
  };

  const handleCancelNavigation = () => {
    setShowNavigationWarning(false);
    window.pendingNavigationPath = null;
  };

  // Handle preselection from SportsGrid, GameVerse, or URL parameter
  useEffect(() => {
    // Check URL search params first (e.g., ?sport=Cricket)
    const searchParams = new URLSearchParams(location.search);
    const sportParam = searchParams.get('sport');
    
    if (sportParam && SPORTS_DATA[sportParam]) {
      setSelectedSport(sportParam);
      setCurrentStep(2); // Skip sport selection
      toast.success(`🏏 ${sportParam} Registration - Let's get started! 🎯`, {
        autoClose: 3000,
        style: { fontSize: '16px', fontWeight: 'bold' }
      });
      return; // Exit early if URL param found
    }

    // Fallback to state-based preselection from SportsGrid/GameVerse (only on first load)
    if (!sportPreselected && (location.state?.fromSportsGrid || location.state?.fromGameVerse) && location.state?.preselectedSport) {
      const sportName = location.state.preselectedSport.toUpperCase();
      
      const sportMapping = {
        FOOTBALL: "Football",
        "BASKETBALL (5X5)": "Basketball",
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
        "RINK FOOTBALL": "Rink Football",
        "KHO-KHO": "Kho-Kho",
      };
      const mappedSport = sportMapping[sportName];
      if (mappedSport && SPORTS_DATA[mappedSport]) {
        setSelectedSport(mappedSport);
        setCurrentStep(2); // Skip sport selection
        setSportPreselected(true); // Mark as preselected
        toast.success(`${mappedSport} preselected! 🎯`);
        
        // Clear the navigation state to prevent re-selection on reload
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.search, sportPreselected, location.state]);

  const selectedSportData = selectedSport ? SPORTS_DATA[selectedSport] : null;
  const isTeamSport = TEAM_SPORTS.includes(selectedSport);
  const teamConfig = isTeamSport ? TEAM_SPORTS_CONFIG[selectedSport] : null;
  const hasGenderOptions = selectedSportData?.fees && (selectedSportData.fees.men || selectedSportData.fees.women);
  
  // Gender selection handler
  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    toast.success(`${gender === 'men' ? 'Men\'s' : 'Women\'s'} category selected! 👥`);
  };
  
  // Get appropriate fee display
  const getDisplayFee = () => {
    if (!selectedSportData?.fees) return "N/A";
    
    if (typeof selectedSportData.fees === 'object' && selectedSportData.fees.amount) {
      // Single fee structure
      return `₹${selectedSportData.fees.amount} ${selectedSportData.fees.note || ""}`;
    } else if (typeof selectedSportData.fees === 'object' && (selectedSportData.fees.men || selectedSportData.fees.women)) {
      // Gender-based fees
      if (selectedGender === 'men' && selectedSportData.fees.men) {
        return `₹${selectedSportData.fees.men} ${selectedSportData.fees.note || ""}`;
      } else if (selectedGender === 'women' && selectedSportData.fees.women) {
        return `₹${selectedSportData.fees.women} ${selectedSportData.fees.note || ""}`;
      } else if (!selectedGender) {
        // Show both options if no gender selected
        const menFee = selectedSportData.fees.men ? `Men: ₹${selectedSportData.fees.men}` : "";
        const womenFee = selectedSportData.fees.women ? `Women: ₹${selectedSportData.fees.women}` : "";
        const note = selectedSportData.fees.note ? ` ${selectedSportData.fees.note}` : "";
        return [menFee, womenFee].filter(Boolean).join(" | ") + note;
      }
    }
    
    return "N/A";
  };

  // Calculate total steps dynamically
  const totalSteps = isTeamSport ? 6 : 5; // Sport, Details, Team (optional), Captain (optional), Payment, Review

  // Progress calculation
  const progress = (currentStep / totalSteps) * 100;

  // **STRICT TEAM SIZE VALIDATION FUNCTION**
  const validateTeamSize = () => {
    if (!isTeamSport) return true;
    
    const numPlayers = parseInt(formData.num_players);
    const memberCount = teamMembers.length;

    // Check if exact number required (CRITICAL for Basketball 3x3)
    if (teamConfig.exactPlayers) {
      if (numPlayers !== teamConfig.exactPlayers) {
        toast.error(`${selectedSport} requires EXACTLY ${teamConfig.exactPlayers} players`, {
          autoClose: 5000,
          style: { fontSize: '14px', fontWeight: 'bold' }
        });
        return false;
      }
      if (memberCount !== teamConfig.exactPlayers) {
        toast.error(`You MUST add exactly ${teamConfig.exactPlayers} team members. Currently: ${memberCount}`, {
          autoClose: 5000,
          style: { fontSize: '14px', fontWeight: 'bold' }
        });
        return false;
      }
    } else {
      // Check min/max range
      if (numPlayers < teamConfig.minPlayers || numPlayers > teamConfig.maxPlayers) {
        toast.error(`${selectedSport} requires ${teamConfig.minPlayers}-${teamConfig.maxPlayers} players`, {
          autoClose: 4000
        });
        return false;
      }
      if (memberCount !== numPlayers) {
        toast.error(`Number of team members (${memberCount}) MUST match number of players (${numPlayers})`, {
          autoClose: 4000
        });
        return false;
      }
    }

    // Validate each team member has name and contact
    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i];
      if (!member.name || member.name.trim() === "") {
        toast.error(`Player ${i + 1}: Name is required`, { autoClose: 3000 });
        return false;
      }
      if (!member.contact || !/^\d{10}$/.test(member.contact)) {
        toast.error(`Player ${i + 1}: Valid 10-digit contact number is required`, { autoClose: 3000 });
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    // Validation for each step
    if (currentStep === 1 && !selectedSport) {
      toast.error("Please select a sport");
      return;
    }
    
    // Validate gender selection for sports with gender options
    if (currentStep === 1 && hasGenderOptions && !selectedGender) {
      toast.error("Please select Men's or Women's category");
      return;
    }
    
    if (currentStep === 2) {
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
    }
    if (currentStep === 3 && isTeamSport) {
      if (!formData.team_name || !formData.num_players) {
        toast.error("Please enter team name and number of players");
        return;
      }
      // **STRICT VALIDATION: Team size must match requirements**
      if (!validateTeamSize()) {
        return; // Validation failed, don't proceed
      }
    }
    if (currentStep === 4 && isTeamSport && selectedCaptain === null) {
      toast.error("Please select a team captain");
      return;
    }

    // Skip team setup steps for individual sports
    if (currentStep === 2 && !isTeamSport) {
      setCurrentStep(5); // Jump to payment
    } else if (currentStep === 3 && !isTeamSport) {
      setCurrentStep(5);
    } else if (currentStep === 4 && !isTeamSport) {
      setCurrentStep(5);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep === 5 && !isTeamSport) {
      setCurrentStep(2); // Jump back from payment to details for individual sports
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSportSelect = (sport) => {
    // If changing sport after already selecting one, reset form data
    if (selectedSport && selectedSport !== sport) {
      setFormData({
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
      });
      setTeamMembers([]);
      setSelectedCaptain(0);
      setDocuments({
        permissionLetter: null,
        transactionReceipt: null,
        captainIdCard: null,
      });
      setDocumentPreviews({
        permissionLetter: null,
        transactionReceipt: null,
        captainIdCard: null,
      });
    }
    
    // Reset gender selection when changing sports
    setSelectedGender("");
    setSelectedSport(sport);
    
    toast.success(`${sport} selected!`, { autoClose: 1500 });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Fill Test Data Function for Development
  const fillTestData = () => {
    if (!selectedSport) {
      toast.error("Please select a sport first!");
      return;
    }

    // Fill basic form data
    setFormData({
      captain_name: "Atharva Sharma",
      institution: "MIT College of Engineering",
      captain_contact: "9876543210",
      email: "atharva.test@example.com",
      team_name: selectedSport === "Cricket" ? "Thunder Strikers" : `${selectedSport} Warriors`,
      num_players: teamConfig ? String(teamConfig.minPlayers || teamConfig.exactPlayers || 5) : "1",
      city: "Pune",
      college_address: "MIT Campus, Paud Road, Kothrud, Pune - 411038",
      alternate_contact: "9123456789",
      need_accommodation: true,
      accommodation_days: "3",
      accommodation_people: "5",
    });

    // Fill team members if it's a team sport
    if (isTeamSport && teamConfig) {
      const numPlayers = teamConfig.minPlayers || teamConfig.exactPlayers || 5;
      const testMembers = [];
      
      for (let i = 1; i <= numPlayers; i++) {
        testMembers.push({
          id: Date.now() + i,
          name: `Player ${i}`,
          contact: `98765432${String(i).padStart(2, '0')}`,
        });
      }
      
      setTeamMembers(testMembers);
      setSelectedCaptain(0);
    }

    toast.success("Test data filled successfully! 🎉", {
      autoClose: 2000,
      style: { background: "#10b981", color: "white" }
    });
  };

  const addTeamMember = () => {
    // **STRICT VALIDATION: Check if max limit reached**
    if (teamConfig && teamConfig.exactPlayers && teamMembers.length >= teamConfig.exactPlayers) {
      toast.error(`${selectedSport} allows EXACTLY ${teamConfig.exactPlayers} players. Cannot add more.`, {
        autoClose: 4000
      });
      return;
    }
    if (teamConfig && !teamConfig.exactPlayers && teamMembers.length >= teamConfig.maxPlayers) {
      toast.error(`${selectedSport} allows maximum ${teamConfig.maxPlayers} players. Cannot add more.`, {
        autoClose: 4000
      });
      return;
    }

    const newMember = {
      id: Date.now(),
      name: "",
      contact: "",
    };
    setTeamMembers([...teamMembers, newMember]);
    toast.success("Player slot added! Fill in the details.", { autoClose: 2000 });
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
      
      // Save the file
      setDocuments({ ...documents, [documentType]: file });
      
      // Create and save preview URL
      const previewUrl = URL.createObjectURL(file);
      setDocumentPreviews({ ...documentPreviews, [documentType]: previewUrl });
      
      toast.success(`${documentType} uploaded!`, { autoClose: 1500 });
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(documentPreviews).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  // CONDITIONAL RETURNS MUST BE AFTER ALL HOOKS
  // Show loading state
  if (statusLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking registration status...</p>
        </div>
      </div>
    );
  }
  
  // Show registration closed page if BOTH toggles are off
  if (!isCricketOpen && !isOtherSportsOpen) {
    return <RegistrationClosed message={message} startDate={startDate} endDate={endDate} />;
  }

  const handleSubmit = async () => {
    // Final validation
    if (!documents.transactionReceipt) {
      toast.error("Please upload payment screenshot");
      return;
    }

    // **STRICT VALIDATION: Final team size check before submission**
    if (isTeamSport && !validateTeamSize()) {
      toast.error("Please fix team size validation errors before submitting", {
        autoClose: 5000
      });
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = new FormData();
      
      // Add sport selection (backend expects sportName)
      submissionData.append("sportName", selectedSport);
      
      // Add sport details (backend expects sportDetails as JSON)
      submissionData.append("sportDetails", JSON.stringify({
        name: selectedSportData.name,
        venue: selectedSportData.venue,
        fees: selectedSportData.fees,
        selectedGender: null,
        actualFee: selectedSportData.fees.amount || selectedSportData.fees.individual || selectedSportData.fees.team,
        coordinators: selectedSportData.coordinators,
      }));
      
      // Prepare form data object
      const formDataObj = {
        ...formData,
        sport: selectedSport,
        sport_name: selectedSportData.name,
        gender_category: null,
      };

      // Add team members if team sport
      if (isTeamSport) {
        formDataObj.team_members = teamMembers;
        formDataObj.captain_index = selectedCaptain;
        formDataObj.is_team_sport = true;
      }
      
      // Add form data as JSON string (backend expects formData as JSON)
      submissionData.append("formData", JSON.stringify(formDataObj));

      // Add documents
      Object.keys(documents).forEach((key) => {
        if (documents[key]) {
          submissionData.append(key, documents[key]);
        }
      });

      const response = await api.post("/registrations/sports", submissionData, {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0604] via-[#1a0e08] to-[#0a0604] text-white pt-20">
      {/* Navbar */}
      <Navbar />

      {/* Navigation Warning Modal */}
      <AnimatePresence>
        {showNavigationWarning && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelNavigation}
          >
            <motion.div
              className="relative max-w-md mx-4 p-8 bg-gradient-to-br from-orange-900/90 to-red-900/90 rounded-2xl border-2 border-orange-500/50 shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-black text-center mb-3 text-orange-300">
                ⚠️ Unsaved Changes
              </h3>
              <p className="text-center text-orange-100 mb-6 leading-relaxed">
                You have unsaved registration data. Are you sure you want to leave? 
                <br />
                <span className="text-orange-300 font-bold">All your progress will be lost!</span>
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelNavigation}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Stay & Continue
                </button>
                <button
                  onClick={handleConfirmNavigation}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Leave Anyway
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={handleCancelNavigation}
                className="absolute top-4 right-4 text-orange-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          {/* Step 1: Sport Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#ffb77a] mb-2">
                  Choose Your Sport
                </h2>
                <p className="text-gray-400">Select the sport you want to register for</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableSports.map((sport, index) => (
                  <motion.div
                    key={sport}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSportSelect(sport)}
                    className={`
                      relative p-6 rounded-xl cursor-pointer transition-all duration-300
                      ${
                        selectedSport === sport
                          ? "bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] shadow-xl shadow-[#ff6b35]/20"
                          : sport === "Cricket"
                          ? "bg-gradient-to-br from-[#10b981]/20 to-[#059669]/20 border-2 border-[#10b981] hover:border-[#10b981] hover:shadow-lg hover:shadow-[#10b981]/30"
                          : "bg-[#1a1410]/50 backdrop-blur-sm border border-[#3a2416] hover:border-[#ff6b35]/50"
                      }
                    `}
                  >
                    {/* Cricket Featured Badge */}
                    {sport === "Cricket" && selectedSport !== sport && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                      >
                        OPEN NOW! 🔥
                      </motion.div>
                    )}
                    
                    <div className="text-4xl mb-2">{SPORT_ICONS[sport] || "🏆"}</div>
                    <div className="text-sm font-medium">{sport}</div>
                    {selectedSport === sport && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <span className="text-[#ff6b35] text-xs">✓</span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Gender Selection (only for sports with different fees) */}
              {selectedSport && hasGenderOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 p-6 bg-[#1a1410]/30 backdrop-blur-sm border border-[#3a2416] rounded-xl"
                >
                  <h3 className="text-lg font-semibold text-[#ffb77a] mb-4 text-center">
                    Select Category
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedSportData.fees.men && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGenderSelect('men')}
                        className={`
                          p-4 rounded-xl transition-all duration-300 text-center
                          ${
                            selectedGender === 'men'
                              ? "bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20"
                              : "bg-[#1a1410]/50 border border-[#3a2416] hover:border-blue-500/50"
                          }
                        `}
                      >
                        <div className="text-2xl mb-2">👨</div>
                        <div className="font-semibold">Men's Team</div>
                        <div className="text-sm text-gray-400">₹{selectedSportData.fees.men}</div>
                        {selectedGender === 'men' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                          >
                            <span className="text-blue-600 text-xs">✓</span>
                          </motion.div>
                        )}
                      </motion.button>
                    )}
                    
                    {selectedSportData.fees.women && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGenderSelect('women')}
                        className={`
                          relative p-4 rounded-xl transition-all duration-300 text-center
                          ${
                            selectedGender === 'women'
                              ? "bg-gradient-to-br from-pink-600 to-pink-700 shadow-lg shadow-pink-600/20"
                              : "bg-[#1a1410]/50 border border-[#3a2416] hover:border-pink-500/50"
                          }
                        `}
                      >
                        <div className="text-2xl mb-2">👩</div>
                        <div className="font-semibold">Women's Team</div>
                        <div className="text-sm text-gray-400">₹{selectedSportData.fees.women}</div>
                        {selectedGender === 'women' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                          >
                            <span className="text-pink-600 text-xs">✓</span>
                          </motion.div>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}

              <motion.div
                className="mt-8 flex justify-between items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Fill Test Data Button (Development Tool)
                {selectedSport && (
                  <button
                    onClick={fillTestData}
                    className="px-6 py-3 rounded-xl font-semibold text-sm
                             bg-gradient-to-r from-blue-600 to-blue-500
                             hover:from-blue-500 hover:to-blue-400
                             hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105
                             transition-all duration-300
                             flex items-center gap-2"
                  >
                    <span>🧪</span>
                    <span>Fill Test Data</span>
                  </button>
                )}
                 */}
                <button
                  onClick={nextStep}
                  disabled={!selectedSport || (hasGenderOptions && !selectedGender)}
                  className={`
                    px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
                    ${
                      selectedSport && (!hasGenderOptions || selectedGender)
                        ? "bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:shadow-xl hover:shadow-[#ff6b35]/20 hover:scale-105"
                        : "bg-gray-700 cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  Continue →
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Participant Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Selected Sport Header - Large and Prominent */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative text-center mb-10 bg-gradient-to-br from-[#1a1410]/50 to-[#2a1810]/50 backdrop-blur-sm border border-[#ff6b35]/30 rounded-3xl p-8 shadow-2xl"
              >
                {/* Change Sport Button */}
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    toast.info("Select a different sport");
                  }}
                  className="absolute top-4 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:rotate-180 transition-transform duration-300">🔄</span>
                  Change Sport
                </button>

                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-8xl md:text-9xl mb-4"
                >
                  {SPORT_ICONS[selectedSport] || "🏆"}
                </motion.div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#ff6b35] via-[#ff8c42] to-[#ffa600] bg-clip-text text-transparent mb-3">
                  {selectedSport}
                </h2>
                {/* Gender Category Badge */}
                {hasGenderOptions && selectedGender && (
                  <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#ff6b35]/20 to-[#ff8c42]/20 border border-[#ff6b35]/50 rounded-full mb-2">
                    <span className="text-sm font-semibold text-[#ffb77a]">
                      {selectedGender === "men" ? "👨 Men's Category" : "👩 Women's Category"}
                    </span>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-sm md:text-base">Registration Form</p>
                  </div>
                  {/* Registration Fee Display */}
                  <div className="mt-2 px-4 py-2 bg-[#ff6b35]/20 border border-[#ff6b35] rounded-full">
                    <p className="text-sm md:text-base font-bold text-[#ffb77a]">
                      {hasGenderOptions && selectedGender ? 
                        `Fee: ₹${getDisplayFee()}` : 
                        hasGenderOptions ? 
                        `Fee: ${getDisplayFee()}` :
                        `Fee: ₹${getDisplayFee()}`
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-[#ffb77a] mb-2">
                  Your Details
                </h3>
                <p className="text-gray-400">Tell us about yourself</p>
              </div>

              <div className="bg-[#1a1410]/30 backdrop-blur-sm border border-[#3a2416] rounded-2xl p-6 md:p-8 space-y-6">
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

          {/* Step 3: Team Setup (Conditional) */}
          {currentStep === 3 && isTeamSport && (
            <motion.div
              key="step3"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Selected Sport Header - Large and Prominent */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative text-center mb-10 bg-gradient-to-br from-[#1a1410]/50 to-[#2a1810]/50 backdrop-blur-sm border border-[#ff6b35]/30 rounded-3xl p-8 shadow-2xl"
              >
                {/* Change Sport Button */}
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    toast.info("Select a different sport");
                  }}
                  className="absolute top-4 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:rotate-180 transition-transform duration-300">🔄</span>
                  Change Sport
                </button>

                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-8xl md:text-9xl mb-4"
                >
                  {SPORT_ICONS[selectedSport] || "🏆"}
                </motion.div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#ff6b35] via-[#ff8c42] to-[#ffa600] bg-clip-text text-transparent mb-3">
                  {selectedSport}
                </h2>
                {/* Gender Category Badge */}
                {hasGenderOptions && selectedGender && (
                  <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#ff6b35]/20 to-[#ff8c42]/20 border border-[#ff6b35]/50 rounded-full mb-2">
                    <span className="text-sm font-semibold text-[#ffb77a]">
                      {selectedGender === "men" ? "👨 Men's Category" : "👩 Women's Category"}
                    </span>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-sm md:text-base">Team Setup</p>
                  </div>
                  {/* Registration Fee Display */}
                  <div className="mt-2 px-4 py-2 bg-[#ff6b35]/20 border border-[#ff6b35] rounded-full">
                    <p className="text-sm md:text-base font-bold text-[#ffb77a]">
                      {hasGenderOptions && selectedGender ? 
                        `Fee: ₹${getDisplayFee()}` : 
                        hasGenderOptions ? 
                        `Fee: ${getDisplayFee()}` :
                        `Fee: ₹${getDisplayFee()}`
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="text-center mb-8">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#ffb77a] mb-2">
                  Build Your Team
                </h3>
                <p className="text-gray-400">Add your team members</p>
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
                    min={teamConfig?.minPlayers}
                    max={teamConfig?.maxPlayers || teamConfig?.exactPlayers}
                  />
                  <label
                    htmlFor="num_players"
                    className="absolute left-4 -top-2.5 bg-[#0a0604] px-2 text-sm text-[#ff6b35] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-[#ff6b35] peer-focus:text-sm"
                  >
                    Number of Players *
                  </label>
                  {/* **REQUIREMENT BADGE** */}
                  {teamConfig && (
                    <div className="mt-2 text-xs">
                      {teamConfig.exactPlayers ? (
                        <span className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-400 rounded-full font-semibold">
                          ⚠️ EXACTLY {teamConfig.exactPlayers} players required
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-500/20 border border-blue-500 text-blue-400 rounded-full">
                          {teamConfig.minPlayers}-{teamConfig.maxPlayers} players allowed
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Team Members */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-[#ffb77a]">Team Members</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Added: {teamMembers.length} / Required: {teamConfig?.exactPlayers || formData.num_players || "?"}
                      </p>
                    </div>
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

                  {/* Add Player Button - Moved to Bottom */}
                  <button
                    onClick={addTeamMember}
                    className="w-full px-4 py-3 rounded-lg bg-[#ff6b35]/20 border border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  >
                    <span>+</span> Add Player
                  </button>
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
              {/* Selected Sport Header - Large and Prominent */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative text-center mb-10 bg-gradient-to-br from-[#1a1410]/50 to-[#2a1810]/50 backdrop-blur-sm border border-[#ff6b35]/30 rounded-3xl p-8 shadow-2xl"
              >
                {/* Change Sport Button */}
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    toast.info("Select a different sport");
                  }}
                  className="absolute top-4 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:rotate-180 transition-transform duration-300">🔄</span>
                  Change Sport
                </button>

                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-8xl md:text-9xl mb-4"
                >
                  {SPORT_ICONS[selectedSport] || "🏆"}
                </motion.div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#ff6b35] via-[#ff8c42] to-[#ffa600] bg-clip-text text-transparent mb-3">
                  {selectedSport}
                </h2>
                {/* Gender Category Badge */}
                {hasGenderOptions && selectedGender && (
                  <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#ff6b35]/20 to-[#ff8c42]/20 border border-[#ff6b35]/50 rounded-full mb-2">
                    <span className="text-sm font-semibold text-[#ffb77a]">
                      {selectedGender === "men" ? "👨 Men's Category" : "👩 Women's Category"}
                    </span>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-sm md:text-base">Captain Selection</p>
                  </div>
                  {/* Registration Fee Display */}
                  <div className="mt-2 px-4 py-2 bg-[#ff6b35]/20 border border-[#ff6b35] rounded-full">
                    <p className="text-sm md:text-base font-bold text-[#ffb77a]">
                      {hasGenderOptions && selectedGender ? 
                        `Fee: ₹${getDisplayFee()}` : 
                        hasGenderOptions ? 
                        `Fee: ${getDisplayFee()}` :
                        `Fee: ₹${getDisplayFee()}`
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="text-center mb-8">
                <div className="text-4xl mb-3">👑</div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#ffb77a] mb-2">
                  Select Team Captain
                </h3>
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
              {/* Selected Sport Header - Large and Prominent */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative text-center mb-10 bg-gradient-to-br from-[#1a1410]/50 to-[#2a1810]/50 backdrop-blur-sm border border-[#ff6b35]/30 rounded-3xl p-8 shadow-2xl"
              >
                {/* Change Sport Button */}
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    toast.info("Select a different sport");
                  }}
                  className="absolute top-4 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:rotate-180 transition-transform duration-300">🔄</span>
                  Change Sport
                </button>

                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-8xl md:text-9xl mb-4"
                >
                  {SPORT_ICONS[selectedSport] || "🏆"}
                </motion.div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#ff6b35] via-[#ff8c42] to-[#ffa600] bg-clip-text text-transparent mb-3">
                  {selectedSport}
                </h2>
                {/* Gender Category Badge */}
                {hasGenderOptions && selectedGender && (
                  <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#ff6b35]/20 to-[#ff8c42]/20 border border-[#ff6b35]/50 rounded-full mb-2">
                    <span className="text-sm font-semibold text-[#ffb77a]">
                      {selectedGender === "men" ? "👨 Men's Category" : "👩 Women's Category"}
                    </span>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-sm md:text-base">Payment & Documents</p>
                  </div>
                  {/* Registration Fee Display */}
                  <div className="mt-2 px-4 py-2 bg-[#ff6b35]/20 border border-[#ff6b35] rounded-full">
                    <p className="text-sm md:text-base font-bold text-[#ffb77a]">
                      {hasGenderOptions && selectedGender ? 
                        `Fee: ₹${getDisplayFee()}` : 
                        hasGenderOptions ? 
                        `Fee: ${getDisplayFee()}` :
                        `Fee: ₹${getDisplayFee()}`
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="text-center mb-8">
                <div className="text-4xl mb-3">💳</div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#ffb77a] mb-2">
                  Payment & Documents
                </h3>
                <p className="text-gray-400">Complete your registration</p>
              </div>

              <div className="bg-[#1a1410]/30 backdrop-blur-sm border border-[#3a2416] rounded-2xl p-6 md:p-8 space-y-6">
                {/* Payment Details */}
                <div className="p-6 bg-[#0a0604] rounded-xl border border-[#ff6b35]/30">
                  <h3 className="text-lg font-semibold text-[#ffb77a] mb-4">Registration Fees</h3>
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>Total Amount:</span>
                    <span className="text-[#ff6b35]">
                      {hasGenderOptions && selectedGender ? 
                        `₹${getDisplayFee()}` : 
                        hasGenderOptions ? 
                        getDisplayFee() :
                        `₹${getDisplayFee()}`
                      }
                    </span>
                  </div>
                  {selectedSportData?.fees?.note && (
                    <p className="text-sm text-gray-400 mt-2">{selectedSportData.fees.note}</p>
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
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#ffb77a]">Pramila Patil</p>
                    <p className="text-sm text-gray-400">UPI ID: pra.pra.patil1@oksbi</p>
                  </div>
                  
                  {/* Alternative Payment Methods - Hidden for now */}
                  {/* <button
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
                  )} */}
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
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-green-500 font-semibold">✓ File uploaded: {documents.transactionReceipt.name}</p>
                        {documentPreviews.transactionReceipt && documents.transactionReceipt.type.startsWith('image/') && (
                          <img 
                            src={documentPreviews.transactionReceipt} 
                            alt="Transaction Receipt Preview" 
                            className="max-w-xs h-32 object-cover rounded-lg border border-green-500/30"
                          />
                        )}
                      </div>
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
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-green-500 font-semibold">✓ File uploaded: {documents.permissionLetter.name}</p>
                        {documentPreviews.permissionLetter && documents.permissionLetter.type.startsWith('image/') && (
                          <img 
                            src={documentPreviews.permissionLetter} 
                            alt="Permission Letter Preview" 
                            className="max-w-xs h-32 object-cover rounded-lg border border-green-500/30"
                          />
                        )}
                      </div>
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
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-green-500 font-semibold">✓ File uploaded: {documents.captainIdCard.name}</p>
                        {documentPreviews.captainIdCard && documents.captainIdCard.type.startsWith('image/') && (
                          <img 
                            src={documentPreviews.captainIdCard} 
                            alt="ID Card Preview" 
                            className="max-w-xs h-32 object-cover rounded-lg border border-green-500/30"
                          />
                        )}
                      </div>
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

export default UniversalRegistration;
