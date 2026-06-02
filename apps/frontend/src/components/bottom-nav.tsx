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
      {/* Espaçador para os botões flutuantes não cobrirem conteúdo no mobile */}
      <div className="h-24 sm:hidden" aria-hidden />
    </>
  );
}
