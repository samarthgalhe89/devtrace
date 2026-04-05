const GITHUB_API = "https://api.github.com";

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  topics: string[];
}

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetch a GitHub user profile.
 */
export async function fetchUser(
  username: string,
  token?: string
): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API}/users/${username}`, {
    headers: getHeaders(token),
    next: { revalidate: 300 }, // cache 5 min
  });

  if (res.status === 404) {
    throw new Error(`User "${username}" not found`);
  }
  if (res.status === 403) {
    throw new Error("GitHub API rate limit exceeded. Please try again later.");
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch the authenticated user's own profile.
 */
export async function fetchAuthenticatedUser(
  token: string
): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API}/user`, {
    headers: getHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch all public repositories for a user (up to 100).
 */
export async function fetchRepos(
  username: string,
  token?: string
): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated&type=owner`,
    {
      headers: getHeaders(token),
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch repos: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch language breakdown for a repository.
 */
export async function fetchRepoLanguages(
  owner: string,
  repo: string,
  token?: string
): Promise<Record<string, number>> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`, {
    headers: getHeaders(token),
  });

  if (!res.ok) return {};
  return res.json();
}

/**
 * Fetch GitHub user contributions via GraphQL
 */
export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionData {
  totalContributions: number;
  days: ContributionDay[];
}

export async function fetchContributions(
  username: string,
  token?: string
): Promise<ContributionData | null> {
  if (!token) return null; // GraphQL requires token

  const query = `
    query($userName:String!) { 
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { userName: username },
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.warn("GraphQL error:", res.status);
      return null;
    }

    const { data, errors } = await res.json();
    
    if (errors || !data?.user) {
      console.warn("GraphQL response errors:", errors);
      return null;
    }

    const calendar = data.user.contributionsCollection.contributionCalendar;
    const days: ContributionDay[] = [];
    calendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        days.push({
          contributionCount: day.contributionCount,
          date: day.date,
        });
      });
    });

    return {
      totalContributions: calendar.totalContributions,
      days,
    };
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return null;
  }
}

/**
 * Fetch Collaboration stats (PRs and Issues) via GraphQL
 */
export interface CollaborationStatsData {
  totalPullRequests: number;
  totalIssues: number;
}

export async function fetchCollaborationStats(
  username: string,
  token?: string
): Promise<CollaborationStatsData | null> {
  if (!token) return null;

  const query = `
    query($userName:String!) {
      user(login: $userName) {
        pullRequests { totalCount }
        issues { totalCount }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { userName: username },
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;

    const { data, errors } = await res.json();
    if (errors || !data?.user) return null;

    return {
      totalPullRequests: data.user.pullRequests.totalCount,
      totalIssues: data.user.issues.totalCount,
    };
  } catch (error) {
    console.error("Error fetching collaboration stats:", error);
    return null;
  }
}
