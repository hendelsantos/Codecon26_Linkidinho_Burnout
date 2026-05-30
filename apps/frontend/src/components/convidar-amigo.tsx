"use client";

import { Check, Copy, Loader2, RefreshCw, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ConviteAmigo, api } from "@/lib/api";
import { auth } from "@/lib/auth";

// ──── Tipos de relação ────────────────────────────────────────────────────────

const TIPOS = [
  { key: "amigo",            emoji: "🫂", label: "Amigo de verdade" },
  { key: "colega_trabalho",  emoji: "💼", label: "Colega de trabalho" },
  { key: "conhecido_almoco", emoji: "🍽️", label: "Conhecido do almoço" },
  { key: "colega_profissao", emoji: "🤝", label: "Colega de profissão" },
  { key: "conhecido",        emoji: "👋", label: "Conhecido" },
];

// ──── Mensagens cômicas por tipo ──────────────────────────────────────────────

const MENSAGENS: Record<string, string[]> = {
  amigo: [
    `🔥 Ei! Você que me aguentou reclamar do trabalho sem me bloquear merece isso:\n\nEntrei no *BurnyOut* — a rede social que mede o quanto você tá perto do colapso profissional. É tipo LinkedIn, mas honesto.\n\nSe você se identificar com os outros usuários, é sinal de que a gente precisa de terapia juntos.\n\n👇 Entra por esse link:\n`,
    `😭 Amigo! Achei uma rede que transforma sofrimento corporativo em analytics.\n\nPor que te mando isso? Porque você já sabe de tudo que eu passo no trabalho e vai entender os gráficos melhor do que ninguém.\n\nP.S: Se o seu score de burnout for maior que o meu, a gente não é mais amigo.\n\n👇\n`,
    `🏆 Oi! Lembra quando eu disse que ia entrar em colapso? Então... encontrei uma rede que monitora isso profissionalmente.\n\nTô te convidando pra você poder dizer "eu avisei" com dados em mãos.\n\n👇 Acesse:\n`,
    `💀 Você, que é meu amigo mais próximo, precisa ver meus gráficos de burnout.\n\nVai entender muita coisa da minha personalidade ultimamente.\n\nEntra no *BurnyOut* 👇\n`,
  ],
  colega_trabalho: [
    `💼 Oi! Você, que divide comigo as reuniões que poderiam ser e-mail, o café aguado e o mesmo sofrimento silencioso.\n\nEncontrei uma rede que mede burnout corporativo com gráficos sérios. Acho que vai se sair bem no ranking.\n\n⚠️ Não mostra pro RH.\n\n👇\n`,
    `🔥 Colega de trabalho! Um de nós dois vai aparecer no ranking dos mais estressados.\n\nQuero que a competição seja justa. Entra no *BurnyOut* e veja onde você está.\n\n👇\n`,
    `💀 Ei! Tô te mandando isso porque você é a única pessoa que entende quando eu digo "aquela reunião de alinhamento de alinhamento".\n\nTem uma rede de burnout corporativo. Você vai se sentir visto.\n\n👇\n`,
    `😅 A gente trabalha junto, sofre junto. Faz sentido entrar junto nessa rede que mede o sofrimento com dados.\n\nSe o seu burnout score for menor que o meu, eu peço demissão.\n\n👇 *BurnyOut*:\n`,
  ],
  conhecido_almoco: [
    `🍽️ Ei! Eu sei que a gente só se fala na fila do bandejão, mas olha que oportunidade de aprofundar o relacionamento.\n\nTem uma rede social de burnout que vai fazer a gente conversar sobre algo além do cardápio.\n\nVem fazer parte da família dos que aparecem mesmo assim.\n\n👇\n`,
    `😂 Oi! Você é a minha prova de que tenho vida social no trabalho.\n\nPra celebrar isso, tô te convidando pro *BurnyOut* — a rede que mede sofrimento corporativo.\n\nFinalmente algo que vai além do "tá bom, e você?" do almoço.\n\n👇\n`,
    `🍽️ Olha, a gente se vê todo dia mas nunca passa do "e aí?".\n\nTô quebrando esse ciclo: entra no *BurnyOut*, a rede social de burnout corporativo. Pelo menos vamos sofrer juntos de forma organizada.\n\n👇\n`,
    `😅 Ei, conhecido do almoço!\n\nVocê é a pessoa que me faz acreditar que tenho networking. Por isso, primeiro convite vai pra você.\n\n*BurnyOut* — onde a gente mede o burnout que acumula desde a janta até o próximo almoço.\n\n👇\n`,
  ],
  colega_profissao: [
    `🤝 Colega de área! Você entende a luta.\n\nEncontrei uma rede que transforma sofrimento profissional em analytics. É o mais próximo de validação que vamos conseguir.\n\nVem sofrer com mais organização 👇\n`,
    `😅 Ei! Sabe como a gente da nossa área não tem quem nos entenda?\n\nTem uma rede que pelo menos mede o nível de sofrimento com dados.\n\nSeu burnout deve estar no mesmo nível que o meu. Vamos comparar?\n\n👇 *BurnyOut*:\n`,
    `💀 Colega de profissão! Primeiro convite vai pra quem entende o que é acordar às 6h, ter 3 reuniões antes do almoço e ainda entregar.\n\nEntra no *BurnyOut*. A rede que enfim leva o nosso sofrimento a sério.\n\n👇\n`,
    `🔥 Ei! A gente não precisa trabalhar na mesma empresa pra compartilhar o mesmo burnout.\n\nTem uma rede que mede isso com gráficos e tudo. Colegas de profissão devem aparecer no ranking junto.\n\n👇\n`,
  ],
  conhecido: [
    `👋 Oi! A gente se conhece, né? Ou se segue no LinkedIn. Ou tem amigos em comum. Alguma dessas.\n\nDe qualquer forma, tô te convidando pro *BurnyOut* porque você parece ser alguém que trabalha muito também.\n\nVocê pode me ignorar. Mas entra lá primeiro.\n\n👇\n`,
    `😅 Oi! Tô enviando esse convite pra você porque apareceu no meu contato e sei lá, vibe.\n\n*BurnyOut* é uma rede de burnout corporativo com gráficos sérios e humor sem toxicidade.\n\nNão precisa me responder. Só entra lá.\n\n👇\n`,
    `👋 Ei! Primeiro convite que você recebe de alguém que quase não te conhece mas quer sua companhia mesmo assim.\n\n*BurnyOut* — rede social que mede o colapso profissional. Entre como conhecido mesmo. É uma categoria oficial.\n\n👇\n`,
    `😂 Olha, você é meu "conhecido". Nem amigo, nem colega — mas também não é ninguém.\n\nPor isso, convite especial da categoria "conhecido" pro *BurnyOut*, a rede de burnout corporativo.\n\nNunca se sabe, pode virar amigo depois que você ver meus gráficos de sofrimento.\n\n👇\n`,
  ],
};

function msgAleatoria(tipo: string, excluir?: string): string {
  const lista = MENSAGENS[tipo] ?? MENSAGENS["conhecido"];
  const opcoes = lista.filter((m) => m !== excluir);
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

// ──── URLs ───────────────────────────────────────────────────────────────────

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return "https://frontend-production-db69.up.railway.app";
}

// ──── Componente principal ────────────────────────────────────────────────────

export function ConvidarAmigo() {
  const [token, setToken] = useState<string | null>(null);
  const [aberto, setAberto] = useState(false);
  const [convites, setConvites] = useState<Record<string, ConviteAmigo>>({});
  const [carregando, setCarregando] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<Record<string, string>>({});
  const [erro, setErro] = useState<string | null>(null);

  // Lê o token após a montagem (evita hydration mismatch)
  useEffect(() => {
    setToken(auth.getToken());
  }, []);

  // Fecha com ESC
  useEffect(() => {
    if (!aberto) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setAberto(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [aberto]);

  async function abrirModal() {
    setAberto(true);
    setErro(null);
    const tk = auth.getToken();
    if (!tk) return;
    try {
      const lista = await api.getConvites(tk);
      const mapa: Record<string, ConviteAmigo> = {};
      lista.forEach((c) => { mapa[c.tipo_relacao] = c; });
      setConvites(mapa);
    } catch { /* sem convites ainda — normal */ }
  }

  function toggleExpandir(key: string) {
    setExpandido((prev) => (prev === key ? null : key));
    // Gera mensagem inicial ao expandir se ainda não tem
    if (!mensagens[key]) {
      setMensagens((prev) => ({ ...prev, [key]: msgAleatoria(key) }));
    }
  }

  function novaMsg(key: string) {
    setMensagens((prev) => ({
      ...prev,
      [key]: msgAleatoria(key, prev[key]),
    }));
  }

  async function gerarLink(tipo: string) {
    const tk = auth.getToken();
    if (!tk) return;
    setCarregando(tipo);
    setErro(null);
    try {
      const convite = await api.gerarConvite(tk, tipo);
      setConvites((prev) => ({ ...prev, [tipo]: convite }));
    } catch {
      setErro("Erro ao gerar link. Verifique se você está logado e tente novamente.");
    } finally {
      setCarregando(null);
    }
  }

  async function copiarLink(codigo: string) {
    const link = `${getBaseUrl()}/onboarding?convite=${codigo}`;
    await navigator.clipboard.writeText(link);
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2500);
  }

  function abrirWhatsApp(tipo: string, codigo: string) {
    const link = `${getBaseUrl()}/onboarding?convite=${codigo}`;
    const msg = (mensagens[tipo] ?? msgAleatoria(tipo)) + link;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Não renderiza nada até confirmar que tem token (após montagem no cliente)
  if (!token) return null;

  return (
    <>
      {/* Botão de trigger */}
      <button
        onClick={abrirModal}
        title="Convidar pessoas"
        className="fixed bottom-[5.5rem] right-4 z-[9997] flex h-12 w-12 items-center justify-center rounded-full shadow-[0_0_24px_rgba(130,87,255,0.5)] transition-all hover:scale-110 sm:right-6"
        style={{ background: "linear-gradient(135deg,#8257ff,#ff6b2c)" }}
        aria-label="Convidar pessoas"
      >
        <Share2 className="h-5 w-5 text-black" />
      </button>

      {/* Modal */}
      {aberto && (
        <div
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={(e) => { if (e.target === e.currentTarget) setAberto(false); }}
        >
          <div className="glass-panel w-full max-w-lg rounded-t-[28px] sm:rounded-[28px] flex flex-col max-h-[90vh]">
            {/* Header fixo */}
            <div className="flex items-start justify-between p-6 pb-4 sm:p-8 sm:pb-4 shrink-0">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Crescer a rede</p>
                <h2 className="mt-1 text-xl font-bold text-white">Convidar pelo WhatsApp</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Escolha o tipo de relação — cada um tem mensagem cômica própria.
                </p>
              </div>
              <button
                onClick={() => setAberto(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Lista scrollável */}
            <div className="overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8 space-y-3">
              {/* Banner de erro */}
              {erro && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                  {erro}
                </div>
              )}
              {TIPOS.map(({ key, emoji, label }) => {
                const convite = convites[key];
                const isLoading = carregando === key;
                const isExpanded = expandido === key;
                const isCopied = convite && copiado === convite.codigo;
                const msg = mensagens[key] ?? "";

                return (
                  <div
                    key={key}
                    className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden"
                  >
                    {/* Linha do tipo — clicável para expandir */}
                    <button
                      onClick={() => toggleExpandir(key)}
                      className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-white/5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/8 text-xl">
                        {emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{label}</p>
                        {convite && (
                          <p className="text-xs text-slate-500">
                            {convite.usos} pessoa{convite.usos !== 1 ? "s" : ""} entraram por esse link
                          </p>
                        )}
                      </div>
                      <span className="text-slate-500 text-xs pr-1">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </button>

                    {/* Conteúdo expandido */}
                    {isExpanded && (
                      <div className="border-t border-white/8 p-3 space-y-3">
                        {/* Preview da mensagem */}
                        <div className="rounded-xl bg-black/30 border border-white/8 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500">
                              Prévia da mensagem
                            </p>
                            <button
                              onClick={() => novaMsg(key)}
                              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                            >
                              <RefreshCw className="h-2.5 w-2.5" /> outra
                            </button>
                          </div>
                          <p className="text-xs text-slate-300 whitespace-pre-line leading-5">
                            {msg || msgAleatoria(key)}
                            {convite && (
                              <span className="text-violet/70">{getBaseUrl()}/onboarding?convite={convite.codigo}</span>
                            )}
                            {!convite && (
                              <span className="text-slate-600 italic">[link gerado aqui]</span>
                            )}
                          </p>
                        </div>

                        {/* Ações */}
                        {!convite ? (
                          <button
                            onClick={() => void gerarLink(key)}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-black transition-all hover:scale-[1.02] disabled:opacity-60"
                            style={{ background: "linear-gradient(135deg,#8257ff,#ff6b2c)" }}
                          >
                            {isLoading ? (
                              <><Loader2 className="h-4 w-4 animate-spin" /> Gerando link...</>
                            ) : (
                              "✨ Gerar meu link de convite"
                            )}
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            {/* WhatsApp — botão principal */}
                            <button
                              onClick={() => abrirWhatsApp(key, convite.codigo)}
                              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] bg-[#25D366] hover:bg-[#1ebe5d]"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              Enviar no WhatsApp
                            </button>

                            {/* Copiar link — secundário */}
                            <button
                              onClick={() => void copiarLink(convite.codigo)}
                              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                            >
                              {isCopied ? (
                                <><Check className="h-3.5 w-3.5 text-emerald-400" /><span className="text-emerald-400">Copiado</span></>
                              ) : (
                                <><Copy className="h-3.5 w-3.5" />Link</>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="shrink-0 pb-5 text-center text-xs text-slate-600 px-6">
              Cada link é único por tipo. Quem entrar via seu link chega identificado como sua indicação.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
