import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { idParam } from "../../validation/common.js";
import { authenticate } from "../../middleware/authenticate.js";
import { createTaskBody, updateTaskBody, listTasksQuery } from "./tasks.schemas.js";
import { listTasks, getTask, updateTask, createTask, deleteTask } from "./tasks.controller.js";

const router = Router();
router.use(authenticate);

router
  .route("/")
  .get(validate({ query: listTasksQuery }), listTasks)
  .post(validate({ body: createTaskBody }), createTask);

router
  .route("/:id")
  .all(validate({ params: idParam }))
  .get(getTask)
  .patch(validate({ body: updateTaskBody }), updateTask)
  .delete(deleteTask);

export default router;
