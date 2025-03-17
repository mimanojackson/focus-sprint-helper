
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Timer, History, Settings, LineChart, CreditCard, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Timer", icon: Timer },
    { path: "/statistics", label: "Statistics", icon: LineChart },
    { path: "/history", label: "History", icon: History },
    { path: "/achievements", label: "Achievements", icon: Trophy },
    { path: "/subscription", label: "Pricing", icon: CreditCard },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="flex h-14 items-center border-b bg-background px-4 lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <Timer className="h-6 w-6" />
          <span className="text-lg font-semibold">Pomodoro</span>
        </Link>
      </header>

      {/* Sidebar Navigation - Desktop */}
      <div className="hidden border-r bg-sidebar-background md:block md:w-64 lg:w-72">
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2">
            <Timer className="h-6 w-6" />
            <span className="text-lg font-semibold">Pomodoro</span>
          </Link>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive(item.path)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-14 w-full justify-around border-t bg-background md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-1 flex-col items-center justify-center",
              isActive(item.path)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
