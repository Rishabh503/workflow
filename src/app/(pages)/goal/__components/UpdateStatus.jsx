"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function UpdateStatus({ goal }) {
  const [status, setStatus] = useState(goal.completionStatus || "PENDING - 0%");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { status: 'PENDING', percentage: 0 },
    { status: 'PARTIAL DONE', percentage: 25 },
    { status: 'HALF DONE', percentage: 50 },
    { status: 'ALMOST DONE', percentage: 75 },
    { status: 'COMPLETED', percentage: 100 }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await fetch("/api/subjects/goals/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goalId: goal._id, status: status }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg(`✅ Status updated successfully!`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setResponseMsg(`❌ ${data.error}`);
      }
    } catch (error) {
      setResponseMsg("❌ Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1">
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1b23] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Update Goal Status</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-gray-300">Select Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="w-full bg-[#0a0b0f] border-gray-700 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1b23] border-gray-700">
                {options.map((option) => (
                  <SelectItem 
                    key={option.status} 
                    value={`${option.status} - ${option.percentage}%`}
                    className="text-white hover:bg-gray-800 focus:bg-gray-800"
                  >
                    {option.status} - {option.percentage}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {responseMsg && (
            <p className="text-sm text-center text-gray-300">{responseMsg}</p>
          )}
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" type="button" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}