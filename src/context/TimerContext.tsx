
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Achievement, DailyStreak, TimerMode } from "@/types";
import { ACHIEVEMENTS, checkForNewAchievements, updateDailyStreak } from "@/utils/achievementUtils";

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
  longBreakDuration: number;
  sessionsCompleted: number;
  sessionsTillLongBreak: number;
  sessions: TimerSession[];
  progress: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  toggleMode: () => void;
  setFocusDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
  setLongBreakDuration: (duration: number) => void;
  setSessionsTillLongBreak: (sessions: number) => void;
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
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60); // 15 minutes
  const [sessionsTillLongBreak, setSessionsTillLongBreak] = useState(4); // Default 4 sessions
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
  const focusSessionsCompletedRef = useRef<number>(0);

  // Audio refs
  const focusCompleteSound = useRef<HTMLAudioElement | null>(null);
  const breakCompleteSound = useRef<HTMLAudioElement | null>(null);
  const longBreakCompleteSound = useRef<HTMLAudioElement | null>(null);
  const achievementSound = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on component mount
  useEffect(() => {
    focusCompleteSound.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3");
    breakCompleteSound.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3");
    longBreakCompleteSound.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-magical-bell-notification-2353.mp3");
    achievementSound.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3");

    return () => {
      if (focusCompleteSound.current) {
        focusCompleteSound.current = null;
      }
      if (breakCompleteSound.current) {
        breakCompleteSound.current = null;
      }
      if (longBreakCompleteSound.current) {
        longBreakCompleteSound.current = null;
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
          const totalTime = mode === "focus" 
            ? focusDuration 
            : mode === "break" 
              ? breakDuration 
              : longBreakDuration;
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
    const duration = mode === "focus" 
      ? focusDuration 
      : mode === "break" 
        ? breakDuration 
        : longBreakDuration;
    setTimeLeft(duration);
    setProgress(0);
  }, [mode, focusDuration, breakDuration, longBreakDuration]);

  const startTimer = () => {
    if (status === "idle" || status === "paused") {
      if (status === "idle") {
        startTimeRef.current = Date.now();
        endTimeRef.current = startTimeRef.current + timeLeft * 1000;
        
        // Create new session
        currentSessionRef.current = {
          id: Date.now().toString(),
          date: new Date(),
          duration: mode === "focus" 
            ? focusDuration 
            : mode === "break" 
              ? breakDuration 
              : longBreakDuration,
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
    
    setTimeLeft(mode === "focus" 
      ? focusDuration 
      : mode === "break" 
        ? breakDuration 
        : longBreakDuration);
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

    // Handle focus session completion
    if (mode === "focus") {
      // Update focus sessions completed count
      focusSessionsCompletedRef.current += 1;
      
      // Save completed session to history
      if (currentSessionRef.current) {
        const completedSession = {
          ...currentSessionRef.current,
          completed: true
        };
        
        setSessions(prev => [completedSession, ...prev]);
        setSessionsCompleted(prev => prev + 1);
        
        // Update streak and check for achievements
        updateStreakAndAchievements();
      }
      
      // Check if we should take a long break
      const shouldTakeLongBreak = focusSessionsCompletedRef.current >= sessionsTillLongBreak;
      
      // Set next mode
      setMode(shouldTakeLongBreak ? "longBreak" : "break");
      
      // Reset focus sessions count if taking a long break
      if (shouldTakeLongBreak) {
        focusSessionsCompletedRef.current = 0;
      }
      
      // Play sound notification if not muted
      if (!isMuted) {
        if (focusCompleteSound.current) {
          focusCompleteSound.current.play().catch(e => console.error("Error playing sound:", e));
        }
      }
      
      // Show toast notification
      const nextBreakText = shouldTakeLongBreak 
        ? "Time for a longer break!"
        : "Time for a break.";
      
      toast("Focus session completed!", {
        description: nextBreakText,
        duration: 4000,
      });
    } 
    // Handle break completion
    else if (mode === "break" || mode === "longBreak") {
      const isLongBreak = mode === "longBreak";
      
      // Play sound notification if not muted
      if (!isMuted) {
        const sound = isLongBreak ? longBreakCompleteSound.current : breakCompleteSound.current;
        if (sound) {
          sound.play().catch(e => console.error("Error playing sound:", e));
        }
      }
      
      // Show toast notification
      toast(isLongBreak ? "Long break completed!" : "Break time is over.", {
        description: "Ready to focus again?",
        duration: 4000,
      });
      
      // Set next mode back to focus
      setMode("focus");
    }

    // Reset timer state
    setStatus("idle");
    currentSessionRef.current = null;
  };

  const toggleMode = () => {
    if (status === "idle") {
      // Cycle through the modes: focus -> break -> longBreak -> focus
      if (mode === "focus") {
        setMode("break");
      } else if (mode === "break") {
        setMode("longBreak");
      } else {
        setMode("focus");
      }
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
  
  const updateLongBreakDuration = (duration: number) => {
    setLongBreakDuration(duration);
    if (mode === "longBreak" && status === "idle") {
      setTimeLeft(duration);
    }
  };
  
  const updateSessionsTillLongBreak = (sessions: number) => {
    setSessionsTillLongBreak(sessions);
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
    longBreakDuration,
    sessionsCompleted,
    sessionsTillLongBreak,
    sessions,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    toggleMode,
    setFocusDuration: updateFocusDuration,
    setBreakDuration: updateBreakDuration,
    setLongBreakDuration: updateLongBreakDuration,
    setSessionsTillLongBreak: updateSessionsTillLongBreak,
    isMuted,
    toggleMute,
    clearHistory,
    achievements,
    streak
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};
