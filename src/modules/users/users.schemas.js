import { z } from "zod";

export const updateRoleBody = z.object({
  role: z.enum(["user", "admin", "manager"]),
});
