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

export const parseJobDescription = async (jobDescription) => {
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
                text: `Extract the following fields from this job description and generate 3 to 5 tailored resume bullet points.

Return JSON with exactly these keys:
company, role, requiredSkills, niceToHaveSkills, seniority, location, resumeSuggestions

Rules:
- resumeSuggestions must be specific to the role and skills in the job description.
- requiredSkills and niceToHaveSkills must be arrays of strings.
- If a value is missing, use an empty string or empty array.

Job description:
${jobDescription}`
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
    const errorText = await response.text();
    throw new Error(errorText || "AI parser request failed");
  }

  const data = await response.json();
  const messageContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!messageContent) {
    throw new Error("AI parser returned an empty response");
  }

  return parseStructuredResponse(messageContent);
};
