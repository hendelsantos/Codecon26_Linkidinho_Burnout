"use client";

import { Bot, Flame, LayoutDashboard, MessageSquare, Trophy, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { auth } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/",          icon: Flame,           label: "Início"    },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/feed",      icon: MessageSquare,   label: "Feed"      },
  { href: "/ranking",   icon: Trophy,          label: "Ranking"   },
  { href: "/burnyia",   icon: Bot,             label: "BurnyIA"   },
];

// Páginas onde a nav não deve aparecer (onboarding, entrar, landing sem auth)
const HIDDEN_ON = ["/onboarding", "/entrar"];

export function BottomNav() {
  const pathname = usePathname();
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    const p = auth.getProfile();
    if (p?.id) setProfileId(p.id);
  }, []);

  // Não renderiza em páginas sem sentido de nav
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;
  // Não renderiza se não há token (visitante)
  if (!auth.getToken()) return null;

  const perfilHref = profileId ? `/perfil/${profileId}` : "/entrar";

  const allItems = [
    ...NAV_ITEMS,
    { href: perfilHref, icon: User, label: "Perfil" },
  ];

  return (
    <>
      {/* Espaçador para o conteúdo não ficar atrás da barra */}
      <div className="h-20 sm:hidden" aria-hidden />

      {/* Barra fixa — só mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
        {/* Blur/glass de fundo */}
        <div className="mx-3 mb-3 rounded-[22px] border border-white/10 bg-[#0a0b14]/80 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-around px-2 py-2">
            {allItems.map(({ href, icon: Icon, label }) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href.split("?")[0]);

              return (
                <Link
                  key={label}
                  href={href}
                  className={`flex flex-col items-center gap-1 rounded-[14px] px-3 py-2 transition-all ${
                    isActive
                      ? "bg-violet/15 text-violet"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-all ${isActive ? "scale-110" : ""}`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  <span className="text-[10px] font-medium leading-none">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
