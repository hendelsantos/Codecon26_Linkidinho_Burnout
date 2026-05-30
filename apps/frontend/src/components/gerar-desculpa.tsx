"use client";

import { useState } from "react";

// ── Por que atrasou ──────────────────────────────────────────────────────────
const DESCULPAS_ATRASO = [
  "Estou em loop de alinhamento estratégico com stakeholders de alto impacto.",
  "Minha entrega está bloqueada por dependências cross-funcionais ainda não mapeadas.",
  "O roadmap foi reestruturado e preciso ressincronizar meu backlog pessoal.",
  "Minha estimativa depende de uma estimativa que depende de outra estimativa.",
  "Estou aguardando o aceite do PO para dar sequência ao desenvolvimento.",
  "O ambiente de homologação caiu e não consigo validar a hipótese sem ele.",
  "A branch principal estava instável. Preferi não mergear em produção sem estabilidade.",
  "Precisei refatorar o contexto antes de avançar. Dívida técnica é risco real.",
  "Estava analisando o impacto lateral da mudança antes de commitar qualquer coisa.",
  "O CI/CD está vermelho desde terça. Sem pipeline verde, não tem entrega segura.",
  "Houve uma divergência de requisitos entre o que estava no Jira e o que foi discutido.",
  "Aguardei o design final antes de implementar. Retrabalho tem custo alto de context-switch.",
];

// ── Por que não foi à reunião ────────────────────────────────────────────────
const DESCULPAS_REUNIAO = [
  "Estou em uma reunião sobre reuniões para reduzir a quantidade de reuniões.",
  "Estava em uma call de alinhamento que se sobrepôs ao calendário por engano.",
  "O convite chegou sem link. Aguardei o reenvio, mas a reunião já havia encerrado.",
  "Achei que era opcional. A pauta não deixava claro que minha presença era crítica.",
  "Meu Wi-Fi caiu exatamente no horário. Tecnologia é um risco operacional real.",
  "Estava em modo deep work e o foco-mode do Slack bloqueou as notificações.",
  "Perdi o horário depois de uma daily que durou o dobro do previsto.",
  "Esqueci de aceitar o convite, mas estava ciente da pauta por e-mail.",
  "Meu calendário sincronizou com o fuso de outro país. Erro de configuração pessoal.",
  "A reunião foi marcada com menos de 24h de antecedência — não entrou no meu planejamento.",
];

// ── Por que não entregou ─────────────────────────────────────────────────────
const DESCULPAS_ENTREGA = [
  "Aguardando validação do guardiã do processo antes de avançar para o próximo milestone.",
  "Estou em modo de discovery. Ainda não chegamos à fase de delivery.",
  "A decisão está aguardando aprovação do comitê de governança de iniciativas.",
  "Aguardando o go/no-go da liderança sênior para destravar a execução.",
  "O ticket está em triagem. Priorização acontece nas sextas após as 17h.",
  "Não havia bandwidth suficiente para absorver mais demanda nessa sprint.",
  "O deploy está aguardando a janela de mudança aprovada pelo CAB.",
  "Estou em modo de escalonamento de prioridades após uma daily inesperadamente longa.",
  "Precisei pausar para não entregar algo que geraria retrabalho imediato.",
  "A story não tinha critérios de aceite definidos. Não dá para concluir o que não foi especificado.",
  "O cliente mudou o escopo na última hora. A entrega original ficou obsoleta.",
  "Precisei de mais um ciclo de revisão para garantir qualidade mínima de produção.",
];

// ── Por que está devagar ─────────────────────────────────────────────────────
const DESCULPAS_PRODUTIVIDADE = [
  "Estou triangulando informações de múltiplas áreas para garantir coerência de narrativa.",
  "Estou fazendo uma análise de impacto antes de qualquer movimentação técnica.",
  "Preciso de contexto adicional antes de gerar valor real nessa frente.",
  "Estou facilitando a transição de conhecimento entre times após a reestruturação.",
  "Estou sincronizando os OKRs do trimestre com as entregas do squad.",
  "Meu pipeline de tarefas está em revisão após o último sprint review.",
  "Estou em um processo de priorização baseado em valor de negócio versus esforço técnico.",
  "Estou recalibrando minha velocidade após absorver uma demanda urgente fora do sprint.",
  "Passei a manhã destravando um colega. Colaboração também é trabalho.",
  "A tarefa era mais complexa do que o estimado. Surpresas técnicas acontecem.",
  "Estou documentando a decisão para garantir rastreabilidade futura.",
  "Precisei revisar o código de outra pessoa antes de continuar a minha parte.",
];

// ── Genéricas corporativas ───────────────────────────────────────────────────
const DESCULPAS_GENERICAS = [
  "Estou em loop de alinhamento estratégico com stakeholders de alto impacto.",
  "O roadmap foi reestruturado e estou ressincronizando com as novas prioridades.",
  "Aguardando validação do guardiã do processo.",
  "Estou em modo discovery. Delivery vem na próxima sprint.",
  "Meu backlog pessoal foi impactado por uma iniciativa transversal não planejada.",
  "A iniciativa está em fase de análise de viabilidade técnica e de negócio.",
  "Preciso calibrar expectativas com os stakeholders antes de avançar.",
  "Há um gap entre o que foi comunicado e o que foi entendido. Estou investigando.",
  "Estou gerenciando o delta entre o planejado e o realizado com máxima atenção.",
  "A solução certa leva o tempo que leva. Velocidade sem qualidade é retrabalho.",
];

const TODAS_DESCULPAS = [
  ...DESCULPAS_ATRASO,
  ...DESCULPAS_REUNIAO,
  ...DESCULPAS_ENTREGA,
  ...DESCULPAS_PRODUTIVIDADE,
  ...DESCULPAS_GENERICAS,
];

type Categoria = {
  label: string;
  emoji: string;
  lista: string[];
};

const CATEGORIAS: Categoria[] = [
  { label: "Por que atrasou", emoji: "⏰", lista: DESCULPAS_ATRASO },
  { label: "Faltou à reunião", emoji: "📅", lista: DESCULPAS_REUNIAO },
  { label: "Não entregou", emoji: "📦", lista: DESCULPAS_ENTREGA },
  { label: "Está devagar", emoji: "🐢", lista: DESCULPAS_PRODUTIVIDADE },
  { label: "Genérica", emoji: "🎯", lista: DESCULPAS_GENERICAS },
];

function aleatorio<T>(lista: T[], excluir?: T): T {
  const opcoes = excluir !== undefined ? lista.filter((d) => d !== excluir) : lista;
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

export function GerarDesculpa() {
  const [aberto, setAberto] = useState(false);
  const [categoriaIdx, setCategoriaIdx] = useState(0);
  const [desculpa, setDesculpa] = useState("");
  const [copiado, setCopiado] = useState(false);

  const categoria = CATEGORIAS[categoriaIdx];

  function nova(idx?: number) {
    const cat = CATEGORIAS[idx ?? categoriaIdx];
    setDesculpa((atual) => aleatorio(cat.lista, atual));
    setCopiado(false);
  }

  function selecionarCategoria(idx: number) {
    setCategoriaIdx(idx);
    setDesculpa(aleatorio(CATEGORIAS[idx].lista));
    setCopiado(false);
  }

  function abrirModal() {
    const idx = Math.floor(Math.random() * CATEGORIAS.length);
    setCategoriaIdx(idx);
    setDesculpa(aleatorio(CATEGORIAS[idx].lista));
    setCopiado(false);
    setAberto(true);
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
        onClick={abrirModal}
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

            {/* Categorias */}
            <div className="mb-4 flex flex-wrap gap-2">
              {CATEGORIAS.map((cat, idx) => (
                <button
                  key={cat.label}
                  onClick={() => selecionarCategoria(idx)}
                  className="rounded-full border px-3 py-1 text-xs font-medium transition-all active:scale-95"
                  style={{
                    borderColor: idx === categoriaIdx ? "#8257ff" : "rgba(255,255,255,0.1)",
                    background: idx === categoriaIdx ? "linear-gradient(135deg,#8257ff,#ff6b2c)" : "rgba(255,255,255,0.05)",
                    color: idx === categoriaIdx ? "#fff" : "#9f96a9",
                  }}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Desculpa */}
            <div className="rounded-[20px] border border-white/8 bg-white/4 p-5 min-h-[90px] flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#ff6b2c] mb-3">
                {categoria.emoji} {categoria.label}
              </p>
              <p className="text-base leading-7 font-medium text-white">{desculpa}</p>
            </div>

            {/* Ações */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => nova()}
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
              {TODAS_DESCULPAS.length} desculpas disponíveis · Use com responsabilidade. Ou não.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
