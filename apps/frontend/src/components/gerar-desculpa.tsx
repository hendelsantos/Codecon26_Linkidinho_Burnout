"use client";

import { useState } from "react";

// ── Por que atrasou ──────────────────────────────────────────────────────────
const DESCULPAS_ATRASO = [
  "Estou em loop de alinhamento estratégico com stakeholders de alto impacto. Pode demorar mais uns dois trimestres.",
  "Minha entrega está bloqueada por dependências cross-funcionais que ninguém mapeou porque todo mundo estava em reunião sobre o mapa.",
  "O roadmap foi reestruturado pela quarta vez esse mês. Estou apenas esperando parar de se mover.",
  "Minha estimativa depende de uma estimativa que depende de outra estimativa. É estimativas até o fim.",
  "Aguardando aceite do PO, que aguarda aceite do cliente, que aguarda aprovação interna. Somos todos reféns.",
  "O ambiente de homologação caiu. O de desenvolvimento também. O de produção tá tremendo.",
  "Preferi não mergear em produção sem estabilidade. Aprendi isso da pior forma possível.",
  "Refatorei o contexto antes de avançar. Basicamente reconstruí a fundação da casa enquanto morava nela.",
  "Estava analisando o impacto lateral da mudança. Spoiler: impacta tudo.",
  "O CI/CD está vermelho desde terça. Já mandei mensagem pro DevOps. Aguardando retorno da mensagem do colega que mandou mensagem pro DevOps.",
  "Houve uma divergência de requisitos entre o Jira, o que foi discutido e o que existe de fato no universo.",
  "Aguardei o design final. O design final ainda não chegou. Mas dessa vez é definitivo, juro.",
  "Tentei, mas o sistema legado reagiu como sempre reage: em silêncio e com rancor.",
  "Tive um bloqueio criativo durante o refinamento. Ou um momento de lucidez. Difícil dizer.",
  "A task era simples no Jira. No mundo real era um thriller psicológico.",
];

// ── Por que não foi à reunião ────────────────────────────────────────────────
const DESCULPAS_REUNIAO = [
  "Estou em uma reunião sobre reuniões para reduzir reuniões. É uma das mais longas que já participei.",
  "O convite chegou sem link, sem pauta e com apenas três minutos de antecedência. Dei prioridade à minha saúde mental.",
  "Achei que era opcional. A pauta dizia 'alinhamento' — palavra que aprendi a tratar como opcional.",
  "Meu Wi-Fi caiu exatamente no horário. Tecnologia é um risco operacional com timing perfeito.",
  "Estava em modo deep work com foco-mode ativo. Levo produtividade a sério quando é conveniente.",
  "Perdi o horário depois de uma daily que virou um planejamento que virou um workshop improvisado.",
  "Entrei na reunião errada e só percebi vinte minutos depois. Contribuí bem mesmo assim.",
  "Meu calendário sincronizou com o fuso de Tóquio. Técnico erro humano.",
  "A reunião foi marcada com menos de 24h de antecedência, contrariando nossa política interna que ninguém leu mas todos conhecem.",
  "Estava priorizando uma entrega que a mesma pessoa que marcou a reunião pediu com urgência.",
  "Achei que seria gravada. Estava esperando o link da gravação para assistir em 2x.",
  "Participei espiritualmente. Meu coração estava lá.",
  "Me perdi no Zoom depois de entrar na sala errada de uma empresa que não conheço. Foi constrangedor para todo mundo.",
  "Estava em outra call que também não tinha pauta e também terminou atrasada.",
];

// ── Por que não entregou ─────────────────────────────────────────────────────
const DESCULPAS_ENTREGA = [
  "Aguardando validação do guardião do processo, que aguarda o guardião do guardião.",
  "Estou em modo discovery. Delivery é uma fase posterior. Estamos apenas começando a fase do discovery.",
  "A decisão aguarda aprovação do comitê de governança, que se reúne trimestralmente. Estamos no início do trimestre.",
  "O ticket está em triagem há 11 dias. O sistema de priorização está sendo priorizado.",
  "Não havia bandwidth suficiente. Minha sprint estava 340% ocupada, o que segundo o scrum é impossível.",
  "O deploy aguarda a janela de mudança do CAB, que aprova janelas toda segunda, mas essa segunda foi feriado.",
  "A story não tinha critérios de aceite. Concluir o indefinido é filosoficamente arriscado.",
  "O cliente mudou o escopo. Depois mudou de volta. Depois mudou de novo. Agora não sabemos o que queremos.",
  "Precisei de mais um ciclo de revisão. E mais um. E provavelmente mais um depois desse.",
  "A entrega estava 98% pronta há três semanas. Os últimos 2% exigem reescrever os 98% anteriores.",
  "Estava esperando o ambiente subir para validar. O ambiente subiu. Caiu. Subiu. Caiu. Estou monitorando.",
  "Há uma dependência de terceiro que nos informou que tem uma dependência de um quarto que sumiu.",
  "O MVP foi aprovado. Mas aí pediram mais features pro MVP. O MVP cresceu. Agora é um MMP: Mínimo Mas Pesado.",
  "Tecnicamente entreguei. O que não funciona ainda é uma questão de perspectiva.",
];

// ── Por que está devagar ─────────────────────────────────────────────────────
const DESCULPAS_PRODUTIVIDADE = [
  "Estou triangulando informações de múltiplas áreas que não se falam entre si e não planejam fazer isso.",
  "Preciso de contexto adicional antes de gerar valor. Já pedi o contexto. Aguardo o contexto do contexto.",
  "Estou facilitando a transição de conhecimento após a reestruturação. Basicamente ensinando do zero após demitir quem sabia.",
  "Estou sincronizando os OKRs do trimestre com o que a gente realmente faz. É uma obra de ficção científica.",
  "Passei a manhã destravando colega. Colaboração também é trabalho, especialmente quando gera print pra reunião.",
  "A tarefa era mais complexa do que o estimado. O estimado foi feito em dois minutos numa reunião de priorização.",
  "Estou documentando. Ninguém vai ler, mas vai existir.",
  "Estou recalibrando minha velocidade após absorver três urgências simultâneas marcadas com a mesma prioridade máxima.",
  "Fui interrompido 14 vezes hoje. O deep work teórico da empresa e o deep work prático são paralelos que não se encontram.",
  "Estou gerenciando o delta entre o planejado e o realizado. O delta tem tamanho de continente.",
  "Minha to-do list cresceu mais rápido do que consegui trabalhar nela. É um problema de escala.",
  "Estava em uma reunião sobre como ser mais produtivos. Demorou três horas.",
];

// ── Marketing & Comunicação ──────────────────────────────────────────────────
const DESCULPAS_MARKETING = [
  "O brand book foi atualizado essa manhã. Precisei rever tudo o que fiz esse mês.",
  "Estamos num processo de reposicionamento de marca. Por enquanto nada pode sair.",
  "A copy estava ótima, mas o stakeholder queria algo mais 'pop mas sofisticado, porém acessível'.",
  "O briefing chegou com 'urgente' no assunto e sem nenhum dado de referência.",
  "A imagem foi reprovada pela jurídica por causa de uma fonte que lembra outra empresa de outro país.",
  "Estamos em período de silêncio antes do lançamento. Silêncio total. Até internamente.",
  "A campanha está pausada porque o produto ainda não foi aprovado pela área que aprova produtos.",
  "Precisamos de mais dados para validar a persona antes de criar mais conteúdo para a persona.",
  "O calendário editorial foi refeito após a reestruturação. O novo calendário está sendo calendáriado.",
  "A reunião de aprovação de criativo durou quatro horas e chegamos à conclusão de fazer outro briefing.",
  "A hashtag escolhida tinha contexto problemático em outro país. Encontrei isso às 23h de ontem.",
  "Estamos aguardando o benchmark da concorrência que está aguardando o nosso benchmark.",
];

// ── RH / People ──────────────────────────────────────────────────────────────
const DESCULPAS_RH = [
  "Estou processando o offboarding emocional de um colaborador que ninguém esperava que saísse.",
  "Estamos em ciclo de avaliação de performance, o que impossibilita qualquer outra avaliação de qualquer coisa.",
  "A política de home office foi atualizada. Agora ninguém entende quando tem que vir e quando não tem.",
  "Estamos construindo cultura. Cultura leva tempo. Muito tempo. Possivelmente gerações.",
  "A vaga foi aprovada em headcount, bloqueada pelo financeiro, desaprovada, reaprovada e está em revisão de nível.",
  "Estamos em processo seletivo para a posição que destravaria tudo. A entrevista final é semana que vem.",
  "O treinamento obrigatório consumiu a semana de todo mundo. Inclusive a minha.",
  "Estamos revisando o plano de cargos e salários. Por enquanto, nenhum cargo e salário pode ser discutido.",
  "Estou facilitando um workshop de engajamento para um time que está claramente desengajado com o workshop.",
  "A pesquisa de clima revelou um clima que preferimos não detalhar publicamente.",
  "Estamos em processo de People Analytics. Temos dados de tudo exceto do que precisamos.",
  "O onboarding do novo colaborador consumiu minha semana. Ele pediu demissão na sexta.",
];

// ── Financeiro / Controladoria ───────────────────────────────────────────────
const DESCULPAS_FINANCEIRO = [
  "Estamos em fechamento de mês. Durante o fechamento, nenhuma decisão financeira pode ser tomada.",
  "O orçamento foi aprovado mas o remanejamento está pendente de aprovação de quem aprovou o orçamento.",
  "A rubrica correta para essa despesa ainda está sendo classificada. São só seis opções.",
  "O sistema de ERP atualizou e perdemos três dias entendendo o que mudou e o que quebrou.",
  "A auditoria está em andamento. Estamos em modo de preservação total de evidências.",
  "O centro de custo foi alterado e agora nada bate com o que foi lançado no mês passado.",
  "Estamos aguardando o board para aprovar uma despesa que não estava no orçamento aprovado pelo board.",
  "O forecast foi refeito. O novo forecast já está desatualizado. Estamos refazendo.",
  "A conciliação bancária tem uma diferença de R$0,01 que estamos investigando desde terça-feira.",
  "Estamos em due diligence. Posso confirmar que está ocorrendo. Não posso confirmar mais nada.",
];

// ── Comercial / Vendas ───────────────────────────────────────────────────────
const DESCULPAS_COMERCIAL = [
  "O cliente está em período de silêncio desde a última proposta. Estou respeitando o silêncio.",
  "A proposta foi enviada, aprovada verbalmente e está aguardando assinatura há quarenta e dois dias.",
  "Estamos em processo de descoberta das necessidades reais do cliente que nos disse claramente o que quer.",
  "O desconto precisa de aprovação de três níveis hierárquicos acima de quem vai dar o desconto.",
  "O lead estava quente. Esfriou entre uma reunião e outra. Vou reaquecê-lo com mais uma reunião.",
  "Estou em processo de nurturing. Estou nutrindo há oito meses.",
  "O contrato está com jurídico dos dois lados. Prevejo assinatura para o próximo trimestre, no otimismo.",
  "Perdi o negócio para um concorrente que deu o mesmo produto pela metade do preço. Isso é ilegal ou é estratégia?",
  "Estou construindo o relacionamento. O relacionamento vai ser construído. Talvez em 2027.",
  "O cliente disse 'vamos avançar' e sumiu. Estou interpretando como um 'sim' em andamento.",
  "Atingi a meta. A meta foi revista pra cima no mesmo dia. Agora não atingi mais.",
];

// ── TI / Infra ───────────────────────────────────────────────────────────────
const DESCULPAS_TI = [
  "O servidor reiniciou sozinho às 3h da manhã. Ninguém sabe por quê. Inclusive o servidor.",
  "O backup existia. Restaurar o backup, porém, é uma outra história.",
  "Atualizei o sistema. Tudo que dependia do sistema antigo parou de funcionar. Isso era esperado mas não planejado.",
  "O ticket está aberto. O SLA é de 72 horas. São 71 horas e 58 minutos. Estou monitorando.",
  "A licença expirou às 9h da manhã de uma segunda-feira. Coincidência ou karma?",
  "O fornecedor garantiu que o sistema estava 100% estável antes de entrar em colapso total.",
  "Estamos sofrendo um problema intermitente que nunca acontece na nossa frente.",
  "A VPN funciona para algumas pessoas, algumas horas, em algumas condições que não conseguimos replicar.",
  "Testei em desenvolvimento, homologação e staging. Produção é um ambiente com personalidade própria.",
  "O e-mail chegou na caixa de spam de todo mundo ao mesmo tempo. Incluindo a do CEO.",
  "O datacenter teve 'manutenção não planejada'. Linguagem corporativa para 'algo explodiu'.",
];

const TODAS_DESCULPAS = [
  ...DESCULPAS_ATRASO,
  ...DESCULPAS_REUNIAO,
  ...DESCULPAS_ENTREGA,
  ...DESCULPAS_PRODUTIVIDADE,
  ...DESCULPAS_MARKETING,
  ...DESCULPAS_RH,
  ...DESCULPAS_FINANCEIRO,
  ...DESCULPAS_COMERCIAL,
  ...DESCULPAS_TI,
];

type Categoria = {
  label: string;
  emoji: string;
  lista: string[];
};

const CATEGORIAS: Categoria[] = [
  { label: "Atrasou",       emoji: "⏰", lista: DESCULPAS_ATRASO },
  { label: "Reunião",       emoji: "📅", lista: DESCULPAS_REUNIAO },
  { label: "Não entregou",  emoji: "📦", lista: DESCULPAS_ENTREGA },
  { label: "Lento",         emoji: "🐢", lista: DESCULPAS_PRODUTIVIDADE },
  { label: "Marketing",     emoji: "📣", lista: DESCULPAS_MARKETING },
  { label: "RH",            emoji: "🧑‍💼", lista: DESCULPAS_RH },
  { label: "Financeiro",    emoji: "💰", lista: DESCULPAS_FINANCEIRO },
  { label: "Comercial",     emoji: "🤝", lista: DESCULPAS_COMERCIAL },
  { label: "TI / Infra",    emoji: "🖥️", lista: DESCULPAS_TI },
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
