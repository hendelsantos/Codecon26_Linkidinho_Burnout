"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

const STACK = [
  {
    camada: "Frontend",
    emoji: "🖥️",
    itens: [
      ["Next.js 15", "App Router, Server e Client Components, Turbopack"],
      ["TypeScript", "Porque JavaScript sem tipos é estresse não monitorado"],
      ["Tailwind CSS 4", "Design system temático com variáveis de marca"],
      ["Framer Motion", "Animações que fazem o burnout parecer bonito"],
      ["Recharts", "Gráficos de colapso com aparência profissional"],
    ],
  },
  {
    camada: "Backend",
    emoji: "⚙️",
    itens: [
      ["Django 5 + DRF", "REST API robusta com autenticação por token"],
      ["SQLite → PostgreSQL", "Começa pequeno, escala com o sofrimento"],
      ["Domínios separados", "users, metrics, analytics, social, ai, rankings, wrapped"],
      ["Burny AI", "Insights gerados com base nos seus dados reais de burnout"],
    ],
  },
  {
    camada: "Infra & Deploy",
    emoji: "🚀",
    itens: [
      ["Railway", "Deploy contínuo no push — com migrate automático (aprendemos da pior forma)"],
      ["Monorepo", "apps/frontend + apps/backend num só repositório"],
      ["GitHub", "Controle de versão e provas de commits às 3h da manhã"],
    ],
  },
];

const FEATURES = [
  { emoji: "🔥", title: "Burny Score", desc: "Um número de 0 a 100 que mede o quanto você está no limite. Quanto mais alto, mais dramático. Quanto mais baixo, ou você está bem ou está em negação." },
  { emoji: "📊", title: "Dashboard de sofrimento", desc: "Gráficos reais de check-in diário. Cafés, reuniões inúteis, horas extras — tudo vira insight. A Burny AI comenta com a elegância de um consultor sem empatia." },
  { emoji: "🏆", title: "Ranking global", desc: "Compare seu burnout com o do Brasil inteiro. Se você está no top 10, parabéns. Ou melhore. Difícil dizer." },
  { emoji: "🎭", title: "Gerador de desculpas", desc: "9 categorias, 100+ desculpas corporativas prontas para copiar e colar no Slack. Testadas em condições reais de sofrimento." },
  { emoji: "👥", title: "Sistema de convites", desc: "Convide amigos, colegas de trabalho, conhecido do almoço e outros tipos de vínculo profissional. Cada tipo tem uma mensagem cômica diferente para WhatsApp." },
  { emoji: "🕴️", title: "Modo Fingir Trabalho", desc: "Um botão que transforma o site numa planilha chata em milissegundos. Inventado pelo Mauricio. Necessário por todos." },
  { emoji: "📅", title: "Wrapped corporativo", desc: "Seu ano em dados: reuniões, cafés, colapsos. Igual ao Spotify Wrapped mas sem música e com mais trauma." },
];

export default function SobrePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-1/3 top-0 h-[500px] w-[500px] rounded-full bg-violet/12 blur-[140px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-ember/8 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">

        {/* Header nav */}
        <header className="glass-panel mb-12 flex items-center justify-between rounded-full px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="burn-gradient flex h-9 w-9 items-center justify-center rounded-xl text-black">
              <Flame className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-white">BurnyOut</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <Link href="/feed" className="hover:text-white">Feed</Link>
            <Link href="/ranking" className="hover:text-white">Ranking</Link>
            <Link href="/onboarding" className="burn-gradient rounded-full px-4 py-2 text-xs font-semibold text-black">
              Criar conta
            </Link>
          </div>
        </header>

        {/* Hero */}
        <motion.section
          className="glass-panel rounded-[36px] p-8 sm:p-10 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted mb-6">
            <span className="rounded-full border border-white/10 px-3 py-1">Codecon 2026</span>
            <span className="rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-violet">Hackathon de 72h</span>
            <span className="rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-ember-soft">Projeto real</span>
          </div>

          <h1 className="text-glow text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-tight">
            O que diabos<br />é o BurnyOut?
          </h1>

          <div className="mt-6 max-w-3xl space-y-4 text-base leading-8 text-slate-300">
            <p>
              BurnyOut é uma rede social satírica de analytics corporativo. Em vez de fingir que o trabalho é
              uma jornada de crescimento pessoal, o BurnyOut mede honestamente o quanto você está <em>destruído</em>.
            </p>
            <p>
              Você faz check-in diário informando cafés consumidos, reuniões inúteis, horas extras e outros
              indicadores de colapso iminente. O sistema transforma isso num <strong className="text-white">Burny Score</strong> —
              um número de 0 a 100 que representa sua proximidade do precipício profissional.
            </p>
            <p>
              Tem ranking. Tem AI com insights passivo-agressivos. Tem gerador de desculpas corporativas.
              Tem botão de fingir que está trabalhando. Tem wrapped anual do seu sofrimento.
              Tudo isso com design cinematográfico porque, se vai sofrer, que sofra com estilo.
            </p>
          </div>

          <blockquote className="mt-8 rounded-2xl border border-violet/20 bg-violet/8 px-6 py-5 text-violet">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2">Missão oficial</p>
            <p className="text-lg leading-7 text-white">
              "Transformar sofrimento corporativo em dado, dado em insight e insight em conteúdo que as pessoas
              encaminham no grupo da família às 23h com a legenda: <em>esse sou eu</em>."
            </p>
          </blockquote>
        </motion.section>

        {/* Features */}
        <motion.section {...fadeUp} transition={{ duration: 0.5 }} className="mb-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">O que tem dentro</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Funcionalidades que ninguém pediu mas todo mundo precisava</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.45 }}
                className="glass-panel rounded-[24px] p-5"
              >
                <div className="mb-3 text-3xl">{f.emoji}</div>
                <p className="font-semibold text-white">{f.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stack */}
        <motion.section {...fadeUp} transition={{ duration: 0.5 }} className="glass-panel rounded-[36px] p-8 sm:p-10 mb-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Arquitetura</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Stack usado — porque alguém vai perguntar</h2>
            <p className="mt-2 text-sm text-slate-400">
              Construído com tecnologias que os devs conhecem bem o suficiente pra montar em 72h e boas o suficiente pra não dar vergonha depois.
            </p>
          </div>

          <div className="space-y-8">
            {STACK.map((camada) => (
              <div key={camada.camada}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{camada.emoji}</span>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-violet">{camada.camada}</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {camada.itens.map(([nome, desc]) => (
                    <div key={nome} className="rounded-[18px] border border-white/8 bg-white/4 px-4 py-3">
                      <p className="text-sm font-semibold text-white">{nome}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Team */}
        <motion.section {...fadeUp} transition={{ duration: 0.5 }} className="mb-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Time</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Os responsáveis por isso tudo</h2>
            <p className="mt-1 text-sm text-slate-400">Feito na Codecon 2026. Nenhum ser humano foi prejudicado. Alguns foram.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Hendel */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.45 }}
              className="glass-panel rounded-[28px] p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-[20px] text-3xl shrink-0"
                  style={{ background: "linear-gradient(135deg,#8257ff,#ff6b2c)" }}
                >
                  👨‍💻
                </div>
                <div>
                  <p className="text-lg font-bold text-white">Hendel Santos</p>
                  <p className="text-sm text-slate-400">Fundador do sofrimento monitorado</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="rounded-full border border-violet/30 bg-violet/10 px-2 py-0.5 text-[10px] text-violet">39 commits</span>
                    <span className="rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 text-[10px] text-ember-soft">Full Stack</span>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-300">
                Arquitetou o sistema, criou o design, escreveu a API, montou o frontend, configurou o deploy e
                inventou métricas de burnout que fazem sentido assustador. Sobreviveu à Codecon com
                Burny Score estimado de 94%.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ["Backend", "Django + DRF + Auth"],
                  ["Frontend", "Next.js + Tailwind 4"],
                  ["Design", "Sistema de cores e UI"],
                  ["Deploy", "Railway + CI/CD"],
                ].map(([area, desc]) => (
                  <div key={area} className="rounded-[14px] border border-white/8 bg-black/20 px-3 py-2">
                    <p className="text-xs font-semibold text-white">{area}</p>
                    <p className="text-[10px] text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mauricio */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="glass-panel rounded-[28px] p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-[20px] text-3xl shrink-0"
                  style={{ background: "linear-gradient(135deg,#ff6b2c,#ffb347)" }}
                >
                  🕴️
                </div>
                <div>
                  <p className="text-lg font-bold text-white">Mauricio Basso</p>
                  <p className="text-sm text-slate-400">Inventor do Modo Fingir Trabalho</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 text-[10px] text-ember-soft">1 commit lendário</span>
                    <span className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">Frontend</span>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-300">
                Responsável por aquele botão que ninguém pediu mas todo mundo usa. O "Modo Fingir Trabalho"
                transforma o BurnyOut em planilha chata em milissegundos — feature que virou o
                momento mais aplaudido da apresentação. Um commit. Uma lenda.
              </p>
              <div className="mt-4 rounded-[14px] border border-ember/20 bg-ember/6 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-ember-soft mb-1">Contribuição principal</p>
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Modo Fingir Trabalho (Boss Mode)</strong> — botão de emergência
                  que esconde tudo com uma planilha fake. Prêmio informal de feature mais necessária.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Codecon badge */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-[36px] p-8 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-[28px] text-4xl"
              style={{ background: "linear-gradient(135deg,#8257ff,#ff6b2c)" }}
            >
              🏆
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted mb-2">Construído em</p>
          <h2 className="text-3xl font-bold text-white">Codecon 2026</h2>
          <p className="mt-3 max-w-xl mx-auto text-sm leading-7 text-slate-400">
            Hackathon de 72 horas onde duas pessoas decidiram que o mercado precisava de uma rede social
            honesta sobre trabalho. O resultado foi o BurnyOut. O burnout dos criadores durante o processo
            serviu como inspiração direta para os dados de exemplo.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/onboarding"
              className="burn-gradient rounded-full px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              🔥 Criar minha conta
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Ver a landing page
            </Link>
          </div>
        </motion.section>

      </div>
    </main>
  );
}
