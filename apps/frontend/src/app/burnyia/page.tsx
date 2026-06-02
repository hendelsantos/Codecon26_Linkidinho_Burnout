"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── Dados ────────────────────────────────────────────────────────────────────

type SituacaoKey = "atraso" | "reuniao" | "entrega" | "erro";

const SITUACAO_LABELS: Record<SituacaoKey, string> = {
  atraso: "🐢 Atraso",
  reuniao: "📅 Reunião",
  entrega: "📦 Entrega",
  erro: "💥 Erro",
};

const DESCULPAS_SITUACAO: Record<SituacaoKey, string[]> = {
  atraso: [
    "A entrega está em processo de maturação estratégica com foco em qualidade sustentável.",
    "Houve um misalignment de expectativas no processo de comunicação interfuncional.",
    "O artefato aguarda validação do guardião do processo, que por sua vez aguarda o guardião do guardião.",
    "Priorizei atividades de maior impacto dentro do meu bandwidth disponível neste ciclo.",
    "O ambiente de homologação apresentou comportamentos não esperados que demandaram investigação aprofundada.",
  ],
  reuniao: [
    "O convite chegou sem pauta e com insuficiente antecedência para planejamento estratégico da minha agenda.",
    "Exerci autonomia profissional em prol de uma entrega de maior valor naquele momento.",
    "Identifiquei sobreposição de pautas e priorizei o canal de maior impacto para o negócio.",
    "Estava em modo deep work para garantir entrega de valor sustentável no prazo acordado.",
    "Participei de forma assíncrona — estou aguardando a ata, que ainda não chegou, mas vou ler quando chegar.",
  ],
  entrega: [
    "O escopo evoluiu de forma orgânica durante o processo, demandando recalibração das estimativas.",
    "Existem dependências cross-funcionais que não foram mapeadas no planejamento inicial.",
    "Estou aguardando alinhamento com stakeholders para garantir que a entrega gere o impacto esperado.",
    "O processo de garantia de qualidade identificou pontos de melhoria que estão sendo endereçados.",
    "A complexidade oculta do problema superou a estimativa inicial por fatores sistêmicos não antecipados.",
  ],
  erro: [
    "Houve um desvio no processo de garantia de qualidade que está sendo tratado com um plano de melhoria contínua.",
    "O comportamento observado representa uma oportunidade de aprendizado organizacional para o time.",
    "Identifiquei uma janela de melhoria no processo que, quando corrigida, vai fortalecer a resiliência sistêmica.",
    "O incidente foi gerado por uma falha de comunicação que está sendo endereçada com práticas de rituais ágeis.",
    "Tomei uma decisão contextualizada com as informações disponíveis naquele momento. O contexto evoluiu.",
  ],
};

const PREFIXOS_LI = [
  "Chief", "Head of", "Senior", "Lead", "Global", "Fractional", "Visionary",
  "Quantum", "Digital", "Transformational", "Exponential", "Agile", "Future-Proof",
  "Strategic", "Principal", "Executive", "Associate", "Interim",
];
const CARGOS_LI = [
  "Innovation Officer", "Growth Architect", "Synergy Engineer", "Disruption Specialist",
  "Vibe Director", "Burnout Consultant", "AI Whisperer", "Digital Transformer",
  "Pixel Strategist", "Value Creator", "Impact Catalyst", "Agile Visionary",
  "Change Enabler", "Experience Designer", "Insight Generator", "Solution Orchestrator",
  "Culture Builder", "Mindset Shifter", "Ecosystem Architect", "Narrative Designer",
];
const ABERTURA_EMAIL = [
  "Prezado(a)", "Olá,", "Bom dia,", "Boa tarde,",
  "Caro(a) colega,", "Estimado(a) parceiro(a),",
];
const FECHAMENTO_EMAIL = [
  "Desde já agradeço pela atenção e fico à disposição para quaisquer alinhamentos.",
  "Conto com a vossa compreensão e retorno assim que possível.",
  "Fico à disposição para uma call de alinhamento caso necessário.",
  "Aguardo retorno e desejo um ciclo produtivo a todos.",
];
const EMAIL_TRANSFORMACOES: [RegExp, string][] = [
  [/preciso/gi, "identifico a necessidade estratégica de"],
  [/quero/gi, "manifesto interesse em"],
  [/não consigo/gi, "encontro desafios pontuais para"],
  [/errei/gi, "houve um desvio no processo de"],
  [/tô atrasado/gi, "a entrega está em maturação estratégica"],
  [/não vou/gi, "precisarei recalibrar minha disponibilidade para"],
  [/não sei/gi, "necessito de contexto adicional sobre"],
  [/urgente/gi, "de alta prioridade estratégica"],
  [/cansado/gi, "em modo de recuperação de performance"],
  [/problema/gi, "oportunidade de melhoria identificada"],
];

const VEREDICTOS_REUNIAO = [
  { emoji: "💀", titulo: "INÚTIL CONFIRMADO", texto: "Essa reunião poderia ter sido um e-mail de 3 linhas. Na verdade, poderia não ter sido nada." },
  { emoji: "🤡", titulo: "CIRCO VERIFICADO", texto: "BurnyIA detectou ausência total de pauta, objetivo e follow-up. Clássico da corporação." },
  { emoji: "🧟", titulo: "REUNIÃO ZUMBI", texto: "Existia em forma mas não em propósito. O cansaço gerado foi real. Os resultados: não." },
  { emoji: "🗿", titulo: "IMPACTO NEUTRO", texto: "Ninguém saiu mais inteligente. Ninguém saiu mais motivado. Mas saíram." },
  { emoji: "🔄", titulo: "LOOP DETECTADO", texto: "Essa reunião já aconteceu antes. E vai acontecer de novo. É o ciclo corporativo." },
  { emoji: "📊", titulo: "SLIDES DESNECESSÁRIOS", texto: "Os slides poderiam ter sido enviados. A reunião foi agendada para mostrar os slides." },
  { emoji: "🪦", titulo: "RIP PRODUTIVIDADE", texto: "Análise concluída: essa reunião custou em média 1.8h por participante que nunca voltam." },
];

const CHAT_RESPOSTAS = [
  "Com base nas informações disponíveis, vou precisar de um período de discovery para mapear a viabilidade desta iniciativa.",
  "Ótima pergunta. Precisamos alinhar stakeholders, mapear riscos e garantir que estamos falando a mesma língua antes de avançar.",
  "Identifico aqui uma oportunidade de crescimento exponencial que demanda uma abordagem holística e orientada a dados.",
  "Vou processar isso de forma assíncrona e retorno com um update estruturado em breve. Pode deixar comigo.",
  "A resposta depende de variáveis cross-funcionais que ainda estamos mapeando. Sugiro um alinhamento de 30 minutos.",
  "Excelente ponto. Isso precisa de mais maturidade antes de escalarmos para a alta gestão. Vou sensibilizar as lideranças.",
  "Segundo minha análise preditiva baseada em dados históricos de sofrimento corporativo: sim, mas não agora.",
  "Minha recomendação é pivotarmos a abordagem, mantermos o momentum e garantirmos fit estratégico antes de qualquer entrega.",
  "Isso é exatamente o tipo de desafio que nosso modelo foi treinado para não resolver de forma definitiva. Posso ajudar com um template.",
  "Processando... Detectei alta concentração de buzzwords na sua pergunta. Isso é um sinal positivo de alinhamento cultural.",
];

const DIAGNOSTICOS = [
  { nivel: "MODERADO", cor: "text-yellow-400", desc: "Você ainda consegue identificar fins de semana. Isso é progresso. Continue monitorando." },
  { nivel: "AVANÇADO", cor: "text-orange-400", desc: "Burnout em estágio de institucionalização. Você chamaria isso de 'dedicação' no LinkedIn." },
  { nivel: "CRÍTICO", cor: "text-red-400", desc: "Sistema operando exclusivamente por inércia e medo. Parabenize-se por ainda estar funcionando." },
  { nivel: "TERMINAL", cor: "text-violet-400", desc: "Você transcendeu o burnout. Está além do cansaço. Isso tecnicamente é uma conquista." },
  { nivel: "EM NEGAÇÃO", cor: "text-blue-400", desc: "Análise indica burnout severo. Usuário provavelmente vai ignorar esse diagnóstico e abrir o Slack." },
];

const PERGUNTAS_DIAGNOSTICO = [
  {
    pergunta: "Quando foi sua última férias real?",
    opcoes: ["Esse ano", "Ano passado", "Antes da pandemia", "O que é férias?"],
  },
  {
    pergunta: "Quantas reuniões inúteis você participou hoje?",
    opcoes: ["0-2", "3-5", "6-10", "Parei de contar"],
  },
  {
    pergunta: "O que você faria se não tivesse que trabalhar?",
    opcoes: ["Viajar", "Estudar algo diferente", "Dormir", "Não consigo imaginar"],
  },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Gerador de Desculpas ─────────────────────────────────────────────────────
function GeradorDesculpa() {
  const [situacao, setSituacao] = useState<SituacaoKey>("atraso");
  const [contexto, setContexto] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const gerar = async () => {
    setLoading(true);
    setResultado("");
    await new Promise<void>((r) => setTimeout(r, 1200));
    const base = pick(DESCULPAS_SITUACAO[situacao]);
    const full = contexto ? `Em relação a "${contexto}": ${base}` : base;
    setResultado(full);
    setLoading(false);
  };

  const copiar = () => {
    navigator.clipboard.writeText(resultado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(SITUACAO_LABELS) as SituacaoKey[]).map((s) => (
          <button
            key={s}
            onClick={() => setSituacao(s)}
            className={`rounded-xl border px-3 py-2 text-sm transition-all ${
              situacao === s
                ? "border-violet bg-violet/20 text-white"
                : "border-white/10 text-white/50 hover:border-white/30"
            }`}
          >
            {SITUACAO_LABELS[s]}
          </button>
        ))}
      </div>
      <input
        value={contexto}
        onChange={(e) => setContexto(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && gerar()}
        placeholder="Contexto opcional (ex: entrega do projeto X)..."
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet/50"
      />
      <button
        onClick={gerar}
        disabled={loading}
        className="w-full rounded-xl bg-violet py-3 text-sm font-semibold text-white transition-all hover:bg-violet/80 disabled:opacity-60"
      >
        {loading ? "Processando justificativa..." : "🎭 Gerar Desculpa Profissional"}
      </button>
      <AnimatePresence>
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-violet/30 bg-violet/10 p-4"
          >
            <p className="text-sm italic leading-relaxed text-white/90">
              &ldquo;{resultado}&rdquo;
            </p>
            <button onClick={copiar} className="mt-3 text-xs text-violet hover:text-violet/80">
              {copiado ? "✓ Copiado!" : "Copiar"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── LinkedIn Title Engine ────────────────────────────────────────────────────
function LinkedInEngine() {
  const [cargo, setCargo] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const gerar = async () => {
    setLoading(true);
    setResultado("");
    await new Promise<void>((r) => setTimeout(r, 1000));
    const prefixo = pick(PREFIXOS_LI);
    const funcao = pick(CARGOS_LI);
    const base = cargo || "Professional";
    const area = pick(["Work", "People", "Impact", "Culture", "Innovation", "Growth"]);
    const abertura = pick(["opportunities", "synergies", "collaborations", "connections"]);
    const titulo = `${prefixo} ${funcao} | ${base} Turned Corporate Philosopher | Building the Future of ${area} | Open to ${abertura}`;
    setResultado(titulo);
    setLoading(false);
  };

  const copiar = () => {
    navigator.clipboard.writeText(resultado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        value={cargo}
        onChange={(e) => setCargo(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && gerar()}
        placeholder="Seu cargo atual (ex: Desenvolvedor, Analista...)"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet/50"
      />
      <button
        onClick={gerar}
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-violet to-blue-600 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Sintetizando identidade profissional..." : "🏆 Gerar Título LinkedIn"}
      </button>
      <AnimatePresence>
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4"
          >
            <p className="text-sm font-medium leading-relaxed text-white/90">{resultado}</p>
            <button onClick={copiar} className="mt-3 text-xs text-blue-400 hover:text-blue-300">
              {copiado ? "✓ Copiado!" : "Copiar para o LinkedIn"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── E-mail Corporativizador ──────────────────────────────────────────────────
function EmailCorporativo() {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const corporativizar = async () => {
    if (!texto.trim()) return;
    setLoading(true);
    setResultado("");
    await new Promise<void>((r) => setTimeout(r, 1400));
    let corpo = texto.trim();
    EMAIL_TRANSFORMACOES.forEach(([regex, substituto]) => {
      corpo = corpo.replace(regex, substituto);
    });
    corpo = corpo.charAt(0).toUpperCase() + corpo.slice(1);
    const abertura = pick(ABERTURA_EMAIL);
    const fechamento = pick(FECHAMENTO_EMAIL);
    const saudacao = pick([
      "Espero que esteja bem.",
      "Espero que este e-mail te encontre bem.",
      "Espero que esteja tendo um ciclo produtivo.",
    ]);
    const email = [
      `${abertura}`,
      ``,
      `${saudacao}`,
      ``,
      `${corpo}.`,
      ``,
      `Vale destacar que esta comunicação foi devidamente documentada para fins de rastreabilidade e governança do processo.`,
      ``,
      `${fechamento}`,
      ``,
      `Atenciosamente,`,
      `[Seu nome]`,
      `[Cargo Impactante] | [Empresa]`,
      `"Transformando desafios em oportunidades de crescimento™"`,
    ].join("\n");
    setResultado(email);
    setLoading(false);
  };

  const copiar = () => {
    navigator.clipboard.writeText(resultado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Sua mensagem simples... (ex: não consigo fazer isso hoje)"
        rows={3}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-orange-500/50"
      />
      <button
        onClick={corporativizar}
        disabled={loading || !texto.trim()}
        className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-red-600 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Aplicando jargão corporativo..." : "📧 Corporativizar E-mail"}
      </button>
      <AnimatePresence>
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4"
          >
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-white/90">
              {resultado}
            </pre>
            <button onClick={copiar} className="mt-3 text-xs text-orange-400 hover:text-orange-300">
              {copiado ? "✓ Copiado!" : "Copiar e-mail"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Detector de Reunião Inútil ───────────────────────────────────────────────
function DetectorReuniao() {
  const [descricao, setDescricao] = useState("");
  const [resultado, setResultado] = useState<(typeof VEREDICTOS_REUNIAO)[number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const analisar = async () => {
    if (!descricao.trim()) return;
    setLoading(true);
    setResultado(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return Math.min(90, p + Math.random() * 15);
      });
    }, 150);

    await new Promise<void>((r) => setTimeout(r, 2000));
    clearInterval(interval);
    setProgress(100);
    await new Promise<void>((r) => setTimeout(r, 200));
    setResultado(pick(VEREDICTOS_REUNIAO));
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descreva sua reunião... (ex: call de 1h para alinhamento do alinhamento)"
        rows={3}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-red-500/50"
      />
      <button
        onClick={analisar}
        disabled={loading || !descricao.trim()}
        className="w-full rounded-xl bg-gradient-to-r from-red-600 to-pink-600 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Analisando inutilidade..." : "🔍 Analisar Reunião"}
      </button>

      {loading && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-pink-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-center text-xs text-white/40">
            {progress < 30
              ? "Lendo a pauta..."
              : progress < 60
              ? "Calculando tempo perdido..."
              : "Gerando veredicto..."}
          </p>
        </div>
      )}

      <AnimatePresence>
        {resultado && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center"
          >
            <div className="mb-2 text-4xl">{resultado.emoji}</div>
            <div className="mb-2 font-mono text-sm font-bold text-red-400">
              {resultado.titulo}
            </div>
            <p className="text-sm leading-relaxed text-white/80">{resultado.texto}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Diagnóstico de Burnout ───────────────────────────────────────────────────
type DiagEtapa = "inicio" | "quiz" | "loading" | "resultado";

function DiagnosticoBurnout() {
  const [etapa, setEtapa] = useState<DiagEtapa>("inicio");
  const [perguntaIdx, setPerguntaIdx] = useState(0);
  const [resultado, setResultado] = useState<(typeof DIAGNOSTICOS)[number] | null>(null);
  const [progress, setProgress] = useState(0);

  const responder = async () => {
    if (perguntaIdx < PERGUNTAS_DIAGNOSTICO.length - 1) {
      setPerguntaIdx((i) => i + 1);
    } else {
      setEtapa("loading");
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) {
            clearInterval(interval);
            return 90;
          }
          return Math.min(90, p + Math.random() * 20);
        });
      }, 120);

      await new Promise<void>((r) => setTimeout(r, 2200));
      clearInterval(interval);
      setProgress(100);
      await new Promise<void>((r) => setTimeout(r, 300));
      setResultado(pick(DIAGNOSTICOS));
      setEtapa("resultado");
    }
  };

  const reiniciar = () => {
    setEtapa("inicio");
    setPerguntaIdx(0);
    setResultado(null);
    setProgress(0);
  };

  if (etapa === "inicio") {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="text-5xl">🧠</div>
        <p className="text-sm leading-relaxed text-white/60">
          Responda 3 perguntas.
          <br />
          BurnyIA diagnostica seu nível de sofrimento corporativo.
        </p>
        <button
          onClick={() => setEtapa("quiz")}
          className="rounded-xl bg-gradient-to-r from-violet to-purple-600 px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Iniciar Diagnóstico™
        </button>
      </div>
    );
  }

  if (etapa === "quiz") {
    const pergunta = PERGUNTAS_DIAGNOSTICO[perguntaIdx];
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={perguntaIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex flex-col gap-4"
        >
          <div className="mb-1 flex items-center justify-between text-xs text-white/40">
            <span>
              Pergunta {perguntaIdx + 1} de {PERGUNTAS_DIAGNOSTICO.length}
            </span>
            <span>
              {Math.round((perguntaIdx / PERGUNTAS_DIAGNOSTICO.length) * 100)}%
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-violet transition-all"
              style={{
                width: `${(perguntaIdx / PERGUNTAS_DIAGNOSTICO.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-sm font-semibold leading-relaxed text-white">
            {pergunta.pergunta}
          </p>
          <div className="flex flex-col gap-2">
            {pergunta.opcoes.map((op, i) => (
              <button
                key={i}
                onClick={responder}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition-all hover:border-violet/50 hover:bg-violet/10"
              >
                {op}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (etapa === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="animate-pulse text-4xl">🧠</div>
        <div className="w-full space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet to-purple-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-xs text-white/40">
            {progress < 40
              ? "Analisando padrões de sofrimento..."
              : progress < 70
              ? "Consultando base de dados corporativa..."
              : "Gerando diagnóstico personalizado..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {resultado && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-2 text-center"
        >
          <div className="font-mono text-xs uppercase tracking-widest text-white/30">
            Diagnóstico BurnyIA™
          </div>
          <div className={`font-mono text-2xl font-bold ${resultado.cor}`}>
            {resultado.nivel}
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            {resultado.desc}
          </p>
          <button
            onClick={reiniciar}
            className="mt-2 rounded-xl border border-white/10 px-6 py-2 text-xs text-white/50 hover:border-white/30 hover:text-white/80"
          >
            Repetir diagnóstico
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Chat Corporativo ─────────────────────────────────────────────────────────
type Msg = { role: "user" | "ai"; text: string };

function ChatCorporativo() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: "Olá! Sou o BurnyIA. Como posso transformar sua dúvida em jargão corporativo hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const enviar = async () => {
    if (!input.trim() || loading) return;
    const pergunta = input.trim();
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: pergunta }]);
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 800 + Math.random() * 800));
    setMsgs((m) => [...m, { role: "ai", text: pick(CHAT_RESPOSTAS) }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-52 flex-col gap-3 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-3 scroll-smooth">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-sm bg-violet text-white"
                  : "rounded-bl-sm bg-white/10 text-white/80"
              }`}
            >
              {m.role === "ai" && (
                <span className="mb-1 block text-xs font-semibold text-violet/80">
                  BurnyIA™
                </span>
              )}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-white/40"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Faça sua pergunta corporativa..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-violet/50"
        />
        <button
          onClick={enviar}
          disabled={loading || !input.trim()}
          className="rounded-xl bg-violet px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet/80 disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: "desculpa",
    emoji: "🎭",
    titulo: "Gerador de Desculpas Pro™",
    subtitulo: "Justificativas profissionais geradas por IA",
    borda: "border-violet/30 hover:border-violet/60",
    badge: "GPT-Desculpa-4o",
    component: <GeradorDesculpa />,
  },
  {
    id: "linkedin",
    emoji: "🏆",
    titulo: "LinkedIn Title Engine",
    subtitulo: "Títulos que impressionam e não dizem nada",
    borda: "border-blue-500/30 hover:border-blue-500/60",
    badge: "LLM-LinkedIn-Pro",
    component: <LinkedInEngine />,
  },
  {
    id: "email",
    emoji: "📧",
    titulo: "E-mail Corporativizador",
    subtitulo: "Transforma mensagens simples em e-mails de 3 parágrafos",
    borda: "border-orange-500/30 hover:border-orange-500/60",
    badge: "CorporateGPT-v7",
    component: <EmailCorporativo />,
  },
  {
    id: "reuniao",
    emoji: "🔍",
    titulo: "Detector de Reunião Inútil",
    subtitulo: "Análise preditiva de inutilidade com 99.8% de precisão",
    borda: "border-red-500/30 hover:border-red-500/60",
    badge: "MeetingBuster-AI",
    component: <DetectorReuniao />,
  },
  {
    id: "burnout",
    emoji: "🧠",
    titulo: "Diagnóstico de Burnout™",
    subtitulo: "3 perguntas. Um diagnóstico que você vai ignorar.",
    borda: "border-purple-500/30 hover:border-purple-500/60",
    badge: "PsychoBurnout-3.5",
    component: <DiagnosticoBurnout />,
  },
  {
    id: "chat",
    emoji: "💬",
    titulo: "Chat Corporativo",
    subtitulo: "Pergunte o que quiser. Receba jargão de volta.",
    borda: "border-green-500/30 hover:border-green-500/60",
    badge: "BurnyGPT-Turbo",
    component: <ChatCorporativo />,
  },
];

export default function BurnyIAPage() {
  return (
    <main className="min-h-screen bg-[#070810]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/5 pb-16 pt-20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-96 w-96 rounded-full bg-violet/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-xs text-violet">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet" />
            Powered by Suffering™ · 2.4M+ profissionais diagnosticados
          </div>

          {/* Logo */}
          <h1 className="mb-4 text-6xl font-bold tracking-tight text-white sm:text-7xl">
            Burny<span className="text-violet">IA</span>
          </h1>

          <p className="mb-2 text-xl font-light text-white/70">
            A inteligência artificial que finalmente te entende.
          </p>
          <p className="mb-8 text-sm text-white/30">
            Modelo: GPT-Burnout-4o · Context window: 1 reunião inútil · Treinado com
            847.000 e-mails corporativos
          </p>

          {/* Trust badges */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            {["SOC2 Compliant", "GDPR Ready", "ISO 9001", "99.8% Uptime*"].map((b) => (
              <span
                key={b}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40"
              >
                ✓ {b}
              </span>
            ))}
          </div>

          {/* CTA Chat */}
          <Link
            href="/burnyia/chat"
            className="mb-8 inline-flex items-center gap-3 rounded-2xl bg-violet px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet/30 transition-all hover:bg-violet/90 hover:shadow-violet/50 hover:scale-[1.02]"
          >
            <span className="text-xl">💬</span>
            Conversar com BurnyIA
            <span className="text-violet/60">→</span>
          </Link>

          {/* Terminal fake */}
          <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left font-mono text-xs">
            <div className="mb-2 flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="text-green-400/60">$ burnyia --status</div>
            <div className="mt-1 text-white/40">→ Modelos carregados: 6/6</div>
            <div className="text-white/40">
              → Sofrimento detectado:{" "}
              <span className="text-orange-400">ELEVADO</span>
            </div>
            <div className="text-white/40">→ Reuniões analisadas hoje: 14.823</div>
            <div className="text-white/40">→ Desculpas geradas: 2.401.337</div>
            <div className="mt-1 text-green-400/60">
              ✓ Sistema operacional. Boa sorte.
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid de ferramentas ── */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white">Capacidades da IA</h2>
          <p className="mt-2 text-sm text-white/40">
            6 módulos especializados em sofrimento corporativo
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl border bg-white/[0.02] p-6 transition-colors ${tool.borda}`}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tool.emoji}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{tool.titulo}</h3>
                    <p className="mt-0.5 text-xs text-white/40">{tool.subtitulo}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/30">
                  {tool.badge}
                </span>
              </div>
              {tool.component}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-t border-white/5 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { valor: "2.4M+", label: "Profissionais diagnosticados" },
              { valor: "99.8%", label: "Precisão no sofrimento*" },
              { valor: "0ms", label: "Tempo de resposta emocional" },
              { valor: "∞", label: "Reuniões identificadas como inúteis" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-violet">{s.valor}</div>
                <div className="mt-1 text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-white/20">
            *BurnyIA não se responsabiliza por demissões, promoções involuntárias, crises
            existenciais ou insights não solicitados. Todos os diagnósticos são fictícios.
            Qualquer semelhança com a sua realidade corporativa é um problema seu, não
            nosso. A precisão de 99.8% foi calculada com base em dados que preferimos não
            divulgar.
          </p>
          <Link
            href="/ferramentas"
            className="mt-4 inline-block text-xs text-white/20 transition-colors hover:text-white/40"
          >
            ← Voltar para ferramentas
          </Link>
        </div>
      </footer>
    </main>
  );
}
