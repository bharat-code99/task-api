import { query } from "../../db/pool.js";

export async function list({ userId, status, limit, offset }) {
  const { rows } = await query(
    `
    SELECT * FROM tasks 
    WHERE ($1::int IS NULL OR user_id = $1)
    AND ($2::text IS NULL OR status = $2)
    ORDER BY created_at DESC, id DESC
    LIMIT $3 OFFSET $4
    `,
    [userId ?? null, status ?? null, limit, offset],
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await query("SELECT * FROM tasks WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function create(userId, { title, description = null, status = "todo" }) {
  const { rows } = await query(
    "INSERT INTO tasks (user_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, title, description, status],
  );
  return rows[0];
}

const UPDATEABLE = ["title", "description", "status"];
export async function update(id, changes) {
  const entries = Object.entries(changes).filter(([key]) => UPDATEABLE.includes(key));
  if (entries.length === 0) return findById(id);

  const assignments = entries.map(([key], i) => `${key} = $${i + 1}`);
  const values = entries.map(([, value]) => value);
  const { rows } = await query(
    `UPDATE tasks SET ${assignments.join(", ")}, updated_at = now()
    WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id],
  );
  return rows[0] ?? null;
}

export async function remove(id) {
  const { rowCount } = await query(`DELETE FROM tasks WHERE id = $1`, [id]);
  return rowCount > 0;
}
