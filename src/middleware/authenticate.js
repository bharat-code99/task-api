import { verifyAccessToken } from "../utils/tokens.js";
import { AppError } from "../utils/AppError.js";

export function authenticate(req, res, next) {
  const [scheme, token] = (req.get("authorization") ?? "").split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new AppError(401, "Missing or Malformed Authorization header", { code: "UNAUTHENTICATED" });
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    const expired = err.name === "TokenExpiredError";
    throw new AppError(401, expired ? "Access token expired" : "Invalid access token", {
      code: expired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
    });
  }

  req.user = { id: Number(payload.sub), role: payload.role };
  next();
}
