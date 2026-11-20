import { query } from "../../db/pool.js";

const PUBLIC_COLUMNS = "id, email, name, role, created_at";

export async function create({ email, name, passwordHash }) {
  const { rows } = await query(
    `INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING ${PUBLIC_COLUMNS}`,
    [email, name, passwordHash],
  );
  return rows[0];
}

export async function findByEmailWithPassword(email) {
  const { rows } = await query("SELECT * FROM user WHERE email = $1", [email]);
  return rows[0] ?? null;
}

export async function findById(id) {
  const { rows } = await query(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function list({ limit, offset }) {
  const { rows } = await query(`SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY id LIMIT $1 OFFSET $2`, [limit, offset]);
  return rows;
}

export async function updateRole(id, role) {
  const { rows } = await query(`UPDATE users SET role = $2 WHERE id = $1 RETURNING ${PUBLIC_COLUMNS}`, [id, role]);
  return rows[0] ?? null;
}
