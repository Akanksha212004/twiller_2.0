"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axiosinstance";

import {
  ArrowLeft,
  Camera,
  MoreHorizontal,
  MapPin,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import Editprofile from "@/src/components/Editprofile";
import TweetCard from "@/src/components/TweetCard";

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user) return null;

  // ✅ Fetch ALL posts, then filter by logged-in user
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await axiosInstance.get("/post");

        const userPosts = res.data.filter(
          (post: any) =>
            post.author &&
            (post.author._id === user._id ||
              post.author === user._id)
        );

        setPosts(userPosts);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user._id]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur border-b border-gray-800">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-900"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-lg font-bold">{user.displayName}</h1>
            <p className="text-sm text-gray-400">
              {posts.length} posts
            </p>
          </div>
        </div>
      </div>

      {/* ================= BANNER + AVATAR ================= */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70"
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>

        <div className="absolute left-4 top-28 z-10">
          <div className="relative">
            <Avatar className="h-28 w-28 border-4 border-black">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">
                {user.displayName?.[0]}
              </AvatarFallback>
            </Avatar>

            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-1 right-1 rounded-full bg-black/70 hover:bg-black/90"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ================= PROFILE INFO ================= */}
        <div className="pt-32 px-4 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{user.displayName}</h2>
              <p className="text-sm text-gray-400">@{user.username}</p>

              {user.bio && (
                <p className="mt-3 text-sm text-gray-300 max-w-xl">
                  {user.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={
                        user.website.startsWith("http")
                          ? user.website
                          : `https://${user.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                )}

                {user.joinedDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {new Date(user.joinedDate).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Button
              className="rounded-full bg-white text-black px-4 py-1 text-sm hover:bg-gray-200"
              onClick={() => setShowEditModal(true)}
            >
              Edit profile
            </Button>
          </div>

          <div className="flex justify-end mt-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-900"
            >
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex border-b border-gray-800 px-4 bg-transparent rounded-none">
          {["posts", "replies", "highlights", "articles", "media"].map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="
                  px-6 py-4 text-sm font-medium text-gray-400
                  hover:bg-gray-900
                  data-[state=active]:bg-white
                  data-[state=active]:text-black
                  rounded-none
                "
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            )
          )}
        </TabsList>

        {/* POSTS */}
        <TabsContent value="posts">
          {loading ? (
            <div className="text-center text-gray-500 py-16">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <p className="text-xl font-bold">You haven’t posted yet</p>
              <p className="text-sm mt-2">
                When you post, it will show up here.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <TweetCard key={post._id} tweet={post} />
            ))
          )}
        </TabsContent>
      </Tabs>

      <Editprofile
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
