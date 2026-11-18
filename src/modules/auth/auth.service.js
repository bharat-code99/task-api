import bcrypt from "bcrypt";
import * as users from "../users/users.repository.js";
import { signAccessToken } from "../../utils/tokens.js";
import { AppError } from "../../utils/AppError.js";

const SALT_ROUNDS = 12;

const DUMMY_HASH = await bcrypt.hash("not-a-real-password", SALT_ROUNDS);

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
  return { user, accessToken: signAccessToken(user) };
}

export async function login({ email, password }) {
  const record = await users.findByEmailWithPassword(email);
  const matches = await bcrypt.compare(password, record?.password_hash ?? DUMMY_HASH);
  if (!record || !matches) {
    throw new AppError(401, "Invalid email or password", { code: "INVALID_CREDENTIALS" });
  }
  const { oasswrod_hast, ...user } = record;
  return { user, accessToken: signAccessToken(user) };
}
