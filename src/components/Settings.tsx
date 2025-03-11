
import React from "react";
import { useTimer } from "@/context/TimerContext";
import { 
  Clock, Volume2, VolumeX, 
  BellRing, HelpCircle, AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const { 
    focusDuration, 
    breakDuration, 
    setFocusDuration, 
    setBreakDuration,
    isMuted,
    toggleMute
  } = useTimer();

  // Convert seconds to minutes for display
  const focusMinutes = focusDuration / 60;
  const breakMinutes = breakDuration / 60;

  const handleFocusChange = (value: number[]) => {
    setFocusDuration(value[0] * 60);
  };

  const handleBreakChange = (value: number[]) => {
    setBreakDuration(value[0] * 60);
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
            traditionally 25 minutes in length, separated by short breaks. These intervals are known as "pomodoros".
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
