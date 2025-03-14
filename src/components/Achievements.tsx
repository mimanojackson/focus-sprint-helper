
import React from "react";
import { 
  Award, Flame, Star, Trophy, Target,
  CheckCircle2
} from "lucide-react";
import { useTimer } from "@/context/TimerContext";
import { formatDate } from "@/utils/timerUtils";
import { Achievement } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  "award": <Award className="h-6 w-6" />,
  "flame": <Flame className="h-6 w-6" />,
  "star": <Star className="h-6 w-6" />,
  "trophy": <Trophy className="h-6 w-6" />,
  "target": <Target className="h-6 w-6" />
};

const Achievements = () => {
  const { achievements, streak } = useTimer();
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Daily Streak */}
      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Flame className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Your Focus Streak</h3>
            <p className="text-muted-foreground text-sm">Stay consistent to build your streak</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-background rounded-md p-4 border">
            <p className="text-sm text-muted-foreground">Current</p>
            <h2 className="text-3xl font-bold">{streak.currentStreak} {streak.currentStreak === 1 ? "day" : "days"}</h2>
          </div>
          <div className="bg-background rounded-md p-4 border">
            <p className="text-sm text-muted-foreground">Longest</p>
            <h2 className="text-3xl font-bold">{streak.longestStreak} {streak.longestStreak === 1 ? "day" : "days"}</h2>
          </div>
        </div>
      </div>
      
      {/* Achievements */}
      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        <p className="text-sm text-muted-foreground mb-4">
          You've unlocked {unlockedCount} of {totalCount} achievements
        </p>
        
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <AchievementItem key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AchievementItem = ({ achievement }: { achievement: Achievement }) => {
  return (
    <div 
      className={cn(
        "flex items-center p-3 rounded-md border transition-all",
        achievement.unlocked 
          ? "bg-primary/5 border-primary/20" 
          : "bg-muted/40 border-border opacity-60"
      )}
    >
      <div className={cn(
        "mr-4 p-2 rounded-full",
        achievement.unlocked ? "bg-primary/10" : "bg-muted"
      )}>
        {iconMap[achievement.icon]}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{achievement.title}</h3>
          {achievement.unlocked && (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
        {achievement.unlocked && achievement.unlockedAt && (
          <p className="text-xs text-muted-foreground mt-1">
            Unlocked: {formatDate(achievement.unlockedAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Achievements;
