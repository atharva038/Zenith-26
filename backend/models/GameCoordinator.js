import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const gameCoordinatorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    // Sports they are responsible for
    assignedSports: [
      {
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
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
gameCoordinatorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
gameCoordinatorSchema.methods.comparePassword = async function (
  candidatePassword,
) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Don't return password in JSON
gameCoordinatorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const GameCoordinator = mongoose.model(
  "GameCoordinator",
  gameCoordinatorSchema,
);

export default GameCoordinator;
