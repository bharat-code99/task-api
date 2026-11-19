import * as auth from "./auth.service.js";
import * as users from "../users/users.repository.js";
import { AppError } from "../../utils/AppError.js";

export async function register(req, res) {
  res.status(201).json({ data: await auth.register(req.valid.body) });
}

export async function login(req, res) {
  res.json({ data: await auth.login(req.valid.body) });
}

export async function me(req, res) {
  const user = await users.findById(req.user.id);
  if (!user) throw new AppError(401, "Account no longer exists", { code: "UNAUTHENTICATED" });
  res.json({ data: user });
}

export async function refresh(req, res) {
  res.json({ data: await auth.refresh(req.valid.body.refreshToken) });
}

export async function logout(req, res) {
  await auth.logout(req.valid.body.refreshToken);
  res.status(204).end();
}

export async function logoutAll(req, res) {
  await auth.logoutAll(req.user.id);
  res.status(204).end();
}
