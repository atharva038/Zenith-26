import React, {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {toast} from "react-toastify";
import api from "../config/api";
import {motion, AnimatePresence} from "framer-motion";

// Payment QR Code - Sagar Ubale (sagarubale2004@oksbi)
const PAYMENT_QR_URL =
  "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:best/v1767592627/zenith-26/img/payment/payment-qr-sagar-ubale";

// Backup QR Codes - Atharva Joshi
const BACKUP_QR_URLS = [
  {
    name: "Atharva Joshi (ICICI)",
    upiId: "atharvsjoshi2005-1@okicici",
    url: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1767630215/zenith-26/img/payment/backup-qr-atharva-okicici.png",
  },
  {
    name: "Atharva Joshi (Axis)",
    upiId: "atharvsjoshi2005@okaxis",
    url: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1767630220/zenith-26/img/payment/backup-qr-atharva-okaxis.png",
  },
];

const MarathonRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showBackupQR, setShowBackupQR] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    college: "",
    emergencyContact: {
      name: "",
      phone: "",
    },
    medicalConditions: "",
    paymentScreenshotUrl: "",
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
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
      setFormData({...formData, [name]: value});
    }
  };

  const handleScreenshotChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG) or PDF file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setPaymentScreenshot(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setScreenshotPreview("PDF");
    }

    // Upload the file immediately
    try {
      setIsUploadingScreenshot(true);
      const uploadToast = toast.loading("Uploading payment screenshot...");

      const formDataToUpload = new FormData();
      formDataToUpload.append("screenshot", file);

      const response = await api.post(
        "/marathon/upload-payment-screenshot",
        formDataToUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss(uploadToast);

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          paymentScreenshotUrl: response.data.url,
        }));
        toast.success("Payment screenshot uploaded successfully!");
      }
    } catch (error) {
      console.error("Screenshot upload error:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload screenshot"
      );
      setPaymentScreenshot(null);
      setScreenshotPreview(null);
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const handleRemoveScreenshot = () => {
    setPaymentScreenshot(null);
    setScreenshotPreview(null);
    setFormData((prev) => ({
      ...prev,
      paymentScreenshotUrl: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate payment screenshot is uploaded
    if (!formData.paymentScreenshotUrl) {
      toast.error("Please upload payment screenshot!");
      return;
    }

    setLoading(true);

    try {
      // Prepare data with payment details
      const registrationData = {
        ...formData,
        category: "5K", // Fixed category - only 5K marathon
        tshirtSize: "M", // Default tshirt size (not collected anymore)
        paymentDetails: {
          amount: 99,
          paymentDate: new Date().toISOString(),
          paymentScreenshot: formData.paymentScreenshotUrl,
        },
      };

      const response = await api.post("/marathon/register", registrationData);

      if (response.data.success) {
        toast.success(
          `Registration Successful! Your Registration Number: ${response.data.data.registrationNumber}`
        );
        toast.info(
          "Your payment will be verified by admin. You'll receive confirmation via email."
        );

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          age: "",
          gender: "",
          college: "",
          emergencyContact: {
            name: "",
            phone: "",
          },
          medicalConditions: "",
          paymentScreenshotUrl: "",
        });
        setPaymentScreenshot(null);
        setScreenshotPreview(null);

        setTimeout(() => navigate("/marathon-event"), 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0604] to-black">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <span className="text-2xl">🏃</span>
            <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              ZENITH MARATHON
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/home"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/marathon-event"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              Event Details
            </Link>
            <Link
              to="/register"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              Sports Registration
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/marathon-event"
              className="hidden sm:inline-block px-4 py-2 rounded-full font-semibold text-orange-300 border border-orange-500/30 hover:bg-orange-500/10 transition-all"
            >
              ← Back to Event
            </Link>
            <Link
              to="/home"
              className="px-4 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content with padding for fixed nav */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{opacity: 0, y: -20}}
              animate={{opacity: 1, y: 0}}
              className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] mb-4"
            >
              🏃 Zenith Marathon 2026
            </motion.h1>
            <p className="text-[#ffdcb3] text-lg">
              Join us for an unforgettable running experience! • February 14, 2026
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full">
              <span className="text-orange-400 font-semibold">5 KM Run</span>
              <span className="text-white/50">•</span>
              <span className="text-orange-400 font-bold text-lg">₹99</span>
            </div>
          </div>

          {/* Registration Form */}
          <motion.div
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            className="bg-gradient-to-br from-[#1a0f08] to-[#0a0604] backdrop-blur-md rounded-2xl shadow-2xl p-8 border-2 border-[#ff8b1f]/20"
          >
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
                      <option value="" className="bg-[#1a0f08]">
                        Select Gender
                      </option>
                      <option value="Male" className="bg-[#1a0f08]">
                        Male
                      </option>
                      <option value="Female" className="bg-[#1a0f08]">
                        Female
                      </option>
                      <option value="Other" className="bg-[#1a0f08]">
                        Other
                      </option>
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
                  <div className="text-center mb-4">
                    <p className="text-[#ffdcb3] text-lg font-semibold mb-2">
                      Registration Fee: ₹99
                    </p>
                    <p className="text-gray-400 text-sm">
                      Scan the QR code below to make payment
                    </p>
                  </div>

                  {/* Payment QR Code */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-xl">
                      <img
                        src={PAYMENT_QR_URL}
                        alt="Payment QR Code - Scan to pay"
                        className="w-64 h-auto object-contain"
                      />
                    </div>
                  </div>

                  <div className="bg-black/40 rounded-lg p-4 border border-[#ff8b1f]/20 text-center mb-4">
                    <p className="text-[#ffdcb3] text-sm font-semibold">
                      UPI ID:{" "}
                      <span className="text-white font-mono">
                        sagarubale2004@oksbi
                      </span>
                    </p>
                  </div>

                  {/* Backup QR Codes Dropdown */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowBackupQR(!showBackupQR)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 rounded-lg text-orange-300 font-medium transition-all"
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
                          initial={{height: 0, opacity: 0}}
                          animate={{height: "auto", opacity: 1}}
                          exit={{height: 0, opacity: 0}}
                          transition={{duration: 0.3}}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 space-y-6 pt-4 border-t border-orange-500/20">
                            {BACKUP_QR_URLS.map((qr, index) => (
                              <div
                                key={index}
                                className="bg-orange-500/5 p-6 rounded-lg border border-orange-500/20"
                              >
                                <p className="text-sm text-orange-300 mb-3 font-medium text-center">
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
                </div>

                {/* Payment Screenshot Upload */}
                <div className="mt-6">
                  <label className="block text-[#ffdcb3] font-medium mb-4 text-lg">
                    Upload Payment Screenshot{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-400 mb-4">
                    Please upload a screenshot of your payment transaction.
                    Accepted formats: JPG, PNG, PDF (Max 10MB)
                  </p>

                  {/* Important Notice */}
                  <div className="mb-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-l-4 border-yellow-500 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg
                          className="w-5 h-5 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-yellow-500 font-semibold text-sm mb-1">
                          📌 Important: Transaction ID Required
                        </p>
                        <p className="text-yellow-200/90 text-xs leading-relaxed">
                          Please ensure your screenshot clearly shows the{" "}
                          <span className="font-bold text-yellow-400">
                            Transaction ID / UTR Number
                          </span>
                          . Upload the complete payment receipt from your
                          banking app or UPI app.
                        </p>
                      </div>
                    </div>
                  </div>

                  {!screenshotPreview ? (
                    <div className="relative">
                      <input
                        type="file"
                        id="payment-screenshot"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        onChange={handleScreenshotChange}
                        disabled={isUploadingScreenshot}
                        className="hidden"
                      />
                      <label
                        htmlFor="payment-screenshot"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#ff8b1f]/30 rounded-lg cursor-pointer hover:border-[#ff8b1f] transition-colors ${
                          isUploadingScreenshot
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <svg
                          className="w-12 h-12 text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-gray-300 text-sm">
                          {isUploadingScreenshot
                            ? "Uploading..."
                            : "Click to upload payment screenshot"}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          JPG, PNG or PDF (MAX. 10MB)
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="bg-black/40 border border-[#ff8b1f]/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {screenshotPreview === "PDF" ? (
                            <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          ) : (
                            <img
                              src={screenshotPreview}
                              alt="Payment Screenshot"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <p className="text-white font-medium">
                              {paymentScreenshot?.name}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {(
                                paymentScreenshot?.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>
                            {formData.paymentScreenshotUrl && (
                              <p className="text-green-400 text-xs mt-1">
                                ✓ Uploaded successfully
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveScreenshot}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 text-xs">
                    ⚠️ <strong>Important:</strong> Registration will be
                    confirmed only after payment verification. Admin will review your payment screenshot and approve your registration.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{scale: 1.02}}
                  whileTap={{scale: 0.98}}
                  type="submit"
                  disabled={loading || !formData.paymentScreenshotUrl}
                  className="flex-1 font-semibold py-4 px-6 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-[#2c1506]"
                  style={{
                    background: "linear-gradient(90deg, #ffb36a, #ff8b1f)",
                    boxShadow:
                      "0 12px 28px rgba(255,140,40,0.3), inset 0 -2px 6px rgba(0,0,0,0.12)",
                  }}
                >
                  {loading ? "Registering..." : "🏃 Register for Marathon"}
                </motion.button>

                <motion.button
                  whileHover={{scale: 1.02}}
                  whileTap={{scale: 0.98}}
                  type="button"
                  onClick={() => navigate("/marathon-event")}
                  className="px-6 py-4 bg-black/40 text-[#ffdcb3] font-semibold rounded-lg border border-[#ff8b1f]/30 hover:bg-black/60 transition-all"
                >
                  ← Back
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarathonRegistration;
