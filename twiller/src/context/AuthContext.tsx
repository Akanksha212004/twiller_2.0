"use client"

import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import axiosInstance from "../lib/axiosinstance";

interface User {
    notificationsEnabled: undefined;
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
    login: (email: string, password: string) => Promise<void>;
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
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const unsubscribe = onAuthStateChanged(auth, async (firebaseuser) => {
            if (firebaseuser?.email) {
                try {
                    const res = await axiosInstance.get('/loggedinuser', {
                        params: { email: firebaseuser.email }
                    });

                    if (res.data) {
                        setUser(res.data);
                        localStorage.setItem("twitter-user", JSON.stringify(res.data));
                    }
                } catch (err) {
                    console.log("Failed to fetch user:", err);
                    // logout();
                }
            } else {
                setUser(null);
                localStorage.removeItem("twitter-user");
            }
            setIsLoading(false);
        });
        return () => unsubscribe()
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        // Mock authentication - in real app, this would call an API
        const usercred = await signInWithEmailAndPassword(auth, email, password);
        const firebaseuser = usercred.user;
        const res = await axiosInstance.get("/loggedinuser", {
            params: { email: firebaseuser.email },
        });
        if (res.data) {
            setUser(res.data);
            localStorage.setItem("twitter-user", JSON.stringify(res.data));
        }
        // const mockUser: User = {
        //     id: "1",
        //     username: "johndoe",
        //     displayName: "John Doe",
        //     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //     bio: "Software developer passionate about building great products",
        //     joinedDate: "April 2024",
        //     author: undefined
        // };
        setIsLoading(false);
    };

    const signup = async (
        email: string,
        password: string,
        username: string,
        displayName: string
    ) => {
        setIsLoading(true);
        // Mock authentication - in real app, this would call an API
        const usercred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = usercred.user;
        const newuser: any = {
            username,
            displayName,
            avatar: user.photoURL || "",
            email: user.email,
        };
        const res = await axiosInstance.post('/register', newuser);
        if (res.data) {
            setUser(res.data);
            localStorage.setItem("twitter-user", JSON.stringify(res.data));
        }
        // const mockUser: User = {
        //     id: "1",
        //     username: username,
        //     displayName: displayName,
        //     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //     bio: "Software developer passionate about building great products",
        //     joinedDate: "April 2024",
        //     author: undefined
        // };
        setIsLoading(false);
    };

    const logout = async () => {
        setUser(null);
        await signOut(auth);
        localStorage.removeItem("twitter-user");
    };
    const updateProfile = async (
        profileData: {
            displayName: string;
            bio: string;
            location: string;
            website: string;
            avatar: string;
        }
    ) => {
        if (!user) return;
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedUser: User = {
            ...user,
            ...profileData,
        };
        const res = await axiosInstance.patch(
            `/userupdate/${user.email}`,
            updatedUser
        );
        if (res.data) {
            setUser(updatedUser);
            localStorage.setItem("twitter-user", JSON.stringify(updatedUser));
        }
        setIsLoading(false);
    };

    const googlesignin = async () => {
        setIsLoading(true)
        const googleauthprovider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, googleauthprovider);
        
        const firebaseuser = result.user;
        console.log("Google User:", firebaseuser);

        if (firebaseuser.email) {
            const res = await axiosInstance.get("/loggedinuser", {
                params: { email: firebaseuser.email },
            });
            if (res.data) {
                setUser(res.data);
                localStorage.setItem("twitter-user", JSON.stringify(res.data));
            } else {
                const newuser: any = {
                    username: firebaseuser.email.split('@')[0],
                    displayName: firebaseuser.displayName || "User",
                    avatar: firebaseuser.photoURL || "",
                    email: firebaseuser.email,
                };
                const res = await axiosInstance.post('/register', newuser);
                console.log("Saved to DB:", res.data);
                if (res.data) {
                    setUser(res.data);
                    console.log("State setUser:", res.data);
                    localStorage.setItem("twitter-user", JSON.stringify(res.data));
                    console.log("LocalUser:", JSON.parse(localStorage.getItem("twitter-user")!));
                }
            }
        }
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                updateProfile,
                logout,
                isLoading,
                googlesignin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};