import { StatusCodes } from "http-status-codes";

function ErrorHandlerMiddleware(err, req, res, next) {
  const message = err.message || "internal server error";
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  console.log(err)

  if (err.statusCode === StatusCodes.SERVICE_UNAVAILABLE) {
    return res.status(statusCode).json({
      error: err.message || "Service Unavailable",
      details:
        err.details ||
        "The external service is currently unavailable. Please try again later.",
    });
  }

  res.status(statusCode).json({ error: message });
}

export default ErrorHandlerMiddleware;
