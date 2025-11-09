"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const COLORS = {
  COMPLETED: "#27F5DD",
  PENDING: "#16F5DB",
  "HALF DONE": "#16C8F5",
  "PARTIAL DONE": "#168DF5",
  "ALMOST DONE": "#2116F5",
  pending: "#27F5DD",
};




const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold mb-2">{payload[0].payload.subject}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SubjectWiseGoalBarChart = ({ data }) => {
  return (
    <>
      <CardHeader>
        <CardTitle className='text-white text-xl'>Goal Progress by Subject</CardTitle>
        <p className="text-sm text-gray-400 mt-1">Goals breakdown by completion status</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="subject" 
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
            />
            <YAxis 
              allowDecimals={false} 
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {Object.keys(COLORS).map((status) => (
              <Bar
                key={status}
                dataKey={status}
                stackId="a"
                fill={COLORS[status]}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  );
};

export default SubjectWiseGoalBarChart;