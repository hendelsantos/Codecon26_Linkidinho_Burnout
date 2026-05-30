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
    caption: "+8 pontos desde a última daily estendida",
  },
  {
    label: "Café consumido",
    value: "7",
    caption: "xícaras necessárias para manter humanidade operacional",
  },
  {
    label: "Reuniões inúteis",
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
  { label: "Conexões cansadas", value: "666" },
  { label: "Cafés recebidos", value: "432" },
  { label: "Burny score", value: "98%" },
];

export const featureCards: FeatureCard[] = [
  {
    title: "Burny AI",
    description: "Comenta sua rotina com a elegância de um consultor que dormiu no PowerPoint.",
    icon: BrainCircuit,
  },
  {
    title: "Coffee Support",
    description: "Envie café premium, espresso de emergência ou latte de última esperança.",
    icon: Coffee,
  },
  {
    title: "Burnout Dashboard",
    description: "Gráficos exagerados, alertas industriais e estética enterprise noir.",
    icon: Gauge,
  },
  {
    title: "Ranking Global",
    description: "Compare sua resiliência dramática sem abrir espaço para ataque pessoal.",
    icon: Crown,
  },
  {
    title: "Wrapped Corporativo",
    description: "Seu ano em reuniões, cafés, trânsito e milagres operacionais.",
    icon: Radar,
  },
];

export const feedMoments: FeedMoment[] = [
  {
    author: "Analista de Processos",
    role: "Especialista em apagar incendios com planilhas",
    time: "2h",
    message:
      "Participei de 6 reuniões hoje e produzi exatamente 7 minutos de trabalho. Produtividade: excelente para fins de storytelling executivo.",
    tags: ["Sobreviveu", "Reunião inútil", "Burnando"],
    reactions: "147",
    comments: "36",
  },
  {
    author: "Dev Backend",
    role: "Arquiteto de APIs e desculpas elegantes",
    time: "3h",
    message:
      "Deploy na sexta-feira às 18h. Porque a vida é feita de escolhas ruins, observabilidade emocional e logs com cheiro de café requentado.",
    tags: ["Sem café", "Daily estendida", "Clima de guerra"],
    reactions: "98",
    comments: "21",
  },
  {
    author: "PM em Crise",
    role: "Guardião das prioridades que nunca param quietas",
    time: "5h",
    message:
      "Recebi 'vamos alinhar rapidinho' às 22:47. O app registrou automaticamente como incidente de moral abaixo do threshold operacional.",
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
    role: "Tolerância alta a deploy tardio",
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