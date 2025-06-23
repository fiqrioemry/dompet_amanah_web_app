import { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError";

const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error("❌ Error Stack:", err.stack);
  }

  console.log(`❌ Error: ${message} (Status Code: ${statusCode})`);

  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export default errorHandler;
