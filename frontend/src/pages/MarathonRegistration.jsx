import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../config/api";
import { motion } from "framer-motion";

const MarathonRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    college: "",
    category: "5K",
    tshirtSize: "M",
    emergencyContact: {
      name: "",
      phone: "",
    },
    medicalConditions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("emergency_")) {
      const field = name.split("_")[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...formData.emergencyContact,
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data with payment details
      const registrationData = {
        ...formData,
        paymentDetails: {
          transactionId: transactionId,
          amount: 500,
          paymentDate: new Date().toISOString(),
        },
      };

      const response = await api.post("/marathon/register", registrationData);
      
      if (response.data.success) {
        toast.success(
          `Registration Successful! Your Registration Number: ${response.data.data.registrationNumber}`
        );
        toast.info("Your payment will be verified by admin. You'll receive confirmation via email.");
        
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          age: "",
          gender: "",
          college: "",
          category: "5K",
          tshirtSize: "M",
          emergencyContact: {
            name: "",
            phone: "",
          },
          medicalConditions: "",
        });
        setTransactionId("");
        setPaymentConfirmed(false);
        
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Fill test data for testing
  const fillTestData = () => {
    setFormData({
      fullName: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "9876543210",
      age: "25",
      gender: "Male",
      college: "SGGSIE&T, Nanded",
      category: "10K",
      tshirtSize: "L",
      emergencyContact: {
        name: "Priya Sharma",
        phone: "9123456789",
      },
      medicalConditions: "No medical conditions",
    });
    setTransactionId("TEST12345678AB");
    setPaymentConfirmed(true);
    toast.success("Test data filled! You can now submit the form.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0604] to-black py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] mb-4"
          >
            🏃 Zenith Marathon 2026
          </motion.h1>
          <p className="text-[#ffdcb3] text-lg">
            Join us for an unforgettable running experience!
          </p>
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#1a0f08] to-[#0a0604] backdrop-blur-md rounded-2xl shadow-2xl p-8 border-2 border-[#ff8b1f]/20"
        >
          {/* Test Data Button - For Testing Only */}
          <div className="mb-6 flex justify-end">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fillTestData}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
            >
              🧪 Fill Test Data (For Testing)
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] border-b border-[#ff8b1f]/30 pb-2">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                    placeholder="10-digit number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="16"
                    max="100"
                    className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                    placeholder="Minimum age: 16"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                  >
                    <option value="" className="bg-[#1a0f08]">Select Gender</option>
                    <option value="Male" className="bg-[#1a0f08]">Male</option>
                    <option value="Female" className="bg-[#1a0f08]">Female</option>
                    <option value="Other" className="bg-[#1a0f08]">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                    College/Organization *
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                    placeholder="Your institution"
                  />
                </div>
              </div>
            </div>

            {/* Marathon Details */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] border-b border-[#ff8b1f]/30 pb-2">
                Marathon Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                  >
                    <option value="5K" className="bg-[#1a0f08]">5K Run</option>
                    <option value="10K" className="bg-[#1a0f08]">10K Run</option>
                    <option value="Half Marathon" className="bg-[#1a0f08]">Half Marathon (21K)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                    T-Shirt Size *
                  </label>
                  <select
                    name="tshirtSize"
                    value={formData.tshirtSize}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                  >
                    <option value="S" className="bg-[#1a0f08]">Small</option>
                    <option value="M" className="bg-[#1a0f08]">Medium</option>
                    <option value="L" className="bg-[#1a0f08]">Large</option>
                    <option value="XL" className="bg-[#1a0f08]">XL</option>
                    <option value="XXL" className="bg-[#1a0f08]">XXL</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] border-b border-[#ff8b1f]/30 pb-2">
                Emergency Contact
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="emergency_name"
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                    placeholder="Emergency contact name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="emergency_phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                    placeholder="10-digit number"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] border-b border-[#ff8b1f]/30 pb-2">
                Medical Information (Optional)
              </h2>

              <div>
                <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                  Any Medical Conditions?
                </label>
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                  placeholder="Please mention any medical conditions, allergies, or health concerns (Optional)"
                />
              </div>
            </div>

            {/* Payment Section with QR Code */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] border-b border-[#ff8b1f]/30 pb-2">
                Payment Details
              </h2>

              <div className="bg-gradient-to-br from-[#ff8b1f]/10 to-[#ffb36a]/10 border-2 border-[#ff8b1f]/30 rounded-xl p-6">
                {/* Testing Notice */}
                <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 text-sm text-center">
                    🧪 <strong>For Testing:</strong> This is a sample QR code and UPI ID. Use the "Fill Test Data" button above to auto-fill test transaction ID.
                  </p>
                </div>

                <div className="text-center mb-4">
                  <p className="text-[#ffdcb3] text-lg font-semibold mb-2">
                    Registration Fee: ₹500
                  </p>
                  <p className="text-gray-400 text-sm">
                    Scan the QR code below to make payment
                  </p>
                </div>

                {/* QR Code Placeholder */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-xl">
                    {/* Sample QR Code SVG - Replace this with actual QR code later */}
                    <svg
                      width="200"
                      height="200"
                      viewBox="0 0 200 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="200" height="200" fill="white" />
                      {/* QR Code Pattern - Sample */}
                      <rect x="10" y="10" width="60" height="60" fill="black" />
                      <rect x="20" y="20" width="40" height="40" fill="white" />
                      <rect x="30" y="30" width="20" height="20" fill="black" />
                      
                      <rect x="130" y="10" width="60" height="60" fill="black" />
                      <rect x="140" y="20" width="40" height="40" fill="white" />
                      <rect x="150" y="30" width="20" height="20" fill="black" />
                      
                      <rect x="10" y="130" width="60" height="60" fill="black" />
                      <rect x="20" y="140" width="40" height="40" fill="white" />
                      <rect x="30" y="150" width="20" height="20" fill="black" />
                      
                      {/* Random pattern blocks */}
                      <rect x="80" y="20" width="10" height="10" fill="black" />
                      <rect x="100" y="20" width="10" height="10" fill="black" />
                      <rect x="80" y="40" width="10" height="10" fill="black" />
                      <rect x="90" y="50" width="10" height="10" fill="black" />
                      <rect x="110" y="40" width="10" height="10" fill="black" />
                      
                      <rect x="20" y="80" width="10" height="10" fill="black" />
                      <rect x="40" y="90" width="10" height="10" fill="black" />
                      <rect x="50" y="100" width="10" height="10" fill="black" />
                      <rect x="30" y="110" width="10" height="10" fill="black" />
                      
                      <rect x="80" y="80" width="40" height="40" fill="black" />
                      <rect x="90" y="90" width="20" height="20" fill="white" />
                      <rect x="95" y="95" width="10" height="10" fill="black" />
                      
                      <rect x="130" y="80" width="10" height="10" fill="black" />
                      <rect x="150" y="90" width="10" height="10" fill="black" />
                      <rect x="160" y="100" width="10" height="10" fill="black" />
                      <rect x="140" y="110" width="10" height="10" fill="black" />
                      <rect x="170" y="120" width="10" height="10" fill="black" />
                      
                      <rect x="80" y="130" width="10" height="10" fill="black" />
                      <rect x="100" y="140" width="10" height="10" fill="black" />
                      <rect x="110" y="150" width="10" height="10" fill="black" />
                      <rect x="90" y="160" width="10" height="10" fill="black" />
                      <rect x="120" y="170" width="10" height="10" fill="black" />
                      
                      <rect x="130" y="130" width="10" height="10" fill="black" />
                      <rect x="150" y="140" width="10" height="10" fill="black" />
                      <rect x="160" y="150" width="10" height="10" fill="black" />
                      <rect x="140" y="160" width="10" height="10" fill="black" />
                      <rect x="170" y="170" width="10" height="10" fill="black" />
                    </svg>
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg p-4 border border-[#ff8b1f]/20">
                  <p className="text-[#ffdcb3] text-sm mb-3 font-semibold">
                    UPI ID: <span className="text-white font-mono">zenith2026@upi</span> 
                    <span className="ml-2 text-blue-400 text-xs">(Sample for testing)</span>
                  </p>
                  <p className="text-gray-400 text-xs mb-4">
                    After payment, please enter your transaction ID below
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-[#ffdcb3] mb-2">
                        Transaction ID / UTR Number *
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-black/40 border border-[#ff8b1f]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff8b1f] focus:border-transparent transition-all"
                        placeholder="Enter transaction ID (e.g., 1234567890AB)"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="paymentConfirm"
                        checked={paymentConfirmed}
                        onChange={(e) => setPaymentConfirmed(e.target.checked)}
                        required
                        className="w-4 h-4 text-[#ff8b1f] bg-black/40 border-[#ff8b1f]/30 rounded focus:ring-[#ff8b1f] focus:ring-2"
                      />
                      <label
                        htmlFor="paymentConfirm"
                        className="ml-2 text-sm text-[#ffdcb3]"
                      >
                        I confirm that I have completed the payment of ₹500 *
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 text-xs">
                    ⚠️ <strong>Important:</strong> Registration will be confirmed only after payment verification. Please keep your transaction ID safe for reference.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !paymentConfirmed || !transactionId}
                className="flex-1 font-semibold py-4 px-6 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-[#2c1506]"
                style={{
                  background: "linear-gradient(90deg, #ffb36a, #ff8b1f)",
                  boxShadow: "0 12px 28px rgba(255,140,40,0.3), inset 0 -2px 6px rgba(0,0,0,0.12)",
                }}
              >
                {loading ? "Registering..." : "🏃 Register for Marathon"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-4 bg-black/40 text-[#ffdcb3] font-semibold rounded-lg border border-[#ff8b1f]/30 hover:bg-black/60 transition-all"
              >
                ← Back to Home
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MarathonRegistration;
