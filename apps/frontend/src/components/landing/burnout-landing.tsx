"use client";

import { motion } from "framer-motion";
import {
  Bell,
  BrainCircuit,
  Coffee,
  Flame,
  Gauge,
  Loader2,
  MessageSquare,
  Rocket,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BurnoutChart } from "@/components/landing/burnout-chart";
import { BrasilCorporativo } from "@/components/brasil-corporativo";
import { BathroomRevenueLanding } from "@/components/bathroom-revenue-landing";
import { DicasTicker } from "@/components/dicas-corporativas";
import { FeedItem, RankingEntry, api, timeAgo } from "@/lib/api";
import {
  burnyHighlights,
  featureCards,
  statCards,
} from "@/lib/site";

const fadeInUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

export function BurnoutLanding() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [rankLoading, setRankLoading] = useState(true);

  useEffect(() => {
    api
      .getFeed(5)
      .then((r) => setFeed(r.results))
      .catch(() => {})
      .finally(() => setFeedLoading(false));
    api
      .getRankings("burnout")
      .then((r) => setRankings(r.results.slice(0, 4)))
      .catch(() => {})
      .finally(() => setRankLoading(false));
  }, []);

  const composerActions: Array<{ label: string; icon: LucideIcon }> = [
    { label: "Foto", icon: Coffee },
    { label: "Trauma", icon: Flame },
    { label: "Trabalho inútil", icon: Rocket },
    { label: "Café", icon: Sparkles },
  ];

  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-16 pt-6 sm:px-8 lg:px-10">
        <motion.header
          className="glass-panel sticky top-3 z-20 mb-8 flex items-center justify-between gap-2 rounded-full px-3 py-2.5 sm:top-4 sm:px-4 sm:py-3"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="burn-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-black shadow-[0_0_40px_rgba(130,87,255,0.45)]">
              <Flame className="h-5 w-5" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="text-xs uppercase tracking-[0.35em] text-muted">BurnyOut</p>
              <p className="truncate text-sm font-semibold text-white">Corporate Suffering Analytics Network</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/feed">Feed</Link>
            <Link href="/sobre">Sobre</Link>
            <a href="#roadmap">Roadmap</a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/entrar"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white sm:px-4"
            >
              Entrar
            </Link>
            <Link
              href="/onboarding"
              className="burn-gradient rounded-full px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] sm:px-5"
            >
              Registre-se
            </Link>
          </div>
        </motion.header>

        <DicasTicker />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.section
            className="glass-panel relative overflow-hidden rounded-[32px] p-7 sm:p-9"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-violet/20 blur-3xl" />
            <div className="absolute bottom-0 left-12 h-36 w-36 rounded-full bg-ember/15 blur-3xl" />

            <div className="mb-7 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted">
              <span className="rounded-full border border-white/10 px-3 py-1">Codecon 2026</span>
              <span className="rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-ember-soft">
                Sátira não tóxica
              </span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-glow max-w-3xl text-[2rem] font-bold leading-[1.05] text-white sm:text-6xl sm:leading-[0.95] xl:text-7xl">
                Transforme seu colapso corporativo em conteúdo premium.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
                BurnyOut é a única rede social honesta sobre trabalho. Aqui, café excessivo vira métrica, reunião inútil vira dado e sofrimento corporativo vira ranking. Tudo medido, graficado e compartilhável. Porque se você vai entrar em colapso, que seja com dashboard bonito.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/onboarding"
                className="burn-gradient rounded-full px-6 py-3.5 text-center font-semibold text-black transition-transform hover:scale-[1.02]"
              >
                🔥 Entrar em colapso com estilo
              </Link>
              <Link
                href="/sobre"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-center font-semibold text-white transition-colors hover:bg-white/10"
              >
                Mas o que diabos é isso?
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {statCards.map((card, index) => (
                <motion.article
                  key={card.label}
                  className="rounded-[24px] border border-white/8 bg-black/25 p-4"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 * index, duration: 0.45 }}
                >
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
                  <p className="mt-2 text-sm text-emerald-300">{card.caption}</p>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.aside
            className="glass-panel rounded-[32px] p-6"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Perfil do sobrevivente</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Burny, mascote operacional</h2>
              </div>
              <div className="rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-medium text-ember-soft">
                Nível crítico
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(130,87,255,0.18),rgba(13,17,31,0.96))] p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-black/30 text-4xl">
                  <span>🔥</span>
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">BurnyOut Prime</p>
                  <p className="mt-1 text-sm text-slate-300">Dependente de café, funcional por obrigação e gloriosamente monitorado.</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {burnyHighlights.map((item) => (
                  <div key={item.label} className="rounded-[20px] border border-white/10 bg-black/25 px-3 py-4">
                    <p className="text-2xl font-bold text-white">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {featureCards.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 rounded-[22px] border border-white/8 bg-black/20 p-4"
                >
                  <div className="burn-gradient mt-1 rounded-2xl p-2 text-black">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{feature.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[280px_1fr_320px]">
          <motion.section
            {...fadeInUp}
            transition={{ duration: 0.55 }}
            className="glass-panel hidden rounded-[30px] p-5 xl:block"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-white/8 p-2 text-violet">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">BurnyOut</p>
                <p className="text-xs text-slate-400">Rede de sobrevivência coletiva</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-300">
              {[
                "Início",
                "Minha rede de sofrimento",
                "Mensagens",
                "Trabalhos inúteis",
                "Café recebido",
                "Meu burnout",
                "Saved for crying",
              ].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-2xl px-4 py-3 ${index === 0 ? "burn-gradient text-black" : "bg-white/4"}`}
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-ember/20 bg-[linear-gradient(180deg,rgba(255,107,44,0.18),rgba(15,16,24,0.86))] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-ember-soft">Alerta corporativo</p>
              <p className="mt-3 text-xl font-semibold text-white">Unauthorized optimism detected.</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Ajuste de narrativa recomendado para manter a coerência dramática da plataforma.
              </p>
            </div>
          </motion.section>

          <motion.section
            id="feed"
            {...fadeInUp}
            transition={{ duration: 0.55 }}
            className="space-y-6"
          >
            <div className="glass-panel rounded-[30px] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Feed principal</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">No que você está sobrevivendo hoje?</h2>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Bell className="h-4 w-4" />
                  <MessageSquare className="h-4 w-4" />
                  <Send className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-5 grid gap-3 rounded-[24px] border border-white/8 bg-black/20 p-4 sm:grid-cols-4">
                {composerActions.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/6 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/12"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {feedLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-7 w-7 animate-spin text-violet" />
              </div>
            ) : (
              feed.map((post, index) => (
                <motion.article
                  key={post.id}
                  className="glass-panel rounded-[30px] p-5"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: 0.08 * index, duration: 0.45 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{post.avatar_emoji}</span>
                      <div>
                        <p className="font-semibold text-white">{post.author}</p>
                        <p className="text-sm text-slate-400">
                          {post.role} · {post.region}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full border border-ember/30 bg-ember/10 px-2.5 py-0.5 text-xs font-semibold text-ember-soft">
                        {post.burny_score}
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                        {timeAgo(post.created_at)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-base leading-8 text-slate-200">{post.message}</p>
                  <p className="mt-3 border-l-2 border-violet/40 pl-3 text-sm italic leading-6 text-slate-400">
                    {post.insight}
                  </p>
                </motion.article>
              ))
            )}
            <Link
              href="/feed"
              className="block rounded-[28px] border border-white/8 bg-white/4 py-4 text-center text-sm font-medium text-slate-300 transition-colors hover:bg-white/8"
            >
              Ver todo o feed →
            </Link>
          </motion.section>

          <motion.section
            id="dashboard"
            {...fadeInUp}
            transition={{ duration: 0.55 }}
            className="space-y-6"
          >
            <div className="glass-panel rounded-[30px] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Dashboard Burny Score</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Seu caos está em tendência de alta</h2>
                </div>
                <div className="rounded-full border border-danger/30 bg-danger/10 px-3 py-1 text-xs font-semibold text-red-300">
                  Risco 94%
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/8 bg-black/25 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Gauge className="h-4 w-4 text-violet" />
                    Burnout Meter
                  </div>
                  <BurnoutChart />
                </div>
                <div className="space-y-4">
                  <div className="rounded-[24px] border border-white/8 bg-black/25 p-4">
                    <p className="text-sm text-slate-400">Insight Burny AI</p>
                    <p className="mt-3 text-xl font-semibold text-white">
                      Você participa de 43% mais reuniões que outros profissionais da sua região. Isso não é networking. Isso é cardio corporativo.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-black/25 p-4">
                    <p className="text-sm text-slate-400">Bathroom Revenue</p>
                    <p className="mt-3 text-4xl font-bold text-ember-soft">R$ 381</p>
                    <p className="mt-2 text-sm text-slate-400">Projeção semanal acima da meta dramática.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-[30px] p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-white/8 p-2 text-ember-soft">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Ranking de sofrimento</p>
                  <p className="text-xs text-slate-400">Comparativo elegante, exagerado e seguro</p>
                </div>
              </div>

              <div className="space-y-3">
                {rankLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-violet" />
                  </div>
                ) : (
                  rankings.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-[22px] border border-white/8 bg-black/25 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-sm font-semibold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{entry.nickname}</p>
                          <p className="text-xs text-slate-400">{entry.area}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{entry.value}</p>
                        <p className="text-xs text-slate-400">burny score</p>
                      </div>
                    </div>
                  ))
                )}
                <Link
                  href="/ranking"
                  className="block rounded-[22px] border border-white/8 bg-white/4 py-3 text-center text-sm font-medium text-slate-300 hover:bg-white/8"
                >
                  Ver ranking completo →
                </Link>
              </div>
            </div>
          </motion.section>
        </div>

        <motion.section
          id="stack"
          {...fadeInUp}
          transition={{ duration: 0.55 }}
          className="glass-panel mt-6 rounded-[36px] p-7 sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Arquitetura pronta para demo</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Monorepo com cara de produto sério e senso de humor perigoso.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                Construído em 72 horas de Codecon com cafeína excessiva, commits às 3h da manhã e a firme convicção de que sofrimento corporativo merecia representação digna. O código é real, o deploy é real, o burnout dos criadores também.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Frontend", "Next.js, TypeScript, Tailwind 4, Framer Motion, Recharts"],
                ["Backend", "Django, DRF, OpenAPI, CORS, PostgreSQL-ready"],
                ["Domínios", "users, metrics, analytics, social, ai, rankings, wrapped"],
                ["Deploy", "Railway-friendly, docs centrais e env examples"],
              ].map(([title, description]) => (
                <div key={String(title)} className="rounded-[24px] border border-white/8 bg-black/20 p-4">
                  <p className="text-lg font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <BrasilCorporativo />

        <BathroomRevenueLanding />

        <motion.section
          id="roadmap"
          {...fadeInUp}
          transition={{ duration: 0.55 }}
          className="mt-6 grid gap-6 lg:grid-cols-3"
        >
          {[
            ["MVP", "Onboarding anônimo, Burny Score, feed satírico, ranking global e cards de compartilhamento."],
            ["AI Layer", "Burny AI com insights passivo-agressivos, comparativos regionais e wrapped narrado."],
            ["Showtime", "Deploy na Railway, docs polish, assets da marca e storytelling de palco para a Codecon."],
          ].map(([title, copy]) => (
            <motion.article
              key={String(title)}
              {...fadeInUp}
              transition={{ duration: 0.55 }}
              className="glass-panel rounded-[30px] p-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted">{title}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{copy}</p>
            </motion.article>
          ))}
        </motion.section>
      </section>
    </main>
  );
}