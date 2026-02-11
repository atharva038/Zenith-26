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
      min: [1, "Age must be at least 1"],
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
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
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
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      try {
        // Use timestamp + random for better uniqueness
        const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
        
        // Find the highest existing registration number for this year
        const year = new Date().getFullYear();
        const yearPrefix = `MAR${year}`;
        
        const lastRegistration = await mongoose.models.Marathon
          .findOne({ registrationNumber: { $regex: `^${yearPrefix}` } })
          .sort({ registrationNumber: -1 })
          .select('registrationNumber')
          .lean();
        
        let sequence = 1;
        if (lastRegistration && lastRegistration.registrationNumber) {
          // Extract sequence number from the last registration
          const lastSeq = parseInt(lastRegistration.registrationNumber.substring(yearPrefix.length, yearPrefix.length + 4));
          sequence = lastSeq + 1;
        }
        
        // Format: MAR + Year + Sequence(4 digits) + Random(4 digits)
        const registrationNumber = `${yearPrefix}${String(sequence).padStart(4, "0")}${random}`;
        
        // Check if this number already exists
        const exists = await mongoose.models.Marathon.findOne({ registrationNumber });
        
        if (!exists) {
          this.registrationNumber = registrationNumber;
          break;
        }
        
        attempts++;
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error('Error generating registration number:', error);
        attempts++;
        if (attempts >= maxAttempts) {
          return next(new Error('Failed to generate unique registration number'));
        }
      }
    }
    
    if (!this.registrationNumber) {
      return next(new Error('Failed to generate unique registration number after multiple attempts'));
    }
  }
  next();
});

const Marathon = mongoose.model("Marathon", marathonSchema);

export default Marathon;
