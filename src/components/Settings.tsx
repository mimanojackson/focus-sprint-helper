
import React from "react";
import { useTimer } from "@/context/TimerContext";
import { useTheme } from "@/context/ThemeContext";
import { 
  Clock, Volume2, VolumeX, 
  BellRing, HelpCircle, AlertTriangle, Watch, Palette 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ThemeColor } from "@/types";

const Settings = () => {
  const { 
    focusDuration, 
    breakDuration,
    longBreakDuration,
    sessionsTillLongBreak,
    setFocusDuration, 
    setBreakDuration,
    setLongBreakDuration,
    setSessionsTillLongBreak,
    isMuted,
    toggleMute
  } = useTimer();

  const { theme, setTheme, allThemes } = useTheme();

  // Convert seconds to minutes for display
  const focusMinutes = focusDuration / 60;
  const breakMinutes = breakDuration / 60;
  const longBreakMinutes = longBreakDuration / 60;

  const handleFocusChange = (value: number[]) => {
    setFocusDuration(value[0] * 60);
  };

  const handleBreakChange = (value: number[]) => {
    setBreakDuration(value[0] * 60);
  };
  
  const handleLongBreakChange = (value: number[]) => {
    setLongBreakDuration(value[0] * 60);
  };
  
  const handleSessionsChange = (value: number[]) => {
    setSessionsTillLongBreak(value[0]);
  };

  return (
    <div className="max-w-md mx-auto py-4 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground">Customize your timer preferences</p>
      </div>

      <div className="space-y-6">
        {/* Focus Duration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="focus-duration" className="flex items-center">
              <Clock size={16} className="mr-2" />
              Focus Duration
            </Label>
            <span className="text-sm font-medium">{focusMinutes} min</span>
          </div>
          <Slider
            id="focus-duration"
            min={5}
            max={60}
            step={5}
            value={[focusMinutes]}
            onValueChange={handleFocusChange}
            className="w-full"
          />
        </div>

        {/* Break Duration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="break-duration" className="flex items-center">
              <Clock size={16} className="mr-2" />
              Break Duration
            </Label>
            <span className="text-sm font-medium">{breakMinutes} min</span>
          </div>
          <Slider
            id="break-duration"
            min={1}
            max={15}
            step={1}
            value={[breakMinutes]}
            onValueChange={handleBreakChange}
            className="w-full"
          />
        </div>
        
        {/* Long Break Duration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="long-break-duration" className="flex items-center">
              <Watch size={16} className="mr-2" />
              Long Break Duration
            </Label>
            <span className="text-sm font-medium">{longBreakMinutes} min</span>
          </div>
          <Slider
            id="long-break-duration"
            min={10}
            max={30}
            step={5}
            value={[longBreakMinutes]}
            onValueChange={handleLongBreakChange}
            className="w-full"
          />
        </div>
        
        {/* Sessions until Long Break */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="sessions-till-long-break" className="flex items-center">
              <Clock size={16} className="mr-2" />
              Sessions until Long Break
            </Label>
            <span className="text-sm font-medium">{sessionsTillLongBreak}</span>
          </div>
          <Slider
            id="sessions-till-long-break"
            min={2}
            max={6}
            step={1}
            value={[sessionsTillLongBreak]}
            onValueChange={handleSessionsChange}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Number of focus sessions to complete before a long break
          </p>
        </div>

        <Separator />

        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="flex items-center">
            <Palette size={16} className="mr-2" />
            Theme Color
          </Label>
          <div className="flex flex-wrap gap-3">
            {Object.entries(allThemes).map(([key, themeOption]) => (
              <button
                key={key}
                onClick={() => setTheme(key as ThemeColor)}
                className={`w-10 h-10 rounded-full transition-all ${
                  theme.name === key 
                    ? 'ring-2 ring-offset-2 ring-primary scale-110' 
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: themeOption.primaryColor }}
                aria-label={`${key} theme`}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Sound Setting */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sound-notifications" className="flex items-center">
              <BellRing size={16} className="mr-2" />
              Sound Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Play a sound when a timer completes
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-muted-foreground hover:text-foreground"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
        </div>

        <Separator />

        {/* About Section */}
        <div className="bg-card rounded-lg p-4">
          <h3 className="text-sm font-medium flex items-center mb-2">
            <HelpCircle size={16} className="mr-2" />
            About the Pomodoro Technique
          </h3>
          <p className="text-sm text-muted-foreground">
            The Pomodoro Technique is a time management method that uses a timer to break work into intervals, 
            traditionally 25 minutes in length, separated by short breaks. After completing a set of pomodoros 
            (usually 4), take a longer break of 15-30 minutes to recharge.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted rounded-lg p-4">
          <h3 className="text-sm font-medium flex items-center mb-2">
            <AlertTriangle size={16} className="mr-2" />
            Export for Play Store
          </h3>
          <p className="text-sm text-muted-foreground">
            To export this app as an APK for Play Store submission, you'll need to follow the Capacitor guide for 
            generating a signed APK. This involves setting up your developer account and creating signing keys.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
