import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Bell, Shield, CreditCard, FileText, HelpCircle,
  ChevronRight, LogOut, Star, Share2, Moon, Globe, Lock,
  Smartphone, MessageSquare, Info, Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/BottomNav";

type MenuItem = {
  icon: React.ElementType;
  label: string;
  desc?: string;
  action?: () => void;
  toggle?: boolean;
  danger?: boolean;
  badge?: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const MorePage = () => {
  const navigate = useNavigate();

  const sections: MenuSection[] = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Personal Details", desc: "Name, email, phone" },
        { icon: Shield, label: "KYC Verification", desc: "Complete your KYC", badge: "Pending" },
        { icon: CreditCard, label: "Bank Accounts", desc: "Manage linked accounts" },
        { icon: Lock, label: "Security", desc: "Password, 2FA settings" },
      ],
    },
    {
      title: "Investments",
      items: [
        { icon: FileText, label: "Transaction History", desc: "View all transactions", action: () => navigate("/transactions") },
        { icon: Star, label: "My Watchlist", desc: "Saved funds & plans" },
        { icon: FileText, label: "Statements & Reports", desc: "Download reports" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", desc: "Manage alerts", toggle: true },
        { icon: Moon, label: "Dark Mode", desc: "Toggle dark theme", toggle: true },
        { icon: Globe, label: "Language", desc: "English" },
        { icon: Smartphone, label: "App Lock", desc: "Biometric / PIN", toggle: true },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & FAQ", desc: "Get answers" },
        { icon: MessageSquare, label: "Contact Support", desc: "Chat with us" },
        { icon: Share2, label: "Refer & Earn", desc: "Invite friends, earn rewards" },
        { icon: Info, label: "About eAisha", desc: "Version 1.0.0" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto flex items-center gap-3 py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">Profile</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24 max-w-3xl space-y-5 animate-fade-in">
        {/* Profile Card */}
        <Card className="p-5 rounded-2xl shadow-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              A
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">Aarav Sharma</h2>
              <p className="text-sm text-muted-foreground">aarav@example.com</p>
              <p className="text-xs text-muted-foreground">+91 98765 43210</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </Card>

        {/* Investment Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 rounded-2xl shadow-card border-border text-center">
            <p className="text-[10px] text-muted-foreground">Total Invested</p>
            <p className="text-sm font-bold text-foreground mt-1">₹18,000</p>
          </Card>
          <Card className="p-3 rounded-2xl shadow-card border-border text-center">
            <p className="text-[10px] text-muted-foreground">Current Value</p>
            <p className="text-sm font-bold text-green-500 mt-1">₹19,190</p>
          </Card>
          <Card className="p-3 rounded-2xl shadow-card border-border text-center">
            <p className="text-[10px] text-muted-foreground">Active SIPs</p>
            <p className="text-sm font-bold text-primary mt-1">4</p>
          </Card>
        </div>

        {/* Menu Sections */}
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h3>
            <Card className="rounded-2xl shadow-card border-border overflow-hidden divide-y divide-border">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/50 ${
                    item.danger ? "text-destructive" : ""
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.danger ? "bg-destructive/10" : "bg-secondary"
                  }`}>
                    <item.icon className={`w-4.5 h-4.5 ${item.danger ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${item.danger ? "text-destructive" : "text-foreground"}`}>
                        {item.label}
                      </p>
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.desc && <p className="text-xs text-muted-foreground truncate">{item.desc}</p>}
                  </div>
                  {item.toggle ? (
                    <Switch />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>
              ))}
            </Card>
          </div>
        ))}

        {/* Logout */}
        <Card className="rounded-2xl shadow-card border-border overflow-hidden">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-destructive/5"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-destructive/10">
              <LogOut className="w-4.5 h-4.5 text-destructive" />
            </div>
            <p className="text-sm font-medium text-destructive">Log Out</p>
          </button>
        </Card>

        <p className="text-center text-xs text-muted-foreground pb-4">eAisha Invest v1.0.0</p>
      </main>
      <BottomNav />
    </div>
  );
};

export default MorePage;
