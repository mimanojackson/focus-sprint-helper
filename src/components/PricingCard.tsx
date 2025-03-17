
import React from "react";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/context/SubscriptionContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PricingCardProps {
  tier: "free" | "premium" | "pro";
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const PricingCard = ({
  tier,
  name,
  price,
  description,
  features,
  highlighted = false,
}: PricingCardProps) => {
  const { subscribe, tier: currentTier } = useSubscription();
  const { toast } = useToast();
  
  const handleSubscribe = () => {
    subscribe(tier);
    toast({
      title: `Subscribed to ${name}!`,
      description: "Thank you for your subscription.",
    });
  };

  const isCurrentTier = currentTier === tier;

  return (
    <Card className={cn(
      "flex flex-col", 
      highlighted ? "border-primary shadow-lg" : "",
      isCurrentTier ? "bg-muted/30" : ""
    )}>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="text-2xl font-bold">{price}</CardDescription>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubscribe} 
          className="w-full" 
          variant={highlighted ? "default" : "outline"}
          disabled={isCurrentTier}
        >
          {isCurrentTier ? "Current Plan" : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
};
