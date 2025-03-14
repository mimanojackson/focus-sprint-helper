
import React from "react";
import Timer from "@/components/Timer";
import Layout from "@/components/Layout";
import { useTimer } from "@/context/TimerContext";
import { Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { streak } = useTimer();
  
  return (
    <Layout>
      {streak.currentStreak > 0 && (
        <div className={cn(
          "flex items-center gap-2 text-sm font-medium mb-6 p-2 rounded-full px-4",
          "bg-primary/10 text-primary w-fit mx-auto animate-fade-in"
        )}>
          <Flame size={16} className="text-primary" />
          <span>
            {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''} streak!
          </span>
        </div>
      )}
      
      <Link to="/achievements" className="block mb-6 w-fit mx-auto">
        <Button variant="outline" className="flex items-center gap-2">
          <Trophy size={16} />
          <span>View Achievements</span>
        </Button>
      </Link>
      
      <Timer />
    </Layout>
  );
};

export default Index;
