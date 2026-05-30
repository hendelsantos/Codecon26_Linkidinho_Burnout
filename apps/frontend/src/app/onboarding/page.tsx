"use client";

import { motion } from "framer-motion";
import { Check, Copy, Eye, EyeOff, Flame, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AREAS, AVATARS, REGIONS, api } from "@/lib/api";
import { auth } from "@/lib/auth";

const AREA_OPTIONS = [...AREAS];
const REGION_OPTIONS = [...REGIONS];
const AVATAR_OPTIONS = [...AVATARS];

// ──── Step 2: Mostrar token ──────────────────────────────────────────────

function TokenStep({ token, onContinue }: { token: string; onContinue: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <motion.div
      className="w-full max-w-lg"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <span className="text-2xl">🎉</span>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-muted">Cadastro realizado</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Conta criada com sucesso!</h1>
        <p className="mt-2 text-sm leading-7 text-slate-400">
          Seu cadastro está <strong className="text-white">salvo permanentemente</strong>. Se limpar o cache ou trocar de dispositivo, basta entrar com seu <strong className="text-white">apelido e senha</strong>. O token abaixo é seu <strong className="text-white">código de emergência</strong> caso esqueça a senha.
        </p>

        <div className="mt-6 rounded-2xl border border-violet/30 bg-violet/8 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet">
            Seu token único
          </p>
          <div className="flex items-center gap-3">
            <code className="flex-1 break-all font-mono text-sm text-white">{token}</code>
            <button
              onClick={() => void copy()}
              className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/8 px-4 py-3 text-xs text-yellow-300">
          🔑 Guarde este token como backup. Se esquecer a senha, use-o em{" "}
          <strong>/entrar → "Esqueci minha senha"</strong>.
        </div>

        <button
          onClick={onContinue}
          className="burn-gradient mt-6 flex w-full items-center justify-center rounded-full py-4 text-base font-semibold text-black transition-all hover:scale-[1.01]"
        >
          {copied ? "Token copiado! Ir para o dashboard →" : "Continuar para o dashboard →"}
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-slate-600">
        Para entrar depois:{" "}
        <Link href="/entrar" className="text-violet hover:underline">
          /entrar
        </Link>{" "}
        com seu apelido e senha.
      </p>
    </motion.div>
  );
}

// ──── Step 1: Form de cadastro ────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [area, setArea] = useState("dev");
  const [region, setRegion] = useState("São Paulo");
  const [avatar, setAvatar] = useState("🔥");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedToken, setSavedToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("Escolha um apelido para sua sobrevivência.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
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
        password,
      });
      auth.setToken(profile.access_token);
      auth.setProfile(profile);
      setSavedToken(profile.access_token); // mostra tela de token
    } catch {
      setError("Erro ao criar perfil. O backend está operacional?");
    } finally {
      setLoading(false);
    }
  }

  // Tela de token após cadastro
  if (savedToken) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-violet/20 blur-[120px]" />
          <div className="absolute right-1/3 bottom-1/4 h-80 w-80 rounded-full bg-ember/15 blur-[100px]" />
        </div>
        <TokenStep token={savedToken} onContinue={() => router.push("/dashboard")} />
      </main>
    );
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
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="burn-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-black shadow-[0_0_40px_rgba(130,87,255,0.45)]">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted">Burny Out</p>
              <p className="text-sm font-semibold text-white">Corporate Suffering Analytics Network</p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            ← Início
          </Link>
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

            {/* Senha */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="mín. 6 caracteres"
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 pr-11 text-white placeholder-slate-600 outline-none transition-colors focus:border-violet/60 focus:ring-2 focus:ring-violet/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-300">
                  Confirmar senha
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="repita a senha"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-slate-600 outline-none transition-colors focus:border-violet/60 focus:ring-2 focus:ring-violet/20"
                />
              </div>
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

        <p className="mt-6 text-center text-sm text-slate-500">
          Já tem conta?{" "}
          <Link href="/entrar" className="text-violet hover:underline">
            Entrar com meu token
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
