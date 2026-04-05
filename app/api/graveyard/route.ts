import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  fetchAuthenticatedUser,
  fetchUser,
  fetchRepos,
} from "@/lib/github";
import { classifyRepos, getGraveyardStats } from "@/lib/graveyard";
import { generateGraveyardEulogies } from "@/lib/ai";

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

    // Classify repos
    const classified = classifyRepos(repos);
    const stats = getGraveyardStats(classified);

    // Generate eulogies for dead/zombie repos
    const deadAndZombie = classified
      .filter((r) => r.status === "dead" || r.status === "zombie")
      .slice(0, 5);

    const eulogies = await generateGraveyardEulogies(
      deadAndZombie.map((r) => ({
        name: r.repo.name,
        description: r.repo.description,
        language: r.repo.language,
        pushed_at: r.repo.pushed_at,
      }))
    );

    return NextResponse.json({ graveyard: classified, stats, eulogies });
  } catch (error: unknown) {
    console.error("Graveyard Route Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Failed to analyze code graveyard." },
      { status: 500 }
    );
  }
}
