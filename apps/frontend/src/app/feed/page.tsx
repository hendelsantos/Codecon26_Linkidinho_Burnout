"use client";

import { motion } from "framer-motion";
import { Flame, Loader2, RefreshCw, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Desabafo, FeedItem, api, timeAgo } from "@/lib/api";
import { auth } from "@/lib/auth";

// ──── Helpers ─────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 80) return "text-red-300 border-red-500/40 bg-red-500/10";
  if (score >= 60) return "text-ember-soft border-ember/40 bg-ember/10";
  if (score >= 40) return "text-yellow-300 border-yellow-500/40 bg-yellow-500/10";
  return "text-emerald-300 border-emerald-500/40 bg-emerald-500/10";
}

const NIVEL_OPTIONS = [
  { value: "funcional", label: "Funcional", emoji: "😬", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
  { value: "alerta", label: "Em alerta", emoji: "⚠️", color: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300" },
  { value: "critico", label: "Nível crítico", emoji: "🤯", color: "border-ember/40 bg-ember/10 text-ember-soft" },
  { value: "colapso", label: "Colapso iminente", emoji: "💀", color: "border-red-500/40 bg-red-500/10 text-red-300" },
] as const;

const REACTIONS = [
  { key: "choro", emoji: "😭", label: "Me identifico" },
  { key: "morto", emoji: "💀", label: "Morto" },
  { key: "cafe", emoji: "☕", label: "Precisa de café" },
  { key: "fogo", emoji: "🔥", label: "Em chamas" },
  { key: "abraco", emoji: "🤝", label: "Solidariedade" },
] as const;

// ──── Composer ────────────────────────────────────────────────────────────

function DesabafoComposer({
  token,
  onPosted,
}: {
  token: string | null;
  onPosted: (d: Desabafo) => void;
}) {
  const [content, setContent] = useState("");
  const [nivel, setNivel] = useState<string>("funcional");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!token) {
    return (
      <div className="glass-panel rounded-[28px] p-5 text-center text-sm text-slate-400">
        <Link href="/onboarding" className="text-violet hover:underline">
          Entre no Burny Out
        </Link>{" "}
        para desabafar publicamente.
      </div>
    );
  }

  async function submit() {
    if (!content.trim() || !token) return;
    setLoading(true);
    try {
      const d = await api.createDesabafo(token, { content: content.trim(), nivel });
      onPosted(d);
      setContent("");
      setNivel("funcional");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel rounded-[28px] p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Novo desabafo
      </p>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, 500))}
        placeholder="O que está pesando hoje? (máx 500 chars)"
        rows={3}
        className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-slate-500 focus:border-violet/50 focus:outline-none"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {NIVEL_OPTIONS.map((n) => (
            <button
              key={n.value}
              onClick={() => setNivel(n.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                nivel === n.value
                  ? n.color + " ring-1 ring-violet/50"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
              }`}
            >
              {n.emoji} {n.label}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs text-slate-500">{content.length}/500</span>
          <button
            onClick={() => void submit()}
            disabled={loading || !content.trim()}
            className="burn-gradient flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Desabafar
          </button>
        </div>
      </div>
    </div>
  );
}

// ──── Desabafo Card ───────────────────────────────────────────────────────

function DesabafoCard({
  post,
  token,
  index,
}: {
  post: Desabafo;
  token: string | null;
  index: number;
}) {
  const [reactions, setReactions] = useState(post.reaction_counts);
  const [viewerReaction, setViewerReaction] = useState(post.viewer_reaction);
  const [reactLoading, setReactLoading] = useState(false);

  const nivelConfig = NIVEL_OPTIONS.find((n) => n.value === post.nivel) ?? NIVEL_OPTIONS[0];

  async function handleReact(key: string) {
    if (!token || reactLoading) return;
    setReactLoading(true);
    try {
      const res = await api.reactToDesabafo(token, post.id, key);
      // Atualiza contagens localmente
      setReactions((prev) =>
        prev.map((r) => {
          if (r.key === key) {
            const delta = res.action === "removed" ? -1 : viewerReaction === key ? 0 : 1;
            return { ...r, count: Math.max(0, r.count + delta) };
          }
          if (r.key === viewerReaction && res.action !== "removed") {
            return { ...r, count: Math.max(0, r.count - 1) };
          }
          return r;
        }),
      );
      setViewerReaction(res.action === "removed" ? null : key);
    } finally {
      setReactLoading(false);
    }
  }

  return (
    <motion.article
      className="glass-panel rounded-[28px] p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * Math.min(index, 12), duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/perfil/${post.author.id}`}
          className="flex items-center gap-3 hover:opacity-80"
        >
          <span className="text-2xl">{post.author.avatar_emoji}</span>
          <div>
            <p className="font-semibold text-white">{post.author.nickname}</p>
            <p className="text-xs text-slate-400">
              {post.author.area_label} · {post.author.region}
            </p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${nivelConfig.color}`}>
            {nivelConfig.emoji} {nivelConfig.label}
          </span>
          <span className="text-xs text-slate-500">{timeAgo(post.created_at)}</span>
        </div>
      </div>

      {/* Content */}
      <p className="mt-4 text-base leading-7 text-slate-200">{post.content}</p>

      {/* Reactions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {reactions.map((r) => {
          const isActive = viewerReaction === r.key;
          return (
            <button
              key={r.key}
              onClick={() => void handleReact(r.key)}
              disabled={reactLoading}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${
                isActive
                  ? "border-violet/60 bg-violet/20 text-violet"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
              } disabled:opacity-50`}
            >
              <span>{r.emoji}</span>
              {r.count > 0 && <span className="font-semibold">{r.count}</span>}
            </button>
          );
        })}
      </div>
    </motion.article>
  );
}

// ──── Activity Card (check-in auto-post) ─────────────────────────────────

function ActivityCard({ post, index }: { post: FeedItem; index: number }) {
  function scoreColor(score: number) {
    if (score >= 80) return "text-red-300 border-red-500/40 bg-red-500/10";
    if (score >= 60) return "text-ember-soft border-ember/40 bg-ember/10";
    if (score >= 40) return "text-yellow-300 border-yellow-500/40 bg-yellow-500/10";
    return "text-emerald-300 border-emerald-500/40 bg-emerald-500/10";
  }

  return (
    <motion.article
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
  );
}

// ──── Page ────────────────────────────────────────────────────────────────

type Tab = "desabafos" | "atividade";

export default function FeedPage() {
  const [tab, setTab] = useState<Tab>("desabafos");
  const [desabafos, setDesabafos] = useState<Desabafo[]>([]);
  const [activity, setActivity] = useState<FeedItem[]>([]);
  const [loadingD, setLoadingD] = useState(true);
  const [loadingA, setLoadingA] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // token lido apenas no cliente para evitar mismatch de hidratação (React error #418)
  const [token, setToken] = useState<string | null>(null);

  async function loadDesabafos(currentToken?: string | null) {
    setLoadingD(true);
    setError(null);
    try {
      const res = await api.getDesabafos(30, (currentToken ?? auth.getToken()) ?? undefined);
      setDesabafos(res.results);
    } catch {
      setError("Não foi possível carregar. O backend está no ar?");
    } finally {
      setLoadingD(false);
    }
  }

  async function loadActivity() {
    setLoadingA(true);
    setError(null);
    try {
      const res = await api.getFeed(30);
      setActivity(res.results);
    } catch {
      setError("Não foi possível carregar o feed de atividade.");
    } finally {
      setLoadingA(false);
    }
  }

  useEffect(() => {
    const t = auth.getToken();
    setToken(t);
    void loadDesabafos(t);
  }, []);

  function handleTabChange(t: Tab) {
    setTab(t);
    if (t === "atividade" && activity.length === 0) void loadActivity();
  }

  function handlePosted(d: Desabafo) {
    setDesabafos((prev) => [d, ...prev]);
  }

  const isLoading = tab === "desabafos" ? loadingD : loadingA;

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

      {/* Title */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Rede social de burnout</p>
          <h1 className="mt-2 text-3xl font-bold text-white">O que todo mundo está sofrendo.</h1>
        </div>
        <button
          onClick={() => void (tab === "desabafos" ? loadDesabafos() : loadActivity())}
          disabled={isLoading}
          className="mt-2 rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-400 hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex rounded-2xl border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => handleTabChange("desabafos")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
            tab === "desabafos"
              ? "burn-gradient text-black"
              : "text-slate-400 hover:text-white"
          }`}
        >
          💬 Desabafos
        </button>
        <button
          onClick={() => handleTabChange("atividade")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
            tab === "atividade"
              ? "burn-gradient text-black"
              : "text-slate-400 hover:text-white"
          }`}
        >
          📊 Atividade
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-[24px] border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Desabafos Tab */}
      {tab === "desabafos" && (
        <div className="space-y-4">
          <DesabafoComposer token={token} onPosted={handlePosted} />

          {isLoading && desabafos.length === 0 ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-violet" />
            </div>
          ) : desabafos.length === 0 ? (
            <div className="glass-panel rounded-[28px] p-8 text-center text-sm text-slate-400">
              Nenhum desabafo ainda. Seja o primeiro a sofrer publicamente. 🎭
            </div>
          ) : (
            desabafos.map((d, i) => (
              <DesabafoCard key={d.id} post={d} token={token} index={i} />
            ))
          )}
        </div>
      )}

      {/* Atividade Tab */}
      {tab === "atividade" && (
        <div className="space-y-4">
          {isLoading && activity.length === 0 ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-violet" />
            </div>
          ) : (
            activity.map((post, i) => <ActivityCard key={post.id} post={post} index={i} />)
          )}
        </div>
      )}
    </main>
  );
}

