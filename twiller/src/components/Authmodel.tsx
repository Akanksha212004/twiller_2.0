"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Eye, EyeOff, Mail, User, X, Lock } from "lucide-react";
import TwitterLogo from "./Twitterlogo";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { LoadingSpinner } from "./loading-spinner";
import { Separator } from "./ui/separator";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

const Authmodel = ({ isopen, onclose, initialmode = "login" }: any) => {
  const [mode, setMode] = useState<"login" | "signup">(initialmode);
  const { login, signup, verifyOtp, isLoading } = useAuth();
  const [showpassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    displayName: "",
  });

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<any>({});

  // Reset state when modal opens or initial mode changes
  useEffect(() => {
    if (isopen) {
      setMode(initialmode);
      setError({});
      setShowOtpInput(false);
      setOtp("");
      setFormData({
        email: "",
        password: "",
        username: "",
        displayName: "",
      });
    }
  }, [initialmode, isopen]);

  if (!isopen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (mode === "signup") {
      if (!formData.displayName.trim()) {
        newErrors.displayName = "Display name is required";
      }
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputchange = (field: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    if (error[field]) {
      const copy: any = { ...error };
      delete copy[field];
      setError(copy);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError({});
    setShowOtpInput(false);
    setOtp("");
    setFormData({
      email: "",
      password: "",
      username: "",
      displayName: "",
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showOtpInput) return; // Prevent closing during OTP verification
    if (e.target === e.currentTarget) {
      onclose();
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim() || otp.length < 6) {
      setError({ general: "Please enter the 6-digit code." });
      return;
    }

    try {
      setError({});
      const success = await verifyOtp(formData.email, otp);
      if (success) {
        setShowOtpInput(false);
        setOtp("");
        onclose();
      }
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      const errorMessage = err.response?.data?.message || "Invalid OTP. Please try again.";
      setError({ general: errorMessage });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showOtpInput) {
      handleOtpSubmit();
      return;
    }

    if (!validateForm()) return;
    setError({});

    try {
      if (mode === "login") {
        const result = await login(formData.email, formData.password);
        console.log("Login Result: ", result);

        if (result === "OTP_REQUIRED") {
          setShowOtpInput(true);
        } else if (result === "SUCCESS") {
          onclose();
        }
      } else {
        await signup(
          formData.email,
          formData.password,
          formData.username,
          formData.displayName
        );
        onclose();
      }
    } catch (err: any) {
      setError({ general: err.response?.data?.message || "Authentication Failed." });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md bg-black border-gray-800 text-white">
        <CardHeader className="relative pb-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white hover:bg-gray-900"
            onClick={onclose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <TwitterLogo size="xl" className="text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {showOtpInput ? "Verify your email" : (mode === "login" ? "Sign in to X" : "Create your account")}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error.general && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm animate-in fade-in">
              {error.general}
            </div>
          )}

          <div key={showOtpInput ? "otp-active" : "auth-active"} className="transition-all duration-300">
            {showOtpInput ? (
              /* ================= OTP INTERFACE ================= */
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-white text-sm font-medium">
                    Enter Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="6-digit code"
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-transparent border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 h-12 text-center text-xl tracking-widest"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleOtpSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-full transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner /> : "Verify and Log In"}
                </Button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  A code has been sent to <span className="text-white font-semibold">{formData.email}</span>
                  <br />
                  <button
                    type="button"
                    className="text-blue-400 mt-2 hover:underline font-medium"
                    onClick={() => setShowOtpInput(false)}
                  >
                    Wrong email? Go back
                  </button>
                </p>
              </div>
            ) : (
              /* ================= LOGIN/SIGNUP FORM ================= */
              <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-500">
                {mode === "signup" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Display Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          placeholder="John Doe"
                          value={formData.displayName}
                          onChange={(e) => handleInputchange("displayName", e.target.value)}
                          className="pl-10 bg-transparent border-gray-600 text-white"
                        />
                      </div>
                      {error.displayName && <p className="text-red-400 text-xs">{error.displayName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Username</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                        <Input
                          placeholder="username"
                          value={formData.username}
                          onChange={(e) => handleInputchange("username", e.target.value)}
                          className="pl-8 bg-transparent border-gray-600 text-white"
                        />
                      </div>
                      {error.username && <p className="text-red-400 text-xs">{error.username}</p>}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputchange("email", e.target.value)}
                      className="pl-10 bg-transparent border-gray-600 text-white"
                    />
                  </div>
                  {error.email && <p className="text-red-400 text-xs">{error.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type={showpassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputchange("password", e.target.value)}
                      className="pl-10 pr-10 bg-transparent border-gray-600 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showpassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showpassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {error.password && <p className="text-red-400 text-xs">{error.password}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 rounded-full text-lg mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner /> <span>Processing...</span>
                    </div>
                  ) : (
                    mode === "login" ? "Log in" : "Create account"
                  )}
                </Button>

                {mode === "login" && (
                  <div className="text-right">
                    <Link href="/forgot-password" core-link="true" className="text-sm text-blue-400 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                )}
              </form>
            )}
          </div>

          {!showOtpInput && (
            <>
              <div className="relative my-4">
                <Separator className="bg-gray-700" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2 text-gray-500 text-xs">
                  OR
                </span>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={switchMode}
                    className="text-blue-400 hover:text-blue-300 font-bold ml-1"
                  >
                    {mode === "login" ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Authmodel;