import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../config/api";

const TeamMemberForm = ({ onMemberAdded, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    committee: "",
    position: "",
    phoneNumber: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const committees = [
    "EVENT MANAGEMENT",
    "FOOD & SITE",
    "GUEST MANAGEMENT & HOSPITALITY",
    "GROUND & SITE + DISCIPLINE",
    "DECORATION",
    "SPONSORSHIP",
    "MEDIA & WEB",
    "PRC/PERMISSION",
    "FINANCE",
  ];

  const positions = ["main", "sjc"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size must be less than 5MB");
        return;
      }

      setPhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.committee ||
      !formData.position ||
      !formData.phoneNumber ||
      !photoFile
    ) {
      toast.error("Please fill all fields and upload a photo");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("committee", formData.committee);
      submitData.append("position", formData.position);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("photo", photoFile);

      const response = await api.post("/team-members", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Team member added successfully!");

      // Reset form
      setFormData({
        name: "",
        committee: "",
        position: "",
        phoneNumber: "",
      });
      setPhotoFile(null);
      setPhotoPreview(null);

      // Notify parent component
      if (onMemberAdded) {
        onMemberAdded(response.data.data.teamMember);
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add team member";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] via-[#ff8b1f] to-[#ffb36a] mb-8 text-center">
        Add Team Member
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-[#1a0f08] border border-[#3a2416] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb36a] focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Committee */}
        <div>
          <label
            htmlFor="committee"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Committee *
          </label>
          <select
            id="committee"
            name="committee"
            value={formData.committee}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-[#1a0f08] border border-[#3a2416] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb36a] focus:border-transparent text-white transition-all duration-200"
            required
          >
            <option value="" className="bg-[#1a0f08] text-gray-400">
              Select Committee
            </option>
            {committees.map((committee) => (
              <option
                key={committee}
                value={committee}
                className="bg-[#1a0f08] text-white"
              >
                {committee}
              </option>
            ))}
          </select>
        </div>

        {/* Position */}
        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Position *
          </label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-[#1a0f08] border border-[#3a2416] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb36a] focus:border-transparent text-white transition-all duration-200"
            required
          >
            <option value="" className="bg-[#1a0f08] text-gray-400">
              Select Position
            </option>
            {positions.map((position) => (
              <option
                key={position}
                value={position}
                className="bg-[#1a0f08] text-white"
              >
                {position.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-[#1a0f08] border border-[#3a2416] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb36a] focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
            placeholder="Enter phone number"
            required
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Passport Size Photo *
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full px-4 py-3 bg-[#1a0f08] border border-[#3a2416] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb36a] focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#ffb36a] file:text-black hover:file:bg-[#ff8b1f] transition-all duration-200"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            Maximum file size: 5MB. Supported formats: JPG, PNG, WebP
          </p>

          {/* Photo Preview */}
          {photoPreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-2">Preview:</p>
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border-2 border-[#3a2416] shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffb36a]/20 to-transparent rounded-xl"></div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] hover:from-[#ff8b1f] hover:to-[#ffb36a] text-black font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb36a]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            {loading ? "Adding..." : "Add Team Member"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-[#3a2416] text-gray-300 rounded-xl hover:bg-[#2a1a11] hover:border-[#ffb36a] focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TeamMemberForm;
