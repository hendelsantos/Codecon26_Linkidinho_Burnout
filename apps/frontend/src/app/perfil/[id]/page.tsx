"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Flame, Loader2, UserCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ProfileDetail, SkillItem, api, timeAgo } from "@/lib/api";
import { auth } from "@/lib/auth";

// ──── Helpers ─────────────────────────────────────────────────────────────

const NIVEL_EMOJIS: Record<string, string> = {
  funcional: "😬",
  alerta: "⚠️",
  critico: "🤯",
  colapso: "💀",
};

const ALL_SKILLS = [
  { key: "reunioes_survival", label: "Sobrevivência em Reuniões de 2h" },
  { key: "cafe_pro", label: "Consumo Avançado de Café" },
  { key: "tudo_bem", label: "Arte de Fingir que Está Tudo Bem" },
  { key: "crise_1759", label: "Gestão de Crises às 17h59" },
  { key: "banheiro", label: "Otimização de Tempo no Banheiro" },
  { key: "email_urgente", label: "Leitura de E-mail como se Fosse Urgente" },
  { key: "procrastinacao", label: "Procrastinação Estratégica" },
  { key: "pos_daily", label: "Resiliência Pós-Daily" },
  { key: "reuniao_email", label: "Especialista em Reuniões que Poderiam ser E-mail" },
  { key: "git_blame", label: "Mestre do Git Blame Criativo" },
  { key: "deadline_ninja", label: "Ninja de Deadlines de Última Hora" },
  { key: "slack_offline", label: "Expert em Parecer Offline no Slack" },
];

// ──── Skill Card ──────────────────────────────────────────────────────────

function SkillCard({
  skill,
  canEndorse,
  token,
  profileId,
}: {
  skill: SkillItem;
  canEndorse: boolean;
  token: string | null;
  profileId: string;
}) {
  const [count, setCount] = useState(skill.count);
  const [loading, setLoading] = useState(false);

  async function handleEndorse() {
    if (!token || loading) return;
    setLoading(true);
    try {
      const res = await api.endorseSkill(token, profileId, skill.key);
      setCount((c) => (res.action === "endorsed" ? c + 1 : Math.max(0, c - 1)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-white">{skill.label}</p>
        <p className="text-xs text-slate-400">{count} endosso{count !== 1 ? "s" : ""}</p>
      </div>
      {canEndorse && (
        <button
          onClick={() => void handleEndorse()}
          disabled={loading}
          className="ml-3 shrink-0 rounded-full border border-violet/40 bg-violet/10 px-3 py-1 text-xs font-medium text-violet transition-all hover:bg-violet/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "👍 Endossar"}
        </button>
      )}
    </div>
  );
}

// ──── Page ────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const token = auth.getToken();
  const myProfile = auth.getProfile();

  const [profile, setProfile] = useState<ProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = myProfile?.id === params.id;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await api.getProfile(params.id, token ?? undefined);
        setProfile(p);
        setFollowersCount(p.followers_count);
        setIsFollowing(p.is_following);
      } catch {
        setError("Perfil não encontrado ou o backend está offline.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [params.id]);

  async function handleFollow() {
    if (!token) {
      router.push("/onboarding");
      return;
    }
    setFollowLoading(true);
    try {
      const res = await api.followProfile(token, params.id);
      setIsFollowing(res.action === "followed");
      setFollowersCount(res.followers_count);
    } finally {
      setFollowLoading(false);
    }
  }

  // Merge endorsed skills with full list (endorsed first, then rest)
  const endorsedKeys = new Set((profile?.skills ?? []).map((s) => s.key));
  const allSkillItems: SkillItem[] = [
    ...(profile?.skills ?? []),
    ...ALL_SKILLS.filter((s) => !endorsedKeys.has(s.key)).map((s) => ({
      ...s,
      count: 0,
    })),
  ];

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-1/3 top-1/3 h-80 w-80 rounded-full bg-violet/15 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="glass-panel mb-8 flex items-center justify-between rounded-full px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="burn-gradient flex h-9 w-9 items-center justify-center rounded-xl text-black">
            <Flame className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-white">Burny Out</span>
        </Link>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-violet" />
        </div>
      ) : error ? (
        <div className="glass-panel rounded-[28px] p-8 text-center text-sm text-red-300">
          {error}
        </div>
      ) : profile ? (
        <div className="space-y-5">
          {/* Profile Card */}
          <motion.div
            className="glass-panel rounded-[28px] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{profile.avatar_emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.nickname}</h1>
                  <p className="text-sm text-slate-400">
                    {profile.area_label} · {profile.region}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    No Burny Out desde {new Date(profile.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>

              {!isOwnProfile && (
                <button
                  onClick={() => void handleFollow()}
                  disabled={followLoading}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 ${
                    isFollowing
                      ? "border border-white/20 bg-white/10 text-white hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                      : "burn-gradient text-black"
                  }`}
                >
                  {followLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : isFollowing ? (
                    <UserCheck className="h-3.5 w-3.5" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                  {isFollowing ? "Seguindo" : "Seguir"}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-white">{followersCount}</p>
                <p className="mt-1 text-xs text-slate-400">Seguidores</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-white">{profile.following_count}</p>
                <p className="mt-1 text-xs text-slate-400">Seguindo</p>
              </div>
            </div>
          </motion.div>

          {/* Burny Skills */}
          <motion.div
            className="glass-panel rounded-[28px] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Burny Skills
              </h2>
              {!token && (
                <Link href="/onboarding" className="text-xs text-violet hover:underline">
                  Entre para endossar
                </Link>
              )}
            </div>
            <div className="space-y-2">
              {allSkillItems.map((s) => (
                <SkillCard
                  key={s.key}
                  skill={s}
                  canEndorse={!!token && !isOwnProfile}
                  token={token}
                  profileId={profile.id}
                />
              ))}
            </div>
          </motion.div>
        </div>
      ) : null}
    </main>
  );
}
