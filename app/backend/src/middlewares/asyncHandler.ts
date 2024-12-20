/**
 * Handles try-catch logic globally to increase code readability.
 */
import { Request, Response, NextFunction } from 'express';

/**
 * Utility to wrap async route handlers for error handling.
 * Automatically passes errors to the next middleware.
 * @param {Function} fn - The async route handler function
 * @returns {Function} - The wrapped route handler function
 */
export const asyncHandler = (fn: Function) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
