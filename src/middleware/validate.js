import { AppError } from "../utils/AppError.js";

export const validate = (schemas) => (req, res, next) => {
  const details = [];
  req.valid = {};

  for (const part of ["params", "query", "body"]) {
    if (!schemas[part]) continue;
    const result = schemas[part].safeParse(req[part] ?? {});
    if (result.success) {
      req.valid[part] = result.data;
    } else {
      for (const issue of result.error.issues) {
        details.push({ in: part, path: issue.path.join("."), message: issue.message });
      }
    }
  }

  if (details.length > 0) {
    throw new AppError(400, "Validation Failed", { code: "VALIDATION_ERROR", details });
  }

  next();
};
