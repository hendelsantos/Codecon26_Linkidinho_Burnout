const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000/api";

// ──── Types ─────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  nickname: string;
  avatar_emoji: string;
  region: string;
  area: string;
  area_label: string;
  followers_count: number;
  following_count: number;
  created_at: string;
}

export interface ProfileCreate extends Profile {
  access_token: string;
}

export interface SkillItem {
  key: string;
  label: string;
  count: number;
}

export interface ProfileDetail extends Profile {
  skills: SkillItem[];
  is_following: boolean;
}

export interface ReactionCount {
  key: string;
  emoji: string;
  count: number;
}

export interface Desabafo {
  id: string;
  author: Profile;
  content: string;
  nivel: string;
  nivel_label: string;
  reaction_counts: ReactionCount[];
  viewer_reaction: string | null;
  created_at: string;
}

export interface DesabafoResponse {
  count: number;
  results: Desabafo[];
}

export interface FeedItem {
  id: string;
  author: string;
  avatar_emoji: string;
  role: string;
  region: string;
  burny_score: number;
  message: string;
  insight: string;
  created_at: string;
}

export interface FeedResponse {
  count: number;
  results: FeedItem[];
}

export interface RankingEntry {
  id: string;
  nickname: string;
  avatar_emoji: string;
  area: string;
  region: string;
  value: number;
}

export interface RankingResponse {
  category: string;
  since: string;
  results: RankingEntry[];
}

export interface CheckIn {
  id: string;
  date: string;
  coffees: number;
  useless_meetings: number;
  traffic_minutes: number;
  stress_level: number;
  bathroom_revenue_cents: number;
  buzzwords_endured: number;
  note: string;
  burny_score: number;
  burny_insight: string;
  created_at: string;
}

export interface CheckInPayload {
  coffees: number;
  useless_meetings: number;
  traffic_minutes: number;
  stress_level: number;
  bathroom_revenue_cents: number;
  buzzwords_endured: number;
  note?: string;
}

export interface ScoreResponse {
  current_score: number;
  current_insight: string;
  week_average: number;
  week_totals: {
    coffees: number;
    useless_meetings: number;
    traffic_minutes: number;
    bathroom_revenue_cents: number;
  };
  history: Array<{ date: string; score: number }>;
}

// ──── HTTP client ─────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string },
): Promise<T> {
  const { token, headers: extraHeaders, ...rest } = options ?? {};
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { "X-Access-Token": token } : {}),
    ...(extraHeaders as Record<string, string> | undefined),
  };
  const res = await fetch(`${API_URL}${path}`, { ...rest, headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ──── API functions ───────────────────────────────────────────────────────────

export const api = {
  createProfile: (data: {
    nickname: string;
    area: string;
    region?: string;
    avatar_emoji?: string;
  }) =>
    apiFetch<ProfileCreate>("/profiles/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: (token: string) => apiFetch<Profile>("/profiles/me/", { token }),

  getProfile: (id: string, token?: string) =>
    apiFetch<ProfileDetail>(`/profiles/${id}/`, { token }),

  followProfile: (token: string, id: string) =>
    apiFetch<{ action: "followed" | "unfollowed"; followers_count: number }>(
      `/profiles/${id}/follow/`,
      { method: "POST", token },
    ),

  endorseSkill: (token: string, id: string, skill: string) =>
    apiFetch<{ action: "endorsed" | "removed"; skill: string }>(
      `/profiles/${id}/endorse/`,
      { method: "POST", token, body: JSON.stringify({ skill }) },
    ),

  getFeed: (limit = 30) =>
    apiFetch<FeedResponse>(`/feed/?limit=${limit}`),

  getDesabafos: (limit = 30, token?: string) =>
    apiFetch<DesabafoResponse>(`/desabafos/?limit=${limit}`, { token }),

  createDesabafo: (token: string, data: { content: string; nivel: string }) =>
    apiFetch<Desabafo>("/desabafos/", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  reactToDesabafo: (token: string, id: string, emoji: string) =>
    apiFetch<{ action: string; emoji: string }>(
      `/desabafos/${id}/react/`,
      { method: "POST", token, body: JSON.stringify({ emoji }) },
    ),

  getRankings: (category = "burnout") =>
    apiFetch<RankingResponse>(`/rankings/?category=${category}`),

  createCheckIn: (token: string, data: CheckInPayload) =>
    apiFetch<CheckIn>("/checkins/", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  getScore: (token: string) => apiFetch<ScoreResponse>("/score/", { token }),

  getCheckIns: (token: string) => apiFetch<CheckIn[]>("/checkins/", { token }),
};

// ──── Helpers ─────────────────────────────────────────────────────────────────

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export const AREAS = [
  { value: "dev", label: "Desenvolvimento" },
  { value: "design", label: "Design" },
  { value: "product", label: "Produto" },
  { value: "ops", label: "Infraestrutura" },
  { value: "data", label: "Dados" },
  { value: "qa", label: "QA" },
  { value: "management", label: "Gestão" },
  { value: "sales", label: "Comercial" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Outro" },
] as const;

export const REGIONS = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Porto Alegre",
  "Recife",
  "Curitiba",
  "Brasília",
  "Florianópolis",
  "Remoto Total",
  "Remoto com camera off",
] as const;

export const AVATARS = ["🔥", "💀", "🧟", "👑", "🪫", "🤖", "👻", "🎯", "🧠", "🛸"] as const;

export const RANKING_CATEGORIES = [
  { value: "burnout", label: "Burnout" },
  { value: "coffees", label: "Cafés" },
  { value: "meetings", label: "Reuniões" },
  { value: "traffic", label: "Trânsito" },
  { value: "bathroom", label: "Bathroom Revenue" },
] as const;
