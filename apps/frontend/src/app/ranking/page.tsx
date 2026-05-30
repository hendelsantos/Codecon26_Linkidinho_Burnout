"use client";

import { motion } from "framer-motion";
import { Flame, Loader2, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { RANKING_CATEGORIES, RankingEntry, RankingResponse, api } from "@/lib/api";

const CATEGORY_UNITS: Record<string, string> = {
  burnout: "pts",
  coffees: "cafés",
  meetings: "reuniões",
  traffic: "min",
  bathroom: "R$",
};

function formatValue(category: string, value: number): string {
  if (category === "bathroom") return `R$\u00a0${(value / 100).toFixed(0)}`;
  return `${value}`;
}

function medalColor(index: number) {
  if (index === 0) return "from-yellow-400 to-yellow-600";
  if (index === 1) return "from-slate-300 to-slate-500";
  if (index === 2) return "from-amber-600 to-amber-800";
  return "from-white/10 to-white/5";
}

export default function RankingPage() {
  const [category, setCategory] = useState("burnout");
  const [data, setData] = useState<RankingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getRankings(category);
        setData(res);
      } catch {
        setError("Não foi possível carregar o ranking.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [category]);

  const unit = CATEGORY_UNITS[category] ?? "pts";

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-1/3 top-1/3 h-80 w-80 rounded-full bg-ember/12 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="glass-panel mb-8 flex items-center justify-between rounded-full px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="burn-gradient flex h-9 w-9 items-center justify-center rounded-xl text-black">
            <Flame className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-white">Burny Out</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/feed"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Feed
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Ranking global</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Quem está sofrendo mais.</h1>
        {data && (
          <p className="mt-1 text-sm text-slate-400">Últimos 7 dias. Desde {data.since}.</p>
        )}
      </div>

      {/* Category tabs */}
      <div className="glass-panel mb-6 flex gap-2 overflow-x-auto rounded-full p-1.5">
        {RANKING_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              category === cat.value
                ? "burn-gradient text-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-[24px] border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet" />
        </div>
      ) : (
        <div className="space-y-3">
          {data?.results.map((entry: RankingEntry, index: number) => (
            <motion.div
              key={entry.id}
              className="glass-panel flex items-center gap-4 rounded-[26px] p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.4 }}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b text-sm font-bold text-black ${medalColor(index)}`}
              >
                {index < 3 ? <Trophy className="h-5 w-5" /> : index + 1}
              </div>

              <span className="text-2xl">{entry.avatar_emoji}</span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{entry.nickname}</p>
                <p className="text-xs text-slate-400">
                  {entry.area} · {entry.region}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-white">{formatValue(category, entry.value)}</p>
                <p className="text-xs text-slate-500">{unit}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
