"use client";

import React from "react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  "COMPLETED": "#10b981",
  "PENDING": "#A0C1CF",
  "HALF DONE": "#6366f1",
  "PARTIAL DONE": "#8b5cf6",
  "ALMOST DONE": "#06b6d4",
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold">{payload[0].payload.status}</p>
        <p className="text-sm text-gray-300">{payload[0].value} goals</p>
      </div>
    );
  }
  return null;
};

const GoalStatusPieChart = ({ data, totalGoals }) => {
  const completedCount = data.find(d => d.status === 'COMPLETED')?.count || 0;
  const inProgressCount = totalGoals - completedCount;

  return (
    <>
      <CardHeader>
        <CardTitle className='text-white text-xl'>Overall Goal Status</CardTitle>
        <p className="text-sm text-gray-400 mt-1">Current completion overview</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <ResponsiveContainer width={240} height={240}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: completedCount },
                    { name: 'In Progress', value: inProgressCount }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#1f2937" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-white">{totalGoals}</div>
              <div className="text-sm text-gray-400">Total Goals</div>
            </div>
          </div>
          <div className="mt-6 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm text-gray-300">Completed ({completedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              <span className="text-sm text-gray-300">In Progress ({inProgressCount})</span>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default GoalStatusPieChart;