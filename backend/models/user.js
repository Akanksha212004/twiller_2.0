import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username: { type: String, required: true },
    displayName: { type: String, required: true },
    avatar: { type: String, default: "" },

    email: { type: String, required: true, unique: true },

    // AUTH RELATED
    password: { type: String },

    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },

    joinedDate: { type: Date, default: Date.now() },

    // Task 1
    notificationsEnabled: { 
        type: Boolean, 
        default: false 
    },

    // OTP SUPPORT
    otp: { type: String },
    otpExpiresAt: { type: Date },

    // TASK 3: FORGOT PASSWORD LIMIT
    lastForgotRequestDate: {
        type: String,
        default: null
    },

     subscription: {
    plan: {
      type: String,
      enum: ["free", "bronze", "silver", "gold"],
      default: "free",
    },
    tweetsRemaining: {
      type: Number,
      default: 1,
    },
  },

  // TASK 6: login verification
  loginHistory: [
    {
      browser: String,
      os: String,
      device: String,
      ipAddress: String,
      loginTime: { type: Date, default: Date.now }
    }
  ]
  
});

export default mongoose.model("User", UserSchema);
