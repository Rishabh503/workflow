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
import { Plus } from "lucide-react";
import { useState } from "react";

export function DialogDemo() {
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await fetch("/api/subjects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: subjectName }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg(`✅ Subject "${data.subject.name}" added successfully!`);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setResponseMsg(`❌ ${data.error}`);
      }
    } catch (error) {
      setResponseMsg("❌ Something went wrong. Try again.");
    }

    setLoading(false);
    setSubjectName("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg">
          <Plus className="w-5 h-5" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1f2e] border-gray-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">Add New Subject</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-3">
              <Label htmlFor="subject" className="text-gray-300 text-sm">
                Subject Name
              </Label>
              <Input
                id="subject"
                name="subject"
                placeholder="e.g. Quantum Physics, Data Structures"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                required
              />
            </div>

            {responseMsg && (
              <p className="text-sm text-center text-gray-300 bg-gray-900 p-3 rounded-lg">
                {responseMsg}
              </p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button 
                variant="outline" 
                type="button"
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
              {loading ? "Saving..." : "Save Subject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}