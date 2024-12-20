/**
 * Utility class for handling errors in the application.
 *
 * @file ErrorHandler.ts
 * @author Carla da Silva Alves
 */

// Handles process-level errors and provides an error utility class for application-specific errors.
export class ErrorHandler {
	constructor() {
		this.initialize();
	}

	/**
	 * Initializes process-level error handlers.
	 */
	private initialize() {
		process.on('uncaughtException', this.handleUncaughtException);
		process.on('unhandledRejection', this.handleUnhandledRejection);
	}

	/**
	 * Handles uncaught exceptions in the process.
	 * @param {Error} err - The error object.
	 */
	private handleUncaughtException(err: Error) {
		console.error('Uncaught Exception:', err.message);
		// Optionally log the error to an external service
		// Optionally exit the process if the error is critical
	}

	/**
	 * Handles unhandled promise rejections.
	 * @param {any} reason - The rejection reason.
	 * @param {Promise<any>} promise - The rejected promise.
	 */
	private handleUnhandledRejection(reason: any, promise: Promise<any>) {
		console.error('Unhandled Rejection:', reason);
		// Optionally log the rejection to an external service
	}
}

/**
 * Custom Error Class for Application-Specific Errors.
 */
export class AppError extends Error {
	public statusCode: number;

	/**
	 * Creates a new instance of AppError.
	 * @param {number} statusCode - HTTP status code for the error.
	 * @param {string} message - Error message.
	 */
	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;

		// Ensures the correct prototype is used for instanceof checks
		Object.setPrototypeOf(this, new.target.prototype);

		// Maintains proper stack trace in case of a thrown error
		Error.captureStackTrace(this);
	}
}
