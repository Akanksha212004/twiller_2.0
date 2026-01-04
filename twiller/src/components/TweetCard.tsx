"use client";

import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Share,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axiosinstance";

const TweetCard = ({ tweet }: any) => {
  const { user } = useAuth();
  const [tweetState, setTweetState] = useState(tweet);

  // UI states
  const [liked, setLiked] = useState<boolean>(false);
  const [reposted, setReposted] = useState<boolean>(false);

  // like tweet
  const likeTweet = async (tweetId: string) => {
    try {
      const res = await axiosInstance.post(`/like/${tweetId}`, {
        userId: user?._id,
      });
      setTweetState(res.data);
      setLiked(true);
    } catch (error) {
      console.log(error);
    }
  };

  // retweet placeholder
  const retweetTweet = async (tweetId: string) => {
    try {
      const res = await axiosInstance.post(`/retweet/${tweetId}`, {
        userId: user?._id,
      });
      setTweetState(res.data);
      setReposted(true);
    } catch (error) {
      console.log(error);
    }
  };

  // formatter
  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return String(num);
  };

  const baseLikes =
    typeof tweetState.likes === "number" ? tweetState.likes : 0;
  const baseComments =
    typeof tweetState.comments === "number" ? tweetState.comments : 0;
  const baseRetweets =
    typeof tweetState.retweets === "number" ? tweetState.retweets : 0;

  return (
    <Card className="bg-black border-gray-800 rounded-none">
      <CardContent className="flex gap-3 px-4 py-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={tweetState.author?.avatar}
              alt={tweetState.author?.displayName}
            />
            <AvatarFallback>
              {tweetState.author?.displayName?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-sm text-white">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="font-bold truncate">
                {tweetState.author?.displayName}
              </span>

              {tweetState.author?.verified && (
                <div className="bg-blue-500 rounded-full p-0.5">
                  <svg
                    className="h-4 w-4 text-white fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z" />
                  </svg>
                </div>
              )}

              <span className="text-gray-400">
                @{tweetState.author?.username}
              </span>

              <span className="text-gray-500">·</span>

              {tweetState.timestamp && (
                <span className="text-gray-400">
                  {new Date(tweetState.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-400 hover:text-blue-400 hover:bg-gray-900"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Text */}
          <div className="mt-1 text-gray-100 whitespace-pre-wrap">
            {tweetState.content}
          </div>

          {/* Image */}
          {tweetState.image && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-800">
              <img
                src={tweetState.image}
                alt="Tweet"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center justify-between max-w-md text-xs text-gray-500">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 rounded-full px-2 py-1 hover:text-blue-400"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{formatNumber(baseComments)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReposted(!reposted);
                retweetTweet(tweetState._id);
              }}
              className={`flex items-center space-x-1 rounded-full px-2 py-1 ${
                reposted ? "text-blue-400" : "text-gray-500"
              } hover:text-blue-400`}
            >
              <Repeat2 className="h-4 w-4" />
              <span>
                {formatNumber(baseRetweets + (reposted ? 1 : 0))}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLiked(!liked);
                likeTweet(tweetState._id);
              }}
              className={`flex items-center space-x-1 rounded-full px-2 py-1 ${
                liked ? "text-red-500" : "text-gray-500"
              } hover:text-red-500`}
            >
              <Heart
                className={`h-4 w-4 transition ${
                  liked ? "fill-red-500" : ""
                }`}
              />
              <span>{formatNumber(baseLikes + (liked ? 1 : 0))}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-400 rounded-full px-2 py-1"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetCard;
