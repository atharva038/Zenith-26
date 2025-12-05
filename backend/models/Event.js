import mongoose from "mongoose";

const customFieldSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  fieldType: {
    type: String,
    enum: [
      "text",
      "email",
      "tel",
      "number",
      "textarea",
      "select",
      "radio",
      "checkbox",
      "date",
    ],
    required: true,
  },
  fieldName: {
    type: String,
    required: true,
  },
  placeholder: String,
  required: {
    type: Boolean,
    default: false,
  },
  options: [String], // For select, radio, checkbox
  validation: {
    pattern: String,
    minLength: Number,
    maxLength: Number,
    min: Number,
    max: Number,
  },
});

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    category: {
      type: String,
      enum: [
        "Cricket",
        "Football",
        "Basketball",
        "Volleyball",
        "Badminton",
        "Table Tennis",
        "Chess",
        "Carrom",
        "Athletics",
        "Swimming",
        "Kabaddi",
        "Kho-Kho",
        "Hockey",
        "Lawn Tennis",
        "Squash",
      ],
      required: true,
    },
    customFields: [customFieldSchema],
    registrationDeadline: {
      type: Date,
      required: true,
    },
    eventDate: {
      type: Date,
    },
    venue: String,
    maxParticipants: {
      type: Number,
      default: null, // null means unlimited
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
      default: null,
    },
    organizerName: String,
    organizerEmail: String,
    organizerPhone: String,
    // Multiple coordinators support
    coordinators: [
      {
        name: String,
        email: String,
        phone: String,
      },
    ],
    rules: [String],
    prizes: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
eventSchema.index({name: "text", description: "text"});
eventSchema.index({isActive: 1, isPublished: 1});
eventSchema.index({registrationDeadline: 1});
eventSchema.index({category: 1});

// Virtual for registration count
eventSchema.virtual("registrationCount", {
  ref: "Registration",
  localField: "_id",
  foreignField: "eventId",
  count: true,
});

// Check if registration is open
eventSchema.methods.isRegistrationOpen = function () {
  if (!this.isActive || !this.isPublished) return false;
  if (new Date() > this.registrationDeadline) return false;
  return true;
};

// Check if event is full
eventSchema.methods.isFull = async function () {
  if (!this.maxParticipants) return false;
  const Registration = mongoose.model("Registration");
  const count = await Registration.countDocuments({
    eventId: this._id,
    status: {$in: ["confirmed", "pending"]},
  });
  return count >= this.maxParticipants;
};

const Event = mongoose.model("Event", eventSchema);

export default Event;
