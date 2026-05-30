"use client";

import { useEffect, useState } from "react";

const PLANILHA: string[][] = [
  ["",  "A",                         "B",        "C",        "D",        "E",        "F",        "G",        "H"       ],
  ["1", "Departamento / Indicador",   "Jan/26",   "Fev/26",   "Mar/26",   "Abr/26",   "Mai/26",   "Jun/26",   "Total H1"],
  ["2", "Receita Bruta (R$)",         "125.000",  "132.000",  "118.500",  "141.200",  "139.800",  "151.000",  "807.500" ],
  ["3", "Custo Direto (R$)",          "48.200",   "51.300",   "45.100",   "54.800",   "53.200",   "58.400",   "311.000" ],
  ["4", "Margem Bruta (R$)",          "76.800",   "80.700",   "73.400",   "86.400",   "86.600",   "92.600",   "496.500" ],
  ["5", "Despesas Operacionais (R$)", "22.100",   "23.400",   "21.800",   "24.900",   "24.100",   "26.300",   "142.600" ],
  ["6", "EBITDA (R$)",                "54.700",   "57.300",   "51.600",   "61.500",   "62.500",   "66.300",   "353.900" ],
  ["7", "",                           "",         "",         "",         "",         "",         "",         ""        ],
  ["8", "Headcount",                  "142",      "142",      "145",      "147",      "148",      "150",      "150"     ],
  ["9", "Turnover %",                 "2,1%",     "1,8%",     "3,2%",     "1,5%",     "2,0%",     "1,9%",     "avg 2,1%"],
  ["10","NPS Interno",                "34",       "36",       "29",       "38",       "35",       "37",       "avg 34,8"],
  ["11","",                           "",         "",         "",         "",         "",         "",         ""        ],
  ["12","Meta Anual (R$)",            "1.650.000","",         "",         "",         "",         "",         ""        ],
  ["13","Realizado H1 (R$)",          "807.500",  "",         "",         "",         "",         "",         ""        ],
  ["14","% Atingimento",              "48,9%",    "",         "",         "",         "",         "",         ""        ],
  ["15","",                           "",         "",         "",         "",         "",         "",         ""        ],
  ["16","Obs.: Dados sujeitos a revisão contábil após fechamento Q2/26","","","","","","",""],
  ["17","Responsável: Gerência de FP&A — atualizado em 30/05/2026","","","","","","",""],
];

const COLS = ["", "A", "B", "C", "D", "E", "F", "G", "H"];

function celFormula(col: string, row: number): string {
  if (col === "H" && row >= 2 && row <= 6) return `=SOMA(B${row}:G${row})`;
  if (col === "B" && row === 13) return "=SOMA(B2:G2)";
  if (col === "B" && row === 14) return "=B13/B12";
  return "";
}

export function FingirTrabalho() {
  const [ativo, setAtivo] = useState(false);
  const [celula, setCelula] = useState("B2");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAtivo(false);
      if (e.ctrlKey && e.shiftKey && e.key === "W") {
        e.preventDefault();
        setAtivo((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const celulaCol = celula.replace(/\d/g, "");
  const celulaRow = parseInt(celula.replace(/\D/g, ""));
  const formula = celFormula(celulaCol, celulaRow);

  return (
    <>
      <button
        onClick={() => setAtivo(true)}
        title="Ctrl+Shift+W — Gerador de desculpas corporativas"
        className="fixed bottom-6 right-4 z-[9998] flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(130,87,255,0.5)] transition-all hover:scale-105 hover:shadow-[0_4px_32px_rgba(255,107,44,0.55)] active:scale-95 sm:bottom-6 sm:right-6"
        style={{
          background: "linear-gradient(135deg,#8257ff,#ff6b2c)",
          paddingBottom: "max(0.625rem, calc(0.625rem + env(safe-area-inset-bottom, 0px)))",
        }}
      >
        👔 <span>Boss chegou</span>
      </button>

      {ativo && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col overflow-hidden select-none"
          style={{ fontFamily: "Calibri, 'Segoe UI', Arial, sans-serif", fontSize: 13 }}
        >
          {/* Barra de título */}
          <div className="flex items-center justify-between bg-[#217346] px-3 py-0.5 text-white text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-base">🗎</span>
              <span>Orçamento_Q3_2026_FINAL_v3_REVISADO.xlsx — Microsoft Excel</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="cursor-pointer hover:bg-white/20 px-2">−</span>
              <span className="cursor-pointer hover:bg-white/20 px-2">□</span>
              <span className="cursor-pointer hover:bg-red-600 px-2" onClick={() => setAtivo(false)}>✕</span>
            </div>
          </div>

          {/* Ribbon */}
          <div className="bg-[#217346] px-2 shrink-0">
            <div className="flex text-white text-xs">
              {["Arquivo", "Página Inicial", "Inserir", "Layout da Página", "Fórmulas", "Dados", "Revisão", "Exibir", "Ajuda"].map((m) => (
                <span key={m} className="py-1 px-2.5 cursor-pointer hover:bg-white/20 rounded-t">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Barra de ferramentas */}
          <div className="bg-[#f0f0f0] border-b border-gray-400 px-2 py-0.5 flex items-center gap-1 text-xs shrink-0">
            {["✂", "⧉", "📋", "|", "B", "I", "U", "|", "≡", "≡", "≡", "|", "%", ",", ".0", "|", "⬆", "🔽", "⬇"].map((t, i) => (
              <span key={i} className={`px-1 py-0.5 cursor-pointer hover:bg-gray-300 rounded ${t === "|" ? "text-gray-400 mx-1" : "font-medium"}`}>
                {t}
              </span>
            ))}
          </div>

          {/* Barra de fórmula */}
          <div className="bg-white border-b border-gray-400 flex items-center text-xs shrink-0" style={{ height: 22 }}>
            <div className="w-16 border-r border-gray-400 px-2 py-0.5 text-center font-medium bg-[#f0f0f0]">
              {celula}
            </div>
            <div className="px-2 flex items-center gap-1 flex-1">
              <span className="text-gray-400 font-bold italic">fx</span>
              <span className="text-[#217346]">{formula || (celulaRow >= 2 && celulaRow <= 6 && celulaCol === "A" ? PLANILHA[celulaRow]?.[1] : "")}</span>
            </div>
          </div>

          {/* Planilha */}
          <div className="flex-1 overflow-auto bg-white">
            <table className="border-collapse text-xs" style={{ tableLayout: "fixed", minWidth: 920 }}>
              <colgroup>
                <col style={{ width: 30 }} />
                <col style={{ width: 230 }} />
                {[...Array(7)].map((_, i) => <col key={i} style={{ width: 90 }} />)}
              </colgroup>
              <thead>
                <tr>
                  {PLANILHA[0].map((h, ci) => (
                    <th
                      key={ci}
                      className="border border-gray-400 bg-[#f0f0f0] text-center text-gray-700 font-normal py-0.5 sticky top-0 z-10"
                      style={{ height: 18 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLANILHA.slice(1).map((row, ri) => {
                  const rowNum = ri + 1;
                  const isHeader = rowNum === 1;
                  return (
                    <tr key={ri} style={{ height: 20 }}>
                      {row.map((cell, ci) => {
                        const col = COLS[ci];
                        const cellId = ci === 0 ? "" : `${col}${rowNum}`;
                        const isActive = cellId === celula && ci > 0;
                        const isNumber = ci > 1 && !isHeader && cell !== "" && !cell.includes("Obs") && !cell.includes("Resp");
                        return (
                          <td
                            key={ci}
                            onClick={() => ci > 0 && cell !== "" && setCelula(cellId)}
                            className={[
                              "border px-1 py-0.5 overflow-hidden whitespace-nowrap cursor-cell",
                              ci === 0
                                ? "border-gray-400 bg-[#f0f0f0] text-center text-gray-500 font-normal"
                                : "border-gray-200 text-gray-800",
                              isHeader ? "font-semibold bg-[#e8f5e9] text-gray-800 border-gray-400" : "",
                              isNumber ? "text-right" : "",
                              isActive ? "outline outline-2 outline-[#217346] outline-offset-[-2px] bg-[#e8f5e9]" : "",
                            ].filter(Boolean).join(" ")}
                            style={{ maxWidth: ci === 1 ? 230 : 90 }}
                          >
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Abas */}
          <div className="bg-[#f0f0f0] border-t border-gray-400 flex items-end px-1 text-xs shrink-0" style={{ height: 22 }}>
            {["Plan1", "Resumo Executivo", "Headcount", "Projeção H2", "Cenários"].map((tab, i) => (
              <div
                key={tab}
                className={[
                  "px-4 py-0.5 border border-b-0 border-gray-400 cursor-pointer rounded-t",
                  i === 0
                    ? "bg-white font-medium text-gray-800"
                    : "bg-[#d8d8d8] text-gray-600 hover:bg-[#e8e8e8] ml-0.5",
                ].join(" ")}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Barra de status */}
          <div className="bg-[#f0f0f0] border-t border-gray-400 flex items-center justify-between px-3 text-xs text-gray-600 shrink-0" style={{ height: 20 }}>
            <span>Pronto</span>
            <div className="flex gap-6">
              <span>Média: 134.583</span>
              <span>Contagem: 6</span>
              <span>Soma: 807.500</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⊞</span><span>⊡</span><span>⊟</span>
              <input type="range" min={10} max={200} defaultValue={100} className="w-20 h-2 accent-[#217346]" />
              <span>100%</span>
            </div>
          </div>

          {/* Dica ESC */}
          <div className="absolute bottom-8 right-8 bg-black/70 text-white text-xs rounded-lg px-3 py-1.5 pointer-events-none">
            ESC ou <kbd className="bg-white/20 px-1 rounded">✕</kbd> para voltar ao trabalho <em>real</em>
          </div>
        </div>
      )}
    </>
  );
}
