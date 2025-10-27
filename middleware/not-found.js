import { StatusCodes } from "http-status-codes";

export function NotFoundHandler(req, res, next) {
  res.status(StatusCodes.BAD_REQUEST).json({ error: "Route not found" });
}
