import { GoogleGenerativeAI } from "@google/generative-ai";
import { GitHubRepo, GitHubUser } from "@/lib/github";
import { RepoStats, LanguageStat } from "@/lib/analytics";

export interface DeveloperDNA {
  archetype: string;
  summary: string;
  strengths: string[];
  growthAreas: string[];
}

// Fallback in case of API failure or missing key
export const placeholderDNA: DeveloperDNA = {
  archetype: "Unknown Entity",
  summary: "We couldn't generate your intelligent profile at this time. Please ensure the GEMINI_API_KEY is configured correctly.",
  strengths: ["Writing Code", "Deploying Apps"],
  growthAreas: ["Configuring API Keys"],
};

export async function generateDeveloperDNA(
  user: GitHubUser,
  repos: GitHubRepo[],
  stats: RepoStats,
  languages: LanguageStat[]
): Promise<DeveloperDNA> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. Returning placeholder DNA.");
    return placeholderDNA;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Fast and cheap for text summarization

    // Prepare a condensed prompt to save tokens
    const prompt = `
      You are an expert engineering manager profiling a software developer based on their public GitHub data. 
      Analyze the following data and return a JSON object containing their "Developer DNA".
      
      Developer Name: ${user.name || user.login}
      Bio: ${user.bio || "No bio provided"}
      Public Repos: ${user.public_repos}
      Followers: ${user.followers}
      
      Total Stars: ${stats.totalStars}
      Total Forks: ${stats.totalForks}
      
      Top Languages (by byte size):
      ${languages.slice(0, 5).map(l => `${l.name}: ${l.percentage}%`).join("\n")}
      
      Recent Repositories:
      ${repos.slice(0, 5).map(r => `- ${r.name}: ${r.description || "N/A"} (${r.language})`).join("\n")}

      Based on this data, provide a JSON response with exactly this structure, nothing else:
      {
        "archetype": "A creative title representing their coding style (e.g., 'The Full-Stack Polyglot', 'The Open-Source Architect', 'The Frontend Artisan')",
        "summary": "A highly detailed, comprehensive, and engaging summary of their experience (MUST BE AT LEAST 4-6 sentences long). Deeply analyze what their language choices say about them, the kind of work they focus on, and their engineering style. Do not shorten this.",
        "strengths": ["Identify 3 specific technical strengths based on their repos and languages"],
        "growthAreas": ["Suggest 2 realistic areas they could explore to expand their skills"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up Markdown formatting from Gemini's JSON response if present
    text = text.replace(/```json\n/g, "").replace(/```/g, "").trim();

    const dna = JSON.parse(text) as DeveloperDNA;
    return dna;
  } catch (error) {
    console.error("Error generating developer DNA with Gemini:", error);
    return placeholderDNA;
  }
}
