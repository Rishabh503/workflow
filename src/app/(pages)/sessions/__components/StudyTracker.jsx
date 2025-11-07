"use client"
import React, { useEffect, useRef, useState } from "react";
import { Play, Square } from "lucide-react";
import { useUser } from "@/context/UserContext";

const StudyTracker = () => {
  const { user, loading } = useUser();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [startTimeReal, setStartTimeReal] = useState(null);
  const [showEndDialog, setShowEndDialog] = useState(false);

  const intervalRef = useRef(null);

  const formatTime = (totalSeconds) => {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Calculate progress percentage (based on a max of 2 hours = 7200 seconds)
  const progressPercentage = Math.min((seconds / 7200) * 100, 100);
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleStart = () => {
    // if (!selectedSubject) {
    //   alert("Please select a subject first!");
    //   return;
    // }
    setStartTimeReal(new Date());
    setRunning(true);
  };

  const handleEndSession = () => {
    setShowEndDialog(true);
  };

  const confirmEndSession = async () => {
    const now = new Date();
    const sessionData = {
      date: now.toISOString().split("T")[0],
      startTime: startTimeReal?.toLocaleTimeString() || "00:00:00",
      endTime: now.toLocaleTimeString(),
    };

    try {
      const res = await fetch("/api/sessions/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });

      if (res.ok) {
        console.log("Session saved successfully");
        setRunning(false);
        setSeconds(0);
        setStartTimeReal(null);
        setShowEndDialog(false);
        // Reload page to refresh session history
        window.location.reload();
      } else {
        console.error("Failed to save session");
      }
    } catch (error) {
      console.log("Error saving session:", error);
    }
  };

  const cancelEndSession = () => {
    setShowEndDialog(false);
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  const subjects = user?.student?.subjects || [];

  return (
    <>
      <div className="bg-[#1a1a1a] rounded-3xl p-8 mb-12 shadow-2xl">
       

        {/* Circular Timer */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-80 h-80">
            {/* Background Circle */}
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="#2a2a2a"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="#3b82f6"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
                style={{
                  filter: "drop-shadow(0 0 8px #3b82f6)"
                }}
              />
            </svg>
            
            {/* Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-mono font-bold tracking-wider">
                {formatTime(seconds)}
              </div>
              <div className="text-sm text-gray-400 mt-2">Focus Session</div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center">
          {!running ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Play size={20} fill="white" />
              Start Session
            </button>
          ) : (
            <button
              onClick={handleEndSession}
              className="flex items-center gap-2 px-8 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-gray-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              <Square size={20} />
              End Session
            </button>
          )}
        </div>
      </div>

      {/* End Session Dialog */}
      {showEndDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-800">
            <h3 className="text-2xl font-bold mb-4">End Session?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to end this focus session? Your progress will be saved.
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelEndSession}
                className="flex-1 px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmEndSession}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-all duration-300"
              >
                End & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudyTracker;