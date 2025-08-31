import { ErrorRequestHandler } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError } from "zod";

export const errorHandling: ErrorRequestHandler = (
  error,
  request,
  response,
  next
) => {
  // instancia de AppError
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  // instancia de ZodError
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "validation error",
      issues: error.format(),
    });
  }
  // se não for instancia de AppError ou ZodError
  return response.status(400).json({ message: error.message });
};
