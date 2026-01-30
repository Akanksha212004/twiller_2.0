import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import bcrypt from "bcryptjs";
import { sendMail } from "./utils/mailer.js";

import generatePassword from "./utils/passwordGenerator.js";
import User from "./models/user.js";
import Tweet from "./models/tweet.js";

/* ================= ENV CONFIG ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("EMAIL_USER or EMAIL_PASS missing in .env");
}

const otpStore = new Map();
const mobileOtpStore = new Map();

const detectDeviceInfo = (userAgent) => {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  // Browser detection
  if (userAgent.includes("Edg")) browser = "Microsoft Edge";
  else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) browser = "Google Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";

  // OS detection
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "MacOS";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iPhone")) os = "iOS";

  // Device detection
  if (userAgent.includes("Android") || userAgent.includes("iPhone")) {
    device = "Mobile";
  }

  return { browser, os, device };
};

/* ================= PAYMENT TIME CHECK ================= */
const isPaymentAllowed = () => {
  const ist = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const hour = ist.getHours();
  return hour >= 10 && hour < 11;
};

/* ================= APP SETUP ================= */
const app = express();
// app.use(cors());
app.use(cors({
  origin: "http://localhost:3000", // Aapke frontend ka address
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= DB CONNECTION ================= */
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running")
    );
  })
  .catch(console.error);

/* ================= MULTER ================= */
const audioDir = path.join(__dirname, "uploads/audio");
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, audioDir),
    filename: (_, file, cb) =>
      cb(null, Date.now() + "-" + file.originalname),
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});

// /* ================= MAIL ================= */
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

/* ================= AUTH ================= */
// app.post("/register", async (req, res) => {
//   try {
//     const user = new User({
//       ...req.body,
//       subscription: {
//         plan: "free",
//         tweetsRemaining: 1,
//       },
//     });

//     await user.save();
//     res.json(user);

//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: "User already exists or invalid data" });
//   }
// });

/* ================= REGISTER ROUTE UPDATE ================= */
app.post("/register", async (req, res) => {
  try {
    const { email, password, username, displayName } = req.body;
    
    // 1. Password ko hash karein save karne se pehle
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: email.toLowerCase(), // Lowercase email
      password: hashedPassword,   // Hashed password
      username,
      displayName,
      subscription: { plan: "free", tweetsRemaining: 1 },
    });

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "User already exists or invalid data" });
  }
});

app.get("/loggedinuser", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  if (!user) return res.json(null);

  if (!user.subscription) {
    user.subscription = { plan: "free", tweetsRemaining: 1 };
    await user.save();
  }

  res.json(user);
});

/* ================= PROFILE ================= */
app.patch("/userupdate/:email", async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.params.email },
    req.body,
    { new: true }
  );
  res.json(user);
});

/* ================= TWEETS ================= */
app.post("/post", async (req, res) => {
  try {
    const user = await User.findById(req.body.author);
    if (!user.subscription) {
      user.subscription = {
        plan: "free",
        tweetsRemaining: 1,
      };
      await user.save();
    }

    if (user.subscription.plan !== "gold" &&
        user.subscription.tweetsRemaining <= 0) {
      return res.status(403).json({
        message: "Tweet limit reached. Please upgrade your plan.",
      });
    }

    const tweet = new Tweet({
      ...req.body,
      type: "text",
      timestamp: new Date(),
    });

    await tweet.save();

    if (user.subscription.plan !== "gold") {
      user.subscription.tweetsRemaining -= 1;
      await user.save();
    }

    const populatedTweet = await Tweet.findById(tweet._id).populate("author");
    res.status(201).json(populatedTweet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/post/audio", upload.single("audio"), async (req, res) => {
  const user = await User.findById(req.body.author);

  if (!user.subscription) {
    user.subscription = { plan: "free", tweetsRemaining: 1 };
    await user.save();
  }

  if (user.subscription.plan !== "gold" &&
      user.subscription.tweetsRemaining <= 0) {
    return res.status(403).json({
      message: "Tweet limit reached. Please upgrade your plan.",
    });
  }

  const tweet = new Tweet({
    author: req.body.author,
    content: "Audio Tweet",
    audioUrl: `/uploads/audio/${req.file.filename}`,
    type: "audio",
    timestamp: new Date(),
  });

  await tweet.save();

  if (user.subscription.plan !== "gold") {
    user.subscription.tweetsRemaining -= 1;
    await user.save();
  }

  res.json(await tweet.populate("author"));
});

/* ================= OTP & PASSWORD ================= */
app.post("/auth/send-otp", async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(req.body.email, otp);

  await sendMail({
  // from: `"Twiller" <${process.env.EMAIL_USER}>`,
  to: req.body.email,
  subject: "Login OTP Verification",
  html: `<h2>Your Login OTP: ${otp}</h2>`,
});
  res.json({ success: true });
});

app.post("/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (otpStore.get(email) !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  otpStore.delete(email);
  const user = await User.findOne({ email });

  const userAgent = req.headers["user-agent"] || "";
  const { browser, os, device } = detectDeviceInfo(userAgent);
  const ipAddress =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // SAVE LOGIN HISTORY AFTER OTP SUCCESS
  user.loginHistory.push({
    browser,
    os,
    device,
    ipAddress,
  });

  await user.save();

  res.json({
    success: true,
    message: "OTP verified, login successful",
    user,
    loginCompleted: true,
  });
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const pwd = generatePassword();
  user.password = await bcrypt.hash(pwd, 10);
  await user.save();

  await sendMail({
  from: `"Twiller" <${process.env.EMAIL_USER}>`,
  to: user.email,
  subject: "Password Reset",
  html: `<h3>${pwd}</h3>`,
});

  res.json({ message: "Password sent" });
});

/* ================= NOTIFICATIONS ================= */
app.put("/api/user/notification", async (req, res) => {
  await User.findByIdAndUpdate(req.body.userId, {
    notificationsEnabled: req.body.enabled,
  });
  res.json({ success: true });
});

/* ================= SUBSCRIPTIONS (TASK-4) ================= */
app.post("/api/subscribe", async (req, res) => {
  const { userId, plan } = req.body;

  if (plan === "free") {
    return res.status(400).json({
      message: "Free plan does not require payment",
    });
  }

  if (!isPaymentAllowed()) {
    return res.status(403).json({
      message: "Payments allowed only between 10-11 AM IST",
    });
  }

  const tweetLimits = {
    bronze: 3,
    silver: 5,
    gold: Infinity,
  };

  const prices = {
    bronze: 100,
    silver: 300,
    gold: 1000,
  };

  await User.findByIdAndUpdate(userId, {
    subscription: {
      plan,
      tweetsRemaining: tweetLimits[plan],
    },
  });

  const user = await User.findById(userId);

  await sendMail({
  from: `"Twiller" <${process.env.EMAIL_USER}>`,
  to: user.email,
  subject: "Subscription Invoice",
  html: `
    <h2>Plan: ${plan.toUpperCase()}</h2>
    <p>Amount: ₹${prices[plan]}</p>
    <p>Tweets: ${
      tweetLimits[plan] === Infinity ? "Unlimited" : tweetLimits[plan]
    }</p>
  `,
});

  res.json({ success: true });
});

app.get("/post", async (_, res) => {
  const tweets = await Tweet.find()
    .sort({ timestamp: -1 })
    .populate("author");
  res.json(tweets);
});

// French → Email OTP
app.post("/api/lang/email-otp", async (req, res) => {
  console.log("EMAIL OTP SENT (French)");
  res.json({ success: true });
});

// Other → Mobile OTP
app.post("/api/lang/mobile-otp", (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: "Mobile number required" });
  }

  const otp = "123456"; // sample OTP
  mobileOtpStore.set(mobile, otp);

  console.log(`Mobile OTP for ${mobile}: ${otp}`);

  res.json({
    success: true,
    message: "Mobile OTP sent (sample)",
  });
});

app.get("/", (req, res) => {
  res.send("Twiller backend is running");
});

app.post("/api/lang/verify-mobile-otp", (req, res) => {
  const { mobile, otp } = req.body;

  if (mobileOtpStore.get(mobile) === otp) {
    mobileOtpStore.delete(mobile);
    return res.json({ success: true });
  }

  res.status(400).json({ message: "Invalid OTP" });
});


app.post("/login", async (req, res) => {
  try {
    const email = req.body.email.toLowerCase(); 
    const { password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ===== DEVICE & BROWSER DETECTION =====
    const userAgent = req.headers["user-agent"] || "";
    const { browser, os, device } = detectDeviceInfo(userAgent);
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // ===== RULE 3: MOBILE TIME RESTRICTION =====
    if (device === "Mobile") {
      const ist = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      const hour = ist.getHours();

      if (hour < 10 || hour >= 13) {
        return res.status(403).json({
          message: "Mobile login allowed only between 10 AM and 1 PM",
        });
      }
    }

    // ===== RULE 1: CHROME → EMAIL OTP REQUIRED =====
    if (browser === "Google Chrome") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(email, otp);

      try {
        await sendMail({
          from: `"Twiller" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Login OTP Verification",
          html: `<h2>Your Login OTP: ${otp}</h2>`
        });
      } catch (e) {
        console.error("OTP email failed:", e.message);
        return res.status(500).json({ error: "OTP email failed" });
      }
      return res.json({
        otpRequired: true,
        message: "OTP sent to email for Chrome login",
      });
    }

    // ===== RULE 2: EDGE → DIRECT LOGIN (NO OTP) =====
    // Normal login allowed

    // ===== SAVE LOGIN HISTORY =====
    user.loginHistory.push({
      browser,
      os,
      device,
      ipAddress,
    });

    await user.save();

    res.json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/user/login-history", async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user.loginHistory);
});
