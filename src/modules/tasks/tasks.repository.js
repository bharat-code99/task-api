let nextId = 1;
const tasks = [];

export async function list() {
  return tasks;
}

export async function findById(id) {
  return tasks.find((t) => t.id === id) ?? null;
}

export async function create({ title, description = null, status = 'todo' }) {
  const now = new Date().toISOString();
  const task = { id: nextId++, title, description, status, created_at: now, updated_at: now };
  tasks.push(task);
  return task;
}

export async function update(id, changes) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  Object.assign(task, changes, { updated_at: new Date().toISOString() });
  return task;
}

export async function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}