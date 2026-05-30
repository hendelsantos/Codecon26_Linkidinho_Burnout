"use client";

import { useState } from "react";

const DESCULPAS = [
  "Estou em loop de alinhamento estratégico com stakeholders de alto impacto.",
  "Minha entrega está bloqueada por dependências cross-funcionais ainda não mapeadas.",
  "Aguardando validação do guardiã do processo antes de avançar para o próximo milestone.",
  "Estou em modo de escalonamento de prioridades após uma daily inesperadamente longa.",
  "O roadmap foi reestruturado e preciso ressincronizar meu backlog pessoal.",
  "Meu pipeline de tarefas está em revisão após o último sprint review.",
  "Estou fazendo uma análise de impacto antes de qualquer movimentação técnica.",
  "A decisão está aguardando aprovação do comitê de governança de iniciativas.",
  "Preciso de contexto adicional antes de gerar valor real nessa frente.",
  "Estou triangulando informações de múltiplas áreas para garantir coerência de narrativa.",
  "O ambiente de homologação caiu e não consigo validar a hipótese sem ele.",
  "Estou facilitando a transição de conhecimento entre times após a reestruturação.",
  "Minha estimativa depende de uma estimativa que depende de outra estimativa.",
  "Estou em modo de discovery. Ainda não chegamos à fase de delivery.",
  "Aguardando o go/no-go da liderança sênior para destravar a execução.",
  "O ticket está em triagem. Priorização acontece nas sextas após as 17h.",
  "Estou sincronizando os OKRs do trimestre com as entregas do squad.",
  "Não havia bandwidth suficiente para absorver mais demanda nessa sprint.",
  "Estou em uma reunião sobre reuniões para reduzir a quantidade de reuniões.",
  "O deploy está aguardando a janela de mudança aprovada pelo CAB.",
];

function desculpaAleatoria(atual?: string): string {
  const opcoes = DESCULPAS.filter((d) => d !== atual);
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

export function GerarDesculpa() {
  const [aberto, setAberto] = useState(false);
  const [desculpa, setDesculpa] = useState(() => desculpaAleatoria());
  const [copiado, setCopiado] = useState(false);

  function nova() {
    setDesculpa((atual) => desculpaAleatoria(atual));
    setCopiado(false);
  }

  function copiar() {
    navigator.clipboard.writeText(desculpa).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  return (
    <>
      {/* Botão flutuante — lado esquerdo */}
      <button
        onClick={() => { setAberto(true); nova(); }}
        title="Gerar desculpa corporativa"
        className="fixed bottom-6 left-4 z-[9998] flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(130,87,255,0.5)] transition-all hover:scale-105 hover:shadow-[0_4px_32px_rgba(255,107,44,0.55)] active:scale-95 sm:left-6"
        style={{ background: "linear-gradient(135deg,#ff6b2c,#8257ff)" }}
      >
        🎭 <span>Gerar desculpa</span>
      </button>

      {/* Modal de desculpa */}
      {aberto && (
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-start p-4 sm:items-center sm:justify-start sm:p-8"
          onClick={(e) => e.target === e.currentTarget && setAberto(false)}
        >
          {/* Backdrop sutil */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAberto(false)} />

          <div
            className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-[#0d0d1a] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            style={{ boxShadow: "0 0 0 1px rgba(130,87,255,0.18), 0 24px 80px rgba(0,0,0,0.6)" }}
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xl"
                  style={{ background: "linear-gradient(135deg,#ff6b2c,#8257ff)" }}
                >
                  🎭
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#9f96a9]">BurnyOut™</p>
                  <p className="text-sm font-semibold text-white">Gerador de Desculpas Corporativas</p>
                </div>
              </div>
              <button
                onClick={() => setAberto(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-sm text-slate-400 hover:bg-white/15 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Desculpa */}
            <div className="rounded-[20px] border border-white/8 bg-white/4 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#ff6b2c] mb-3">Desculpa gerada</p>
              <p className="text-base leading-7 font-medium text-white">{desculpa}</p>
            </div>

            {/* Ações */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={nova}
                className="flex-1 rounded-[16px] border border-white/10 bg-white/6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/12 active:scale-95"
              >
                🔄 Nova desculpa
              </button>
              <button
                onClick={copiar}
                className="flex-1 rounded-[16px] py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-95"
                style={{ background: copiado ? "linear-gradient(135deg,#85ffb0,#8257ff)" : "linear-gradient(135deg,#8257ff,#ff6b2c)" }}
              >
                {copiado ? "✅ Copiado!" : "📋 Copiar"}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-[#9f96a9]">
              Use com responsabilidade. Ou não.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
