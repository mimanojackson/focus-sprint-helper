
import { DailyStats, WeeklyStats } from "@/types";

/**
 * Formats seconds into a MM:SS time string
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a date into a human-readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}

/**
 * Calculates percentage completion
 */
export function calculateProgress(current: number, total: number): number {
  return ((total - current) / total) * 100;
}

/**
 * Calculates the total focus time from sessions in minutes
 */
export function calculateTotalFocusTime(sessions: { duration: number; type: string; completed: boolean }[]): number {
  return sessions
    .filter(session => session.type === 'focus' && session.completed)
    .reduce((total, session) => total + session.duration, 0) / 60;
}

/**
 * Returns a human-readable time string from minutes
 */
export function formatTotalTime(minutes: number): string {
  if (minutes < 60) {
    return `${Math.floor(minutes)} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return remainingMinutes > 0 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`;
  }
}

/**
 * Groups sessions by day
 */
export function groupSessionsByDay(sessions: { date: Date | string; duration: number; type: string; completed: boolean }[]): DailyStats[] {
  const dailyStats: Record<string, DailyStats> = {};
  
  sessions.forEach(session => {
    if (session.type === 'focus' && session.completed) {
      const sessionDate = new Date(session.date);
      const dateKey = sessionDate.toISOString().split('T')[0];
      
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = {
          date: dateKey,
          focusMinutes: 0,
          sessionsCompleted: 0
        };
      }
      
      dailyStats[dateKey].focusMinutes += session.duration / 60;
      dailyStats[dateKey].sessionsCompleted += 1;
    }
  });
  
  return Object.values(dailyStats).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Groups sessions by week
 */
export function groupSessionsByWeek(dailyStats: DailyStats[]): WeeklyStats[] {
  const weeklyStats: Record<string, WeeklyStats> = {};
  
  dailyStats.forEach(dayStat => {
    const date = new Date(dayStat.date);
    const dayOfWeek = date.getDay();
    const weekStartDate = new Date(date);
    weekStartDate.setDate(date.getDate() - dayOfWeek);
    const weekKey = weekStartDate.toISOString().split('T')[0];
    
    if (!weeklyStats[weekKey]) {
      weeklyStats[weekKey] = {
        weekStartDate: weekKey,
        totalFocusMinutes: 0,
        totalSessions: 0,
        dailyStats: []
      };
    }
    
    weeklyStats[weekKey].dailyStats.push(dayStat);
    weeklyStats[weekKey].totalFocusMinutes += dayStat.focusMinutes;
    weeklyStats[weekKey].totalSessions += dayStat.sessionsCompleted;
  });
  
  return Object.values(weeklyStats).sort((a, b) => 
    new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime()
  );
}

/**
 * Formats a date for display in charts
 */
export function formatChartDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

/**
 * Gets the last 7 days of data, filling in missing days with zeros
 */
export function getLast7DaysData(sessions: { date: Date | string; duration: number; type: string; completed: boolean }[]): DailyStats[] {
  const result: DailyStats[] = [];
  const dailyStats = groupSessionsByDay(sessions);
  
  // Create a map of existing stats
  const statsMap: Record<string, DailyStats> = {};
  dailyStats.forEach(stat => {
    statsMap[stat.date] = stat;
  });
  
  // Generate the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    
    result.push(statsMap[dateKey] || {
      date: dateKey,
      focusMinutes: 0,
      sessionsCompleted: 0
    });
  }
  
  return result;
}
