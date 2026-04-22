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

const STANDARD_PLANS = [
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
  // 🔥 transactions
  const { data } = await supabase
    .from("transactions")
    .select("amount, current_value, plan_name, created_at, status, type")
    .eq("user_id", user.id)
    .eq("status", "success");

  // 🔥 interest (IMPORTANT FIX)
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

  const groups = new Map();

  for (const t of data) {
    const amt = Number(t.amount);
    const std = STANDARD_PLANS.find(p => p.amount === amt);

    if (std) {
      const k = `std_${std.amount}`;
      if (!groups.has(k)) groups.set(k, { name: std.name, monthlyAmount: std.amount, txns: [], isOther: false });
      groups.get(k).txns.push(t);
    } else {
      if (!groups.has("other")) groups.set("other", { name: "Other", monthlyAmount: null, txns: [], isOther: true });
      groups.get("other").txns.push(t);
    }
  }

  const result = Array.from(groups.entries()).map(([key, g]: any) => {
    let invested = 0;

    for (const t of g.txns) {
      invested += Number(t.amount);
    }

    const currentValue = invested + interest / groups.size; // 🔥 FIX

    return {
      key,
      name: g.name,
      monthlyAmount: g.monthlyAmount,
      totalInvested: invested,
      currentValue,
      months: g.txns.length,
      returnPercent:
        invested > 0
          ? ((currentValue - invested) / invested) * 100
          : 0,
      monthlyData: [],
      isOther: g.isOther,
      txns: g.txns,
    };
  });

  setHoldings(result);
  setLoading(false);
};

load();
```

}, [navigate]);

const totalInvested = holdings.reduce((s, h) => s + h.totalInvested, 0);

const totalCurrent = totalInvested + totalInterest; // 🔥 FINAL FIX

const totalReturn = totalCurrent - totalInvested;

const totalReturnPercent =
totalInvested > 0
? ((totalReturn / totalInvested) * 100).toFixed(1)
: "0.0";

const isPositive = totalReturn >= 0;

return ( <div className="min-h-screen bg-background"> <main className="container mx-auto px-4 py-6">
{loading ? ( <div className="flex justify-center py-20"> <Loader2 className="animate-spin" /> </div>
) : (
<> <Card className="p-6 rounded-2xl gradient-primary text-white"> <p>Total Portfolio Value</p> <h2 className="text-3xl font-bold">
₹{totalCurrent.toLocaleString()} </h2>

```
          <p className="mt-2">
            Invested: ₹{totalInvested.toLocaleString()}
          </p>

          <p>
            Profit: ₹{totalReturn.toLocaleString()} ({totalReturnPercent}%)
          </p>
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
