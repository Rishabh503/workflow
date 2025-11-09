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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-gray-300 text-sm">
          {new Date(payload[0].payload.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </p>
        <p className="text-white font-semibold">
          {payload[0].value} sessions
        </p>
      </div>
    );
  }
  return null;
};

const SessionsPerDayCountChart = ({ data }) => {
  // Format data to show day names
  const formattedData = data.map(item => ({
    ...item,
    day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
  }));

  return (
    <>
      <CardHeader>
        <CardTitle className='text-white text-xl'>Study Sessions (Last 7 Days)</CardTitle>
        <p className="text-sm text-gray-400 mt-1">Number of study sessions per day</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="day" 
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
            />
            <YAxis 
              allowDecimals={false} 
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="sessions" 
              fill="#8b5cf6" 
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  );
};

export default SessionsPerDayCountChart;