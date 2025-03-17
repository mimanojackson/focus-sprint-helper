
import React from "react";
import Dashboard from "@/components/Dashboard";
import Layout from "@/components/Layout";
import { useSubscription } from "@/context/SubscriptionContext";
import { PremiumFeatureCard } from "@/components/PremiumFeatureCard";
import { LineChart, BarChart3, PieChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Statistics = () => {
  const { features } = useSubscription();
  
  return (
    <Layout>
      <div className="container py-6">
        <Dashboard />
        
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <PremiumFeatureCard
            title="Advanced Analytics"
            description="Get deeper insights into your productivity patterns"
            isLocked={!features.extendedStats}
          >
            <div className="h-64 flex items-center justify-center">
              <LineChart size={64} className="text-muted-foreground/50" />
            </div>
          </PremiumFeatureCard>
          
          <PremiumFeatureCard
            title="Productivity Trends"
            description="View long-term trends and improvements"
            isLocked={!features.extendedStats}
          >
            <div className="h-64 flex items-center justify-center">
              <BarChart3 size={64} className="text-muted-foreground/50" />
            </div>
          </PremiumFeatureCard>
          
          <PremiumFeatureCard
            title="Category Analysis"
            description="See how you spend your focus time across projects"
            isLocked={!features.extendedStats}
            className="md:col-span-2"
          >
            <div className="h-64 flex items-center justify-center">
              <PieChart size={64} className="text-muted-foreground/50" />
            </div>
          </PremiumFeatureCard>
        </div>
      </div>
    </Layout>
  );
};

export default Statistics;
