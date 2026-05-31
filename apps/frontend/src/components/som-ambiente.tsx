"use client";

import { useEffect, useRef, useState } from "react";

// Sons gerados via Web Audio API — sem arquivos externos
function createOfficeAudioContext() {
  if (typeof window === "undefined") return null;
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

  // Ruído de fundo (ventilação do escritório)
  function ventilacao() {
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.04;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 200;
    filter.Q.value = 0.5;
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    return { stop: () => { try { source.stop(); } catch { /* já parado */ } } };
  }

  // Teclado mecânico aleatório
  function teclado() {
    function clickKey() {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 800 + Math.random() * 400;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
      const delay = 80 + Math.random() * 250;
      const t = setTimeout(clickKey, delay);
      return t;
    }
    const t = clickKey();
    return { stop: () => clearTimeout(t) };
  }

  // Notificação suave ocasional
  function notificacoes() {
    function ping() {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
      const delay = 8000 + Math.random() * 15000;
      const t = setTimeout(ping, delay);
      return t;
    }
    const t = ping();
    return { stop: () => clearTimeout(t) };
  }

  return { ventilacao, teclado, notificacoes, ctx };
}

const SONS: { id: string; label: string; emoji: string }[] = [
  { id: "ventilacao", label: "Ar condicionado", emoji: "❄️" },
  { id: "teclado", label: "Teclado mecânico", emoji: "⌨️" },
  { id: "notificacoes", label: "Notificações", emoji: "🔔" },
];

export function SomAmbiente() {
  const [ativo, setAtivo] = useState(false);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set(["ventilacao", "teclado"]));
  const [aberto, setAberto] = useState(false);
  const audioRef = useRef<{
    ventilacao?: { stop: () => void };
    teclado?: { stop: () => void };
    notificacoes?: { stop: () => void };
    ctx?: AudioContext;
  }>({});

  function pararTudo() {
    audioRef.current.ventilacao?.stop();
    audioRef.current.teclado?.stop();
    audioRef.current.notificacoes?.stop();
    audioRef.current = {};
  }

  function iniciar() {
    const engine = createOfficeAudioContext();
    if (!engine) return;
    audioRef.current.ctx = engine.ctx;
    if (selecionados.has("ventilacao")) audioRef.current.ventilacao = engine.ventilacao();
    if (selecionados.has("teclado")) audioRef.current.teclado = engine.teclado();
    if (selecionados.has("notificacoes")) audioRef.current.notificacoes = engine.notificacoes();
  }

  function toggle() {
    if (ativo) {
      pararTudo();
    } else {
      iniciar();
    }
    setAtivo((v) => !v);
  }

  function toggleSom(id: string) {
    setSelecionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Reiniciar sons quando selecionados mudam enquanto ativo
  useEffect(() => {
    if (!ativo) return;
    pararTudo();
    iniciar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecionados]);

  useEffect(() => {
    return () => pararTudo();
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <button
          onClick={toggle}
          title={ativo ? "Parar som ambiente" : "Som de escritório"}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
            ativo
              ? "border-violet/40 bg-violet/10 text-violet"
              : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          {ativo ? "🔊" : "🔇"}{" "}
          <span className="hidden sm:inline">{ativo ? "Som ativo" : "Escritório"}</span>
        </button>
        {ativo && (
          <button
            onClick={() => setAberto((v) => !v)}
            className="rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            ⚙️
          </button>
        )}
      </div>

      {aberto && ativo && (
        <div className="absolute right-0 top-10 z-50 w-48 rounded-2xl border border-white/10 bg-[#0f1018] p-3 shadow-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Sons ativos</p>
          {SONS.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5">
              <input
                type="checkbox"
                checked={selecionados.has(s.id)}
                onChange={() => toggleSom(s.id)}
                className="accent-violet"
              />
              <span className="text-sm text-slate-300">{s.emoji} {s.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
