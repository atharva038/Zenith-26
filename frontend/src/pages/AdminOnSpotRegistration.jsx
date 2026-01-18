import {useState, useEffect, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {toast} from "react-toastify";
import api from "../config/api";
import AdminLayout from "../components/AdminLayout";
import {
  SackRaceIcon,
  ThreeLegRaceIcon,
  BalloonIcon,
  BrickIcon,
  MusicalChairIcon,
  LemonSpoonIcon,
  PowerliftingIcon,
  WeightliftingIcon,
  SkippingRopeIcon,
  BadmintonIcon,
  ChessIcon,
  CarromIcon,
  SprintIcon,
  ShotputIcon,
  DiscusIcon,
  JavelinIcon,
  HammerIcon,
  TugOfWarIcon,
  VolleyballIcon,
  CricketIcon,
  BasketballIcon,
  FootballIcon,
  BoxCricketIcon,
} from "../components/SportIcons";

const AdminOnSpotRegistration = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [showBackupQR, setShowBackupQR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("user"); // "user" for front, "environment" for back
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registrationNumber: "",
    mobileNumber: "",
    selectedCategory: "",
    selectedSports: [],
    category3TeamName: "",
    paymentScreenshotUrl: "",
  });

  const PAYMENT_QR_URL =
    "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:best/v1767592627/zenith-26/img/payment/payment-qr-sagar-ubale";

  const BACKUP_QR_CODES = [
    {
      name: "Balaji Anil Kalyankar (PhonePe)",
      upi: "balajianil.kalyankar@ybl",
      url: "/img/balajiQR.png",
    },
    {
      name: "Atharva Joshi (Bank of Baroda)",
      upi: "atharvsjoshi2005-1@okicici",
      url: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1768722815/zenith-26/img/payment/backup-qr-atharva-bob.png",
    },
  ];

  const sports = [
    // Category 1: 49/- (Unlimited Pool)
    {id: "sack-race", name: "Sack Race", icon: SackRaceIcon, category: "category1", fee: 49},
    {id: "3-leg-race", name: "3 Leg Race", icon: ThreeLegRaceIcon, category: "category1", fee: 49},
    {id: "balloon-bursting", name: "Balloon Bursting", icon: BalloonIcon, category: "category1", fee: 49},
    {id: "brick-race", name: "Brick Race", icon: BrickIcon, category: "category1", fee: 49},
    {id: "nimbu-chamach", name: "Nimbu Chamach", icon: LemonSpoonIcon, category: "category1", fee: 49},
    {id: "powerlifting", name: "Powerlifting", icon: PowerliftingIcon, category: "category1", fee: 49},
    {id: "weightlifting", name: "Weightlifting", icon: WeightliftingIcon, category: "category1", fee: 49},
    {id: "skipping-rope", name: "Skipping Rope", icon: SkippingRopeIcon, category: "category1", fee: 49},
    {id: "musical-chair", name: "Musical Chair", icon: MusicalChairIcon, category: "category1", fee: 49},
    // Category 2: 49/- Per Game
    {id: "badminton", name: "Badminton", icon: BadmintonIcon, category: "category2", fee: 49},
    {id: "chess", name: "Chess", icon: ChessIcon, category: "category2", fee: 49},
    {id: "carrom", name: "Carrom", icon: CarromIcon, category: "category2", fee: 49},
    {id: "100-meter", name: "100 Meter", icon: SprintIcon, category: "category2", fee: 49},
    {id: "shotput", name: "Shotput", icon: ShotputIcon, category: "category2", fee: 49},
    {id: "discus", name: "Discus", icon: DiscusIcon, category: "category2", fee: 49},
    {id: "javelin", name: "Javelin", icon: JavelinIcon, category: "category2", fee: 49},
    {id: "hammer", name: "Hammer Throw", icon: HammerIcon, category: "category2", fee: 49},
    // Category 3: 199/- Per Team
    {id: "tug-of-war", name: "Tug of War", icon: TugOfWarIcon, teamSize: 8, category: "category3", fee: 199},
    {id: "volleyball", name: "Volleyball", icon: VolleyballIcon, teamSize: 6, category: "category3", fee: 199},
    {id: "cricket", name: "Cricket", icon: CricketIcon, teamSize: 11, category: "category3", fee: 199},
    {id: "basketball-3x3", name: "Basketball 3x3", icon: BasketballIcon, teamSize: 3, category: "category3", fee: 199},
    {id: "rink-football", name: "Rink Football", icon: FootballIcon, teamSize: 5, category: "category3", fee: 199},
    {id: "box-cricket", name: "Box Cricket", icon: BoxCricketIcon, teamSize: 6, category: "category3", fee: 199},
  ];

  const calculateTotalAmount = () => {
    if (!formData.selectedCategory) return 0;
    if (formData.selectedCategory === "category1") {
      return formData.selectedSports.length > 0 ? 49 : 0;
    } else if (formData.selectedCategory === "category2") {
      return formData.selectedSports.length * 49;
    } else if (formData.selectedCategory === "category3") {
      return formData.selectedSports.length * 199;
    }
    return 0;
  };

  const startCamera = async () => {
    try {
      // Stop existing stream if any
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Try to get camera with high resolution for laptop/desktop
      const constraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: facingMode // Use state for dynamic camera switching
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error("Camera access error:", error);
      toast.error("Unable to access camera. Please check permissions and ensure you're on HTTPS.");
    }
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    
    // Stop current stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    
    try {
      // Get camera with new facing mode
      const constraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: newFacingMode
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setFacingMode(newFacingMode);
      toast.success(`Switched to ${newFacingMode === "user" ? "front" : "back"} camera`);
    } catch (error) {
      console.error("Camera switch error:", error);
      toast.error("Unable to switch camera. Please try again.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          toast.error("Failed to capture photo");
          return;
        }

        const file = new File([blob], "payment-screenshot.jpg", {
          type: "image/jpeg",
        });

        stopCamera();
        await uploadScreenshot(file);
      },
      "image/jpeg",
      0.95
    );
  };

  const uploadScreenshot = async (file) => {
    setPaymentScreenshot(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploadingScreenshot(true);
      const uploadToast = toast.loading("Uploading payment screenshot...");

      const formDataToUpload = new FormData();
      formDataToUpload.append("screenshot", file);

      const response = await api.post(
        "/women-tournament/upload-payment-screenshot",
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

  const handleScreenshotChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG) or PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    await uploadScreenshot(file);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.selectedCategory) {
      toast.error("Please select a tournament category");
      return;
    }

    if (formData.selectedSports.length === 0) {
      toast.error("Please select at least one sport");
      return;
    }

    if (formData.selectedCategory === "category3" && !formData.category3TeamName) {
      toast.error("Please provide a team name for Category 3 sports");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (paymentMethod === "online" && !formData.paymentScreenshotUrl) {
      toast.error("Please upload payment screenshot for online payment");
      return;
    }

    const totalAmount = calculateTotalAmount();

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting registration...");

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        registrationNumber: formData.registrationNumber,
        mobileNumber: formData.mobileNumber,
        selectedCategory: formData.selectedCategory,
        selectedSports: formData.selectedSports,
        category3TeamName: formData.category3TeamName || "",
        paymentMethod: paymentMethod,
        paymentScreenshot: paymentMethod === "online" ? formData.paymentScreenshotUrl : "",
        totalAmount: totalAmount,
        isOnSpot: true,
      };

      const response = await api.post("/women-tournament/register", registrationData);

      toast.dismiss(loadingToast);

      if (response.data.success) {
        toast.success("Registration submitted successfully!");

        setFormData({
          name: "",
          email: "",
          registrationNumber: "",
          mobileNumber: "",
          selectedCategory: "",
          selectedSports: [],
          category3TeamName: "",
          paymentScreenshotUrl: "",
        });
        setPaymentMethod("");
        setPaymentScreenshot(null);
        setScreenshotPreview(null);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.dismiss(loadingToast);

      const errorMessage = error.response?.data?.message || "Failed to submit registration. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (sportName) => {
    setFormData((prev) => {
      const currentSports = prev.selectedSports;

      if (currentSports.includes(sportName)) {
        return {
          ...prev,
          selectedSports: currentSports.filter((s) => s !== sportName),
        };
      } else {
        return {
          ...prev,
          selectedSports: [...currentSports, sportName],
        };
      }
    });
  };

  const handleRemoveScreenshot = () => {
    setPaymentScreenshot(null);
    setScreenshotPreview(null);
    setFormData((prev) => ({
      ...prev,
      paymentScreenshotUrl: "",
    }));
  };

  const handleChange = (e) => {
    const {name, value} = e.target;

    if (name === "selectedCategory") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        selectedSports: [],
        category3TeamName: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <AdminLayout title="On-Spot Registration">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl border border-neon-blue/20 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-neon-blue/20 to-electric-cyan/20 border-b border-neon-blue/30 p-6">
            <h2 className="text-3xl font-bold font-orbitron text-white mb-2">
              Women's Tournament Registration
            </h2>
            <p className="text-gray-300 font-rajdhani">
              Complete on-spot registration for participants
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-rajdhani font-semibold mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Participant's full name"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-white font-rajdhani font-semibold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                />
              </div>
            </div>

            {/* Registration Number & Mobile Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-rajdhani font-semibold mb-2">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                  placeholder="College registration number"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-white font-rajdhani font-semibold mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-white font-rajdhani font-semibold mb-2">
                Tournament Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.selectedCategory}
                onChange={handleChange}
                name="selectedCategory"
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
              >
                <option value="" className="bg-gray-900">
                  Choose a category
                </option>
                <option value="category1" className="bg-gray-900">
                  Category 1 - Individual Sports (₹49 Unlimited Pool)
                </option>
                <option value="category2" className="bg-gray-900">
                  Category 2 - Indoor Games (₹49 Per Game)
                </option>
                <option value="category3" className="bg-gray-900">
                  Category 3 - Team Events (₹199 Per Team)
                </option>
              </select>
            </div>

            {/* Sports Selection - Category 1 */}
            {formData.selectedCategory === "category1" && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h3 className="text-white font-rajdhani font-semibold text-lg mb-3">
                  Category 1 Sports (₹49 Unlimited Pool)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sports.filter((s) => s.category === "category1").map((sport) => (
                    <label
                      key={sport.id}
                      className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/10"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedSports.includes(sport.name)}
                        onChange={() => handleCheckboxChange(sport.name)}
                        className="w-4 h-4 text-yellow-500 border-white/20 rounded focus:ring-yellow-500 bg-black/40 flex-shrink-0"
                      />
                      <span className="text-gray-300 text-sm">{sport.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Sports Selection - Category 2 */}
            {formData.selectedCategory === "category2" && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-white font-rajdhani font-semibold text-lg mb-3">
                  Category 2 Sports (₹49 Per Game)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sports.filter((s) => s.category === "category2").map((sport) => (
                    <label
                      key={sport.id}
                      className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/10"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedSports.includes(sport.name)}
                        onChange={() => handleCheckboxChange(sport.name)}
                        className="w-4 h-4 text-blue-500 border-white/20 rounded focus:ring-blue-500 bg-black/40 flex-shrink-0"
                      />
                      <span className="text-gray-300 text-sm">{sport.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Sports Selection - Category 3 */}
            {formData.selectedCategory === "category3" && (
              <>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h3 className="text-white font-rajdhani font-semibold text-lg mb-3">
                    Category 3 Sports (₹199 Per Team)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sports.filter((s) => s.category === "category3").map((sport) => (
                      <label
                        key={sport.id}
                        className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/10"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedSports.includes(sport.name)}
                          onChange={() => handleCheckboxChange(sport.name)}
                          className="w-4 h-4 text-green-500 border-white/20 rounded focus:ring-green-500 bg-black/40 flex-shrink-0"
                        />
                        <span className="text-gray-300 text-sm">
                          {sport.name} ({sport.teamSize})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-rajdhani font-semibold mb-2">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="category3TeamName"
                    value={formData.category3TeamName}
                    onChange={handleChange}
                    required
                    placeholder="Enter team name"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                  />
                </div>
              </>
            )}

            {/* Total Amount */}
            {formData.selectedSports.length > 0 && (
              <div className="bg-gradient-to-r from-neon-blue/20 to-electric-cyan/20 border border-neon-blue/30 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-rajdhani font-semibold text-white">
                    Total Amount:
                  </span>
                  <span className="text-3xl font-bold font-orbitron text-neon-blue">
                    ₹{calculateTotalAmount()}
                  </span>
                </div>
              </div>
            )}

            {/* Payment Method */}
            {formData.selectedSports.length > 0 && (
              <div>
                <label className="block text-white font-rajdhani font-semibold mb-3">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-green-600"
                    />
                    <div>
                      <span className="text-white font-medium flex items-center gap-2">
                        💵 Cash Payment
                      </span>
                      <span className="text-xs text-gray-400">
                        Collect cash on-spot
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div>
                      <span className="text-white font-medium flex items-center gap-2">
                        📱 Online Payment (UPI)
                      </span>
                      <span className="text-xs text-gray-400">
                        Scan QR code to pay
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* QR Code Display for Online Payment */}
            {paymentMethod === "online" && (
              <motion.div
                initial={{opacity: 0, height: 0}}
                animate={{opacity: 1, height: "auto"}}
                className="space-y-4"
              >
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                  <div className="flex flex-col items-center text-center">
                    <p className="font-semibold text-yellow-400 mb-2 font-rajdhani text-lg">
                      📱 Scan QR Code to Pay
                    </p>
                    <p className="text-sm text-yellow-300 mb-4">
                      Amount: ₹{calculateTotalAmount()}
                    </p>
                    <div className="bg-white p-3 rounded-lg shadow-lg">
                      <img
                        src={PAYMENT_QR_URL}
                        alt="Payment QR Code"
                        className="w-56 h-auto"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Sagar Ubale - sagarubale2004@oksbi
                    </p>
                  </div>

                  {/* Backup QR Codes */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setShowBackupQR(!showBackupQR)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-lg text-yellow-300 font-medium transition-all"
                    >
                      <span>🔄</span>
                      <span>
                        {showBackupQR
                          ? "Hide Backup Options"
                          : "Show Backup Options"}
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
                          initial={{opacity: 0, height: 0}}
                          animate={{opacity: 1, height: "auto"}}
                          exit={{opacity: 0, height: 0}}
                          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          {BACKUP_QR_CODES.map((qr, index) => (
                            <div
                              key={index}
                              className="bg-white/5 border border-yellow-500/20 rounded-lg p-4"
                            >
                              <p className="text-yellow-300 font-medium mb-2 text-center text-sm">
                                {qr.name}
                              </p>
                              <div className="flex justify-center">
                                <div className="bg-white p-2 rounded-lg">
                                  <img
                                    src={qr.url}
                                    alt={`Backup QR ${index + 1}`}
                                    className="w-40 h-auto"
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 mt-2 text-center">
                                {qr.upi}
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Payment Screenshot Upload */}
                <div>
                  <label className="block text-white font-rajdhani font-semibold mb-3">
                    Upload Payment Screenshot{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  {!screenshotPreview ? (
                    <div className="space-y-3">
                      {/* Camera Capture Button */}
                      <button
                        type="button"
                        onClick={startCamera}
                        className="w-full py-4 bg-gradient-to-r from-neon-blue/20 to-electric-cyan/20 hover:from-neon-blue/30 hover:to-electric-cyan/30 border border-neon-blue/50 rounded-lg text-white font-rajdhani font-semibold transition-all flex items-center justify-center gap-2"
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
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        📷 Capture Payment Screenshot
                      </button>

                      <div className="text-center text-gray-400 text-sm">OR</div>

                      {/* File Upload */}
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,application/pdf"
                          onChange={handleScreenshotChange}
                          disabled={isUploadingScreenshot}
                          className="hidden"
                          id="screenshot-upload"
                        />
                        <label
                          htmlFor="screenshot-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                        >
                          <svg
                            className="w-10 h-10 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <span className="text-sm text-gray-400">
                            📁 Browse Files
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            JPG, PNG, or PDF (Max 10MB)
                          </span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {screenshotPreview === "PDF" ? (
                        <div className="flex items-center justify-between bg-white/5 border border-white/20 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <svg
                              className="w-10 h-10 text-red-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-white">PDF Uploaded</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveScreenshot}
                            className="text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={screenshotPreview}
                            alt="Payment Screenshot"
                            className="w-full max-h-64 object-contain rounded-lg border border-white/20"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveScreenshot}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || isUploadingScreenshot}
                className="w-full py-4 bg-gradient-to-r from-neon-blue to-electric-cyan hover:from-neon-blue/80 hover:to-electric-cyan/80 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold font-orbitron rounded-xl transition-all shadow-lg shadow-neon-blue/30 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
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
        </motion.div>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{scale: 0.9}}
              animate={{scale: 1}}
              exit={{scale: 0.9}}
              className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white font-rajdhani">
                  Capture Payment Screenshot
                </h3>
                <button
                  onClick={stopCamera}
                  className="text-gray-400 hover:text-white"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg mb-4"
              />
              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-3">
                <button
                  onClick={switchCamera}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold font-rajdhani rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Switch Camera
                </button>
                <button
                  onClick={capturePhoto}
                  className="flex-1 py-3 bg-gradient-to-r from-neon-blue to-electric-cyan hover:from-neon-blue/80 hover:to-electric-cyan/80 text-white font-bold font-rajdhani rounded-lg transition-all"
                >
                  📸 Capture Photo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminOnSpotRegistration;
