"use client";

import { motion } from "framer-motion";
import { Flame, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AREAS, AVATARS, REGIONS, api } from "@/lib/api";
import { auth } from "@/lib/auth";

const AREA_OPTIONS = [...AREAS];
const REGION_OPTIONS = [...REGIONS];
const AVATAR_OPTIONS = [...AVATARS];

export default function OnboardingPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [area, setArea] = useState("dev");
  const [region, setRegion] = useState("São Paulo");
  const [avatar, setAvatar] = useState("🔥");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("Escolha um apelido para sua sobrevivência.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const profile = await api.createProfile({
        nickname: nickname.trim(),
        area,
        region,
        avatar_emoji: avatar,
      });
      auth.setToken(profile.access_token);
      auth.setProfile(profile);
      router.push("/dashboard");
    } catch {
      setError("Erro ao criar perfil. O backend está operacional?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-violet/20 blur-[120px]" />
        <div className="absolute right-1/3 bottom-1/4 h-80 w-80 rounded-full bg-ember/15 blur-[100px]" />
      </div>

      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="burn-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-black shadow-[0_0_40px_rgba(130,87,255,0.45)]">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted">Burny Out</p>
            <p className="text-sm font-semibold text-white">Corporate Suffering Analytics Network</p>
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Onboarding</p>
          <h1 className="mt-3 text-3xl font-bold text-white">
            Registre seu colapso profissional.
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Anônimo, satírico, exagerado. Seus dados ficam aqui. Sua dignidade, você já perdeu.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Avatar */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Escolha seu avatar de sobrevivência
              </label>
              <div className="flex flex-wrap gap-3">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-all ${
                      avatar === emoji
                        ? "burn-gradient shadow-[0_0_20px_rgba(130,87,255,0.5)]"
                        : "border border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Nickname */}
            <div>
              <label htmlFor="nickname" className="mb-2 block text-sm font-medium text-slate-300">
                Apelido operacional
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={64}
                placeholder="dev_em_chamas, pm_em_crise…"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-slate-600 outline-none transition-colors focus:border-violet/60 focus:ring-2 focus:ring-violet/20"
              />
            </div>

            {/* Area + Region */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="area" className="mb-2 block text-sm font-medium text-slate-300">
                  Área
                </label>
                <select
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-violet/60 focus:ring-2 focus:ring-violet/20"
                >
                  {AREA_OPTIONS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="region" className="mb-2 block text-sm font-medium text-slate-300">
                  Região
                </label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-violet/60 focus:ring-2 focus:ring-violet/20"
                >
                  {REGION_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="burn-gradient flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold text-black transition-all hover:scale-[1.01] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Registrando colapso…" : "Entrar no colapso"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Sem e-mail. Sem senha. Só burnout anônimo e bem documentado.
        </p>
      </motion.div>
    </main>
  );
}
