"use client";

import Twitterlogo from "@/src/components/Twitterlogo";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Bell, Bookmark, Home, LogOutIcon, Mail, MoreHorizontal, Search, Settings2, User } from "lucide-react";
import React from "react";

const Sidebar = ({ currentPage = 'home', onNavigate }: any) => {
    const { user, logout } = useAuth();
    const navigation = [
        { name: "Home", icon: Home, current: currentPage === "home", page: "home" },
        {
            name: "Explore",
            icon: Search,
            current: currentPage === "explore",
            page: "explore",
        },
        {
            name: "Notifications",
            icon: Bell,
            current: currentPage === "notifications",
            page: "notifications",
            badge: true,
        },
        {
            name: "Messages",
            icon: Mail,
            current: currentPage === "messages",
            page: "messages",
        },
        {
            name: "Bookmarks",
            icon: Bookmark,
            current: currentPage === "bookmarks",
            page: "bookmarks",
        },
        {
            name: "Profile",
            icon: User,
            current: currentPage === "profile",
            page: "profile",
        },
        {
            name: "More",
            icon: MoreHorizontal,
            current: currentPage === "more",
            page: "more",
        },
    ];
    return (
        <div className="flex flex-col h-screen w-64 border-r border-gray-800 bg-black">
            <div className="p-4">
                <Twitterlogo size="lg" className="text-white" />
            </div>

            <nav className="flex-1 px-2">
                <ul className="space-y-2">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start text-xl py-6 px-4 rounded-full hover:bg-gray-900 ${item.current ? "font-bold" : "font-normal"
                                    } text-white hover:text-white`}
                                onClick={() => {
                                    if (onNavigate) onNavigate(item.page);
                                }}

                            >
                                <item.icon className="mr-4 h-7 w-7" />
                                {item.name}
                                {item.badge && (
                                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        3
                                    </span>
                                )}
                            </Button>
                        </li>
                    ))}
                </ul>
                <div className="mt-8 px-2">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full text-lg">
                        Post
                    </Button>
                </div>
            </nav>
            {user && (
                <div className="p-4 border-t border-gray-800">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 w-full rounded-full hover:bg-gray-900 p-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                                </Avatar>


                                <MoreHorizontal className="text-gray-400" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-64 bg-black border border-gray-800 text-white rounded-xl p-2"
                            side="top"
                            align="start"
                        >
                            {/* Settings */}
                            <DropdownMenuItem className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-900 cursor-pointer">
                                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-800">
                                    <Settings2 className="h-4 w-4 text-white" />
                                </div>
                                <span>Settings</span>
                            </DropdownMenuItem>

                            {/* Logout */}
                            <DropdownMenuItem
                                onClick={logout}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-900 cursor-pointer"
                            >
                                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-800">
                                    <LogOutIcon className="h-4 w-4 text-white" />
                                </div>
                                <span>Logout @{user.username}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    )
};

export default Sidebar;