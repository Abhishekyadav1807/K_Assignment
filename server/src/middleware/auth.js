import { sendError } from "../utils/http.js";
import { verifyToken } from "../utils/jwt.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return sendError(res, 401, "Authentication required");
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return sendError(res, 401, "Invalid or expired token");
  }
};
