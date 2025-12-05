import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {format} from "date-fns";
import api from "../config/api";

const EventRegistrationPage = () => {
  const {eventId} = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/public/${eventId}`);
      setEvent(response.data.data);

      // Initialize form data with empty values
      const initialData = {};
      response.data.data.customFields?.forEach((field) => {
        initialData[field.fieldName] = field.fieldType === "checkbox" ? [] : "";
      });
      setFormData(initialData);
    } catch (error) {
      toast.error("Failed to load event details");
      console.error(error);
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, field) => {
    const {type, value, checked} = e.target;

    if (type === "checkbox") {
      if (field.fieldType === "checkbox") {
        // Multiple checkboxes
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
        // Single checkbox
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
            rows={4}
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

      case "radio":
        return (
          <div key={index} className="space-y-2">
            {field.options?.map((option, i) => (
              <label
                key={i}
                className="flex items-center text-purple-200 cursor-pointer"
              >
                <input
                  type="radio"
                  name={field.fieldName}
                  value={option}
                  checked={formData[field.fieldName] === option}
                  onChange={(e) => handleInputChange(e, field)}
                  required={field.required}
                  className="mr-2 w-4 h-4"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        if (field.options && field.options.length > 0) {
          // Multiple checkboxes
          return (
            <div key={index} className="space-y-2">
              {field.options.map((option, i) => (
                <label
                  key={i}
                  className="flex items-center text-purple-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={(formData[field.fieldName] || []).includes(option)}
                    onChange={(e) => handleInputChange(e, field)}
                    className="mr-2 w-4 h-4"
                  />
                  {option}
                </label>
              ))}
            </div>
          );
        } else {
          // Single checkbox
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
              {field.placeholder || field.label}
            </label>
          );
        }

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

  if (!event) {
    return null;
  }

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 max-w-2xl w-full text-center">
          <div className="mb-6">
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
            <h1 className="text-4xl font-bold text-white mb-2">
              Registration Successful!
            </h1>
            <p className="text-purple-200 text-lg">
              You're all set for {event.name}
            </p>
          </div>

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
            <p className="text-purple-200">
              <span className="font-semibold">
                A confirmation email has been sent to your registered email
                address.
              </span>
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/events")}
              className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Browse More Events
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Event Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/events")}
            className="text-purple-300 hover:text-white transition-colors mb-4 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Events
          </button>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-4">{event.name}</h1>
            <p className="text-purple-200 mb-6">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {event.eventDate && (
                <div className="flex items-center text-purple-200">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">
                    {format(new Date(event.eventDate), "MMM dd, yyyy")}
                  </span>
                </div>
              )}

              {event.venue && (
                <div className="flex items-center text-purple-200">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span className="text-sm">{event.venue}</span>
                </div>
              )}

              {event.registrationFee > 0 && (
                <div className="flex items-center text-yellow-400 font-semibold">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>₹{event.registrationFee}</span>
                </div>
              )}
            </div>

            {event.rules && event.rules.length > 0 && (
              <div className="mt-4">
                <h3 className="text-white font-semibold mb-2">
                  Rules & Guidelines:
                </h3>
                <ul className="list-disc list-inside text-purple-200 space-y-1">
                  {event.rules.map((rule, index) => (
                    <li key={index} className="text-sm">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Registration Form</h2>
            <button
              type="button"
              onClick={fillTestData}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg text-sm whitespace-nowrap"
            >
              🧪 Fill Test Data
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {event.customFields?.map((field, index) => (
              <div key={index}>
                <label className="block text-purple-200 mb-2 font-medium">
                  {field.label}
                  {field.required && (
                    <span className="text-pink-400 ml-1">*</span>
                  )}
                </label>
                {renderField(field, index)}
              </div>
            ))}

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationPage;
