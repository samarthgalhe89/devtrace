import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  fetchAuthenticatedUser,
  fetchUser,
  fetchRepos,
} from "@/lib/github";
import { fetchRecentCommits, aggregateStressData } from "@/lib/stress";
import { generateStressReport } from "@/lib/ai";

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

    // Fetch recent commits and analyze sentiment
    const sentiments = await fetchRecentCommits(user.login, repos, token);
    const aggregated = aggregateStressData(sentiments);

    // Generate AI therapy report
    const worstCommits = sentiments
      .filter((s) => s.sentiment === "frustrated")
      .sort((a, b) => b.stressScore - a.stressScore)
      .slice(0, 5)
      .map((s) => s.message);

    const report = await generateStressReport({
      overallStress: aggregated.overallStressScore,
      worstLanguage: aggregated.stressByLanguage[0]?.language || "Unknown",
      worstDay:
        [...aggregated.stressByDayOfWeek].sort(
          (a, b) => b.avgStress - a.avgStress
        )[0]?.day || "Unknown",
      worstCommits,
      totalCommits: aggregated.totalCommitsAnalyzed,
    });

    return NextResponse.json({ sentiments, aggregated, report });
  } catch (error: unknown) {
    console.error(
      "Stress Route Error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Failed to analyze commit stress." },
      { status: 500 }
    );
  }
}
