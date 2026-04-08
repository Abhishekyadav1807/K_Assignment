import OpenAI from "openai";
import { z } from "zod";
import { env } from "../config/env.js";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
});

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
  const completion = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    response_format: {
      type: "json_object"
    },
    messages: [
      {
        role: "system",
        content:
          "You extract structured hiring details from job descriptions and create concrete, role-specific resume bullets. Return valid JSON only."
      },
      {
        role: "user",
        content: `Extract the following fields from this job description and generate 3 to 5 tailored resume bullet points.\n\nReturn JSON with exactly these keys:\ncompany, role, requiredSkills, niceToHaveSkills, seniority, location, resumeSuggestions\n\nRules:\n- resumeSuggestions must be specific to the role and skills in the job description.\n- requiredSkills and niceToHaveSkills must be arrays of strings.\n- If a value is missing, use an empty string or empty array.\n\nJob description:\n${jobDescription}`
      }
    ]
  });

  const messageContent = completion.choices[0]?.message?.content;

  if (!messageContent) {
    throw new Error("AI parser returned an empty response");
  }

  return parseStructuredResponse(messageContent);
};
