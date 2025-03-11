
import React from "react";
import { 
  Play, Pause, RotateCcw, SkipForward, 
  Volume2, VolumeX, Coffee, Brain 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTimer } from "@/context/TimerContext";
import { formatTime } from "@/utils/timerUtils";

const Timer = () => {
  const {
    status,
    mode,
    timeLeft,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    toggleMode,
    isMuted,
    toggleMute,
  } = useTimer();

  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isFocusMode = mode === "focus";

  // SVG Circle properties
  const circleRadius = 120;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const dashOffset = circleCircumference - (progress / 100) * circleCircumference;

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto animate-fade-in">
      {/* Mode toggle */}
      <div className="flex justify-center mb-8 space-x-4">
        <Button
          variant={isFocusMode ? "default" : "outline"}
          size="sm"
          onClick={() => isFocusMode ? null : toggleMode()}
          className={cn(
            "gap-2 px-4 py-2 transition-all duration-300",
            isFocusMode 
              ? "bg-primary text-primary-foreground" 
              : "hover:text-primary"
          )}
          disabled={isRunning || isPaused}
        >
          <Brain size={16} />
          <span>Focus</span>
        </Button>
        
        <Button
          variant={!isFocusMode ? "default" : "outline"}
          size="sm"
          onClick={() => !isFocusMode ? null : toggleMode()}
          className={cn(
            "gap-2 px-4 py-2 transition-all duration-300",
            !isFocusMode 
              ? "bg-primary text-primary-foreground" 
              : "hover:text-primary"
          )}
          disabled={isRunning || isPaused}
        >
          <Coffee size={16} />
          <span>Break</span>
        </Button>
      </div>

      {/* Timer circle */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Background pulse animation for running timer */}
        {isRunning && (
          <div className="absolute rounded-full w-[270px] h-[270px] animate-pulse-ring opacity-20 bg-primary" />
        )}
        
        {/* Main timer circle */}
        <div className="relative flex items-center justify-center w-[260px] h-[260px] rounded-full bg-background shadow-lg focus-shadow">
          {/* Timer SVG */}
          <svg width="260" height="260" viewBox="0 0 260 260" className={cn(
            "absolute transform -rotate-90",
            isRunning && "transition-all duration-300 ease-linear"
          )}>
            {/* Background circle */}
            <circle
              cx="130"
              cy="130"
              r={circleRadius}
              className="stroke-border"
              strokeWidth="4"
              fill="none"
            />
            
            {/* Progress circle */}
            <circle
              cx="130"
              cy="130"
              r={circleRadius}
              className="stroke-primary progress-circle"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circleCircumference}
              strokeDashoffset={dashOffset}
              fill="none"
            />
          </svg>

          {/* Time display */}
          <div className="flex flex-col items-center z-10">
            <h2 className="text-6xl font-light tracking-tighter mb-2">
              {formatTime(timeLeft)}
            </h2>
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {status === "idle" 
                ? "Ready to start" 
                : status === "running" 
                  ? isFocusMode ? "Focus time" : "Break time"
                  : status === "paused" 
                    ? "Paused" 
                    : "Completed"}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <Button
          size="icon"
          variant="outline"
          className="w-12 h-12 rounded-full"
          onClick={resetTimer}
          disabled={status === "idle"}
        >
          <RotateCcw size={20} />
        </Button>
        
        {isRunning ? (
          <Button
            size="icon"
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 transition-all shadow-lg"
            onClick={pauseTimer}
          >
            <Pause size={26} />
          </Button>
        ) : (
          <Button
            size="icon"
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 transition-all shadow-lg"
            onClick={startTimer}
          >
            <Play size={26} className="ml-1" />
          </Button>
        )}
        
        <Button
          size="icon"
          variant="outline"
          className="w-12 h-12 rounded-full"
          onClick={skipTimer}
          disabled={status === "idle" || status === "completed"}
        >
          <SkipForward size={20} />
        </Button>
      </div>

      {/* Sound toggle */}
      <Button
        size="sm"
        variant="ghost"
        onClick={toggleMute}
        className="text-muted-foreground hover:text-foreground"
      >
        {isMuted ? (
          <><VolumeX size={16} className="mr-2" /> Sound Off</>
        ) : (
          <><Volume2 size={16} className="mr-2" /> Sound On</>
        )}
      </Button>
    </div>
  );
};

export default Timer;
