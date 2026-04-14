import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, TrendingUp, TrendingDown, IndianRupee, Calendar, BarChart3, PieChart, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SIPHolding = {
  id: number;
  name: string;
  monthlyAmount: number;
  totalInvested: number;
  currentValue: number;
  startDate: string;
  months: number;
  returnPercent: number;
  monthlyData: number[];
};

const holdings: SIPHolding[] = [
  {
    id: 1, name: "Growth SIP", monthlyAmount: 1000, totalInvested: 6000, currentValue: 6840,
    startDate: "2025-10-14", months: 6, returnPercent: 14.0,
    monthlyData: [1000, 2040, 3120, 4240, 5400, 6840],
  },
  {
    id: 2, name: "Starter SIP", monthlyAmount: 500, totalInvested: 2000, currentValue: 2150,
    startDate: "2025-12-01", months: 4, returnPercent: 7.5,
    monthlyData: [500, 1020, 1550, 2150],
  },
  {
    id: 3, name: "Power SIP", monthlyAmount: 2500, totalInvested: 5000, currentValue: 5350,
    startDate: "2026-02-14", months: 2, returnPercent: 7.0,
    monthlyData: [2500, 5350],
  },
  {
    id: 4, name: "Premium SIP", monthlyAmount: 5000, totalInvested: 5000, currentValue: 4850,
    startDate: "2026-03-01", months: 1, returnPercent: -3.0,
    monthlyData: [4850],
  },
];

const MiniChart = ({ data, positive }: { data: number[]; positive: boolean }) => {
  if (data.length < 2) return <div className="h-10 flex items-end"><div className={`w-full h-6 rounded-sm ${positive ? "gradient-primary" : "bg-destructive"} opacity-40`} /></div>;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="h-10 flex items-end gap-[2px]">
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm transition-all ${positive ? "gradient-primary" : "bg-destructive"}`}
          style={{ height: `${Math.max(((v - min) / range) * 100, 8)}%`, opacity: 0.4 + (i / data.length) * 0.6 }}
        />
      ))}
    </div>
  );
};

const Portfolio = () => {
  const navigate = useNavigate();

  const totalInvested = holdings.reduce((s, h) => s + h.totalInvested, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalReturn = totalCurrent - totalInvested;
  const totalReturnPercent = ((totalReturn / totalInvested) * 100).toFixed(1);
  const isPositive = totalReturn >= 0;

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
            <span className="text-xl font-bold text-primary">Portfolio</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-5 animate-fade-in">
        {/* Overview Card */}
        <Card className="p-6 rounded-2xl shadow-elevated border-border gradient-primary text-primary-foreground">
          <p className="text-sm opacity-80">Total Portfolio Value</p>
          <p className="text-3xl font-bold mt-1">₹{totalCurrent.toLocaleString()}</p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="opacity-80">Invested: ₹{totalInvested.toLocaleString()}</span>
            <span className={`flex items-center gap-1 font-semibold ${isPositive ? "text-green-200" : "text-red-200"}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? "+" : ""}₹{totalReturn.toLocaleString()} ({totalReturnPercent}%)
            </span>
          </div>
        </Card>

        {/* Allocation */}
        <Card className="p-5 rounded-2xl shadow-card border-border">
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-primary" /> Allocation
          </h3>
          <div className="h-3 rounded-full bg-secondary overflow-hidden flex">
            {holdings.map((h, i) => {
              const colors = ["bg-primary", "bg-accent", "bg-green-500", "bg-amber-500"];
              return (
                <div
                  key={h.id}
                  className={`h-full ${colors[i % colors.length]} transition-all`}
                  style={{ width: `${(h.currentValue / totalCurrent) * 100}%` }}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {holdings.map((h, i) => {
              const dotColors = ["bg-primary", "bg-accent", "bg-green-500", "bg-amber-500"];
              return (
                <span key={h.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`w-2.5 h-2.5 rounded-full ${dotColors[i % dotColors.length]}`} />
                  {h.name} ({((h.currentValue / totalCurrent) * 100).toFixed(0)}%)
                </span>
              );
            })}
          </div>
        </Card>

        {/* Holdings */}
        <div>
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" /> Active SIPs ({holdings.length})
          </h3>
          <div className="space-y-3">
            {holdings.map(h => {
              const gain = h.currentValue - h.totalInvested;
              const pos = gain >= 0;
              return (
                <Card key={h.id} className="p-4 rounded-2xl shadow-card border-border hover:shadow-elevated transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-foreground">{h.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> ₹{h.monthlyAmount.toLocaleString()}/mo · {h.months} months
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                      pos ? "text-green-500 bg-green-500/10" : "text-destructive bg-destructive/10"
                    }`}>
                      {pos ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {pos ? "+" : ""}{h.returnPercent}%
                    </span>
                  </div>

                  <MiniChart data={h.monthlyData} positive={pos} />

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground">Invested</p>
                      <p className="text-sm font-bold text-foreground">₹{h.totalInvested.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground">Current</p>
                      <p className="text-sm font-bold text-foreground">₹{h.currentValue.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground">Returns</p>
                      <p className={`text-sm font-bold ${pos ? "text-green-500" : "text-destructive"}`}>
                        {pos ? "+" : ""}₹{gain.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
