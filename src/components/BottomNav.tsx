import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, TrendingUp, Wallet, MoreHorizontal } from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Home", icon: Home },
  { path: "/calculator", label: "Invest", icon: TrendingUp, highlight: true },
  { path: "/portfolio", label: "Portfolio", icon: Wallet },
  { path: "/transactions", label: "More", icon: MoreHorizontal },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
      <div className="glass-card rounded-2xl shadow-elevated px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.highlight) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "gradient-primary text-primary-foreground shadow-sm"
                    : "gradient-primary text-primary-foreground shadow-sm opacity-90 hover:opacity-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`p-2.5 rounded-xl transition-all ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
