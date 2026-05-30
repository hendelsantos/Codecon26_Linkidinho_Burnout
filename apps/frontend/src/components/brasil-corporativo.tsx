"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrasilAnalytics, api } from "@/lib/api";

const COMENTARIOS_SCORE: Array<[number, string]> = [
  [80, "Clinicamente impressionante. Ninguém fica bem com isso."],
  [60, "Preocupante. Mas ainda dentro do aceitável para o mercado brasileiro."],
  [40, "Dentro da média. O que também é preocupante."],
  [0,  "Surpreendentemente saudável. Suspeito."],
];

const COMENTARIOS_CAFE: Array<[number, string]> = [
  [4, "Cafeinação de emergência. A produtividade depende disso literalmente."],
  [2, "Nível operacional. Dois cafés pra manter a humanidade mínima."],
  [0, "Subestimado. Esse número não reflete a realidade."],
];

const COMENTARIOS_REUNIAO: Array<[number, string]> = [
  [5, "Cada uma dessas reuniões poderia ser um e-mail. Todas elas."],
  [3, "Já é demais. Mas o mercado considera isso normal."],
  [0, "Impressionante. Ou o dado está errado ou alguém trabalha mesmo."],
];

function comentario(tabela: Array<[number, string]>, valor: number): string {
  for (const [min, txt] of tabela) {
    if (valor >= min) return txt;
  }
  return tabela[tabela.length - 1][1];
}

const AREA_EMOJIS: Record<string, string> = {
  dev: "💻", design: "🎨", product: "📦", ops: "⚙️",
  data: "📊", qa: "🔍", management: "👔", sales: "🤝",
  marketing: "📣", other: "🌀",
};

export function BrasilCorporativo() {
  const [dados, setDados] = useState<BrasilAnalytics | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    api.getBrasilAnalytics()
      .then(setDados)
      .catch(() => setErro(true));
  }, []);

  if (erro || !dados) return null;
  if (dados.total_checkins === 0) return null;

  const { media_nacional: mn, por_area, total_usuarios, total_checkins } = dados;
  const maisQueimado = por_area[0];
  const menosQueimado = por_area[por_area.length - 1];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6 }}
      className="glass-panel mt-6 rounded-[36px] p-7 sm:p-10"
    >
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Dados reais da plataforma</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Brasil Corporativo em Números
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Baseado em <strong className="text-white">{total_checkins.toLocaleString("pt-BR")}</strong> check-ins
            de <strong className="text-white">{total_usuarios.toLocaleString("pt-BR")}</strong> profissionais
            que decidiram medir o próprio sofrimento com dados.
          </p>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          ✓ Dados reais
        </span>
      </div>

      {/* Cards de média nacional */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            emoji: "🔥",
            label: "Burny Score médio",
            valor: mn.burny_score,
            sufixo: "/100",
            cor: "ember",
            comentario: comentario(COMENTARIOS_SCORE, mn.burny_score),
          },
          {
            emoji: "☕",
            label: "Cafés por dia",
            valor: mn.cafes_por_dia,
            sufixo: " xícaras",
            cor: "amber",
            comentario: comentario(COMENTARIOS_CAFE, mn.cafes_por_dia),
          },
          {
            emoji: "📅",
            label: "Reuniões inúteis/dia",
            valor: mn.reunioes_por_dia,
            sufixo: " reuniões",
            cor: "violet",
            comentario: comentario(COMENTARIOS_REUNIAO, mn.reunioes_por_dia),
          },
          {
            emoji: "🚗",
            label: "Trânsito médio",
            valor: mn.minutos_transito,
            sufixo: " min/dia",
            cor: "slate",
            comentario: "Minutos de sofrimento entre a cama e a mesa.",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-[24px] border border-white/8 bg-black/25 p-5"
          >
            <div className="mb-3 text-2xl">{card.emoji}</div>
            <p className="text-xs text-slate-400">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {card.valor}{card.sufixo}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500 italic">
              {card.comentario}
            </p>
          </div>
        ))}
      </div>

      {/* Destaques cômicos */}
      {maisQueimado && menosQueimado && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-ember/20 bg-ember/6 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-ember-soft mb-2">Área mais destruída</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{AREA_EMOJIS[maisQueimado.area] ?? "🌀"}</span>
              <div>
                <p className="text-xl font-bold text-white">{maisQueimado.area_label}</p>
                <p className="text-sm text-slate-400">Score médio: <span className="text-white font-semibold">{maisQueimado.avg_score}</span></p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400 italic">
              {maisQueimado.avg_cafes} café(s) e {maisQueimado.avg_reunioes} reunião(ões) inúteis por dia.
              Isso é uma estatística, não uma denúncia. Embora seja as duas coisas.
            </p>
          </div>

          <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/6 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 mb-2">Área mais sobrevivente</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{AREA_EMOJIS[menosQueimado.area] ?? "🌀"}</span>
              <div>
                <p className="text-xl font-bold text-white">{menosQueimado.area_label}</p>
                <p className="text-sm text-slate-400">Score médio: <span className="text-white font-semibold">{menosQueimado.avg_score}</span></p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400 italic">
              Relativamente menos destruídos. Isso não significa que estão bem.
              Significa que os outros estão piores.
            </p>
          </div>
        </div>
      )}

      {/* Ranking de áreas */}
      {por_area.length > 1 && (
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">Ranking de sofrimento por área</p>
          <div className="space-y-2">
            {por_area.map((area, i) => {
              const pct = mn.burny_score > 0 ? Math.round((area.avg_score / 100) * 100) : 0;
              return (
                <div key={area.area} className="flex items-center gap-3 rounded-[18px] border border-white/6 bg-white/3 px-4 py-3">
                  <span className="w-5 shrink-0 text-center text-sm font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <span className="text-lg shrink-0">{AREA_EMOJIS[area.area] ?? "🌀"}</span>
                  <span className="flex-1 text-sm font-medium text-white">{area.area_label}</span>
                  <div className="hidden w-32 sm:block">
                    <div className="h-1.5 w-full rounded-full bg-white/10">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: pct > 70 ? "#ff6b2c" : pct > 40 ? "#8257ff" : "#22c55e",
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right text-sm font-bold text-white">{area.avg_score}</span>
                  <span className="hidden text-xs text-slate-500 sm:block">☕ {area.avg_cafes} · 📅 {area.avg_reunioes}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs text-slate-600 italic">
            Dados coletados voluntariamente. A realidade pode ser mais trágica.
          </p>
        </div>
      )}
    </motion.section>
  );
}
