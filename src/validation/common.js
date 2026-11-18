import { z } from "zod";

const MAX_INT = 2_147_483_647;

export const idParam = z.object({
  id: z.coerce.number().int().positive().max(MAX_INT),
});

export const pagination = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
