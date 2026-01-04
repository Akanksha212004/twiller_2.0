"use client";

import React from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";

const RightSidebar = () => {
  return (
    <div className="space-y-6 sticky top-4">
      {/* Search Bar */}
      <div>
        <Input
          placeholder="Search"
          className="
            bg-gray-900 text-white border-gray-700 
            rounded-full px-4 py-2
            focus-visible:ring-1 focus-visible:ring-blue-400
          "
        />
      </div>

      {/* Trends Section */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">What’s happening</h2>

          <div className="space-y-4">
            <Trend title="Web Development" count="120K" />
            <Trend title="React 19 Release" count="68K" />
            <Trend title="OpenAI Updates" count="50K" />
          </div>
        </CardContent>
      </Card>

      {/* Who to follow */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Who to follow</h2>

          <div className="space-y-4">
            <FollowUser
              name="John Doe"
              username="johndoe"
              avatar="https://randomuser.me/api/portraits/men/32.jpg"
            />
            <FollowUser
              name="Sarah Lee"
              username="sarahdesigns"
              avatar="https://randomuser.me/api/portraits/women/44.jpg"
            />
            <FollowUser
              name="Rahul Verma"
              username="rahul_dev"
              avatar="https://randomuser.me/api/portraits/men/65.jpg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;

/* ------------------ SUB COMPONENTS ------------------ */

const Trend = ({ title, count }: any) => (
  <div className="hover:bg-gray-800 p-2 rounded-lg cursor-pointer transition">
    <p className="font-medium text-white">{title}</p>
    <p className="text-gray-500 text-sm">{count} posts</p>
  </div>
);

const FollowUser = ({ name, username, avatar }: any) => (
  <div className="flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg cursor-pointer transition">
    <div className="flex items-center space-x-3">
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-white">{name}</p>
        <p className="text-gray-500 text-sm">@{username}</p>
      </div>
    </div>

    <button className="bg-white text-black font-semibold px-4 py-1 rounded-full hover:bg-gray-200 transition">
      Follow
    </button>
  </div>
);
