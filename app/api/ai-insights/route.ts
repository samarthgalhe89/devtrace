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
import { generateDeveloperDNA } from "@/lib/ai";

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

    // Process base analytics needed for the prompt
    const stats = calculateRepoStats(repos);
    
    const topRepos = repos.slice(0, 30);
    const languagesPromises = topRepos.map((repo) =>
      fetchRepoLanguages(repo.owner.login, repo.name, token)
    );
    const reposLanguages = await Promise.all(languagesPromises);
    const languages = aggregateLanguages(reposLanguages);

    // Call Gemini API to generate the DNA Profile
    const dna = await generateDeveloperDNA(user, repos, stats, languages);

    return NextResponse.json({ dna });
  } catch (error: any) {
    console.error("AI Insights Route Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI insights." },
      { status: 500 }
    );
  }
}
