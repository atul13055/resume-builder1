import { GoogleGenAI, Type } from '@google/genai';

function getClientGeminiKey(): string | null {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.GEMINI_API_KEY ||
    null
  );
}

export async function generateSummaryClientSide(resumeData: any, targetRole?: string, tone?: string) {
  const apiKey = getClientGeminiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY or VITE_GEMINI_API_KEY in your deployment environment variables.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are an elite career strategist. Write a high-converting professional resume summary (3-4 sentences, max 80 words) for this profile:
Target Role / Domain: ${targetRole || resumeData?.personalInfo?.title || "Professional"}
Tone: ${tone || "impactful & executive"}

Candidate Data:
Name: ${resumeData?.personalInfo?.fullName || ""}
Headline: ${resumeData?.personalInfo?.title || ""}
Key Experiences: ${JSON.stringify(resumeData?.experience?.slice(0, 3)?.map((e: any) => ({ role: e.role, company: e.company, highlights: e.description })) || [])}
Top Skills: ${JSON.stringify(resumeData?.skills?.map((s: any) => s.name) || [])}

Return a JSON object:
- "summary": The primary tailored professional summary.
- "alternatives": Array of 2 other tone options (e.g. 1 technical/hands-on, 1 leadership/strategic).
- "coreKeywords": Array of 4-6 target keywords seamlessly woven in.`;

  const models = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              alternatives: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              coreKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["summary", "alternatives", "coreKeywords"],
          },
        },
      });
      if (response && response.text) {
        return JSON.parse(response.text);
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate summary with Gemini AI.');
}
