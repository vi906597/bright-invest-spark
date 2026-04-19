import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      return toast({ title: "Login failed", description: error.message, variant: "destructive" });
    }
    // Verify admin role
    const { data: roleRow } = await supabase
      .from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
    setLoading(false);
    if (!roleRow) {
      await supabase.auth.signOut();
      return toast({ title: "Access denied", description: "Not an admin account", variant: "destructive" });
    }
    toast({ title: "Welcome, Admin" });
    navigate("/secure-admin-92");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 mb-3">
            <Shield className="w-7 h-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground">Restricted area — authorized only</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12" />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12" />
          <Button type="submit" className="w-full h-12" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
