import { GitHubRepo } from "./github";

export type RepoStatus = "dead" | "zombie" | "dying" | "alive";

export interface GraveyardRepo {
  repo: GitHubRepo;
  status: RepoStatus;
  statusEmoji: string;
  statusLabel: string;
  daysSinceUpdate: number;
  daysSincePush: number;
  abandonmentRisk: number; // 0-100
}

export interface GraveyardStats {
  totalDead: number;
  totalZombie: number;
  totalDying: number;
  totalAlive: number;
  graveyardPercentage: number; // % of repos that are dead or zombie
  longestZombie: GraveyardRepo | null;
  mostRecentlyDeceased: GraveyardRepo | null;
}

const STATUS_CONFIG: Record<RepoStatus, { emoji: string; label: string }> = {
  dead: { emoji: "☠️", label: "Dead" },
  zombie: { emoji: "💀", label: "Zombie" },
  dying: { emoji: "⚠️", label: "Dying" },
  alive: { emoji: "✅", label: "Alive" },
};

function daysSince(dateStr: string): number {
  return Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Calculate the abandonment risk score (0-100) for a repo.
 * Higher = more likely to be abandoned soon.
 */
function calculateAbandonmentRisk(repo: GitHubRepo): number {
  const daysSinceUpdated = daysSince(repo.updated_at);
  const daysSincePushed = daysSince(repo.pushed_at);

  let risk = 0;

  // Time decay (max 40 pts)
  if (daysSincePushed > 180) risk += 40;
  else if (daysSincePushed > 90) risk += 30;
  else if (daysSincePushed > 60) risk += 20;
  else if (daysSincePushed > 30) risk += 10;

  // No engagement signals (max 25 pts)
  if (repo.stargazers_count === 0) risk += 10;
  if (repo.forks_count === 0) risk += 10;
  if (repo.watchers_count <= 1) risk += 5;

  // Open issues burden (max 15 pts)
  if (repo.open_issues_count > 10) risk += 15;
  else if (repo.open_issues_count > 5) risk += 10;
  else if (repo.open_issues_count > 0) risk += 5;

  // No description = less commitment (max 10 pts)
  if (!repo.description) risk += 10;

  // Small project size = side project vibes (max 10 pts)
  if (repo.size < 100) risk += 10;
  else if (repo.size < 500) risk += 5;

  return Math.min(100, Math.max(0, risk));
}

/**
 * Classify a single repo into a graveyard status.
 */
function classifyRepo(repo: GitHubRepo): GraveyardRepo {
  const daysSinceUpdated = daysSince(repo.updated_at);
  const daysSincePushed = daysSince(repo.pushed_at);
  const maxDays = Math.max(daysSinceUpdated, daysSincePushed);

  let status: RepoStatus;

  if (maxDays > 365 && repo.stargazers_count === 0 && repo.forks_count === 0) {
    status = "dead";
  } else if (maxDays > 180) {
    status = "zombie";
  } else if (maxDays > 90) {
    status = "dying";
  } else {
    status = "alive";
  }

  const config = STATUS_CONFIG[status];

  return {
    repo,
    status,
    statusEmoji: config.emoji,
    statusLabel: config.label,
    daysSinceUpdate: daysSinceUpdated,
    daysSincePush: daysSincePushed,
    abandonmentRisk: calculateAbandonmentRisk(repo),
  };
}

/**
 * Classify all repos and sort: dead first, then zombie, dying, alive.
 */
export function classifyRepos(repos: GitHubRepo[]): GraveyardRepo[] {
  const statusOrder: Record<RepoStatus, number> = {
    dead: 0,
    zombie: 1,
    dying: 2,
    alive: 3,
  };

  return repos
    .filter((r) => !r.fork) // Only original repos
    .map(classifyRepo)
    .sort((a, b) => {
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return b.daysSincePush - a.daysSincePush; // oldest first within group
    });
}

/**
 * Get summary statistics for the graveyard.
 */
export function getGraveyardStats(classified: GraveyardRepo[]): GraveyardStats {
  const totalDead = classified.filter((r) => r.status === "dead").length;
  const totalZombie = classified.filter((r) => r.status === "zombie").length;
  const totalDying = classified.filter((r) => r.status === "dying").length;
  const totalAlive = classified.filter((r) => r.status === "alive").length;
  const total = classified.length;

  const graveyardPercentage =
    total > 0 ? Math.round(((totalDead + totalZombie) / total) * 100) : 0;

  // Longest-running zombie (most days since push among zombies)
  const zombies = classified.filter((r) => r.status === "zombie");
  const longestZombie =
    zombies.length > 0
      ? zombies.reduce((a, b) =>
          a.daysSincePush > b.daysSincePush ? a : b
        )
      : null;

  // Most recently deceased (dead repo with the least days since push = died recently)
  const dead = classified.filter((r) => r.status === "dead");
  const mostRecentlyDeceased =
    dead.length > 0
      ? dead.reduce((a, b) =>
          a.daysSincePush < b.daysSincePush ? a : b
        )
      : null;

  return {
    totalDead,
    totalZombie,
    totalDying,
    totalAlive,
    graveyardPercentage,
    longestZombie,
    mostRecentlyDeceased,
  };
}
