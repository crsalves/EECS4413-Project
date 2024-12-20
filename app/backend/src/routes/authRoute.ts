import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/asyncHandler';

export const authRouter = Router();
const authController = new AuthController();

/**
 * Logs in a user by verifying credentials and issuing a JWT token.
 *
 * @route POST /auth/login
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
authRouter.post(
	'/login',
	asyncHandler(async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const result = await authController.login(email, password);

		return res.status(result.statusCode).json(result);
	})
);

/**
 * Registers a new user in the system.
 *
 * @route POST /auth/register
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
authRouter.post(
	'/register',
	asyncHandler(async (req: Request, res: Response) => {
		const result = await authController.register(req);

		return res.status(result.statusCode).json(result);
	})
);

/**
 * A protected route accessible only to admin users.
 *
 * @route GET /auth/admin-only
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
authRouter.get(
	'/admin-only',
	authenticateToken,
	authorizeRole('admin'),
	asyncHandler(async (req: Request, res: Response) => {
		return res.status(200).json({ message: 'Welcome Admin!' });
	})
);
