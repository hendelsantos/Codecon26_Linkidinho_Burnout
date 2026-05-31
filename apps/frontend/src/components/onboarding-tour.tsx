"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const PASSOS = [
  {
    emoji: "🔥",
    titulo: "Bem-vindo ao BurnyOut™",
    descricao:
      "A única plataforma que transforma seu sofrimento corporativo em métricas acionáveis. Vamos te dar um tour rápido.",
    posicao: "center" as const,
  },
  {
    emoji: "📊",
    titulo: "Seu Burny Score™",
    descricao:
      "Este é o seu nível de burnout em tempo real. Quanto mais alto, mais próximo do colapso. Score 90+ ativa o Modo Apocalipse.",
    posicao: "top-left" as const,
  },
  {
    emoji: "☕",
    titulo: "Check-in Diário",
    descricao:
      "Registre aqui seus cafés, reuniões inúteis, minutos no trânsito e stress do dia. Isso alimenta seu score.",
    posicao: "top-right" as const,
  },
  {
    emoji: "🏆",
    titulo: "Rankings e Feed",
    descricao:
      "Veja quem sofre mais que você no ranking global e desabafe no feed para aliviar a pressão corporativa.",
    posicao: "center" as const,
  },
  {
    emoji: "🛠️",
    titulo: "Ferramentas Corporativas",
    descricao:
      "Na aba Ferramentas você encontra a Roleta da Sexta, o Tradutor Corporativo, gerador de título LinkedIn e mais.",
    posicao: "center" as const,
  },
  {
    emoji: "🎯",
    titulo: "Tudo pronto.",
    descricao:
      "Agora é só sofrer com elegância. Faça seu primeiro check-in do dia e monitore seu colapso em tempo real.",
    posicao: "center" as const,
  },
];

const STORAGE_KEY = "burny_tour_done";

export function OnboardingTour() {
  const [visivel, setVisivel] = useState(false);
  const [passo, setPasso] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // pequeno delay para a página carregar primeiro
      const t = setTimeout(() => setVisivel(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function avancar() {
    if (passo < PASSOS.length - 1) {
      setPasso((p) => p + 1);
    } else {
      fechar();
    }
  }

  function fechar() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisivel(false);
  }

  const atual = PASSOS[passo];

  return (
    <AnimatePresence>
      {visivel && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={fechar}
          />

          {/* Card do tour */}
          <motion.div
            key={`passo-${passo}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative rounded-[28px] border border-white/10 bg-[#0d0f18] p-7 shadow-2xl">
              {/* Botão fechar */}
              <button
                onClick={fechar}
                className="absolute right-4 top-4 rounded-full p-1 text-slate-600 hover:text-slate-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Progresso */}
              <div className="mb-6 flex gap-1.5">
                {PASSOS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= passo ? "bg-violet" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* Conteúdo */}
              <div className="text-center">
                <motion.p
                  key={`emoji-${passo}`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-4 text-5xl"
                >
                  {atual.emoji}
                </motion.p>
                <h3 className="text-xl font-bold text-white">{atual.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{atual.descricao}</p>
              </div>

              {/* Ações */}
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  onClick={fechar}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  Pular tour
                </button>
                <button
                  onClick={avancar}
                  className="burn-gradient flex-1 rounded-full py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                >
                  {passo < PASSOS.length - 1 ? "Próximo →" : "Começar a sofrer 🔥"}
                </button>
              </div>

              {/* Contador */}
              <p className="mt-4 text-center text-xs text-slate-700">
                {passo + 1} de {PASSOS.length}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
