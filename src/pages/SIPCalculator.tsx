import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, IndianRupee, TrendingUp, Calendar, PieChart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import BottomNav from "@/components/BottomNav";

const periods = ["1D", "1W", "1M", "3M", "1Y", "ALL"] as const;

const generateChartData = (period: string, monthly: number, rate: number) => {
  const monthlyRate = rate / 12 / 100;
  const points: { label: string; value: number }[] = [];

  const count = period === "1D" ? 24 : period === "1W" ? 7 : period === "1M" ? 30 : period === "3M" ? 12 : period === "1Y" ? 12 : 20;

  for (let i = 1; i <= count; i++) {
    let months: number;
    let label: string;

    if (period === "1D") {
      months = 1; label = `${i}h`;
      const base = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const noise = Math.sin(i * 0.8) * base * 0.02 + Math.cos(i * 1.3) * base * 0.01;
      points.push({ label, value: Math.round(base + noise) });
      continue;
    } else if (period === "1W") {
      months = i; label = `Day ${i}`;
    } else if (period === "1M") {
      months = i; label = `${i}`;
    } else if (period === "3M") {
      months = i * 1; label = `W${i}`;
    } else if (period === "1Y") {
      months = i; label = `M${i}`;
    } else {
      months = i * 6; label = `Y${Math.ceil(i / 2)}`;
    }

    const val = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const variation = Math.sin(i * 1.5) * val * 0.03;
    points.push({ label, value: Math.round(val + variation) });
  }

  return points;
};

const SIPCalculator = () => {
  const navigate = useNavigate();
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [activePeriod, setActivePeriod] = useState<string>("1M");

  const result = useMemo(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = years * 12;
    const totalInvested = monthlyInvestment * months;
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalReturns = futureValue - totalInvested;
    return { totalInvested, futureValue: Math.round(futureValue), totalReturns: Math.round(totalReturns) };
  }, [monthlyInvestment, years, expectedReturn]);

  const chartData = useMemo(() => generateChartData(activePeriod, monthlyInvestment, expectedReturn), [activePeriod, monthlyInvestment, expectedReturn]);

  const investedPercent = (result.totalInvested / result.futureValue) * 100;
  const currentValue = chartData[chartData.length - 1]?.value || 0;
  const isUp = chartData.length > 1 && chartData[chartData.length - 1].value >= chartData[0].value;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto flex items-center gap-3 py-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">SIP Calculator</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24 max-w-3xl">
        <div className="animate-fade-in space-y-5">

          {/* Chart Card */}
          <Card className="p-5 rounded-2xl shadow-card border-border">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-bold text-foreground text-base">SIP Growth</h3>
                <p className={`text-2xl font-bold mt-1 ${isUp ? "text-green-500" : "text-destructive"}`}>
                  ₹{currentValue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Period Tabs */}
            <div className="flex items-center gap-1.5 my-4">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePeriod(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activePeriod === p
                      ? "gradient-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isUp ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={isUp ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(240, 5%, 46%)" }} interval="preserveStartEnd" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(240, 5%, 46%)" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(240, 10%, 90%)", borderRadius: 12, fontSize: 12 }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, "Value"]}
                  />
                  <Area type="monotone" dataKey="value" stroke={isUp ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} strokeWidth={2} fill="url(#colorValue)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Sliders */}
          <Card className="p-6 rounded-2xl shadow-card border-border space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" /> Monthly Investment
                </label>
                <span className="text-lg font-bold text-primary">₹{monthlyInvestment.toLocaleString()}</span>
              </div>
              <Slider value={[monthlyInvestment]} onValueChange={(v) => setMonthlyInvestment(v[0])} min={100} max={100000} step={100} className="[&_[role=slider]]:gradient-primary [&_[role=slider]]:border-0" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹100</span><span>₹1,00,000</span></div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Time Period
                </label>
                <span className="text-lg font-bold text-primary">{years} Years</span>
              </div>
              <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={30} step={1} className="[&_[role=slider]]:gradient-primary [&_[role=slider]]:border-0" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1 Year</span><span>30 Years</span></div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Expected Return (p.a.)
                </label>
                <span className="text-lg font-bold text-primary">{expectedReturn}%</span>
              </div>
              <Slider value={[expectedReturn]} onValueChange={(v) => setExpectedReturn(v[0])} min={1} max={30} step={0.5} className="[&_[role=slider]]:gradient-primary [&_[role=slider]]:border-0" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1%</span><span>30%</span></div>
            </div>
          </Card>

          {/* Result */}
          <Card className="p-6 rounded-2xl shadow-elevated border-border">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-5">
              <PieChart className="w-5 h-5 text-primary" /> Investment Summary
            </h3>
            <div className="h-4 rounded-full bg-secondary overflow-hidden mb-6">
              <div className="h-full rounded-full gradient-primary transition-all duration-500" style={{ width: `${investedPercent}%` }} />
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full gradient-primary inline-block" /> Invested</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-secondary inline-block" /> Returns</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-secondary rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
                <p className="text-xl font-bold text-foreground">₹{result.totalInvested.toLocaleString()}</p>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Est. Returns</p>
                <p className="text-xl font-bold text-green-500">₹{result.totalReturns.toLocaleString()}</p>
              </div>
              <div className="gradient-primary rounded-xl p-4 text-center">
                <p className="text-xs text-primary-foreground/80 mb-1">Total Value</p>
                <p className="text-xl font-bold text-primary-foreground">₹{result.futureValue.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Button className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90" onClick={() => navigate("/dashboard")}>
            Start SIP Now
          </Button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default SIPCalculator;
