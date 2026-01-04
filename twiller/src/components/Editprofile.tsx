"use client";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Camera, LinkIcon, MapPin, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

interface EditProfileProps {
    isOpen: boolean;
    onClose: () => void;
}

const Editprofile = ({ isOpen, onClose }: EditProfileProps) => {
    const { user, updateProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || "",
        bio: user?.bio || "",
        location: "Earth",
        website: "example.com",
        avatar: user?.avatar || ""
    });

    const [error, setError] = useState<Record<string, string>>({});


    if (!user || !isOpen) return null;

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.displayName.trim()) {
            errors.displayName = "Display name is required";
        } else if (formData.displayName.length > 50) {
            errors.displayName = "Display name must be 50 characters or less";
        }

        if (formData.bio.length > 160) {
            errors.bio = "Bio must be 160 characters or less";
        }

        if (formData.location.length > 30) {
            errors.location = "Location must be 30 characters or less";
        }

        if (formData.website.length > 100) {
            errors.website = "Website must be 100 characters or less";
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || isLoading) return;

        setIsLoading(true);
        try {
            await updateProfile(formData);
            onClose();
        } catch {
            setError({ general: "Failed to update profile. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error[field]) {
            setError((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(`Upload ${type} photo`);
        if (!e.target.files || e.target.files.length === 0) return;
        setIsLoading(true);
        const image = e.target.files[0];
        const formdataimg = new FormData();
        formdataimg.set("image", image);
        try {
            const res = await axios.post(
                "https://api.imgbb.com/1/upload?key=10d33391a97c61e340db32c3f12628a5", 
                formdataimg
            );
            const url = res.data.data.display_url;
            if (url) {
                setFormData((prev) => ({ ...prev, avatar: url }));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto">
            <div className="mt-10 w-full max-w-xl">
                <Card className="w-full max-w-xl bg-black text-white border border-gray-800">
                    <CardHeader className="flex flex-row justify-between items-center bg-black border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-4 w-4 text-white" />
                            </Button>
                            <CardTitle className="text-white">Edit Profile</CardTitle>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            onClick={handleSubmit}
                            className="rounded-full bg-white text-black"
                        >
                            Save
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {error.general && (
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm m-4">
                                {error.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Cover Photo */}
                            <div className="relative">
                                <div className="relative h-32 bg-gray-800 rounded">
                                    <Button
                                        type="button"
                                        size="icon"
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    // onClick={() => handlePhotoUpload("cover")}
                                    >
                                        <Camera />
                                    </Button>
                                </div>

                                {/* Profile Picture */}
                                <div className="absolute -bottom-16 left-4 cursor-pointer">
                                    <Avatar className="h-28 w-28 border-4 border-black group">
                                        <AvatarImage src={formData.avatar || user.avatar} alt={user?.displayName} />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-full transition" />
                                        <AvatarFallback className="text-2xl">
                                            {user?.displayName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="avatarUpload"
                                        className="hidden"
                                        onChange={handlePhotoUpload}
                                    />

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute bottom-1 right-1 p-2 rounded-full bg-black/70 hover:bg-black/90"
                                        disabled={isLoading}
                                        onClick={() =>
                                            document.getElementById("avatarUpload")?.click()
                                        }
                                    >
                                        <Camera className="h-5 w-5 text-white" />
                                    </Button>
                                </div>
                            </div>
                            {/* </div> */}

                            {/* Name */}
                            <div className="pt-20 px-4 space-y-1">
                                <Label>Name</Label>
                                <Input
                                    value={formData.displayName}
                                    maxLength={50}
                                    onChange={(e) =>
                                        handleInputChange("displayName", e.target.value)
                                    }
                                />
                                <div className="flex justify-between text-sm">
                                    {error.displayName && (
                                        <p className="text-red-400">{error.displayName}</p>
                                    )}
                                    <p className="text-gray-400 ml-auto">
                                        {formData.displayName.length}/50
                                    </p>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-1">
                                <Label>Bio</Label>
                                <Textarea
                                    value={formData.bio}
                                    maxLength={160}
                                    onChange={(e) =>
                                        handleInputChange("bio", e.target.value)
                                    }
                                />
                                <div className="flex justify-between text-sm">
                                    {error.bio && (
                                        <p className="text-red-400">{error.bio}</p>
                                    )}
                                    <p className="text-gray-400 ml-auto">
                                        {formData.bio.length}/160
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-1">
                                <Label htmlFor="location" className="text-white">
                                    Location
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        id="location"
                                        type="text"
                                        value={formData.location}
                                        maxLength={30}
                                        onChange={(e) =>
                                            handleInputChange("location", e.target.value)
                                        }
                                        className="pl-10 bg-transparent border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                        placeholder="Where are you loacted?"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="flex justify-between text-sm">
                                    {error.loaction && (
                                        <p className="text-red-400">{error.location}</p>
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm ml-auto">
                                    {formData.location.length}/30
                                </p>
                            </div>

                            {/* Website */}
                            <div className="space-y-2">
                                <Label htmlFor="website" className="text-white">
                                    Website
                                </Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        value={formData.website}
                                        maxLength={100}
                                        onChange={(e) =>
                                            handleInputChange("website", e.target.value)
                                        }
                                    />
                                    <p className="text-gray-400 text-sm ml-auto">
                                        {formData.website.length}/100
                                    </p>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Editprofile;
