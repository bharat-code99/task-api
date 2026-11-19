import { query } from "../../db/pool.js";

export async function insert({ id, userId, familyId, expiresAt }) {
  await query("INSERT INTO refresh_tokens (id, user_id, family_id, expires_at) VALUES ($1, $2, $3, $4)", [
    id,
    userId,
    familyId,
    expiresAt,
  ]);
}

export async function consume(id) {
  const { rows } = await query(
    `UPDATE refresh_tokens SET revoked_at = now()
    WHERE id = $1 AND revoked_at IS NULL AND expires_at > now()
    RETURNING id
    `,
    [id],
  );

  return rows[0] ?? null;
}

export async function revokeFamily(familyId) {
  await query("UPDATE refresh_tokens SET revoked_at = now() WHERE family_id = $1 AND revoked_at IS NULL", [familyId]);
}

export async function revokeAllForUser(userId) {
  await query("UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL", [userId]);
}

export async function purgeExpired() {
  await query("DELETE FROM refresh_tokens WHERE expires_at < now() - interval '1 day'");
}
