
import React from "react";
import Timer from "@/components/Timer";
import Layout from "@/components/Layout";
import { useTimer } from "@/context/TimerContext";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <Timer />
    </Layout>
  );
};

export default Index;
