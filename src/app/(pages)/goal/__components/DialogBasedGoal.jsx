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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Plus } from "lucide-react";

export function DialogGoal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const { user } = useUser();

  const subjects = user.student.subjects || [];

  const handleSubmit = async () => {
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await fetch("/api/subjects/goals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, title, deadline, description }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg(`✅ Goal added successfully!`);
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
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#1a1b23] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Add New Goal</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject" className="text-gray-300">Subject</Label>
            <Select value={subject} onValueChange={(value) => setSubject(value)}>
              <SelectTrigger className="w-full bg-[#0a0b0f] border-gray-700 text-white">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1b23] border-gray-700">
                {subjects.map((s) => (
                  <SelectItem 
                    key={s._id} 
                    value={s.name}
                    className="text-white hover:bg-gray-800 focus:bg-gray-800"
                  >
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              type="date"
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
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {loading ? "Saving..." : "Add Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}