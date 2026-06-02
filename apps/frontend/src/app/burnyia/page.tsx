"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bot, Plus, Send, SquarePen, ChevronLeft, Sparkles } from "lucide-react";

// ─── Banco de respostas ───────────────────────────────────────────────────────

const RESPOSTAS_AUMENTO = [
  `**Ah, a questão do aumento.** Uma das mais antigas da corporação.

O momento ideal para pedir aumento é:

- **Após uma conquista expressiva** — espere 3 a 6 meses para "o momento certo"
- **No início do ano** — mas o budget já foi fechado em outubro
- **No meio do ano** — estamos em "ciclo de revisão de metas"
- **No final do ano** — "período de festas, melhor conversar em janeiro"
- **Em janeiro** — "acabamos de fechar o planejamento, difícil agora"

**Minha recomendação estratégica™:** Agende uma 1:1. Prepare um deck com suas entregas. Ouça "você está no radar" com serenidade. Aguarde 18 meses. Repita.

*Alternativa não oficial: LinkedIn aberto em aba discreta funciona igualmente bem.*`,

  `**Excelente iniciativa de autodesenvolvimento profissional.**

Antes de pedir aumento, certifique-se de que:

1. Você tem um "momento de impacto" documentado
2. O gestor está de bom humor (raro, mas acontece)
3. A empresa não está em "momento de reestruturação" (sempre está)
4. Você não pediu nada nos últimos 24 meses
5. Mercúrio não está retrógrado

**Se tudo isso estiver alinhado:** marque uma conversa. Use as palavras "valor entregue", "mercado" e "crescimento conjunto". Sorria.

**Taxa histórica de sucesso:** 12%. Os outros 88% recebem um título diferente sem aumento.`,
];

const RESPOSTAS_CHEFE = [
  `**Entendo sua situação com profundidade empática.**

Líderes que geram esse tipo de sentimento geralmente apresentam uma das seguintes características:

- **O Micromanager:** sabe como você deve respirar durante o stand-up
- **O Fantasma:** presente nas reuniões, ausente nas decisões
- **O Urgentista:** tudo é P0, inclusive o Happy Hour obrigatório
- **O Teflão:** problemas nunca grudam nele, só em você
- **O Visionário Sem Norte:** pivota a estratégia a cada segunda-feira

**Minha recomendação:** documente tudo. Responda e-mails com cópia. Mantenha o histórico de conversas. Um dia isso vai ser útil — seja na conversa de feedback, seja no processo trabalhista.

*Esse conselho foi gerado por uma IA. Não constitui assessoria jurídica.*`,

  `**Situação delicada. Vamos mapear os cenários.**

**Cenário A — Conversa direta:** Você expõe o problema de forma estruturada e empática. Ele concorda, nada muda.

**Cenário B — Feedback 360:** Você usa o processo anônimo da empresa. Ele descobre que foi você. Nada muda, mas agora tem clima.

**Cenário C — Esperar passar:** Gestores têm prazo de validade. Média de permanência no cargo: 2.3 anos. Calcule quanto tempo falta.

**Cenário D — Você sai primeiro:** Estatisticamente, a opção mais usada e mais efetiva.

Qual cenário você deseja explorar com mais detalhes?`,
];

const RESPOSTAS_REUNIAO = [
  `**Análise de reunião iniciada.**

Com base nos dados disponíveis, 73% das reuniões corporativas se enquadram em uma dessas categorias:

1. **A reunião que era um e-mail** — durou 1h, poderia ter sido 3 linhas
2. **A reunião sobre a reunião** — para alinhar antes de alinhar
3. **A reunião sem pauta** — convite com 10 min de antecedência, "é rapidinho"
4. **A reunião de atualização** — todos reportam status que estão no Jira
5. **A atualização estratégica trimestral** — slides de 87 páginas, você só precisava do slide 3

**O que fazer:** Peça a pauta antes. Se não houver pauta, peça. Se não houver mesmo assim, você já tem sua resposta.

*Taxa de reuniões necessárias identificadas pela BurnyIA: 27%.*`,

  `**"Pode ser rapidinho" — análise preditiva.**

Histórico de reuniões iniciadas com "pode ser rapidinho":

- **Duração média declarada:** 15 minutos
- **Duração média real:** 58 minutos
- **Presença de pauta:** 8% dos casos
- **Resultado documentado:** 3% dos casos
- **Probabilidade de gerar outra reunião:** 91%

**Recomendação:** Se a reunião não tiver pauta, objetivo claro e lista de participantes justificada — você tem o direito moral (não jurídico) de declinar.

Quer que eu gere uma desculpa profissional para não ir?`,
];

const RESPOSTAS_BURNOUT = [
  `**Diagnóstico preliminar: Burnout Avançado.**

Os sintomas que você descreve são consistentes com o que chamamos de **"Síndrome da Dedicação Institucionalizada"** — quando você trabalha tanto que o trabalho virou personalidade.

**Sinais clássicos:**
- Checar Slack antes de sair da cama ✓
- Sentir culpa no fim de semana ✓  
- Não lembrar o que fazia antes do trabalho existir ✓
- Achar que descansar é "improdutivo" ✓

**Minha recomendação terapêutica™:**

1. Fechar o computador no horário
2. Não responder mensagem fora do expediente
3. Tirar as férias que você tem direito

*Probabilidade de seguir esse conselho: 4%.*

Mas vale tentar.`,

  `**Você chegou ao lugar certo.**

Burnout corporativo tem estágios. Veja onde você está:

**Estágio 1 — Negação:** "Tô bem, só um pouco cansado"
**Estágio 2 — Adaptação:** "Isso é normal, todo mundo tá assim"
**Estágio 3 — Institucionalização:** "Faz parte da entrega de valor"
**Estágio 4 — Transcendência:** você nem sente mais nada, só executa

**O que isso significa?** Que você chegou a um patamar de performance que a empresa vai chamar de "dedicação acima da média" no seu feedback semestral — enquanto não aumenta o salário.

Você precisa de descanso real. Não de um long weekend. Férias. Desconectado. Para fazer absolutamente nada por um período que parece "longo demais" mas tecnicamente é o mínimo.

*Dica extra: quem cria conta no BurnyOut tem acesso a uma comunidade inteira de pessoas que também estão no estágio 3. Solidariedade coletiva é subestimada.*`,
];

const RESPOSTAS_LINKEDIN = [
  `**LinkedIn. O teatro das competências.**

Posso te ajudar com várias estratégias:

**Para o perfil:**
- Título com pelo menos 3 palavras que ninguém entende
- "Apaixonado por inovação" obrigatório
- Foto com fundo desfocado ou em frente a um prédio de vidro

**Para posts de alto engajamento:**
- "3 anos atrás fui demitido. Hoje sou CEO."
- "Recusei uma oferta de R$50k por mês por algo maior que dinheiro" 
- "Humildade é tudo" (poste isso depois de receber um prêmio)

**Gatilhos que geram curtidas:** superação, fracasso transformado em lição, gratidão para com a empresa que te demitiu.

Quer que eu gere um título profissional para você?`,
];

const RESPOSTAS_FERIAS = [
  `**Férias. O conceito mais teórico do mercado de trabalho.**

Análise baseada em dados reais:

- **Dias de férias disponíveis:** 30
- **Dias que você vai realmente tirar:** 8 (em um feriado prolongado)
- **Dias que você vai checar o e-mail nas "férias":** todos
- **Dias que você vai voltar descansado:** 0

**O ciclo clássico:**
1. Agenda férias com 3 meses de antecedência
2. Aparece um projeto urgente 2 semanas antes
3. Você "ajusta" as férias para depois
4. As férias vencem

**Minha recomendação:** Bloqueie o calendário. Avise com antecedência. Coloque resposta automática. Desligue o celular corporativo.

Isso é literalmente seu direito trabalhista. Mas eu sei que você não vai fazer isso.`,
];

const RESPOSTAS_FINGIR = [
  `**Ah, a arte de parecer ocupado™.**

Um guia avançado:

**Nível 1 — Básico:**
- Manter várias abas abertas (planilha + Teams sempre visível)
- Expressão levemente concentrada
- Responder mensagens com 12 min de delay (muito rápido parece suspeito)

**Nível 2 — Intermediário:**
- Andar com um caderno pelo escritório com cara de quem está "indo resolver algo"
- Usar fones de ouvido (sinaliza "em foco")
- Colocar status "em reunião" estrategicamente

**Nível 3 — Avançado:**
- Mandar e-mail às 7h da manhã (pode ter sido agendado na véspera)
- Comentar no Slack de outros projetos para "aparecer"
- Participar de reuniões que não precisam de você "para acompanhar o contexto"

*Aviso: isso não é um conselho de produtividade. É arqueologia corporativa.*`,
];

const RESPOSTAS_DEMISSAO = [
  `**Análise de cenário: desligamento.**

Seja você pensando em sair ou tendo sido desligado, deixa eu clarear algumas coisas:

**Se você foi demitido:**
- A empresa não te demitiu, ela "otimizou o headcount"
- Você não foi mandado embora, "seu ciclo se encerrou"
- Não é nada pessoal. É estratégico. O que é a mesma coisa, mas soa melhor.

**Se você quer sair:**
Dicas para uma saída digna:
1. Não avise com mais de 2 semanas (vira janitor do seu próprio legado)
2. Não fale mal de ninguém (vai trabalhar com eles de novo em outra empresa)
3. Prepare o LinkedIn antes de contar para o RH

  `**O mercado está aquecido?** Sempre está e nunca está. Depende de quem pergunta.

*Entre para o BurnyOut e veja como outros profissionais estão navegando esse momento. Às vezes ajuda saber que não é só você.*`,
];

const RESPOSTAS_GENERICAS = [
  `**Processando sua solicitação corporativa™...**

Com base no meu treinamento em 847.000 e-mails corporativos, 2.3 milhões de reuniões e uma quantidade não auditável de decks de PowerPoint, aqui está minha análise:

O que você está descrevendo é um fenômeno bastante comum nas organizações modernas. Chamo de **"ambiguidade estrutural produtiva"** — quando o problema existe, todos sabem, mas ninguém é oficialmente responsável por resolver.

**O que geralmente acontece:**
1. O problema é identificado em uma reunião
2. Vira um item de backlog
3. O dono do item muda
4. O backlog é "repriorizado"
5. O problema continua existindo, agora com um nome mais bonito

Posso ajudar você a formular isso de uma maneira que soe como solução sem necessariamente ser uma. É minha especialidade.`,

  `**Excelente ponto de partida para uma discussão estratégica.**

Antes de responder, deixa eu entender melhor o contexto:

- Você está em modo de **discovery** ou já passou para **delivery**?
- Existe um **stakeholder** claro com poder de decisão?
- A situação tem um **SLA** definido ou está em fluxo aberto?

Pergunto porque minha resposta vai ser diferente dependendo do **grau de urgência percebida** versus o **impacto real no negócio** — que, na maioria das empresas, são inversamente proporcionais.

Pode me dar mais contexto? Ou posso gerar uma resposta genérica que vai soar bem em qualquer cenário.`,

  `**Análise concluída com 94.7% de confiança.**

O que você está vivenciando é o que identifico como **"Ciclo de Frustração Organizacional Recorrente"** — quando o mesmo problema aparece, é discutido, e volta exatamente como estava depois de uma reunião de alinhamento.

**Boas notícias:** você não está sozinho. 87% dos profissionais que consultam a BurnyIA relatam situação similar.

**Más notícias:** saber que não está sozinho não resolve o problema.

**Minha recomendação:** documente tudo, alinhe expectativas por escrito, e mantenha o LinkedIn atualizado. Não necessariamente nessa ordem.

*Essa resposta foi gerada em 0.3 segundos. A implementação real vai levar pelo menos um trimestre.*`,

  `**Entendo. Isso é mais comum do que parece.**

O ambiente corporativo tem uma característica singular: transforma problemas simples em processos complexos, e processos complexos em reuniões sem fim.

O que você está descrevendo provavelmente se enquadra em um desses padrões:

- **Falta de clareza de responsabilidade** — todos sabem o que precisa ser feito, ninguém é dono
- **Excesso de processos** — a burocracia cresce mais rápido que as entregas
- **Comunicação fragmentada** — cada área fala uma língua diferente e ninguém traduz

A solução? Depende do seu nível de energia disponível para burocracia.

Posso te ajudar a navegar isso de forma estratégica — ou pelo menos a escrever um e-mail que pareça estratégico.`,
];

const HISTORICO_FALSO = [
  "Como pedir aumento sem parecer ganancioso",
  "Desculpa para não ir à reunião de 4h",
  "Meu chefe não me dá feedback",
  "Como fingir trabalhar home office",
  "Vale a pena virar CLT?",
  "Me demiti e me arrependei",
  "Burnout ou preguiça?",
  "Como sobreviver ao open space",
  "Carta de demissão criativa",
  "Meu LinkedIn tá horrível",
];

const SUGESTOES_INICIAIS = [
  { emoji: "💰", texto: "Como pedir aumento sem ser ignorado?" },
  { emoji: "😤", texto: "Meu chefe não me entende. O que fazer?" },
  { emoji: "🔥", texto: "Estou em burnout. Por onde começo?" },
  { emoji: "📅", texto: "Como escapar de uma reunião inútil?" },
  { emoji: "🕵️", texto: "Técnicas avançadas de parecer ocupado" },
  { emoji: "💼", texto: "Quero pedir demissão. Me ajuda?" },
];

function gerarResposta(mensagem: string): string {
  const msg = mensagem.toLowerCase();

  if (/aumento|sal[aá]rio|remunera|compensa/i.test(msg))
    return RESPOSTAS_AUMENTO[Math.floor(Math.random() * RESPOSTAS_AUMENTO.length)];
  if (/chefe|gestor|l[ií]der|boss|superior|gerente/i.test(msg))
    return RESPOSTAS_CHEFE[Math.floor(Math.random() * RESPOSTAS_CHEFE.length)];
  if (/reuni[aã]o|meeting|call|stand.?up|daily/i.test(msg))
    return RESPOSTAS_REUNIAO[Math.floor(Math.random() * RESPOSTAS_REUNIAO.length)];
  if (/burnout|cansado|esgotado|exausto|n[aã]o aguento|sofrendo/i.test(msg))
    return RESPOSTAS_BURNOUT[Math.floor(Math.random() * RESPOSTAS_BURNOUT.length)];
  if (/linkedin|perfil|curriculo|currículo/i.test(msg))
    return RESPOSTAS_LINKEDIN[Math.floor(Math.random() * RESPOSTAS_LINKEDIN.length)];
  if (/f[eé]rias|descanso|folga|licen/i.test(msg))
    return RESPOSTAS_FERIAS[Math.floor(Math.random() * RESPOSTAS_FERIAS.length)];
  if (/fingir|ocioso|ocupado|preguiça|home.?office|remoto/i.test(msg))
    return RESPOSTAS_FINGIR[Math.floor(Math.random() * RESPOSTAS_FINGIR.length)];
  if (/demiss[aã]o|demitir|sair|largar|resign|desligar/i.test(msg))
    return RESPOSTAS_DEMISSAO[Math.floor(Math.random() * RESPOSTAS_DEMISSAO.length)];

  return RESPOSTAS_GENERICAS[Math.floor(Math.random() * RESPOSTAS_GENERICAS.length)];
}

// Renderiza **negrito** e listas simples
function RenderMarkdown({ texto }: { texto: string }) {
  const linhas = texto.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {linhas.map((linha, i) => {
        if (!linha.trim()) return <div key={i} className="h-2" />;

        const bold = linha.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

        if (linha.startsWith("- ") || linha.match(/^\d+\./)) {
          return (
            <div
              key={i}
              className="flex gap-2"
              dangerouslySetInnerHTML={{
                __html: `<span class="text-violet/60 shrink-0 mt-0.5">•</span><span>${bold.replace(/^[-\d.]\s*/, "")}</span>`,
              }}
            />
          );
        }

        if (linha.startsWith("*") && linha.endsWith("*")) {
          return (
            <p key={i} className="text-xs italic text-white/40">
              {linha.replace(/^\*|\*$/g, "")}
            </p>
          );
        }

        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: bold }}
          />
        );
      })}
    </div>
  );
}

// ─── CTA de cadastro ─────────────────────────────────────────────────────────

function CTACadastro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="ml-11 mt-2 flex items-center gap-3 rounded-xl border border-violet/25 bg-violet/[0.07] px-4 py-3"
    >
      <Sparkles size={16} className="shrink-0 text-violet" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-white/80">
          Quer enfrentar o burnout com dignidade?
        </p>
        <p className="text-[11px] text-white/40">
          A BurnyIA sabe muito, mas a plataforma sabe mais. Crie sua conta gratuita.
        </p>
      </div>
      <Link
        href="/cadastro"
        className="shrink-0 rounded-lg bg-violet px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-violet/80"
      >
        Criar conta
      </Link>
    </motion.div>
  );
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Mensagem = { role: "user" | "ai"; texto: string; id: number };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BurnyIAChatPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [digitando, setDigitando] = useState(false);
  const [textoDigitado, setTextoDigitado] = useState("");
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, textoDigitado]);

  const enviar = async (texto: string) => {
    if (!texto.trim() || digitando) return;

    const userMsg: Mensagem = { role: "user", texto: texto.trim(), id: idRef.current++ };
    setMensagens((m) => [...m, userMsg]);
    setInput("");
    setDigitando(true);
    setTextoDigitado("");

    await new Promise<void>((r) => setTimeout(r, 600 + Math.random() * 600));

    const resposta = gerarResposta(texto);
    let i = 0;
    const interval = setInterval(() => {
      i += 3; // velocidade de digitação (chars por tick)
      setTextoDigitado(resposta.slice(0, i));
      if (i >= resposta.length) {
        clearInterval(interval);
        setTextoDigitado("");
        setMensagens((m) => [...m, { role: "ai", texto: resposta, id: idRef.current++ }]);
        setDigitando(false);
      }
    }, 18);
  };

  const novaConversa = () => {
    setMensagens([]);
    setTextoDigitado("");
    setDigitando(false);
    setInput("");
    setSidebarAberta(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar(input);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0b14] text-white">
      {/* ── Sidebar overlay mobile ── */}
      <AnimatePresence>
        {sidebarAberta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarAberta(false)}
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/8 bg-[#070810] transition-transform lg:relative lg:translate-x-0 ${
          sidebarAberta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header sidebar */}
        <div className="flex items-center justify-between p-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-white">
              Burny<span className="text-violet">IA</span>
            </span>
          </Link>
          <button
            onClick={novaConversa}
            title="Nova conversa"
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <SquarePen size={16} />
          </button>
        </div>

        {/* Nova conversa */}
        <div className="px-3 pb-2">
          <button
            onClick={novaConversa}
            className="flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Plus size={14} />
            Nova conversa
          </button>
        </div>

        {/* Histórico */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Recentes
          </p>
          <div className="flex flex-col gap-0.5">
            {HISTORICO_FALSO.map((h, i) => (
              <button
                key={i}
                onClick={novaConversa}
                className="truncate rounded-lg px-3 py-2 text-left text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Footer sidebar */}
        <div className="border-t border-white/8 p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet text-xs font-bold">
              B
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white/80">BurnyIA Pro™</p>
              <p className="text-[10px] text-white/30">Plano: Sofrimento Ilimitado</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header mobile */}
        <header className="flex items-center justify-between border-b border-white/8 px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarAberta(true)}
            className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold">
            Burny<span className="text-violet">IA</span>
          </span>
          <button onClick={novaConversa} className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white">
            <SquarePen size={16} />
          </button>
        </header>

        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto">
          {mensagens.length === 0 && !digitando ? (
            /* Tela de boas-vindas */
            <div className="flex h-full flex-col items-center justify-center px-4 py-12">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet/20">
                <Bot size={32} className="text-violet" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                Por onde sofremos hoje?
              </h1>
              <p className="mb-10 text-center text-sm text-white/40">
                Sou o BurnyIA. Sei tudo sobre o ambiente corporativo e não vou te julgar.
                <br />
                Muito.
              </p>

              <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {SUGESTOES_INICIAIS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => enviar(s.texto)}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <span className="text-lg leading-none">{s.emoji}</span>
                    <span className="text-sm text-white/70 leading-snug">{s.texto}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat messages */
            <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
              {mensagens.map((msg) => (
                <div key={msg.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet/20 mt-1">
                        <Bot size={16} className="text-violet" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-violet text-white"
                          : "rounded-bl-sm bg-white/[0.06] text-white/85"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        <RenderMarkdown texto={msg.texto} />
                      ) : (
                        <p className="text-sm leading-relaxed">{msg.texto}</p>
                      )}
                    </div>
                  </motion.div>
                  {msg.role === "ai" && <CTACadastro />}
                </div>
              ))}

              {/* Digitando */}
              {digitando && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet/20 mt-1">
                    <Bot size={16} className="text-violet" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white/[0.06] px-4 py-3">
                    {textoDigitado ? (
                      <RenderMarkdown texto={textoDigitado} />
                    ) : (
                      <div className="flex gap-1 py-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-white/40"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* ── Input bar ── */}
        <div className="border-t border-white/8 px-4 py-4">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-end gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 focus-within:border-violet/40">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte alguma coisa corporativa..."
                rows={1}
                disabled={digitando}
                className="flex-1 resize-none bg-transparent text-sm text-white placeholder-white/30 outline-none disabled:opacity-50"
                style={{ maxHeight: "120px" }}
              />
              <button
                onClick={() => enviar(input)}
                disabled={digitando || !input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet text-white transition-all hover:bg-violet/80 disabled:opacity-30"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-white/20">
              BurnyIA pode cometer erros. Especialmente sobre produtividade e felicidade corporativa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
