import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import api from "../config/api";

// Predefined sports with their details - NO BACKEND DEPENDENCY
const SPORTS_DATA = {
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
    fees: { men: 500, women: 400, note: "per player" },
    venue: "Indoor Badminton Courts",
    rules: [
      "Singles and Doubles events",
      "Best of 3 games to 21 points",
      "BWF rules apply",
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
      note: "Individual: ₹200 per athlete | Team Events: ₹700 per team",
    },
    name: "Athletics Meet",
    venue: "SGGSIE&T Athletics Track",
    rules: [
      "100m, 200m, 400m, 800m, 1500m events",
      "Long Jump, High Jump, Shot Put",
      "Individual events",
    ],
    coordinators: [
      { name: "Dipanshu Sahatpute", phone: "7620666188" },
      { name: "Shrujan Pal", phone: "8788766970" },
    ],
  },
  Swfees: { amount: 300, note: "per athlete" },
  imming: {
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
  "Kho-Kho": {
    name: "Kho-Kho Championship",
    venue: "Outdoor Sports Ground",
    fees: { amount: 1500, note: "per team" },
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
      "Maximum 14 players per team (7 playing + 7 substitutes)",
      "Two halves of 30 minutes each",
      "IHF rules apply",
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
    rules: ["5-a-side football", "Smaller playing area", "Modified FIFA rules"],
    coordinators: [
      { name: "Onkar Sahane", phone: "8767192671" },
      { name: "Vipakshi Mate", phone: "7972776597" },
    ],
  },
  "Tug of War": {
    name: "Tug of War Championship",
    venue: "Outdoor Sports Ground",
    fees: { amount: 1000, note: "per team" },
    rules: ["8 players per team", "Best of 3 pulls", "TWIF rules apply"],
    coordinators: [{ name: "Swayam Baheti", phone: "7276218795" }],
  },
  "Power Lifting": {
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
  "Basketball (3x3)": {
    name: "Basketball 3x3 Tournament",
    venue: "Outdoor Basketball Court",
    fees: { amount: 500, note: "per team" },
    rules: [
      "4 players per team (3 playing + 1 substitute)",
      "10 minutes or first to 21 points",
      "FIBA 3x3 rules apply",
    ],
    coordinators: [
      { name: "Uday Naukarkar", phone: "9322684201" },
      { name: "Krushna Jadhav", phone: "8208422959" },
    ],
  },
};

const SPORTS_CATEGORIES = Object.keys(SPORTS_DATA);

// Payment QR Code - Sagar Ubale (sagarubale2004@oksbi)
const PAYMENT_QR_URL =
  "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:best/v1767592627/zenith-26/img/payment/payment-qr-sagar-ubale";

// Backup QR Codes
const BACKUP_QR_URLS = [
  {
    name: "Balaji Anil Kalyankar (PhonePe)",
    upiId: "balajianil.kalyankar@ybl",
    url: "/img/balajiQR.png", // Local image from public/img folder
  },
  {
    name: "Atharva Joshi (Bank of Baroda)",
    upiId: "atharvsjoshi2005-1@okicici",
    url: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1768722815/zenith-26/img/payment/backup-qr-atharva-bob.png",
  },
];

const DEFAULT_FORM_FIELDS = [
  {
    label: "Team Name",
    fieldName: "team_name",
    fieldType: "text",
    placeholder: "Enter your team name",
    required: true,
  },
  {
    label: "Captain Name",
    fieldName: "captain_name",
    fieldType: "text",
    placeholder: "Full name of team captain",
    required: true,
  },
  {
    label: "Captain Contact No.",
    fieldName: "captain_contact",
    fieldType: "tel",
    placeholder: "10-digit mobile number",
    required: true,
  },
  {
    label: "Email ID",
    fieldName: "email",
    fieldType: "email",
    placeholder: "captain@example.com",
    required: true,
  },
  {
    label: "Institution Name",
    fieldName: "institution",
    fieldType: "text",
    placeholder: "College/University name",
    required: true,
  },
  {
    label: "College Address",
    fieldName: "college_address",
    fieldType: "textarea",
    placeholder: "Full address of your institution",
    required: true,
  },
  {
    label: "City",
    fieldName: "city",
    fieldType: "text",
    placeholder: "City",
    required: true,
  },
  {
    label: "Alternate Contact (Optional)",
    fieldName: "alternate_contact",
    fieldType: "tel",
    placeholder: "Alternative contact number",
    required: false,
  },
  {
    label: "Number of Players",
    fieldName: "num_players",
    fieldType: "number",
    placeholder: "Total team members",
    required: true,
  },
  {
    label: "Need Accommodation",
    fieldName: "need_accommodation",
    fieldType: "checkbox",
    placeholder: "",
    required: false,
  },
];

const UniversalRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [selectedSport, setSelectedSport] = useState("");
  const [formData, setFormData] = useState({});
  const [showBackupQR, setShowBackupQR] = useState(false);
  const [documents, setDocuments] = useState({
    permissionLetter: null,
    transactionReceipt: null,
    captainIdCard: null,
  });
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");

  // Check if sport was pre-selected from GameVerse
  useEffect(() => {
    if (location.state?.selectedSport) {
      const sportName = location.state.selectedSport.toUpperCase();
      // Map from GameVerse sport names to SPORTS_DATA keys
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
        SWIMMING: "Swimming",
        KABADDI: "Kabaddi",
        "KHO-KHO": "Kho-Kho",
        HOCKEY: "Hockey",
        "LAWN TENNIS": "Lawn Tennis",
        SQUASH: "Squash",
      };

      const mappedSport = sportMapping[sportName];
      if (mappedSport && SPORTS_DATA[mappedSport]) {
        setSelectedSport(mappedSport);
      }
    }
  }, [location.state]);

  const selectedSportData = selectedSport ? SPORTS_DATA[selectedSport] : null;

  const handleInputChange = (e, field) => {
    const { type, value, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [field.fieldName]: checked });
    } else {
      setFormData({ ...formData, [field.fieldName]: value });
    }
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
      toast.success(`${documentType} uploaded successfully!`);
    }
  };

  const validateForm = () => {
    if (!selectedSport) {
      toast.error("Please select a sport");
      return false;
    }

    for (const field of DEFAULT_FORM_FIELDS) {
      if (field.required) {
        const value = formData[field.fieldName];
        if (!value || (typeof value === "string" && !value.trim())) {
          toast.error(`${field.label} is required`);
          return false;
        }
      }

      if (field.fieldType === "email" && formData[field.fieldName]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.fieldName])) {
          toast.error("Please enter a valid email address");
          return false;
        }
      }

      if (field.fieldType === "tel" && formData[field.fieldName]) {
        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = formData[field.fieldName].replace(/\D/g, "");
        if (!phoneRegex.test(cleanPhone)) {
          toast.error("Please enter a valid 10-digit phone number");
          return false;
        }
      }
    }

    if (!documents.permissionLetter) {
      toast.error("Please upload College Permission Letter");
      return false;
    }
    if (!documents.transactionReceipt) {
      toast.error("Please upload Transaction Receipt");
      return false;
    }
    if (!documents.captainIdCard) {
      toast.error("Please upload Captain's ID Card");
      return false;
    }

    return true;
  };

  const fillTestData = () => {
    const testData = {
      team_name: "Phoenix Warriors",
      captain_name: "Rahul Sharma",
      captain_contact: "9876543210",
      email: "rahul.sharma@college.edu",
      institution: "St. Xavier's College",
      college_address:
        "5 Mahapalika Marg, Dhobi Talao, Mumbai, Maharashtra 400001",
      city: "Mumbai",
      alternate_contact: "9123456789",
      num_players: "11",
      need_accommodation: true,
    };

    setFormData(testData);
    setSelectedSport(SPORTS_CATEGORIES[0]);
    toast.success("Test data filled successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const submitData = new FormData();

      // Add sport name and details
      submitData.append("sportName", selectedSport);
      submitData.append("sportDetails", JSON.stringify(selectedSportData));
      submitData.append("formData", JSON.stringify(formData));

      // Append document files
      submitData.append("permissionLetter", documents.permissionLetter);
      submitData.append("transactionReceipt", documents.transactionReceipt);
      submitData.append("captainIdCard", documents.captainIdCard);

      const response = await api.post("/registrations/sports", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setRegistrationNumber(response.data.data.registrationNumber);
      setRegistrationComplete(true);
      toast.success("Registration successful!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field, index) => {
    const commonClasses =
      "w-full bg-black/50 border border-[#3a2416] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#ffb77a] focus:ring-1 focus:ring-[#ffb77a] transition-all text-sm";

    switch (field.fieldType) {
      case "textarea":
        return (
          <textarea
            key={index}
            name={field.fieldName}
            value={formData[field.fieldName] || ""}
            onChange={(e) => handleInputChange(e, field)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={commonClasses}
          />
        );

      case "checkbox":
        return (
          <label
            key={index}
            className="flex items-center text-gray-300 cursor-pointer hover:text-white transition-colors"
          >
            <input
              type="checkbox"
              name={field.fieldName}
              checked={formData[field.fieldName] || false}
              onChange={(e) => handleInputChange(e, field)}
              required={field.required}
              className="mr-2 w-4 h-4 rounded bg-black/50 border-[#3a2416] text-[#ffb77a] focus:ring-[#ffb77a] focus:ring-offset-0"
            />
            {field.label}
          </label>
        );

      case "select":
        return (
          <select
            key={index}
            name={field.fieldName}
            value={formData[field.fieldName] || ""}
            onChange={(e) => handleInputChange(e, field)}
            required={field.required}
            className={commonClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options &&
              field.options.map((option, i) => (
                <option key={i} value={option} className="bg-purple-900">
                  {option}
                </option>
              ))}
          </select>
        );

      default:
        return (
          <input
            key={index}
            type={field.fieldType}
            name={field.fieldName}
            value={formData[field.fieldName] || ""}
            onChange={(e) => handleInputChange(e, field)}
            placeholder={field.placeholder}
            required={field.required}
            className={commonClasses}
          />
        );
    }
  };

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Registration Successful!
            </h2>
            <p className="text-purple-200 text-lg mb-6">
              You're registered for {selectedSportData?.name}
            </p>

            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <p className="text-purple-200 mb-2">Your Registration Number:</p>
              <p className="text-3xl font-bold text-purple-300 font-mono">
                {registrationNumber}
              </p>
              <p className="text-sm text-purple-300 mt-2">
                Please save this for your records
              </p>
            </div>

            <div className="space-y-3 text-left bg-white/5 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-3">Event Details:</h3>
              <p className="text-purple-200">
                <span className="font-semibold">Sport:</span> {selectedSport}
              </p>
              <p className="text-purple-200">
                <span className="font-semibold">Event Dates:</span> February
                20-22, 2026
              </p>
              <p className="text-purple-200">
                <span className="font-semibold">Venue:</span>{" "}
                {selectedSportData?.venue}
              </p>
              <p className="text-purple-200">
                <span className="font-semibold">Registration Fee:</span>{" "}
                {selectedSportData?.fees?.men && selectedSportData?.fees?.women
                  ? `Men: ₹${selectedSportData.fees.men} | Women: ₹${selectedSportData.fees.women}`
                  : selectedSportData?.fees?.individual &&
                      selectedSportData?.fees?.team
                    ? `Individual: ₹${selectedSportData.fees.individual} | Team: ₹${selectedSportData.fees.team}`
                    : `₹${selectedSportData?.fees?.amount || 500}`}
              </p>

              {selectedSportData?.coordinators && (
                <div>
                  <p className="font-semibold text-purple-200 mb-2 mt-4">
                    Coordinators:
                  </p>
                  {selectedSportData.coordinators.map((coordinator, idx) => (
                    <p key={idx} className="text-purple-200 ml-4">
                      • {coordinator.name} - {coordinator.phone}
                      {coordinator.email && (
                        <span className="text-sm"> ({coordinator.email})</span>
                      )}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setRegistrationComplete(false);
                  setSelectedSport("");
                  setFormData({});
                  setDocuments({
                    permissionLetter: null,
                    transactionReceipt: null,
                    captainIdCard: null,
                  });
                }}
                className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                Register Another Sport
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Print Confirmation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 px-9 py-5 flex justify-between items-center z-50 bg-black/10 backdrop-blur-md border-b border-[#3a2416]/30">
        <Link
          to="/"
          className="text-[#ffb77a] font-bold text-xl tracking-wide hover:text-[#ffd4a8] transition-colors"
          style={{ textShadow: "0 2px 12px rgba(255,140,40,0.18)" }}
        >
          Zenith 2026
        </Link>

        <div className="flex gap-6 items-center">
          <Link
            to="/home"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors text-sm"
          >
            ← Back to Home
          </Link>
          <Link
            to="/gameverse"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors text-sm"
          >
            🌌 GameVerse
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#ffb77a] mb-3"
            style={{ textShadow: "0 2px 20px rgba(255,140,40,0.3)" }}
          >
            Sports Event Registration
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Register your team for Zenith 2026 sports events
          </p>

          {/* Event Info Banner */}
          <div className="inline-flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm bg-[#1a1410]/50 backdrop-blur-sm border border-[#3a2416] rounded-lg px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-[#ffb77a]">📅</span>
              <span className="text-gray-300">Feb 20-22, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#ffb77a]">📍</span>
              <span className="text-gray-300">SGGSIE&T College</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#ffb77a]">💰</span>
              <span className="text-gray-300">Sport-specific entry fees</span>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-[#1a1410]/30 backdrop-blur-sm border border-[#3a2416] rounded-xl p-6 md:p-8">
          {/* Form Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#3a2416]">
            <h2 className="text-xl font-semibold text-[#ffb77a]">
              Registration Form
            </h2>
            <button
              type="button"
              onClick={fillTestData}
              className="text-xs px-3 py-1.5 bg-[#2a2010] hover:bg-[#3a2816] text-[#ffb77a] border border-[#3a2416] rounded transition-colors"
            >
              Fill Test Data
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sport Selection */}
            <div className="bg-[#2a2010]/50 border border-[#3a2416] rounded-lg p-6">
              <label className="block text-[#ffb77a] font-semibold mb-3">
                Select Sport <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                required
                className="w-full bg-black/50 border border-[#3a2416] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffb77a] focus:ring-1 focus:ring-[#ffb77a] transition-all"
              >
                <option value="">-- Choose your sport --</option>
                {SPORTS_CATEGORIES.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>

              {/* Show sport details when selected */}
              {selectedSportData && (
                <div className="mt-6 space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-[#3a2416]/50">
                    <h3 className="text-[#ffb77a] font-semibold mb-2">
                      📋 Event Details
                    </h3>
                    <p className="text-white text-lg mb-2">
                      {selectedSportData.name}
                    </p>
                    <p className="text-gray-300 text-sm">
                      <span className="text-[#ffb77a]">📍</span> Venue:{" "}
                      {selectedSportData.venue}
                    </p>
                  </div>

                  {selectedSportData.rules && (
                    <div className="bg-black/30 rounded-lg p-4 border border-[#3a2416]/50">
                      <h3 className="text-[#ffb77a] font-semibold mb-2">
                        📜 Rules & Regulations
                      </h3>
                      <ul className="space-y-2">
                        {selectedSportData.rules.map((rule, idx) => (
                          <li key={idx} className="text-gray-300 text-sm">
                            • {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedSportData.coordinators && (
                    <div className="bg-black/30 rounded-lg p-4 border border-[#3a2416]/50">
                      <h3 className="text-[#ffb77a] font-semibold mb-2">
                        👥 Event Coordinators
                      </h3>
                      <div className="space-y-2">
                        {selectedSportData.coordinators.map(
                          (coordinator, idx) => (
                            <div key={idx} className="text-gray-300 text-sm">
                              <p className="font-medium text-white">
                                {coordinator.name}
                              </p>
                              <p>📞 {coordinator.phone}</p>
                              {coordinator.email && (
                                <p>✉️ {coordinator.email}</p>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Team Details Form */}
            {selectedSport && (
              <>
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Team Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DEFAULT_FORM_FIELDS.map((field, index) => (
                      <div
                        key={index}
                        className={
                          field.fieldType === "textarea" ||
                          field.fieldType === "checkbox"
                            ? "md:col-span-2"
                            : ""
                        }
                      >
                        {field.fieldType !== "checkbox" && (
                          <label className="block text-purple-200 mb-2 text-sm font-medium">
                            {field.label}
                            {field.required && (
                              <span className="text-pink-400 ml-1">*</span>
                            )}
                          </label>
                        )}
                        {renderField(field, index)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg p-6 border border-purple-400/50">
                  <h3 className="text-white font-semibold mb-4 text-xl">
                    💰 Payment Information
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
                      {selectedSportData?.fees?.men &&
                      selectedSportData?.fees?.women ? (
                        <>
                          <p className="text-xl font-bold text-yellow-300 mb-1">
                            Entry Fee:
                          </p>
                          <p className="text-lg text-yellow-200">
                            Men: ₹{selectedSportData.fees.men} | Women: ₹
                            {selectedSportData.fees.women}
                          </p>
                          <p className="text-sm text-yellow-100 mt-1">
                            {selectedSportData.fees.note}
                          </p>
                        </>
                      ) : selectedSportData?.fees?.individual &&
                        selectedSportData?.fees?.team ? (
                        <>
                          <p className="text-xl font-bold text-yellow-300 mb-1">
                            Entry Fee:
                          </p>
                          <p className="text-lg text-yellow-200">
                            Individual: ₹{selectedSportData.fees.individual} |
                            Team: ₹{selectedSportData.fees.team}
                          </p>
                          <p className="text-sm text-yellow-100 mt-1">
                            {selectedSportData.fees.note}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-yellow-300 mb-1">
                            Entry Fee: ₹{selectedSportData?.fees?.amount || 500}
                          </p>
                          <p className="text-sm text-yellow-100">
                            {selectedSportData?.fees?.note || "per team"}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="bg-white/10 rounded-lg p-4 space-y-3">
                      <p className="text-white font-semibold text-center mb-3">
                        📱 Scan QR Code to Pay via UPI
                      </p>

                      {/* Primary QR Code */}
                      <div className="bg-white rounded-lg p-4 mx-auto w-fit">
                        <img
                          src={PAYMENT_QR_URL}
                          alt="Payment QR Code"
                          className="w-64 h-auto object-contain"
                        />
                      </div>

                      <div className="text-center space-y-2">
                        <p className="text-purple-200 font-medium">
                          UPI ID:{" "}
                          <span className="text-white font-mono">
                            sagarubale2004@oksbi
                          </span>
                        </p>
                        <p className="text-purple-300 text-sm">
                          Or pay using any UPI app (GPay, PhonePe, Paytm, etc.)
                        </p>
                      </div>

                      {/* Backup QR Codes Dropdown */}
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setShowBackupQR(!showBackupQR)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-lg text-purple-300 font-medium transition-all"
                        >
                          <span>🔄</span>
                          <span>
                            {showBackupQR
                              ? "Hide Backup Payment Options"
                              : "Show Backup Payment Options"}
                          </span>
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              showBackupQR ? "rotate-180" : ""
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
                          {showBackupQR && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 space-y-6 pt-4 border-t border-purple-500/20">
                                {BACKUP_QR_URLS.map((qr, index) => (
                                  <div
                                    key={index}
                                    className="bg-purple-500/5 p-6 rounded-lg border border-purple-500/20"
                                  >
                                    <p className="text-sm text-purple-300 mb-3 font-medium text-center">
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

                      <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 mt-4">
                        <p className="text-red-200 text-sm">
                          ⚠️ <strong>Important:</strong> Upload your payment
                          receipt in the "Documents" section below
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Upload Section */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    📎 Required Documents
                    <span className="text-pink-400 text-lg">*</span>
                  </h3>
                  <p className="text-purple-200 text-sm mb-6">
                    Please upload the following documents. All fields are
                    mandatory. Accepted formats: JPG, PNG, PDF (Max 5MB each)
                  </p>

                  <div className="space-y-4">
                    {/* Permission Letter */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <label className="block text-purple-200 font-medium mb-2">
                        1. College Permission Letter
                        <span className="text-pink-400 ml-1">*</span>
                      </label>
                      <p className="text-purple-300 text-xs mb-3">
                        Official letter from Dean or Student Affairs with
                        signatures
                      </p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) =>
                          handleFileChange(e, "permissionLetter")
                        }
                        required
                        className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                      />
                      {documents.permissionLetter && (
                        <p className="text-green-400 text-sm mt-2">
                          ✅ {documents.permissionLetter.name}
                        </p>
                      )}
                    </div>

                    {/* Transaction Receipt */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <label className="block text-purple-200 font-medium mb-2">
                        2. Transaction Receipt / Payment Screenshot
                        <span className="text-pink-400 ml-1">*</span>
                      </label>
                      <p className="text-purple-300 text-xs mb-3">
                        Screenshot or receipt of the payment made via UPI (see
                        entry fee above)
                      </p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) =>
                          handleFileChange(e, "transactionReceipt")
                        }
                        required
                        className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                      />
                      {documents.transactionReceipt && (
                        <p className="text-green-400 text-sm mt-2">
                          ✅ {documents.transactionReceipt.name}
                        </p>
                      )}
                    </div>

                    {/* Captain ID Card */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <label className="block text-purple-200 font-medium mb-2">
                        3. Team Captain's College ID Card
                        <span className="text-pink-400 ml-1">*</span>
                      </label>
                      <p className="text-purple-300 text-xs mb-3">
                        Clear photo/scan of the team captain's valid college ID
                        card
                      </p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileChange(e, "captainIdCard")}
                        required
                        className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                      />
                      {documents.captainIdCard && (
                        <p className="text-green-400 text-sm mt-2">
                          ✅ {documents.captainIdCard.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="flex-1 bg-white/10 text-white py-4 rounded-lg hover:bg-white/20 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Complete Registration"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Available Sports Info */}
        <div className="mt-8 bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-3">🏆 Available Sports</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SPORTS_CATEGORIES.map((sport) => (
              <div
                key={sport}
                className="text-center p-3 rounded-lg bg-green-500/20 text-green-300 border border-green-400/30"
              >
                <p className="text-sm font-medium">{sport}</p>
                <p className="text-xs mt-1">✅ Open</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalRegistration;
