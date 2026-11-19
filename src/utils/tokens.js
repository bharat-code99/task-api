import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { randomUUID } from "node:crypto";

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

export function signRefeshToken({ userId, familyId }) {
  const jti = randomUUID();
  const token = jwt.sign({ fid: familyId }, env.JWT_REFRESH_SECRET, {
    subject: String(userId),
    jwtid: jti,
    expiresIn: env.JWT_REFRESH_TTL,
    algorithm: "HS256",
  });

  const { exp } = jwt.decode(token);
  return { token, jti, expiresAt: new Date(exp * 1000) };
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: ["HS256"] });
}
