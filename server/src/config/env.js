import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default("llama-3.1-8b-instant"),
  CLIENT_URL: z.string().default("http://localhost:5173")
}).superRefine((value, context) => {
  if (!value.GEMINI_API_KEY && !value.GROQ_API_KEY) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Set either GEMINI_API_KEY or GROQ_API_KEY"
    });
  }
});

export const env = envSchema.parse(process.env);
