import { type ErrorRequestHandler } from "express";
import { type ErrorResponse } from "../helper/response.hepler";

/**
 * Global error handling middleware for the application.
 * 
 * This middleware captures all errors that occur during the request lifecycle. 
 * It creates a standardized error response and sends it to the client. The error response 
 * includes an error code (either the custom status code or 500 if not provided), 
 * a message, and any additional data related to the error.
 * 
 * @param {Error} err - The error object that was thrown during request processing.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object used to send the error response.
 * @param {NextFunction} next - The next middleware function in the stack, which is not called here since we send a response.
 * 
 * @returns {void} - This function doesn't return a value, it sends a response directly.
 */
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const response: ErrorResponse = {
    success: false,
    error_code: (err?.status ?? 500) as number,
    message: (err?.message ?? "Something went wrong!") as string,
    data: err?.data ?? {},
  };

  res.status(response.error_code).send(response);
  next();
};

export default errorHandler;
