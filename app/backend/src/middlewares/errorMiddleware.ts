/**
 * Middleware for handling errors globally.
 * This middleware ensures all errors from routes, controllers, or models
 * are handled and responded to consistently.
 * @file errorMiddleware.ts
 * @author Carla da Silva Alves
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/ErrorHandler';

/**
 * Centralized error handling middleware.
 * @param {Error | AppError} err - The error object
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {void}
 */
export const errorMiddleware = (err: AppError | Error, req: Request, res: Response, next: NextFunction): void => {
	// Extract statusCode and message from AppError or fallback to defaults
	const statusCode = (err instanceof AppError ? err.statusCode : 500) || 500;
	const message = err.message || 'Internal Server Error';

	// Log the error for debugging
	console.error(`[${new Date().toISOString()}] Error: ${message}`, err);

	// Respond with a JSON error object
	res.status(statusCode).json({
		success: false,
		message
	});
};
