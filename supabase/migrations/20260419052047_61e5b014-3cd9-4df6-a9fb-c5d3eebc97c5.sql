
CREATE TABLE public.daily_interest_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  credit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC NOT NULL DEFAULT 0,
  note TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_dic_user_date ON public.daily_interest_credits(user_id, credit_date DESC);

ALTER TABLE public.daily_interest_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own credits"
  ON public.daily_interest_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all credits"
  ON public.daily_interest_credits FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert credits"
  ON public.daily_interest_credits FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update credits"
  ON public.daily_interest_credits FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete credits"
  ON public.daily_interest_credits FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_dic_updated_at
  BEFORE UPDATE ON public.daily_interest_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
