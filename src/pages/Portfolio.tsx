import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, TrendingUp, TrendingDown, Calendar, BarChart3, PieChart, ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";

type Txn = {
amount: number;
current_value: number | null;
created_at: string;
razorpay_payment_id?: string | null;
};

type Holding = {
key: string;
name: string;
monthlyAmount: number | null;
totalInvested: number;
currentValue: number;
months: number;
returnPercent: number;
monthlyData: number[];
isOther?: boolean;
txns: Txn[];
};

const STANDARD_PLANS: { amount: number; name: string }[] = [
{ amount: 100, name: "Stability SIP" },
{ amount: 500, name: "Starter SIP" },
{ amount: 1000, name: "Growth SIP" },
{ amount: 2500, name: "Power SIP" },
{ amount: 5000, name: "Premium SIP" },
{ amount: 10000, name: "Growth Booster SIP" },
];

const Portfolio = () => {
const navigate = useNavigate();
const [holdings, setHoldings] = useState<Holding[]>([]);
const [loading, setLoading] = useState(true);
const [selected, setSelected] = useState<Holding | null>(null);
const [totalInterest, setTotalInterest] = useState(0);

useEffect(() => {
const load = async () => {
const { data: { user } } = await supabase.auth.getUser();
if (!user) { navigate("/"); return; }

```
  // 🔥 TRANSACTIONS
  const { data } = await supabase
    .from("transactions")
    .select("amount, current_value, plan_name, created_at, status, type")
    .eq("user_id", user.id)
    .eq("status", "success")
    .order("created_at", { ascending: true });

  // 🔥 INTEREST (IMPORTANT FIX)
  const { data: credits } = await supabase
    .from("daily_interest_credits")
    .select("amount")
    .eq("user_id", user.id);

  const interest = (credits || []).reduce(
    (s, c) => s + Number(c.amount || 0),
    0
  );

  setTotalInterest(interest);

  if (!data) { setLoading(false); return; }

  const groups = new Map<string, { name: string; monthlyAmount: number | null; txns: any[]; isOther: boolean }>();

  for (const t of data) {
    const amt = Number(t.amount);
    const std = STANDARD_PLANS.find(p => p.amount === amt);

    if (std) {
      const k = `std_${std.amount}`;
      if (!groups.has(k)) groups.set(k, { name: std.name, monthlyAmount: std.amount, txns: [], isOther: false });
      groups.get(k)!.txns.push(t);
    } else {
      const k = "other";
      if (!groups.has(k)) groups.set(k, { name: "Other", monthlyAmount: null, txns: [], isOther: true });
      groups.get(k)!.txns.push(t);
    }
  }

  const result: Holding[] = Array.from(groups.entries()).map(([key, g]) => {
    let cum = 0;
    const monthlyData: number[] = [];
    let invested = 0;

    for (const t of g.txns) {
      const a = Number(t.amount);
      invested += a;
      cum += a;
      monthlyData.push(cum);
    }

    // 🔥 FIX: current value = invested + interest share
    const currentValue = invested + (interest / groups.size);

    const ret = invested > 0
      ? ((currentValue - invested) / invested) * 100
      : 0;

    return {
      key,
      name: g.name,
      monthlyAmount: g.monthlyAmount,
      totalInvested: invested,
      currentValue,
      months: g.txns.length,
      returnPercent: Number(ret.toFixed(1)),
      monthlyData,
      isOther: g.isOther,
      txns: g.txns as Txn[],
    };
  });

  // sort
  result.sort((a, b) => {
    if (a.isOther) return 1;
    if (b.isOther) return -1;
    return (a.monthlyAmount || 0) - (b.monthlyAmount || 0);
  });

  setHoldings(result);
  setLoading(false);
};

load();
```

}, [navigate]);

// 🔥 TOTAL FIX (MOST IMPORTANT)
const totalInvested = holdings.reduce((s, h) => s + h.totalInvested, 0);
const totalCurrent = totalInvested + totalInterest;
const totalReturn = totalCurrent - totalInvested;

const totalReturnPercent =
totalInvested > 0
? ((totalReturn / totalInvested) * 100).toFixed(1)
: "0.0";

const isPositive = totalReturn >= 0;

const MiniChart = ({ data, positive }: { data: number[]; positive: boolean }) => {
if (data.length < 2) return <div className="h-10 flex items-end"><div className={`w-full h-6 rounded-sm ${positive ? "gradient-primary" : "bg-destructive"} opacity-40`} /></div>;
const max = Math.max(...data);
const min = Math.min(...data);
const range = max - min || 1;
return ( <div className="h-10 flex items-end gap-[2px]">
{data.map((v, i) => (
<div
key={i}
className={`flex-1 rounded-t-sm ${positive ? "gradient-primary" : "bg-destructive"}`}
style={{ height: `${Math.max(((v - min) / range) * 100, 8)}%` }}
/>
))} </div>
);
};

return ( <div className="min-h-screen bg-background"> <header className="sticky top-0 z-50 glass-card border-b border-border"> <div className="container mx-auto flex items-center gap-3 py-4 px-4">
<Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}> <ArrowLeft /> </Button> <div className="flex items-center gap-3"> <div className="w-10 h-10 gradient-primary flex items-center justify-center"> <Sparkles className="text-white" /> </div> <span className="text-xl font-bold text-primary">Portfolio</span> </div> </div> </header>

```
  <main className="container mx-auto px-4 py-6">
    {loading ? (
      <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
    ) : (
      <>
        <Card className="p-6 gradient-primary text-white">
          <p>Total Portfolio Value</p>
          <h2 className="text-3xl font-bold">₹{totalCurrent.toLocaleString()}</h2>

          <p>Invested: ₹{totalInvested.toLocaleString()}</p>
          <p>Profit: ₹{totalReturn.toLocaleString()} ({totalReturnPercent}%)</p>
        </Card>
      </>
    )}
  </main>

  <BottomNav />
</div>
```

);
};

export default Portfolio;
