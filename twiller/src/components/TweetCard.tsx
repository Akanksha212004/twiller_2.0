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

  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);

  /* ================= LIKE ================= */
  const likeTweet = async (tweetId: string) => {
    try {
      const res = await axiosInstance.post(`/like/${tweetId}`, {
        userId: user?._id,
      });
      setTweetState(res.data);
      setLiked(true);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= RETWEET ================= */
  const retweetTweet = async (tweetId: string) => {
    try {
      const res = await axiosInstance.post(`/retweet/${tweetId}`, {
        userId: user?._id,
      });
      setTweetState(res.data);
      setReposted(true);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FORMATTER ================= */
  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return String(num);
  };

  return (
    <Card className="bg-black border-gray-800 rounded-none">
      <CardContent className="flex gap-3 px-4 py-3">
        {/* Avatar */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            window.location.href = `/profile/${tweetState.author._id}`;
          }}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={tweetState.author?.avatar} />
            <AvatarFallback>
              {tweetState.author?.displayName?.[0]}
            </AvatarFallback>
          </Avatar>

          <span className="font-bold">
            {tweetState.author?.displayName}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 text-sm text-white">
          {/* Header */}
          <div className="flex justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold">
                {tweetState.author?.displayName}
              </span>
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

            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </Button>
          </div>

          {/* Text */}
          {tweetState.content && (
            <div className="mt-1 whitespace-pre-wrap text-gray-100">
              {tweetState.content}
            </div>
          )}

          {/* Image */}
          {tweetState.image && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-800">
              <img
                src={tweetState.image}
                alt="Tweet"
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Audio */}
          {tweetState.audioUrl && (
            <div className="mt-3">
              <audio
                controls
                className="w-full"
                src={`http://localhost:5000${tweetState.audioUrl}`}
              />
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex justify-between max-w-md text-gray-500">
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4" />
              <span>{formatNumber(tweetState.comments)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!reposted) {
                  retweetTweet(tweetState._id);
                  setReposted(true);
                }
              }}
              className={reposted ? "text-blue-400" : ""}
            >
              <Repeat2
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="h-4 w-4"
              />
              <span>{formatNumber(tweetState.retweets)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!liked) {
                  likeTweet(tweetState._id);
                  setLiked(true);
                }
              }}
              className={liked ? "text-red-500" : ""}
            >
              <Heart
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`}
              />
              <span>{formatNumber(tweetState.likes)}</span>
            </Button>

            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetCard;
