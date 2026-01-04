import mongoose from "mongoose";

const womenTournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    selectedCategory: {
      type: String,
      required: true,
      enum: ["category1", "category2", "category3"],
    },
    selectedSports: [
      {
        type: String,
        required: true,
      },
    ],
    category3TeamName: {
      type: String,
      trim: true,
      // Only required if category3 sports are selected
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "not_required"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentScreenshot: {
      type: String,
      trim: true,
      // URL or path to the payment screenshot
    },
    notes: {
      type: String,
      trim: true,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
womenTournamentSchema.index({createdAt: -1});
womenTournamentSchema.index({status: 1});
womenTournamentSchema.index({registrationNumber: 1});
womenTournamentSchema.index({selectedCategory: 1});

// Virtual for formatted date
womenTournamentSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Virtual for calculating amount based on category
womenTournamentSchema.pre("save", function (next) {
  if (!this.totalAmount || this.totalAmount === 0) {
    const sportsCount = this.selectedSports.length;

    if (this.selectedCategory === "category1") {
      // Category 1: ₹49 unlimited pool
      this.totalAmount = 49;
    } else if (this.selectedCategory === "category2") {
      // Category 2: ₹49 per game
      this.totalAmount = 49 * sportsCount;
    } else if (this.selectedCategory === "category3") {
      // Category 3: ₹199 per team
      this.totalAmount = 199 * sportsCount;
    }
  }
  next();
});

const WomenTournament = mongoose.model(
  "WomenTournament",
  womenTournamentSchema
);

export default WomenTournament;
