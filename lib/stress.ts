import { GitHubRepo } from "./github";

export interface CommitSentiment {
  message: string;
  repo: string;
  language: string;
  date: string;
  dayOfWeek: string;
  sentiment: "frustrated" | "neutral" | "positive";
  stressScore: number; // 0-100
}

export interface StressAggregated {
  overallStressScore: number;
  totalCommitsAnalyzed: number;
  stressByLanguage: { language: string; avgStress: number; count: number }[];
  stressByDayOfWeek: { day: string; avgStress: number; count: number }[];
  stressByRepo: { repo: string; avgStress: number; count: number }[];
  worstCommit: CommitSentiment | null;
  mostZenCommit: CommitSentiment | null;
  frustrationTimeline: { week: string; avgStress: number }[];
}

const FRUSTRATED_KEYWORDS = [
  "fix", "bug", "broken", "hack", "hotfix", "revert", "ugh",
  "finally", "fml", "asdf", "todo", "wip", "temp", "desperate",
  "stupid", "wtf", "damn", "crap", "shit", "fuck", "argh",
  "ugly", "terrible", "awful", "horrible", "annoying", "cmon",
  "please work", "why", "again", "sigh", "nvm", "oops", "typo",
  "forgot", "mistake", "wrong", "crap", "cmon", "crazyn",
];

const POSITIVE_KEYWORDS = [
  "feature", "implement", "add", "complete", "refactor", "improve",
  "clean", "optimize", "release", "ship", "done", "launch",
  "initial commit", "setup", "init", "create", "new", "enhance",
  "upgrade", "migrate", "v1", "v2", "beautiful", "perfect",
  "awesome", "great", "nice", "sweet", "ready", "finished",
];

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Analyze sentiment of a single commit message.
 */
export function analyzeCommitSentiment(message: string): {
  sentiment: "frustrated" | "neutral" | "positive";
  stressScore: number;
} {
  const lower = message.toLowerCase().trim();
  let frustrationSignals = 0;
  let positiveSignals = 0;

  // Keyword matching
  for (const kw of FRUSTRATED_KEYWORDS) {
    if (lower.includes(kw)) frustrationSignals++;
  }
  for (const kw of POSITIVE_KEYWORDS) {
    if (lower.includes(kw)) positiveSignals++;
  }

  // Pattern-based signals
  // Very short message = lazy/frustrated
  if (lower.length <= 3) frustrationSignals += 2;
  else if (lower.length <= 10) frustrationSignals += 1;

  // ALL CAPS = yelling
  if (message === message.toUpperCase() && message.length > 3) frustrationSignals += 2;

  // Excessive punctuation (!!!, ???)
  const exclamations = (message.match(/!/g) || []).length;
  const questions = (message.match(/\?/g) || []).length;
  if (exclamations >= 2) frustrationSignals += 1;
  if (questions >= 2) frustrationSignals += 1;

  // Random keyboard smash patterns
  if (/[asdfghjkl]{4,}/i.test(lower) || /[qwerty]{4,}/i.test(lower)) {
    frustrationSignals += 3;
  }

  // Calculate stress score (0-100)
  const netFrustration = frustrationSignals - positiveSignals;
  let stressScore: number;

  if (netFrustration >= 4) stressScore = 95;
  else if (netFrustration >= 3) stressScore = 80;
  else if (netFrustration >= 2) stressScore = 65;
  else if (netFrustration >= 1) stressScore = 50;
  else if (netFrustration === 0) stressScore = 30;
  else if (netFrustration <= -2) stressScore = 5;
  else stressScore = 15;

  const sentiment: "frustrated" | "neutral" | "positive" =
    stressScore >= 50 ? "frustrated" : stressScore <= 20 ? "positive" : "neutral";

  return { sentiment, stressScore };
}

/**
 * Fetch recent commits for a list of repos.
 */
export async function fetchRecentCommits(
  username: string,
  repos: GitHubRepo[],
  token?: string
): Promise<CommitSentiment[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const sentiments: CommitSentiment[] = [];
  // Limit to top 15 most recently updated repos, 5 commits each
  const targetRepos = repos.filter(r => !r.fork).slice(0, 15);

  const fetchPromises = targetRepos.map(async (repo) => {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?per_page=5&author=${username}`,
        { headers }
      );

      if (!res.ok) return [];

      const commits = await res.json();
      return (commits || []).map((commit: any) => {
        const msg = commit?.commit?.message || "";
        const date = commit?.commit?.author?.date || "";
        const { sentiment, stressScore } = analyzeCommitSentiment(msg);
        const dayOfWeek = date ? DAYS_OF_WEEK[new Date(date).getDay()] : "Unknown";

        return {
          message: msg.split("\n")[0].slice(0, 120), // First line, trimmed
          repo: repo.name,
          language: repo.language || "Unknown",
          date,
          dayOfWeek,
          sentiment,
          stressScore,
        } as CommitSentiment;
      });
    } catch {
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  results.forEach((r) => sentiments.push(...r));

  return sentiments;
}

/**
 * Aggregate commit sentiments into summary analytics.
 */
export function aggregateStressData(sentiments: CommitSentiment[]): StressAggregated {
  if (sentiments.length === 0) {
    return {
      overallStressScore: 0,
      totalCommitsAnalyzed: 0,
      stressByLanguage: [],
      stressByDayOfWeek: [],
      stressByRepo: [],
      worstCommit: null,
      mostZenCommit: null,
      frustrationTimeline: [],
    };
  }

  // Overall
  const overallStressScore = Math.round(
    sentiments.reduce((sum, s) => sum + s.stressScore, 0) / sentiments.length
  );

  // By language
  const langMap = new Map<string, { total: number; count: number }>();
  sentiments.forEach((s) => {
    const existing = langMap.get(s.language) || { total: 0, count: 0 };
    existing.total += s.stressScore;
    existing.count++;
    langMap.set(s.language, existing);
  });
  const stressByLanguage = Array.from(langMap.entries())
    .map(([language, { total, count }]) => ({
      language,
      avgStress: Math.round(total / count),
      count,
    }))
    .sort((a, b) => b.avgStress - a.avgStress);

  // By day of week
  const dayMap = new Map<string, { total: number; count: number }>();
  sentiments.forEach((s) => {
    const existing = dayMap.get(s.dayOfWeek) || { total: 0, count: 0 };
    existing.total += s.stressScore;
    existing.count++;
    dayMap.set(s.dayOfWeek, existing);
  });
  const stressByDayOfWeek = DAYS_OF_WEEK.map((day) => {
    const data = dayMap.get(day) || { total: 0, count: 0 };
    return {
      day,
      avgStress: data.count > 0 ? Math.round(data.total / data.count) : 0,
      count: data.count,
    };
  });

  // By repo
  const repoMap = new Map<string, { total: number; count: number }>();
  sentiments.forEach((s) => {
    const existing = repoMap.get(s.repo) || { total: 0, count: 0 };
    existing.total += s.stressScore;
    existing.count++;
    repoMap.set(s.repo, existing);
  });
  const stressByRepo = Array.from(repoMap.entries())
    .map(([repo, { total, count }]) => ({
      repo,
      avgStress: Math.round(total / count),
      count,
    }))
    .sort((a, b) => b.avgStress - a.avgStress);

  // Extremes
  const sorted = [...sentiments].sort((a, b) => b.stressScore - a.stressScore);
  const worstCommit = sorted[0] || null;
  const mostZenCommit = sorted[sorted.length - 1] || null;

  // Weekly timeline
  const weekMap = new Map<string, { total: number; count: number }>();
  sentiments.forEach((s) => {
    if (!s.date) return;
    const d = new Date(s.date);
    // Get ISO week start
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split("T")[0];
    const existing = weekMap.get(key) || { total: 0, count: 0 };
    existing.total += s.stressScore;
    existing.count++;
    weekMap.set(key, existing);
  });
  const frustrationTimeline = Array.from(weekMap.entries())
    .map(([week, { total, count }]) => ({
      week,
      avgStress: Math.round(total / count),
    }))
    .sort((a, b) => a.week.localeCompare(b.week));

  return {
    overallStressScore,
    totalCommitsAnalyzed: sentiments.length,
    stressByLanguage,
    stressByDayOfWeek,
    stressByRepo,
    worstCommit,
    mostZenCommit,
    frustrationTimeline,
  };
}
