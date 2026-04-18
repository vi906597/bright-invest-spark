import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, CheckCircle, FileText, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

type DocKey = "pan_document_url" | "aadhaar_front_url" | "aadhaar_back_url" | "selfie_url";

const DOCS: { key: DocKey; label: string }[] = [
  { key: "pan_document_url", label: "PAN Card" },
  { key: "aadhaar_front_url", label: "Aadhaar Front" },
  { key: "aadhaar_back_url", label: "Aadhaar Back" },
  { key: "selfie_url", label: "Selfie with PAN" },
];

const KycDialog = ({ open, onOpenChange, userId }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState<DocKey | null>(null);
  const [existing, setExisting] = useState<any>(null);
  const [form, setForm] = useState({
    full_name_kyc: "",
    pan_number: "",
    aadhaar_number: "",
    date_of_birth: "",
    address: "",
    pan_document_url: "",
    aadhaar_front_url: "",
    aadhaar_back_url: "",
    selfie_url: "",
  });

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("kyc_submissions").select("*").eq("user_id", userId).maybeSingle();
      if (data) {
        setExisting(data);
        setForm({
          full_name_kyc: data.full_name_kyc || "",
          pan_number: data.pan_number || "",
          aadhaar_number: data.aadhaar_number || "",
          date_of_birth: data.date_of_birth || "",
          address: data.address || "",
          pan_document_url: data.pan_document_url || "",
          aadhaar_front_url: data.aadhaar_front_url || "",
          aadhaar_back_url: data.aadhaar_back_url || "",
          selfie_url: data.selfie_url || "",
        });
      } else {
        setExisting(null);
      }
      setLoading(false);
    })();
  }, [open, userId]);

  const handleUpload = async (key: DocKey, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    setUploading(key);
    const ext = file.name.split(".").pop();
    const path = `${userId}/${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("kyc-documents").upload(path, file, { upsert: true });
    setUploading(null);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return;
    }
    setForm((f) => ({ ...f, [key]: path }));
    toast({ title: "Uploaded ✓", description: DOCS.find((d) => d.key === key)?.label });
  };

  const handleSubmit = async () => {
    const pan = form.pan_number.trim().toUpperCase();
    const aadhaar = form.aadhaar_number.replace(/\s/g, "");
    if (!form.full_name_kyc.trim()) return toast({ title: "Name required", variant: "destructive" });
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return toast({ title: "Invalid PAN", description: "Format: ABCDE1234F", variant: "destructive" });
    if (!/^\d{12}$/.test(aadhaar)) return toast({ title: "Invalid Aadhaar", description: "12 digits required", variant: "destructive" });
    if (!form.pan_document_url || !form.aadhaar_front_url || !form.aadhaar_back_url) {
      return toast({ title: "Documents required", description: "Upload PAN and both Aadhaar sides", variant: "destructive" });
    }

    setSubmitting(true);
    const payload = {
      user_id: userId,
      full_name_kyc: form.full_name_kyc.trim(),
      pan_number: pan,
      aadhaar_number: aadhaar,
      date_of_birth: form.date_of_birth || null,
      address: form.address.trim() || null,
      pan_document_url: form.pan_document_url,
      aadhaar_front_url: form.aadhaar_front_url,
      aadhaar_back_url: form.aadhaar_back_url,
      selfie_url: form.selfie_url || null,
      status: "pending",
      submitted_at: new Date().toISOString(),
    };

    const { error } = existing
      ? await supabase.from("kyc_submissions").update(payload).eq("user_id", userId)
      : await supabase.from("kyc_submissions").insert(payload);

    setSubmitting(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "KYC Submitted ✓", description: "Review takes 24-48 hours" });
      onOpenChange(false);
    }
  };

  const status = existing?.status;
  const readonly = status === "approved" || status === "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>KYC Verification</DialogTitle>
          <DialogDescription>Submit your documents for verification</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-4">
            {status && (
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                status === "approved" ? "bg-green-500/10 border-green-500/30" :
                status === "rejected" ? "bg-destructive/10 border-destructive/30" :
                "bg-amber-500/10 border-amber-500/30"
              }`}>
                {status === "approved" ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                 status === "rejected" ? <XCircle className="w-4 h-4 text-destructive" /> :
                 <Clock className="w-4 h-4 text-amber-500" />}
                <p className="text-sm font-medium capitalize">Status: {status}</p>
                {existing?.rejection_reason && <p className="text-xs text-muted-foreground">— {existing.rejection_reason}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label>Full Name (as per PAN)</Label>
              <Input value={form.full_name_kyc} disabled={readonly} onChange={(e) => setForm({ ...form, full_name_kyc: e.target.value })} maxLength={100} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>PAN Number</Label>
                <Input value={form.pan_number} disabled={readonly} onChange={(e) => setForm({ ...form, pan_number: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" maxLength={10} />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={form.date_of_birth} disabled={readonly} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Aadhaar Number</Label>
              <Input value={form.aadhaar_number} disabled={readonly} onChange={(e) => setForm({ ...form, aadhaar_number: e.target.value.replace(/\D/g, "").slice(0, 12) })} placeholder="123456789012" maxLength={12} />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={form.address} disabled={readonly} onChange={(e) => setForm({ ...form, address: e.target.value })} maxLength={200} />
            </div>

            <div className="space-y-2 pt-2">
              <Label>Documents</Label>
              {DOCS.map((doc) => (
                <div key={doc.key} className="flex items-center gap-2 p-3 rounded-xl border border-border">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{doc.label}</p>
                    {form[doc.key] && <p className="text-[10px] text-green-500 truncate">✓ Uploaded</p>}
                  </div>
                  {!readonly && (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleUpload(doc.key, e.target.files[0])}
                      />
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80">
                        {uploading === doc.key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                        {form[doc.key] ? "Replace" : "Upload"}
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          {!readonly && !loading && (
            <Button onClick={handleSubmit} disabled={submitting} className="gradient-primary text-primary-foreground rounded-xl w-full">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : existing ? "Resubmit KYC" : "Submit for Verification"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KycDialog;
