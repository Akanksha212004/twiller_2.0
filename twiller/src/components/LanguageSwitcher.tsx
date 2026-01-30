"use client";

import { useState } from "react";
import { useLanguage, type Lang } from "../context/LanguageContext";
import axiosInstance from "../lib/axiosinstance";
import LanguageOTPModal from "./LanguageOTPModal";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "pt", label: "Portuguese" },
  { code: "zh", label: "Chinese" },
  { code: "fr", label: "French" },
];

export default function LanguageSwitcher() {
  // const { requestLanguageChange } = useLanguage();
  const [pendingLang, setPendingLang] = useState<Lang | null>(null);

  const handleChange = async (lang: Lang) => {
    if(!lang) return;

    // if (lang === "fr") {
    //   await axiosInstance.post("/api/lang/email-otp");
    //   alert("Email OTP sent");
    // } else {
    //   await axiosInstance.post("/api/lang/mobile-otp");
    //   alert("Mobile OTP sent");
    // }
    setPendingLang(lang);
  };

  return (
    <>
      <select
        className="bg-black text-white border border-gray-700 p-2 rounded"
        defaultValue=""
        onChange={(e) => handleChange(e.target.value as Lang)}
      >
        <option value="" disabled>
          Select Language
        </option>
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>

      {/* OTP MODAL */}
      {pendingLang && (
        <LanguageOTPModal
          lang={pendingLang}
          onClose={() => setPendingLang(null)}
        />
      )}
    </>
  );
}
