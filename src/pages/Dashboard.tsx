import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, TrendingUp, LogOut, IndianRupee, ArrowRight,
  Calendar, ChevronRight, Star, Zap, Shield, BarChart3, Loader2,
  Leaf,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";

const sipPlans = [
  { id: 1, name: "Stability SIP", amount: 100, returns: "8-12%", risk: "Low", icon: Shield, popular: false },
  { id: 2, name: "Starter SIP", amount: 500, returns: "12-15%", risk: "Low", icon: Leaf, popular: false },
  { id: 3, name: "Growth SIP", amount: 1000, returns: "15-18%", risk: "Medium", icon: TrendingUp, popular: true },
  { id: 4, name: "Power SIP", amount: 2500, returns: "18-22%", risk: "Medium-High", icon: Zap, popular: false },
  { id: 5, name: "Premium SIP", amount: 5000, returns: "20-25%", risk: "High", icon: Star, popular: false },
  { id: 6, name: "Growth Booster SIP", amount: 10000, returns: "23-28%", risk: "High", icon: Rocket, popular: false },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [userName, setUserName] = useState("Investor");

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate("/");
        return;
      }
      setUserName(authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Investor");
    };
    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handlePayment = async (planName: string, amount: number) => {
    setIsProcessing(true);
    try {
      // Step 1: Create order via edge function
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount,
          currency: 'INR',
          receipt: `sip_${planName.replace(/\s/g, '_')}_${Date.now()}`,
          notes: { plan: planName, user: userName },
        },
      });

      if (error || !data?.order_id) {
        toast({ title: "Order Creation Failed", description: error?.message || "Could not create payment order", variant: "destructive" });
        setIsProcessing(false);
        return;
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "eAisha Invest",
        description: `Monthly SIP - ${planName}`,
        order_id: data.order_id,
        handler: async function (response: any) {
          // Step 3: Verify payment via edge function
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
          });

          if (verifyError || !verifyData?.verified) {
            toast({ title: "Payment Verification Failed", description: "Please contact support", variant: "destructive" });
          } else {
            toast({
              title: "🎉 Payment Successful!",
              description: `SIP of ₹${amount}/month activated. Payment ID: ${response.razorpay_payment_id}`,
            });
          }
          setSelectedPlan(null);
          setIsProcessing(false);
        },
        prefill: { name: userName },
        theme: { color: "#7c3aed" },
        modal: {
          ondismiss: () => {
            toast({ title: "Payment cancelled", variant: "destructive" });
            setIsProcessing(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast({ title: "Razorpay not loaded", description: "Please refresh the page and try again", variant: "destructive" });
        setIsProcessing(false);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
      setIsProcessing(false);
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
            Namaste, <span className="text-primary">{userName}</span> 👋
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
                    disabled={isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayment(plan.name, plan.amount);
                    }}
                  >
                    {isProcessing ? <><Loader2 className="ml-2 w-4 h-4 animate-spin" /> Processing...</> : <>Invest Now <ArrowRight className="ml-2 w-4 h-4" /></>}
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
              disabled={isProcessing}
              onClick={() => {
                const amt = parseInt(customAmount);
                if (!amt || amt < 100) {
                  toast({ title: "Invalid Amount", description: "Minimum SIP amount is ₹100", variant: "destructive" });
                  return;
                }
                handlePayment("Custom SIP", amt);
              }}
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Pay <ChevronRight className="ml-1 w-4 h-4" /></>}
            </Button>
          </div>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
