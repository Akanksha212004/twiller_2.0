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
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  if (!user) return null;

  /* 🔔 sync notification preference */
  useEffect(() => {
    if (user?.notificationsEnabled !== undefined) {
      setNotificationsEnabled(user.notificationsEnabled);
    }
  }, [user]);

  /* fetch user posts */
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

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      await axiosInstance.put("/api/user/notification", {
        userId: user._id,
        enabled: value,
      });
    } catch (error) {
      console.error("Failed to update notification setting", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
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

      {/* Banner + Avatar */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        <div className="absolute left-4 top-28 z-10">
          <Avatar className="h-28 w-28 border-4 border-black">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-2xl">
              {user.displayName?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info */}
        <div className="pt-32 px-4 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{user.displayName}</h2>
              <p className="text-sm text-gray-400">@{user.username}</p>

              {/* 🔔 Notification toggle */}
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) =>
                    toggleNotifications(e.target.checked)
                  }
                />
                <span className="text-sm">
                  Enable Tweet Notifications
                </span>
              </div>

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
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex border-b border-gray-800 px-4 bg-transparent rounded-none">
          {["posts", "replies", "highlights", "articles", "media"].map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="
                  px-6 py-4 text-sm font-medium
                  text-gray-400
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

        <TabsContent value="posts">
          {loading ? (
            <div className="text-center py-10 text-gray-400">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No posts yet
            </div>
          ) : (
            posts.map((post) => (
              <TweetCard key={post._id} tweet={post} />
            ))
          )}
        </TabsContent>

        <TabsContent value="replies">
          <div className="text-center py-16 text-gray-500">
            No replies yet
          </div>
        </TabsContent>

        <TabsContent value="highlights">
          <div className="text-center py-16 text-gray-500">
            No highlights yet
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <div className="text-center py-16 text-gray-500">
            No articles yet
          </div>
        </TabsContent>

        <TabsContent value="media">
          <div className="text-center py-16 text-gray-500">
            No media yet
          </div>
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
