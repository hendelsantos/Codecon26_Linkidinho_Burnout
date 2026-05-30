"use client";

import { motion } from "framer-motion";
import { ChevronDown, Eye, EyeOff, Flame, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export default function EntrarPage() {
  const router = useRouter();

  // Login com senha
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recuperação por token (colapsável)
  const [showToken, setShowToken] = useState(false);
  const [token, setToken] = useState("");
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.hasToken()) router.replace("/dashboard");
  }, [router]);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim() || !password) {
      setError("Preencha o apelido e a senha.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { access_token } = await api.login(nickname.trim(), password);
      const profile = await api.getMe(access_token);
      auth.setToken(access_token);
      auth.setProfile(profile);
      router.push("/dashboard");
    } catch {
      setError("Apelido ou senha incorretos. Se perdeu a senha, use o token de recuperação abaixo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTokenLogin(e: React.FormEvent) {
    e.preventDefault();
    const t = token.trim();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(t)) {
      setTokenError("Formato inválido. Use: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
      return;
    }
    setTokenLoading(true);
    setTokenError(null);
    try {
      const profile = await api.getMe(t);
      auth.setToken(t);
      auth.setProfile(profile);
      router.push("/dashboard");
    } catch {
      setTokenError("Token não reconhecido. Verifique se copiou corretamente.");
    } finally {
      setTokenLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-violet/20 blur-[120px]" />
        <div className="absolute right-1/3 bottom-1/4 h-80 w-80 rounded-full bg-ember/15 blur-[100px]" />
      </div>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="burn-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-black shadow-[0_0_40px_rgba(130,87,255,0.45)]">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted">Burny Out</p>
              <p className="text-sm font-semibold text-white">Corporate Suffering Analytics</p>
            </div>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            ← Início
          </Link>
        </div>

        {/* Login com senha */}
        <div className="glass-panel rounded-[32px] p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet/30 bg-violet/10">
            <KeyRound className="h-6 w-6 text-violet" />
          </div>

          <p className="text-xs uppercase tracking-[0.3em] text-muted">Acesso</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Retornar ao colapso.</h1>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Entre com seu apelido e senha cadastrados.
          </p>

          <form onSubmit={handlePasswordLogin} className="mt-8 space-y-5">
            <div>
              <label htmlFor="nickname" className="mb-2 block text-sm font-medium text-slate-300">
                Apelido operacional
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="dev_em_chamas"
                autoComplete="username"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-slate-600 outline-none transition-colors focus:border-violet/60 focus:ring-2 focus:ring-violet/20"
              />
            </div>

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
                  placeholder="sua senha de burnout"
                  autoComplete="current-password"
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
              {loading ? "Verificando…" : "Entrar"}
            </button>
          </form>
        </div>

        {/* Recuperação por token */}
        <div className="mt-4 overflow-hidden rounded-[24px] border border-white/8 bg-white/3">
          <button
            type="button"
            onClick={() => setShowToken((v) => !v)}
            className="flex w-full items-center justify-between px-6 py-4 text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            <span>🔑 Recuperar conta com token de emergência</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform ${showToken ? "rotate-180" : ""}`}
            />
          </button>

          {showToken && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.25 }}
              className="border-t border-white/8 px-6 pb-6 pt-4"
            >
              <p className="mb-4 text-xs leading-6 text-slate-500">
                Cole o token UUID que foi exibido ao finalizar seu cadastro. Ele fica salvo no seu
                histórico de área de transferência ou no lugar onde você o guardou.
              </p>
              <form onSubmit={handleTokenLogin} className="space-y-3">
                <textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  rows={2}
                  spellCheck={false}
                  autoComplete="off"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder-slate-600 outline-none transition-colors focus:border-ember/50 focus:ring-2 focus:ring-ember/20"
                />
                {tokenError && (
                  <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {tokenError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={tokenLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-ember/40 bg-ember/10 py-3 text-sm font-semibold text-ember transition-all hover:bg-ember/20 disabled:opacity-60"
                >
                  {tokenLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {tokenLoading ? "Verificando token…" : "Entrar com token"}
                </button>
              </form>
            </motion.div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Não tem conta ainda?{" "}
          <Link href="/onboarding" className="text-violet hover:underline">
            Registrar novo colapso
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
