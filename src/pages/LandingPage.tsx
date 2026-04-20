import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Home,
  TrendingUp,
  Calculator,
  Briefcase,
  HelpCircle,
  User,
  LogOut,
  X,
} from "lucide-react";

/* ╔══════════════════════════════════════════════════════════════════╗
   ║                                                                  ║
   ║   🎨  SITE CONFIG  —  ISSE EDIT KARO, BAAKI KUCH MAT CHHEDO       ║
   ║                                                                  ║
   ║   Niche diya hua object hi pura page control karta hai.          ║
   ║   Brand name, colors, text, sections — sab yahan se badlo.       ║
   ║   Koi bhi apni website me ye page directly use kar sakta hai.    ║
   ║                                                                  ║
   ╚══════════════════════════════════════════════════════════════════╝ */

const SITE_CONFIG = {
  // ─── Brand ───
  brand: {
    name: "Zypeus",
    logoLetter: "Z",        // logo me dikhne wala letter
    tagline: "Smart SIP · Mutual Funds · Wealth Growth",
    badge: "SEBI Registered",
  },

  // ─── Hero Section ───
  hero: {
    eyebrow: "Smart SIP · Mutual Funds · Wealth Growth",
    titlePart1: "Zy",       // foreground color
    titlePart2: "peus",     // primary color
    subtitle:
      "Invest your money smartly through SIPs in top mutual funds. A little every month, a lot in the future.",
    primaryCta: "Start SIP Now",
    secondaryCta: "Learn More",
    stats: [
      { label: "Active SIPs", value: "2.4L+" },
      { label: "Assets Under Management", value: "₹1200 Cr" },
      { label: "Avg. Annual Returns", value: "14.2%" },
    ],
  },

  // ─── Sections on/off ───
  sections: {
    features: true,
    calculator: true,
    funds: true,
    howItWorks: true,
    footer: true,
  },

  // ─── Features ───
  features: {
    title: "Everything you need, in one place",
    subtitle:
      "Powerful tools and features designed to make mutual fund investing simple, smart and rewarding for everyone.",
    items: [
      { icon: "📈", title: "SIP Calculator", desc: "See exactly how your monthly investment can grow — with real-time projections." },
      { icon: "🛡️", title: "Risk Analysis", desc: "Understand your risk profile and choose funds that match your goals perfectly." },
      { icon: "⚡", title: "Auto-Invest", desc: "Set it once and forget it — your SIP runs automatically every month, hassle-free." },
      { icon: "🏆", title: "Top Funds", desc: "Discover India's best performing mutual funds — handpicked, ranked and reviewed." },
      { icon: "📊", title: "Portfolio Tracker", desc: "Track your entire portfolio in one place — returns, allocation and performance." },
      { icon: "🔔", title: "Smart Alerts", desc: "Get instant updates on market moves, NAV changes and SIP reminders." },
    ],
  },

  // ─── SIP Calculator ───
  calculator: {
    title: "SIP Calculator",
    subtitle: "See how your wealth can grow over time",
    defaultMonthly: 5000,
    defaultYears: 10,
    expectedReturnRate: 12,   // % per annum
    minMonthly: 500,
    maxMonthly: 100000,
    minYears: 1,
    maxYears: 30,
  },

  // ─── Top Funds ───
  funds: {
    title: "Top Performing Funds",
    subtitle: "India's best mutual funds, curated for you",
    items: [
      { name: "Axis Bluechip Fund", category: "Large Cap", returns1y: "18.4%", returns3y: "15.2%", risk: "Low" },
      { name: "Mirae Asset Emerging Bluechip", category: "Large & Mid Cap", returns1y: "22.1%", returns3y: "17.8%", risk: "Medium" },
      { name: "Parag Parikh Flexi Cap", category: "Flexi Cap", returns1y: "19.7%", returns3y: "16.5%", risk: "Medium" },
      { name: "SBI Small Cap Fund", category: "Small Cap", returns1y: "28.3%", returns3y: "22.1%", risk: "High" },
      { name: "HDFC Mid-Cap Opportunities", category: "Mid Cap", returns1y: "24.6%", returns3y: "19.4%", risk: "Medium" },
    ],
  },

  // ─── How It Works ───
  howItWorks: {
    title: "How It Works",
    subtitle: "Start investing in just 4 simple steps",
    steps: [
      { step: "01", title: "Sign Up", desc: "Create your account in just 2 minutes — quick and easy." },
      { step: "02", title: "Complete KYC", desc: "Instant e-KYC using your Aadhaar and PAN card." },
      { step: "03", title: "Choose a Fund", desc: "Pick the best fund that aligns with your financial goals." },
      { step: "04", title: "Start Your SIP", desc: "Set your monthly amount and let auto-invest do the rest." },
    ],
  },

  // ─── Footer ───
  footer: {
    links: ["About", "Features", "Calculator", "Top Funds", "Contact"],
    disclaimer:
      "Mutual fund investments are subject to market risks. Please read all scheme related documents carefully.",
    copyright: "© 2026 Zypeus. All rights reserved.",
  },

  // ─── Side Menu ───
  menu: [
    { icon: Home, label: "Home" },
    { icon: TrendingUp, label: "Top Funds" },
    { icon: Calculator, label: "SIP Calculator" },
    { icon: Briefcase, label: "My Portfolio" },
    { icon: HelpCircle, label: "How It Works" },
    { icon: User, label: "Profile" },
  ],

  // ─── SEO ───
  seo: {
    title: "Zypeus — Smart SIP & Mutual Fund Investment Platform",
    description:
      "Start your mutual fund SIP with Zypeus. Smart investing, top performing funds, and real-time portfolio tracking — all in one place.",
  },
};

/* ╔══════════════════════════════════════════════════════════════════╗
   ║   👇  PAGE CODE  —  Iske niche kuch edit karne ki zaroorat nahi.  ║
   ║       Sab kuch upar ke SITE_CONFIG se control hota hai.          ║
   ╚══════════════════════════════════════════════════════════════════╝ */



const EASE = [0.22, 1, 0.36, 1] as const;

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatCurrency = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

const riskColor: Record<string, string> = {
  Low: "var(--color-success)",
  Medium: "var(--color-gold)",
  High: "oklch(0.65 0.22 25)",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.75, ease: EASE },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();
  const cfg = SITE_CONFIG;

  // Modals & menu
  const [termsOpen, setTermsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  const [activeFundForConfirm, setActiveFundForConfirm] = useState<string>(
    `${cfg.brand.name} Smart SIP Starter`,
  );

  // Terms modal
  const [agreed, setAgreed] = useState(false);

  // Confirmation modal
  const [amount, setAmount] = useState(cfg.calculator.defaultMonthly);
  const [sipDate, setSipDate] = useState(5);
  const [confirmed, setConfirmed] = useState(false);

  // SIP Calculator
  const [monthly, setMonthly] = useState(cfg.calculator.defaultMonthly);
  const [years, setYears] = useState(cfg.calculator.defaultYears);
  const rate = cfg.calculator.expectedReturnRate;
  const months = years * 12;
  const r = rate / 100 / 12;
  const futureValue = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const invested = monthly * months;
  const returns = futureValue - invested;
  const investedPercent = (invested / futureValue) * 100;

  // Confirmation projection
  const cMonths = 12 * 10;
  const cMonthlyRate = 0.12 / 12;
  const cFutureValue =
    amount * ((Math.pow(1 + cMonthlyRate, cMonths) - 1) / cMonthlyRate) * (1 + cMonthlyRate);
  const cInvested = amount * cMonths;
  const cGains = Math.max(0, cFutureValue - cInvested);
  const referenceId = `${cfg.brand.name.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-8)}`;

  useEffect(() => {
    if (!termsOpen) setAgreed(false);
  }, [termsOpen]);

  useEffect(() => {
    if (confirmOpen) {
      setAmount(cfg.calculator.defaultMonthly);
      setSipDate(5);
      setConfirmed(false);
    }
  }, [confirmOpen, cfg.calculator.defaultMonthly]);

  useEffect(() => {
    const lock = termsOpen || confirmOpen || menuOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [termsOpen, confirmOpen, menuOpen]);

  const openTermsForFund = (fundName: string) => {
    setActiveFundForConfirm(fundName);
    setSelectedFund(fundName);
    setTermsOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* ============== HERO ============== */}
      <section className="relative min-h-screen flex items-start justify-center overflow-hidden bg-background pt-32 md:pt-40 pb-16">
        {/* Top brand bar */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="absolute top-0 left-0 right-0 z-20 px-6 py-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-primary-foreground font-bold text-sm"
              style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-cta)" }}
            >
              {cfg.brand.logoLetter}
            </div>
            <span className="font-semibold text-foreground text-base tracking-tight">
              {cfg.brand.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground hidden sm:inline">
              {cfg.brand.badge}
            </span>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="w-11 h-11 rounded-full flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
            >
              <Menu size={28} strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>

        {/* Animated gradient backgrounds */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--gradient-hero-bg)" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-cta)" }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-cta)" }}
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={fadeUp} className="text-sm tracking-[0.35em] uppercase text-muted-foreground">
            {cfg.hero.eyebrow}
          </motion.p>

          <motion.h1 variants={fadeUp} className="mt-4 text-7xl md:text-8xl font-bold tracking-tight">
            <span className="text-foreground">{cfg.hero.titlePart1}</span>
            <span className="text-primary">{cfg.hero.titlePart2}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {cfg.hero.subtitle}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => openTermsForFund(`${cfg.brand.name} Smart SIP Starter`)}
              className="rounded-full px-10 py-3.5 text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-cta)" }}
            >
              {cfg.hero.primaryCta}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-full border border-border bg-background px-8 py-3.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              {cfg.hero.secondaryCta}
            </motion.button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-16 flex flex-wrap justify-center gap-6">
            {cfg.hero.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.12, duration: 0.7, ease: EASE }}
                whileHover={{ scale: 1.06, y: -6 }}
                className="rounded-2xl border border-border bg-card px-6 py-4 text-center transition-shadow"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ============== FEATURES ============== */}
      {cfg.sections.features && (
        <section className="py-24 px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">{cfg.features.title}</h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">{cfg.features.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cfg.features.items.map((f, i) => (
                <motion.div
                  key={f.title}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  whileHover={{ y: -10, scale: 1.025 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  className="rounded-2xl border border-border bg-card p-8"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <motion.span
                    className="text-4xl inline-block"
                    whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  >
                    {f.icon}
                  </motion.span>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
     

      {/* ============== SIP CALCULATOR ============== */}
      {cfg.sections.calculator && (
        <section className="py-24 px-6 bg-secondary/40">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">{cfg.calculator.title}</h2>
              <p className="mt-4 text-muted-foreground text-lg">{cfg.calculator.subtitle}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="rounded-3xl border border-border bg-card p-8 md:p-12"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">Monthly Investment</label>
                      <motion.span
                        key={monthly}
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="text-sm font-bold text-primary"
                      >
                        {formatCurrency(monthly)}
                      </motion.span>
                    </div>
                    <input
                      type="range"
                      min={cfg.calculator.minMonthly}
                      max={cfg.calculator.maxMonthly}
                      step={500}
                      value={monthly}
                      onChange={(e) => setMonthly(Number(e.target.value))}
                      className="w-full accent-primary h-2 rounded-full cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatCurrency(cfg.calculator.minMonthly)}</span>
                      <span>{formatCurrency(cfg.calculator.maxMonthly)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">Time Period</label>
                      <motion.span
                        key={years}
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="text-sm font-bold text-primary"
                      >
                        {years} {years === 1 ? "year" : "years"}
                      </motion.span>
                    </div>
                    <input
                      type="range"
                      min={cfg.calculator.minYears}
                      max={cfg.calculator.maxYears}
                      step={1}
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full accent-primary h-2 rounded-full cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{cfg.calculator.minYears} yr</span>
                      <span>{cfg.calculator.maxYears} yrs</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-secondary/60 p-4">
                    <p className="text-xs text-muted-foreground">Expected Annual Return</p>
                    <p className="text-2xl font-bold text-primary">{rate}% p.a.</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="w-full mb-8">
                    <div className="h-4 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--gradient-cta)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${investedPercent}%` }}
                        transition={{ duration: 0.8, ease: EASE }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary" /> Invested
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-secondary" /> Returns
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 w-full">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Invested Amount</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={invested}
                          initial={{ y: 8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -8, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-lg font-semibold text-foreground"
                        >
                          {formatCurrency(invested)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estimated Returns</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={returns}
                          initial={{ y: 8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -8, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-lg font-semibold"
                          style={{ color: "var(--color-success)" }}
                        >
                          {formatCurrency(returns)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Total Value</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={futureValue}
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.85, opacity: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="text-2xl font-bold text-primary"
                        >
                          {formatCurrency(futureValue)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ============== TOP FUNDS ============== */}
      {cfg.sections.funds && (
        <section className="py-24 px-6 bg-background">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">{cfg.funds.title}</h2>
              <p className="mt-4 text-muted-foreground text-lg">{cfg.funds.subtitle}</p>
            </motion.div>

            <div className="space-y-4">
              {cfg.funds.items.map((fund, i) => (
                <motion.div
                  key={fund.name}
                  initial={{ opacity: 0, x: -40, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.7, ease: EASE }}
                  whileHover={{ x: 8, scale: 1.01 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border bg-card p-5 gap-4"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{fund.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{fund.category}</p>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">1Y Return</p>
                      <p className="font-bold" style={{ color: "var(--color-success)" }}>{fund.returns1y}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">3Y Return</p>
                      <p className="font-bold" style={{ color: "var(--color-success)" }}>{fund.returns3y}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Risk</p>
                      <p className="font-bold text-xs" style={{ color: riskColor[fund.risk] }}>{fund.risk}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      onClick={() => openTermsForFund(fund.name)}
                      className="rounded-full px-5 py-2 text-xs font-semibold text-primary-foreground shrink-0"
                      style={{ background: "var(--gradient-cta)" }}
                    >
                      Invest
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============== HOW IT WORKS ============== */}
      {cfg.sections.howItWorks && (
        <section className="py-24 px-6 bg-secondary/40">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">{cfg.howItWorks.title}</h2>
              <p className="mt-4 text-muted-foreground text-lg">{cfg.howItWorks.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cfg.howItWorks.steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.12, duration: 0.75, ease: EASE }}
                  className="relative text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.12, rotate: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-primary-foreground mb-5"
                    style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-cta)" }}
                  >
                    {s.step}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============== FOOTER ============== */}
      {cfg.sections.footer && (
        <footer className="py-16 px-6 bg-foreground text-background">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold">{cfg.brand.name}</h2>
              <p className="mt-2 text-sm opacity-60">{cfg.brand.tagline}</p>

              <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm opacity-70">
                {cfg.footer.links.map((item) => (
                  <motion.span
                    key={item}
                    whileHover={{ y: -2, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="cursor-pointer"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>

              <p className="mt-10 text-xs opacity-40">
                {cfg.footer.disclaimer} {cfg.footer.copyright}
              </p>
            </motion.div>
          </div>
        </footer>
      )}

      {/* ============== SIDE MENU ============== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-foreground/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
              className="fixed top-0 right-0 bottom-0 z-50 w-[84%] max-w-sm bg-card border-l border-border flex flex-col"
              style={{ boxShadow: "var(--shadow-card)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground font-bold"
                    style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-cta)" }}
                  >
                    {cfg.brand.logoLetter}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground leading-tight">{cfg.brand.name}</p>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      {cfg.brand.tagline.split("·")[0].trim()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {cfg.menu.map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: EASE }}
                    whileHover={{ x: 4 }}
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors text-left"
                  >
                    <item.icon size={18} className="text-primary" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              <div className="px-6 py-5 border-t border-border space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors">
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Log Out</span>
                </button>
                <p className="text-[10px] text-center text-muted-foreground tracking-wider uppercase">
                  v1.0 &middot; {cfg.brand.badge}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ============== TERMS MODAL ============== */}
      <AnimatePresence>
        {termsOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
              onClick={() => setTermsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="terms-title"
              className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl border border-border bg-card overflow-hidden"
              style={{ boxShadow: "var(--shadow-card)" }}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
                <div>
                  <h3 id="terms-title" className="text-xl font-bold text-foreground">
                    Terms &amp; Conditions
                  </h3>
                  {selectedFund && (
                    <p className="mt-1 text-xs text-muted-foreground">For: {selectedFund}</p>
                  )}
                </div>
                <button
                  onClick={() => setTermsOpen(false)}
                  aria-label="Close"
                  className="rounded-full w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Please read the following terms carefully before proceeding with your investment.
                  By accepting, you confirm that you understand the risks involved.
                </p>
                {[
                  { t: "1. Market Risk", d: "Mutual fund investments are subject to market risks. The value of your investment can go up or down based on market conditions and past performance is not indicative of future returns." },
                  { t: "2. KYC Requirement", d: "You must complete your KYC verification using a valid PAN and Aadhaar before any investment is processed. Incomplete KYC may result in delays or cancellation of your SIP." },
                  { t: "3. SIP Auto-Debit", d: `By starting a SIP, you authorize ${cfg.brand.name} to auto-debit the agreed monthly amount from your registered bank account on the scheduled date until you choose to pause or cancel the SIP.` },
                  { t: "4. Charges & Fees", d: `All applicable fund expense ratios, exit loads and statutory taxes will apply as per the scheme documents. ${cfg.brand.name} does not charge any hidden fees on your investments.` },
                  { t: "5. Read Scheme Documents", d: "You are advised to read all scheme related documents carefully before investing. Returns shown anywhere on this platform are illustrative and not guaranteed." },
                  { t: "6. No Investment Advice", d: `Information provided on ${cfg.brand.name} is for general purposes and does not constitute personalized financial advice. Please consult a certified financial advisor before making investment decisions.` },
                ].map((s) => (
                  <div key={s.t}>
                    <h4 className="font-semibold text-foreground mb-1">{s.t}</h4>
                    <p>{s.d}</p>
                  </div>
                ))}
              </div>

              <div className="px-6 py-5 border-t border-border bg-secondary/30 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span className="text-xs text-foreground leading-relaxed">
                    I have read and agree to the Terms &amp; Conditions, and I understand that mutual fund investments are subject to market risks.
                  </span>
                </label>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setTermsOpen(false)}
                    className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={agreed ? { scale: 1.04 } : undefined}
                    whileTap={agreed ? { scale: 0.96 } : undefined}
                    disabled={!agreed}
                    onClick={() => {
                      if (agreed) {
                        setTermsOpen(false);
                        setConfirmOpen(true);
                      }
                    }}
                    className="rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: "var(--gradient-cta)",
                      boxShadow: agreed ? "var(--shadow-cta)" : "none",
                    }}
                  >
                    Accept &amp; Continue
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============== INVESTMENT CONFIRMATION ============== */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
              onClick={() => setConfirmOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl border border-border bg-card overflow-hidden"
              style={{ boxShadow: "var(--shadow-card)" }}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {!confirmed ? (
                <>
                  <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
                    <div>
                      <h3 id="confirm-title" className="text-xl font-bold text-foreground">
                        Confirm Your Investment
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Review the details before starting your SIP
                      </p>
                    </div>
                    <button
                      onClick={() => setConfirmOpen(false)}
                      aria-label="Close"
                      className="rounded-full w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    <div className="rounded-2xl border border-border p-4 bg-secondary/40">
                      <p className="text-xs text-muted-foreground">Selected Fund</p>
                      <p className="mt-1 font-semibold text-foreground">{activeFundForConfirm}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">Monthly SIP Amount</label>
                        <span className="text-sm font-bold text-primary">{formatINR(amount)}</span>
                      </div>
                      <input
                        type="range"
                        min={cfg.calculator.minMonthly}
                        max={cfg.calculator.maxMonthly}
                        step={500}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>{formatCurrency(cfg.calculator.minMonthly)}</span>
                        <span>{formatCurrency(cfg.calculator.maxMonthly)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Monthly SIP Date</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 5, 10, 15, 20, 25].map((d) => (
                          <button
                            key={d}
                            onClick={() => setSipDate(d)}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-colors ${
                              sipDate === d
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-foreground hover:bg-secondary"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border p-4 space-y-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        10-Year Projection (12% p.a.)
                      </p>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Invested</p>
                          <p className="text-sm font-bold text-foreground mt-1">{formatINR(cInvested)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Est. Gains</p>
                          <p className="text-sm font-bold mt-1" style={{ color: "var(--color-success)" }}>
                            {formatINR(cGains)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Total Value</p>
                          <p className="text-sm font-bold text-primary mt-1">{formatINR(cFutureValue)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-secondary/40 p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frequency</span>
                        <span className="text-foreground font-medium">Monthly</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Auto-debit on</span>
                        <span className="text-foreground font-medium">
                          {sipDate}
                          {sipDate === 1 ? "st" : sipDate === 2 ? "nd" : sipDate === 3 ? "rd" : "th"} of every month
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment mode</span>
                        <span className="text-foreground font-medium">UPI / Net Banking</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-border bg-secondary/30 flex gap-3 justify-end">
                    <button
                      onClick={() => setConfirmOpen(false)}
                      className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setConfirmed(true)}
                      className="rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground"
                      style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-cta)" }}
                    >
                      Confirm &amp; Start SIP
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto px-6 py-8 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-cta)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-10 h-10 text-primary-foreground"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 text-2xl font-bold text-foreground"
                  >
                    SIP Started Successfully!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-2 text-sm text-muted-foreground"
                  >
                    Your investment journey with {cfg.brand.name} has officially begun.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 rounded-2xl border border-border bg-secondary/40 p-5 text-left space-y-3"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fund</span>
                      <span className="font-semibold text-foreground text-right max-w-[60%]">
                        {activeFundForConfirm}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Amount</span>
                      <span className="font-semibold text-primary">{formatINR(amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Auto-debit Date</span>
                      <span className="font-semibold text-foreground">{sipDate} of every month</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reference ID</span>
                      <span className="font-mono text-xs text-foreground">{referenceId}</span>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setConfirmOpen(false)}
                    className="mt-6 rounded-full px-8 py-3 text-sm font-semibold text-primary-foreground"
                    style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-cta)" }}
                  >
                    Done
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
