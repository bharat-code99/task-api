import { AppError } from "../utils/AppError.js";

export function notFound(req, res) {
  res.status(404).json({
    error: { message: `Route ${req.method} ${req.orignalURL} not found`, code: "ROUTE_NOT_FOUND" },
  });
}

export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;
  const isClientError = status < 500;

  if (!isClientError) console.error(err);

  let message = "Internal Server Error";
  if (isClientError) {
    message = err.type === "entity.parse.failed" ? "Malformed JSON Body" : err.message;
  }

  const body = { message };
  if (err instanceof AppError) {
    if (err.code) body.code = err.code;
    if (err.details) body.details = err.details;
  }

  res.status(status).json({ error: body });
}
