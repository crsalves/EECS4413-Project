import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const JWT_SECRET = 'your_jwt_secret';

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload | string; // Attach user to the request object
		}
	}
}

/**
 * Middleware to authenticate JWT tokens.
 * Validates the token from the Authorization header and attaches the decoded user information to the request object.
 *
 * @param req Express Request object
 * @param res Express Response object
 * @param next Express NextFunction callback
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];

	// Check if the authorization header is missing
	if (!authHeader) {
		return res.status(401).json({ message: 'Access token is missing' });
	}

	const token = authHeader.split(' ')[1]; // Extract the token from the header

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			console.log('Error verifying token:', authHeader);
			console.log('Error verifying token:', err);
			return res.status(403).json({ message: 'Invalid or expired token' });
		}

		req.user = decoded; // Attach decoded user info to the request
		next();
	});
};

/**
 * Middleware to authorize users based on their role.
 * Checks the user's role (e.g., 'customer', 'admin') and grants access if it matches the required role.
 *
 * @param requiredRole The role required to access the route (e.g., 'customer', 'admin')
 * @returns Express middleware function
 */
export const authorizeRole = (requiredRole: 'customer' | 'admin') => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as JwtPayload; // Ensure user is of JwtPayload type

		if (!user || user.role !== requiredRole) {
			return res.status(403).json({ message: 'Access denied' });
		}

		next();
	};
};
