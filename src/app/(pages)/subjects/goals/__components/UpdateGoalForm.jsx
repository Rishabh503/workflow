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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Pencil } from "lucide-react";

export default function UpdateGoalForm({goal}) {
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [deadline, setDeadline] = useState(goal?.deadline?.slice(0,10) || "");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await fetch(`/api/subjects/goals/create/${goal._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, deadline, description }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg(`✅ Goal updated successfully!`);
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
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <Pencil className="w-4 h-4 text-gray-400 hover:text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#1a1b23] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Edit Goal</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-gray-300">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Complete Chapter 5 Reading"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#0a0b0f] border-gray-700 text-white"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              placeholder="Add the description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#0a0b0f] border-gray-700 text-white min-h-[100px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="deadline" className="text-gray-300">Deadline</Label>
            <Input
              type='date'
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-[#0a0b0f] border-gray-700 text-white"
            />
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
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}