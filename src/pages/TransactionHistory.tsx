import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, ArrowDownLeft, ArrowUpRight, Filter, Search, IndianRupee, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";

type Transaction = {
  id: string;
  date: string;
  planName: string;
  amount: number;
  status: "success" | "failed" | "pending";
  type: "sip" | "withdrawal";
  paymentId: string;
};

const mockTransactions: Transaction[] = [
  { id: "1", date: "2026-04-14", planName: "Growth SIP", amount: 1000, status: "success", type: "sip", paymentId: "pay_demo_abc123" },
  { id: "2", date: "2026-04-10", planName: "Custom SIP", amount: 2000, status: "success", type: "sip", paymentId: "pay_demo_def456" },
  { id: "3", date: "2026-03-14", planName: "Growth SIP", amount: 1000, status: "success", type: "sip", paymentId: "pay_demo_ghi789" },
  { id: "4", date: "2026-03-10", planName: "Power SIP", amount: 2500, status: "failed", type: "sip", paymentId: "pay_demo_jkl012" },
  { id: "5", date: "2026-02-14", planName: "Growth SIP", amount: 1000, status: "success", type: "sip", paymentId: "pay_demo_mno345" },
  { id: "6", date: "2026-02-01", planName: "Starter SIP", amount: 500, status: "success", type: "sip", paymentId: "pay_demo_pqr678" },
  { id: "7", date: "2026-01-14", planName: "Growth SIP", amount: 1000, status: "success", type: "sip", paymentId: "pay_demo_stu901" },
  { id: "8", date: "2026-01-05", planName: "Premium SIP", amount: 5000, status: "pending", type: "sip", paymentId: "pay_demo_vwx234" },
  { id: "9", date: "2025-12-20", planName: "Partial Withdrawal", amount: 3000, status: "success", type: "withdrawal", paymentId: "pay_demo_yza567" },
  { id: "10", date: "2025-12-14", planName: "Growth SIP", amount: 1000, status: "success", type: "sip", paymentId: "pay_demo_bcd890" },
];

const statusConfig = {
  success: { icon: CheckCircle2, label: "Success", className: "text-green-500 bg-green-500/10" },
  failed: { icon: XCircle, label: "Failed", className: "text-destructive bg-destructive/10" },
  pending: { icon: Clock, label: "Pending", className: "text-amber-500 bg-amber-500/10" },
};

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "success" | "failed" | "pending">("all");
  const [search, setSearch] = useState("");

  const filtered = mockTransactions.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search && !t.planName.toLowerCase().includes(search.toLowerCase()) && !t.paymentId.includes(search)) return false;
    return true;
  });

  const totalInvested = mockTransactions.filter(t => t.status === "success" && t.type === "sip").reduce((s, t) => s + t.amount, 0);

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
            <span className="text-xl font-bold text-primary">Transactions</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-5 animate-fade-in">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 rounded-2xl shadow-card">
            <p className="text-xs text-muted-foreground">Total Invested</p>
            <p className="text-xl font-bold text-primary">₹{totalInvested.toLocaleString()}</p>
          </Card>
          <Card className="p-4 rounded-2xl shadow-card">
            <p className="text-xs text-muted-foreground">Total Transactions</p>
            <p className="text-xl font-bold text-foreground">{mockTransactions.length}</p>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search plan or payment ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl" />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "success", "failed", "pending"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="p-8 rounded-2xl shadow-card text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </Card>
          ) : filtered.map(tx => {
            const sc = statusConfig[tx.status];
            return (
              <Card key={tx.id} className="p-4 rounded-2xl shadow-card border-border hover:shadow-elevated transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tx.type === "withdrawal" ? "bg-amber-500/10" : "bg-secondary"}`}>
                    {tx.type === "withdrawal" ? (
                      <ArrowUpRight className="w-5 h-5 text-amber-500" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground text-sm truncate">{tx.planName}</p>
                      <p className={`font-bold text-sm ${tx.type === "withdrawal" ? "text-amber-500" : "text-primary"}`}>
                        {tx.type === "withdrawal" ? "-" : "+"}₹{tx.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${sc.className}`}>
                        <sc.icon className="w-3 h-3" /> {sc.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">{tx.paymentId}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default TransactionHistory;
