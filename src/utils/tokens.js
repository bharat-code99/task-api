import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign({ role: user.role }, env.JWT_ACCESS_SECRET, {
    subject: String(user.id),
    expiresIn: env.JWT_ACCESS_TTL,
    algorithm: "HS256",
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ["HS256"] });
}
