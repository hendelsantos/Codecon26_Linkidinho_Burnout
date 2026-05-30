import type { Profile } from "@/lib/api";

const TOKEN_KEY = "burny_token";
const PROFILE_KEY = "burny_profile";

export const auth = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getProfile(): Profile | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Profile;
    } catch {
      return null;
    }
  },

  setProfile(profile: Profile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
  },

  hasToken(): boolean {
    return Boolean(auth.getToken());
  },
};
