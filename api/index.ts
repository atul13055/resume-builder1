import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Resilient Gemini invoker with automatic model fallback & retry for 503/429 spikes
async function callGeminiWithFallback(
  ai: GoogleGenAI,
  request: {
    contents: any;
    config?: any;
  }
) {
  const models = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: request.contents,
          config: request.config,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || "");
        const isTransient =
          msg.includes("503") ||
          msg.includes("high demand") ||
          msg.includes("429") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("RESOURCE_EXHAUSTED") ||
          msg.includes("Overloaded");

        if (!isTransient) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error("Gemini models are currently unavailable. Please try again shortly.");
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasAiKey: Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY),
  });
});

// AI Bullet Optimizer
app.post("/api/ai/improve-bullet", async (req, res) => {
  try {
    const { bullet, role, company, style } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.status(400).json({ error: "Gemini API key is not configured in environment variables." });
    }

    const prompt = `You are a world-class executive resume coach and ATS optimization specialist.
Improve this resume bullet point for a ${role || "professional"} at ${company || "a company"}.
Original Bullet: "${bullet}"
Desired Style: ${style || "impact-metric"} (Options: metric-focused, action-driven, executive, concise).

Follow Google's X-Y-Z formula: "Accomplished [X], as measured by [Y], by doing [Z]".
Use strong active verbs, remove filler words, and include realistic quantifiable impact placeholders (e.g. [X]%, $[Y]M, [Z] hrs) if the user didn't provide specific numbers.

Return a JSON object with:
- "improved": A single primary enhanced bullet point (strong, ready to paste).
- "alternatives": Array of 2 alternative variations (one concise, one leadership/metric heavy).
- "keyChanges": Array of short strings explaining what was upgraded.
- "actionVerbsUsed": Array of strong action verbs utilized.`;

    const response = await callGeminiWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            improved: { type: Type.STRING },
            alternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyChanges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            actionVerbsUsed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["improved", "alternatives", "keyChanges"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (err: any) {
    console.error("AI Bullet Error:", err);
    res.status(500).json({ error: err.message || "Failed to improve bullet point." });
  }
});

// AI Summary Generator
app.post("/api/ai/generate-summary", async (req, res) => {
  try {
    const { resumeData, targetRole, tone } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.status(400).json({ error: "Gemini API key is not configured in environment variables." });
    }

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

    const response = await callGeminiWithFallback(ai, {
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

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (err: any) {
    console.error("AI Summary Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate summary." });
  }
});

// AI ATS Scoring
app.post(["/api/ai/score-ats", "/api/ai/ats-score"], async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.status(400).json({ error: "Gemini API key is not configured in environment variables." });
    }

    const prompt = `Analyze this resume for ATS compatibility, keyword density, parseability, and recruitment recruiter conversion rate.
${jobDescription ? `Target Job Description:\n"""${jobDescription}"""\n` : "General Industry Best Practices benchmark (no specific JD supplied)."}

Candidate Resume:
${JSON.stringify(resumeData, null, 2)}

Provide a strict, realistic ATS audit evaluating:
1. Overall ATS Compatibility Score (0 to 100)
2. Keyword Match Analysis (matching keywords found, critical missing keywords from the job description or industry)
3. Section-by-section breakdown scores (Impact & Metrics, Action Verbs, Contact & Formatting, Relevance, Brevity)
4. Specific, actionable improvement recommendations with direct fixes.
5. Detected red flags (e.g. passive language, missing contact links, unquantified bullets).

Return a JSON object matching the requested schema.`;

    const response = await callGeminiWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            verdict: { type: Type.STRING, description: "e.g. 'Strong Match', 'ATS Ready', 'Needs Optimization', 'High Risk'" },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                keywordDensity: { type: Type.INTEGER },
                quantifiableImpact: { type: Type.INTEGER },
                formattingAndATS: { type: Type.INTEGER },
                actionVerbs: { type: Type.INTEGER },
                brevityAndClarity: { type: Type.INTEGER },
              },
              required: ["keywordDensity", "quantifiableImpact", "formattingAndATS", "actionVerbs", "brevityAndClarity"],
            },
            matchingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            criticalImprovements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                },
                required: ["section", "issue", "suggestion"],
              },
            },
            quickWins: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["overallScore", "verdict", "breakdown", "matchingKeywords", "missingKeywords", "criticalImprovements"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (err: any) {
    console.error("AI ATS Score Error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze ATS compatibility." });
  }
});

// AI Resume Tailoring
app.post(["/api/ai/tailor", "/api/ai/tailor-resume"], async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.status(400).json({ error: "Gemini API key is not configured in environment variables." });
    }

    const prompt = `You are a senior executive recruiter. Tailor the candidate's resume content to strongly align with the given Job Description without fabricating false experiences.

Job Description:
"""${jobDescription}"""

Candidate Resume:
${JSON.stringify(resumeData, null, 2)}

Provide tailored recommendations and rewritten sections:
1. Tailored Professional Headline & Summary (weaving in key job requirements).
2. Tailored bullet points for the candidate's experience entries, emphasizing relevant achievements and matching keywords.
3. Recommended skills to prioritize/add (matching candidate's domain).
4. Match percentage before and after tailoring.

Return JSON matching the schema.`;

    const response = await callGeminiWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jobTitleMatch: { type: Type.STRING },
            matchScoreBefore: { type: Type.INTEGER },
            matchScoreAfter: { type: Type.INTEGER },
            tailoredSummary: { type: Type.STRING },
            tailoredHeadline: { type: Type.STRING },
            tailoredExperiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  experienceId: { type: Type.STRING },
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  originalBullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  tailoredBullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  enhancementReason: { type: Type.STRING },
                },
                required: ["role", "company", "tailoredBullets"],
              },
            },
            recommendedSkillsToAdd: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            topKeywordsEmbedded: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["tailoredSummary", "tailoredExperiences", "recommendedSkillsToAdd", "matchScoreBefore", "matchScoreAfter"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (err: any) {
    console.error("AI Tailor Error:", err);
    res.status(500).json({ error: err.message || "Failed to tailor resume." });
  }
});

// AI Cover Letter Generator
app.post(["/api/ai/cover-letter", "/api/ai/generate-cover-letter"], async (req, res) => {
  try {
    const { resumeData, jobDescription, companyName, hiringManager, tone } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.status(400).json({ error: "Gemini API key is not configured in environment variables." });
    }

    const prompt = `Write a persuasive, highly tailored, professional 3-4 paragraph cover letter for this candidate applying to ${companyName || "the target company"}.

Hiring Manager: ${hiringManager || "Hiring Team"}
Tone: ${tone || "confident, engaging, professional"}
Job Description:
"""${jobDescription || "Standard role in candidate's field"}"""

Candidate Profile:
${JSON.stringify({
  name: resumeData?.personalInfo?.fullName,
  email: resumeData?.personalInfo?.email,
  phone: resumeData?.personalInfo?.phone,
  title: resumeData?.personalInfo?.title,
  summary: resumeData?.summary,
  experience: resumeData?.experience?.slice(0, 2),
  skills: resumeData?.skills?.slice(0, 8),
})}

Return JSON:
- "letter": Full cover letter body with opening, 2 core body paragraphs illustrating relevant wins, and compelling closing.
- "subjectLine": Catchy email/application subject line.
- "hookParagraph": The standout hook.
- "keySellingPoints": Array of 3 bullet points highlighted.`;

    const response = await callGeminiWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            letter: { type: Type.STRING },
            subjectLine: { type: Type.STRING },
            hookParagraph: { type: Type.STRING },
            keySellingPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["letter", "subjectLine"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json({
      ...data,
      coverLetter: data.letter || data.coverLetter || "",
    });
  } catch (err: any) {
    console.error("AI Cover Letter Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate cover letter." });
  }
});

// AI LinkedIn Profile Fetch & Parse into ResumeData
app.post("/api/ai/import-linkedin", async (req, res) => {
  try {
    const { linkedinUrl, rawContent } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.status(400).json({ error: "Gemini API key is not configured in environment variables." });
    }

    let fetchedHtmlOrSnippet = "";
    let cleanedUrl = (linkedinUrl || "").trim();
    if (cleanedUrl && !cleanedUrl.startsWith("http://") && !cleanedUrl.startsWith("https://")) {
      cleanedUrl = `https://${cleanedUrl}`;
    }

    if (cleanedUrl && cleanedUrl.startsWith("http")) {
      try {
        const fetchRes = await fetch(cleanedUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
          },
          signal: AbortSignal.timeout(6000),
        });
        if (fetchRes.ok) {
          const text = await fetchRes.text();
          fetchedHtmlOrSnippet = text.slice(0, 30000);
        }
      } catch (fetchErr) {
        console.warn("Direct LinkedIn fetch skipped (falling back to AI context parser):", fetchErr);
      }
    }

    const prompt = `You are a world-class resume parser, recruiter, and career architect.
Extract and convert candidate profile information from this public LinkedIn profile URL or text into a complete, high-quality, ATS-optimized JSON resume structure.

Target LinkedIn Profile URL: ${cleanedUrl || "Not specified"}

Fetched Web Snippet / HTML (if available):
"""
${fetchedHtmlOrSnippet || "No direct HTML available."}
"""

User Provided Profile Content / Text / Bio / Experience:
"""
${rawContent || "No raw text provided."}
"""

Extraction Instructions:
1. Parse or infer candidate details accurately:
   - Full Name
   - Headline / Professional Title (e.g. "Senior Full-Stack Engineer", "Lead Product Manager")
   - Contact Info (Email if available or placeholder, Phone, Location, Website, LinkedIn URL: "${cleanedUrl || "linkedin.com/in/profile"}", GitHub)
2. For Work Experience: extract company names, job titles, start and end dates (e.g. "Jan 2022", "Present"), locations, and convert responsibilities into 2-4 strong, action-driven bullet points using Google's X-Y-Z formula ("Accomplished [X] measured by [Y] by doing [Z]").
3. For Education: extract university/institution, degree (e.g. "Bachelor of Science"), field of study, graduation dates, and relevant highlights.
4. For Skills: extract 8-15 core technical, soft, and domain skills categorized appropriately.
5. For Projects / Certifications: extract any notable projects, issuer names, credentials.
6. Generate a crisp, compelling 3-4 sentence professional summary highlighting their core competencies and career trajectory.
7. Assign valid unique IDs to every list item (e.g. "exp-1", "edu-1", "skill-1").

Return a strict JSON object matching the schema.`;

    const response = await callGeminiWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                title: { type: Type.STRING },
                website: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
              },
              required: ["fullName", "title"],
            },
            summary: { type: Type.STRING },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  description: { type: Type.STRING },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["company", "role"],
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                },
                required: ["institution", "degree"],
              },
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  level: { type: Type.STRING },
                },
                required: ["name"],
              },
            },
          },
          required: ["personalInfo", "summary", "experience", "skills"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error("AI LinkedIn Error:", err);
    res.status(500).json({ error: err.message || "Failed to import LinkedIn profile." });
  }
});

export default app;
