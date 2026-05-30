"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wrapped, api } from "@/lib/api";
import { auth } from "@/lib/auth";

function scoreLavel(avg: number) {
  if (avg >= 80) return "Herói Corporativo em Colapso Iminente";
  if (avg >= 60) return "Sobrevivente de Nível Crítico";
  if (avg >= 40) return "Resistente em Estado de Alerta";
  return "Profissional Funcionalmente Saudável (parabéns, rara espécie)";
}

function stressLabel(avg: number) {
  if (avg >= 4) return "Nível de Ansiedade: Existencial";
  if (avg >= 3) return "Nível de Ansiedade: Corporativa Avançada";
  if (avg >= 2) return "Nível de Ansiedade: Gerenciável";
  return "Nível de Ansiedade: Zen (suspeito)";
}

export default function CertificadoPage() {
  const router = useRouter();
  const [wrapped, setWrapped] = useState<Wrapped | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = auth.getToken();
    if (!token) {
      router.push("/onboarding");
      return;
    }
    api
      .getWrapped(token)
      .then(setWrapped)
      .catch(() => setError("Você ainda não tem check-ins suficientes para gerar o certificado."))
      .finally(() => setLoading(false));
  }, [router]);

  const handlePrint = () => window.print();

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-violet border-t-transparent" />
          Gerando seu certificado de sofrimento...
        </div>
      </main>
    );
  }

  if (error || !wrapped) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mb-4 text-5xl">😔</div>
          <p className="text-slate-300">{error ?? "Erro ao carregar dados."}</p>
          <Link href="/dashboard" className="mt-6 inline-block text-sm text-violet underline">
            ← Voltar ao dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { profile } = wrapped;

  return (
    <>
      {/* Botões de navegação — ocultos na impressão */}
      <div className="no-print flex items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-sm text-slate-400 transition-colors hover:text-white">
          ← Voltar ao dashboard
        </Link>
        <button
          onClick={handlePrint}
          className="burn-gradient rounded-full px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
        >
          📄 Baixar / Imprimir
        </button>
      </div>

      {/* Certificado */}
      <div className="flex min-h-screen items-center justify-center px-4 py-8 print:min-h-screen print:p-0">
        <div
          ref={certRef}
          className="cert-container relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/12 bg-[#070a17] p-10 shadow-[0_0_120px_rgba(130,87,255,0.15)] sm:p-14 print:rounded-none print:shadow-none"
        >
          {/* Decorações de fundo */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-violet/10 blur-[80px]" />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-ember/10 blur-[60px]" />
          </div>

          {/* Borda decorativa interna */}
          <div className="relative rounded-[20px] border border-white/8 p-8 sm:p-10">

            {/* Cabeçalho */}
            <div className="text-center">
              <div className="mb-2 text-4xl">🔥</div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-violet opacity-80">
                BurnyOut — Analytics Corporativo
              </p>
              <h1 className="mt-3 font-mono text-2xl font-bold uppercase tracking-widest text-white sm:text-3xl">
                Certificado de
              </h1>
              <h2 className="font-mono text-3xl font-bold uppercase tracking-wider text-ember-soft sm:text-4xl">
                Sobrevivência
              </h2>
              <p className="mt-1 font-mono text-lg font-semibold uppercase tracking-widest text-white/60">
                Corporativa
              </p>
            </div>

            {/* Divisor */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
              <span className="text-violet/60">◆</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ember/40 to-transparent" />
            </div>

            {/* Corpo */}
            <div className="text-center">
              <p className="text-sm text-slate-400">Certificamos, com toda a seriedade que o ambiente corporativo merece, que</p>

              <div className="my-5">
                <span className="text-5xl">{profile.emoji}</span>
                <h3 className="mt-2 text-3xl font-bold text-white">{profile.nickname}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {profile.area} · {profile.region}
                </p>
              </div>

              <p className="text-base leading-relaxed text-slate-300">
                sobreviveu heroicamente à sua jornada corporativa, acumulando as seguintes
                <span className="text-ember-soft"> proezas documentadas</span>:
              </p>
            </div>

            {/* Stats */}
            <div className="my-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatBox
                emoji="📅"
                value={wrapped.checkins_total}
                label="dias sobrevividos"
              />
              <StatBox
                emoji="🤝"
                value={wrapped.meetings_total}
                label="reuniões que eram e-mails"
              />
              <StatBox
                emoji="☕"
                value={wrapped.coffees_total}
                label="cafés consumidos"
              />
              <StatBox
                emoji="🚗"
                value={`${wrapped.traffic_hours}h`}
                label="de vida perdida no trânsito"
              />
              <StatBox
                emoji="🚽"
                value={`R$${wrapped.bathroom_revenue_reais.toFixed(2)}`}
                label="de receita no banheiro"
              />
              <StatBox
                emoji="🗣️"
                value={wrapped.buzzwords_total}
                label="buzzwords aguentadas"
              />
            </div>

            {/* Score */}
            <div className="rounded-2xl border border-violet/20 bg-violet/8 px-6 py-4 text-center">
              <p className="text-xs uppercase tracking-widest text-violet opacity-70">Burny Score Médio</p>
              <p className="mt-1 font-mono text-4xl font-bold text-white">{wrapped.burny_score_avg}<span className="text-xl text-slate-500">/100</span></p>
              <p className="mt-1 text-sm font-semibold text-ember-soft">{scoreLavel(wrapped.burny_score_avg)}</p>
              <p className="mt-0.5 text-xs text-slate-500">{stressLabel(wrapped.stress_avg)}</p>
            </div>

            {/* Nota de rodapé cômica */}
            <p className="mt-6 text-center text-xs italic text-slate-600">
              Este certificado não substitui terapia, descanso ou uma saída digna do mercado de trabalho.
              <br />
              BurnyOut não se responsabiliza por danos causados pelo ambiente corporativo mencionado acima.
            </p>

            {/* Divisor */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-white/20">◆</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Assinatura */}
            <div className="flex items-end justify-between">
              <div>
                <div className="mb-1 h-px w-36 bg-white/20" />
                <p className="text-xs text-slate-500">Departamento de Analytics</p>
                <p className="text-xs font-semibold text-slate-400">BurnyOut Corp.</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Emitido em</p>
                <p className="text-xs font-semibold text-slate-400">{today}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Estilos de impressão */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .cert-container {
            border: 2px solid #333 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </>
  );
}

function StatBox({
  emoji,
  value,
  label,
}: {
  emoji: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-center">
      <div className="text-2xl">{emoji}</div>
      <div className="mt-1 font-mono text-xl font-bold text-white">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500">{label}</div>
    </div>
  );
}
