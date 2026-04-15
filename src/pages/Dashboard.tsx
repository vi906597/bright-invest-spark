import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, TrendingUp, LogOut, IndianRupee, ArrowRight,
  Calendar, ChevronRight, Star, Zap, Shield, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

const sipPlans = [
  { id: 1, name: "Starter SIP", amount: 500, returns: "12-15%", risk: "Low", icon: Shield, popular: false },
  { id: 2, name: "Growth SIP", amount: 1000, returns: "15-18%", risk: "Medium", icon: TrendingUp, popular: true },
  { id: 3, name: "Power SIP", amount: 2500, returns: "18-22%", risk: "Medium-High", icon: Zap, popular: false },
  { id: 4, name: "Premium SIP", amount: 5000, returns: "20-25%", risk: "High", icon: Star, popular: false },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("eaisha_user") || '{"name":"Investor","email":""}');
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("eaisha_user");
    navigate("/");
  };

  const handlePayment = (planName: string, amount: number) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag",
      amount: amount * 100,
      currency: "INR",
      name: "eAisha Invest",
      description: `Monthly SIP - ${planName}`,
      image: "",
      handler: function (response: any) {
        toast({
          title: "🎉 Payment Successful!",
          description: `SIP of ₹${amount}/month activated. Payment ID: ${response.razorpay_payment_id}`,
        });
        setSelectedPlan(null);
      },
      prefill: { name: user.name, email: user.email },
      theme: { color: "#7c3aed" },
      modal: {
        ondismiss: () => toast({ title: "Payment cancelled", variant: "destructive" }),
      },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      toast({ title: "Demo Mode", description: `SIP of ₹${amount}/month for ${planName} would be processed via Razorpay.` });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">eAisha Invest</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-xl text-destructive">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-24 max-w-5xl">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">
            Namaste, <span className="text-primary">{user.name}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">Start your wealth creation journey with monthly SIP</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Invested", value: "₹0", icon: IndianRupee, color: "text-primary" },
            { label: "Current Value", value: "₹0", icon: TrendingUp, color: "text-green-500" },
            { label: "Active SIPs", value: "0", icon: Calendar, color: "text-accent" },
          ].map((stat) => (
            <Card key={stat.label} className="p-5 rounded-2xl shadow-card border-border hover:shadow-elevated transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* SIP Plans */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Monthly SIP Plans
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sipPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all border-2 hover:shadow-elevated ${
                  selectedPlan === plan.id ? "border-primary shadow-elevated" : "border-transparent shadow-card"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <span className="absolute top-3 right-3 text-xs font-semibold gradient-primary text-primary-foreground px-3 py-1 rounded-full">
                    Popular
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <plan.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-primary">₹{plan.amount.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-muted-foreground">Returns: <span className="text-foreground font-medium">{plan.returns}</span></span>
                      <span className="text-muted-foreground">Risk: <span className="text-foreground font-medium">{plan.risk}</span></span>
                    </div>
                  </div>
                </div>

                {selectedPlan === plan.id && (
                  <Button
                    className="w-full mt-4 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayment(plan.name, plan.amount);
                    }}
                  >
                    Invest Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Custom SIP */}
        <Card className="p-6 rounded-2xl shadow-card border-border">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-primary" /> Custom SIP Amount
          </h3>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
              <input
                type="number"
                placeholder="Enter amount (min ₹100)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min={100}
                className="w-full h-12 pl-8 pr-4 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              className="h-12 px-6 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90"
              onClick={() => {
                const amt = parseInt(customAmount);
                if (!amt || amt < 100) {
                  toast({ title: "Invalid Amount", description: "Minimum SIP amount is ₹100", variant: "destructive" });
                  return;
                }
                handlePayment("Custom SIP", amt);
              }}
            >
              Pay <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
