"use client";

import React, { useState } from "react";
import { LoadingSpinner } from "@/src/components/loading-spinner";
import { useAuth } from "@/src/context/AuthContext";
import Sidebar from "@/src/components/layout/Sidebar";
import RightSidebar from "@/src/components/layout/RightSidebar";

// Pages / components
import HomeFeed from "@/src/components/Feed";
import ProfilePage from "@/src/components/ProfilePage";

const Mainlayout = ({ children }: any) => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");

  /* Loading state */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-4xl font-bold mb-4">X</div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  /* Not logged in */
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      {/* Sidebar */}
      <div className="w-20 sm:w-24 md:w-64 border-r border-gray-800">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-2xl min-w-0 overflow-auto border-r border-gray-800">
        {currentPage === "home" && <HomeFeed />}
        {currentPage === "profile" && <ProfilePage />}

        {/* fallback */}
        {currentPage !== "home" && currentPage !== "profile" && children}
      </main>

      {/* Right sidebar */}
      <div className="hidden lg:block w-80 p-4">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Mainlayout;
