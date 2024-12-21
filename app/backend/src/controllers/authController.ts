import { Request } from 'express';
import { UserDAO } from '../models/user/UserDAO';
import { UserModel } from '../models/user/UserModel';
import { comparePasswords, hashPassword } from '../utils/hashUtils';
import { JWT_SECRET } from '../middlewares/authMiddleware';
import jwt from 'jsonwebtoken';


export class AuthController {
	private userDAO: UserDAO;

	constructor() {
		this.userDAO = new UserDAO();
	}

	// Handles user login
	async login(
		email: string,
		password: string
	): Promise<{
		success: boolean;
		statusCode: number;
		message: string;
		token?: string;
		user?: any;
		userAddress?: any;
		userPayment?: any;
	}> {
		console.log('getting token for user:', email, password);
		if (!email || !password) {
			return { success: false, statusCode: 400, message: 'Email and password are required.' };
		}

		try {
			const user = await this.userDAO.selectUserByEmail(email);

			if (user.statusCode === 404 || !user) {
				return { success: false, statusCode: 404, message: 'Email not found.' };
			}

			const userAddress = await this.userDAO.selectUserAddress(user.userId);

			const userPayment = await this.userDAO.selectUserPayment(user.userId);

			if (!(await comparePasswords(password, user.passwordHash))) {
				return { success: false, statusCode: 401, message: 'Password entered is not valid' };
			}

			const token = jwt.sign({ userId: user.userId, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

			return {
				success: true,
				statusCode: 200,
				message: 'Login successful.',
				token: `Bearer ${token}`,
				user: { userId: user.userId, name: user.name, email: user.email, phone: user.phone, role: user.role }, // Transform user to a model instance
				userAddress: userAddress,
				userPayment: userPayment
			};
		} catch (err) {
			return { success: false, statusCode: 500, message: 'An unexpected error occurred.' };
		}
	}

	// Handles user registration
	async register(req: Request): Promise<{ success: boolean; statusCode: number; message: string; userId?: number }> {
		const { name, email, password, ...address } = req.body;

		if (!name || !email || !password) {
			return { success: false, statusCode: 400, message: 'Name, email, and password are required.' };
		}

		try {
			const hashedPassword = await hashPassword(password);

			const newUser: UserModel = new UserModel({
				name,
				email,
				passwordHash: hashedPassword,
				...address,
				role: 'customer'
			});

			const userId = await this.userDAO.insertUser(newUser);

			return {
				success: true,
				statusCode: 201,
				message: 'User registered successfully.',
				userId
			};
		} catch (err: any) {
			console.error('Error during registration:', err);

			return {
				success: false,
				statusCode: err.statusCode || 500,
				message: err.message || 'An unexpected error occurred.'
			};
		}
	}
}
