"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export const ProfileCard = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <Card className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 h-full flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </Card>
    );
  }

  if (!isSignedIn) {
    return (
      <Card className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 h-full flex items-center justify-center">
        <div className="text-gray-400">User not signed in</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 h-full hover:bg-gray-800/70 transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
          <Image
            src={user.imageUrl}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full border-2 border-gray-600 relative z-10"
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">{user.fullName}</h2>
        <p className="text-sm text-gray-400 mb-4">
          {user.primaryEmailAddress.emailAddress}
        </p>
        <div className="w-full pt-4 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Study Progress</p>
          <p className="text-sm text-gray-300">Keep up the great work! 🎯</p>
        </div>
      </div>
    </Card>
  );
};