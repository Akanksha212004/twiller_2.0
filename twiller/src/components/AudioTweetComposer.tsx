"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import axiosInstance from "../lib/axiosinstance";

const MAX_SIZE_MB = 100;
const MAX_DURATION_SEC = 300;

const AudioTweetComposer = () => {
  const { user } = useAuth();

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  if (!user) return null;

  /* ================= TIME CHECK ================= */
  const isWithinAllowedTime = () => {
    const hourIST = (new Date().getUTCHours() + 5) % 24;
    return hourIST >= 14 && hourIST <= 19;
  };

  /* ================= FILE HANDLER ================= */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setOtpSent(false);
    setOtpVerified(false);

    const file = e.target.files?.[0];
    if (!file) return;

    if (!isWithinAllowedTime()) {
      setError("Audio uploads allowed only between 2 PM – 7 PM IST");
      return;
    }

    if (file.size / (1024 * 1024) > MAX_SIZE_MB) {
      setError("Audio size must be ≤ 100MB");
      return;
    }

    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      if (audio.duration > MAX_DURATION_SEC) {
        setError("Audio duration must be ≤ 5 minutes");
        return;
      }
      setAudioFile(file);
    };
  };

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    try {
      await axiosInstance.post("/auth/send-otp", {
        email: user.email,
      });
      setOtpSent(true);
      alert("OTP sent to your email");
    } catch {
      setError("Failed to send OTP");
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    try {
      await axiosInstance.post("/auth/verify-otp", {
        email: user.email,
        otp: otpInput,
      });
      setOtpVerified(true);
      alert("OTP verified");
    } catch {
      setError("Invalid or expired OTP");
    }
  };

  /* ================= POST AUDIO ================= */
  const postAudioTweet = async () => {
    if (!audioFile || !otpVerified) return;

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("author", user._id);

    try {
      await axiosInstance.post("/post/audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Audio Tweet Posted");
      setAudioFile(null);
      setOtpInput("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch {
      setError("Audio upload failed");
    }
  };

  return (
    <Card className="bg-black border-gray-800 rounded-none">
      <CardContent className="pt-3 pb-2">
        <div className="flex space-x-3">
          {/* Avatar */}
          <Avatar className="h-12 w-12 mt-1">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.displayName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-400 text-sm mb-2">
              Upload Audio Tweet
            </h3>

            {/* File picker */}
            <label className="inline-block px-4 py-2 bg-gray-800 text-sm rounded-full cursor-pointer text-white">
              Choose audio
              <input
                type="file"
                accept="audio/*"
                hidden
                onChange={handleFileChange}
              />
            </label>

            {audioFile && (
              <p className="text-xs text-gray-400 mt-2">
                {audioFile.name}
              </p>
            )}

            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}

            {/* OTP actions */}
            {audioFile && !otpSent && (
              <button
                onClick={sendOtp}
                className="mt-3 text-blue-400 text-sm"
              >
                Send OTP
              </button>
            )}

            {otpSent && !otpVerified && (
              <div className="flex gap-2 mt-3">
                <input
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter OTP"
                  className="px-3 py-1 rounded bg-gray-900 border border-gray-700 text-sm"
                />
                <button
                  onClick={verifyOtp}
                  className="px-4 py-1 rounded-full bg-green-500 text-black text-sm"
                >
                  Verify
                </button>
              </div>
            )}

            {otpVerified && (
              <p className="text-green-400 text-sm mt-2">
                OTP verified ✔
              </p>
            )}

            {/* FOOTER — EXACT SAME AS TEXT TWEET */}
            <div className="mt-2 flex items-center justify-between">
              <div /> {/* empty left side (same spacing) */}

              <Button
                onClick={postAudioTweet}
                disabled={!audioFile || !otpVerified}
                className="bg-blue-500 hover:bg-blue-600 rounded-full px-6"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioTweetComposer;
