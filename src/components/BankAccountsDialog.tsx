import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Star, Building2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const BankAccountsDialog = ({ open, onOpenChange, userId }: Props) => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    account_holder: "",
    account_number: "",
    confirm_account: "",
    ifsc_code: "",
    bank_name: "",
    branch: "",
    account_type: "savings",
  });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("bank_accounts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setAccounts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (open) load();
  }, [open, userId]);

  const handleAdd = async () => {
    const acc = form.account_number.trim();
    const ifsc = form.ifsc_code.trim().toUpperCase();
    if (!form.account_holder.trim()) return toast({ title: "Name required", variant: "destructive" });
    if (!/^\d{9,18}$/.test(acc)) return toast({ title: "Invalid account number", description: "9-18 digits", variant: "destructive" });
    if (acc !== form.confirm_account.trim()) return toast({ title: "Account numbers don't match", variant: "destructive" });
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) return toast({ title: "Invalid IFSC", description: "Format: SBIN0001234", variant: "destructive" });
    if (!form.bank_name.trim()) return toast({ title: "Bank name required", variant: "destructive" });

    setSaving(true);
    const isPrimary = accounts.length === 0;
    const { error } = await supabase.from("bank_accounts").insert({
      user_id: userId,
      account_holder: form.account_holder.trim(),
      account_number: acc,
      ifsc_code: ifsc,
      bank_name: form.bank_name.trim(),
      branch: form.branch.trim() || null,
      account_type: form.account_type,
      is_primary: isPrimary,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bank added ✓" });
      setForm({ account_holder: "", account_number: "", confirm_account: "", ifsc_code: "", bank_name: "", branch: "", account_type: "savings" });
      setShowForm(false);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("bank_accounts").delete().eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Removed" }); load(); }
  };

  const handleSetPrimary = async (id: string) => {
    await supabase.from("bank_accounts").update({ is_primary: false }).eq("user_id", userId);
    const { error } = await supabase.from("bank_accounts").update({ is_primary: true }).eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Primary updated ✓" }); load(); }
  };

  const mask = (n: string) => n.length > 4 ? `••••${n.slice(-4)}` : n;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bank Accounts</DialogTitle>
          <DialogDescription>Manage your linked bank accounts</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-3">
            {accounts.map((a) => (
              <div key={a.id} className="p-3 rounded-xl border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{a.bank_name}</p>
                      {a.is_primary && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" /> Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{a.account_holder}</p>
                    <p className="text-xs text-muted-foreground">A/c {mask(a.account_number)} • {a.ifsc_code}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {!a.is_primary && (
                    <Button size="sm" variant="outline" onClick={() => handleSetPrimary(a.id)} className="text-xs rounded-lg flex-1">
                      <Star className="w-3 h-3 mr-1" /> Set Primary
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleDelete(a.id)} className="text-xs rounded-lg text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}

            {accounts.length === 0 && !showForm && (
              <p className="text-sm text-muted-foreground text-center py-4">No bank accounts linked yet</p>
            )}

            {!showForm ? (
              <Button onClick={() => setShowForm(true)} className="w-full gradient-primary text-primary-foreground rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Add Bank Account
              </Button>
            ) : (
              <div className="space-y-2 p-3 rounded-xl border border-border bg-secondary/30">
                <Label>Account Holder Name</Label>
                <Input value={form.account_holder} onChange={(e) => setForm({ ...form, account_holder: e.target.value })} maxLength={100} />
                <Label>Bank Name</Label>
                <Input value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} placeholder="State Bank of India" maxLength={100} />
                <Label>Account Number</Label>
                <Input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value.replace(/\D/g, "").slice(0, 18) })} />
                <Label>Confirm Account Number</Label>
                <Input value={form.confirm_account} onChange={(e) => setForm({ ...form, confirm_account: e.target.value.replace(/\D/g, "").slice(0, 18) })} />
                <Label>IFSC Code</Label>
                <Input value={form.ifsc_code} onChange={(e) => setForm({ ...form, ifsc_code: e.target.value.toUpperCase().slice(0, 11) })} placeholder="SBIN0001234" />
                <Label>Branch (optional)</Label>
                <Input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} maxLength={100} />
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 rounded-xl">Cancel</Button>
                  <Button onClick={handleAdd} disabled={saving} className="flex-1 gradient-primary text-primary-foreground rounded-xl">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BankAccountsDialog;
