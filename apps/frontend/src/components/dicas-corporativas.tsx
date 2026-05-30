"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DICAS_TICKER = [
  "Aprenda Python. Automatize 8h de trabalho. Passe o resto do dia fingindo estar ocupado.",
  "Entregue antes do prazo. Sua recompensa será mais trabalho.",
  "Nunca diga 'terminei'. Diga 'estou refinando a entrega'.",
  "Seu chefe não quer soluções. Ele quer dashboards coloridos.",
  "Deploy sexta às 18h. A adrenalina aumenta a produtividade.",
  "Se algo funcionar na primeira tentativa: desconfie.",
  "Não importa resolver o problema. Importa abrir uma call sobre ele.",
  "Reuniões poderiam ser e-mails. Mas e o networking?",
  "A verdadeira senioridade é parecer calmo enquanto tudo pega fogo.",
  "Sua task não está atrasada. Está em processo estratégico de maturação.",
  "O burnout é apenas paixão com branding corporativo.",
  "Sistema caiu em produção? 'Faz parte da arquitetura resiliente'.",
  "Automatize o repetitivo. Depois crie mais repetitivo para justificar sua vaga.",
  "Todo problema corporativo tem solução: mais uma daily.",
  "KPI bom é aquele que ninguém entende.",
  "A startup é uma família. Uma família que faz deploy domingo.",
  "'Urgente' = alguém esqueceu de fazer antes.",
  "O código funciona na minha máquina. Problema do DevOps.",
  "Motivação é temporária. Deadline é eterna.",
  "Seu código será legado em 2 semanas.",
  "Não pense fora da caixa. Crie uma apresentação sobre a caixa.",
  "Aquela branch 'temporária' tem 2 anos.",
  "Ninguém lê a documentação. Nem quem escreveu.",
  "Aprenda IA para escrever relatórios inúteis 300% mais rápido.",
  "Quem precisa de terapia quando existe café corporativo grátis?",
  "Refatorar é prometido. Nunca feito.",
  "Nem todo herói usa capa. Alguns apenas reiniciam o servidor.",
  "Trabalhe com o que ama e nunca mais separe trabalho da vida.",
  "O segredo da produtividade: copiar do Stack Overflow rapidamente.",
  "Dormir é importante. Mas já viu aquele bug em produção?",
];

const DICAS_CARD = [
  {
    emoji: "🐍",
    texto:
      "Aprenda Python. Quando seu chefe pedir o relatório para as 17h, gere em 2 minutos, entregue às 17:01 e peça desculpas.",
  },
  {
    emoji: "🎯",
    texto:
      "Entregue tudo antes do prazo. Assim ganhará mais trabalho como recompensa.",
  },
  {
    emoji: "🧠",
    texto:
      "Nunca diga 'terminei'. Diga 'estou refinando a entrega estrategicamente'.",
  },
  {
    emoji: "📊",
    texto:
      "Seu chefe não quer soluções. Ele quer dashboards coloridos com gráficos de pizza.",
  },
  {
    emoji: "🚀",
    texto:
      "Faça deploy sexta-feira às 18h. A adrenalina aumenta a produtividade do time de plantão.",
  },
  {
    emoji: "😰",
    texto:
      "Se algo funcionar na primeira tentativa: desconfie. Algo está errado no ambiente.",
  },
  {
    emoji: "☕",
    texto:
      "Automatize tarefas repetitivas. Depois crie novas tarefas repetitivas para justificar sua vaga.",
  },
  {
    emoji: "📞",
    texto:
      "Não importa resolver o problema. Importa abrir uma call sobre ele e agendar outra para acompanhamento.",
  },
  {
    emoji: "🤖",
    texto: "Aprenda IA para escrever relatórios inúteis 300% mais rápido.",
  },
  {
    emoji: "📅",
    texto: "Reuniões poderiam ser e-mails. Mas aí como você justificaria o dia?",
  },
  {
    emoji: "🔥",
    texto:
      "A verdadeira senioridade é parecer completamente calmo enquanto tudo pega fogo em produção.",
  },
  {
    emoji: "⏱️",
    texto:
      "Sua task não está atrasada. Ela está em processo estratégico de maturação incremental.",
  },
  {
    emoji: "💀",
    texto: "O burnout é apenas paixão com branding corporativo inadequado.",
  },
  {
    emoji: "🖥️",
    texto:
      "Sistema caiu em produção? Respira fundo e diz: 'isso faz parte da arquitetura resiliente'.",
  },
  {
    emoji: "🔁",
    texto:
      "Todo problema pode ser resolvido com: mais uma daily, mais um ritual de alinhamento.",
  },
  {
    emoji: "📈",
    texto:
      "KPI bom é aquele que ninguém entende, mas todos concordam que é impressionante.",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    texto:
      "A startup é uma família. Uma família disfuncional que faz deploy no domingo às 23h.",
  },
  {
    emoji: "🚨",
    texto: "'Urgente' significa que alguém esqueceu de fazer isso há três semanas.",
  },
  {
    emoji: "💪",
    texto:
      "O RH acredita em você. Infelizmente seu prazo de amanhã também depende disso.",
  },
  {
    emoji: "🤷",
    texto:
      "Se você não entende o requisito, o cliente provavelmente também não. Vai entregando.",
  },
  {
    emoji: "😴",
    texto:
      "Dormir é essencial para a saúde. Mas já viu aquele bug que foi pra produção há 40 minutos?",
  },
  {
    emoji: "🦸",
    texto:
      "Nem todo herói usa capa. Alguns apenas reiniciam o servidor e fingem que resolveram.",
  },
  {
    emoji: "🏃",
    texto:
      "Motivação é temporária. Deadline é eterna. Alie os dois e você tem o ambiente corporativo padrão.",
  },
  {
    emoji: "🪦",
    texto: "Seu código será código legado em 2 semanas. É assim que funciona.",
  },
  {
    emoji: "📦",
    texto:
      "Não pense fora da caixa. Crie uma apresentação de 40 slides sobre as possibilidades da caixa.",
  },
  {
    emoji: "🌿",
    texto:
      "Aquela branch 'temporária' que você criou tem 2 anos e ninguém tem coragem de deletar.",
  },
  {
    emoji: "📝",
    texto:
      "Ninguém lê documentação. Nem a pessoa que passou 3 semanas escrevendo.",
  },
  {
    emoji: "💆",
    texto:
      "Trabalhe com o que você ama e nunca mais consiga separar trabalho da vida pessoal.",
  },
  {
    emoji: "🔎",
    texto:
      "O verdadeiro segredo da produtividade? Copiar do Stack Overflow mais rápido que seus colegas.",
  },
];

// ─── Ticker horizontal ────────────────────────────────────────────────────────
export function DicasTicker() {
  // duplicar para loop contínuo
  const items = [...DICAS_TICKER, ...DICAS_TICKER];

  return (
    <div className="w-full overflow-hidden border-y border-violet/15 bg-violet/5 py-3">
      <div className="ticker-track flex gap-8 whitespace-nowrap">
        {items.map((dica, i) => (
          <span key={i} className="inline-flex shrink-0 items-center gap-3 text-sm text-slate-400">
            <span className="text-violet opacity-60">◆</span>
            {dica}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Card rotativo (para dashboard) ──────────────────────────────────────────
export function DicasCard() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * DICAS_CARD.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % DICAS_CARD.length);
        setVisible(true);
      }, 350);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const dica = DICAS_CARD[idx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-[24px] border border-white/8 bg-white/3 p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-base">💡</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-violet opacity-70">
          Dica Corporativa
        </span>
      </div>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3"
          >
            <span className="mt-0.5 text-2xl">{dica.emoji}</span>
            <p className="text-sm leading-relaxed text-slate-300">{dica.texto}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-4 flex gap-1">
        {DICAS_CARD.map((_, i) => (
          <button
            key={i}
            onClick={() => { setVisible(false); setTimeout(() => { setIdx(i); setVisible(true); }, 200); }}
            className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-4 bg-violet" : "w-1 bg-white/20"}`}
            aria-label={`Dica ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
