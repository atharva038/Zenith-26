import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import api from "../config/api";

const SPORTS_CATEGORIES = [
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

// Default registration form template for all sports
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

const SportEventForm = () => {
  const {eventId} = useParams();
  const navigate = useNavigate();
  const isEditMode = !!eventId;

  const [loading, setLoading] = useState(false);

  // Fixed dates for Zenith 2026
  const FIXED_REGISTRATION_DEADLINE = "2026-02-20T23:59"; // Feb 20, 2026 11:59 PM
  const FIXED_EVENT_DATE = "2026-02-20T09:00"; // Feb 20, 2026 9:00 AM

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "Cricket",
    registrationDeadline: FIXED_REGISTRATION_DEADLINE,
    eventDate: FIXED_EVENT_DATE,
    venue: "SGGSIE&T College",
    maxParticipants: "",
    registrationFee: 0,
    isActive: true,
    isPublished: true, // Default to TRUE so events are visible immediately
    organizerName: "",
    organizerEmail: "",
    organizerPhone: "",
    coordinators: [{name: "", email: "", phone: ""}], // Multiple coordinators
    rules: [""],
    prizes: [""],
    customFields: [...DEFAULT_FORM_FIELDS],
  });

  useEffect(() => {
    if (isEditMode) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${eventId}`);
      const event = response.data.data;

      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        ...event,
        registrationDeadline: formatDateForInput(event.registrationDeadline),
        eventDate: formatDateForInput(event.eventDate),
        maxParticipants: event.maxParticipants || "",
        rules: event.rules?.length > 0 ? event.rules : [""],
        prizes: event.prizes?.length > 0 ? event.prizes : [""],
        customFields: event.customFields || [...DEFAULT_FORM_FIELDS],
      });
    } catch (error) {
      toast.error("Failed to fetch event details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleArrayChange = (index, value, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    setFormData({...formData, [arrayName]: newArray});
  };

  const addArrayItem = (arrayName) => {
    if (arrayName === "coordinators") {
      setFormData({
        ...formData,
        coordinators: [
          ...formData.coordinators,
          {name: "", email: "", phone: ""},
        ],
      });
    } else {
      setFormData({
        ...formData,
        [arrayName]: [...formData[arrayName], ""],
      });
    }
  };

  const removeArrayItem = (index, arrayName) => {
    if (arrayName === "coordinators") {
      const newArray = formData.coordinators.filter((_, i) => i !== index);
      setFormData({...formData, coordinators: newArray});
    } else {
      const newArray = formData[arrayName].filter((_, i) => i !== index);
      setFormData({...formData, [arrayName]: newArray});
    }
  };

  const handleCoordinatorChange = (index, field, value) => {
    const newCoordinators = [...formData.coordinators];
    newCoordinators[index][field] = value;
    setFormData({...formData, coordinators: newCoordinators});
  };

  const fillTestData = () => {
    setFormData({
      ...formData,
      name: `${formData.category} - Zenith 2026`,
      description: `Join us for an exciting ${formData.category} tournament at Zenith 2026! This premier sporting event brings together the best teams from colleges across the nation. Experience high-energy competition, showcase your skills, and compete for glory and amazing prizes. Whether you're a seasoned athlete or a passionate player, this is your chance to shine on the big stage! Event dates: February 20-22, 2026 at SGGSIE&T College.`,
      shortDescription: `Premier ${formData.category} tournament - Compete, Win, Celebrate!`,
      registrationDeadline: FIXED_REGISTRATION_DEADLINE,
      eventDate: FIXED_EVENT_DATE,
      venue: "SGGSIE&T College",
      maxParticipants: "100",
      registrationFee: 500,
      organizerName: "John Doe",
      organizerEmail: "sports@zenith2026.com",
      organizerPhone: "9876543210",
      coordinators: [
        {
          name: "Rahul Sharma",
          email: "rahul.sharma@sggsiet.ac.in",
          phone: "9876543210",
        },
        {
          name: "Priya Patel",
          email: "priya.patel@sggsiet.ac.in",
          phone: "9876543211",
        },
      ],
      rules: [
        "All team members must be currently enrolled college students",
        "Valid college ID cards are mandatory for verification",
        "Teams must arrive 30 minutes before the scheduled match time",
        "Standard tournament rules and regulations apply",
        "Participants must follow the code of conduct at all times",
        "Event dates: February 20-22, 2026",
      ],
      prizes: [
        "Winner: ₹50,000 + Trophy + Certificates",
        "Runner-up: ₹30,000 + Trophy + Certificates",
        "Semi-finalists: ₹10,000 each + Certificates",
        "Best Player Award: ₹5,000 + Trophy",
      ],
      isActive: true,
      isPublished: true,
    });

    toast.success(
      "Test data filled! Event dates are FIXED to Feb 20-22, 2026 at SGGSIE&T College."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.registrationDeadline
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        name: `${formData.category} - Zenith 2026`,
        rules: formData.rules.filter((r) => r.trim()),
        prizes: formData.prizes.filter((p) => p.trim()),
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : null,
      };

      if (isEditMode) {
        await api.put(`/events/${eventId}`, submitData);
        toast.success("Event updated successfully");
      } else {
        await api.post("/events", submitData);
        toast.success("Event created successfully");
      }

      navigate("/admin/events");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save event");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/events")}
            className="text-purple-300 hover:text-white transition-colors mb-4"
          >
            ← Back to Events
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white">
                {isEditMode ? "Edit Sport Event" : "Create New Sport Event"}
              </h1>
              <p className="text-purple-300 mt-2">
                Form template is pre-configured for all sports. Just select the
                sport and configure coordinators & pricing.
              </p>
            </div>
            {!isEditMode && (
              <button
                type="button"
                onClick={fillTestData}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg whitespace-nowrap"
              >
                🧪 Fill Test Data
              </button>
            )}
          </div>

          {/* Important info banner about Active and Published */}
          <div className="mt-6 bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-yellow-300 font-semibold mb-1">
                  Important: Event Visibility Settings
                </h3>
                <p className="text-yellow-100 text-sm">
                  For events to appear in GameVerse and the Registration page,
                  you must check <strong>BOTH</strong> checkboxes:
                </p>
                <ul className="text-yellow-100 text-sm mt-2 ml-4 list-disc">
                  <li>
                    <strong>"Active"</strong> - Enables registration for this
                    event
                  </li>
                  <li>
                    <strong>"Published"</strong> - Makes the event visible to
                    students in GameVerse planets
                  </li>
                </ul>
                <p className="text-yellow-200 text-sm mt-2 font-medium">
                  💡 Both are now checked by default for your convenience!
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Sport Selection
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2">
                  Select Sport *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                >
                  {SPORTS_CATEGORIES.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
                <p className="text-purple-300 text-sm mt-1">
                  Event name will be: "{formData.category} - Zenith 2026"
                </p>
              </div>

              <div>
                <label className="block text-purple-200 mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  maxLength={200}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                  placeholder={`Brief tagline for ${formData.category}`}
                />
              </div>

              <div>
                <label className="block text-purple-200 mb-2">
                  Full Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                  placeholder={`Detailed description for ${formData.category} competition`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 mb-2">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                    placeholder="Competition venue"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 mb-2">
                    Max Teams
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>

              {/* Fixed Event Dates Info */}
              <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg p-4 border border-purple-400/50">
                <h3 className="text-white font-semibold mb-2 flex items-center">
                  <span className="mr-2">📅</span>
                  Fixed Event Dates (Zenith 2026)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-purple-100">
                  <div>
                    <p className="text-sm opacity-75">Registration Deadline:</p>
                    <p className="font-semibold">
                      February 20, 2026 @ 11:59 PM
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Event Duration:</p>
                    <p className="font-semibold">February 20-22, 2026</p>
                  </div>
                </div>
                <p className="text-xs text-purple-200 mt-2">
                  ℹ️ Event dates are fixed for all sports and cannot be changed.
                </p>
              </div>

              <div>
                <label className="block text-purple-200 mb-2">
                  Registration Fee (₹)
                </label>
                <input
                  type="number"
                  name="registrationFee"
                  value={formData.registrationFee}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center text-purple-200 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2 w-5 h-5"
                  />
                  Active (Enable Registration)
                </label>

                <label className="flex items-center text-purple-200 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="mr-2 w-5 h-5"
                  />
                  Published (Visible in GameVerse)
                </label>
              </div>
            </div>
          </div>

          {/* Coordinator Details */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Sport Coordinators
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem("coordinators")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <span>+</span> Add Coordinator
              </button>
            </div>

            <p className="text-purple-300 text-sm mb-4">
              Add multiple coordinators for this sport. Teams will be able to
              contact them for queries.
            </p>

            <div className="space-y-4">
              {formData.coordinators.map((coordinator, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white font-semibold">
                      Coordinator {index + 1}
                    </h3>
                    {formData.coordinators.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, "coordinators")}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-purple-200 text-sm mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={coordinator.name}
                        onChange={(e) =>
                          handleCoordinatorChange(index, "name", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
                        placeholder="Coordinator name"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-200 text-sm mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={coordinator.email}
                        onChange={(e) =>
                          handleCoordinatorChange(
                            index,
                            "email",
                            e.target.value
                          )
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
                        placeholder="coordinator@sggsiet.ac.in"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-200 text-sm mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={coordinator.phone}
                        onChange={(e) =>
                          handleCoordinatorChange(
                            index,
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legacy single coordinator fields (kept for backward compatibility) */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-purple-300 text-xs mb-2">
                Legacy fields (will use first coordinator if coordinators array
                is empty):
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50">
                <div>
                  <label className="block text-purple-200 text-sm mb-2">
                    Coordinator Name
                  </label>
                  <input
                    type="text"
                    name="organizerName"
                    value={formData.organizerName}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
                    placeholder="Coordinator name"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 text-sm mb-2">
                    Coordinator Email
                  </label>
                  <input
                    type="email"
                    name="organizerEmail"
                    value={formData.organizerEmail}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
                    placeholder="coordinator@example.com"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 text-sm mb-2">
                    Coordinator Phone
                  </label>
                  <input
                    type="tel"
                    name="organizerPhone"
                    value={formData.organizerPhone}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pre-configured Form Preview */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Registration Form Preview
            </h2>
            <p className="text-purple-300 mb-4">
              This is the standard form that all participants will fill. Same
              for all sports.
            </p>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEFAULT_FORM_FIELDS.map((field, idx) => (
                  <div
                    key={idx}
                    className={
                      field.fieldType === "textarea" ? "md:col-span-2" : ""
                    }
                  >
                    <label className="block text-purple-200 text-sm mb-1">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-pink-400">*</span>
                      )}
                    </label>
                    <div className="text-purple-400 text-xs italic">
                      {field.fieldType} field - {field.placeholder}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Rules & Guidelines
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem("rules")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                + Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) =>
                      handleArrayChange(index, e.target.value, "rules")
                    }
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
                    placeholder={`Rule ${index + 1}`}
                  />
                  {formData.rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "rules")}
                      className="bg-red-500/30 text-red-200 px-4 py-2 rounded-lg hover:bg-red-500/50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prizes */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Prizes</h2>
              <button
                type="button"
                onClick={() => addArrayItem("prizes")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                + Add Prize
              </button>
            </div>

            <div className="space-y-3">
              {formData.prizes.map((prize, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={prize}
                    onChange={(e) =>
                      handleArrayChange(index, e.target.value, "prizes")
                    }
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
                    placeholder={`Prize ${index + 1}`}
                  />
                  {formData.prizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "prizes")}
                      className="bg-red-500/30 text-red-200 px-4 py-2 rounded-lg hover:bg-red-500/50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Event"
                : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SportEventForm;
