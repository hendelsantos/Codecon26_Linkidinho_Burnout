"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Flame, Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CheckIn, CheckInPayload, Profile, ScoreResponse, api, timeAgo } from "@/lib/api";
import { auth } from "@/lib/auth";

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
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CheckInPayload>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [todayDone, setTodayDone] = useState(false);

  const load = useCallback(async () => {
    const token = auth.getToken();
    if (!token) {
      router.replace("/onboarding");
      return;
    }
    try {
      const [p, s, ci] = await Promise.all([
        api.getMe(token),
        api.getScore(token),
        api.getCheckIns(token),
      ]);
      setProfile(p);
      setScore(s);
      const ciArr = Array.isArray(ci) ? ci : [];
      setCheckins(ciArr);
      const today = new Date().toISOString().slice(0, 10);
      setTodayDone(ciArr.some((c) => c.date === today));
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
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao registrar check-in.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    auth.clear();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-violet" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-violet/15 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-ember/10 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="glass-panel mb-8 flex items-center justify-between rounded-full px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="burn-gradient flex h-9 w-9 items-center justify-center rounded-xl text-black">
            <Flame className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-white">Burny Out</span>
        </Link>

        <div className="flex items-center gap-3">
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
          {/* Score card */}
          {score && (
            <motion.section
              className="glass-panel rounded-[32px] p-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Burny Score</p>
                  <p className="mt-2 text-7xl font-bold text-white">{score.current_score}</p>
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
        </div>
      </div>
    </main>
  );
}
