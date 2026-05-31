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
];
const CARGOS_LINKEDIN = [
  "Pixel Architect", "Synergy Engineer", "Growth Hacker", "Digital Transformer",
  "Agile Warrior", "Blockchain Philosopher", "AI Whisperer", "Disruption Specialist",
  "Innovation Catalyst", "Fullstack Visionary", "Vibe Officer", "Metaverse Janitor",
  "Scrum Master of the Universe", "Chief Feelings Engineer", "NFT Strategist",
  "Web3 Dream Weaver", "Burnout Consultant", "Pivot Specialist", "PowerPoint Artist",
  "Spreadsheet Poet", "Meeting Architect", "Buzzword Sommelier",
];
const QUALIFICADORES_LINKEDIN = [
  "| Disruption Enthusiast 🔥", "| Open to Work 👀", "| Keynote Speaker (em eventos de 8 pessoas)",
  "| Building the Future™", "| 10x Engineer (nos cafés)", "| Thought Leader",
  "| Helping companies scale 🚀", "| Ex-Google (estagiário 3 semanas em 2019)",
  "| Autor do livro que ninguém leu", "| TEDx Speaker (organizei o meu próprio)",
  "| Mudando o mundo um deck por vez", "| Disponível para mentorias não remuneradas",
  "| Inventor do Framework que ninguém adotou",
];
const HASHTAGS_LINKEDIN = [
  "#GrowthMindset #Leadership #Innovation #Gratidão",
  "#OpenToWork #Disruption #BuildingTheFuture #Blessed",
  "#AgileLeadership #DigitalTransformation #SeiLáOQuê",
  "#Blockchain #AI #Metaverse #NFT #Web3 #TheFuture",
  "#Empreendedorismo #Propósito #Foco #Mindset #Flow",
  "#LiderandoComPropósito #InovaçãoRadical #Sinergia",
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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <ConsultarOGuia />
        </motion.div>
      </div>

      <p className="mt-10 text-center text-xs text-slate-700">
        BurnyOut Ferramentas™ — Produtividade satírica desde 2026
      </p>
    </main>
  );
}
