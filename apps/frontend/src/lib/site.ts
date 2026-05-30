import {
  BrainCircuit,
  Coffee,
  Crown,
  Gauge,
  LucideIcon,
  Radar,
} from "lucide-react";

type MetricCard = {
  label: string;
  value: string;
  caption: string;
};

type Highlight = {
  label: string;
  value: string;
};

type FeatureCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type FeedMoment = {
  author: string;
  role: string;
  time: string;
  message: string;
  tags: string[];
  reactions: string;
  comments: string;
};

type RankingEntry = {
  name: string;
  role: string;
  score: string;
};

export const statCards: MetricCard[] = [
  {
    label: "Burnout Risk",
    value: "92%",
    caption: "+8 pontos desde a ultima daily extendida",
  },
  {
    label: "Cafe consumido",
    value: "7",
    caption: "xicras necessarias para manter humanidade operacional",
  },
  {
    label: "Reunioes inuteis",
    value: "12",
    caption: "esta semana, com zero plot twist",
  },
  {
    label: "Bathroom Revenue",
    value: "R$ 381",
    caption: "melhor trimestre do banheiro corporativo",
  },
];

export const burnyHighlights: Highlight[] = [
  { label: "Conexoes cansadas", value: "666" },
  { label: "Cafes recebidos", value: "432" },
  { label: "Burny score", value: "98%" },
];

export const featureCards: FeatureCard[] = [
  {
    title: "Burny AI",
    description: "Comenta sua rotina com a elegancia de um consultor que dormiu no PowerPoint.",
    icon: BrainCircuit,
  },
  {
    title: "Coffee Support",
    description: "Envie cafe premium, espresso de emergencia ou latte de ultima esperanca.",
    icon: Coffee,
  },
  {
    title: "Burnout Dashboard",
    description: "Graficos exagerados, alertas industriais e estetica enterprise noir.",
    icon: Gauge,
  },
  {
    title: "Ranking Global",
    description: "Compare sua resiliencia dramatica sem abrir espaco para ataque pessoal.",
    icon: Crown,
  },
  {
    title: "Wrapped Corporativo",
    description: "Seu ano em reunioes, cafes, transito e milagres operacionais.",
    icon: Radar,
  },
];

export const feedMoments: FeedMoment[] = [
  {
    author: "Analista de Processos",
    role: "Especialista em apagar incendios com planilhas",
    time: "2h",
    message:
      "Participei de 6 reunioes hoje e produzi exatamente 7 minutos de trabalho. Produtividade: excelente para fins de storytelling executivo.",
    tags: ["Sobreviveu", "Reuniao inutil", "Burnando"],
    reactions: "147",
    comments: "36",
  },
  {
    author: "Dev Backend",
    role: "Arquiteto de APIs e desculpas elegantes",
    time: "3h",
    message:
      "Deploy na sexta-feira as 18h. Porque a vida e feita de escolhas ruins, observabilidade emocional e logs com cheiro de cafe requentado.",
    tags: ["Sem cafe", "Daily extendida", "Clima de guerra"],
    reactions: "98",
    comments: "21",
  },
  {
    author: "PM em Crise",
    role: "Guardiao das prioridades que nunca param quietas",
    time: "5h",
    message:
      "Recebi 'vamos alinhar rapidinho' as 22:47. O app registrou automaticamente como incidente de moral abaixo do threshold operacional.",
    tags: ["Buzzword overload", "Sem contexto", "Cafe IV"],
    reactions: "212",
    comments: "48",
  },
];

export const rankingEntries: RankingEntry[] = [
  {
    name: "Sobrevivente Premium",
    role: "Especialista em seguir funcional por milagre",
    score: "92%",
  },
  {
    name: "Dev Backend",
    role: "Tolerancia alta a deploy tardio",
    score: "89%",
  },
  {
    name: "QA Revoltado",
    role: "Encontrou 12 bugs e 1 sentido para viver",
    score: "87%",
  },
  {
    name: "PM em Crise",
    role: "Roadmap mutante em ambiente hostil",
    score: "85%",
  },
];