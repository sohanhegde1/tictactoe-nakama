import { cn } from "@/lib/utils";
import { Home, Trophy, User } from "lucide-react";
import { useLocation, Link } from "wouter";

const navItems = [
  { path: "/", icon: Home, label: "Play" },
  { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const [location] = useLocation();
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      data-testid="bottom-nav"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          
          return (
            <Link 
              key={path} 
              href={path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg",
                "transition-colors min-w-[64px]",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover-elevate"
              )}
              data-testid={`nav-${label.toLowerCase()}`}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
