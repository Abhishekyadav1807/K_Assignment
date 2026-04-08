import { Router } from "express";
import { ZodError } from "zod";
import { authSchema } from "../schemas/auth.js";
import { loginUser, registerUser } from "../services/authService.js";
import { sendError } from "../utils/http.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const result = await registerUser(email, password);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, 400, error.issues[0]?.message ?? "Invalid input");
    }

    if (error instanceof Error) {
      return sendError(res, 400, error.message);
    }

    return sendError(res, 500, "Unable to register");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, 400, error.issues[0]?.message ?? "Invalid input");
    }

    if (error instanceof Error) {
      return sendError(res, 400, error.message);
    }

    return sendError(res, 500, "Unable to login");
  }
});
