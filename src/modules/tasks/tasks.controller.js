import * as tasks from "./tasks.repository.js";
import { AppError } from "../../utils/AppError.js";
import { hasPermission, PERMISSIONS } from "../../config/permissions.js";

async function loadTask(req, action) {
  const task = await tasks.findById(req.valid.params.id);
  if (!task) throw new AppError(404, "Task not found");

  const { id: userId, role } = req.user;
  const isOwner = task.user_id === userId;
  const canRead = isOwner || hasPermission(role, PERMISSIONS.TASKS_READ_ANY);
  const canWrite = isOwner || hasPermission(role, PERMISSIONS.TASKS_WRITE_ANY);

  if (!canRead) throw new AppError(404, "Task not found");
  if (action === "write" && !canWrite) {
    throw new AppError(403, "You cannot modify this task", { code: "FORBIDDEN" });
  }
  return task;
}

export async function listTasks(req, res) {
  const seesAll = hasPermission(req.user.role, PERMISSIONS.TASKS_READ_ANY);
  const data = await tasks.list({
    ...req.valid.query,
    userId: seesAll ? undefined : req.user.id,
  });
  res.json({ data });
}

export async function getTask(req, res) {
  res.json({ data: await loadTask(req, "read") });
}

export async function createTask(req, res) {
  const task = await tasks.create(req.user.id, req.valid.body);
  res.status(201).json({ data: task });
}

export async function updateTask(req, res) {
  await loadTask(req, "write");
  const task = await tasks.update(req.valid.params.id, req.valid.body);
  res.json({ data: task });
}

export async function deleteTask(req, res) {
  await loadTask(req, "write");
  await tasks.remove(req.valid.params.id);
  res.status(204).end();
}
