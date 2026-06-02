"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000/api";

export function PageViewTracker() {
  const pathname = usePathname();
  const lastPinged = useRef<string | null>(null);

  useEffect(() => {
    // Evita pingar a mesma rota duas vezes seguidas (StrictMode / hot reload)
    if (lastPinged.current === pathname) return;
    lastPinged.current = pathname;

    const payload = {
      path: pathname,
      referer: document.referrer ?? "",
    };

    // Usa sendBeacon quando disponível (não bloqueia navegação)
    const url = `${API_BASE}/pageviews/ping/`;
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {/* silencia erros de rede */});
    }
  }, [pathname]);

  return null;
}
