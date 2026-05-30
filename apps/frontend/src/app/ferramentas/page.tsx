"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api";

// ─── Dados ────────────────────────────────────────────────────────────────────

const DESTINOS_ROLETA = [
  { emoji: "🔥", text: "Deploy em produção", sub: "Sexta, 18h. Boa sorte." },
  { emoji: "😱", text: "Reunião surpresa", sub: "Sem pauta. Sem motivo." },
  { emoji: "🐛", text: "Bug crítico em produção", sub: "Era pra ser simples." },
  { emoji: "😰", text: "RH quer falar com você", sub: "\"Não é nada grave.\"" },
  { emoji: "😤", text: "Folga que não é folga", sub: "\"Pode dar uma olhada naquilo?\"" },
  { emoji: "💀", text: "Sprint extra urgente", sub: "Deadline: ontem." },
  { emoji: "⏳", text: "Code review eterno", sub: "4h de comentários em 5 linhas." },
  { emoji: "🚨", text: "Deadline antecipado", sub: "\"Consegue entregar hoje?\"" },
  { emoji: "📄", text: "PDF urgente pro chefe", sub: "São 16h58. Prazo: 17h." },
  { emoji: "🤯", text: "Feature nova sem requisito", sub: "\"Você que decide o escopo.\"" },
  { emoji: "☕", text: "Café acabou", sub: "O colapso se aproxima." },
  { emoji: "📞", text: "Ligação surpresa do cliente", sub: "No horário de almoço." },
  { emoji: "🎉", text: "Você foi promovido!", sub: "...de júnior para pleno de sofrimento." },
  { emoji: "🕐", text: "Daily marcada para as 8h", sub: "No dia seguinte ao deploy." },
  { emoji: "🧊", text: "Freeze de release", sub: "Justamente na sua feature." },
];

const TRADUCOES: [string, string][] = [
  ["não sei fazer isso", "vou precisar de alguns sprints de spike para mapear a solução técnica"],
  ["esqueci", "houve um gap de comunicação no meu processo de gestão de tarefas"],
  ["estou com preguiça", "estou priorizando estrategicamente meu backlog pessoal"],
  ["o código está uma bagunça", "a arquitetura atual apresenta oportunidades de melhoria incremental"],
  ["não vou conseguir entregar", "a entrega está em processo estratégico de maturação"],
  ["a reunião foi inútil", "alinhamos expectativas e calibramos o roadmap colaborativo"],
  ["não entendi nada", "vou mapear os pontos de melhoria no onboarding do processo"],
  ["meu chefe é idiota", "o processo de liderança apresenta gaps de desenvolvimento humano"],
  ["quero pedir demissão", "estou explorando oportunidades de crescimento no mercado"],
  ["tô estressado", "estou em um momento de alto impacto e aprendizado acelerado"],
  ["não sei", "deixa eu validar internamente e retorno com mais clareza"],
  ["o prazo é impossível", "vou precisar priorizar e negociar escopo para garantir qualidade"],
  ["não foi minha culpa", "houve um misalignment de expectativas no processo de entrega"],
  ["tô cansado", "estou maximizando minha produtividade dentro dos limites sustentáveis"],
  ["a empresa está quebrada", "estamos em um momento de rightsizing estratégico"],
  ["não fiz nada hoje", "trabalhei em atividades de background que impactam a produtividade long-term"],
  ["que reunião chata", "foi uma sessão rica em inputs para o próximo ciclo de planejamento"],
  ["não funciona", "identificamos um comportamento inesperado no ambiente de produção"],
  ["copiei do stack overflow", "consultei fontes especializadas e adaptei a solução ao nosso contexto"],
  ["tô sofrendo", "estou passando por um momento de alta densidade de aprendizado"],
  ["não quero ir à reunião", "vou avaliar minha disponibilidade e confirmar participação"],
  ["me mandaram embora", "fui desligado como parte de uma reestruturação organizacional estratégica"],
];

const JARGOES_EXTRA = [
  "Vamos alinhar stakeholders e garantir sinergia operacional.",
  "Precisamos escalar essa solução de forma ágil e sustentável.",
  "O foco agora é garantir entrega de valor com qualidade.",
  "Vou trackear isso no nosso board e retorno com um update.",
  "Precisamos mapear os blockers e pivotar se necessário.",
];

const PREFIXOS_LINKEDIN = ["Chief", "Head of", "Senior", "Lead", "Principal", "Strategic", "Global"];
const CARGOS_LINKEDIN = [
  "Pixel Architect", "Synergy Engineer", "Growth Hacker", "Digital Transformer",
  "Agile Warrior", "Blockchain Pioneer", "Cloud Native Developer", "AI Whisperer",
  "Disruption Specialist", "Innovation Catalyst", "Fullstack Visionary",
];
const QUALIFICADORES_LINKEDIN = [
  "| Disruption Enthusiast", "| Open to Work", "| Keynote Speaker",
  "| Building the Future™", "| 10x Engineer", "| Thought Leader",
  "| Helping companies scale 🚀", "| Ex-Google (estagiário 2019)",
];
const HASHTAGS_LINKEDIN = [
  "#GrowthMindset #Leadership #Innovation",
  "#OpenToWork #Disruption #BuildingTheFuture",
  "#AgileLeadership #DigitalTransformation",
  "#Blockchain #AI #Metaverse",
];

const MOTIVOS_DEMISSAO = [
  "após constatar que minha alma começou a depreciar mais rápido que o legado de código da empresa",
  "pois atingi o limite máximo de reuniões que poderiam ter sido e-mails suportado pelo organismo humano",
  "depois de perceber que o café da empresa era o único benefício real do pacote de remuneração",
  "em razão de ter recebido o décimo sprint com prazo 'urgente' consecutivo",
  "pois o alinhamento estratégico entre minha sanidade e o roadmap tornou-se insustentável",
  "após o sistema de produção cair na minha primeira sexta-feira de folga",
  "porque fui promovido de júnior a sênior de sofrimento sem aumento correspondente",
  "pois meu Burny Score atingiu níveis que a OMS classifica como inadmissíveis",
];

// ─── Componente: Roleta da Sexta ──────────────────────────────────────────────

function RoletaDaSexta() {
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState<(typeof DESTINOS_ROLETA)[0] | null>(null);
  const [itensVisiveis, setItensVisiveis] = useState<(typeof DESTINOS_ROLETA)[0][]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function girar() {
    if (girando) return;
    setGirando(true);
    setResultado(null);

    let idx = 0;
    let speed = 80;
    let ticks = 0;
    const maxTicks = 30;

    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % DESTINOS_ROLETA.length;
      setItensVisiveis([DESTINOS_ROLETA[idx]]);
      ticks++;

      if (ticks > 20) {
        speed = Math.min(speed + 30, 400);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (ticks < maxTicks) {
          intervalRef.current = setInterval(() => {
            idx = (idx + 1) % DESTINOS_ROLETA.length;
            setItensVisiveis([DESTINOS_ROLETA[idx]]);
            ticks++;
            if (ticks >= maxTicks) {
              clearInterval(intervalRef.current!);
              const final = DESTINOS_ROLETA[Math.floor(Math.random() * DESTINOS_ROLETA.length)];
              setResultado(final);
              setItensVisiveis([final]);
              setGirando(false);
            }
          }, speed);
        }
      }
    }, speed);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <div className="rounded-[28px] border border-white/8 bg-black/25 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">🎰</span>
        <div>
          <h2 className="text-lg font-bold text-white">Roleta da Sexta</h2>
          <p className="text-xs text-slate-500">Descubra seu destino corporativo desta semana</p>
        </div>
      </div>

      {/* Display */}
      <div className="relative overflow-hidden rounded-[20px] border border-violet/20 bg-violet/5 py-8 text-center">
        <AnimatePresence mode="wait">
          {itensVisiveis.length > 0 ? (
            <motion.div
              key={itensVisiveis[0].text}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.08 }}
            >
              <div className="text-5xl">{itensVisiveis[0].emoji}</div>
              <p className={`mt-3 text-xl font-bold ${resultado ? "text-white" : "text-slate-300"}`}>
                {itensVisiveis[0].text}
              </p>
              {resultado && (
                <p className="mt-1 text-sm italic text-slate-500">{resultado.sub}</p>
              )}
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-5xl">🎯</div>
              <p className="mt-3 text-lg text-slate-500">Gire para descobrir seu destino</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={girar}
        disabled={girando}
        className="mt-4 w-full rounded-full bg-violet py-3 text-sm font-bold text-white transition-all hover:bg-violet/80 disabled:opacity-50"
      >
        {girando ? "Girando... 🌀" : resultado ? "Girar novamente 🎰" : "🎰 Girar a Roleta"}
      </button>

      {resultado && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-xs text-slate-600"
        >
          Resultado oficial. Sem direito a recurso.
        </motion.p>
      )}
    </div>
  );
}

// ─── Componente: Tradutor Corporativo ─────────────────────────────────────────

function TradutorCorporativo() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copiado, setCopiado] = useState(false);

  function traduzir() {
    if (!input.trim()) return;
    let resultado = input.toLowerCase().trim();

    let substituiu = false;
    for (const [casual, corp] of TRADUCOES) {
      if (resultado.includes(casual)) {
        resultado = resultado.replace(casual, corp);
        substituiu = true;
      }
    }

    if (!substituiu) {
      const jargao = JARGOES_EXTRA[Math.floor(Math.random() * JARGOES_EXTRA.length)];
      resultado = `${resultado.charAt(0).toUpperCase() + resultado.slice(1)}. ${jargao}`;
    } else {
      resultado = resultado.charAt(0).toUpperCase() + resultado.slice(1) + ".";
    }

    setOutput(resultado);
  }

  function copiar() {
    navigator.clipboard.writeText(output).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  return (
    <div className="rounded-[28px] border border-white/8 bg-black/25 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">🌐</span>
        <div>
          <h2 className="text-lg font-bold text-white">Tradutor Corporativo</h2>
          <p className="text-xs text-slate-500">Converta linguagem humana em burocrês fluente</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-slate-500">O que você quer dizer de verdade:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: não sei fazer isso, tô estressado, esqueci..."
            rows={3}
            className="w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-violet/40"
          />
        </div>

        <button
          onClick={traduzir}
          disabled={!input.trim()}
          className="w-full rounded-full bg-ember/80 py-2.5 text-sm font-bold text-white transition-all hover:bg-ember disabled:opacity-40"
        >
          🌐 Traduzir para Corporativo
        </button>

        {output && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[16px] border border-emerald-500/20 bg-emerald-500/5 p-4"
          >
            <p className="mb-2 text-xs text-emerald-400">Versão profissional aprovada pelo RH:</p>
            <p className="text-sm leading-relaxed text-white">{output}</p>
            <button
              onClick={copiar}
              className="mt-3 text-xs text-slate-500 underline hover:text-white"
            >
              {copiado ? "✅ Copiado!" : "📋 Copiar"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Componente: Gerador de Título LinkedIn ────────────────────────────────────

function GeradorLinkedIn() {
  const [cargo, setCargo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [copiado, setCopiado] = useState(false);

  function gerar() {
    if (!cargo.trim()) return;
    const prefixo = PREFIXOS_LINKEDIN[Math.floor(Math.random() * PREFIXOS_LINKEDIN.length)];
    const cargoAbsurdo = CARGOS_LINKEDIN[Math.floor(Math.random() * CARGOS_LINKEDIN.length)];
    const qualif = QUALIFICADORES_LINKEDIN[Math.floor(Math.random() * QUALIFICADORES_LINKEDIN.length)];
    const hashtag = HASHTAGS_LINKEDIN[Math.floor(Math.random() * HASHTAGS_LINKEDIN.length)];
    setTitulo(`${prefixo} ${cargoAbsurdo} @ ${cargo.trim()} ${qualif} | ${hashtag}`);
  }

  function copiar() {
    navigator.clipboard.writeText(titulo).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  return (
    <div className="rounded-[28px] border border-white/8 bg-black/25 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">💼</span>
        <div>
          <h2 className="text-lg font-bold text-white">Gerador de Título LinkedIn</h2>
          <p className="text-xs text-slate-500">Seu cargo real, elevado ao nível da disrupção</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Seu cargo atual (de verdade):</label>
          <input
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            placeholder="Ex: Desenvolvedor, Analista, Estagiário..."
            className="w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-violet/40"
          />
        </div>

        <button
          onClick={gerar}
          disabled={!cargo.trim()}
          className="w-full rounded-full bg-violet py-2.5 text-sm font-bold text-white transition-all hover:bg-violet/80 disabled:opacity-40"
        >
          💼 Gerar título profissional
        </button>

        {titulo && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[16px] border border-violet/20 bg-violet/8 p-4"
          >
            <p className="mb-2 text-xs text-violet opacity-70">Cole isso no seu LinkedIn agora:</p>
            <p className="text-sm font-semibold leading-relaxed text-white">{titulo}</p>
            <div className="mt-3 flex gap-3">
              <button onClick={copiar} className="text-xs text-slate-500 underline hover:text-white">
                {copiado ? "✅ Copiado!" : "📋 Copiar"}
              </button>
              <button onClick={gerar} className="text-xs text-slate-500 underline hover:text-white">
                🔄 Gerar outro
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Componente: Carta de Demissão ────────────────────────────────────────────

function CartaDemissao() {
  const [nickname, setNickname] = useState("");
  const [area, setArea] = useState("Tecnologia");
  const [carta, setCarta] = useState("");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const token = auth.getToken();
    if (token) {
      api.getMe(token).then((p) => {
        setNickname(p.nickname ?? "");
        if (p.area) setArea(p.area);
      }).catch(() => {});
    }
  }, []);

  function gerar() {
    const motivo = MOTIVOS_DEMISSAO[Math.floor(Math.random() * MOTIVOS_DEMISSAO.length)];
    const data = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const nome = nickname.trim() || "Profissional Anônimo";

    setCarta(
`À Diretoria de Recursos Humanos,

Por meio desta carta, eu, ${nome}, profissional da área de ${area}, venho comunicar formalmente meu pedido de desligamento desta organização, ${motivo}.

Agradeço pelos momentos de aprendizado, especialmente aqueles que, em retrospecto, parecem situações de treinamento intensivo para tolerância ao caos corporativo.

Fica registrado que contribuí com o máximo de minha capacidade dentro das condições disponíveis, incluindo, mas não limitado a: cafés consumidos como combustível de sobrevivência, reuniões suportadas stoicamente e deadlines honrados às custas do sono.

Solicito que o processo de offboarding inclua a devolução dos seguintes itens emocionais: paz interior, equilíbrio work-life e a crença ingênua de que "isso aqui é diferente".

Atenciosamente,

${nome}
${area} · BurnyOut Analytics System
${data}`
    );
  }

  function copiar() {
    navigator.clipboard.writeText(carta).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    });
  }

  return (
    <div className="rounded-[28px] border border-white/8 bg-black/25 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">📝</span>
        <div>
          <h2 className="text-lg font-bold text-white">Carta de Demissão Automática</h2>
          <p className="text-xs text-slate-500">Profissional. Digna. Satiricamente precisa.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Seu nome / apelido:</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Área:</label>
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Ex: Tecnologia"
              className="w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet/40"
            />
          </div>
        </div>

        <button
          onClick={gerar}
          className="w-full rounded-full border border-danger/40 bg-danger/10 py-2.5 text-sm font-bold text-danger transition-all hover:bg-danger/20"
        >
          📝 Gerar carta de demissão
        </button>

        {carta && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[16px] border border-white/8 bg-white/3 p-4"
          >
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-300">{carta}</pre>
            <div className="mt-4 flex gap-3">
              <button onClick={copiar} className="text-xs text-slate-500 underline hover:text-white">
                {copiado ? "✅ Copiado!" : "📋 Copiar carta"}
              </button>
              <button onClick={gerar} className="text-xs text-slate-500 underline hover:text-white">
                🔄 Gerar nova versão
              </button>
            </div>
            <p className="mt-3 text-xs italic text-slate-700">
              * Esta carta é uma sátira. BurnyOut não se responsabiliza por demissões reais.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function FerramentasPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/dashboard" className="text-sm text-slate-500 transition-colors hover:text-white">
          ← Dashboard
        </Link>
      </div>

      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-violet opacity-70">BurnyOut</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          🛠️ Caixa de Ferramentas
        </h1>
        <p className="mt-2 text-slate-400">
          Ferramentas para sobreviver ao ambiente corporativo com dignidade (ou sem)
        </p>
      </div>

      {/* Grid de ferramentas */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <RoletaDaSexta />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <TradutorCorporativo />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GeradorLinkedIn />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CartaDemissao />
        </motion.div>
      </div>

      <p className="mt-10 text-center text-xs text-slate-700">
        BurnyOut Ferramentas™ — Produtividade satírica desde 2026
      </p>
    </main>
  );
}
