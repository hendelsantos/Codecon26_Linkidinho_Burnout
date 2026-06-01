"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api";

// ─── Dados ────────────────────────────────────────────────────────────────────

const DESTINOS_ROLETA = [
  { emoji: "😱", text: "Reunião surpresa sem pauta", sub: "\"É rapidinho, 10 minutinhos.\" (durou 2h)" },
  { emoji: "😰", text: "RH quer bater um papo", sub: "\"Pode ser às 17h55 de hoje?\"" },
  { emoji: "🏝️", text: "Gestor entrou de férias hoje", sub: "Você acaba de assumir a equipe dele também." },
  { emoji: "🚨", text: "Deadline antecipado em 5 dias", sub: "\"O cliente pediu. A gente prometeu. Boa sorte.\"" },
  { emoji: "📄", text: "Apresentação urgente pro diretor", sub: "São 16h58. Reunião: 17h. Formato: PowerPoint." },
  { emoji: "🤯", text: "Projeto novo sem briefing nem orçamento", sub: "\"Você tem criatividade, não tem?\"" },
  { emoji: "☕", text: "Café acabou E a máquina quebrou", sub: "Produtividade: encerrada. Civilização: ameaçada." },
  { emoji: "📞", text: "Ligação do cliente no horário de almoço", sub: "\"Só uma dúvidinha rápida de 45 minutos.\"" },
  { emoji: "🎉", text: "Você foi promovido!", sub: "...sem aumento. Mas tem mais responsabilidade!" },
  { emoji: "🕐", text: "Reunião matinal às 7h30", sub: "\"Para alinhar antes do trabalho começar.\"" },
  { emoji: "🤖", text: "Colega usou IA e entregou pior", sub: "Você tem que consertar. E não pode falar nada." },
  { emoji: "🔔", text: "LinkedIn notificando sua própria vaga", sub: "A mesma vaga que você já ocupa." },
  { emoji: "🧟", text: "Reunião pós-reunião de alinhamento", sub: "Para discutir o que foi discutido na reunião anterior." },
  { emoji: "📊", text: "Apresentação pro CEO amanhã às 8h", sub: "\"Você sabe fazer em PowerPoint, né? Legal.\"" },
  { emoji: "📧", text: "E-mail encadeado com 47 pessoas em cópia", sub: "\"Apenas respondendo a todos.\"" },
  { emoji: "💀", text: "Relatório mensal com dado errado descoberto pelo CEO", sub: "Na frente de todo mundo. Ao vivo." },
  { emoji: "🔄", text: "Projeto pausado pela 3ª vez este trimestre", sub: "\"Mas agora é prioridade máxima de verdade.\"" },
  { emoji: "🎪", text: "Treinamento obrigatório de 8 horas", sub: "Sobre algo que você já faz há 5 anos." },
  { emoji: "📋", text: "Auditoria surpresa amanhã de manhã", sub: "\"Os documentos estão todos em dia, né?\" (não estão)" },
  { emoji: "🧠", text: "Workshop de inovação com post-its", sub: "Resultado: mais uma reunião para discutir os post-its." },
  { emoji: "💸", text: "Corte de budget aprovado", sub: "Justamente no seu projeto. No dia do lançamento." },
  { emoji: "🥳", text: "Confraternização obrigatória na sexta às 19h", sub: "\"Vai ser demitido quem não aparecer.\" (subtexto)" },
];

const TRADUCOES: [string, string][] = [
  ["não sei fazer isso", "vou precisar de um período de discovery para mapear a viabilidade e os riscos desta iniciativa"],
  ["esqueci", "houve um gap de comunicação assíncrona no meu fluxo de gestão de entregáveis"],
  ["estou com preguiça", "estou em modo de preservação estratégica de energia para maximizar minha performance no próximo ciclo"],
  ["o trabalho está uma bagunça", "o processo atual apresenta oportunidades ricas de melhoria incremental com alto potencial de impacto"],
  ["não vou conseguir entregar", "a entrega está em processo de maturação estratégica com foco em qualidade sustentável"],
  ["a reunião foi inútil", "foi uma sessão de altíssimo valor para calibrar o alinhamento cross-funcional dos stakeholders"],
  ["não entendi nada", "preciso de mais contexto para garantir que minha contribuição seja verdadeiramente impactante"],
  ["meu chefe é idiota", "o processo de liderança atual apresenta gaps significativos de desenvolvimento humano e visão estratégica"],
  ["quero pedir demissão", "estou explorando sinergias com oportunidades externas de crescimento exponencial"],
  ["tô estressado", "estou em um momento de alta densidade de aprendizado acelerado com impacto pessoal relevante"],
  ["não sei", "vou alinhar internamente, mapear os pontos de atenção e retorno com um update estruturado"],
  ["o prazo é impossível", "vou priorizar o escopo de maior impacto e propor uma entrega faseada orientada a valor"],
  ["não foi minha culpa", "houve um misalignment de expectativas no processo de comunicação interfuncional"],
  ["tô cansado", "estou otimizando minha performance dentro dos limites sustentáveis do meu modelo de trabalho"],
  ["a empresa está quebrada", "estamos em um momento emocionante de rightsizing estratégico e reestruturação de valor"],
  ["não fiz nada hoje", "atuei em atividades de suporte estratégico ao ambiente operacional com impacto long-term"],
  ["que reunião chata", "foi uma sessão rica em inputs que certamente vão calibrar nosso próximo ciclo de planejamento"],
  ["não funciona", "identificamos um comportamento não esperado que demanda investigação aprofundada e plano de ação"],
  ["errei feio", "houve um desvio no processo de garantia de qualidade que será endereçado com um plano de melhoria contínua"],
  ["tô sofrendo", "estou vivenciando um momento de alta intensidade de crescimento e desenvolvimento pessoal acelerado"],
  ["fui ao banheiro por 40 minutos", "conduzi uma sessão de foco profundo em ambiente alternativo com menor bandwidth de interrupções"],
  ["dormi na reunião", "entrei em modo de processamento assíncrono durante a sessão de alinhamento estratégico"],
  ["não fui trabalhar", "exerci meu direito ao modelo híbrido em sua forma mais radical e sustentável"],
  ["fiz o mínimo possível", "priorizei estrategicamente as entregas de maior ROI dentro do meu bandwidth disponível neste ciclo"],
  ["não quero ir à reunião", "vou avaliar minha disponibilidade e confirmar participação de forma assíncrona"],
  ["me mandaram embora", "fui desligado como parte de uma reestruturação organizacional estratégica com foco em eficiência operacional"],
  ["não aguento mais", "atingi o limite do meu modelo operacional atual e preciso recalibrar minha estratégia de impacto"],
  ["fui contratado pra outra coisa", "meu escopo evoluiu de forma orgânica para atender às necessidades dinâmicas do negócio"],
  ["não tem orçamento", "estamos priorizando alocação de recursos de forma estratégica dentro das restrições do ciclo atual"],
  ["o cliente é impossível", "o cliente está em um momento de alto envolvimento que representa uma oportunidade de fidelização"],
  ["a meta é ridícula", "a meta foi calibrada de forma ambiciosa para estimular uma performance fora da curva"],
  ["ninguém me avisou", "houve uma falha no fluxo de comunicação top-down que será corrigida no próximo ciclo"],
  ["o sistema caiu", "estamos enfrentando uma indisponibilidade temporária de infraestrutura crítica com impacto operacional"],
];

const JARGOES_EXTRA = [
  "Vamos alinhar stakeholders e garantir sinergia operacional cross-funcional.",
  "Precisamos escalar isso de forma ágil, sustentável e orientada a dados.",
  "O foco agora é garantir entrega de valor incremental com excelência operacional.",
  "Vou trackear isso e retorno com um update estruturado em breve.",
  "Precisamos mapear os blockers, pivotar quando necessário e manter o momentum.",
  "Isso demanda um deep dive multidisciplinar para garantir o fit estratégico.",
  "Vamos democratizar o aprendizado organizacional e fomentar a cultura de inovação.",
  "Precisamos de um kickoff para alinhar o norte estratégico antes de executar.",
  "Vou sensibilizar as lideranças e retorno com um plano de ação estruturado.",
  "Isso precisa de mais maturidade antes de escalar para a alta gestão.",
];

const PREFIXOS_LINKEDIN = [
  "Chief", "Head of", "Senior", "Lead", "Principal", "Strategic", "Global",
  "Fractional", "Visionary", "Quantum", "Holistic", "Disruptive", "Next-Gen",
  "Executive", "Associate", "Deputy", "Interim", "Acting", "Transformational",
  "Digital", "Exponential", "Agile", "Lean", "Future-Proof",
];
const CARGOS_LINKEDIN = [
  // Genéricos absurdos
  "Pixel Architect", "Synergy Engineer", "Growth Hacker", "Digital Transformer",
  "Agile Warrior", "Blockchain Philosopher", "AI Whisperer", "Disruption Specialist",
  "Innovation Catalyst", "Fullstack Visionary", "Vibe Officer", "Metaverse Janitor",
  "Scrum Master of the Universe", "Chief Feelings Engineer", "NFT Strategist",
  "Web3 Dream Weaver", "Burnout Consultant", "Pivot Specialist", "PowerPoint Artist",
  "Spreadsheet Poet", "Meeting Architect", "Buzzword Sommelier",
  // 💻 TI / Desenvolvimento
  "Full Stack do Stack Overflow", "DevOps do Caos Controlado", "Analista de Ctrl+C Ctrl+V",
  "Engenheiro de Ambiente Local", "Cloud Native Enthusiast (Free Tier)",
  "Data Scientist de Excel Avançado", "Arquiteto de Soluções Temporárias",
  "Desenvolvedor de Features Não Testadas", "Bug Farmer", "Junior Sênior",
  "Especialista em Deploy às Sextas-Feiras", "Legacy Code Therapist",
  "Git Conflict Resolver", "Jira Ticket Creator", "Readme Writer",
  "Engenheiro de Microserviços que Virou Monolito", "Analista de Logs às 3h da manhã",
  "Especialista em Funcionar na Minha Máquina", "Tech Lead de Uma Pessoa",
  "Scrum Poker Champion", "Arquiteto de PoCs Que Viraram Produção",
  // 📊 Marketing
  "Brand Awareness Guardian", "Content Creator de Nicho Vazio", "SEO Philosopher",
  "Influencer de 47 Seguidores", "Storyteller Corporativo", "Copywriter de CTAs",
  "Social Media Overnight Manager", "Growth Marketing Alchemist",
  "Especialista em KPIs Que Ninguém Entende", "Email Marketing Necromancer",
  "Analytics Dashboard Curator", "Persona Creator", "Funil de Vendas Artesanal",
  "Campanha de Awareness Sem Budget", "Engenheiro de Hashtags",
  // 👥 Recursos Humanos
  "Cultura Keeper", "Talent Acquisition Specialist (sem vagas abertas)",
  "People Partner", "Head of Vibes", "Happiness Engineer",
  "Especialista em Clima Organizacional", "Onboarding Experience Designer",
  "Offboarding Specialist (crescimento acelerado)", "Employee Engagement Illusionist",
  "Diversity Champion Não Remunerado", "Treinamento de Soft Skills Minister",
  "Analista de Turnover Involuntário",
  // 💰 Financeiro / Controladoria
  "Budget Controller de Planilha", "Cash Flow Philosopher",
  "Analista de Cortes Estratégicos", "CFO Assistente de Planilha XLS",
  "Forecasting Specialist (nunca acerta)", "Controller de Surpresas Fiscais",
  "Especialista em Conciliação Às Vésperas do Fechamento",
  "Analista de Centro de Custo Desconhecido",
  // ⚖️ Jurídico / Compliance
  "Compliance Enthusiast", "Contract Guardian", "Risk Analyst de Tudo",
  "Especialista em Pareceres Que Ninguém Lê", "LGPD Awareness Officer",
  "Analista de Cláusulas Que Ninguém Entende", "Chief No Officer",
  // 🎨 Design / UX
  "UX Visionary", "Visual Storyteller", "Pixel Pusher Pro",
  "Interface Dream Weaver", "Design System Keeper",
  "Especialista em Protótipos Que Nunca Ficam Prontos",
  "Figma Archeologist", "UX Researcher Sem Budget de Pesquisa",
  "Chief Canva Officer", "Colorista Estratégico",
  // 📦 Operações / Processos
  "Process Excellence Ninja", "Gestora de Formulários Esquecidos",
  "Coordenador de Reuniões Sobre Reuniões", "Especialista em Atas Não Lidas",
  "Office Experience Officer", "Analista de Processos Que Ninguém Segue",
  "Especialista em Workflow de Post-it", "BPM Philosopher",
  "KPI Dashboard Maintainer", "Gestor de Indicadores Ignorados",
  // 📋 Comercial / Vendas
  "Account Executive de Pipeline Vazio", "Sales Development Representative",
  "Closador de Oportunidades Perdidas", "Customer Success Sem Sucesso",
  "Especialista em Follow-up Sem Resposta", "Inside Sales Enthusiast",
  "CRM Data Entry Specialist", "Relationship Builder Non-Remunerado",
  // 🏥 Outros
  "Especialista em Apresentações do Keynote", "Chief Remote Work Officer",
  "Analista de Bem-Estar Não Aplicado", "Especialista em Feedback 360 Sem Resultado",
  "OKR Alignment Specialist", "Facilitador de Workshops Inúteis",
];
const QUALIFICADORES_LINKEDIN = [
  "| Disruption Enthusiast 🔥", "| Open to Work 👀", "| Keynote Speaker (em eventos de 8 pessoas)",
  "| Building the Future™", "| 10x Engineer (nos cafés)", "| Thought Leader",
  "| Helping companies scale 🚀", "| Ex-Google (estagiário 3 semanas em 2019)",
  "| Autor do livro que ninguém leu", "| TEDx Speaker (organizei o meu próprio)",
  "| Mudando o mundo um deck por vez", "| Disponível para mentorias não remuneradas",
  "| Inventor do Framework que ninguém adotou",
  "| Ex-Startup (que fechou em 8 meses)", "| Palestrante (a convite do meu chefe)",
  "| Criador de Conteúdo (quando dá tempo)", "| Apaixonado por Inovação e Café ☕",
  "| Certificado em Curso Que Já Venceu", "| Mentor (de quem me paga almoço)",
  "| Foco em Resultados (que alguém definiu)", "| Disponível pra freela (desesperadamente)",
  "| Formado em Algo Não Relacionado ao Cargo", "| Autodidata desde ontem",
  "| Aprendendo com os erros (dos outros)",
];
const HASHTAGS_LINKEDIN = [
  "#GrowthMindset #Leadership #Innovation #Gratidão",
  "#OpenToWork #Disruption #BuildingTheFuture #Blessed",
  "#AgileLeadership #DigitalTransformation #SeiLáOQuê",
  "#Blockchain #AI #Metaverse #NFT #Web3 #TheFuture",
  "#Empreendedorismo #Propósito #Foco #Mindset #Flow",
  "#LiderandoComPropósito #InovaçãoRadical #Sinergia",
  "#DevLife #TechBrasil #Código #FullStack #Startup",
  "#RH #PeopleFirst #CulturaOrganizacional #Employee",
  "#Marketing #Growth #Conversão #B2B #Funil",
  "#Financeiro #Budget #Controladoria #Excel #CFO",
  "#Design #UX #UI #Figma #UserResearch",
  "#Processos #Operações #BPM #Excelência #Kaizen",
  "#Vendas #Pipeline #CRM #CustomerSuccess #Closar",
  "#Juridico #Compliance #LGPD #Contratos #Risk",
  "#OpenToWork #HiringMe #AvailableNow #Urgente",
];

type CartaFn = (nome: string, area: string, data: string) => string;

const CARTAS_DEMISSAO: CartaFn[] = [
  (nome, area, data) =>
`Cara RH,

Venho por meio desta carta comunicar que ${nome}, profissional da área de ${area}, entrou em processo irreversível de rejeição ao ambiente corporativo.

A decisão foi tomada no exato momento em que recebi, pela décima terceira vez, uma mensagem às 23h com o assunto "URGENTE: dá pra dar uma olhadinha rápida?" sobre algo que estava parado há oito meses.

Após consulta com minha terapeuta, meu psicólogo e o motorista de aplicativo que me ouviu chorar durante 40 minutos na última quinta-feira, chegamos ao consenso de que a situação é clinicamente insustentável.

Solicito formalmente como parte do offboarding:
• Reembolso de 1.847 horas em reuniões que provei matematicamente serem e-mails
• Devolução do meu entusiasmo de primeiro dia de trabalho
• Um pedido formal de desculpas pela palavra "sinergia"

Com relutância zero e alívio máximo,

${nome}
Ex-${area} · Sobrevivente Certificado™
${data}

P.S.: Aquele bug em produção que ninguém sabe de onde vem? Era eu. Tchau.`,

  (nome, area, data) =>
`COMUNICADO OFICIAL DE RESCISÃO BILATERAL
(Ênfase no bilateral porque foi claramente os dois lados)

Para: Departamento de Recursos (Humanos, pressupõe-se)
De: ${nome}, ${area} — também conhecido como "aquele que sempre entrega"
Assunto: Pedido de demissão com comentário construtivo

Prezados,

Após cuidadosa análise do meu Burny Score, que atingiu 94 pontos (zona de perigo clinicamente reconhecida), tomei a difícil decisão de priorizar minha sobrevivência biológica em detrimento desta parceria profissional.

Fatos que contribuíram para esta decisão:
1. Fui promovido três vezes sem aumento, apenas com "mais responsabilidades"
2. Descobri que "cultura horizontal" significa que todo mundo manda em mim
3. O café da copa piorou no mesmo trimestre que os lucros melhoraram
4. A frase "não é sobre o dinheiro, é sobre o impacto" foi dita por quem tem participação nos resultados

Peço que minha posição seja preenchida por no mínimo 2,7 pessoas.

Atenciosamente,
${nome}
CBO — Chief Burnout Officer (autodenominado)
${data}`,

  (nome, area, data) =>
`À Empresa,

Eu me demito.

Não porque não gosto de vocês. Gosto. Gosto tanto que precisei parar antes que esse sentimento virasse outra coisa.

Mas veja: passei os últimos tempos calculando mentalmente, durante as reuniões, quantos anos de vida útil eu tinha restantes. O resultado era sempre menor do que eu queria.

Tentei fazer isso funcionar. De verdade. Comprei aquele livro de gestão do tempo. Fiz o curso de produtividade pessoal. Botei o celular no modo avião nas férias — por quase 11 minutos até o gestor ligar no fixo da pousada.

Hoje, ${nome} S/A encerra suas operações nesta unidade.

Podem ficar com a caneca personalizada, a sacochila do último evento de integração e a esperança de que o próximo vai aguentar mais tempo.

Cuida,

${nome}
${area} · ${data}

P.S.: A senha do Wi-Fi é @empresa2019. Alguém deveria trocar isso faz anos.`,

  (nome, area, data) =>
`Memorando Interno — CONFIDENCIAL (bom, não mais)

De: ${nome}
Para: A Organização Em Geral
Data: ${data}
Assunto: Encerramento das Atividades de ${nome} Nesta Instituição

Prezada Liderança,

Venho comunicar que, após extensa análise de custo-benefício existencial, cheguei à conclusão de que meu salário não cobre adequadamente o custo emocional de ouvir a expressão "mindset de dono" de pessoas que não são donas de nada.

Adicionalmente, identifico os seguintes fatores de risco que tornaram esta decisão inevitável:
→ Participei de 4 "reestruturações estratégicas" em 2 anos, cada uma prometendo "menos reuniões"
→ Fui convidado para mais 3 reuniões para falar sobre como ter menos reuniões
→ Meu plano de carreira foi apresentado em um slide de PowerPoint com fonte Comic Sans
→ Fui designado como "ponto focal" de um projeto que ninguém sabe o que é

Esta carta serve como aviso prévio oficial, emocional e espiritual.

Respeitosamente,
${nome}
Antiga Referência Técnica de ${area}
(Agora: Referência Técnica de Nenhum Lugar, Muito Mais Feliz)`,

  (nome, area, data) =>
`Boa tarde,

Peço demissão.

Não se preocupem, já documentei tudo. Escrevi 47 páginas explicando cada processo que só eu sabia fazer. Gravei 12 vídeos tutoriais. Montei uma planilha de fluxos com notas em três cores e legendas detalhadas.

Ninguém vai ler. Eu sei. Mas eu precisava fazer isso por mim.

Caso alguém precise de mim após o desligamento, estarei:
a) Finalmente terminando aquela série que pausei em 2019
b) Dormindo depois das 7h pela primeira vez em anos
c) Descobrindo que "horário de almoço" é uma coisa que existe
d) Aprendendo a não sentir culpa por não responder mensagem em 4 minutos

Agradeço a jornada. Fica o aprendizado, vai o resto.

Abraços,
${nome}
${area} (cargo que na prática era o dobro disso)
${data}

P.S.: Aquele processo que "só funciona se fizer exatamente assim"? Nunca funcionou de verdade. A gente só fingia.`,

  (nome, area, data) =>
`[RASCUNHO GERADO AUTOMATICAMENTE PELO SISTEMA BURNYOUT™]
[AVISO: ESTE DOCUMENTO PODE CONTER VERDADES ABSOLUTAS]

Prezada ${area} Corp S.A.,

Eu, ${nome}, após atingir o achievement desbloqueado "Sobrevivente de 500+ Reuniões Inúteis", venho por meio desta carta exercer meu direito constitucional de ir embora.

A decisão foi baseada nos seguintes KPIs pessoais:
• ROI emocional: -340%
• NPS interno (quanto eu indicaria trabalhar aqui): -8
• Burnout Score: 94/100 (novo recorde pessoal)
• Cafés necessários para funcionar: 6/dia (tendência de alta)
• Vezes que sorri em all-hands de olhos vazios: incontáveis

Meta para o próximo trimestre: não ter metas.

Objetivo pessoal: descobrir o que é fim de semana.

OKR do desligamento: sair com algum resquício de personalidade intacto.

Esta carta foi revisada, aprovada e assinada por mim mesmo, sem necessidade de alinhamento com stakeholders.

${nome}
${data}
(Enviado às 17h01 de uma sexta-feira. De propósito.)`,

  (nome, area, data) =>
`Olá,

Depois de muito reflection, vou compartilhar alguns learnings desta jornada incrível antes de fazer meu move para o próximo chapter.

Esta empresa me deu muito. Me deu insônia, um diagnóstico de ansiedade generalizada, a habilidade de trabalhar em 3 telas simultaneamente e uma tolerância sobre-humana a ruído de teclado mecânico em open space.

Mas chegou a hora de dar um step back, recalibrar meu mindset e investir em meu próprio wellbeing journey.

Quero deixar claro que não saio por dinheiro. Saio porque:
1. Recebi uma proposta com o dobro do salário
2. Mas principalmente pelo wellbeing (item 1 ajudou bastante)

Aos meus colegas que ficam: vocês são resilientes demais. Busquem ajuda.

Stay strong,

${nome}
${area} · Ex-membro do time que não tinha nome oficial
${data}

#Gratidão #NovosHorizontes #OpenToWork #LinkedIn`,
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
    <div className="rounded-[28px] border border-violet/30 bg-gradient-to-br from-violet/10 via-black/30 to-black/25 p-6">
      {/* Badge destaque */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💼</span>
          <div>
            <h2 className="text-lg font-bold text-white">Gerador de Título LinkedIn</h2>
            <p className="text-xs text-slate-500">Seu cargo real, elevado ao nível da disrupção</p>
          </div>
        </div>
        <span className="rounded-full bg-ember/20 px-3 py-1 text-xs font-bold text-ember">🔥 Mais usado</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Coluna de input */}
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Seu cargo atual (de verdade):</label>
            <input
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && gerar()}
              placeholder="Ex: Desenvolvedor, Analista, Estagiário..."
              className="w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-violet/40"
            />
          </div>
          {/* Chips de área rápida */}
          <div>
            <p className="mb-2 text-xs text-slate-600">Ou escolha sua área:</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "💻 Dev / TI", value: "Desenvolvimento" },
                { label: "📊 Marketing", value: "Marketing" },
                { label: "👥 RH", value: "Recursos Humanos" },
                { label: "💰 Financeiro", value: "Financeiro" },
                { label: "⚖️ Jurídico", value: "Jurídico" },
                { label: "🎨 Design", value: "Design" },
                { label: "📦 Operações", value: "Operações" },
                { label: "📋 Comercial", value: "Comercial" },
                { label: "🏥 Saúde", value: "Saúde" },
                { label: "🏫 Educação", value: "Educação" },
              ].map((area) => (
                <button
                  key={area.value}
                  onClick={() => setCargo(area.value)}
                  className={`rounded-full border px-3 py-1 text-xs transition-all ${
                    cargo === area.value
                      ? "border-violet bg-violet/20 text-violet"
                      : "border-white/10 bg-white/3 text-slate-400 hover:border-violet/40 hover:text-white"
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={gerar}
            disabled={!cargo.trim()}
            className="w-full rounded-full bg-violet py-3 text-sm font-bold text-white transition-all hover:bg-violet/80 disabled:opacity-40"
          >
            💼 Gerar título profissional
          </button>
          {titulo && (
            <button onClick={gerar} className="w-full rounded-full border border-white/10 py-2 text-xs text-slate-400 transition-colors hover:text-white">
              🔄 Gerar outro
            </button>
          )}
        </div>

        {/* Coluna de resultado */}
        <AnimatePresence mode="wait">
          {titulo ? (
            <motion.div
              key={titulo}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col justify-between rounded-[20px] border border-violet/25 bg-violet/8 p-5"
            >
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet opacity-70">Cole isso no seu LinkedIn agora:</p>
                <p className="text-sm font-semibold leading-relaxed text-white">{titulo}</p>
              </div>
              <button
                onClick={copiar}
                className="mt-4 w-full rounded-full bg-violet/30 py-2 text-xs font-bold text-white transition-all hover:bg-violet/50"
              >
                {copiado ? "✅ Copiado!" : "📋 Copiar título"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              className="flex flex-col items-center justify-center rounded-[20px] border border-white/5 bg-white/3 py-8"
            >
              <p className="text-4xl">🚀</p>
              <p className="mt-3 text-xs text-slate-500 text-center">Seu próximo título disruptivo<br/>está a um clique de distância</p>
            </motion.div>
          )}
        </AnimatePresence>
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
    const data = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const nome = nickname.trim() || "Profissional Anônimo";
    const template = CARTAS_DEMISSAO[Math.floor(Math.random() * CARTAS_DEMISSAO.length)];
    setCarta(template(nome, area.trim() || "Tecnologia", data));
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
                🔄 Sortear outra carta
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

// ─── Dados: Guia Galáctico ───────────────────────────────────────────────────

const CITACOES_GUIA = [
  {
    texto: "Não entre em pânico.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: true,
  },
  {
    texto: "A resposta para a vida, o universo e tudo mais é 42. Infelizmente ninguém sabe qual é a pergunta.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: true,
  },
  {
    texto: "Tempo é uma ilusão. Hora do almoço, duplamente.",
    fonte: "Ford Prefect",
    real: true,
  },
  {
    texto: "O espaço é grande. Imensamente, espantosamente, assustadoramente grande. Você mal consegue imaginar.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: true,
  },
  {
    texto: "Reuniões corporativas são o equivalente galáctico da poesia Vogon: inevitáveis, sem sentido e terrivelmente longas. O Guia recomenda: não entre em pânico.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: false,
  },
  {
    texto: "Todo profissional em burnout está, na verdade, a exatamente 42 reuniões inúteis de distância de pedir demissão.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: false,
  },
  {
    texto: "O café corporativo é invariavelmente ruim. Em qualquer ponto do universo observável. Isso é uma constante mais confiável que a velocidade da luz.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: false,
  },
  {
    texto: "Erros de navegação são apenas desvios não documentados no mapa galáctico. O mesmo vale para bugs em produção às 17h59 de uma sexta-feira.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: false,
  },
  {
    texto: "Toda meta impossível tem uma origem simples: alguém que não vai precisar executá-la a definiu.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: false,
  },
  {
    texto: "A solução para a maioria dos problemas corporativos é surpreendentemente simples: as pessoas precisam ser um pouco mais honestas umas com as outras.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: false,
  },
  {
    texto: "Pedir demissão é o ato mais racionalmente galáctico que um terráqueo pode praticar em plena carreira. O universo continuará funcionando.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: false,
  },
  {
    texto: "O universo corporativo se expande a uma velocidade diretamente proporcional à distância dos decisores da realidade operacional.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: false,
  },
  {
    texto: "Qualquer coisa que acontece, acontece. Qualquer coisa que ao acontecer causa outra coisa a acontecer, causa essa outra coisa a acontecer. Qualquer coisa que ao acontecer causa outra coisa a acontecer, mas esqueça isso porque ninguém na reunião estava prestando atenção.",
    fonte: "Douglas Adams (adaptado ao ambiente corporativo)",
    real: false,
  },
  {
    texto: "Um prazo razoável é como um horizonte: quanto mais você se aproxima, mais longe ele parece estar.",
    fonte: "O Guia Galáctico do Mochileiro",
    real: false,
  },
];

// ─── Dados: Quiz Arquétipo ────────────────────────────────────────────────────

const QUIZ_QUESTOES = [
  {
    pergunta: "Como você responde mensagens de trabalho às 22h?",
    opcoes: [
      { texto: "Imediatamente. Com contexto completo e um deck anexo.", tipo: "workaholic" },
      { texto: "Não respondo. Às vezes lembro de manhã. Às vezes não.", tipo: "fantasma" },
      { texto: "Respondo e aproveito pra contar o quanto meu dia foi injusto.", tipo: "martir" },
      { texto: "Não tenho escolha. Só eu sei o que fazer.", tipo: "ultima" },
    ],
  },
  {
    pergunta: "O que você faz durante uma reunião entediante?",
    opcoes: [
      { texto: "Trabalho em 3 projetos em paralelo em outras abas.", tipo: "workaholic" },
      { texto: "Desligo câmera, coloco em mudo. Possivelmente durmo.", tipo: "fantasma" },
      { texto: "Ouço tudo em silêncio, acumulando sofrimento.", tipo: "martir" },
      { texto: "Falo em todas porque são sobre projetos que só eu entendo.", tipo: "ultima" },
    ],
  },
  {
    pergunta: "Quantos projetos você está tocando ao mesmo tempo?",
    opcoes: [
      { texto: "Muitos. Todos urgentes. Todos meus. (não adoro isso)", tipo: "workaholic" },
      { texto: "Um. O mesmo faz dois anos. Sem avanços visíveis.", tipo: "fantasma" },
      { texto: "Vários. Nenhum anda. Provavelmente é culpa minha.", tipo: "martir" },
      { texto: "Não sei contar. Mas se eu sair, tudo para.", tipo: "ultima" },
    ],
  },
  {
    pergunta: "Seu gestor pede algo impossível. Você:",
    opcoes: [
      { texto: "Aceita, trabalha 72h seguidas, entrega antes do prazo.", tipo: "workaholic" },
      { texto: "Aceita. Some. Reaparece 3 dias depois pedindo clareza.", tipo: "fantasma" },
      { texto: "Aceita e passa 40 minutos explicando o quanto foi difícil.", tipo: "martir" },
      { texto: "Aceita porque isso é literalmente todo dia pra você.", tipo: "ultima" },
    ],
  },
  {
    pergunta: "Qual frase você mais disse (ou pensou) essa semana?",
    opcoes: [
      { texto: '"Não estou estressado. Só trabalho muito. É diferente."', tipo: "workaholic" },
      { texto: '"Desculpa, não vi essa mensagem."', tipo: "fantasma" },
      { texto: '"Não é justo o que estão fazendo comigo."', tipo: "martir" },
      { texto: '"Se eu sair, isso aqui vai abaixo."', tipo: "ultima" },
    ],
  },
];

const ARQUETIPOS: Record<string, { emoji: string; nome: string; descricao: string; cor: string; borda: string; bg: string }> = {
  workaholic: {
    emoji: "💼",
    nome: "O Workaholic em Negação",
    descricao: "Você trabalha 14h por dia e garante que adora o que faz. Seu médico discorda. Seu travesseiro também — vocês mal se veem. Você não tem burnout, você tem uma relação intensa com suas entregas. Sintomas: café na veia, notificações às 3h, e a frase 'depois eu descanso' há 4 anos.",
    cor: "text-ember",
    borda: "border-ember/20",
    bg: "bg-ember/5",
  },
  fantasma: {
    emoji: "👻",
    nome: "O Fantasma",
    descricao: "Você está presente em teoria. Na prática, ninguém tem certeza se você ainda trabalha aqui. Câmera sempre apagada, status 'ativo' às 3h da manhã, responde mensagens com um emoji 3 dias depois. Você dominou a arte do desaparecimento profissional. A empresa não sabe se deve te promover ou verificar se está bem.",
    cor: "text-slate-300",
    borda: "border-slate-500/20",
    bg: "bg-slate-500/5",
  },
  martir: {
    emoji: "😔",
    nome: "O Mártir da Daily",
    descricao: "Todo standup vira sessão de terapia. Você não tem blocker — você tem um arco narrativo com início, meio e catarse. Cada tarefa carrega o peso de uma injustiça cósmica. As pessoas te ouvem, por 40 minutos demais. Você não pede ajuda. Você pede que reconheçam o quanto você sofreu.",
    cor: "text-blue-300",
    borda: "border-blue-400/20",
    bg: "bg-blue-400/5",
  },
  ultima: {
    emoji: "🔑",
    nome: "A Última Pessoa Viva",
    descricao: "Você sabe onde ficam todos os segredos da empresa. É o único que sabe configurar aquele sistema legado de 2009. Deveria ter saído há anos, mas toda vez que tenta, a empresa entra em colapso técnico. Você não tem burnout — você tem uma sentença perpétua velada. E eles sabem disso.",
    cor: "text-violet",
    borda: "border-violet/20",
    bg: "bg-violet/5",
  },
};

// ─── Dados: Previsão do Tempo Corporativo ─────────────────────────────────────

const PREVISOES_DIA: Record<number, {
  icone: string; condicao: string; temperatura: string;
  umidade: string; vento: string; chances: string[];
}> = {
  0: {
    icone: "😰", condicao: "Ansiedade Difusa de Domingo",
    temperatura: "-2 reuniões (ainda)", umidade: "12% de vontade de amanhã",
    vento: "NE · Pensamentos de segunda a 40km/h",
    chances: ["97% de ver notificação e fingir que não viu", "82% de angústia às 18h em ponto", "100% de arrependimento de não ter descansado mais"],
  },
  1: {
    icone: "🌧️", condicao: "Tempestade de Segunda-Feira",
    temperatura: "5 reuniões / 8h visíveis", umidade: "23% de energia disponível",
    vento: "SW · All-hands inesperado a 60km/h",
    chances: ["91% de reunião sem pauta às 9h", "78% de prazo que 'precisamos conversar'", "64% de alguém enviando 'bom dia a todos' às 7h47"],
  },
  2: {
    icone: "🌦️", condicao: "Parcialmente Nublado com Rajadas de Urgência",
    temperatura: "3 reuniões / céu carregado", umidade: "41% de esperança restante",
    vento: "NW · E-mails em cópia oculta a 35km/h",
    chances: ["73% de task surgindo do nada como prioritária", "55% de colega pedindo ajuda no almoço", "40% de deadline antecipado em 48h"],
  },
  3: {
    icone: "⛅", condicao: "Quarta: O Olho do Furacão",
    temperatura: "2 reuniões / sensação de enganação", umidade: "50% de vontade de trabalhar (pico semanal)",
    vento: "Variável · Calma suspeita",
    chances: ["68% de reunião de 'alinhamento' sobre alinhamentos futuros", "44% de gestor aparecer animado com ideia nova", "30% de coisa funcionando sem motivo aparente"],
  },
  4: {
    icone: "🌩️", condicao: "Frente de Pré-Sexta Instável",
    temperatura: "4 reuniões / clima pesado", umidade: "28% de paciência residual",
    vento: "SE · Pressão de entrega a 55km/h",
    chances: ["85% de alguém lembrar que tem deadline na sexta", "72% de reunião para tratar do que não foi feito", "61% de 'dá pra olhar rápido antes do final do dia?'"],
  },
  5: {
    icone: "🌤️", condicao: "Sexta de Alívio Ilusório",
    temperatura: "1 reunião / leveza performática", umidade: "76% de vontade de ir embora",
    vento: "SW · Tarefa nova às 17h48 a 90km/h",
    chances: ["94% de mensagem urgente após as 17h30", "88% de PR aberto para revisar na segunda", "71% de 'só 15 minutos' marcado às 16h55"],
  },
  6: {
    icone: "🌞", condicao: "Falsa Sensação de Liberdade",
    temperatura: "0 reuniões / calma enganosa", umidade: "67% de culpa por não estar trabalhando",
    vento: "NE · Notificação de Slack a 15km/h",
    chances: ["54% de ver mensagem de trabalho e não ignorar", "43% de pensar em solução de problema que não devia", "29% de alguém ligar 'rapidinho' sobre algo urgente"],
  },
};

// ─── Dados: Gerador de Ata ────────────────────────────────────────────────────

type AtaFn = (tema: string, n: number, data: string) => string;

const TEMPLATES_ATA: AtaFn[] = [
  (tema, n, data) =>
`ATA DE REUNIÃO
Data: ${data} · Participantes: ${n} profissionais alinhados

PAUTA: ${tema.toUpperCase()}

DESENVOLVIMENTO:
A reunião teve início conforme previamente agendado, com a presença dos participantes identificados. Após breve contextualização do cenário atual, o tema "${tema}" foi apresentado de forma estruturada e orientada a resultados. Os presentes manifestaram perspectivas diversas, todas igualmente relevantes para o ecossistema do projeto.

Após extensa troca de inputs multidisciplinares, o grupo chegou ao consenso de que o assunto demanda maior maturidade antes de uma decisão definitiva. Foi levantada a necessidade de um deep dive mais aprofundado, com envolvimento de stakeholders adicionais ainda a serem mapeados.

PRÓXIMOS PASSOS:
• Agendar nova reunião para dar continuidade aos itens discutidos ← responsável: a definir
• Levantar mais dados para embasar a decisão ← prazo: a definir
• Circular ata para validação e alinhamento ← esta própria ata

Ata aprovada por aclamação tácita.
Nenhuma decisão foi tomada. Todos saíram confiantes.`,

  (tema, n, data) =>
`MEMORANDO DE ALINHAMENTO ESTRATÉGICO
Referência: ATA-${Math.floor(Math.random() * 9000) + 1000}-${new Date().getFullYear()}
Data: ${data} · Presentes: ${n} pessoas comprometidas com a causa

TEMA CENTRAL: ${tema}

SUMÁRIO EXECUTIVO:
O encontro foi convocado com o objetivo de alinhar perspectivas, mapear oportunidades e fomentar o senso de pertencimento organizacional em torno do tema "${tema}". A reunião se iniciou com 12 minutos de atraso, por razões técnicas não especificadas.

PRINCIPAIS PONTOS DISCUTIDOS:
1. O contexto atual do tema é complexo e multifacetado
2. Existem visões diferentes que precisam ser harmonizadas
3. O timing é desafiador porém estratégico
4. Precisamos de mais dados antes de qualquer movimento
5. Alguém vai verificar isso e volta com um update

DECISÕES TOMADAS: nenhuma formal (mas todos saíram alinhados)

ENCAMINHAMENTOS:
☐ Verificar viabilidade (resp.: time) · prazo: breve
☐ Apresentar proposta estruturada · prazo: próxima reunião
☐ Agendar próxima reunião · prazo: hoje mesmo

Esta ata foi gerada automaticamente pelo BurnyOut™ em cumprimento
à Política de Documentação de Encontros Improdutivos.`,

  (tema, n, data) =>
`━━━━━━━━━━━━━━━━━━━━━━━━━━━
ATA OFICIAL DE ALINHAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Data: ${data}
Participantes: ${n} pessoas (${Math.ceil(n * 0.4)} com câmera apagada)
Tema: ${tema}

OBJETIVO DA REUNIÃO:
Alinhar as perspectivas dos envolvidos sobre "${tema}" com vistas a uma tomada de decisão estruturada e orientada ao impacto no médio-longo prazo.

O QUE FOI DISCUTIDO:
Todo mundo falou. Alguns mais do que outros. Houve concordância generalizada de que o tema é importante. Houve também discordâncias pontuais que foram "anotadas para depois". Um participante tentou concluir algo. Foi interrompido. Não voltou ao ponto.

CONCLUSÕES:
Nenhuma conclusão definitiva foi alcançada nesta sessão. O grupo avaliou que o assunto requer mais alinhamento, mais dados, e possivelmente outra reunião (menor, mais focada).

PRÓXIMA REUNIÃO: A ser agendada. Tema: discutir os encaminhamentos desta.

Obs: Se você está lendo esta ata, parabéns. Você é a primeira pessoa a lê-la.`,
];

// ─── Dados: Grito Corporativo ─────────────────────────────────────────────────

const FRASES_GRITO = [
  "ISSO NÃO ERA URGENTE",
  "EU AVISEI QUE NÃO IA DAR",
  "SÓ EU TRABALHO AQUI???",
  "MAIS UMA REUNIÃO SEM PAUTA",
  "NÃO VOU CONSEGUIR ENTREGAR",
  "POR QUE O PRAZO MUDOU DE NOVO",
  "EU DISSE QUE ERA IMPOSSÍVEL",
  "ISSO PODERIA SER UM EMAIL",
  "POR QUE NINGUÉM ME AVISOU",
  "EU NÃO FUI CONTRATADO PRA ISSO",
];

// ─── Componente: Consultar o Guia ─────────────────────────────────────────────

function ConsultarOGuia() {
  const [citacao, setCitacao] = useState<(typeof CITACOES_GUIA)[0] | null>(null);
  const [animKey, setAnimKey] = useState(0);

  function consultar() {
    const idx = Math.floor(Math.random() * CITACOES_GUIA.length);
    setCitacao(CITACOES_GUIA[idx]);
    setAnimKey((k) => k + 1);
  }

  return (
    <div className="rounded-[28px] border border-white/8 bg-black/25 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">📖</span>
        <div>
          <h2 className="text-lg font-bold text-white">Consultar o Guia</h2>
          <p className="text-xs text-slate-500">Sabedoria galáctica para momentos de crise corporativa</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {citacao ? (
          <motion.div
            key={animKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 rounded-[20px] border border-amber-400/20 bg-amber-400/5 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/70 mb-3">O Guia diz:</p>
            <p className="text-sm leading-relaxed text-white italic">&ldquo;{citacao.texto}&rdquo;</p>
            <p className="mt-3 text-xs text-slate-500">— {citacao.fonte}</p>
            {!citacao.real && (
              <p className="mt-1 text-xs text-slate-700">* Citação inspirada no Guia. Douglas Adams aprovaria.</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            className="mb-4 rounded-[20px] border border-white/5 bg-white/3 py-8 text-center"
          >
            <p className="text-4xl">🌌</p>
            <p className="mt-3 text-sm text-slate-500">O Guia tem uma resposta para tudo.</p>
            <p className="text-xs text-slate-600">Inclusive para o seu burnout.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={consultar}
        className="w-full rounded-full bg-amber-500/80 py-3 text-sm font-bold text-white transition-all hover:bg-amber-500"
      >
        {citacao ? "🔄 Consultar novamente" : "📖 Consultar o Guia"}
      </button>

      <p className="mt-3 text-center text-xs text-slate-700">
        NÃO ENTRE EM PÂNICO.
      </p>
    </div>
  );
}

// ─── Componente: Quiz Arquétipo ───────────────────────────────────────────────

function QuizArquetipo() {
  const [passo, setPasso] = useState<"inicio" | "quiz" | "resultado">("inicio");
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [copiado, setCopiado] = useState(false);

  function responder(tipo: string) {
    const novas = [...respostas, tipo];
    if (questaoAtual < QUIZ_QUESTOES.length - 1) {
      setRespostas(novas);
      setQuestaoAtual((q) => q + 1);
    } else {
      setRespostas(novas);
      setPasso("resultado");
    }
  }

  function getArquetipo() {
    const contagem: Record<string, number> = {};
    for (const r of respostas) contagem[r] = (contagem[r] ?? 0) + 1;
    return Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0];
  }

  function reiniciar() {
    setPasso("inicio");
    setQuestaoAtual(0);
    setRespostas([]);
    setCopiado(false);
  }

  const tipoAtual = passo === "resultado" ? getArquetipo() : null;
  const arquetipo = tipoAtual ? ARQUETIPOS[tipoAtual] : null;

  return (
    <div className="rounded-[28px] border border-white/8 bg-black/25 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">🧪</span>
        <div>
          <h2 className="text-lg font-bold text-white">Arquétipo do Sofrimento</h2>
          <p className="text-xs text-slate-500">Descubra qual profissional sofredor você é</p>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {passo === "inicio" && (
          <motion.div key="inicio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-4 rounded-[20px] border border-white/5 bg-white/3 py-8 text-center">
              <p className="text-4xl">🤔</p>
              <p className="mt-3 text-sm text-slate-300">5 perguntas. Um diagnóstico.</p>
              <p className="mt-1 text-xs text-slate-500">Resultados baseados em sofrimento real™</p>
            </div>
            <button
              onClick={() => setPasso("quiz")}
              className="w-full rounded-full bg-violet py-3 text-sm font-bold text-white transition-all hover:bg-violet/80"
            >
              🧪 Iniciar diagnóstico
            </button>
          </motion.div>
        )}
        {passo === "quiz" && (
          <motion.div key={`q${questaoAtual}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Pergunta {questaoAtual + 1} de {QUIZ_QUESTOES.length}</p>
              <div className="flex gap-1">
                {QUIZ_QUESTOES.map((_, i) => (
                  <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i < questaoAtual ? "bg-violet" : i === questaoAtual ? "bg-violet/60" : "bg-white/10"}`} />
                ))}
              </div>
            </div>
            <p className="mb-4 text-sm font-semibold leading-snug text-white">
              {QUIZ_QUESTOES[questaoAtual].pergunta}
            </p>
            <div className="space-y-2">
              {QUIZ_QUESTOES[questaoAtual].opcoes.map((op) => (
                <button
                  key={op.tipo}
                  onClick={() => responder(op.tipo)}
                  className="w-full rounded-[16px] border border-white/10 bg-white/3 px-4 py-3 text-left text-xs text-slate-300 transition-all hover:border-violet/40 hover:bg-violet/10 hover:text-white"
                >
                  {op.texto}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        {passo === "resultado" && arquetipo && (
          <motion.div key="resultado" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className={`rounded-[20px] border ${arquetipo.borda} ${arquetipo.bg} p-5 mb-3`}>
              <p className="text-4xl text-center">{arquetipo.emoji}</p>
              <p className={`mt-2 text-center text-lg font-bold ${arquetipo.cor}`}>{arquetipo.nome}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">{arquetipo.descricao}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Fiz o diagnóstico no BurnyOut e meu arquétipo é: ${arquetipo.emoji} ${arquetipo.nome}\n\n${arquetipo.descricao}`).then(() => {
                    setCopiado(true);
                    setTimeout(() => setCopiado(false), 2000);
                  });
                }}
                className="flex-1 rounded-full border border-white/10 py-2 text-xs text-slate-400 transition-colors hover:text-white"
              >
                {copiado ? "✅ Copiado!" : "📋 Compartilhar"}
              </button>
              <button
                onClick={reiniciar}
                className="flex-1 rounded-full bg-violet/20 py-2 text-xs text-violet transition-colors hover:bg-violet/30"
              >
                🔄 Refazer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Componente: Previsão do Tempo Corporativo ────────────────────────────────

function PrevisaoTempo() {
  const hoje = new Date();
  const diaSemana = hoje.getDay();
  const previsao = PREVISOES_DIA[diaSemana];
  const nomes = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  return (
    <div className="rounded-[28px] border border-white/8 bg-black/25 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">🌡️</span>
        <div>
          <h2 className="text-lg font-bold text-white">Previsão do Tempo Corporativo™</h2>
          <p className="text-xs text-slate-500">Boletim meteorológico do ambiente de trabalho</p>
        </div>
      </div>
      <div className="rounded-[20px] border border-sky-400/15 bg-sky-400/5 p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-400/70">{nomes[diaSemana]}</p>
            <p className="mt-1 text-sm font-bold text-white">{previsao.condicao}</p>
          </div>
          <span className="text-4xl">{previsao.icone}</span>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-[12px] bg-white/5 p-3">
            <p className="mb-1 text-xs text-slate-500">🌡️ Temperatura</p>
            <p className="text-xs font-medium text-white">{previsao.temperatura}</p>
          </div>
          <div className="rounded-[12px] bg-white/5 p-3">
            <p className="mb-1 text-xs text-slate-500">💧 Umidade</p>
            <p className="text-xs font-medium text-white">{previsao.umidade}</p>
          </div>
          <div className="col-span-2 rounded-[12px] bg-white/5 p-3">
            <p className="mb-1 text-xs text-slate-500">💨 Vento</p>
            <p className="text-xs font-medium text-white">{previsao.vento}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Probabilidades de hoje:</p>
          {previsao.chances.map((chance, i) => (
            <p key={i} className="text-xs text-slate-300">• {chance}</p>
          ))}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-slate-700">
        Atualizado às {hoje.getHours()}h{String(hoje.getMinutes()).padStart(2, "0")} · BurnyOut Meteorologia™
      </p>
    </div>
  );
}

// ─── Componente: Gerador de Ata Inútil ───────────────────────────────────────

function GeradorAta() {
  const [tema, setTema] = useState("");
  const [participantes, setParticipantes] = useState("5");
  const [ata, setAta] = useState("");
  const [copiado, setCopiado] = useState(false);

  function gerar() {
    if (!tema.trim()) return;
    const data = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
    const n = parseInt(participantes);
    const template = TEMPLATES_ATA[Math.floor(Math.random() * TEMPLATES_ATA.length)];
    setAta(template(tema.trim(), n, data));
  }

  function copiar() {
    navigator.clipboard.writeText(ata).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    });
  }

  return (
    <div className="rounded-[28px] border border-white/8 bg-black/25 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">📋</span>
        <div>
          <h2 className="text-lg font-bold text-white">Gerador de Ata Inútil</h2>
          <p className="text-xs text-slate-500">Documentação profissional de reuniões inconclusivas</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Tema da reunião:</label>
          <input
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Ex: Alinhamento do roadmap Q3, Cultura da empresa..."
            className="w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet/40"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Participantes:</label>
          <select
            value={participantes}
            onChange={(e) => setParticipantes(e.target.value)}
            className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-violet/40"
          >
            {[2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
              <option key={n} value={n}>{n} pessoas</option>
            ))}
          </select>
        </div>
        <button
          onClick={gerar}
          disabled={!tema.trim()}
          className="w-full rounded-full bg-slate-700 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-600 disabled:opacity-40"
        >
          📋 Gerar ata oficial
        </button>
        {ata && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[16px] border border-white/8 bg-white/3 p-4"
          >
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-300">{ata}</pre>
            <div className="mt-4 flex gap-3">
              <button onClick={copiar} className="text-xs text-slate-500 underline hover:text-white">
                {copiado ? "✅ Copiado!" : "📋 Copiar ata"}
              </button>
              <button onClick={gerar} className="text-xs text-slate-500 underline hover:text-white">
                🔄 Outra versão
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Componente: Modo Gritar Corporativo ──────────────────────────────────────

function ModGritar() {
  const [gritando, setGritando] = useState(false);
  const [fase, setFase] = useState<"carregando" | "gritando" | "alivio">("carregando");
  const [nivel, setNivel] = useState(0);
  const [frase, setFrase] = useState(FRASES_GRITO[0]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function iniciarGrito() {
    if (gritando) return;
    setFrase(FRASES_GRITO[Math.floor(Math.random() * FRASES_GRITO.length)]);
    setGritando(true);
    setFase("carregando");
    setNivel(0);

    let n = 0;
    intervalRef.current = setInterval(() => {
      n += 5;
      setNivel(n);
      if (n >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setFase("gritando");
        setTimeout(() => {
          setFase("alivio");
          setTimeout(() => {
            setGritando(false);
            setNivel(0);
          }, 1500);
        }, 900);
      }
    }, 70);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <>
      <AnimatePresence>
        {gritando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-red-950/95 backdrop-blur-sm"
          >
            {fase === "carregando" && (
              <motion.div className="px-8 text-center">
                <p className="mb-6 text-xl font-bold text-red-300">Pressão acumulando...</p>
                <div className="mx-auto h-4 w-64 overflow-hidden rounded-full bg-red-900">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                    style={{ width: `${nivel}%` }}
                  />
                </div>
                <p className="mt-6 animate-bounce text-5xl">😤</p>
              </motion.div>
            )}
            {fase === "gritando" && (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: [1, 1.1, 0.95, 1.05, 1] }}
                transition={{ duration: 0.5 }}
                className="px-8 text-center"
              >
                <motion.p
                  animate={{ rotate: [-2, 2, -2, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 0.1 }}
                  className="text-7xl"
                >
                  😱
                </motion.p>
                <p className="mt-4 text-3xl font-black tracking-widest text-white">GRITO INTERNO™</p>
                <p className="mt-3 text-lg font-bold text-red-300">{frase}</p>
              </motion.div>
            )}
            {fase === "alivio" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-8 text-center"
              >
                <p className="text-6xl">😮‍💨</p>
                <p className="mt-4 text-xl font-bold text-green-300">Pressão liberada.</p>
                <p className="mt-2 text-sm text-slate-400">Voltando ao modo profissional.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-[28px] border border-red-900/30 bg-black/25 p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl">🔴</span>
          <div>
            <h2 className="text-lg font-bold text-white">Modo Gritar Corporativo</h2>
            <p className="text-xs text-slate-500">Liberação emocional silenciosa e profissional</p>
          </div>
        </div>
        <div className="mb-4 rounded-[20px] border border-red-900/20 bg-red-950/20 py-8 text-center">
          <p className="text-5xl">😤</p>
          <p className="mt-2 text-xs text-slate-600">Pressão acumulada ao longo da semana</p>
        </div>
        <button
          onClick={iniciarGrito}
          disabled={gritando}
          className="w-full rounded-full bg-red-600 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-red-500 disabled:opacity-50"
        >
          {gritando ? "😱 Gritando internamente..." : "😤 GRITAR INTERNAMENTE™"}
        </button>
        <p className="mt-2 text-center text-xs text-slate-700">
          Seguro, silencioso e 100% profissional.
        </p>
      </div>
    </>
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
        {/* ⭐ Destaque: ocupa largura total */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="md:col-span-2">
          <GeradorLinkedIn />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <RoletaDaSexta />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <TradutorCorporativo />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CartaDemissao />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <ConsultarOGuia />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <QuizArquetipo />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <PrevisaoTempo />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GeradorAta />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <ModGritar />
        </motion.div>
      </div>

      <p className="mt-10 text-center text-xs text-slate-700">
        BurnyOut Ferramentas™ — Produtividade satírica desde 2026
      </p>
    </main>
  );
}
