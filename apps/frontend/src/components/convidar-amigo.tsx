"use client";

import { Check, Copy, Loader2, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ConviteAmigo, api } from "@/lib/api";
import { auth } from "@/lib/auth";

const TIPOS = [
  { key: "amigo",            emoji: "🫂", label: "Amigo",                  desc: "Aquele que te aguentou desabafar" },
  { key: "colega_trabalho",  emoji: "💼", label: "Colega de trabalho",      desc: "Compartilham a mesma dor diária" },
  { key: "conhecido_almoco", emoji: "🍽️", label: "Conhecido do almoço",     desc: "Só vê na hora do RU" },
  { key: "colega_profissao", emoji: "🤝", label: "Colega de profissão",     desc: "Mesma área, burnout diferente" },
  { key: "conhecido",        emoji: "👋", label: "Conhecido",               desc: "Tem no LinkedIn mas nunca falou" },
];

const BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://frontend-production-db69.up.railway.app";

export function ConvidarAmigo() {
  const [aberto, setAberto] = useState(false);
  const [convites, setConvites] = useState<Record<string, ConviteAmigo>>({});
  const [carregando, setCarregando] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  // Fecha com ESC
  useEffect(() => {
    if (!aberto) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setAberto(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [aberto]);

  async function abrirModal() {
    setAberto(true);
    const token = auth.getToken();
    if (!token) return;
    try {
      const lista = await api.getConvites(token);
      const mapa: Record<string, ConviteAmigo> = {};
      lista.forEach((c) => { mapa[c.tipo_relacao] = c; });
      setConvites(mapa);
    } catch { /* sem convites ainda */ }
  }

  async function gerarLink(tipo: string) {
    const token = auth.getToken();
    if (!token) return;
    setCarregando(tipo);
    try {
      const convite = await api.gerarConvite(token, tipo);
      setConvites((prev) => ({ ...prev, [tipo]: convite }));
    } finally {
      setCarregando(null);
    }
  }

  async function copiar(codigo: string) {
    const link = `${BASE_URL}/onboarding?convite=${codigo}`;
    await navigator.clipboard.writeText(link);
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2500);
  }

  const token = auth.getToken();
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
          <div className="glass-panel w-full max-w-lg rounded-t-[28px] p-6 sm:rounded-[28px] sm:p-8">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Rede em colapso</p>
                <h2 className="mt-1 text-xl font-bold text-white">Convidar pessoas</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Gere um link por tipo de relação. Eles chegam com contexto.
                </p>
              </div>
              <button
                onClick={() => setAberto(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Lista de tipos */}
            <div className="space-y-3">
              {TIPOS.map(({ key, emoji, label, desc }) => {
                const convite = convites[key];
                const link = convite ? `${BASE_URL}/onboarding?convite=${convite.codigo}` : null;
                const isLoading = carregando === key;
                const isCopied = convite && copiado === convite.codigo;

                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-3"
                  >
                    {/* Emoji + info */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/8 text-xl">
                      {emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="truncate text-xs text-slate-500">{desc}</p>
                      {link && (
                        <p className="mt-0.5 truncate text-xs text-violet/80">{link}</p>
                      )}
                    </div>

                    {/* Ação */}
                    {convite ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs text-slate-500">{convite.usos} uso{convite.usos !== 1 ? "s" : ""}</span>
                        <button
                          onClick={() => void copiar(convite.codigo)}
                          className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                        >
                          {isCopied ? (
                            <><Check className="h-3 w-3 text-emerald-400" /><span className="text-emerald-400">Copiado</span></>
                          ) : (
                            <><Copy className="h-3 w-3" />Copiar</>
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => void gerarLink(key)}
                        disabled={isLoading}
                        className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold text-black transition-all hover:scale-105 disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg,#8257ff,#ff6b2c)" }}
                      >
                        {isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Gerar link"
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-5 text-center text-xs text-slate-600">
              O link leva para o cadastro já identificando quem te convidou e como.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
