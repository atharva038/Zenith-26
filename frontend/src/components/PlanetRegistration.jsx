import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {format} from "date-fns";
import api from "../config/api";

// Map sports to planet names
const SPORT_TO_PLANET = {
  Cricket: "cricket",
  Football: "football",
  Basketball: "basketball",
  Volleyball: "volleyball",
  Badminton: "badminton",
  "Table Tennis": "table_tennis",
  Chess: "chess",
  Carrom: "carrom",
  Athletics: "athletics",
  Swimming: "swimming",
  Kabaddi: "kabaddi",
  "Kho-Kho": "kho_kho",
  Hockey: "hockey",
  "Lawn Tennis": "lawn_tennis",
  Squash: "squash",
};

const PlanetRegistration = ({planetName, onClose}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");

  // Get sport name from planet name
  const sportName = Object.keys(SPORT_TO_PLANET).find(
    (key) => SPORT_TO_PLANET[key] === planetName
  );

  useEffect(() => {
    fetchEventForSport();
  }, [sportName]);

  const fetchEventForSport = async () => {
    try {
      setLoading(true);
      // Fetch events and find the one matching this sport
      const response = await api.get(`/events/public?category=${sportName}`);

      if (response.data.data && response.data.data.length > 0) {
        const sportEvent = response.data.data[0];
        setEvent(sportEvent);

        // Initialize form data
        const initialData = {};
        sportEvent.customFields?.forEach((field) => {
          initialData[field.fieldName] =
            field.fieldType === "checkbox" ? [] : "";
        });
        setFormData(initialData);
      } else {
        toast.error(`No registration available for ${sportName} yet`);
      }
    } catch (error) {
      toast.error("Failed to load registration form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, field) => {
    const {type, value, checked} = e.target;

    if (type === "checkbox") {
      if (field.fieldType === "checkbox") {
        const currentValues = formData[field.fieldName] || [];
        if (checked) {
          setFormData({
            ...formData,
            [field.fieldName]: [...currentValues, value],
          });
        } else {
          setFormData({
            ...formData,
            [field.fieldName]: currentValues.filter((v) => v !== value),
          });
        }
      } else {
        setFormData({...formData, [field.fieldName]: checked});
      }
    } else {
      setFormData({...formData, [field.fieldName]: value});
    }
  };

  const validateForm = () => {
    for (const field of event.customFields) {
      if (field.required) {
        const value = formData[field.fieldName];
        if (!value || (Array.isArray(value) && value.length === 0)) {
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
    return true;
  };

  const fillTestData = () => {
    const testData = {};

    event.customFields?.forEach((field) => {
      switch (field.fieldName) {
        case "team_name":
          testData[field.fieldName] = "Phoenix Warriors";
          break;
        case "captain_name":
          testData[field.fieldName] = "Rahul Sharma";
          break;
        case "captain_contact":
          testData[field.fieldName] = "9876543210";
          break;
        case "email":
          testData[field.fieldName] = "rahul.sharma@college.edu";
          break;
        case "institution":
          testData[field.fieldName] = "St. Xavier's College";
          break;
        case "college_address":
          testData[field.fieldName] =
            "5 Mahapalika Marg, Dhobi Talao, Mumbai, Maharashtra 400001";
          break;
        case "city":
          testData[field.fieldName] = "Mumbai";
          break;
        case "alternate_contact":
          testData[field.fieldName] = "9123456789";
          break;
        case "num_players":
          testData[field.fieldName] = "11";
          break;
        case "need_accommodation":
          testData[field.fieldName] = true; // Checkbox - set to true
          break;
        default:
          if (field.fieldType === "checkbox") {
            testData[field.fieldName] = false;
          } else if (field.fieldType === "text") {
            testData[field.fieldName] = "Test Value";
          } else if (field.fieldType === "number") {
            testData[field.fieldName] = "10";
          } else if (field.fieldType === "email") {
            testData[field.fieldName] = "test@example.com";
          } else if (field.fieldType === "tel") {
            testData[field.fieldName] = "9999999999";
          } else if (field.fieldType === "textarea") {
            testData[field.fieldName] = "This is a test entry";
          }
      }
    });

    setFormData(testData);
    toast.success("Test data filled successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const response = await api.post("/registrations", {
        eventId: event._id,
        formData: formData,
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
            rows={3}
            className={commonClasses}
          />
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
            {field.options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="checkbox"
              name={field.fieldName}
              checked={formData[field.fieldName] || false}
              onChange={(e) => handleInputChange(e, field)}
              className="w-5 h-5 bg-white/10 border-2 border-white/30 rounded focus:ring-2 focus:ring-purple-500 text-purple-600"
            />
            <label className="text-white">{field.label}</label>
          </div>
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 rounded-2xl p-8 max-w-4xl w-full mx-4 border border-purple-500/30">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
            <p className="text-purple-200 mt-4">Loading registration form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-500/30">
          <div className="text-center">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Not Available
            </h2>
            <p className="text-purple-200 mb-6">
              Registration for {sportName} is not open yet.
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (registrationComplete) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 rounded-2xl p-8 max-w-2xl w-full border border-purple-500/30 my-8 max-h-[90vh] overflow-y-auto">
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
              You're registered for {event.name}
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
              {event.eventDate && (
                <p className="text-purple-200">
                  <span className="font-semibold">Date:</span>{" "}
                  {format(new Date(event.eventDate), "MMMM dd, yyyy - hh:mm a")}
                </p>
              )}
              {event.venue && (
                <p className="text-purple-200">
                  <span className="font-semibold">Venue:</span> {event.venue}
                </p>
              )}

              {/* Display multiple coordinators if available */}
              {event.coordinators && event.coordinators.length > 0 ? (
                <div>
                  <p className="font-semibold text-purple-200 mb-2">
                    Coordinators:
                  </p>
                  {event.coordinators.map((coordinator, idx) => (
                    <p key={idx} className="text-purple-200 ml-4">
                      • {coordinator.name} - {coordinator.phone}
                      {coordinator.email && (
                        <span className="text-sm"> ({coordinator.email})</span>
                      )}
                    </p>
                  ))}
                </div>
              ) : (
                event.organizerName && (
                  <p className="text-purple-200">
                    <span className="font-semibold">Coordinator:</span>{" "}
                    {event.organizerName} ({event.organizerPhone})
                  </p>
                )
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={onClose}
                className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                Close
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 rounded-2xl p-8 max-w-4xl w-full border border-purple-500/30 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{event.name}</h2>
            <p className="text-purple-200">{event.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Event Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-white/5 rounded-lg p-4">
          <div className="text-center">
            <p className="text-purple-300 text-sm">Event Dates</p>
            <p className="text-white font-semibold">Feb 20-22, 2026</p>
          </div>
          {event.venue && (
            <div className="text-center">
              <p className="text-purple-300 text-sm">Venue</p>
              <p className="text-white font-semibold">{event.venue}</p>
            </div>
          )}
          <div className="text-center">
            <p className="text-purple-300 text-sm">Registration Fee</p>
            <p className="text-yellow-400 font-semibold">
              ₹{event.registrationFee}
            </p>
          </div>
          {event.maxParticipants && (
            <div className="text-center">
              <p className="text-purple-300 text-sm">Spots Left</p>
              <p className="text-green-400 font-semibold">
                {event.spotsLeft !== null
                  ? event.spotsLeft
                  : event.maxParticipants}
              </p>
            </div>
          )}
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Registration Form</h3>
            <button
              type="button"
              onClick={fillTestData}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg text-sm whitespace-nowrap"
            >
              🧪 Fill Test Data
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.customFields?.map((field, index) => (
              <div
                key={index}
                className={
                  field.fieldType === "textarea" ? "md:col-span-2" : ""
                }
              >
                <label className="block text-purple-200 mb-2 text-sm font-medium">
                  {field.label}
                  {field.required && (
                    <span className="text-pink-400 ml-1">*</span>
                  )}
                </label>
                {renderField(field, index)}
              </div>
            ))}
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Register Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanetRegistration;
