import * as users from "./users.repository.js";
import * as refreshTokens from "../auth/refreshTokens.repository.js";
import { AppError } from "../../utils/AppError.js";

export async function listUsers(req, res) {
  res.json({ data: await users.list(req.valid.query) });
}

export async function changeRole(req, res) {
  const { id } = req.valid.params;
  if (id === req.user.id) {
    throw new AppError(400, "You cannot change your own role", { code: "SELF_ROLE_CHANGE" });
  }
  const user = await users.updateRole(id, req.valid.body.role);
  if (!user) throw new AppError(404, "User not found");

  await refreshTokens.revokeAllForUser(id);
  res.json({ data: user });
}
