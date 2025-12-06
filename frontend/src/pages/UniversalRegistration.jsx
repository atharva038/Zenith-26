import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import api from "../config/api";

const SPORTS_CATEGORIES = [
  "Marathon",
  "Cricket",
  "Football",
  "Basketball",
  "Volleyball",
  "Badminton",
  "Table Tennis",
  "Chess",
  "Carrom",
  "Athletics",
  "Swimming",
  "Kabaddi",
  "Kho-Kho",
  "Hockey",
  "Lawn Tennis",
  "Squash",
];

const FIXED_ENTRY_FEE = 500; // Fixed for all sports

const MARATHON_FORM_FIELDS = [
  {
    label: "Full Name",
    fieldName: "fullName",
    fieldType: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    label: "Email",
    fieldName: "email",
    fieldType: "email",
    placeholder: "your.email@example.com",
    required: true,
  },
  {
    label: "Phone Number",
    fieldName: "phone",
    fieldType: "tel",
    placeholder: "10-digit mobile number",
    required: true,
  },
  {
    label: "Age",
    fieldName: "age",
    fieldType: "number",
    placeholder: "Minimum age: 16",
    required: true,
    min: 16,
    max: 100,
  },
  {
    label: "Gender",
    fieldName: "gender",
    fieldType: "select",
    placeholder: "",
    required: true,
    options: ["Male", "Female", "Other"],
  },
  {
    label: "College/Organization",
    fieldName: "college",
    fieldType: "text",
    placeholder: "Your institution name",
    required: true,
  },
  {
    label: "Marathon Category",
    fieldName: "category",
    fieldType: "select",
    placeholder: "",
    required: true,
    options: ["5K", "10K", "Half Marathon"],
  },
  {
    label: "T-Shirt Size",
    fieldName: "tshirtSize",
    fieldType: "select",
    placeholder: "",
    required: true,
    options: ["S", "M", "L", "XL", "XXL"],
  },
  {
    label: "Emergency Contact Name",
    fieldName: "emergency_name",
    fieldType: "text",
    placeholder: "Emergency contact person",
    required: true,
  },
  {
    label: "Emergency Contact Phone",
    fieldName: "emergency_phone",
    fieldType: "tel",
    placeholder: "10-digit mobile number",
    required: true,
  },
  {
    label: "Medical Conditions (Optional)",
    fieldName: "medicalConditions",
    fieldType: "textarea",
    placeholder: "Any medical conditions, allergies, or health concerns",
    required: false,
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState({
    permissionLetter: null,
    transactionReceipt: null,
    captainIdCard: null,
  });
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    if (selectedSport) {
      if (selectedSport === "Marathon") {
        // Initialize Marathon form fields
        const initialData = {};
        MARATHON_FORM_FIELDS.forEach((field) => {
          initialData[field.fieldName] =
            field.fieldType === "checkbox" ? false : "";
        });
        setFormData(initialData);
        setSelectedEvent(null); // Marathon doesn't need an event
      } else {
        // Initialize regular sports form fields
        const event = events.find((e) => e.category === selectedSport);
        setSelectedEvent(event);
        const initialData = {};
        DEFAULT_FORM_FIELDS.forEach((field) => {
          initialData[field.fieldName] =
            field.fieldType === "checkbox" ? false : "";
        });
        setFormData(initialData);
      }
    }
  }, [selectedSport, events]);

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events/public");
      setEvents(response.data.data);

      // Initialize form data
      const initialData = {};
      DEFAULT_FORM_FIELDS.forEach((field) => {
        initialData[field.fieldName] =
          field.fieldType === "checkbox" ? false : "";
      });
      setFormData(initialData);
    } catch (error) {
      toast.error("Failed to load events");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, field) => {
    const {type, value, checked} = e.target;

    if (type === "checkbox") {
      setFormData({...formData, [field.fieldName]: checked});
    } else {
      setFormData({...formData, [field.fieldName]: value});
    }
  };

  const handleFileChange = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = null;
        return;
      }
      // Validate file type (images and PDFs only)
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
      setDocuments({...documents, [documentType]: file});
      toast.success(`${documentType} uploaded successfully!`);
    }
  };

  const validateForm = () => {
    if (!selectedSport) {
      toast.error("Please select a sport");
      return false;
    }

    // Skip event check for Marathon
    if (selectedSport !== "Marathon" && !selectedEvent) {
      toast.error("Selected sport event is not available");
      return false;
    }

    // Use appropriate form fields based on sport type
    const fieldsToValidate = selectedSport === "Marathon" ? MARATHON_FORM_FIELDS : DEFAULT_FORM_FIELDS;

    for (const field of fieldsToValidate) {
      if (field.required) {
        const value = formData[field.fieldName];
        if (!value || (typeof value === "string" && !value.trim())) {
          toast.error(`${field.label} is required`);
          return false;
        }
      }

      // Email validation
      if (field.fieldType === "email" && formData[field.fieldName]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.fieldName])) {
          toast.error("Please enter a valid email address");
          return false;
        }
      }

      // Phone validation
      if (field.fieldType === "tel" && formData[field.fieldName]) {
        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = formData[field.fieldName].replace(/\D/g, "");
        if (!phoneRegex.test(cleanPhone)) {
          toast.error("Please enter a valid 10-digit phone number");
          return false;
        }
      }
    }

    // Document validation - Skip for Marathon
    if (selectedSport !== "Marathon") {
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
    setSelectedSport(SPORTS_CATEGORIES[0]); // Select first sport
    toast.success("Test data filled successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      // Handle Marathon registration separately
      if (selectedSport === "Marathon") {
        const marathonData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          age: parseInt(formData.age),
          gender: formData.gender,
          college: formData.college,
          category: formData.category,
          tshirtSize: formData.tshirtSize,
          emergencyContact: {
            name: formData.emergency_name,
            phone: formData.emergency_phone,
          },
          medicalConditions: formData.medicalConditions || "None",
        };

        const response = await api.post("/marathon/register", marathonData);
        
        if (response.data.success) {
          setRegistrationNumber(response.data.data.registrationNumber);
          setRegistrationComplete(true);
          toast.success("Marathon registration successful!");
        }
      } else {
        // Regular sports registration
        // Create FormData for multipart/form-data upload
        const submitData = new FormData();
        submitData.append("eventId", selectedEvent._id);
        submitData.append("formData", JSON.stringify(formData));

        // Append document files
        submitData.append("permissionLetter", documents.permissionLetter);
        submitData.append("transactionReceipt", documents.transactionReceipt);
        submitData.append("captainIdCard", documents.captainIdCard);

        const response = await api.post("/registrations", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setRegistrationNumber(response.data.data.registrationNumber);
        setRegistrationComplete(true);
        toast.success("Registration successful!");
      }
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
      "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500";

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
            className="flex items-center text-purple-200 cursor-pointer"
          >
            <input
              type="checkbox"
              name={field.fieldName}
              checked={formData[field.fieldName] || false}
              onChange={(e) => handleInputChange(e, field)}
              required={field.required}
              className="mr-2 w-4 h-4"
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
            {field.options && field.options.map((option, i) => (
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

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
              You're registered for {selectedEvent?.name}
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
                <span className="font-semibold">Sport:</span>{" "}
                {selectedEvent?.category}
              </p>
              <p className="text-purple-200">
                <span className="font-semibold">Event Dates:</span> February
                20-22, 2026
              </p>
              <p className="text-purple-200">
                <span className="font-semibold">Venue:</span>{" "}
                {selectedEvent?.venue || "SGGSIE&T College"}
              </p>
              <p className="text-purple-200">
                <span className="font-semibold">Registration Fee:</span> ₹
                {FIXED_ENTRY_FEE}
              </p>

              {selectedEvent?.coordinators &&
                selectedEvent.coordinators.length > 0 && (
                  <div>
                    <p className="font-semibold text-purple-200 mb-2">
                      Coordinators:
                    </p>
                    {selectedEvent.coordinators.map((coordinator, idx) => (
                      <p key={idx} className="text-purple-200 ml-4">
                        • {coordinator.name} - {coordinator.phone}
                        {coordinator.email && (
                          <span className="text-sm">
                            {" "}
                            ({coordinator.email})
                          </span>
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
                  setSelectedEvent(null);
                  const initialData = {};
                  DEFAULT_FORM_FIELDS.forEach((field) => {
                    initialData[field.fieldName] =
                      field.fieldType === "checkbox" ? false : "";
                  });
                  setFormData(initialData);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Zenith 2026 Registration
          </h1>
          <p className="text-purple-200 text-lg">
            Register for your favorite sport - One form for all events!
          </p>
          <div className="mt-4 inline-block bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg px-6 py-3 border border-purple-400/50">
            <p className="text-white font-semibold">
              📅 Event Dates: February 20-22, 2026
            </p>
            <p className="text-purple-200">📍 Venue: SGGSIE&T College</p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Registration Form</h2>
            <button
              type="button"
              onClick={fillTestData}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg text-sm"
            >
              🧪 Fill Test Data
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sport Selection */}
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-6 border border-yellow-400/30">
              <label className="block text-white font-semibold mb-3 text-lg">
                Select Sport *
              </label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Choose your sport --</option>
                {SPORTS_CATEGORIES.map((sport) => {
                  const event = events.find((e) => e.category === sport);
                  const isAvailable = sport === "Marathon" || event; // Marathon is always available
                  return (
                    <option key={sport} value={sport} disabled={!isAvailable}>
                      {sport} {!isAvailable && "(Not available)"}
                    </option>
                  );
                })}
              </select>

              {selectedSport === "Marathon" && (
                <div className="mt-4 text-purple-200 text-sm">
                  <p>✅ Event: Zenith Marathon 2026</p>
                  <p>🏃 Categories: 5K, 10K, Half Marathon</p>
                  <p>📅 Date: February 20, 2026</p>
                </div>
              )}

              {selectedEvent && selectedSport !== "Marathon" && (
                <div className="mt-4 text-purple-200 text-sm">
                  <p>✅ Event: {selectedEvent.name}</p>
                  <p>💰 Entry Fee: ₹{FIXED_ENTRY_FEE} (Fixed for all sports)</p>
                </div>
              )}
            </div>

            {/* Registration Form Fields */}
            {selectedSport && (
              <>
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    {selectedSport === "Marathon" ? "Participant Details" : "Team Details"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(selectedSport === "Marathon" ? MARATHON_FORM_FIELDS : DEFAULT_FORM_FIELDS).map((field, index) => (
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

                {/* Event Info - Only for non-Marathon sports */}
                {selectedSport !== "Marathon" && (
                  <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg p-6 border border-purple-400/50">
                    <h3 className="text-white font-semibold mb-4 text-xl">
                      💰 Payment Information
                    </h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-yellow-300 mb-1">
                        Entry Fee: ₹{FIXED_ENTRY_FEE}
                      </p>
                      <p className="text-sm text-yellow-100">
                        Fixed for all sports at Zenith 2026
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4 space-y-3">
                      <p className="text-white font-semibold text-center mb-3">
                        📱 Scan QR Code to Pay via UPI
                      </p>

                      {/* QR Code Placeholder - Replace with actual QR code generator */}
                      <div className="bg-white rounded-lg p-4 mx-auto w-fit">
                        <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-gray-600 text-sm font-mono mb-2">
                              QR Code
                            </p>
                            <p className="text-xs text-gray-500">
                              Scan to pay ₹{FIXED_ENTRY_FEE}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center space-y-2">
                        <p className="text-purple-200 font-medium">
                          UPI ID:{" "}
                          <span className="text-white font-mono">
                            taherroshan4-1@okicici
                          </span>
                        </p>
                        <p className="text-purple-300 text-sm">
                          Or pay using any UPI app (GPay, PhonePe, Paytm, etc.)
                        </p>
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
                )}

                {/* Document Upload Section - Only for non-Marathon sports */}
                {selectedSport !== "Marathon" && (
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    � Required Documents
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
                        Screenshot or receipt of the ₹{FIXED_ENTRY_FEE} payment
                        made via UPI
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
                )}

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
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
            {SPORTS_CATEGORIES.map((sport) => {
              const event = events.find((e) => e.category === sport);
              const isAvailable = sport === "Marathon" || event; // Marathon is always available
              return (
                <div
                  key={sport}
                  className={`text-center p-3 rounded-lg ${
                    isAvailable
                      ? "bg-green-500/20 text-green-300 border border-green-400/30"
                      : "bg-red-500/20 text-red-300 border border-red-400/30"
                  }`}
                >
                  <p className="text-sm font-medium">{sport}</p>
                  <p className="text-xs mt-1">
                    {isAvailable ? "✅ Open" : "❌ Closed"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalRegistration;
