"use client";

import { motion } from "framer-motion";
import { Flame, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export default function EntrarPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se já tem token válido, vai direto pro dashboard
  useEffect(() => {
    if (auth.hasToken()) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = token.trim();
    if (!t) {
      setError("Cole seu token de acesso para continuar.");
      return;
    }

    // Valida formato UUID básico
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(t)) {
      setError("Formato de token inválido. Deve ser um UUID como: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const profile = await api.getMe(t);
      auth.setToken(t);
      auth.setProfile(profile);
      router.push("/dashboard");
    } catch {
      setError(
        "Token não reconhecido. Verifique se copiou corretamente ou crie uma conta nova.",
      );
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

        <div className="glass-panel rounded-[32px] p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet/30 bg-violet/10">
            <KeyRound className="h-6 w-6 text-violet" />
          </div>

          <p className="text-xs uppercase tracking-[0.3em] text-muted">Acesso</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Retornar ao colapso.</h1>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Cole seu token de acesso abaixo. Você recebeu ele ao se cadastrar. Sem senha, só burnout.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="token" className="mb-2 block text-sm font-medium text-slate-300">
                Token de acesso
              </label>
              <textarea
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                rows={3}
                spellCheck={false}
                autoComplete="off"
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder-slate-600 outline-none transition-colors focus:border-violet/60 focus:ring-2 focus:ring-violet/20"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
              </p>
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
              {loading ? "Verificando token…" : "Entrar"}
            </button>
          </form>
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
