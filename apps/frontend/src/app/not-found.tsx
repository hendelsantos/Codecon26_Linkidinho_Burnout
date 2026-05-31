"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const MENSAGENS = [
  "Motivação não encontrada.",
  "Página pediu home office permanente.",
  "Conteúdo em reunião de alinhamento.",
  "Esta rota foi para o burnout.",
  "Em processo de onboarding no /dev/null.",
  "Deadline expirado.",
];

export default function NotFound() {
  const [score] = useState(() => Math.floor(Math.random() * 15) + 87);
  const [msg] = useState(() => MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)]);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[140px]" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-violet/10 blur-[100px]" />
      </div>

      {/* Logo */}
      <Link href="/" className="mb-12 flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
        <div className="burn-gradient flex h-9 w-9 items-center justify-center rounded-xl text-black">
          <Flame className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold text-white">BurnyOut</span>
      </Link>

      {/* Código de erro */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative"
      >
        <p className="select-none text-[10rem] font-black leading-none tracking-tighter text-white/5 sm:text-[14rem]">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-6xl font-black text-red-400 sm:text-8xl drop-shadow-[0_0_40px_rgba(255,83,112,0.6)]">
            404
          </p>
        </div>
      </motion.div>

      {/* Mensagem principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-8 space-y-3"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-red-400/80">Erro Corporativo</p>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{msg}</h1>
        <p className="text-sm text-slate-500">
          Burny Score no momento do erro:{" "}
          <span className="font-mono font-bold text-red-400">{score}</span>
          /100
        </p>
      </motion.div>

      {/* Status fake */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 rounded-2xl border border-white/8 bg-black/30 px-6 py-4 text-left font-mono text-xs text-slate-500"
      >
        <p className="text-emerald-400">$ burny diagnose --page not-found</p>
        <p className="mt-1">→ Verificando motivação{dots}</p>
        <p className="mt-0.5 text-red-400">✗ Motivação: NULL</p>
        <p className="mt-0.5 text-red-400">✗ Página: DEMITIDA</p>
        <p className="mt-0.5 text-yellow-400">⚠ Recomendação: tomar um café e ir para o dashboard</p>
      </motion.div>

      {/* Ações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/dashboard"
          className="burn-gradient rounded-full px-6 py-3 text-sm font-semibold text-black shadow-lg hover:opacity-90 transition-opacity"
        >
          Ir ao Dashboard
        </Link>
        <Link
          href="/"
          className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Voltar ao início
        </Link>
      </motion.div>

      <p className="mt-16 text-xs text-slate-700">
        Este erro foi contabilizado no seu Burny Score.
      </p>
    </main>
  );
}
