
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Timer, 
  BarChart, 
  Settings as SettingsIcon,
  Trophy,
  LineChart,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const links = [
    { to: "/", icon: <Timer size={24} />, label: "Timer" },
    { to: "/statistics", icon: <LineChart size={24} />, label: "Statistics" },
    { to: "/history", icon: <BarChart size={24} />, label: "History" },
    { to: "/achievements", icon: <Trophy size={24} />, label: "Achievements" },
    { to: "/subscription", icon: <CreditCard size={24} />, label: "Pricing" },
    { to: "/settings", icon: <SettingsIcon size={24} />, label: "Settings" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/80 backdrop-blur-md md:relative md:bottom-auto md:w-auto md:border-r md:border-t-0 md:pt-4">
      <div className="grid h-16 grid-cols-6 md:h-auto md:grid-cols-1 md:gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center md:h-12 md:flex-row md:gap-2 md:px-4",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {link.icon}
            <span className="text-xs md:text-sm">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
