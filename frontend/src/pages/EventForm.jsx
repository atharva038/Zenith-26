import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import api from "../config/api";

const EventForm = () => {
  const {eventId} = useParams();
  const navigate = useNavigate();
  const isEditMode = !!eventId;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "Other",
    registrationDeadline: "",
    eventDate: "",
    venue: "",
    maxParticipants: "",
    registrationFee: 0,
    isActive: true,
    isPublished: false,
    organizerName: "",
    organizerEmail: "",
    organizerPhone: "",
    rules: [""],
    prizes: [""],
    customFields: [],
  });

  const fieldTypes = [
    {value: "text", label: "Text Input"},
    {value: "email", label: "Email"},
    {value: "tel", label: "Phone Number"},
    {value: "number", label: "Number"},
    {value: "textarea", label: "Text Area"},
    {value: "select", label: "Dropdown"},
    {value: "radio", label: "Radio Buttons"},
    {value: "checkbox", label: "Checkboxes"},
    {value: "date", label: "Date"},
  ];

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

      // Format dates for input fields
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
        customFields: event.customFields || [],
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
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], ""],
    });
  };

  const removeArrayItem = (index, arrayName) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({...formData, [arrayName]: newArray});
  };

  const addCustomField = () => {
    setFormData({
      ...formData,
      customFields: [
        ...formData.customFields,
        {
          label: "",
          fieldName: "",
          fieldType: "text",
          placeholder: "",
          required: false,
          options: [],
        },
      ],
    });
  };

  const updateCustomField = (index, field, value) => {
    const newFields = [...formData.customFields];
    newFields[index] = {...newFields[index], [field]: value};

    // Auto-generate fieldName from label
    if (field === "label") {
      newFields[index].fieldName = value.toLowerCase().replace(/\s+/g, "_");
    }

    setFormData({...formData, customFields: newFields});
  };

  const removeCustomField = (index) => {
    const newFields = formData.customFields.filter((_, i) => i !== index);
    setFormData({...formData, customFields: newFields});
  };

  const updateFieldOptions = (fieldIndex, optionsString) => {
    const options = optionsString
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt);
    const newFields = [...formData.customFields];
    newFields[fieldIndex].options = options;
    setFormData({...formData, customFields: newFields});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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

      // Clean up data
      const submitData = {
        ...formData,
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
          <h1 className="text-4xl font-bold text-white">
            {isEditMode ? "Edit Event" : "Create New Event"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                  placeholder="Enter event name"
                />
              </div>

              <div>
                <label className="block text-purple-200 mb-2">
                  Short Description (max 200 chars)
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  maxLength={200}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                  placeholder="Brief description for listings"
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
                  placeholder="Detailed event description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Technical">Technical</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Competition">Competition</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-200 mb-2">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                    placeholder="Event venue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 mb-2">
                    Registration Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 mb-2">
                    Event Date
                  </label>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 mb-2">
                    Max Participants (leave empty for unlimited)
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                    placeholder="Unlimited"
                  />
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
                  Published (Visible to Public)
                </label>
              </div>
            </div>
          </div>

          {/* Organizer Details */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Organizer Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-purple-200 mb-2">
                  Organizer Name
                </label>
                <input
                  type="text"
                  name="organizerName"
                  value={formData.organizerName}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                  placeholder="Name"
                />
              </div>

              <div>
                <label className="block text-purple-200 mb-2">
                  Organizer Email
                </label>
                <input
                  type="email"
                  name="organizerEmail"
                  value={formData.organizerEmail}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-purple-200 mb-2">
                  Organizer Phone
                </label>
                <input
                  type="tel"
                  name="organizerPhone"
                  value={formData.organizerPhone}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Custom Registration Fields */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Registration Form Fields
              </h2>
              <button
                type="button"
                onClick={addCustomField}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                + Add Field
              </button>
            </div>

            {formData.customFields.length === 0 ? (
              <p className="text-purple-300">
                No custom fields added yet. Click "Add Field" to create
                registration form fields.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.customFields.map((field, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-purple-200 text-sm mb-1">
                          Field Label *
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) =>
                            updateCustomField(index, "label", e.target.value)
                          }
                          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                          placeholder="e.g., Full Name"
                        />
                      </div>

                      <div>
                        <label className="block text-purple-200 text-sm mb-1">
                          Field Type *
                        </label>
                        <select
                          value={field.fieldType}
                          onChange={(e) =>
                            updateCustomField(
                              index,
                              "fieldType",
                              e.target.value
                            )
                          }
                          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                        >
                          {fieldTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-purple-200 text-sm mb-1">
                          Placeholder
                        </label>
                        <input
                          type="text"
                          value={field.placeholder}
                          onChange={(e) =>
                            updateCustomField(
                              index,
                              "placeholder",
                              e.target.value
                            )
                          }
                          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                          placeholder="Placeholder text"
                        />
                      </div>

                      <div className="flex items-end">
                        <label className="flex items-center text-purple-200 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) =>
                              updateCustomField(
                                index,
                                "required",
                                e.target.checked
                              )
                            }
                            className="mr-2"
                          />
                          Required Field
                        </label>
                      </div>
                    </div>

                    {["select", "radio", "checkbox"].includes(
                      field.fieldType
                    ) && (
                      <div className="mb-3">
                        <label className="block text-purple-200 text-sm mb-1">
                          Options (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={field.options?.join(", ") || ""}
                          onChange={(e) =>
                            updateFieldOptions(index, e.target.value)
                          }
                          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeCustomField(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove Field
                    </button>
                  </div>
                ))}
              </div>
            )}
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

export default EventForm;
