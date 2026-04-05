import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  fetchAuthenticatedUser,
  fetchUser,
  fetchRepos,
  fetchRepoLanguages,
  fetchContributions,
  fetchCollaborationStats
} from "@/lib/github";
import { calculateRepoStats, aggregateLanguages } from "@/lib/analytics";
import { calculateAllHealthScores } from "@/lib/scoring";
import { calculateActivityTimeline } from "@/lib/activity";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    // Get session for access token
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    let user;
    let repos;

    if (username) {
      // Fetch a specific user (search feature)
      user = await fetchUser(username, token);
      repos = await fetchRepos(username, token);
    } else if (token) {
      // Fetch authenticated user's own data
      user = await fetchAuthenticatedUser(token);
      repos = await fetchRepos(user.login, token);
    } else {
      return NextResponse.json(
        { error: "Username required or login with GitHub" },
        { status: 400 }
      );
    }

    // Process Phase 3 analytics
    const stats = calculateRepoStats(repos);
    
    // Process Phase 4 analytics
    const healthScores = calculateAllHealthScores(repos);
    const activity = calculateActivityTimeline(repos);
    
    // Fetch languages for up to top 30 most recently updated repos to avoid hitting UI/API limits too hard
    const topRepos = repos.slice(0, 30);
    const languagesPromises = topRepos.map((repo) =>
      fetchRepoLanguages(repo.owner.login, repo.name, token)
    );
    const reposLanguages = await Promise.all(languagesPromises);
    const languages = aggregateLanguages(reposLanguages);

    // Phase 4: Contribution Heatmap
    const contributions = await fetchContributions(user.login, token);

    // Phase 6: Collaboration Stats
    const collaboration = await fetchCollaborationStats(user.login, token);

    return NextResponse.json({ user, repos, stats, languages, healthScores, activity, contributions, collaboration });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const status = error.message.includes("not found")
        ? 404
        : error.message.includes("rate limit")
          ? 429
          : 500;
  
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}
