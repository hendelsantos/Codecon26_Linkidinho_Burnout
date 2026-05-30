import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { ConvidarAmigo } from "@/components/convidar-amigo";
import { FingirTrabalho } from "@/components/fingir-trabalho";
import { GerarDesculpa } from "@/components/gerar-desculpa";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BurnyOut | Corporate Suffering Analytics Network",
  description:
    "Rede social satirica de analytics corporativo com dashboards cinematograficos, rankings absurdos e humor sem toxicidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ConvidarAmigo />
        <GerarDesculpa />
        <FingirTrabalho />
      </body>
    </html>
  );
}
