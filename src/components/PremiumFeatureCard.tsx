
import React from "react";
import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  isLocked: boolean;
  className?: string;
}

export const PremiumFeatureCard = ({
  title,
  description,
  children,
  isLocked,
  className
}: PremiumFeatureCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {isLocked && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 p-4">
          <div className="mb-4 p-3 rounded-full bg-muted">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm text-center mb-4">{description}</p>
          <Button onClick={() => navigate("/subscription")}>Upgrade to Unlock</Button>
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
