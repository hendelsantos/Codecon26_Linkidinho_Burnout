"use client";

import { motion } from "framer-motion";
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
  const [streak, setStreak] = useState(0);
  const [checklistDismissed, setChecklistDismissed] = useState(false);
  const [desabafoTexto, setDesabafoTexto] = useState("");
  const [desabafoNivel, setDesabafoNivel] = useState("funcional");
  const [desabafoEnviando, setDesabafoEnviando] = useState(false);
  const [desabafoEnviado, setDesabafoEnviado] = useState(false);
  const [hasDesabafo, setHasDesabafo] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);

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
      await api.createCheckIn(token, formData);
      await load();
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
      <header className="glass-panel mb-8 flex items-center justify-between rounded-full px-5 py-3">
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

                {score && score.current_score >= 80 && (
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
              <form onSubmit={handleCheckIn} className="mt-6 space-y-5">
                {(
                  [
                    ["coffees", "Cafés consumidos", 0, 20],
                    ["useless_meetings", "Reuniões inúteis", 0, 20],
                    ["traffic_minutes", "Minutos no trânsito", 0, 300],
                    ["stress_level", "Nível de stress (0-10)", 0, 10],
                    ["buzzwords_endured", "Buzzwords aguentadas", 0, 60],
                    ["bathroom_revenue_cents", "Bathroom Revenue (centavos)", 0, 2000],
                  ] as [keyof CheckInPayload, string, number, number][]
                ).map(([key, label, min, max]) => (
                  <div key={key}>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-300">{label}</label>
                      <span className="text-sm font-bold text-white">{formData[key]}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={formData[key]}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, [key]: Number(e.target.value) }))
                      }
                      className="w-full accent-violet"
                    />
                  </div>
                ))}

                {submitError && (
                  <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
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

          <motion.section
            className="glass-panel rounded-[32px] p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Histórico</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Seus últimos colapsos</h2>

            <div className="mt-5 space-y-3">
              {checkins.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Nenhum check-in ainda. Sua negação está documentada.
                </p>
              ) : (
                checkins.slice(0, 10).map((ci) => (
                  <div
                    key={ci.id}
                    className="rounded-[22px] border border-white/8 bg-black/25 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{ci.date}</p>
                      <span
                        className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${scoreBadge(ci.burny_score)}`}
                      >
                        {ci.burny_score}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{ci.burny_insight}</p>
                  </div>
                ))
              )}
            </div>
          </motion.section>

          <motion.div
            className="glass-panel rounded-[32px] p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Minha rede</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-xl font-bold text-white">{profile?.followers_count ?? 0}</p>
                <p className="mt-0.5 text-xs text-slate-400">Seguidores</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-xl font-bold text-white">{profile?.following_count ?? 0}</p>
                <p className="mt-0.5 text-xs text-slate-400">Seguindo</p>
              </div>
            </div>
            {profile && (
              <Link
                href={`/perfil/${profile.id}`}
                className="mt-3 flex items-center justify-between rounded-2xl border border-violet/20 bg-violet/8 px-4 py-3 text-sm text-violet transition-colors hover:bg-violet/15"
              >
                Ver meu perfil público
                <span>→</span>
              </Link>
            )}
          </motion.div>

          <motion.div
            className="glass-panel rounded-[32px] p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Explorar</p>
            <div className="mt-4 space-y-2">
              {[
                { href: "/feed", label: "Feed & Desabafos" },
                { href: "/ranking", label: "Ranking global" },
                { href: "/wrapped", label: "🎬 Meu Burny Wrapped" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white transition-colors hover:bg-white/8"
                >
                  {label}
                  <span className="text-slate-500">→</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <BadgesSection badges={badges} />
          </motion.div>

          {/* Comparativo nacional */}
          {comparativo && (
            <motion.div
              className="glass-panel rounded-[32px] p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Você vs Brasil</p>
              <p className="mt-1 text-sm text-slate-400">
                Média dos últimos 7 dias vs. média nacional
              </p>

              {/* Score comparativo */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                  <p className="text-2xl font-bold text-white">{comparativo.usuario.avg_score}</p>
                  <p className="mt-1 text-[10px] text-slate-400">Você</p>
                </div>
                <div className="rounded-2xl border border-violet/20 bg-violet/8 p-3">
                  <p className={`text-2xl font-bold ${comparativo.vs_nacional > 0 ? "text-ember-soft" : comparativo.vs_nacional < 0 ? "text-emerald-400" : "text-white"}`}>
                    {comparativo.vs_nacional > 0 ? "+" : ""}{comparativo.vs_nacional}
                  </p>
                  <p className="mt-1 text-[10px] text-violet">vs nacional</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                  <p className="text-2xl font-bold text-slate-300">{comparativo.media_nacional.avg_score}</p>
                  <p className="mt-1 text-[10px] text-slate-400">Média BR</p>
                </div>
              </div>

              {/* Comentário cômico */}
              <div className="mt-3 rounded-[16px] border border-white/8 bg-white/3 px-4 py-3">
                <p className="text-xs leading-5 text-slate-400 italic">
                  {comparativo.vs_nacional > 15
                    ? `Você está ${comparativo.vs_nacional} pontos acima da média nacional. Isso não é uma conquista que se comemora normalmente.`
                    : comparativo.vs_nacional > 5
                    ? `Levemente acima da média. Você e o Brasil corporativo estão em sintonia — o que diz muito sobre o Brasil corporativo.`
                    : comparativo.vs_nacional < -15
                    ? `${Math.abs(comparativo.vs_nacional)} pontos abaixo da média. Você está bem. Ou está em negação. Difícil dizer.`
                    : comparativo.vs_nacional < -5
                    ? `Levemente abaixo da média. Continue assim. Ou procure terapia. Ou ambos.`
                    : `Na média nacional de sofrimento. Você representa o Brasil corporativo com precisão.`
                  }
                </p>
              </div>

              {/* Métricas detalhadas */}
              <div className="mt-3 space-y-2">
                {[
                  {
                    emoji: "☕",
                    label: "Cafés/dia",
                    voce: comparativo.usuario.avg_cafes,
                    media: comparativo.media_nacional.avg_cafes,
                  },
                  {
                    emoji: "📅",
                    label: "Reuniões/dia",
                    voce: comparativo.usuario.avg_reunioes,
                    media: comparativo.media_nacional.avg_reunioes,
                  },
                ].map((m) => {
                  const diff = Number((m.voce - m.media).toFixed(1));
                  return (
                    <div key={m.label} className="flex items-center gap-2 text-xs">
                      <span>{m.emoji}</span>
                      <span className="flex-1 text-slate-400">{m.label}</span>
                      <span className="font-semibold text-white">{m.voce}</span>
                      <span className={`font-mono ${diff > 0 ? "text-ember-soft" : diff < 0 ? "text-emerald-400" : "text-slate-500"}`}>
                        {diff > 0 ? `+${diff}` : diff < 0 ? diff : "="}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Comparativo com área */}
              <div className="mt-3 rounded-[14px] border border-white/6 bg-white/2 px-3 py-2 text-xs text-slate-500">
                Vs. {comparativo.usuario.area_label}: {" "}
                <span className={comparativo.vs_area > 0 ? "text-ember-soft" : comparativo.vs_area < 0 ? "text-emerald-400" : "text-slate-400"}>
                  {comparativo.vs_area > 0 ? "+" : ""}{comparativo.vs_area} pts
                </span>
                {comparativo.vs_area > 0
                  ? " — acima dos seus colegas de área"
                  : comparativo.vs_area < 0
                  ? " — mais saudável que a sua área"
                  : " — exatamente na média da área"}
              </div>
            </motion.div>
          )}

          {/* Dica corporativa rotativa */}
          <DicasCard />
        </div>
      </div>
    </main>

    <ConviteModal aberto={conviteAberto} onClose={() => setConviteAberto(false)} />
    </>
  );
}
