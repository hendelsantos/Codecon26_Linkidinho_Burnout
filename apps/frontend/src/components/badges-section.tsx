"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/lib/api";

function BadgeModal({ badge, onClose }: { badge: Badge; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Card */}
        <motion.div
          className="relative z-10 w-full max-w-sm rounded-[32px] border p-8 text-center"
          style={{
            background: badge.earned
              ? "linear-gradient(135deg, #1a1040 0%, #0f0c2e 100%)"
              : "linear-gradient(135deg, #0f1018 0%, #0a0d14 100%)",
            borderColor: badge.earned ? "rgba(130, 87, 255, 0.4)" : "rgba(255,255,255,0.08)",
            boxShadow: badge.earned ? "0 0 60px rgba(130,87,255,0.2)" : "none",
          }}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 10 }}
          transition={{ type: "spring", bounce: 0.35 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Emoji */}
          <motion.div
            className="text-7xl"
            animate={badge.earned ? { scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {badge.earned ? badge.emoji : "🔒"}
          </motion.div>

          {/* Status pill */}
          <div className="mt-4 flex justify-center">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase ${
                badge.earned
                  ? "border-violet/50 bg-violet/20 text-violet"
                  : "border-white/10 bg-white/5 text-slate-500"
              }`}
            >
              {badge.earned ? "✓ Conquistada" : "Bloqueada"}
            </span>
          </div>

          {/* Nome */}
          <h2
            className={`mt-4 text-2xl font-bold ${
              badge.earned ? "text-white" : "text-slate-500"
            }`}
          >
            {badge.name}
          </h2>

          {/* Descrição */}
          <p className="mt-3 text-sm leading-6 text-slate-400">{badge.description}</p>

          {/* Mensagem extra se conquistada */}
          {badge.earned && (
            <motion.p
              className="mt-4 text-xs text-violet/80 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Seu sofrimento foi oficialmente reconhecido.
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function BadgesSection({ badges }: { badges: Badge[] }) {
  const [selected, setSelected] = useState<Badge | null>(null);

  if (badges.length === 0) return null;

  const earned = badges.filter((b) => b.earned).length;

  return (
    <>
      <div className="glass-panel rounded-[32px] p-6">
        {/* Header com progress */}
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Conquistas</p>
          <span className="text-xs font-semibold text-slate-400">
            <span className="text-white">{earned}</span>/{badges.length}
          </span>
        </div>

        {/* Barra de progresso */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #8257ff, #f97316)" }}
            initial={{ width: 0 }}
            animate={{ width: `${(earned / badges.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Grid */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {badges.map((b, i) => (
            <motion.button
              key={b.id}
              onClick={() => setSelected(b)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`group relative flex flex-col items-center rounded-[20px] border p-4 text-center transition-all ${
                b.earned
                  ? "border-violet/30 bg-violet/10 hover:border-violet/50 hover:bg-violet/15"
                  : "border-white/5 bg-black/20 opacity-50 hover:opacity-70"
              }`}
            >
              {/* Glow nos conquistados */}
              {b.earned && (
                <div className="absolute inset-0 rounded-[20px] opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ boxShadow: "inset 0 0 20px rgba(130,87,255,0.15)" }}
                />
              )}

              <span className="text-3xl">{b.earned ? b.emoji : "🔒"}</span>
              <p
                className={`mt-2 text-xs font-semibold leading-4 ${
                  b.earned ? "text-white" : "text-slate-600"
                }`}
              >
                {b.name}
              </p>
              {b.earned && (
                <span className="mt-1.5 text-[10px] font-medium text-violet/70">
                  ver detalhes →
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <BadgeModal badge={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
