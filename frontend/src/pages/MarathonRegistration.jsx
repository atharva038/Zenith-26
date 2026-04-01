import React, {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import {toast} from "react-toastify";
import api from "../config/api";
import {motion, AnimatePresence} from "framer-motion";

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

const MarathonRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showBackupQR, setShowBackupQR] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploadAbortController, setUploadAbortController] = useState(null);

  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .confirmation-modal-scroll::-webkit-scrollbar {
        width: 8px;
      }
      .confirmation-modal-scroll::-webkit-scrollbar-track {
        background: rgba(255, 139, 31, 0.1);
        border-radius: 10px;
      }
      .confirmation-modal-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #ff8b1f, #ea580c);
        border-radius: 10px;
      }
      .confirmation-modal-scroll::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #ea580c, #ff8b1f);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({top: 0, behavior: "smooth"});
  }, []);

  // Cleanup: Cancel any ongoing uploads when component unmounts
  useEffect(() => {
    return () => {
      if (uploadAbortController) {
        uploadAbortController.abort();
      }
    };
  }, [uploadAbortController]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    tshirtSize: "",
    college: "",
    emergencyContact: {
      name: "",
      phone: "",
    },
    medicalConditions: "",
    paymentScreenshotUrl: "",
  });

  // Fill test data function
  const fillTestData = () => {
    setFormData({
      fullName: "Test Runner",
      email: "testrunner@gmail.com",
      phone: "9876543210",
      age: "22",
      gender: "Male",
      tshirtSize: "L",
      college: "Test Engineering College",
      emergencyContact: {
        name: "Test Emergency Contact",
        phone: "9123456780",
      },
      medicalConditions: "None",
      paymentScreenshotUrl: formData.paymentScreenshotUrl, // Keep existing screenshot if any
    });
    toast.success("Test data filled!");
  };

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

      // Create abort controller for this upload
      const abortController = new AbortController();
      setUploadAbortController(abortController);

      const formDataToUpload = new FormData();
      formDataToUpload.append("screenshot", file);

      const response = await api.post(
        "/marathon/upload-payment-screenshot",
        formDataToUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          signal: abortController.signal,
        },
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
      // Don't show error if upload was cancelled
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        console.log("Upload cancelled by user");
        return;
      }

      console.error("Screenshot upload error:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload screenshot",
      );

      // Only clear states if upload failed (not if cancelled)
      setPaymentScreenshot(null);
      setScreenshotPreview(null);
    } finally {
      setIsUploadingScreenshot(false);
      setUploadAbortController(null);
    }
  };

  const handleRemoveScreenshot = () => {
    // Cancel ongoing upload if any
    if (uploadAbortController) {
      uploadAbortController.abort();
      setUploadAbortController(null);
      toast.dismiss(); // Dismiss any upload toast
      toast.info("Upload cancelled");
    }

    // Clear all screenshot-related states
    setPaymentScreenshot(null);
    setScreenshotPreview(null);
    setIsUploadingScreenshot(false);
    setFormData((prev) => ({
      ...prev,
      paymentScreenshotUrl: "",
    }));

    // Reset file input
    const fileInput = document.getElementById("payment-screenshot");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate payment screenshot is uploaded
    if (!formData.paymentScreenshotUrl) {
      toast.error("Please upload payment screenshot!");
      return;
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions to proceed!");
      return;
    }

    setLoading(true);

    try {
      // Prepare data with payment details
      const registrationData = {
        ...formData,
        paymentDetails: {
          amount: 99,
          paymentDate: new Date().toISOString(),
          paymentScreenshot: formData.paymentScreenshotUrl,
        },
      };

      const response = await api.post("/marathon/register", registrationData);

      if (response.data.success) {
        // Store registration details for confirmation screen
        setRegistrationDetails({
          registrationNumber: response.data.data.registrationNumber,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        });

        // Show confirmation screen
        setShowConfirmation(true);

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          age: "",
          gender: "",
          tshirtSize: "",
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
        setTermsAccepted(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0604] to-black">
      {/* Registration Confirmation Screen */}
      <AnimatePresence>
        {showConfirmation && registrationDetails && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            onClick={() => setShowConfirmation(false)}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{scale: 0.9, opacity: 0, y: 30}}
              animate={{scale: 1, opacity: 1, y: 0}}
              exit={{scale: 0.9, opacity: 0, y: 30}}
              transition={{type: "spring", damping: 25, stiffness: 300}}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto confirmation-modal-scroll"
              style={{
                background:
                  "linear-gradient(145deg, #1a0f08 0%, #0d0705 50%, #0a0604 100%)",
                border: "1px solid rgba(255, 139, 31, 0.3)",
                borderRadius: "24px",
                padding: "24px",
                boxShadow:
                  "0 25px 80px rgba(255, 139, 31, 0.15), 0 0 40px rgba(0, 0, 0, 0.5)",
              }}
            >
                {/* Success Icon */}
                <motion.div
                  initial={{scale: 0}}
                  animate={{scale: 1}}
                  transition={{delay: 0.2, type: "spring", stiffness: 200}}
                  className="flex justify-center mb-5"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
                      boxShadow: "0 8px 32px rgba(34, 197, 94, 0.4)",
                    }}
                  >
                    <motion.span
                      initial={{scale: 0}}
                      animate={{scale: 1}}
                      transition={{delay: 0.4}}
                      className="text-4xl text-white"
                    >
                      ✓
                    </motion.span>
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.3}}
                  className="text-center mb-5"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
                    Registration Successful! 🎉
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Thank you for registering for ZENITH Marathon 2026
                  </p>
                </motion.div>

                {/* Registration Details Card */}
                <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.4}}
                  className="rounded-xl p-4 mb-4"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(255, 139, 31, 0.2)",
                  }}
                >
                  <h3 className="text-base font-semibold text-[#ffb36a] mb-3 flex items-center gap-2">
                    <span>📋</span> Your Registration Details
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Registration No:</span>
                      <span className="text-[#ff8b1f] font-mono font-bold">
                        {registrationDetails.registrationNumber}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-semibold">
                        {registrationDetails.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Event:</span>
                      <span className="text-orange-400 font-semibold">
                        5K Marathon
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Amount Paid:</span>
                      <span className="text-green-400 font-bold">₹99</span>
                    </div>
                  </div>
                </motion.div>

                {/* Important Information */}
                <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.5}}
                  className="rounded-xl p-4 mb-4"
                  style={{
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <h3 className="text-blue-400 font-semibold mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                    <span>📧</span> What's Next?
                  </h3>
                  <ul className="space-y-1.5 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>Payment screenshot under verification.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>
                        Confirmation email will be sent to{" "}
                        <strong className="text-[#ff8b1f]">
                          {registrationDetails.email}
                        </strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>
                        Save your registration number & bring valid ID.
                      </span>
                    </li>
                  </ul>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.6}}
                  className="rounded-xl p-4 mb-4"
                  style={{
                    backgroundColor: "rgba(168, 85, 247, 0.1)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                  }}
                >
                  <h3 className="text-purple-400 font-semibold mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                    <span>📞</span> For Queries, Contact:
                  </h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">Sagar:</span>
                      <a
                        href="tel:+919545956689"
                        className="text-purple-300 hover:text-purple-200"
                      >
                        +91 9545956689
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">Atharva:</span>
                      <a
                        href="tel:+919123456789"
                        className="text-purple-300 hover:text-purple-200"
                      >
                        +91 9156906881
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* WhatsApp Group Section */}
                <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.65}}
                  className="rounded-xl p-4 mb-4"
                  style={{
                    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                    boxShadow: "0 8px 24px rgba(37, 211, 102, 0.3)",
                  }}
                >
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2 text-base">
                    <span>💬</span> Join Our WhatsApp Group!
                  </h3>
                  <p className="text-white/90 text-sm mb-3 leading-relaxed">
                    Stay connected with fellow runners! Get important updates, event details, and last-minute information.
                  </p>
                  <motion.a
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                    href="https://chat.whatsapp.com/GE7U4KE8M6o8yAfRaw7L8F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 text-center font-semibold rounded-lg transition-all text-sm"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#128C7E",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    📱 Join WhatsApp Group
                  </motion.a>
                </motion.div>

                {/* Team Page Link */}
                <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.7}}
                  className="rounded-xl p-3 mb-4 text-center"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 139, 31, 0.1), rgba(249, 115, 22, 0.1))",
                    border: "1px solid rgba(255, 139, 31, 0.3)",
                  }}
                >
                  <Link
                    to="/team"
                    className="inline-flex items-center gap-2 text-[#ff8b1f] hover:text-orange-400 transition-colors font-semibold text-sm"
                  >
                    <span>👥</span> Meet Our Team <span>→</span>
                  </Link>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.8}}
                  className="flex gap-3"
                >
                  <motion.button
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                    onClick={() => navigate("/marathon-event")}
                    className="flex-1 py-3 text-white font-semibold rounded-xl transition-all text-sm"
                    style={{
                      background: "linear-gradient(90deg, #ff8b1f, #ea580c)",
                      boxShadow: "0 8px 24px rgba(255, 139, 31, 0.3)",
                    }}
                  >
                    🏃 Marathon Page
                  </motion.button>
                  <motion.button
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                    onClick={() => navigate("/home")}
                    className="flex-1 py-3 font-semibold rounded-xl transition-all text-sm text-white"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    🏠 Home
                  </motion.button>
                </motion.div>

                {/* Footer */}
                <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  transition={{delay: 0.9}}
                  className="text-center mt-4 pt-4 border-t border-white/10"
                >
                  <p className="text-gray-500 text-xs">
                    Share your registration! 🎊 🏃‍♂️ 🏆
                  </p>
                </motion.div>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              Join us for an unforgettable running experience! • February 14,
              2026
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full">
              <span className="text-orange-400 font-semibold">5 KM Run</span>
              <span className="text-white/50">•</span>
              <span className="text-orange-400 font-bold text-lg">₹99</span>
            </div>
          </div>

          {/* Registration Closed Notice */}
          <motion.div
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            className="bg-gradient-to-br from-red-950/40 to-red-900/30 backdrop-blur-md rounded-2xl shadow-2xl p-8 border-2 border-red-600/40"
          >
            <div className="text-center space-y-6">
              <motion.div
                initial={{scale: 0}}
                animate={{scale: 1}}
                transition={{type: "spring", stiffness: 200}}
              >
                <p className="text-6xl mb-4">🚫</p>
              </motion.div>

              <div>
                <h2 className="text-4xl font-bold text-red-300 mb-3">
                  Marathon Not Happening This Year
                </h2>
                <p className="text-lg text-red-200 mb-4">
                  We regret to inform you that the ZENITH Marathon 2026 will not be held this year.
                </p>
                <p className="text-gray-300 mb-6">
                  Registration is currently closed. Thank you for your interest and support!
                </p>
              </div>

              {/* Contact Information */}
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3}}
                className="bg-black/30 rounded-lg p-6 border border-orange-500/20"
              >
                <h3 className="text-orange-400 font-semibold mb-3">For More Information</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-orange-400">📧</span>
                    <span>Check back for future events</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-orange-400">🔔</span>
                    <span>Follow us for announcements</span>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{scale: 1.02}}
                  whileTap={{scale: 0.98}}
                  onClick={() => navigate("/marathon-event")}
                  className="flex-1 py-3 text-white font-semibold rounded-lg transition-all"
                  style={{
                    background: "linear-gradient(90deg, #ff8b1f, #ea580c)",
                    boxShadow: "0 8px 24px rgba(255, 139, 31, 0.3)",
                  }}
                >
                  View Marathon Page
                </motion.button>
                <motion.button
                  whileHover={{scale: 1.02}}
                  whileTap={{scale: 0.98}}
                  onClick={() => navigate("/home")}
                  className="flex-1 py-3 font-semibold rounded-lg transition-all text-white"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  Back to Home
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarathonRegistration;
