"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function UpdateStatus({ goal }) {
  const [status, setStatus] = useState(goal.completionStatus || "PENDING - 0%");
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    "PENDING - 0%",
    "PARTIAL DONE - 25%",
    "HALF DONE - 50%",
    "ALMOST DONE - 75%",
    "COMPLETED - 100%"
  ];

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    setStatus(newStatus);

    try {
      const res = await fetch(`/api/subjects/goals/create/${goal._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          completionStatus: newStatus,
          title: goal.title,
          description: goal.description,
          deadline: goal.deadline
        }),
      });

      if (res.ok) {
        // Optional: Show success feedback
        console.log("Status updated successfully");
      } else {
        // Revert on error
        setStatus(goal.completionStatus);
        console.error("Failed to update status");
      }
    } catch (error) {
      // Revert on error
      setStatus(goal.completionStatus);
      console.error("Error updating status:", error);
    }

    setLoading(false);
  };

  return (
    <Select 
      value={status} 
      onValueChange={handleStatusChange}
      disabled={loading}
    >
      <SelectTrigger className="w-[200px] bg-blue-200 hover:bg-blue-400  mx-2   border-gray-700 text-white">
        <SelectValue placeholder="Update status" />
      </SelectTrigger>
      <SelectContent className="bg-[#1a1b23] border-gray-700">
        {statusOptions.map((option) => (
          <SelectItem 
            key={option} 
            value={option}
            className="text-white hover:bg-gray-800 focus:bg-gray-800"
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}