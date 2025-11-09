"use client";

import React, { useEffect, useState } from 'react';
import GoalStatusPieChart from './__components/graphs/GoalStatusPieChart';

import DailyStudyTimeGraph from './__components/graphs/DailyStudyTimeGraph';
import SubjectWiseGoalBarChart from './__components/graphs/SubjectWIseGoalBarChart'; 
import SessionsPerDayCountChart from './__components/graphs/SessionsPerDayCountChart';

import { Card, CardTitle } from "@/components/ui/card";
import { ProfileCard } from './__components/others/ProfileCard';

const StatCard = ({ title, value, subtitle, icon }) => (
  <Card className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl text-white border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300">
    <div className="flex items-center justify-between mb-2">
      <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
      {icon && <span className="text-lg opacity-70">{icon}</span>}
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
  </Card>
);

const ChartCard = ({ children, className = "" }) => (
  <Card className={`p-6 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 ${className}`}>
    {children}
  </Card>
);

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        console.log("dashboard data",data)
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading dashboard...</div>
      </main>
    );
  }

  if (!dashboardData) {
    return (
      <main className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-xl text-gray-400">Failed to load dashboard data</div>
      </main>
    );
  }

  const { stats, goalStatusData, subjectWiseData, dailyStudyData, sessionsPerDayData, subjectDistributionData, upcomingGoals, avgSessionTime } = dashboardData;

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, Here's your study progress.</p>
      </div>

      {/* Profile and Quick Stats Section */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
        <div className="xl:col-span-2">
          <ProfileCard />
        </div>
        <div className="xl:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            <StatCard 
              title="Total Goals" 
              value={stats.totalGoals} 
              subtitle="Active learning objectives"
              icon="🎯"
            />
            <StatCard 
              title="Completed Goals" 
              value={stats.completedGoals} 
              subtitle={`${stats.totalGoals > 0 ? Math.round((stats.completedGoals / stats.totalGoals) * 100) : 0}% completion rate`}
              icon="✅"
            />
            <StatCard 
              title="Total Study Time" 
              value={`${Math.floor(stats.totalStudyMinutes / 60)}h ${stats.totalStudyMinutes % 60}m`}
              subtitle="All time"
              icon="⏱️"
            />
            <StatCard 
              title="Upcoming Deadlines" 
              value={stats.upcomingDeadlines} 
              subtitle="Next 7 days"
              icon="⏰"
            />
          </div>
        </div>
      </div>

      {/* Daily Study Time - Full Width at Top */}
      <div className="mb-8">
        <ChartCard>
          <DailyStudyTimeGraph data={dailyStudyData} />
        </ChartCard>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard>
          <SubjectWiseGoalBarChart data={subjectWiseData} />
        </ChartCard>
        <ChartCard>
          <GoalStatusPieChart data={goalStatusData} totalGoals={stats.totalGoals} />
        </ChartCard>
        <ChartCard>
          <SessionsPerDayCountChart data={sessionsPerDayData} />
        </ChartCard>
      </div>

      <div className="h-8"></div>
    </main>
  );
};

export default DashboardPage;