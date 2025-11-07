"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import DeleteGoalForm from "../../subjects/goals/__components/DeleteGoalForm";
import UpdateGoalForm from "../../subjects/goals/__components/UpdateGoalForm";
import { DialogGoal } from "./DialogBasedGoal";
import { UpdateStatus } from "./UpdateStatus";

export default function DisplayTable() {
  const { user, loading } = useUser();
  const [selectedSubject, setSelectedSubject] = useState("all");

  if (loading) return <p className="text-gray-400 p-8">Loading Goals...</p>;

  const goals = user.student.goals || [];
  const subjects = user.student.subjects || [];

  // Filter goals based on selected subject
  const filteredGoals =
    selectedSubject === "all"
      ? goals
      : goals.filter((goal) => goal.subject === selectedSubject);

  function getSubjName(subjId) {
    const subject = subjects.find((sub) => sub._id === subjId);
    return subject ? subject.name : "Unknown";
  }

  const isOverdue = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);
    return dueDate < today;
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("completed") || statusLower.includes("100%"))
      return "bg-green-500/20 text-green-400";
    if (statusLower.includes("almost") || statusLower.includes("75%"))
      return "bg-blue-500/20 text-blue-400";
    if (statusLower.includes("half") || statusLower.includes("50%"))
      return "bg-yellow-500/20 text-yellow-400";
    if (statusLower.includes("partial") || statusLower.includes("25%"))
      return "bg-orange-500/20 text-orange-400";
    return "bg-red-500/20 text-red-400";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Your Goals</h1>
            <p className="text-gray-400">
              Select a subject to view and manage your goals.
            </p>
          </div>
          <DialogGoal />
        </div>
      </div>

      {/* Filter by Subject */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block">
          Filter by Subject
        </label>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[300px] bg-[#1a1b23] border-gray-700 text-white">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1b23] border-gray-700">
            <SelectItem
              value="all"
              className="text-white hover:bg-gray-800 focus:bg-gray-800"
            >
              All Subjects
            </SelectItem>
            {subjects.map((subject) => (
              <SelectItem
                key={subject._id}
                value={subject._id}
                className="text-white hover:bg-gray-800 focus:bg-gray-800"
              >
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subject Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          {selectedSubject === "all"
            ? "All Goals"
            : `${getSubjName(selectedSubject)} Goals`}
        </h2>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal) => (
            <div
              key={goal._id}
              className="bg-[#1a1b23] rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={goal.completionStatus?.includes("COMPLETED")}
                    readOnly
                    className="w-5 h-5 rounded border-gray-600 bg-transparent cursor-not-allowed"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {goal.title}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                          {getSubjName(goal.subject)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">
                            {isOverdue(goal.deadline) ? "Overdue:" : "Due:"}
                          </span>
                          <span
                            className={
                              isOverdue(goal.deadline)
                                ? "text-red-400"
                                : "text-gray-300"
                            }
                          >
                            {formatDate(goal.deadline)}
                          </span>
                          {isOverdue(goal.deadline) && (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </div>
                    </div>

                  
                    
                  </div>
                </div>

                <div className="flex flex-col">
                  <div
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                        goal.completionStatus
                      )}`}
                    >
                      {goal.completionStatus}
                    </div>
                  <div className="flex items-center justify-center p-2">
                    <UpdateStatus goal={goal} />
                  </div>
                  <div className="flex  justify-between  p-2 items-center gap-2">
                    <UpdateGoalForm goal={goal} />
                    <DeleteGoalForm goal={goal} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 bg-[#1a1b23] rounded-lg border border-gray-800">
            <p>No goals found.</p>
            <p className="text-sm mt-2">
              Click "Add New Goal" to create your first goal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
