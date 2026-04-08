import { Router } from "express";
import { ZodError, z } from "zod";
import { applicationStatuses } from "../constants/application.js";
import { requireAuth } from "../middleware/auth.js";
import { applicationSchema, parseJobDescriptionSchema } from "../schemas/application.js";
import {
  createApplication,
  deleteApplication,
  listApplications,
  updateApplication,
  updateApplicationStatus
} from "../services/applicationService.js";
import { parseJobDescription } from "../services/aiService.js";
import { sendError } from "../utils/http.js";

export const applicationRouter = Router();

applicationRouter.use(requireAuth);

applicationRouter.get("/", async (req, res) => {
  const applications = await listApplications(req.user.userId);
  res.json(applications);
});

applicationRouter.post("/", async (req, res) => {
  try {
    const payload = applicationSchema.parse(req.body);
    const application = await createApplication(req.user.userId, payload);
    res.status(201).json(application);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, 400, error.issues[0]?.message ?? "Invalid application");
    }

    return sendError(res, 500, "Unable to create application");
  }
});

applicationRouter.put("/:id", async (req, res) => {
  try {
    const payload = applicationSchema.parse(req.body);
    const application = await updateApplication(req.user.userId, req.params.id, payload);

    if (!application) {
      return sendError(res, 404, "Application not found");
    }

    res.json(application);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, 400, error.issues[0]?.message ?? "Invalid application");
    }

    return sendError(res, 500, "Unable to update application");
  }
});

applicationRouter.patch("/:id/status", async (req, res) => {
  try {
    const { status } = z.object({ status: z.enum(applicationStatuses) }).parse(req.body);
    const application = await updateApplicationStatus(req.user.userId, req.params.id, status);

    if (!application) {
      return sendError(res, 404, "Application not found");
    }

    res.json(application);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, 400, error.issues[0]?.message ?? "Invalid status");
    }

    return sendError(res, 500, "Unable to update status");
  }
});

applicationRouter.delete("/:id", async (req, res) => {
  const application = await deleteApplication(req.user.userId, req.params.id);

  if (!application) {
    return sendError(res, 404, "Application not found");
  }

  res.status(204).send();
});

applicationRouter.post("/parse", async (req, res) => {
  try {
    const { jobDescription } = parseJobDescriptionSchema.parse(req.body);
    const parsedData = await parseJobDescription(jobDescription);
    res.json(parsedData);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, 400, error.issues[0]?.message ?? "Invalid job description");
    }

    if (error instanceof Error) {
      return sendError(
        res,
        502,
        error.message || "AI could not parse the job description. Please try again."
      );
    }

    return sendError(res, 502, "AI could not parse the job description. Please try again.");
  }
});
