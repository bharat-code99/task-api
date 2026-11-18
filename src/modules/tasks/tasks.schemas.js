import { z } from "zod";
import { pagination } from "../../validation/common.js";

const status = z.enum(["todo", "in_progress", "done"]);

export const createTaskBody = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  status: status.optional(),
});

export const updateTaskBody = createTaskBody.partial().refine((body) => Object.keys(body).length > 0, {
  message: "Provide at least one field to update",
});

export const listTasksQuery = pagination.extend({ status: status.optional() });
