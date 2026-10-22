import * as tasks from './tasks.repository.js';
import { AppError } from '../../utils/AppError.js';

export async function listTasks(req, res) {
  res.json({ data: await tasks.list() });
}

export async function getTask(req, res) {
  const task = await tasks.findById(Number(req.params.id));
  if (!task) throw new AppError(404, 'Task not found');
  res.json({ data: task });
}

export async function createTask(req, res) {
  const task = await tasks.create(req.body);
  res.status(201).json({ data: task });
}

export async function updateTask(req, res) {
  const task = await tasks.update(Number(req.params.id), req.body);
  if (!task) throw new AppError(404, 'Task not found');
  res.json({ data: task });
}

export async function deleteTask(req, res) {
  const deleted = await tasks.remove(Number(req.params.id));
  if (!deleted) throw new AppError(404, 'Task not found');
  res.status(204).end();
}