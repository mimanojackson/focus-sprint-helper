
import { Achievement } from "@/types";
import { TimerSession } from "@/context/TimerContext";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_focus",
    title: "First Focus",
    description: "Complete your first focus session",
    icon: "award",
    unlocked: false
  },
  {
    id: "focus_streak_3",
    title: "Focus Streak",
    description: "Complete focus sessions 3 days in a row",
    icon: "flame",
    unlocked: false
  },
  {
    id: "five_sessions",
    title: "Getting Productive",
    description: "Complete 5 focus sessions",
    icon: "star",
    unlocked: false
  },
  {
    id: "ten_sessions",
    title: "Productivity Master",
    description: "Complete 10 focus sessions",
    icon: "trophy",
    unlocked: false
  },
  {
    id: "one_hour_focus",
    title: "Deep Worker",
    description: "Accumulate 1 hour of focus time",
    icon: "target",
    unlocked: false
  }
];

export function checkForNewAchievements(
  sessions: TimerSession[],
  currentStreak: number,
  currentAchievements: Achievement[]
): Achievement[] {
  const updatedAchievements = [...currentAchievements];
  const focusSessions = sessions.filter(session => session.type === "focus" && session.completed);
  const totalFocusMinutes = focusSessions.reduce((total, session) => total + session.duration / 60, 0);
  
  // First focus achievement
  const firstFocusAchievement = updatedAchievements.find(a => a.id === "first_focus");
  if (firstFocusAchievement && !firstFocusAchievement.unlocked && focusSessions.length > 0) {
    const index = updatedAchievements.indexOf(firstFocusAchievement);
    updatedAchievements[index] = {
      ...firstFocusAchievement,
      unlocked: true,
      unlockedAt: new Date()
    };
  }
  
  // 3-day streak achievement
  const streakAchievement = updatedAchievements.find(a => a.id === "focus_streak_3");
  if (streakAchievement && !streakAchievement.unlocked && currentStreak >= 3) {
    const index = updatedAchievements.indexOf(streakAchievement);
    updatedAchievements[index] = {
      ...streakAchievement,
      unlocked: true,
      unlockedAt: new Date()
    };
  }
  
  // 5 sessions achievement
  const fiveSessionsAchievement = updatedAchievements.find(a => a.id === "five_sessions");
  if (fiveSessionsAchievement && !fiveSessionsAchievement.unlocked && focusSessions.length >= 5) {
    const index = updatedAchievements.indexOf(fiveSessionsAchievement);
    updatedAchievements[index] = {
      ...fiveSessionsAchievement,
      unlocked: true,
      unlockedAt: new Date()
    };
  }
  
  // 10 sessions achievement
  const tenSessionsAchievement = updatedAchievements.find(a => a.id === "ten_sessions");
  if (tenSessionsAchievement && !tenSessionsAchievement.unlocked && focusSessions.length >= 10) {
    const index = updatedAchievements.indexOf(tenSessionsAchievement);
    updatedAchievements[index] = {
      ...tenSessionsAchievement,
      unlocked: true,
      unlockedAt: new Date()
    };
  }
  
  // 1 hour focus achievement
  const oneHourAchievement = updatedAchievements.find(a => a.id === "one_hour_focus");
  if (oneHourAchievement && !oneHourAchievement.unlocked && totalFocusMinutes >= 60) {
    const index = updatedAchievements.indexOf(oneHourAchievement);
    updatedAchievements[index] = {
      ...oneHourAchievement,
      unlocked: true,
      unlockedAt: new Date()
    };
  }
  
  return updatedAchievements;
}

export function updateDailyStreak(lastActiveDate: string | null): {
  currentStreak: number;
  lastActiveDate: string;
  streakUpdated: boolean;
} {
  const today = new Date().toISOString().split('T')[0];
  
  // If this is the first session ever
  if (!lastActiveDate) {
    return {
      currentStreak: 1,
      lastActiveDate: today,
      streakUpdated: true
    };
  }
  
  // If already active today
  if (lastActiveDate === today) {
    return {
      currentStreak: -1, // Signal no change needed
      lastActiveDate: today,
      streakUpdated: false
    };
  }
  
  const lastActive = new Date(lastActiveDate);
  const currentDate = new Date(today);
  
  // Calculate the difference in days
  const timeDiff = currentDate.getTime() - lastActive.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  if (dayDiff === 1) {
    // Consecutive day
    return {
      currentStreak: -1, // Signal to increment
      lastActiveDate: today,
      streakUpdated: true
    };
  } else if (dayDiff > 1) {
    // Streak broken
    return {
      currentStreak: 1, // Reset to 1
      lastActiveDate: today, 
      streakUpdated: true
    };
  }
  
  // Default case (shouldn't happen)
  return {
    currentStreak: -1,
    lastActiveDate: today,
    streakUpdated: false
  };
}
