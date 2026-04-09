import { z } from "zod";
import { env } from "../config/env.js";

const parsedJobSchema = z.object({
  company: z.string(),
  role: z.string(),
  requiredSkills: z.array(z.string()),
  niceToHaveSkills: z.array(z.string()),
  seniority: z.string(),
  location: z.string(),
  resumeSuggestions: z.array(z.string()).min(3).max(5)
});

const fallbackArray = (value) =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];

export class AiServiceError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "AiServiceError";
    this.statusCode = statusCode;
  }
}

const parseStructuredResponse = (content) => {
  const raw = JSON.parse(content);

  return parsedJobSchema.parse({
    company: typeof raw.company === "string" ? raw.company : "",
    role: typeof raw.role === "string" ? raw.role : "",
    requiredSkills: fallbackArray(raw.requiredSkills),
    niceToHaveSkills: fallbackArray(raw.niceToHaveSkills),
    seniority: typeof raw.seniority === "string" ? raw.seniority : "",
    location: typeof raw.location === "string" ? raw.location : "",
    resumeSuggestions: fallbackArray(raw.resumeSuggestions)
  });
};

const parserPrompt = (jobDescription) => `Extract the following fields from this job description and generate 3 to 5 tailored resume bullet points.

Return JSON with exactly these keys:
company, role, requiredSkills, niceToHaveSkills, seniority, location, resumeSuggestions

Rules:
- resumeSuggestions must be specific to the role and skills in the job description.
- requiredSkills and niceToHaveSkills must be arrays of strings.
- If a value is missing, use an empty string or empty array.
- Return valid JSON only.

Job description:
${jobDescription}`;

const parseWithGroq = async (jobDescription) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.GROQ_MODEL,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: parserPrompt(jobDescription) }],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    let providerMessage = "";

    try {
      const errorBody = await response.json();
      providerMessage = errorBody?.error?.message || "";
    } catch {
      providerMessage = "";
    }

    if (response.status === 429) {
      throw new AiServiceError(
        "Parser quota is exhausted for the current API key. Add quota/billing or use another active key, then try again.",
        429
      );
    }

    if (response.status === 401 || response.status === 403) {
      throw new AiServiceError(
        "Parser API key is invalid or does not have access to the selected model. Check GROQ_API_KEY and GROQ_MODEL.",
        401
      );
    }

    throw new AiServiceError(
      providerMessage || "Parser service request failed. Please try again in a moment.",
      502
    );
  }

  const data = await response.json();
  const messageContent = data.choices?.[0]?.message?.content;

  if (!messageContent) {
    throw new AiServiceError("Parser returned an empty response. Please try again.", 502);
  }

  return parseStructuredResponse(messageContent);
};

export const parseJobDescription = async (jobDescription) => {
  if (env.GROQ_API_KEY) {
    return parseWithGroq(jobDescription);
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": env.GEMINI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: parserPrompt(jobDescription)
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              company: { type: "STRING" },
              role: { type: "STRING" },
              requiredSkills: {
                type: "ARRAY",
                items: { type: "STRING" }
              },
              niceToHaveSkills: {
                type: "ARRAY",
                items: { type: "STRING" }
              },
              seniority: { type: "STRING" },
              location: { type: "STRING" },
              resumeSuggestions: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            },
            required: [
              "company",
              "role",
              "requiredSkills",
              "niceToHaveSkills",
              "seniority",
              "location",
              "resumeSuggestions"
            ]
          }
        }
      })
    }
  );

  if (!response.ok) {
    let providerMessage = "";

    try {
      const errorBody = await response.json();
      providerMessage = errorBody?.error?.message || "";
    } catch {
      providerMessage = "";
    }

    if (response.status === 429) {
      throw new AiServiceError(
        "Parser quota is exhausted for the current API key. Add quota/billing or use another active key, then try again.",
        429
      );
    }

    if (response.status === 401 || response.status === 403) {
      throw new AiServiceError(
        "Parser API key is invalid or does not have access to the selected model. Check GEMINI_API_KEY and GEMINI_MODEL.",
        401
      );
    }

    throw new AiServiceError(
      providerMessage || "Parser service request failed. Please try again in a moment.",
      502
    );
  }

  const data = await response.json();
  const messageContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!messageContent) {
    throw new AiServiceError("Parser returned an empty response. Please try again.", 502);
  }

  return parseStructuredResponse(messageContent);
};
