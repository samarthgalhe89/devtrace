import { GitHubUser, GitHubRepo } from "./github";
import { RepoStats, LanguageStat } from "./analytics";

export interface NemesisProfile {
  user: GitHubUser;
  stats: RepoStats;
  languages: LanguageStat[];
  similarityScore: number; // 0-100
}

export interface RivalryScore {
  categories: RivalryCategory[];
  userWins: number;
  nemesisWins: number;
  draws: number;
  verdict: "user" | "nemesis" | "draw";
}

export interface RivalryCategory {
  label: string;
  userValue: number;
  nemesisValue: number;
  winner: "user" | "nemesis" | "draw";
}

const GITHUB_API = "https://api.github.com";

/**
 * Search GitHub for potential nemesis candidates matching similar profile.
 */
export async function searchNemesisCandidates(
  user: GitHubUser,
  userLanguages: LanguageStat[],
  token?: string
): Promise<GitHubUser[]> {
  const topLang = userLanguages[0]?.name || "";
  const followers = user.followers;
  const repos = user.public_repos;

  // Build a range query: look for users in ±50% follower / repo range
  const followerMin = Math.max(0, Math.floor(followers * 0.5));
  const followerMax = Math.ceil(followers * 1.5) || 10;
  const repoMin = Math.max(0, Math.floor(repos * 0.5));
  const repoMax = Math.ceil(repos * 1.5) || 10;

  // Build search query
  let q = `followers:${followerMin}..${followerMax} repos:${repoMin}..${repoMax}`;
  if (topLang) {
    q += ` language:${topLang}`;
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(
      `${GITHUB_API}/search/users?q=${encodeURIComponent(q)}&per_page=15&sort=followers`,
      { headers }
    );

    if (!res.ok) {
      console.warn("Nemesis search failed:", res.status);
      return [];
    }

    const data = await res.json();
    // Filter out the user themselves
    return (data.items || []).filter(
      (u: GitHubUser) => u.login !== user.login
    );
  } catch (error) {
    console.error("Error searching for nemesis:", error);
    return [];
  }
}

/**
 * Calculate a similarity score between two users (0-100).
 */
function calculateSimilarity(
  userStats: RepoStats,
  userLanguages: LanguageStat[],
  candidateStats: RepoStats,
  candidateLanguages: LanguageStat[]
): number {
  let score = 0;

  // Repo count proximity (max 25)
  const repoDiff = Math.abs(userStats.totalRepos - candidateStats.totalRepos);
  score += Math.max(0, 25 - repoDiff * 2);

  // Star count proximity (max 25)
  const starMax = Math.max(userStats.totalStars, candidateStats.totalStars, 1);
  const starSim = 1 - Math.abs(userStats.totalStars - candidateStats.totalStars) / starMax;
  score += Math.round(starSim * 25);

  // Follower proximity (max 20) — already pre-filtered, so give a base
  score += 15;

  // Language overlap (max 30)
  const userLangs = new Set(userLanguages.map((l) => l.name));
  const candidateLangs = new Set(candidateLanguages.map((l) => l.name));
  let overlap = 0;
  userLangs.forEach((lang) => {
    if (candidateLangs.has(lang)) overlap++;
  });
  const maxLangs = Math.max(userLangs.size, candidateLangs.size, 1);
  score += Math.round((overlap / maxLangs) * 30);

  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate the rivalry scoreboard between user and nemesis.
 */
export function calculateRivalryScore(
  user: GitHubUser,
  userStats: RepoStats,
  userLanguages: LanguageStat[],
  nemesis: GitHubUser,
  nemesisStats: RepoStats,
  nemesisLanguages: LanguageStat[]
): RivalryScore {
  const categorize = (
    label: string,
    uVal: number,
    nVal: number
  ): RivalryCategory => ({
    label,
    userValue: uVal,
    nemesisValue: nVal,
    winner: uVal > nVal ? "user" : nVal > uVal ? "nemesis" : "draw",
  });

  const categories: RivalryCategory[] = [
    categorize("Total Stars", userStats.totalStars, nemesisStats.totalStars),
    categorize("Total Forks", userStats.totalForks, nemesisStats.totalForks),
    categorize("Public Repos", user.public_repos, nemesis.public_repos),
    categorize("Followers", user.followers, nemesis.followers),
    categorize("Language Diversity", userLanguages.length, nemesisLanguages.length),
  ];

  const userWins = categories.filter((c) => c.winner === "user").length;
  const nemesisWins = categories.filter((c) => c.winner === "nemesis").length;
  const draws = categories.filter((c) => c.winner === "draw").length;

  return {
    categories,
    userWins,
    nemesisWins,
    draws,
    verdict: userWins > nemesisWins ? "user" : nemesisWins > userWins ? "nemesis" : "draw",
  };
}

export { calculateSimilarity };
