"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { DialogGoal } from "./DialogBasedGoal";
import Link from "next/link";
import UpdateSubject from "./SubjectUpdate";

const Display = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick = () => {};

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subjects/user", {
          credentials: "include",
        });
        const data = await res.json();
        console.log(data.student.subjects);
        setSubjects(data.student.subjects || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const calculateProgress = (subject) => {
    // You'll need to adjust this based on your actual data structure
    // This is a placeholder - replace with actual calculation
    if (!subject.goals || subject.goals.length === 0) return 0;
    const completed = subject.goals.filter((g) => g.completed).length;
    return Math.round((completed / subject.goals.length) * 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return "bg-emerald-500";
    if (progress >= 50) return "bg-cyan-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-rose-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-lg">Loading subjects...</div>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-lg">
          No subjects found. Add your first subject to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {subjects.map((subject) => {
        const progress = calculateProgress(subject);
        const totalGoals = subject.goals?.length || 0;
        const progressColor = getProgressColor(progress);

        return (
          <div
            key={subject._id}
            className="bg-[#1a1f2e] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-200"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-white text-xl font-semibold mb-1">
                  {subject.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  {totalGoals} total goals
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm font-medium">
                  {progress}% complete
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${progressColor} transition-all duration-300 rounded-full`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex gap-2 pt-4 border-t border-gray-800">
              <UpdateSubject subject={subject}>
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>
              </UpdateSubject>

              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4 text-gray-400" />
              </button>
              <Link href={`/subjects/goals/${subject._id}`}>
              
              <button  className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                View Goals

              </button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Display;
