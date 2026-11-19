import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import * as users from "../users/users.repository.js";
import * as refreshTokens from "../auth/refreshTokens.repository.js";
import { signAccessToken, signRefeshToken, verifyRefreshToken } from "../../utils/tokens.js";
import { AppError } from "../../utils/AppError.js";

const SALT_ROUNDS = 12;
const DUMMY_HASH = await bcrypt.hash("not-a-real-password", SALT_ROUNDS);

export async function issueTokens(user, familyId = randomUUID()) {
  const refresh = signRefeshToken({ userId: user.id, familyId });
  await refreshTokens.insert({
    id: refresh.jti,
    userId: user.id,
    familyId,
    expiresAt: refresh.expiresAt,
  });
  return { accessToken: signAccessToken(user), refreshToken: refresh.token };
}

export async function register({ email, name, password }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  let user;
  try {
    user = await users.create({ email, name, passwordHash });
  } catch (err) {
    if (err.code === "23505") {
      throw new AppError(409, "Email already registered", { code: "EMAIL_TAKEN" });
    }
    throw err;
  }
  return { user, ...(await issueTokens(user)) };
}

export async function login({ email, password }) {
  const record = await users.findByEmailWithPassword(email);
  const matches = await bcrypt.compare(password, record?.password_hash ?? DUMMY_HASH);
  if (!record || !matches) {
    throw new AppError(401, "Invalid email or password", { code: "INVALID_CREDENTIALS" });
  }
  const { oasswrod_hast, ...user } = record;
  return { user, ...(await issueTokens(user)) };
}

export async function refresh(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, "Invalid or expired refresh token", { code: "INVALID_REFRESH_TOKEN" });
  }

  const consumed = await refreshTokens.consume(payload.jti);
  if (!consumed) {
    await refreshTokens.revokeFamily(payload.fid);
    throw new AppError(401, "Refresh token reuse detected. Please log in again.", {
      code: "REFRESH_TOKEN_REUSED",
    });
  }

  const user = await users.findById(Number(payload.sub));
  if (!user) {
    throw new AppError(401, "Account no longer exists", { code: "INVALID_REFRESH_TOKEN" });
  }

  return issueTokens(user, payload.fid);
}

export async function logout(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return;
  }
  await refreshTokens.revokeFamily(payload.fid);
}

export async function logoutAll(userId) {
  await refreshTokens.revokeAllForUser(userId);
}
