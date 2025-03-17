
import React, { createContext, useContext, useState, useEffect } from "react";

type SubscriptionTier = "free" | "premium" | "pro";

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isSubscribed: boolean;
  features: {
    extendedStats: boolean;
    customThemes: boolean;
    exportData: boolean;
    noAds: boolean;
    prioritySupport: boolean;
  };
  subscribe: (tier: SubscriptionTier) => void;
  cancelSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  tier: "free",
  isSubscribed: false,
  features: {
    extendedStats: false,
    customThemes: false,
    exportData: false,
    noAds: false,
    prioritySupport: false,
  },
  subscribe: () => {},
  cancelSubscription: () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tier, setTier] = useState<SubscriptionTier>(() => {
    const saved = localStorage.getItem("pomodoro-subscription");
    return (saved as SubscriptionTier) || "free";
  });

  const isSubscribed = tier !== "free";

  // Define features based on subscription tier
  const features = {
    extendedStats: isSubscribed,
    customThemes: isSubscribed,
    exportData: tier === "pro",
    noAds: isSubscribed,
    prioritySupport: tier === "pro",
  };

  useEffect(() => {
    localStorage.setItem("pomodoro-subscription", tier);
  }, [tier]);

  const subscribe = (newTier: SubscriptionTier) => {
    setTier(newTier);
    // Here you would typically integrate with a payment processor like Stripe
    console.log(`Subscribed to ${newTier} tier`);
  };

  const cancelSubscription = () => {
    setTier("free");
    console.log("Subscription cancelled");
  };

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isSubscribed,
        features,
        subscribe,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
