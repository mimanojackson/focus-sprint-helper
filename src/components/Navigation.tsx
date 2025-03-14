
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Timer, 
  BarChart, 
  Settings as SettingsIcon,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const links = [
    { to: "/", icon: <Timer size={24} />, label: "Timer" },
    { to: "/history", icon: <BarChart size={24} />, label: "History" },
    { to: "/achievements", icon: <Trophy size={24} />, label: "Achievements" },
    { to: "/settings", icon: <SettingsIcon size={24} />, label: "Settings" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/80 backdrop-blur-md md:relative md:bottom-auto md:w-auto md:border-r md:border-t-0 md:pt-4">
      <div className="grid h-16 grid-cols-4 md:h-auto md:grid-cols-1 md:gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex h-full flex-col items-center justify-center gap-1 p-2 text-xs font-medium md:h-auto md:flex-row md:justify-start md:gap-2 md:px-3 md:py-2 md:text-sm",
                "text-muted-foreground hover:text-foreground",
                isActive && "bg-background text-foreground"
              )
            }
          >
            <span className="md:w-5">{link.icon}</span>
            <span className="sr-only md:not-sr-only">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
