
import { connectDB } from "@/lib/db";
import Student from "@/models/studentModel";
import Goal from "@/models/goalModel";
import Session from "@/models/sessionModel";
import Subject from "@/models/subjectModel";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  await connectDB();
  
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const thisStudent = await Student.findOne({ clerkId: clerkUser.id })
      .populate({
        path: 'goals',
        populate: {
          path: 'subject',
          model: 'Subject'
        }
      })
      .populate('sessions')
      .populate('subjects');

    if (!thisStudent) {
      return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
    }

    // Calculate goal statistics
    const goals = thisStudent.goals;
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completionStatus === 'COMPLETED').length;
    
    // Get upcoming deadlines (next 7 days)
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = goals.filter(g => {
      const deadline = new Date(g.deadline);
      return deadline >= now && deadline <= nextWeek && g.completionStatus !== 'COMPLETED';
    }).length;

    // Goal status distribution
    const statusCounts = goals.reduce((acc, goal) => {
      const status = goal.completionStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const goalStatusData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));

    // Subject-wise goal breakdown
    const subjectGoals = goals.reduce((acc, goal) => {
      const subjectName = goal.subject?.name || 'Unknown';
      if (!acc[subjectName]) {
        acc[subjectName] = {};
      }
      const status = goal.completionStatus;
      acc[subjectName][status] = (acc[subjectName][status] || 0) + 1;
      return acc;
    }, {});

    const subjectWiseData = Object.entries(subjectGoals).map(([subject, statuses]) => ({
      subject,
      ...statuses
    }));

    // Daily study time (last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentSessions = thisStudent.sessions.filter(s => new Date(s.date) >= sevenDaysAgo);
    
    const dailyStudyTime = {};
    recentSessions.forEach(session => {
      const dateStr = new Date(session.date).toISOString().split('T')[0];
      const [startHour, startMin] = session.startTime.split(':').map(Number);
      const [endHour, endMin] = session.endTime.split(':').map(Number);
      const minutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      
      dailyStudyTime[dateStr] = (dailyStudyTime[dateStr] || 0) + minutes;
    });

    const dailyStudyData = Object.entries(dailyStudyTime).map(([date, minutes]) => ({
      date,
      minutes
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Sessions per day count
    const sessionsPerDay = {};
    recentSessions.forEach(session => {
      const dateStr = new Date(session.date).toISOString().split('T')[0];
      sessionsPerDay[dateStr] = (sessionsPerDay[dateStr] || 0) + 1;
    });

    const sessionsPerDayData = Object.entries(sessionsPerDay).map(([date, sessions]) => ({
      date,
      sessions
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Subject distribution (study time)
    const subjectStudyTime = {};
    for (const session of recentSessions) {
      if (session.goal) {
        const goal = await Goal.findById(session.goal).populate('subject');
        if (goal && goal.subject) {
          const subjectName = goal.subject.name;
          const [startHour, startMin] = session.startTime.split(':').map(Number);
          const [endHour, endMin] = session.endTime.split(':').map(Number);
          const minutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
          
          subjectStudyTime[subjectName] = (subjectStudyTime[subjectName] || 0) + minutes;
        }
      }
    }

    const subjectDistributionData = Object.entries(subjectStudyTime).map(([subject, minutes]) => ({
      subject,
      minutes
    }));

    // Deadline timeline
    const upcomingGoals = goals
      .filter(g => new Date(g.deadline) >= now && g.completionStatus !== 'COMPLETED')
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 10)
      .map(g => ({
        title: g.title,
        deadline: g.deadline,
        subject: g.subject?.name || 'Unknown',
        status: g.completionStatus
      }));

    // Total study time (all sessions ever)
    const allSessions = thisStudent.sessions;
    let totalStudyMinutes = 0;
    
    allSessions.forEach(session => {
      const [startHour, startMin] = session.startTime.split(':').map(Number);
      const [endHour, endMin] = session.endTime.split(':').map(Number);
      const minutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      totalStudyMinutes += minutes;
    });

    // Average session time (last 7 days)
    const recentTotalMinutes = Object.values(dailyStudyTime).reduce((sum, min) => sum + min, 0);
    const avgSessionTime = recentSessions.length > 0 ? Math.round(recentTotalMinutes / recentSessions.length) : 0;

    return new Response(JSON.stringify({
      stats: {
        totalGoals,
        completedGoals,
        upcomingDeadlines,
        totalStudyMinutes
      },
      goalStatusData,
      subjectWiseData,
      dailyStudyData,
      sessionsPerDayData,
      subjectDistributionData,
      upcomingGoals,
      avgSessionTime
    }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}