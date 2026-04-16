import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Bell, Shield, CreditCard, FileText, HelpCircle,
  ChevronRight, LogOut, Star, Share2, Moon, Globe, Lock,
  Smartphone, MessageSquare, Info, Sparkles, Mail, Phone,
  CheckCircle, AlertCircle, Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MorePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate("/");
        return;
      }
      setUser(authUser);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      setProfile(profileData);
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email Sent! 📧", description: "Verification email bhej diya gaya hai." });
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const emailVerified = user?.email_confirmed_at ? true : false;
  const phoneNumber = profile?.phone || user?.user_metadata?.phone || "";
  const initials = displayName.charAt(0).toUpperCase();

  const sections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Personal Details", desc: `${displayName} • ${user?.email || ""}` },
        {
          icon: Mail,
          label: "Email Verification",
          desc: user?.email || "",
          badge: emailVerified ? "Verified" : "Unverified",
          badgeColor: emailVerified ? "text-green-500 bg-green-500/10" : "text-amber-500 bg-amber-500/10",
          action: !emailVerified ? handleResendVerification : undefined,
        },
        {
          icon: Phone,
          label: "Phone Number",
          desc: phoneNumber ? `+91 ${phoneNumber}` : "Not added",
          badge: profile?.phone_verified ? "Verified" : phoneNumber ? "Unverified" : "Add",
          badgeColor: profile?.phone_verified ? "text-green-500 bg-green-500/10" : "text-amber-500 bg-amber-500/10",
        },
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {phoneNumber && <p className="text-xs text-muted-foreground">+91 {phoneNumber}</p>}
            </div>
            <div className="flex items-center gap-1">
              {emailVerified ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>
          </div>
        </Card>

        {/* Verification Alert */}
        {!emailVerified && (
          <Card className="p-4 rounded-2xl border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Email Verify Karein</p>
                <p className="text-xs text-muted-foreground">Aapka email abhi verified nahi hai</p>
              </div>
              <Button size="sm" onClick={handleResendVerification} className="rounded-xl text-xs gradient-primary text-primary-foreground">
                Resend
              </Button>
            </div>
          </Card>
        )}

        {/* Investment Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 rounded-2xl shadow-card border-border text-center">
            <p className="text-[10px] text-muted-foreground">Total Invested</p>
            <p className="text-sm font-bold text-foreground mt-1">₹0</p>
          </Card>
          <Card className="p-3 rounded-2xl shadow-card border-border text-center">
            <p className="text-[10px] text-muted-foreground">Current Value</p>
            <p className="text-sm font-bold text-green-500 mt-1">₹0</p>
          </Card>
          <Card className="p-3 rounded-2xl shadow-card border-border text-center">
            <p className="text-[10px] text-muted-foreground">Active SIPs</p>
            <p className="text-sm font-bold text-primary mt-1">0</p>
          </Card>
        </div>

        {/* Menu Sections */}
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h3>
            <Card className="rounded-2xl shadow-card border-border overflow-hidden divide-y divide-border">
              {section.items.map((item: any) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/50"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-secondary">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      {item.badge && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || "bg-amber-500/10 text-amber-500"}`}>
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
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-destructive/5"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-destructive/10">
              <LogOut className="w-4 h-4 text-destructive" />
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
