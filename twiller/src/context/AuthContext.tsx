"use client";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import axiosInstance from "../lib/axiosinstance";

interface User {
    subscription?: {
        plan: "free" | "bronze" | "silver" | "gold";
        tweetsRemaining: number;
    };
    notificationsEnabled?: boolean;
    _id: string;
    author: any;
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    bio?: string;
    joinedDate: string;
    email: string;
    website: string;
    location: string;
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    login: (email: string, password: string) => Promise<"OTP_REQUIRED" | "SUCCESS" | undefined>;
    signup: (email: string, password: string, username: string, displayName: string) => Promise<void>;
    updateProfile: (profileData: {
        displayName: string;
        bio: string;
        location: string;
        website: string;
        avatar: string;
    }) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    googlesignin: () => void;
    verifyOtp: (email: string, otp: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Persist login state
    useEffect(() => {
        const savedUser = localStorage.getItem("twitter-user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    /* ================= LOGIN ================= */
    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.post("/login", { email, password });

            if (res.data?.otpRequired) {
                console.log("OTP Required - Halting login flow");
                return "OTP_REQUIRED";
            }

            if (res.data?.user) {
                setUser(res.data.user);
                localStorage.setItem("twitter-user", JSON.stringify(res.data.user));
                return "SUCCESS";
            }
        } catch (err: any) {
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /* ================= SIGNUP ================= */
    const signup = async (email: string, password: string, username: string, displayName: string) => {
        try {
            setIsLoading(true);
            const newuser: any = {
                username,
                displayName,
                avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=" + username,
                email,
                password,
            };

            const res = await axiosInstance.post("/register", newuser);
            if (res.data) {
                setUser(res.data);
                localStorage.setItem("twitter-user", JSON.stringify(res.data));
                alert("Account created successfully!");
            }
        } catch (err: any) {
            const msg = err.response?.data?.includes("duplicate key") 
                ? "Email already registered." 
                : "Signup failed.";
            alert(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /* ================= OTP VERIFY ================= */
    const verifyOtp = async (email: string, otp: string) => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.post("/auth/verify-otp", { email, otp });

            if (res.data?.user) {
                setUser(res.data.user);
                localStorage.setItem("twitter-user", JSON.stringify(res.data.user));
                return true;
            }
            return false;
        } catch (err: any) {
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /* ================= LOGOUT ================= */
    const logout = async () => {
        setUser(null);
        await signOut(auth);
        localStorage.removeItem("twitter-user");
    };

    /* ================= UPDATE PROFILE ================= */
    const updateProfile = async (profileData: any) => {
        if (!user) return;
        try {
            setIsLoading(true);
            const updatedUser = { ...user, ...profileData };
            const res = await axiosInstance.patch(`/userupdate/${user.email}`, updatedUser);
            if (res.data) {
                setUser(updatedUser);
                localStorage.setItem("twitter-user", JSON.stringify(updatedUser));
            }
        } catch (err) {
            alert("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    /* ================= GOOGLE SIGN IN ================= */
    const googlesignin = async () => {
        try {
            setIsLoading(true);
            const googleauthprovider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, googleauthprovider);
            const firebaseuser = result.user;

            if (firebaseuser.email) {
                const res = await axiosInstance.get("/loggedinuser", {
                    params: { email: firebaseuser.email },
                });

                const finalUser = res.data || (await axiosInstance.post("/register", {
                    username: firebaseuser.email.split("@")[0],
                    displayName: firebaseuser.displayName || "User",
                    avatar: firebaseuser.photoURL || "",
                    email: firebaseuser.email,
                })).data;

                setUser(finalUser);
                localStorage.setItem("twitter-user", JSON.stringify(finalUser));
            }
        } catch (err) {
            alert("Google sign-in failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, updateProfile, logout, isLoading, googlesignin, verifyOtp }}>
            {children}
        </AuthContext.Provider>
    );
};