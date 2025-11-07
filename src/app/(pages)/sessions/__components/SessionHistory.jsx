"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Filter, Calendar } from "lucide-react";
import { useUser } from "@/context/UserContext";

const SessionHistory = () => {
  const { user, loading: userLoading } = useUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    show: false,
    sessionId: null,
  });

  function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes, seconds] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return [hours, minutes, seconds];
  }

  function getTimeDifference(start, end) {
    if (!start || !end) return "Invalid";

    const [sh, sm, ss] = convertTo24Hour(start);
    const [eh, em, es] = convertTo24Hour(end);

    const startSeconds = sh * 3600 + sm * 60 + ss;
    const endSeconds = eh * 3600 + em * 60 + es;

    let diff = endSeconds - startSeconds;
    if (diff < 0) diff += 24 * 3600;

    const h = String(Math.floor(diff / 3600)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const s = String(diff % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  }

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/subjects/user", {
          credentials: "include",
        });
        const data = await res.json();
        setSessions(data.student.sessions || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleDeleteClick = (sessionId) => {
    setDeleteDialog({ show: true, sessionId });
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/sessions/${deleteDialog.sessionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSessions(sessions.filter((s) => s._id !== deleteDialog.sessionId));
        setDeleteDialog({ show: false, sessionId: null });
      } else {
        console.error("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ show: false, sessionId: null });
  };

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    const dateMatch = filterDate
      ? new Date(session.date).toISOString().split("T")[0] === filterDate
      : true;
    return dateMatch;
  });

  if (userLoading || loading) {
    return <div className="text-center text-gray-400">Loading sessions...</div>;
  }

  const subjects = user?.student?.subjects || [];

  return (
    <>
      <div className="bg-[#1a1a1a] rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold mb-6">Session History</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white rounded-xl pl-10 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">
                  DATE
                </th>
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">
                  DURATION
                </th>
                <th className="text-center py-4 px-4 text-gray-400 font-semibold">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <tr
                    key={session._id}
                    className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                  >
                    <td className="py-4 px-4">
                      {new Date(session.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-4 font-mono">
                      {getTimeDifference(session.startTime, session.endTime)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleDeleteClick(session._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                      >
                        <Trash2
                          size={18}
                          className="text-gray-400 group-hover:text-red-500"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No sessions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-800">
            <h3 className="text-2xl font-bold mb-4">Delete Session?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this session? This action cannot
              be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelDelete}
                className="flex-1 px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionHistory;
