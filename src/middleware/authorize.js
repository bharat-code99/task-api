import { hasPermission } from "../config/permissions.js";
import { AppError } from "../utils/AppError.js";

export const requirePermission = (permission) => (req, res, next) => {
  if (!hasPermission(req.user.role, permission)) {
    throw new AppError(403, "You do not have permission to do this", { code: "FORBIDDEN" });
  }
  next();
};
