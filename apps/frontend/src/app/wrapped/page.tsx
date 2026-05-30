"use client";

import { motion } from "framer-motion";
import { Flame, Loader2, Trophy } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Wrapped, api } from "@/lib/api";
import { auth } from "@/lib/auth";

function StatCard({ emoji, label, value }: { emoji: string; label: string; value: string | number }) {
  return (
    <motion.div
      className="rounded-[24px] border border-white/8 bg-black/30 p-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-3xl">{emoji}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </motion.div>
  );
}

function scoreBadge(score: number) {
  if (score >= 80) return "text-red-300";
  if (score >= 60) return "text-ember-soft";
  if (score >= 40) return "text-yellow-300";
  return "text-emerald-300";
}

export default function WrappedPage() {
  const [data, setData] = useState<Wrapped | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = auth.getToken();
    if (!token) { setError("Faça login para ver seu Wrapped."); setLoading(false); return; }
    try {
      const w = await api.getWrapped(token);
      setData(w);
    } catch {
      setError("Nenhum check-in registrado ainda. Seu Wrapped está vazio por enquanto.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-violet" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
        <p className="text-center text-slate-400">{error}</p>
        <Link href="/dashboard" className="burn-gradient rounded-full px-6 py-3 text-sm font-semibold text-black">
          Ir para o Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet/20 blur-[160px]" />
      </div>

      {/* Header */}
      <header className="glass-panel mb-8 flex items-center justify-between rounded-full px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="burn-gradient flex h-9 w-9 items-center justify-center rounded-xl text-black">
            <Flame className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-white">Burny Out</span>
        </Link>
        <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white">← Dashboard</Link>
      </header>

      {/* Hero */}
      <motion.div
        className="glass-panel mb-8 rounded-[40px] p-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-5xl">{data.profile.emoji}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-muted">Burny Wrapped™</p>
        <h1 className="mt-2 text-4xl font-bold text-white">{data.profile.nickname}</h1>
        <p className="mt-2 text-slate-400">{data.profile.area} · {data.profile.region}</p>

        <div className="mt-6 inline-block rounded-full border border-violet/30 bg-violet/10 px-6 py-2">
          <span className="text-sm text-slate-300">Burny Score médio: </span>
          <span className={`text-2xl font-bold ${scoreBadge(data.burny_score_avg)}`}>
            {data.burny_score_avg}
          </span>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard emoji="📋" label="Check-ins registrados" value={data.checkins_total} />
        <StatCard emoji="☕" label="Cafés consumidos" value={data.coffees_total} />
        <StatCard emoji="😵" label="Reuniões inúteis" value={data.meetings_total} />
        <StatCard emoji="🚗" label="Horas no trânsito" value={`${data.traffic_hours}h`} />
        <StatCard emoji="🚽" label="Bathroom Revenue" value={`R$${data.bathroom_revenue_reais}`} />
        <StatCard emoji="🤖" label="Buzzwords aguentadas" value={data.buzzwords_total} />
      </div>

      {/* Score range */}
      <motion.div
        className="glass-panel mb-8 rounded-[32px] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-ember-soft" />
          <p className="text-sm font-semibold text-white">Extremos do seu burnout</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {data.worst_day && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-xs text-red-400 uppercase tracking-wider">Pior dia</p>
              <p className="mt-1 text-2xl font-bold text-red-300">{data.worst_day.score}</p>
              <p className="mt-0.5 text-xs text-slate-400">{data.worst_day.date}</p>
              <p className="mt-2 text-xs leading-5 text-slate-300 line-clamp-3">{data.worst_day.insight}</p>
            </div>
          )}
          {data.best_day && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs text-emerald-400 uppercase tracking-wider">Melhor dia</p>
              <p className="mt-1 text-2xl font-bold text-emerald-300">{data.best_day.score}</p>
              <p className="mt-0.5 text-xs text-slate-400">{data.best_day.date}</p>
              <p className="mt-2 text-xs leading-5 text-slate-300 line-clamp-3">{data.best_day.insight}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stress */}
      <motion.div
        className="glass-panel mb-8 rounded-[32px] p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Estresse médio</p>
        <p className={`mt-2 text-6xl font-bold ${scoreBadge(data.stress_avg * 10)}`}>
          {data.stress_avg}<span className="text-2xl text-slate-500">/10</span>
        </p>
        <p className="mt-2 text-sm text-slate-400">
          {data.stress_avg >= 8
            ? "Seu sistema nervoso pediu demissão mas ainda não recebeu a rescisão."
            : data.stress_avg >= 6
            ? "Funcionalmente destruído. Operacionalmente presente."
            : "Surpreendentemente intacto. Investigação em andamento."}
        </p>
      </motion.div>

      {/* CTA */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => {
            const text = `Meu Burny Wrapped: ${data.checkins_total} check-ins, ${data.coffees_total} cafés, Burny Score médio ${data.burny_score_avg}. ${data.profile.emoji} #BurnyOut`;
            if (navigator.share) navigator.share({ title: "Burny Wrapped", text }).catch(() => {});
            else navigator.clipboard.writeText(text).catch(() => {});
          }}
          className="burn-gradient flex-1 rounded-full py-4 text-base font-semibold text-black"
        >
          Compartilhar meu Wrapped 🔥
        </button>
        <Link href="/dashboard" className="flex-1 rounded-full border border-white/10 py-4 text-center text-base font-semibold text-white hover:bg-white/5">
          Voltar ao Dashboard
        </Link>
      </div>
    </main>
  );
}
