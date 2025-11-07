'use client';
import { useUser } from '@/context/UserContext';
import { Button } from "@/components/ui/button";
import { use, useState } from 'react';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';
import UpdateGoalForm from '../__components/UpdateGoalForm';
import DeleteGoalForm from '../__components/DeleteGoalForm';
import { UpdateStatus } from '@/app/(pages)/goal/__components/UpdateStatus';
import { DialogGoal } from '../../__components/DialogBasedGoal'; 

export default function GoalsviewPage({ params }) {
  const { user, loading } = useUser();
  const { slug } = use(params); 
  
  if (loading) return <p className="text-gray-400">Loading Goals...</p>;
  
  const goals = user.student.goals.filter((goal) => goal.subject == slug) || [];
  const subjName = user.student.subjects.filter((s) => s._id == slug)[0]?.name || "Loading";

  const isOverdue = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);
    return dueDate < today;
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('completed') || statusLower.includes('100%')) return 'bg-green-500/20 text-green-400';
    if (statusLower.includes('almost') || statusLower.includes('75%')) return 'bg-blue-500/20 text-blue-400';
    if (statusLower.includes('half') || statusLower.includes('50%')) return 'bg-yellow-500/20 text-yellow-400';
    if (statusLower.includes('partial') || statusLower.includes('25%')) return 'bg-orange-500/20 text-orange-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen  text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold">Manage Your Goals</h1>
          <DialogGoal subjectName={slug} />
        </div>
        <p className="text-gray-400">Select a subject to view and manage your goals.</p>
      </div>

      {/* Subject Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{subjName} Goals</h2>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : goals.length > 0 ? (
          goals.map((goal) => (
            <div 
              key={goal._id} 
              className="bg-[#1a1f2e] rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start gap-4">
               
                

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{goal.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{goal.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Due:</span>
                          <span className="text-gray-300">{formatDate(goal.deadline)}</span>
                          {isOverdue(goal.deadline) && (
                            <span className="flex items-center gap-1 text-red-400">
                              <AlertTriangle className="w-4 h-4" />
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                   
                  </div>
                </div>

                {/* Action Buttons */}
               <div className='flex flex-col items-center justify-center'>
                 <div className="flex items-center justify-between gap-2">
                   <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.completionStatus)}`}>
                      {goal.completionStatus}
                    </div>
                  <UpdateGoalForm goal={goal} />
                  <DeleteGoalForm goal={goal} />
                  
                </div>
                <div className="pt-2 p-2">
                  <UpdateStatus goal={goal} />
                </div>
               </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No goals found for this subject.</p>
            <p className="text-sm mt-2">Click "Add Goal" to create your first goal.</p>
          </div>
        )}
      </div>
    </div>
  );
}