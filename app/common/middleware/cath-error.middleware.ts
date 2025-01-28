import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

/**
 * Middleware to handle validation errors in request data.
 * 
 * This middleware checks if the validation of the request body (using `express-validator`) has passed. 
 * If validation errors are found, it throws an HTTP 400 error with the validation error details.
 * If no validation errors are present, it calls the next middleware or handler in the pipeline.
 * 
 * @param {Request} req - The Express request object containing the data to be validated.
 * @param {Response} res - The Express response object used to send the response.
 * @param {NextFunction} next - The next middleware or route handler to be called if validation passes.
 * 
 * @throws {createHttpError.HttpError} - Throws a 400 HTTP error with validation error details if validation fails.
 */
export const catchError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const isError = errors.isEmpty();
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!isError) {
      const data = { errors: errors.array() };
      throw createHttpError(400, {
        message: "Validation error!",
        data,
      });
    } else {
      next();
    }
  }
);
