
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export type TimerMode = "focus" | "break" | "longBreak";

export type ThemeColor = "blue" | "purple" | "green" | "orange" | "pink";

export interface Theme {
  name: ThemeColor;
  primaryColor: string;
  primaryHue: number;
}
