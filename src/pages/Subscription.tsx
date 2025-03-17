
import React from "react";
import Layout from "@/components/Layout";
import { PricingCard } from "@/components/PricingCard";
import { useSubscription } from "@/context/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Subscription = () => {
  const { tier, cancelSubscription } = useSubscription();
  const { toast } = useToast();

  const handleCancelSubscription = () => {
    cancelSubscription();
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription has been cancelled successfully.",
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Upgrade your productivity with our premium features
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <PricingCard
            tier="free"
            name="Free"
            price="$0"
            description="Basic features for starters"
            features={[
              "Basic timer functionality",
              "Session history",
              "Daily statistics",
              "Basic achievements"
            ]}
          />
          
          <PricingCard
            tier="premium"
            name="Premium"
            price="$4.99/month"
            description="Enhanced features for productivity enthusiasts"
            features={[
              "All Free features",
              "Detailed statistics & insights",
              "Custom themes",
              "No advertisements",
              "Cloud sync"
            ]}
            highlighted={true}
          />
          
          <PricingCard
            tier="pro"
            name="Professional"
            price="$9.99/month"
            description="Maximum productivity for professionals"
            features={[
              "All Premium features",
              "Data export (CSV/JSON)",
              "Team functionality",
              "Priority support",
              "Advanced analytics"
            ]}
          />
        </div>

        {tier !== "free" && (
          <div className="mt-8 text-center">
            <p className="mb-2 text-muted-foreground">Need to cancel your current subscription?</p>
            <Button variant="outline" onClick={handleCancelSubscription}>
              Cancel Subscription
            </Button>
          </div>
        )}

        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>All plans include a 14-day free trial. No credit card required.</p>
          <p className="mt-1">Subscription can be cancelled at any time.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
