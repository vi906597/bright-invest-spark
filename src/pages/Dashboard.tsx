import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
Sparkles,
TrendingUp,
LogOut,
IndianRupee,
ArrowRight,
Calendar,
ChevronRight,
Star,
Zap,
Shield,
BarChart3,
Loader2,
Leaf,
Rocket,
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

type TransactionRow = {
amount: number | string | null;
current_value: number | string | null;
status: string | null;
type: string | null;
plan_name: string | null;
};

type InterestRow = {
amount: number | string | null;
credit_date: string | null;
};

const Dashboard = () => {
const navigate = useNavigate();
const { toast } = useToast();

const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
const [customAmount, setCustomAmount] = useState("");
const [isProcessing, setIsProcessing] = useState(false);
const [userName, setUserName] = useState("Investor");
const [stats, setStats] = useState({
invested: 0,
currentValue: 0,
activeSips: 0,
todayInterest: 0,
totalInterest: 0,
});

const loadStats = async (uid: string) => {
const { data } = await supabase
.from("transactions")
.select("amount, current_value, status, type, plan_name")
.eq("user_id", uid);

```
const today = new Date().toISOString().split("T")[0];

const { data: credits } = await supabase
  .from("daily_interest_credits")
  .select("amount, credit_date")
  .eq("user_id", uid);

const txs = data || [];

const invested = txs
  .filter((t) => {
    const type = (t.type || "").toLowerCase().trim();
    const status = (t.status || "").toLowerCase().trim();
    return status === "success" && (type === "sip" || type === "deposit" || type === "credit");
  })
  .reduce((s, t) => s + Number(t.amount || 0), 0);

const todayInterest = (credits || [])
  .filter((c) => c.credit_date === today)
  .reduce((s, c) => s + Number(c.amount || 0), 0);

const totalInterest = (credits || [])
  .reduce((s, c) => s + Number(c.amount || 0), 0);

const activeSips = new Set(
  txs.filter((t) => (t.type || "").toLowerCase() === "sip").map((t) => t.plan_name)
).size;

setStats({
  invested,
  currentValue: invested + totalInterest,
  activeSips,
  todayInterest,
  totalInterest,
});
```

};

React.useEffect(() => {
const getUser = async () => {
const { data: { user: authUser } } = await supabase.auth.getUser();

```
  if (!authUser) {
    navigate("/");
    return;
  }

  setUserName(
    authUser.user_metadata?.full_name ||
      authUser.email?.split("@")[0] ||
      "Investor"
  );

  await loadStats(authUser.id);
};

getUser();
```

}, [navigate]);

const handleLogout = async () => {
await supabase.auth.signOut();
navigate("/");
};

// 🔥 FINAL REDIRECT FUNCTION
const handlePayment = async (planName: string, amount: number) => {
try {
const { data: { user: authUser } } = await supabase.auth.getUser();

```
  if (!authUser) {
    toast({ title: "Login required", variant: "destructive" });
    navigate("/");
    return;
  }

  await supabase.from("transactions").insert({
    user_id: authUser.id,
    plan_name: planName,
    amount,
    type: "sip",
    status: "pending",
  });

  // 🚀 REDIRECT ONLY
  window.location.href = `https://instant-pay-wait.lovable.app?amount=${amount}&plan=${encodeURIComponent(planName)}`;

} catch (err: any) {
  toast({
    title: "Error",
    description: err.message || "Something went wrong",
    variant: "destructive",
  });
}
```

};

return ( <div className="min-h-screen bg-background"> <header className="sticky top-0 z-50 glass-card border-b border-border"> <div className="container mx-auto flex items-center justify-between py-4 px-4"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"> <Sparkles className="w-5 h-5 text-primary-foreground" /> </div> <h1 className="text-2xl font-bold">
ZY<span className="text-blue-800">PEUS</span> </h1> </div>

```
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  </header>

  <main className="container mx-auto px-4 py-8 pb-24 max-w-5xl">
    <h2 className="text-2xl font-bold mb-6">Select Plan</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sipPlans.map((plan) => (
        <Card key={plan.id} className="p-6 cursor-pointer">
          <h3 className="font-bold">{plan.name}</h3>
          <p className="text-xl">₹{plan.amount}</p>

          <Button
            className="mt-4 w-full"
            onClick={() => handlePayment(plan.name, plan.amount)}
          >
            Invest Now
          </Button>
        </Card>
      ))}
    </div>

    <div className="mt-6">
      <input
        type="number"
        placeholder="Custom amount"
        value={customAmount}
        onChange={(e) => setCustomAmount(e.target.value)}
        className="border p-2 w-full"
      />

      <Button
        className="mt-2 w-full"
        onClick={() => {
          const amt = parseInt(customAmount);
          if (!amt || amt < 100) {
            toast({ title: "Min ₹100 required" });
            return;
          }
          handlePayment("Custom SIP", amt);
        }}
      >
        Pay
      </Button>
    </div>
  </main>

  <BottomNav />
</div>
```

);
};

export default Dashboard;
