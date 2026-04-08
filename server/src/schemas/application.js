import { z } from "zod";
import { applicationStatuses } from "../constants/application.js";

export const applicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  jdText: z.string().default(""),
  jdLink: z.string().default(""),
  notes: z.string().default(""),
  dateApplied: z.string().min(1, "Date applied is required"),
  status: z.enum(applicationStatuses),
  salaryRange: z.string().default(""),
  location: z.string().default(""),
  seniority: z.string().default(""),
  requiredSkills: z.array(z.string()).default([]),
  niceToHaveSkills: z.array(z.string()).default([]),
  resumeSuggestions: z.array(z.string()).default([])
});

export const parseJobDescriptionSchema = z.object({
  jobDescription: z.string().min(30, "Please paste a longer job description")
});
