import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Achievement, DailyStreak } from "@/types";
import { ACHIEVEMENTS, checkForNewAchievements, updateDailyStreak } from "@/utils/achievementUtils";

export type TimerMode = "focus" | "break";
export type TimerStatus = "idle" | "running" | "paused" | "completed";

export interface TimerSession {
  id: string;
  date: Date;
  duration: number;
  type: TimerMode;
  completed: boolean;
}

interface TimerContextType {
  status: TimerStatus;
  mode: TimerMode;
  timeLeft: number;
  focusDuration: number;
  breakDuration: number;
  sessionsCompleted: number;
  sessions: TimerSession[];
  progress: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  toggleMode: () => void;
  setFocusDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  clearHistory: () => void;
  achievements: Achievement[];
  streak: DailyStreak;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Timer state
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes
  const [focusDuration, setFocusDuration] = useState(25 * 60); // 25 minutes
  const [breakDuration, setBreakDuration] = useState(5 * 60); // 5 minutes
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  // Session history
  const [sessions, setSessions] = useState<TimerSession[]>(() => {
    const savedSessions = localStorage.getItem("focusTimerSessions");
    return savedSessions ? JSON.parse(savedSessions) : [];
  });
  
  // Streak tracking
  const [streak, setStreak] = useState<DailyStreak>(() => {
    const savedStreak = localStorage.getItem("focusTimerStreak");
    return savedStreak ? JSON.parse(savedStreak) : {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null
    };
  });
  
  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const savedAchievements = localStorage.getItem("focusTimerAchievements");
    return savedAchievements ? JSON.parse(savedAchievements) : ACHIEVEMENTS;
  });

  // Timer refs
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const endTimeRef = useRef<number>(0);
  const currentSessionRef = useRef<TimerSession | null>(null);

  // Audio refs
  const focusCompleteSound = useRef<HTMLAudioElement | null>(null);
  const breakCompleteSound = useRef<HTMLAudioElement | null>(null);
  const achievementSound = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on component mount
  useEffect(() => {
    focusCompleteSound.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3");
    breakCompleteSound.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3");
    achievementSound.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3");

    return () => {
      if (focusCompleteSound.current) {
        focusCompleteSound.current = null;
      }
      if (breakCompleteSound.current) {
        breakCompleteSound.current = null;
      }
      if (achievementSound.current) {
        achievementSound.current = null;
      }
    };
  }, []);

  // Save sessions to localStorage when they change
  useEffect(() => {
    localStorage.setItem("focusTimerSessions", JSON.stringify(sessions));
  }, [sessions]);
  
  // Save streak to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("focusTimerStreak", JSON.stringify(streak));
  }, [streak]);
  
  // Save achievements to localStorage when they change
  useEffect(() => {
    localStorage.setItem("focusTimerAchievements", JSON.stringify(achievements));
  }, [achievements]);

  // Timer logic
  useEffect(() => {
    if (status === "running") {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          const newTimeLeft = prev - 1;
          const totalTime = mode === "focus" ? focusDuration : breakDuration;
          setProgress(100 - (newTimeLeft / totalTime) * 100);
          
          if (newTimeLeft <= 0) {
            completeTimer();
            return 0;
          }
          return newTimeLeft;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, mode]);

  // Reset time when mode changes
  useEffect(() => {
    setTimeLeft(mode === "focus" ? focusDuration : breakDuration);
    setProgress(0);
  }, [mode, focusDuration, breakDuration]);

  const startTimer = () => {
    if (status === "idle" || status === "paused") {
      if (status === "idle") {
        startTimeRef.current = Date.now();
        endTimeRef.current = startTimeRef.current + timeLeft * 1000;
        
        // Create new session
        currentSessionRef.current = {
          id: Date.now().toString(),
          date: new Date(),
          duration: mode === "focus" ? focusDuration : breakDuration,
          type: mode,
          completed: false
        };
      }
      
      setStatus("running");
    }
  };

  const pauseTimer = () => {
    if (status === "running") {
      setStatus("paused");
    }
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setTimeLeft(mode === "focus" ? focusDuration : breakDuration);
    setProgress(0);
    setStatus("idle");
    currentSessionRef.current = null;
  };

  const skipTimer = () => {
    if (status === "running" || status === "paused") {
      completeTimer();
    }
  };

  const updateStreakAndAchievements = () => {
    // Update streak
    const streakUpdate = updateDailyStreak(streak.lastActiveDate);
    
    if (streakUpdate.streakUpdated) {
      let newCurrentStreak = streak.currentStreak;
      
      if (streakUpdate.currentStreak === -1) {
        // Increment the current streak
        newCurrentStreak += 1;
      } else {
        // Reset or set to the provided value
        newCurrentStreak = streakUpdate.currentStreak;
      }
      
      const newLongestStreak = Math.max(newCurrentStreak, streak.longestStreak);
      
      setStreak({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: streakUpdate.lastActiveDate
      });
      
      // Check for new achievements
      const newAchievements = checkForNewAchievements(
        sessions, 
        newCurrentStreak,
        achievements
      );
      
      // If new achievements were unlocked
      if (JSON.stringify(newAchievements) !== JSON.stringify(achievements)) {
        setAchievements(newAchievements);
        
        // Find which achievement was just unlocked
        const newlyUnlocked = newAchievements.filter(
          (a, i) => a.unlocked && !achievements[i].unlocked
        );
        
        if (newlyUnlocked.length > 0) {
          // Play achievement sound
          if (!isMuted && achievementSound.current) {
            achievementSound.current.play().catch(e => console.error("Error playing sound:", e));
          }
          
          // Show achievement toast
          newlyUnlocked.forEach(achievement => {
            toast(`🏆 Achievement Unlocked: ${achievement.title}`, {
              description: achievement.description,
              duration: 5000,
            });
          });
        }
      }
    }
  };

  const completeTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Play sound notification if not muted
    if (!isMuted) {
      const sound = mode === "focus" ? focusCompleteSound.current : breakCompleteSound.current;
      if (sound) {
        sound.play().catch(e => console.error("Error playing sound:", e));
      }
    }

    // Show toast notification
    const message = mode === "focus" 
      ? "Focus session completed! Time for a break."
      : "Break time is over. Ready to focus again?";
    
    toast(message, {
      duration: 4000,
    });

    // Save completed session to history if it was a focus session
    if (mode === "focus" && currentSessionRef.current) {
      const completedSession = {
        ...currentSessionRef.current,
        completed: true
      };
      
      setSessions(prev => [completedSession, ...prev]);
      setSessionsCompleted(prev => prev + 1);
      
      // Update streak and check for achievements
      updateStreakAndAchievements();
    }

    // Toggle mode and reset timer
    setMode(mode === "focus" ? "break" : "focus");
    setStatus("idle");
    currentSessionRef.current = null;
  };

  const toggleMode = () => {
    if (status === "idle") {
      setMode(mode === "focus" ? "break" : "focus");
    }
  };

  const updateFocusDuration = (duration: number) => {
    setFocusDuration(duration);
    if (mode === "focus" && status === "idle") {
      setTimeLeft(duration);
    }
  };

  const updateBreakDuration = (duration: number) => {
    setBreakDuration(duration);
    if (mode === "break" && status === "idle") {
      setTimeLeft(duration);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const clearHistory = () => {
    setSessions([]);
    // Don't reset achievements or streak when clearing history
  };

  const value = {
    status,
    mode,
    timeLeft,
    focusDuration,
    breakDuration,
    sessionsCompleted,
    sessions,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    toggleMode,
    setFocusDuration: updateFocusDuration,
    setBreakDuration: updateBreakDuration,
    isMuted,
    toggleMute,
    clearHistory,
    achievements,
    streak
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};
