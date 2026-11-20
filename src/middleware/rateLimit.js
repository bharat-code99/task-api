import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === "production" ? 20 : 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: { message: "Too many attempts, try again later", code: "RATE_LIMITED" } },
});
