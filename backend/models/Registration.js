import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    formData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
    // Commonly used fields extracted for easy querying
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "waitlist"],
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "not_required"],
      default: "not_required",
    },
    paymentId: String,
    amount: {
      type: Number,
      default: 0,
    },
    // Document uploads
    documents: {
      permissionLetter: {
        type: String, // File path or URL
      },
      transactionReceipt: {
        type: String,
      },
      captainIdCard: {
        type: String,
      },
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },
    notes: String,
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Compound index for duplicate prevention
registrationSchema.index({eventId: 1, email: 1}, {unique: true});
registrationSchema.index({createdAt: -1});
registrationSchema.index({status: 1});

// Pre-save hook to generate registration number
registrationSchema.pre("save", async function (next) {
  if (!this.registrationNumber) {
    const count = await this.constructor.countDocuments({
      eventId: this.eventId,
    });
    const eventCode = this.eventName.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.registrationNumber = `${eventCode}-${timestamp}-${count + 1}`;
  }
  next();
});

// Static method for analytics
registrationSchema.statics.getEventAnalytics = async function (eventId) {
  const analytics = await this.aggregate([
    {$match: {eventId: new mongoose.Types.ObjectId(eventId)}},
    {
      $facet: {
        totalRegistrations: [{$count: "count"}],
        statusBreakdown: [{$group: {_id: "$status", count: {$sum: 1}}}],
        paymentBreakdown: [
          {
            $group: {
              _id: "$paymentStatus",
              count: {$sum: 1},
              total: {$sum: "$amount"},
            },
          },
        ],
        institutionBreakdown: [
          {$group: {_id: "$institution", count: {$sum: 1}}},
          {$sort: {count: -1}},
          {$limit: 10},
        ],
        cityBreakdown: [
          {$group: {_id: "$city", count: {$sum: 1}}},
          {$sort: {count: -1}},
          {$limit: 10},
        ],
        dailyTrend: [
          {
            $group: {
              _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
              count: {$sum: 1},
            },
          },
          {$sort: {_id: 1}},
        ],
      },
    },
  ]);

  return analytics[0];
};

// Static method for exporting data
registrationSchema.statics.getExportData = async function (
  eventId,
  filters = {}
) {
  const query = {eventId, ...filters};
  const registrations = await this.find(query)
    .select("-__v -userAgent -ipAddress")
    .sort({createdAt: -1})
    .lean();

  return registrations;
};

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;
