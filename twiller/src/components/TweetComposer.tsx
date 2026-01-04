"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import {
  Image,
  BarChart3,
  Smile,
  Calendar,
  MapPin,
  Globe,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import axiosInstance from "../lib/axiosinstance";

const TweetComposer = ({ onTweetPosted }: any) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageurl, setimageurl] = useState("");
  const maxLength = 200;

  const characterCount = content.length;
  const isoverLimit = characterCount > maxLength;
  const isNearLimit = characterCount > maxLength * 0.8;

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isoverLimit) return;

    setIsLoading(true);
    try {
      const tweetdata = {
        author: user._id,
        content,
        image: imageurl,
      };

      const res = await axiosInstance.post("/post", tweetdata);
      onTweetPosted(res.data);

      setContent("");
      setimageurl("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      if (url) setimageurl(url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const radius = 14;
  const circumference = 2 * Math.PI * radius;

  return (
    <Card className="bg-black border-gray-800 rounded-none">
      <CardContent className="pt-3 pb-2">
        <div className="flex space-x-3">
          <Avatar className="h-12 w-12 mt-1">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.displayName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <form onSubmit={handleSubmit}>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What is happening?!"
                className="w-full resize-none border-none bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 min-h-[80px]"
              />

              {/* ✅ IMAGE PREVIEW (existing state only) */}
              {imageurl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-800">
                  <img
                    src={imageurl}
                    alt="preview"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-blue-400">
                  <label
                    htmlFor="tweetImage"
                    className="p-2 rounded-full hover:bg-blue-900/20 cursor-pointer"
                  >
                    <Image className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      id="tweetImage"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={isLoading}
                    />
                  </label>

                  <Button variant="ghost" size="sm"><BarChart3 /></Button>
                  <Button variant="ghost" size="sm"><Smile /></Button>
                  <Button variant="ghost" size="sm"><Calendar /></Button>
                  <Button variant="ghost" size="sm"><MapPin /></Button>
                </div>

                <div className="flex items-center space-x-3">
                  {characterCount > 0 && (
                    <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r={radius} stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-700" />
                      <circle
                        cx="16"
                        cy="16"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={
                          circumference *
                          (1 - Math.min(characterCount, maxLength) / maxLength)
                        }
                        className={isoverLimit ? "text-red-500" : "text-blue-500"}
                      />
                    </svg>
                  )}

                  <Separator />

                  <Button
                    type="submit"
                    disabled={!content.trim() || isoverLimit || isLoading}
                    className="bg-blue-500 hover:bg-blue-600 rounded-full px-6"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetComposer;
