import mongoose from "mongoose";

const marathonSchema = new mongoose.Schema(
  {
    // Personal Information
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [16, "Minimum age is 16"],
      max: [100, "Maximum age is 100"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    
    // College/Organization Information
    college: {
      type: String,
      required: [true, "College/Organization name is required"],
      trim: true,
    },
    
    // T-Shirt Size (optional for backward compatibility)
    tshirtSize: {
      type: String,
      enum: ["S", "M", "L", "XL", "XXL"],
    },
    
    // Emergency Contact
    emergencyContact: {
      name: {
        type: String,
        required: [true, "Emergency contact name is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Emergency contact phone is required"],
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
      },
    },
    
    // Medical Information
    medicalConditions: {
      type: String,
      trim: true,
      default: "None",
    },
    
    // Registration Status (Single source of truth)
    // pending: User registered, waiting for admin approval
    // confirmed: Admin approved (payment verified)
    // cancelled: Registration rejected
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    
    // Payment Information (for reference only, status field is the source of truth)
    paymentDetails: {
      transactionId: {
        type: String,
        trim: true,
      },
      amount: {
        type: Number,
        default: 99,
      },
      paymentDate: {
        type: Date,
        default: Date.now,
      },
      paymentScreenshot: {
        type: String,
        trim: true,
      },
    },
    
    // Registration Number (auto-generated)
    registrationNumber: {
      type: String,
      unique: true,
    },
    
    // T-Shirt Distribution Tracking
    tshirtDistributed: {
      type: Boolean,
      default: false,
    },
    tshirtDistributedBy: {
      type: String,
      trim: true,
      default: null,
    },
    tshirtDistributedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Generate registration number before saving
marathonSchema.pre("save", async function (next) {
  if (!this.registrationNumber) {
    // Use a more robust approach with timestamp to reduce collisions
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const count = await mongoose.models.Marathon.countDocuments();
    
    // Format: MAR + Year + Count(4 digits) + Random(2 digits from timestamp)
    this.registrationNumber = `MAR${new Date().getFullYear()}${String(
      count + 1
    ).padStart(4, "0")}${timestamp.slice(-2)}`;
  }
  next();
});

const Marathon = mongoose.model("Marathon", marathonSchema);

export default Marathon;
