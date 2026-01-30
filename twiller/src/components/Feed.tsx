"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { LoadingSpinner } from "./loading-spinner";
import TweetCard from "@/src/components/TweetCard";
import TweetComposer from "./TweetComposer";
import axiosInstance from "../lib/axiosinstance";
import { useAuth } from "../context/AuthContext";
import AudioTweetComposer from "./AudioTweetComposer";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const shouldNotify = (text: string) => {
  const lower = text.toLowerCase();
  return lower.includes("cricket") && lower.includes("science");
};

const Feed = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  const triggerNotification = (tweetText: string) => {
    console.log("Trigger called:", tweetText);
    console.log("Permission:", Notification.permission);
    console.log("Enabled:", user?.notificationsEnabled);
    if (!user?.notificationsEnabled || !("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification("New matching tweet", {
        body: tweetText,
      });
    }
    // else if (Notification.permission === "default") {
    //   Notification.requestPermission().then((permission) => {
    //     if (permission === "granted") {
    //       new Notification(t("newTweetAlert"), {
    //         body: tweetText,
    //       });
    //     }
    //   });
    // }
  };

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/post");
      const data = res.data || [];
      setTweets(data);

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

    if (newTweet?.content && shouldNotify(newTweet.content)) {
      triggerNotification(newTweet.content);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">{t("home")}</h1>
          <LanguageSwitcher />
        </div>

        <Tabs defaultValue="foryou" className="w-full">
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
              {t("forYou")}
            </TabsTrigger>

            <TabsTrigger
              value="following"
              className="
                w-full text-white
                rounded-full
                py-2
                transition-all
                data-[state=active]:bg-blue-500
                data-[state=active]:text-white
              "
            >
              {t("following")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="foryou">
            <TweetComposer onTweetPosted={handleNewTweet} />
            <AudioTweetComposer />

            <div className="divide-y divide-gray-800">
              {loading ? (
                <Card className="bg-black border-none">
                  <CardContent className="py-12 text-center">
                    <LoadingSpinner />
                    <p className="mt-2 text-gray-400">
                      {t("loadingTweets")}
                    </p>
                  </CardContent>
                </Card>
              ) : tweets.length === 0 ? (
                <Card className="bg-black border-none">
                  <CardContent className="py-12 text-center text-gray-400">
                    {t("noTweets")}
                  </CardContent>
                </Card>
              ) : (
                tweets.map((tweet) => (
                  <TweetCard key={tweet._id} tweet={tweet} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="following">
            <div className="divide-y divide-gray-800">
              {tweets.length === 0 ? (
                <Card className="bg-black border-none">
                  <CardContent className="py-12 text-center text-gray-400">
                    {t("notFollowing")}
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
      {/* TEMP: Notification permission button */}
      {/* <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded z-50"
        onClick={() => Notification.requestPermission()}
      >
        Enable Notifications
      </button> */}

    </div>
  );
};

export default Feed;
