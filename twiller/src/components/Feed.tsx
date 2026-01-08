"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { LoadingSpinner } from "./loading-spinner";
import TweetCard from "@/src/components/TweetCard";
import TweetComposer from "./TweetComposer";
import axiosInstance from "../lib/axiosinstance";
import { useAuth } from "../context/AuthContext";

const shouldNotify = (text: string) => {
  const lower = text.toLowerCase();
  return lower.includes("cricket") && lower.includes("science");
};

const Feed = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const triggerNotification = (tweetText: string) => {
    if (
      !user?.notificationsEnabled ||
      !("Notification" in window)
    ) {
      return;
    }

    if (Notification.permission === "granted") {
      new Notification("New Tweet Alert", {
        body: tweetText,
      });
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("New Tweet Alert", {
            body: tweetText,
          });
        }
      });
    }
  };

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/post");
      const data = res.data || [];
      setTweets(data);

      /* notify on feed load */
      data.forEach((tweet: any) => {
        if (shouldNotify(tweet.content)) {
          triggerNotification(tweet.content);
        }
      });
    } catch (error) {
      console.error("Failed to fetch tweets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleNewTweet = (newTweet: any) => {
    setTweets((prev) => [newTweet, ...prev]);

    /* notify on new tweet */
    if (shouldNotify(newTweet.content)) {
      triggerNotification(newTweet.content);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">Home</h1>
        </div>

        <Tabs defaultValue="foryou" className="w-full">
          {/* Tabs header */}
          <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-800 px-2 py-1">
            <TabsTrigger
              value="foryou"
              className="
                w-full text-white
                rounded-full
                py-2
                transition-all
                data-[state=active]:bg-blue-500
                data-[state=active]:text-white
              "
            >
              For You
            </TabsTrigger>


            <TabsTrigger
              value="following"
              className="
                w-full
                text-white
                rounded-full
                py-2
                transition-all
                data-[state=active]:bg-blue-500
                data-[state=active]:text-white
              "
            >
              Following
            </TabsTrigger>

          </TabsList>

          {/* For You */}
          <TabsContent value="foryou">
            <TweetComposer onTweetPosted={handleNewTweet} />

            <div className="divide-y divide-gray-800">
              {loading ? (
                <Card className="bg-black border-none">
                  <CardContent className="py-12 text-center">
                    <LoadingSpinner />
                    <p className="mt-2 text-gray-400">Loading tweets...</p>
                  </CardContent>
                </Card>
              ) : tweets.length === 0 ? (
                <Card className="bg-black border-none">
                  <CardContent className="py-12 text-center text-gray-400">
                    No tweets yet
                  </CardContent>
                </Card>
              ) : (
                tweets.map((tweet) => (
                  <TweetCard key={tweet._id} tweet={tweet} />
                ))
              )}
            </div>
          </TabsContent>

          {/* Following (abhi same tweets) */}
          <TabsContent value="following">
            <div className="divide-y divide-gray-800">
              {tweets.length === 0 ? (
                <Card className="bg-black border-none">
                  <CardContent className="py-12 text-center text-gray-400">
                    You’re not following anyone yet.
                  </CardContent>
                </Card>
              ) : (
                tweets.map((tweet) => (
                  <TweetCard key={tweet._id} tweet={tweet} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Feed;
