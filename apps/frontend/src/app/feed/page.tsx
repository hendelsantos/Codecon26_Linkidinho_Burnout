"use client";

import { motion } from "framer-motion";
import { Flame, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FeedItem, api, timeAgo } from "@/lib/api";

function scoreColor(score: number) {
  if (score >= 80) return "text-red-300 border-red-500/40 bg-red-500/10";
  if (score >= 60) return "text-ember-soft border-ember/40 bg-ember/10";
  if (score >= 40) return "text-yellow-300 border-yellow-500/40 bg-yellow-500/10";
  return "text-emerald-300 border-emerald-500/40 bg-emerald-500/10";
}

export default function FeedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getFeed(30);
      setItems(res.results);
    } catch {
      setError("Não foi possível carregar o feed. O backend está no ar?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-violet/15 blur-[120px]" />
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
            href="/dashboard"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Dashboard
          </Link>
          <Link
            href="/ranking"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Ranking
          </Link>
        </div>
      </header>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Feed público</p>
          <h1 className="mt-2 text-3xl font-bold text-white">No que todo mundo está sofrendo.</h1>
          <p className="mt-1 text-sm text-slate-400">
            {items.length} relatos de sobrevivência corporativa.
          </p>
        </div>
        <button
          onClick={() => void load()}
          disabled={loading}
          className="mt-2 rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-400 hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-[24px] border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet" />
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((post, index) => (
            <motion.article
              key={post.id}
              className="glass-panel rounded-[28px] p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * Math.min(index, 12), duration: 0.4 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{post.avatar_emoji}</span>
                  <div>
                    <p className="font-semibold text-white">{post.author}</p>
                    <p className="text-xs text-slate-400">
                      {post.role} · {post.region}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${scoreColor(post.burny_score)}`}>
                    {post.burny_score}
                  </span>
                  <span className="text-xs text-slate-500">{timeAgo(post.created_at)}</span>
                </div>
              </div>

              <p className="mt-4 text-base leading-7 text-slate-200">{post.message}</p>

              <p className="mt-3 border-l-2 border-violet/40 pl-3 text-sm italic leading-6 text-slate-400">
                {post.insight}
              </p>
            </motion.article>
          ))}
        </div>
      )}
    </main>
  );
}
