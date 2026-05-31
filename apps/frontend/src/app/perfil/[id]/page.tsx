"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Flame, Loader2, UserCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { ProfileDetail, SkillItem, BathroomRanking, api, timeAgo } from "@/lib/api";
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

  const [profile, setProfile] = useState<ProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bathroomRanking, setBathroomRanking] = useState<BathroomRanking | null>(null);
  const [salaryInput, setSalaryInput] = useState("");
  const [savingSalary, setSavingSalary] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const requests: [Promise<ProfileDetail>, Promise<BathroomRanking | null>] = [
          api.getProfile(params.id, token ?? undefined),
          api.getBathroomRanking().catch(() => null),
        ];
        const [p, ranking] = await Promise.all(requests);
        setProfile(p);
        setFollowersCount(p.followers_count);
        setIsFollowing(p.is_following);
        setBathroomRanking(ranking);
        if (p.monthly_salary_cents) {
          setSalaryInput(String(Math.round(p.monthly_salary_cents / 100)));
        }
        // Verificar propriedade via API (mais confiável que localStorage)
        if (token) {
          api.getMe(token).then((me) => {
            setIsOwnProfile(me.id === params.id);
            auth.setProfile(me); // manter localStorage atualizado
          }).catch(() => {
            // fallback: comparar com localStorage
            const cached = auth.getProfile();
            setIsOwnProfile(cached?.id === params.id);
          });
        }
      } catch {
        setError("Perfil não encontrado ou o backend está offline.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [params.id, token]);

  async function handleSaveSalary() {
    if (!token || savingSalary) return;
    const cents = Math.round(parseFloat(salaryInput.replace(",", ".")) * 100);
    if (!cents || isNaN(cents) || cents <= 0) {
      toast.error("Valor inválido. Digite apenas números, ex: 8000");
      return;
    }
    setSavingSalary(true);
    try {
      const updated = await api.updateProfile(token, { monthly_salary_cents: cents });
      setProfile((p) => p ? { ...p, monthly_salary_cents: updated.monthly_salary_cents } : p);
      toast.success("Salário salvo com sucesso!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[salary] PATCH falhou:", msg);
      toast.error(`Erro ao salvar: ${msg.slice(0, 80)}`);
    } finally {
      setSavingSalary(false);
    }
  }

  async function handleFollow() {    if (!token) {
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
          <span className="text-sm font-semibold text-white">BurnyOut</span>
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
                    No BurnyOut desde {new Date(profile.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
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

          {/* Bathroom Revenue */}
          <motion.div
            className="glass-panel rounded-[28px] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xl">🚽</span>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Receita no Banheiro
              </h2>
            </div>
            <p className="mb-4 text-xs text-slate-500">
              Quanto você rende pro seu empregador enquanto cuida das necessidades básicas da humanidade.
            </p>

            {/* Salary input — só para o próprio perfil */}
            {isOwnProfile && token && (
              <div className="mb-5 rounded-[18px] border border-violet/20 bg-violet/5 p-4">
                <p className="mb-2 text-xs font-medium text-violet">
                  {profile?.monthly_salary_cents ? "Seu salário mensal (CLT/PJ)" : "Cadastre seu salário para calcular"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">R$</span>
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={salaryInput}
                    onChange={(e) => setSalaryInput(e.target.value)}
                    placeholder="Ex: 8000"
                    className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-violet/50"
                  />
                  <span className="text-sm text-slate-400">/mês</span>
                  <button
                    onClick={() => void handleSaveSalary()}
                    disabled={savingSalary || !salaryInput}
                    className="rounded-xl bg-violet px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-violet/80 transition-colors"
                  >
                    {savingSalary ? "..." : "Salvar"}
                  </button>
                </div>
                {profile?.monthly_salary_cents && (
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {(() => {
                      const hourly = profile.monthly_salary_cents / (22 * 8 * 100);
                      const perMin = hourly / 60;
                      const perCagada = perMin * 20; // 20 min de média
                      return (
                        <>
                          <div className="rounded-xl bg-black/20 p-2">
                            <p className="text-base font-bold text-white">R${hourly.toFixed(2)}</p>
                            <p className="text-[10px] text-slate-500">por hora</p>
                          </div>
                          <div className="rounded-xl bg-black/20 p-2">
                            <p className="text-base font-bold text-white">R${perMin.toFixed(2)}</p>
                            <p className="text-[10px] text-slate-500">por minuto</p>
                          </div>
                          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2">
                            <p className="text-base font-bold text-emerald-400">R${perCagada.toFixed(2)}</p>
                            <p className="text-[10px] text-emerald-600">por cagada*</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
                {profile?.monthly_salary_cents && (
                  <p className="mt-2 text-[10px] text-slate-600 italic">*estimativa de 20 min por sessão. Valores podem variar conforme a fibra da sua alimentação.</p>
                )}
              </div>
            )}

            {/* Comunidade stats */}
            {bathroomRanking && (
              <>
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div className="rounded-[16px] border border-white/8 bg-black/20 p-3 text-center">
                    <p className="text-lg font-bold text-white">
                      R${(bathroomRanking.media_comunidade_cents / 100).toFixed(2)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">média/dia na comunidade</p>
                  </div>
                  <div className="rounded-[16px] border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                    <p className="text-lg font-bold text-emerald-400">
                      R${(bathroomRanking.total_gerado_comunidade_cents / 100).toFixed(0)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-emerald-600">total gerado pela comunidade</p>
                  </div>
                </div>

                {bathroomRanking.top_cagadores.length > 0 && (
                  <>
                    <p className="mb-2 text-[11px] uppercase tracking-widest text-slate-500">🏆 Hall of Fame do Banheiro</p>
                    <div className="space-y-2">
                      {bathroomRanking.top_cagadores.slice(0, 5).map((entry, i) => (
                        <div
                          key={entry.nickname}
                          className={`flex items-center gap-3 rounded-[14px] border px-3 py-2 ${i === 0 ? "border-yellow-500/30 bg-yellow-500/5" : "border-white/6 bg-white/2"}`}
                        >
                          <span className="text-base font-bold text-slate-500 w-5 text-center">{i + 1}</span>
                          <span className="text-lg">{entry.avatar_emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{entry.nickname}</p>
                            <p className="text-[11px] text-slate-500">{entry.area_label}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-emerald-400">R${(entry.total_revenue_cents / 100).toFixed(0)}</p>
                            <p className="text-[10px] text-slate-600">total acumulado</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {!isOwnProfile && !token && (
                      <p className="mt-3 text-center text-xs text-slate-500">
                        <a href="/onboarding" className="text-violet hover:underline">Entre</a> para aparecer no ranking
                      </p>
                    )}
                  </>
                )}

                {bathroomRanking.top_cagadores.length === 0 && (
                  <p className="text-center text-sm text-slate-500 py-4">
                    Ninguém cadastrou salário ainda. Seja o primeiro a saber quanto ganha cagando.
                  </p>
                )}
              </>
            )}
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
