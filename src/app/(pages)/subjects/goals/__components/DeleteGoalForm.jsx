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
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteGoalForm({goal}) {
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleDelete = async () => {
    setLoading(true);
   
    try {
      const res = await fetch(`/api/subjects/goals/create/${goal._id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg(`✅ Goal deleted successfully!`);
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
          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1b23] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Confirm Delete Goal</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-300">
            Are you sure you want to delete "<span className="font-semibold">{goal.title}</span>"? This action cannot be undone.
          </p>
          
          {responseMsg && (
            <p className="text-sm text-center text-gray-300 mt-4">{responseMsg}</p>
          )}
        </div>

        <DialogFooter className="mt-4 flex items-center justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}