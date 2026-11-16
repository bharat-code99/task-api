import { Router } from "express";
import { listTasks, getTask, updateTask, createTask, deleteTask } from "./tasks.controller.js";

const router = Router();

router.route("/").get(listTasks).post(createTask);
router.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

export default router;
