"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, MapPin, RefreshCw, X } from "lucide-react";
import { useState } from "react";

interface Plano {
  emoji: string;
  nome: string;
  subtitulo: string;
  passos: string[];
  financeiro: string;
  emocional: string;
  prazo: string;
  chance: string;
}

const PLANOS: Plano[] = [
  {
    emoji: "🥖",
    nome: "Padaria Artesanal",
    subtitulo: "O clássico plano da autossabotagem bem-intencionada",
    passos: [
      "Assistir 47 vídeos de sourdough no YouTube",
      "Comprar R$800 em equipamentos que vão encostar",
      "Fazer um pão. Ficar orgulhoso. Parar por aí.",
      "Abrir CNPJ 'só para ter' e nunca usar",
    ],
    financeiro: "NULA",
    emocional: "MUITO ALTA",
    prazo: "Sempre 'no próximo mês'",
    chance: "3%",
  },
  {
    emoji: "🏖️",
    nome: "Nômade Digital no Nordeste",
    subtitulo: "Trabalhar remotamente mas de bermuda e sem WiFi",
    passos: [
      "Alugar flat em Jericoacoara por R$4.000/mês",
      "Descobrir que o WiFi cai exatamente na daily",
      "Fazer as mesmas reuniões, só que com areia nos pés",
      "Voltar para SP com a mesma síndrome mas bronzeado",
    ],
    financeiro: "BAIXA",
    emocional: "ALTA",
    prazo: "Próximas férias (nunca aprovadas)",
    chance: "18%",
  },
  {
    emoji: "🌱",
    nome: "Fazendeiro no Interior",
    subtitulo: "Plantar alface e desligar o celular definitivamente",
    passos: [
      "Pesquisar 'terreno interior SP' sem comprar nada",
      "Dizer para a família que vai se mudar para o campo",
      "Continuar no mesmo emprego por mais 8 anos",
      "Plantar uma cebolinha na varanda como compensação",
    ],
    financeiro: "MÉDIA",
    emocional: "MÁXIMA",
    prazo: "Quando ganhar na loteria",
    chance: "7%",
  },
  {
    emoji: "💻",
    nome: "Freelancer Independente",
    subtitulo: "Mesma coisa, mas sem plano de saúde ou 13º",
    passos: [
      "Pedir demissão com raiva numa segunda-feira às 9h",
      "Cobrar R$150/hora e descobrir que ninguém paga",
      "Cobrar R$80/hora. Trabalhar mais que antes.",
      "Ser seu próprio chefe e se demitir mentalmente todo dia",
    ],
    financeiro: "INCERTA",
    emocional: "BAIXA",
    prazo: "Quando tiver reserva de 6 meses",
    chance: "31%",
  },
  {
    emoji: "🧘",
    nome: "Retiro Espiritual",
    subtitulo: "14 dias sem Slack em Alter do Chão",
    passos: [
      "Pagar R$3.000 por silêncio forçado",
      "Desinstalar o Slack. Reinstalar no terceiro dia.",
      "Ler 'O Poder do Agora' sem entender nada",
      "Voltar transformado por exatamente 11 dias",
    ],
    financeiro: "MÉDIA",
    emocional: "TEMPORARIAMENTE ALTA",
    prazo: "Depende de aprovação do gestor",
    chance: "22%",
  },
  {
    emoji: "📚",
    nome: "Concurso Público",
    subtitulo: "A fuga dentro do sistema. A mais lenta de todas.",
    passos: [
      "Comprar apostila de R$400. Não abrir.",
      "Pagar taxa de inscrição. Esquecer a data da prova.",
      "Estudar 3 semanas intensas + desistir no quarto",
      "Repetir o ciclo por 4 a 7 anos consecutivos",
    ],
    financeiro: "ALTA (se passar em 2031)",
    emocional: "LENTAMENTE DESTRUÍDA",
    prazo: "Próximo edital. Ou o seguinte.",
    chance: "12%",
  },
  {
    emoji: "🎙️",
    nome: "Influencer de Bem-Estar",
    subtitulo: "Monetizar o sofrimento alheio para curar o próprio",
    passos: [
      "Criar conta no LinkedIn com 'especialista em burnout'",
      "Postar thread sobre síndrome do impostor às 7h da manhã",
      "Conseguir 4.300 curtidas e sentir que está curado",
      "Ter burnout de criar conteúdo sobre burnout",
    ],
    financeiro: "IMPROVÁVEL",
    emocional: "PARADOXAL",
    prazo: "Assim que tiver 10k seguidores",
    chance: "8%",
  },
  {
    emoji: "🚢",
    nome: "Aposentadoria Antecipada",
    subtitulo: "Com os juros da poupança. Em 2087.",
    passos: [
      "Calcular o número do FIRE. Chorar discretamente.",
      "Cortar o café para economizar R$12 por mês",
      "Investir R$400 em CDB de 10% a.a.",
      "Revisitar o plano com 68 anos de idade",
    ],
    financeiro: "MATEMATICAMENTE POSSÍVEL",
    emocional: "COMPLETAMENTE NEGADA",
    prazo: "2087 (conservador)",
    chance: "1%",
  },
];

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPlano(plano: Plano): string {
  const W = 800, H = 520;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Fundo
  ctx.fillStyle = "#050d0a";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#ffffff04";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Header bar
  ctx.fillStyle = "#091a10";
  ctx.fillRect(0, 0, W, 56);

  const accent = ctx.createLinearGradient(0, 0, W, 0);
  accent.addColorStop(0, "#22c55e");
  accent.addColorStop(0.5, "#3b82f6");
  accent.addColorStop(1, "#8257ff");
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 56); ctx.lineTo(W, 56); ctx.stroke();

  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 14px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("PLANO DE FUGA CORPORATIVA™", 36, 36);

  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 11px Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`CHANCE DE SUCESSO: ${plano.chance}`, W - 36, 36);

  // Emoji + título
  ctx.font = "64px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(plano.emoji, 36, 135);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px Arial, sans-serif";
  ctx.fillText(plano.nome, 116, 106);

  ctx.fillStyle = "#64748b";
  ctx.font = "14px Arial, sans-serif";
  ctx.fillText(plano.subtitulo, 116, 130);

  // Steps
  ctx.fillStyle = "#22c55e50";
  ctx.font = "bold 10px Arial, sans-serif";
  ctx.fillText("COMO EXECUTAR", 36, 170);

  plano.passos.forEach((passo, i) => {
    const y = 194 + i * 36;
    ctx.fillStyle = "#0f2a18";
    ctx.beginPath(); ctx.arc(50, y - 8, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 11px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(i + 1), 50, y - 4);
    ctx.textAlign = "left";
    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px Arial, sans-serif";
    ctx.fillText(passo, 72, y);
  });

  // Stats
  const sY = 390;
  ctx.strokeStyle = "#ffffff08";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(36, sY - 14); ctx.lineTo(W - 36, sY - 14); ctx.stroke();

  [
    ["💰", "Viabilidade Financeira", plano.financeiro],
    ["❤️", "Viabilidade Emocional", plano.emocional],
    ["⏰", "Prazo estimado", plano.prazo],
  ].forEach(([emoji, label, val], i) => {
    const x = 36 + i * 250;
    ctx.font = "20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(emoji, x, sY + 14);
    ctx.fillStyle = "#334155";
    ctx.font = "10px Arial, sans-serif";
    ctx.fillText(label.toUpperCase(), x + 30, sY + 4);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 12px Arial, sans-serif";
    ctx.fillText(val, x + 30, sY + 20);
  });

  // Footer
  ctx.fillStyle = "#030a06";
  ctx.fillRect(0, H - 44, W, 44);
  ctx.strokeStyle = "#ffffff06";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 44); ctx.lineTo(W, H - 44); ctx.stroke();
  ctx.fillStyle = "#1a3025";
  ctx.font = "12px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "Este plano foi gerado por desespero. Resultados podem variar. Burny Out Corp não se responsabiliza.",
    W / 2, H - 16,
  );

  return canvas.toDataURL("image/png");
}

export function PlanoFuga() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const plano = PLANOS[idx % PLANOS.length];

  function abrir() {
    setIdx(Math.floor(Math.random() * PLANOS.length));
    setOpen(true);
  }

  function gerarOutro() {
    setIdx((i) => (i + 1) % PLANOS.length);
  }

  function baixar() {
    const url = drawPlano(plano);
    const a = document.createElement("a");
    a.download = `plano-fuga-${plano.nome.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.href = url;
    a.click();
  }

  return (
    <>
      <button
        onClick={abrir}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20"
      >
        <MapPin className="h-4 w-4" />
        Gerar Plano de Fuga Corporativa™
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9992] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <motion.div
              className="relative z-10 w-full max-w-md"
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-[28px] border border-emerald-500/20 bg-[#060f0a] p-7">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/60">
                      Plano de Fuga
                    </p>
                    <p className="text-lg font-bold text-white">Corporativa™</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-[20px] border border-white/8 bg-black/30 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-5xl">{plano.emoji}</span>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white">{plano.nome}</h3>
                        <p className="mt-0.5 text-xs text-slate-500">{plano.subtitulo}</p>
                        <span className="mt-2 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                          {plano.chance} de sucesso
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      {plano.passos.map((p, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] font-bold text-emerald-400">
                            {i + 1}
                          </span>
                          <p className="text-xs leading-5 text-slate-400">{p}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/6 pt-4">
                      <div>
                        <p className="text-[10px] uppercase text-slate-600">Financeiro</p>
                        <p className="mt-0.5 text-xs font-semibold text-white">{plano.financeiro}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-600">Emocional</p>
                        <p className="mt-0.5 text-xs font-semibold text-white">{plano.emocional}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-600">Prazo</p>
                        <p className="mt-0.5 text-xs font-semibold text-white">{plano.prazo}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={gerarOutro}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Outro plano
                  </button>
                  <button
                    onClick={baixar}
                    className="flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2.5 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20"
                  >
                    <Download className="h-3 w-3" />
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
