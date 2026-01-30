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
  Mic,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import axiosInstance from "../lib/axiosinstance";

const MAX_AUDIO_SIZE_MB = 100;
const MAX_AUDIO_DURATION = 300;

const TweetComposer = ({ onTweetPosted }: any) => {
  const { user, setUser } = useAuth();

  const [content, setContent] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const maxLength = 200;
  const characterCount = content.length;
  const isoverLimit = characterCount > maxLength;

  if (!user) return null;

  /* ================= IMAGE UPLOAD ================= */
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setIsLoading(true);
    const image = e.target.files[0];
    const formdataimg = new FormData();
    formdataimg.set("image", image);

    try {
      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=10d33391a97c61e340db32c3f12628a5",
        formdataimg
      );
      setimageurl(res.data.data.display_url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= AUDIO SELECT ================= */
  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size / (1024 * 1024) > MAX_AUDIO_SIZE_MB) {
      alert("Audio must be ≤ 100MB");
      return;
    }

    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      if (audio.duration > MAX_AUDIO_DURATION) {
        alert("Audio must be ≤ 5 minutes");
        return;
      }
      setAudioFile(file);
    };
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      /* ===== AUDIO TWEET ===== */
      if (audioFile) {
        const formData = new FormData();
        formData.append("audio", audioFile);
        formData.append("author", user._id);

        const res = await axiosInstance.post("/post/audio", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        onTweetPosted(res.data);

        const userRes = await axiosInstance.get("/loggedinuser", {
          params: { email: user.email },
        });
        setUser(userRes.data);
        localStorage.setItem("twitter-user", JSON.stringify(userRes.data));

        setAudioFile(null);

      }

      /* ===== TEXT / IMAGE TWEET ===== */
      else {
        if (!content.trim() || isoverLimit) {
          setIsLoading(false);
          return;
        }

        const res = await axiosInstance.post("/post", {
          author: user._id,
          content,
          image: imageurl,
        });

        onTweetPosted(res.data);

        // IMPORTANT FIX
        const userRes = await axiosInstance.get("/loggedinuser", {
          params: { email: user.email },
        });
        setUser(userRes.data);
        localStorage.setItem("twitter-user", JSON.stringify(userRes.data));

        setContent("");
        setimageurl("");

      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert(err.response.data.message);
      } else {
        console.error("Tweet failed", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */
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

          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What is happening?!"
                className="resize-none border-none bg-transparent text-white focus-visible:ring-0 min-h-[80px]"
              />

              {imageurl && (
                <img
                  src={imageurl}
                  className="mt-3 rounded-xl border border-gray-800"
                />
              )}

              {audioFile && (
                <p className="mt-2 text-sm text-gray-400">
                  {audioFile.name}
                </p>
              )}

              {/* FOOTER */}
              <div className="mt-2 flex items-center justify-between">
                {/* LEFT ICONS */}
                <div className="flex items-center text-blue-400">
                  <label className="p-2 rounded-full hover:bg-blue-900/20 cursor-pointer">
                    <Image />
                    <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                  </label>

                  <label className="p-2 rounded-full hover:bg-blue-900/20 cursor-pointer">
                    <Mic />
                    <input type="file" hidden accept="audio/*" onChange={handleAudioSelect} />
                  </label>

                  <Button variant="ghost" size="sm"><BarChart3 /></Button>
                  <Button variant="ghost" size="sm"><Smile /></Button>
                  <Button variant="ghost" size="sm"><Calendar /></Button>
                  <Button variant="ghost" size="sm"><MapPin /></Button>
                </div>

                {/* RIGHT POST BUTTON */}
                <div className="flex items-center space-x-3">
                  <Separator />
                  <Button
                    type="submit"
                    disabled={isLoading || (!content.trim() && !audioFile)}
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
