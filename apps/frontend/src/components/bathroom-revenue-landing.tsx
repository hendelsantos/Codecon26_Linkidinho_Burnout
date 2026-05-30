"use client";

import { useEffect, useState } from "react";
import { BathroomRanking, api } from "@/lib/api";
import Link from "next/link";

const AREA_EMOJIS: Record<string, string> = {
  dev: "💻",
  design: "🎨",
  product: "📦",
  ops: "⚙️",
  data: "📊",
  qa: "🔍",
  management: "📋",
  sales: "📈",
  marketing: "📣",
  other: "🤷",
};

const COMENTARIOS: string[] = [
  "O Brasil corporativo produz mais no banheiro do que em 80% das reuniões semanais.",
  "Tecnicamente, esse é o único KPI que todo mundo bate com prazer.",
  "A produtividade real acontece onde o Wi-Fi não alcança.",
  "Enquanto o PO atualiza o Jira, o dev está aqui, gerando valor de verdade.",
  "Dizem que o trabalho remoto aumentou a produtividade. Provamos que o banheiro também.",
];

function comentarioAleatorio() {
  return COMENTARIOS[Math.floor(Math.random() * COMENTARIOS.length)];
}

export function BathroomRevenueLanding() {
  const [data, setData] = useState<BathroomRanking | null>(null);
  const [comentario] = useState(comentarioAleatorio);

  useEffect(() => {
    api.getBathroomRanking().then(setData).catch(() => null);
  }, []);

  if (!data || data.top_cagadores.length === 0) return null;

  const totalBRL = (data.total_gerado_comunidade_cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const mediaBRL = (data.media_comunidade_cents / 100).toFixed(2);

  return (
    <section className="mt-8 glass-panel rounded-[32px] p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Analytics Corporativo</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            🚽 Receita no Banheiro
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400 italic">
            {comentario}
          </p>
        </div>
        <Link
          href="/onboarding"
          className="mt-3 shrink-0 self-start sm:self-auto rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
        >
          Calcular o meu →
        </Link>
      </div>

      {/* Stats gerais */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="rounded-[20px] border border-white/8 bg-black/20 p-4 text-center">
          <p className="text-2xl font-bold text-white">{totalBRL}</p>
          <p className="mt-1 text-xs text-slate-400">gerado pela comunidade</p>
          <p className="text-[10px] text-slate-600 italic">valor real de mercado produzido em banheiros corporativos</p>
        </div>
        <div className="rounded-[20px] border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">R${mediaBRL}</p>
          <p className="mt-1 text-xs text-emerald-600">média por sessão na comunidade</p>
          <p className="text-[10px] text-slate-600 italic">estimativa: ~20 min por visita ao sanitário</p>
        </div>
      </div>

      {/* Ranking */}
      <p className="mb-3 text-[11px] uppercase tracking-widest text-slate-500">🏆 Hall of Fame do Banheiro</p>
      <div className="space-y-2">
        {data.top_cagadores.slice(0, 5).map((entry, i) => (
          <div
            key={entry.nickname}
            className={`flex items-center gap-3 rounded-[16px] border px-4 py-3 transition-colors ${
              i === 0
                ? "border-yellow-500/30 bg-yellow-500/5"
                : i === 1
                ? "border-slate-400/20 bg-slate-400/5"
                : i === 2
                ? "border-orange-500/20 bg-orange-500/5"
                : "border-white/6 bg-white/2"
            }`}
          >
            <span className={`w-6 text-center text-sm font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-orange-400" : "text-slate-600"}`}>
              {i + 1}
            </span>
            <span className="text-xl">{entry.avatar_emoji}</span>
            <div className="flex flex-1 min-w-0 items-center gap-2">
              <span className="truncate font-medium text-white">{entry.nickname}</span>
              <span className="shrink-0 text-base">{AREA_EMOJIS[entry.area] ?? "🤷"}</span>
              <span className="hidden sm:inline text-xs text-slate-500">{entry.area_label}</span>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-emerald-400">
                {(entry.total_revenue_cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
              <p className="text-[10px] text-slate-600">{entry.total_checkins} dias · R${(entry.media_diaria_cents / 100).toFixed(2)}/dia</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-slate-600">
        Quer aparecer aqui?{" "}
        <Link href="/onboarding" className="text-violet hover:underline">
          Entre no BurnyOut
        </Link>
        {" "}e cadastre seu salário no perfil.
      </p>
    </section>
  );
}
