import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  fetchAuthenticatedUser,
  fetchUser,
  fetchRepos,
  fetchRepoLanguages,
} from "@/lib/github";
import { calculateRepoStats, aggregateLanguages } from "@/lib/analytics";
import {
  searchNemesisCandidates,
  calculateSimilarity,
  calculateRivalryScore,
} from "@/lib/nemesis";
import { generateNemesisNarrative } from "@/lib/ai";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    let user;
    let repos;

    if (username) {
      user = await fetchUser(username, token);
      repos = await fetchRepos(username, token);
    } else if (token) {
      user = await fetchAuthenticatedUser(token);
      repos = await fetchRepos(user.login, token);
    } else {
      return NextResponse.json(
        { error: "Username required or login with GitHub" },
        { status: 400 }
      );
    }

    // User analytics
    const userStats = calculateRepoStats(repos);
    const topRepos = repos.slice(0, 20);
    const languagesPromises = topRepos.map((repo) =>
      fetchRepoLanguages(repo.owner.login, repo.name, token)
    );
    const reposLanguages = await Promise.all(languagesPromises);
    const userLanguages = aggregateLanguages(reposLanguages);

    // Search for nemesis candidates
    const candidates = await searchNemesisCandidates(user, userLanguages, token);

    if (candidates.length === 0) {
      return NextResponse.json({
        nemesis: null,
        narrative: null,
        rivalry: null,
        message: "No nemesis found. You're truly one of a kind!",
      });
    }

    // Score each candidate
    let bestMatch: any = null;
    let bestScore = -1;

    // Evaluate top 5 candidates
    for (const candidate of candidates.slice(0, 5)) {
      try {
        const cRepos = await fetchRepos(candidate.login, token);
        const cStats = calculateRepoStats(cRepos);
        const cTopRepos = cRepos.slice(0, 10);
        const cLangPromises = cTopRepos.map((r) =>
          fetchRepoLanguages(r.owner.login, r.name, token)
        );
        const cRepoLangs = await Promise.all(cLangPromises);
        const cLanguages = aggregateLanguages(cRepoLangs);

        const similarity = calculateSimilarity(
          userStats,
          userLanguages,
          cStats,
          cLanguages
        );

        if (similarity > bestScore) {
          bestScore = similarity;
          bestMatch = {
            user: candidate,
            stats: cStats,
            languages: cLanguages,
            similarityScore: similarity,
          };
        }
      } catch (e) {
        // Skip failed candidates
        continue;
      }
    }

    if (!bestMatch) {
      return NextResponse.json({
        nemesis: null,
        narrative: null,
        rivalry: null,
        message: "Could not match a nemesis at this time.",
      });
    }

    // Calculate rivalry score
    const rivalry = calculateRivalryScore(
      user,
      userStats,
      userLanguages,
      bestMatch.user,
      bestMatch.stats,
      bestMatch.languages
    );

    // Generate AI narrative
    const narrative = await generateNemesisNarrative(
      {
        login: user.login,
        public_repos: user.public_repos,
        followers: user.followers,
        totalStars: userStats.totalStars,
        topLanguages: userLanguages.slice(0, 3).map((l) => l.name),
      },
      {
        login: bestMatch.user.login,
        public_repos: bestMatch.user.public_repos,
        followers: bestMatch.user.followers,
        totalStars: bestMatch.stats.totalStars,
        topLanguages: bestMatch.languages.slice(0, 3).map((l: any) => l.name),
      }
    );

    return NextResponse.json({
      nemesis: bestMatch,
      narrative,
      rivalry,
      user: { login: user.login, avatar_url: user.avatar_url, name: user.name, followers: user.followers, public_repos: user.public_repos },
      userStats: { totalStars: userStats.totalStars, totalForks: userStats.totalForks },
      userLanguages,
    });
  } catch (error: unknown) {
    console.error("Nemesis Route Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Failed to find arch-nemesis." },
      { status: 500 }
    );
  }
}
