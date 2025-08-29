import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export async function generateProposalSections(input) {
const prompt = `You are an expert proposal writer. Using the INPUT JSON, write a concise, structured proposal with these keys:
introduction, problem, solution, targetMarket, competition, businessModel, roadmap, conclusion.
Keep each section under 140 words, use crisp sentences.
INPUT JSON: ${JSON.stringify(input)}`;


const res = await model.generateContent(prompt);
const text = res.response.text();


// Try to coerce to JSON if the model returned fenced text
try {
const clean = text.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
const parsed = JSON.parse(clean);
return parsed;
} catch {
// Fallback: wrap as a single block under "raw"
return { raw: text };
}
}