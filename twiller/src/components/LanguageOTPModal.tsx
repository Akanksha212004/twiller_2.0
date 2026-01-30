"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "../lib/axiosinstance";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageOTPModal({
  lang,
  onClose,
}: {
  lang: "en" | "hi" | "es" | "pt" | "zh" | "fr";
  onClose: () => void;
}) {
  const { confirmLanguageChange } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const isFrench = lang === "fr";

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden"; // stop scroll
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!mounted) return null;

  const sendOtp = async () => {
    if (!contact) {
      alert(isFrench ? "Enter email" : "Enter mobile number");
      return;
    }

    if (isFrench) {
      await axiosInstance.post("/auth/send-otp", { email: contact });
    } else {
      await axiosInstance.post("/api/lang/mobile-otp", { mobile: contact });
    }

    setOtpSent(true);
  };

  const verifyOtp = async () => {
    try {
      if (isFrench) {
        await axiosInstance.post("/auth/verify-otp", {
          email: contact,
          otp,
        });
      } else {
        await axiosInstance.post("/api/lang/verify-mobile-otp", {
          mobile: contact,
          otp,
        });
      }

      confirmLanguageChange(lang);
      onClose();
    } catch {
      alert("Invalid OTP");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded w-80 shadow-xl">
        <h2 className="text-white mb-4 text-lg text-center">
          {isFrench ? "Verify Email OTP" : "Verify Mobile OTP"}
        </h2>

        {!otpSent ? (
          <>
            <input
              className="w-full p-2 mb-3 bg-black border border-gray-700 text-white rounded"
              placeholder={isFrench ? "Enter email" : "Enter mobile number"}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              className="w-full p-2 mb-3 bg-black border border-gray-700 text-white rounded"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Verify & Switch Language
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
