import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, IndianRupee, TrendingUp, Calendar, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import BottomNav from "@/components/BottomNav";

const SIPCalculator = () => {
  const navigate = useNavigate();
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);

  const result = useMemo(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = years * 12;
    const totalInvested = monthlyInvestment * months;
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalReturns = futureValue - totalInvested;

    return { totalInvested, futureValue: Math.round(futureValue), totalReturns: Math.round(totalReturns) };
  }, [monthlyInvestment, years, expectedReturn]);

  const investedPercent = (result.totalInvested / result.futureValue) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      <main className="container mx-auto px-4 py-8 pb-24 max-w-3xl">
        <div className="animate-fade-in space-y-6">
          {/* Sliders */}
          <Card className="p-6 rounded-2xl shadow-card border-border space-y-8">
            {/* Monthly Investment */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" /> Monthly Investment
                </label>
                <span className="text-lg font-bold text-primary">₹{monthlyInvestment.toLocaleString()}</span>
              </div>
              <Slider
                value={[monthlyInvestment]}
                onValueChange={(v) => setMonthlyInvestment(v[0])}
                min={500}
                max={100000}
                step={500}
                className="[&_[role=slider]]:gradient-primary [&_[role=slider]]:border-0"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₹500</span><span>₹1,00,000</span>
              </div>
            </div>

            {/* Time Period */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Time Period
                </label>
                <span className="text-lg font-bold text-primary">{years} Years</span>
              </div>
              <Slider
                value={[years]}
                onValueChange={(v) => setYears(v[0])}
                min={1}
                max={30}
                step={1}
                className="[&_[role=slider]]:gradient-primary [&_[role=slider]]:border-0"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 Year</span><span>30 Years</span>
              </div>
            </div>

            {/* Expected Returns */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Expected Return (p.a.)
                </label>
                <span className="text-lg font-bold text-primary">{expectedReturn}%</span>
              </div>
              <Slider
                value={[expectedReturn]}
                onValueChange={(v) => setExpectedReturn(v[0])}
                min={1}
                max={30}
                step={0.5}
                className="[&_[role=slider]]:gradient-primary [&_[role=slider]]:border-0"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1%</span><span>30%</span>
              </div>
            </div>
          </Card>

          {/* Result */}
          <Card className="p-6 rounded-2xl shadow-elevated border-border">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-5">
              <PieChart className="w-5 h-5 text-primary" /> Investment Summary
            </h3>

            {/* Visual bar */}
            <div className="h-4 rounded-full bg-secondary overflow-hidden mb-6">
              <div
                className="h-full rounded-full gradient-primary transition-all duration-500"
                style={{ width: `${investedPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full gradient-primary inline-block" /> Invested
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-secondary inline-block" /> Returns
              </span>
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

          <Button
            className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90"
            onClick={() => navigate("/dashboard")}
          >
            Start SIP Now
          </Button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default SIPCalculator;
