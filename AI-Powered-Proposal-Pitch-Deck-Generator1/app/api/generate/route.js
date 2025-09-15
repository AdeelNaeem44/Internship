// app/api/generate/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📩 Incoming request body:", body);

    // Match frontend keys
    const { clientName, industry, description, targetMarket, budget, competitors } = body;

    if (!clientName || !industry || !description || !targetMarket || !budget) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Create a professional proposal / pitch deck with the following details:

      Company / Client Name: ${clientName}
      Industry / Niche: ${industry}
      Project Description: ${description}
      Target Market: ${targetMarket}
      Budget & Goals: ${budget}
      Competitors: ${competitors || "Not provided"}
    `;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    return new Response(JSON.stringify({ text }), { status: 200 });
  } catch (error) {
    console.error("❌ Error in /api/generate:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
