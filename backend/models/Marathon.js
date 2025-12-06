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
    
    // Marathon Details
    category: {
      type: String,
      required: [true, "Marathon category is required"],
      enum: ["5K", "10K", "Half Marathon"],
      default: "5K",
    },
    
    // T-Shirt Size
    tshirtSize: {
      type: String,
      required: [true, "T-shirt size is required"],
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
    
    // Registration Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    
    // Payment Information (if applicable)
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    
    // Registration Number (auto-generated)
    registrationNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate registration number before saving
marathonSchema.pre("save", async function (next) {
  if (!this.registrationNumber) {
    const count = await mongoose.models.Marathon.countDocuments();
    this.registrationNumber = `MAR${new Date().getFullYear()}${String(
      count + 1
    ).padStart(4, "0")}`;
  }
  next();
});

const Marathon = mongoose.model("Marathon", marathonSchema);

export default Marathon;
