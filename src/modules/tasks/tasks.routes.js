import { Router } from 'express';
import { listTasks, getTask, createTask, updateTask, deleteTask } from './tasks.controller.js';

const router = Router();

router.route('/').get(listTasks).post(createTask);
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);

export default router;