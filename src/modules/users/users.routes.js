import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/authorize.js";
import { PERMISSIONS } from "../../config/permissions.js";
import { idParam, pagination } from "../../validation/common.js";
import { updateRoleBody } from "./users.schemas.js";
import { changeRole, listUsers } from "./users.controller.js";

const router = Router();
router.use(authenticate);

router.get("/", requirePermission(PERMISSIONS.USERS_READ), validate({ query: pagination }), listUsers);

router.patch(
  "/:id/role",
  requirePermission(PERMISSIONS.USERS_MANAGE),
  validate({ params: idParam, body: updateRoleBody }),
  changeRole,
);

export default router;
