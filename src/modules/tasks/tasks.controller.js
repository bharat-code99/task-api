import * as tasks from "./tasks.repository.js";
import { AppError } from "../../utils/AppError.js";

async function loadOwnedTask(req) {
  const task = await tasks.findById(req.valid.params.id);
  if (!task || task.user_id !== req.user.id) throw new AppError(404, "Task Not Found");
  return task;
}

export async function listTasks(req, res) {
  res.json({ data: await tasks.list({ ...req.valid.query, userId: req.user.id }) });
}

export async function getTask(req, res) {
  res.json({ data: await loadOwnedTask(req) });
}

export async function createTask(req, res) {
  const task = await tasks.create(req.user.id, req.valid.body);
  res.status(201).json({ data: task });
}

export async function updateTask(req, res) {
  await loadOwnedTask(req);
  const task = await tasks.update(req.valid.params.id, req.valid.body);
  res.json({ data: task });
}

export async function deleteTask(req, res) {
  await loadOwnedTask(req);
  await tasks.remove(req.valid.params.id);
  res.status(204).end();
}
