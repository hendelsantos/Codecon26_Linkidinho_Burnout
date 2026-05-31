"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, Flame, Loader2, LogOut, MessageSquare, Share2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import confetti from "canvas-confetti";
import { Badge, CheckIn, CheckInPayload, Desabafo, HistoryEntry, MeuComparativo, Profile, ScoreResponse, api, timeAgo } from "@/lib/api";
import { auth } from "@/lib/auth";
import { ConviteModal } from "@/components/convidar-amigo";
import { DicasCard } from "@/components/dicas-corporativas";
import { SomAmbiente } from "@/components/som-ambiente";
import { OnboardingTour } from "@/components/onboarding-tour";
import { PlanoFuga } from "@/components/plano-fuga";
import { BadgesSection } from "@/components/badges-section";

// ──── Share Card Modal ────────────────────────────────────────────────────────

function ShareCardModal({
  checkin,
  profile,
  onClose,
}: {
  checkin: CheckIn;
  profile: Profile;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const scoreLabel = (s: number) =>
    s >= 80 ? "COLAPSO IMINENTE" : s >= 60 ? "NÍVEL CRÍTICO" : s >= 40 ? "EM ALERTA" : "FUNCIONAL";

  const cardText =
    `${profile.avatar_emoji} ${profile.nickname} — ${profile.area_label}\n` +
    `Burny Score: ${checkin.burny_score} (${scoreLabel(checkin.burny_score)})\n` +
    `☕ ${checkin.coffees} cafés · 📅 ${checkin.useless_meetings} reuniões inúteis · 😤 stress ${checkin.stress_level}/10\n` +
    `"${checkin.burny_insight}"\n#BurnyOut`;

  function handleCopy() {
    navigator.clipboard.writeText(cardText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: "BurnyOut", text: cardText }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ scale: 0.85, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card visual — estilo Instagram Story corporativo */}
        <div
          className="relative overflow-hidden rounded-[32px] p-8 text-center"
          style={{
            background: "linear-gradient(145deg, #0e0b1f 0%, #12101e 40%, #0f1018 100%)",
            border: "1px solid rgba(130,87,255,0.3)",
            boxShadow: "0 0 80px rgba(130,87,255,0.15), 0 0 40px rgba(249,115,22,0.08)",
          }}
        >
          {/* Glow decorativo */}
          <div className="absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-violet/20 blur-[60px]" />

          <p className="relative text-[10px] uppercase tracking-[0.35em] text-violet/70">Burny Report™</p>
          <p className="relative mt-2 text-5xl">{profile.avatar_emoji}</p>
          <p className="relative mt-2 text-lg font-bold text-white">{profile.nickname}</p>
          <p className="relative text-xs text-slate-400">{profile.area_label} · {profile.region}</p>

          {/* Score badge */}
          <div
            className="relative mx-auto mt-5 inline-block rounded-full px-5 py-2"
            style={{
              background: checkin.burny_score >= 80
                ? "rgba(239,68,68,0.15)" : checkin.burny_score >= 60
                ? "rgba(249,115,22,0.15)" : "rgba(234,179,8,0.15)",
              border: `1px solid ${checkin.burny_score >= 80 ? "rgba(239,68,68,0.4)" : checkin.burny_score >= 60 ? "rgba(249,115,22,0.4)" : "rgba(234,179,8,0.4)"}`,
            }}
          >
            <span className="text-3xl font-bold text-white">{checkin.burny_score}</span>
            <span className="ml-2 text-xs font-semibold tracking-widest uppercase text-slate-400">{scoreLabel(checkin.burny_score)}</span>
          </div>

          {/* Métricas */}
          <div className="relative mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white/5 py-3">
              <p className="text-lg font-bold text-white">☕ {checkin.coffees}</p>
              <p className="text-[10px] text-slate-500">cafés</p>
            </div>
            <div className="rounded-2xl bg-white/5 py-3">
              <p className="text-lg font-bold text-white">📅 {checkin.useless_meetings}</p>
              <p className="text-[10px] text-slate-500">reuniões</p>
            </div>
            <div className="rounded-2xl bg-white/5 py-3">
              <p className="text-lg font-bold text-white">😤 {checkin.stress_level}</p>
              <p className="text-[10px] text-slate-500">stress</p>
            </div>
          </div>

          {/* Insight */}
          <p className="relative mt-4 text-xs leading-6 text-slate-300 italic">&quot;{checkin.burny_insight}&quot;</p>

          <p className="relative mt-5 text-[10px] tracking-widest text-slate-600">#BurnyOut · burnyout.app</p>
        </div>

        {/* Ações */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleShare}
            className="burn-gradient flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-black"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </button>
          <button
            onClick={handleCopy}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            {copied ? "✅ Copiado!" : "📋 Copiar texto"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const METRIC_LABELS: Record<string, string> = {
  coffees: "Cafés",
  useless_meetings: "Reuniões inúteis",
  traffic_minutes: "Trânsito (min)",
  bathroom_revenue_cents: "Bathroom Revenue (R$)",
};

const DEFAULT_FORM: CheckInPayload = {
  coffees: 4,
  useless_meetings: 3,
  traffic_minutes: 45,
  stress_level: 6,
  bathroom_revenue_cents: 200,
  buzzwords_endured: 8,
};

const STRESS_EMOJIS = ["😊","😌","😐","😐","😤","😤","😩","😩","🤯","🤯","💀"];
const STRESS_COMMENTS = [
  "Você ok?","Bem.","Normal.","Aceitável.","Começando a pesar.",
  "Chegando lá.","Definido.","Sério.","Quase no limite.","Próximo.","Máximo.",
];

interface MetricDef {
  key: keyof Omit<CheckInPayload, "note">;
  label: string;
  emoji: string;
  min: number;
  max: number;
  step: number;
  stress?: true;
  comment: (v: number) => string;
  display: (v: number) => string;
}

const CHECKIN_METRICS: MetricDef[] = [
  {
    key: "coffees", label: "Cafés consumidos", emoji: "☕", min: 0, max: 20, step: 1,
    comment: (v) => v === 0 ? "Hm. Suspeito." : v <= 2 ? "Descansado?" : v <= 4 ? "Normal corporativo." : v <= 7 ? "Dependência moderada." : v <= 10 ? "Seu coração chora." : "Você não é humano.",
    display: (v) => String(v),
  },
  {
    key: "useless_meetings", label: "Reuniões inúteis", emoji: "📅", min: 0, max: 20, step: 1,
    comment: (v) => v === 0 ? "Sortudo." : v <= 2 ? "Relativamente vivo." : v <= 5 ? "Padrão da indústria." : v <= 8 ? "Poderiam ser e-mails." : "Você trabalha ou se reúne?",
    display: (v) => String(v),
  },
  {
    key: "traffic_minutes", label: "Minutos no trânsito", emoji: "🚗", min: 0, max: 300, step: 5,
    comment: (v) => v === 0 ? "Home office detectado." : v <= 30 ? "Quase tranquilo." : v <= 60 ? "Gerenciável." : v <= 120 ? "Podcast obrigatório." : v <= 180 ? "Cidadão paulistano." : "Boa sorte com o joelho.",
    display: (v) => `${v}min`,
  },
  {
    key: "stress_level", label: "Nível de stress", emoji: "😤", min: 0, max: 10, step: 1, stress: true,
    comment: (v) => STRESS_COMMENTS[v] ?? "Máximo.",
    display: (v) => STRESS_EMOJIS[v] ?? "💀",
  },
  {
    key: "buzzwords_endured", label: "Buzzwords aguentadas", emoji: "📢", min: 0, max: 60, step: 1,
    comment: (v) => v === 0 ? "Empresa saudável?" : v <= 5 ? "Reunião curta." : v <= 15 ? "Synergy level baixo." : v <= 30 ? "Fully committed." : "Move fast, burn harder.",
    display: (v) => String(v),
  },
  {
    key: "bathroom_revenue_cents", label: "Bathroom Revenue", emoji: "🚽", min: 0, max: 2000, step: 50,
    comment: (v) => v === 0 ? "Produtividade suspeita." : v <= 100 ? "Pausa simbólica." : v <= 300 ? `R$${(v / 100).toFixed(0)} de paz.` : v <= 600 ? "Gerente ainda espera." : "Gênio das pausas.",
    display: (v) => `R$${(v / 100).toFixed(0)}`,
  },
];

function previewScore(data: CheckInPayload): number {
  return Math.min(100, Math.round(
    data.coffees * 2 +
    data.useless_meetings * 4 +
    (data.traffic_minutes / 300) * 15 +
    data.stress_level * 5 +
    data.buzzwords_endured * 0.5 +
    (data.bathroom_revenue_cents / 2000) * 5,
  ));
}

function scoreBadge(score: number) {
  if (score >= 80) return "border-red-500/40 bg-red-500/10 text-red-300";
  if (score >= 60) return "border-ember/40 bg-ember/10 text-ember-soft";
  if (score >= 40) return "border-yellow-500/40 bg-yellow-500/10 text-yellow-300";
  return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
}

function scoreLabel(score: number) {
  if (score >= 80) return "COLAPSO IMINENTE";
  if (score >= 60) return "NÍVEL CRÍTICO";
  if (score >= 40) return "EM ALERTA";
  return "FUNCIONAL";
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [score, setScore] = useState<ScoreResponse | null>(null);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [comparativo, setComparativo] = useState<MeuComparativo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CheckInPayload>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [todayDone, setTodayDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [conviteAberto, setConviteAberto] = useState(false);
  const [shareCheckin, setShareCheckin] = useState<CheckIn | null>(null);
  const [streak, setStreak] = useState(0);
  const [checklistDismissed, setChecklistDismissed] = useState(false);
  const [desabafoTexto, setDesabafoTexto] = useState("");
  const [desabafoNivel, setDesabafoNivel] = useState("funcional");
  const [desabafoEnviando, setDesabafoEnviando] = useState(false);
  const [desabafoEnviado, setDesabafoEnviado] = useState(false);
  const [hasDesabafo, setHasDesabafo] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<"historico" | "conquistas" | "explorar">("historico");

  const load = useCallback(async () => {
    const token = auth.getToken();
    if (!token) {
      router.replace("/onboarding");
      return;
    }
    try {
      const [p, s, ci, hist, bdg, comp] = await Promise.all([
        api.getMe(token),
        api.getScore(token),
        api.getCheckIns(token),
        api.getHistory(token).catch(() => []),
        api.getBadges(token).catch(() => []),
        api.getMeuComparativo(token).catch(() => null),
      ]);
      setProfile(p);
      setScore(s);
      const ciArr = Array.isArray(ci) ? ci : [];
      setCheckins(ciArr);
      setHistory(Array.isArray(hist) ? hist : []);
      setBadges(Array.isArray(bdg) ? bdg : []);
      setComparativo(comp ?? null);
      // Auto-calcular bathroom revenue a partir do salário (20 min/dia, 22 dias úteis, 8h/dia)
      if (p.monthly_salary_cents) {
        const perMinute = p.monthly_salary_cents / (22 * 8 * 60);
        const perCagada = Math.round(perMinute * 20);
        setFormData((prev) => ({ ...prev, bathroom_revenue_cents: perCagada }));
      }
      const today = [
        new Date().getFullYear(),
        String(new Date().getMonth() + 1).padStart(2, "0"),
        String(new Date().getDate()).padStart(2, "0"),
      ].join("-");
      setTodayDone(ciArr.some((c) => c.date === today));

      // Calcular streak de check-ins consecutivos
      const sortedDates = ciArr.map((c) => c.date).sort().reverse();
      let streak = 0;
      const cur = new Date();
      for (const d of sortedDates) {
        const expected = new Date(cur);
        expected.setDate(cur.getDate() - streak);
        if (d === expected.toISOString().slice(0, 10)) {
          streak++;
        } else break;
      }
      setStreak(streak);

      // Verificar se já fez desabafo
      api.getDesabafos(1, token).then((r) => {
        const myNick = p.nickname;
        setHasDesabafo(r.results.some((d: Desabafo) => d.author.nickname === myNick));
      }).catch(() => {});

    } catch {
      auth.clear();
      router.replace("/onboarding");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();
    const token = auth.getToken();
    if (!token) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const newCheckin = await api.createCheckIn(token, formData);
      await load();
      setShareCheckin(newCheckin);
      // 🎉 Confete corporativo
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#8257ff", "#ff6b2c", "#ffb14a", "#ffffff"] });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao registrar check-in.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogoClick() {
    setLogoClicks((n) => {
      const next = n + 1;
      if (next >= 5) {
        setEasterEgg(true);
        setTimeout(() => { setEasterEgg(false); setLogoClicks(0); }, 4000);
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.5 }, colors: ["#8257ff", "#ff6b2c", "#ffb14a"] });
        return 0;
      }
      return next;
    });
  }

  function handleLogout() {
    auth.clear();
    router.push("/");
  }

  async function handleDesabafo() {
    const token = auth.getToken();
    if (!token || !desabafoTexto.trim()) return;
    setDesabafoEnviando(true);
    try {
      await api.createDesabafo(token, { content: desabafoTexto.trim(), nivel: desabafoNivel });
      setDesabafoTexto("");
      setDesabafoEnviado(true);
      setHasDesabafo(true);
      setTimeout(() => setDesabafoEnviado(false), 3000);
    } finally {
      setDesabafoEnviando(false);
    }
  }

  async function handleShare() {    const text = `Meu Burny Score é ${score?.current_score ?? "??"} — ${scoreLabel(score?.current_score ?? 0)}. ${score?.current_insight ?? ""} #BurnyOut`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "BurnyOut", text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      /* cancelado pelo usuário */
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-violet" />
      </main>
    );
  }

  return (
    <>
    <OnboardingTour />
    {/* Share Card Modal */}
    <AnimatePresence>
      {shareCheckin && profile && (
        <ShareCardModal
          checkin={shareCheckin}
          profile={profile}
          onClose={() => setShareCheckin(null)}
        />
      )}
    </AnimatePresence>
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-violet/15 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-ember/10 blur-[100px]" />
      </div>

      {/* Easter egg overlay */}
      {easterEgg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setEasterEgg(false)}
        >
          <div className="text-center">
            <p className="text-6xl">🔥</p>
            <p className="mt-4 text-2xl font-bold text-white">Você encontrou o burnout secreto</p>
            <p className="mt-2 text-sm text-slate-400">Parabéns. Isso já era esperado de você.</p>
            <p className="mt-1 text-xs text-slate-600">Clique para continuar sofrendo</p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <header className="glass-panel relative z-50 mb-8 flex items-center justify-between rounded-full px-5 py-3">
        <button onClick={handleLogoClick} className="flex items-center gap-3">
          <div className="burn-gradient flex h-9 w-9 items-center justify-center rounded-xl text-black">
            <Flame className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-white">BurnyOut</span>
        </button>

        <div className="flex items-center gap-3">
          <Link
            href="/ferramentas"
            className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:text-white sm:flex"
          >
            <span>🛠️</span> Ferramentas
          </Link>
          <SomAmbiente />
          {profile && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{profile.avatar_emoji}</span>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">{profile.nickname}</p>
                <p className="text-xs text-slate-400">{profile.area_label}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: score + form */}
        <div className="space-y-6">

          {/* Checklist de onboarding — aparece enquanto houver tarefas pendentes */}
          {!checklistDismissed && (
            (() => {
              const tasks = [
                { done: todayDone,                           emoji: "📊", label: "Fazer o check-in de hoje" },
                { done: !!profile?.monthly_salary_cents,     emoji: "💰", label: "Cadastrar seu salário (Receita no Banheiro)", href: profile ? `/perfil/${profile.id}` : undefined },
                { done: hasDesabafo,                         emoji: "💬", label: "Escrever um desabafo no feed" },
                { done: (profile?.following_count ?? 0) > 0, emoji: "👥", label: "Seguir alguém no BurnyOut", href: "/ranking" },
              ];
              const allDone = tasks.every((t) => t.done);
              if (allDone) return null;
              const done = tasks.filter((t) => t.done).length;
              return (
                <motion.div
                  className="glass-panel rounded-[32px] p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Primeiros passos</p>
                      <h2 className="mt-1 text-lg font-semibold text-white">
                        {done}/{tasks.length} concluídos
                      </h2>
                    </div>
                    <button onClick={() => setChecklistDismissed(true)} className="text-xs text-slate-600 hover:text-slate-400">
                      dispensar
                    </button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {tasks.map((t) => (
                      <div key={t.label} className={`flex items-center gap-3 rounded-[14px] border px-4 py-3 transition-colors ${t.done ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/8 bg-black/20"}`}>
                        <span className="text-base">{t.done ? "✅" : t.emoji}</span>
                        {t.href && !t.done ? (
                          <Link href={t.href} className="flex-1 text-sm text-slate-300 hover:text-white hover:underline">{t.label}</Link>
                        ) : (
                          <span className={`flex-1 text-sm ${t.done ? "text-slate-500 line-through" : "text-slate-300"}`}>{t.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Barra de progresso */}
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${(done / tasks.length) * 100}%` }}
                    />
                  </div>
                </motion.div>
              );
            })()
          )}

          {/* Score card */}
          {score && (
            <motion.section
              className={`glass-panel rounded-[32px] p-7 transition-all duration-700 ${score.current_score >= 90 ? "border-red-500/60 shadow-[0_0_60px_rgba(255,83,112,0.35)]" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Modo Apocalipse */}
              {score.current_score >= 90 && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="mb-5 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2"
                >
                  <span className="text-lg">🚨</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-red-400">COLAPSO IMINENTE — Seu burnout atingiu nível crítico</span>
                </motion.div>
              )}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Burny Score</p>
                  <p className="mt-2 text-6xl font-bold text-white sm:text-7xl">{score.current_score}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Média semanal: <span className="text-white">{score.week_average}</span>
                  </p>
                </div>
                <span
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${scoreBadge(score.current_score)}`}
                >
                  {scoreLabel(score.current_score)}
                </span>
              </div>

              <div className="mt-6 rounded-[24px] border border-violet/20 bg-violet/8 p-4">
                <div className="flex items-center gap-2 text-xs text-violet">
                  <BrainCircuit className="h-4 w-4" />
                  Burny AI
                </div>
                <p className="mt-2 text-base font-medium leading-7 text-white">
                  {score.current_insight}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(METRIC_LABELS).map(([key, label]) => {
                  const val = score.week_totals[key as keyof typeof score.week_totals];
                  const display =
                    key === "bathroom_revenue_cents"
                      ? `R$\u00a0${(val / 100).toFixed(0)}`
                      : String(val);
                  return (
                    <div
                      key={key}
                      className="rounded-[22px] border border-white/8 bg-black/25 p-4 text-center"
                    >
                      <p className="text-2xl font-bold text-white">{display}</p>
                      <p className="mt-1 text-xs text-slate-400">{label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Custo de reunião em R$ */}
              {profile?.monthly_salary_cents && score.week_totals.useless_meetings > 0 && (() => {
                const hourly = profile.monthly_salary_cents / (22 * 8 * 100);
                const custo = (score.week_totals.useless_meetings * hourly).toFixed(2);
                return (
                  <div className="mt-3 rounded-[18px] border border-ember/20 bg-ember/5 px-4 py-3 text-center">
                    <p className="text-xs text-ember-soft opacity-80">💸 Custo das suas reuniões inúteis esta semana</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-ember-soft">R$ {custo}</p>
                    <p className="mt-0.5 text-xs text-slate-600">em salário desperdiçado em calls que poderiam ser e-mails</p>
                  </div>
                );
              })()}

              {/* Gráfico de histórico */}
              {history.length > 1 && (
                <div className="mt-6">
                  <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">Burny Score — histórico</p>
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8257ff" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#8257ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide />
                      <Tooltip
                        contentStyle={{ background: "#0f1018", border: "1px solid #ffffff18", borderRadius: 12, fontSize: 12 }}
                        labelFormatter={(v) => `📅 ${v}`}
                        formatter={(v) => [`${v ?? ""}`, "Burny Score"]}
                      />
                      <Area type="monotone" dataKey="burny_score" stroke="#8257ff" strokeWidth={2} fill="url(#burnGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Share card */}
              <div className="mt-5 flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleShare}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ember/30 bg-ember/10 py-3 text-sm font-semibold text-ember-soft transition-all hover:bg-ember/20"
                  >
                    <Share2 className="h-4 w-4" />
                    {copied ? "Copiado! 🔥" : "Compartilhar burnout"}
                  </button>
                  <button
                    onClick={() => setConviteAberto(true)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-violet/30 bg-violet/10 py-3 text-sm font-semibold text-violet transition-all hover:bg-violet/20"
                  >
                    <span>👥</span>
                    Convidar amigos
                  </button>
                </div>
                <Link
                  href="/certificado"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                >
                  <span>🏅</span>
                  Gerar certificado de sobrevivência
                </Link>

                {score && score.current_score >= 80 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.35 }}
                  >
                    <p className="mb-1.5 text-center text-[10px] uppercase tracking-[0.3em] text-emerald-400/60">
                      🔓 desbloqueado com score {score.current_score}
                    </p>
                    <PlanoFuga />
                  </motion.div>
                ) : (
                  <div className="relative overflow-hidden rounded-full border border-emerald-500/15 bg-emerald-500/5 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm">🏃</span>
                      <span className="text-sm font-semibold text-emerald-300/40">Plano de Fuga Corporativa™</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-end rounded-full pr-4">
                      <p className="text-xs font-semibold text-slate-500">
                        🔒 score ≥ 80 · atual: {score?.current_score ?? 0}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* Check-in form */}
          <motion.section
            className="glass-panel rounded-[32px] p-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Check-in diário</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {todayDone ? "Check-in de hoje registrado." : "Como foi hoje?"}
            </h2>

            {todayDone ? (
              <p className="mt-3 text-slate-400">
                Volte amanhã para registrar mais sofrimento corporativo. Seu burnout agradece.
              </p>
            ) : (
              <form onSubmit={handleCheckIn} className="mt-6 space-y-3">
                {CHECKIN_METRICS.map((m) => {
                  const val = formData[m.key] as number;
                  return m.stress ? (
                    <div key={m.key} className="rounded-[20px] border border-white/8 bg-black/20 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{m.emoji}</span>
                          <label className="text-sm font-medium text-slate-300">{m.label}</label>
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.span key={STRESS_COMMENTS[val]} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.18 }} className="text-xs italic text-slate-500">
                            {STRESS_COMMENTS[val]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <div className="flex items-center justify-between px-1">
                        {STRESS_EMOJIS.map((emoji, i) => (
                          <motion.button key={i} type="button" whileTap={{ scale: 1.4 }}
                            onClick={() => setFormData((p) => ({ ...p, stress_level: i }))}
                            animate={{ scale: val === i ? 1.3 : 1, opacity: val === i ? 1 : 0.22 }}
                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                            className="text-xl"
                          >{emoji}</motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div key={m.key} className="rounded-[20px] border border-white/8 bg-black/20 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{m.emoji}</span>
                          <label className="text-sm font-medium text-slate-300">{m.label}</label>
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.span key={m.comment(val)} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.18 }} className="text-xs italic text-slate-500">
                            {m.comment(val)}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <div className="mt-1 flex items-center gap-3">
                        <input type="range" min={m.min} max={m.max} step={m.step} value={val}
                          onChange={(e) => setFormData((p) => ({ ...p, [m.key]: Number(e.target.value) }))}
                          className="flex-1 cursor-pointer accent-violet"
                        />
                        <motion.span key={val} initial={{ scale: 0.8, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.08 }} className="min-w-[3.5rem] text-right text-xl font-bold text-white">
                          {m.display(val)}
                        </motion.span>
                      </div>
                    </div>
                  );
                })}

                {/* Preview do Burny Score */}
                <div className="rounded-[20px] border border-violet/20 bg-violet/8 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">Preview Burny Score</p>
                    <motion.span key={previewScore(formData)} initial={{ scale: 0.85, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.1 }} className="text-2xl font-bold text-white">
                      ~{previewScore(formData)}
                    </motion.span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #8257ff, #f97316, #ef4444)" }}
                      animate={{ width: `${previewScore(formData)}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 30 }}
                    />
                  </div>
                </div>

                {submitError && (
                  <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {submitError}
                  </p>
                )}

                <button type="submit" disabled={submitting}
                  className="burn-gradient flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold text-black transition-all hover:scale-[1.01] disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Calculando colapso…" : "Registrar meu burnout"}
                </button>
              </form>
            )}
          </motion.section>
        </div>

        {/* Right: history */}
        <div className="space-y-6">

          {/* Streak + Desabafo rápido */}
          <motion.div
            className="glass-panel rounded-[32px] p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Streak */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold ${streak >= 7 ? "bg-ember/20 text-ember-soft" : streak >= 3 ? "bg-yellow-500/15 text-yellow-400" : "bg-white/8 text-white"}`}>
                {streak >= 1 ? "🔥" : "💤"}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {streak} {streak === 1 ? "dia" : "dias"}
                  {streak >= 7 && <span className="ml-2 text-sm font-normal text-ember-soft">em chamas</span>}
                  {streak >= 3 && streak < 7 && <span className="ml-2 text-sm font-normal text-yellow-400">aquecendo</span>}
                </p>
                <p className="text-xs text-slate-400">
                  {streak === 0
                    ? "Faça um check-in para começar sua streak"
                    : streak >= 30
                    ? "30+ dias. Você precisa de férias ou de um psicólogo."
                    : "de check-ins consecutivos"}
                </p>
              </div>
            </div>

            {/* Desabafo rápido */}
            <div className="border-t border-white/8 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Desabafo rápido</p>
              </div>
              {desabafoEnviado ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm text-emerald-400">
                  Desabafo enviado. A comunidade te ouve. 🤝
                </div>
              ) : (
                <>
                  <div className="mb-2 flex gap-1 flex-wrap">
                    {[
                      { v: "funcional", label: "😬 Funcional" },
                      { v: "alerta", label: "⚠️ Alerta" },
                      { v: "critico", label: "🤯 Crítico" },
                      { v: "colapso", label: "💀 Colapso" },
                    ].map((n) => (
                      <button
                        key={n.v}
                        onClick={() => setDesabafoNivel(n.v)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${desabafoNivel === n.v ? "border-violet/60 bg-violet/20 text-violet" : "border-white/10 bg-white/5 text-slate-400"}`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={desabafoTexto}
                    onChange={(e) => setDesabafoTexto(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="O que aconteceu hoje no trabalho? (sem filtro)"
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-violet/40"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-600">{desabafoTexto.length}/500</span>
                    <div className="flex gap-2">
                      <Link href="/feed" className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:text-white">
                        Ver feed
                      </Link>
                      <button
                        onClick={() => void handleDesabafo()}
                        disabled={!desabafoTexto.trim() || desabafoEnviando}
                        className="flex items-center gap-1.5 rounded-full bg-violet px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50 hover:bg-violet/80 transition-colors"
                      >
                        {desabafoEnviando ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                        Publicar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Painel com abas */}
          <motion.div
            className="glass-panel rounded-[32px] p-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* Tab bar */}
            <div className="flex gap-1 rounded-2xl bg-white/5 p-1">
              {([
                { key: "historico", label: "Histórico", emoji: "📊" },
                { key: "conquistas", label: "Conquistas", emoji: "🏆" },
                { key: "explorar", label: "Explorar", emoji: "🌐" },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveRightTab(tab.key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
                    activeRightTab === tab.key
                      ? "bg-white/10 text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <AnimatePresence mode="wait">
                {activeRightTab === "historico" && (
                  <motion.div key="historico" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="space-y-2">
                    {checkins.length === 0 ? (
                      <p className="py-6 text-center text-sm text-slate-400">Nenhum check-in ainda. Sua negação está documentada.</p>
                    ) : (
                      checkins.slice(0, 7).map((ci) => (
                        <div key={ci.id} className="rounded-[18px] border border-white/8 bg-black/25 p-3.5">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-white">{ci.date}</p>
                            <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${scoreBadge(ci.burny_score)}`}>{ci.burny_score}</span>
                          </div>
                          <p className="mt-1.5 text-xs leading-5 text-slate-400">{ci.burny_insight}</p>
                        </div>
                      ))
                    )}
                    {comparativo && (
                      <div className="mt-2 rounded-[18px] border border-white/8 bg-black/20 p-4">
                        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">Você vs Brasil</p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-xl border border-white/8 bg-black/20 p-2">
                            <p className="text-lg font-bold text-white">{comparativo.usuario.avg_score}</p>
                            <p className="text-[10px] text-slate-400">Você</p>
                          </div>
                          <div className="rounded-xl border border-violet/20 bg-violet/8 p-2">
                            <p className={`text-lg font-bold ${comparativo.vs_nacional > 0 ? "text-ember-soft" : "text-emerald-400"}`}>
                              {comparativo.vs_nacional > 0 ? "+" : ""}{comparativo.vs_nacional}
                            </p>
                            <p className="text-[10px] text-violet">vs BR</p>
                          </div>
                          <div className="rounded-xl border border-white/8 bg-black/20 p-2">
                            <p className="text-lg font-bold text-slate-300">{comparativo.media_nacional.avg_score}</p>
                            <p className="text-[10px] text-slate-400">Média BR</p>
                          </div>
                        </div>
                        <p className="mt-3 text-xs italic leading-5 text-slate-500">
                          {comparativo.vs_nacional > 15 ? `${comparativo.vs_nacional} pts acima da média. Isso não é conquista normal.`
                            : comparativo.vs_nacional > 5 ? `Levemente acima da média. Você e o Brasil corporativo estão em sintonia.`
                            : comparativo.vs_nacional < -15 ? `${Math.abs(comparativo.vs_nacional)} pts abaixo da média. Você está bem. Ou em negação.`
                            : comparativo.vs_nacional < -5 ? `Levemente abaixo da média. Continue assim. Ou procure terapia.`
                            : `Na média nacional. Você representa o Brasil corporativo com precisão.`}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeRightTab === "conquistas" && (
                  <motion.div key="conquistas" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                    <BadgesSection badges={badges} />
                  </motion.div>
                )}

                {activeRightTab === "explorar" && (
                  <motion.div key="explorar" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="space-y-4">
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">Minha rede</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                          <p className="text-xl font-bold text-white">{profile?.followers_count ?? 0}</p>
                          <p className="text-xs text-slate-400">Seguidores</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                          <p className="text-xl font-bold text-white">{profile?.following_count ?? 0}</p>
                          <p className="text-xs text-slate-400">Seguindo</p>
                        </div>
                      </div>
                      {profile && (
                        <Link href={`/perfil/${profile.id}`} className="mt-2 flex items-center justify-between rounded-2xl border border-violet/20 bg-violet/8 px-4 py-3 text-sm text-violet transition-colors hover:bg-violet/15">
                          Ver meu perfil público <span>→</span>
                        </Link>
                      )}
                    </div>
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">Navegar</p>
                      <div className="space-y-2">
                        {[
                          { href: "/feed", label: "Feed & Desabafos" },
                          { href: "/ranking", label: "Ranking global" },
                          { href: "/wrapped", label: "🎬 Meu Burny Wrapped" },
                        ].map(({ href, label }) => (
                          <Link key={href} href={href} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white transition-colors hover:bg-white/8">
                            {label} <span className="text-slate-500">→</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <DicasCard />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </main>

    <ConviteModal aberto={conviteAberto} onClose={() => setConviteAberto(false)} />
    </>
  );
}
