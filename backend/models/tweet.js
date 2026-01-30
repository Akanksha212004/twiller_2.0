import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  content: {
    type: String,
    default: "",   // ❗ required hata diya
  },

  audioUrl: {
    type: String,
    default: null,
  },

  image: {
    type: String,
    default: null,
  },

  likes: {
    type: Number,
    default: 0,
  },

  retweets: {
    type: Number,
    default: 0,
  },

  comments: {
    type: Number,
    default: 0,
  },

  likedBy: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  retweetedBy: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Tweet", TweetSchema);
