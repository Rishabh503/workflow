"use client";

import React from "react";
import {
  AreaChart,
  Area,
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
          {new Date(payload[0].payload.date).toLocaleDateString('en-US', { weekday: 'short' })}
        </p>
        <p className="text-white font-semibold">
          {payload[0].value} minutes
        </p>
      </div>
    );
  }
  return null;
};

const DailyStudyTimeGraph = ({ data }) => {
  // Format data to show day names
  const formattedData = data.map(item => ({
    ...item,
    day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
  }));

  return (
    <>
      <CardHeader>
        <CardTitle className='text-white text-xl'>Daily Study Time (Last 7 Days)</CardTitle>
        <p className="text-sm text-gray-400 mt-1">Track your daily learning progress</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A0C1CF" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#A0C1CF" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="day" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#A0C1CF"
              style={{ fontSize: '12px' }}
              label={{ 
                value: "Minutes", 
                angle: -90, 
                position: "insideLeft",
                style: { fill: '#A0C1CF' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="minutes"
              stroke="#A0C1CF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMinutes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  );
};

export default DailyStudyTimeGraph;