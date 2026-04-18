CREATE TABLE public.eaisha_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  sip_account_number TEXT NOT NULL UNIQUE,
  member_code TEXT NOT NULL UNIQUE,
  sip_id TEXT NOT NULL UNIQUE,
  secret_code TEXT NOT NULL,
  card_holder_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.eaisha_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own card" ON public.eaisha_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own card" ON public.eaisha_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own card" ON public.eaisha_cards FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER eaisha_cards_updated_at BEFORE UPDATE ON public.eaisha_cards
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();