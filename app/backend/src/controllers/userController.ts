/**
 * Handles business operations to integrate database operations with endpoints.
 *
 * @file userController.ts
 * @author
 */

import { User } from '../models/user/User';
import { UserDAO } from '../models/user/UserDAO';
import { AuthController } from './authController';

export class UserController {
	private userDAO: UserDAO;
	private authController: AuthController;

	constructor() {
		this.userDAO = new UserDAO();
		this.authController = new AuthController();
	}

	/**
	 * @returns {Promise<User[]>} - An array of all users in the database.
	 */
	async getUsers(): Promise<User[]> {
		try {
			const users = await this.userDAO.selectUsers();
			return users || [];
		} catch (err) {
			console.error('Error fetching users:', err);
			throw { statusCode: 500, message: 'Failed to fetch users' };
		}
	}

	/**
	 * @param {number} id - The ID of the user.
	 * @returns {Promise<User | null>} - The user with the specified ID or null if not found.
	 */
	async getUserById(id: number): Promise<User | null> {
		try {
			const user = await this.userDAO.selectUserById(id);
			return user || null;
		} catch (err) {
			console.error(`Error fetching user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch user' };
		}
	}

	/**
	 * @param {Omit<User, 'userId' | 'createdAt' | 'updatedAt'>} user - The user data to insert.
	 * @returns {Promise<{ success: boolean; message: string, data: any }>} - Success message or error message.
	 */
	async createUser(
		userContact: any,
		userAddress: any,
		userPayment: any
	): Promise<{ success: boolean; message?: string; statusCode?: number; data?: any }> {
		try {
			// Hash the password before storing it
			const bcrypt = require('bcrypt');
			const saltRounds = 10;
			const passwordHash = await bcrypt.hash(userContact.password, saltRounds);

			// Prepare user data for insertion
			const newUser = {
				name: userContact.name,
				email: userContact.email,
				passwordHash, // Use hashed password
				phone: userContact.phone,
				role: userContact.role || 'customer'
			};

			const newUserId = await this.userDAO.insertUser(newUser);

			const result = await this.authController.login(userContact.email, userContact.password);
			const token = result.token;

			// Prepare user data for insertion

			const newUserAddress = {
				userId: newUserId,
				street: userAddress.street,
				complement: userAddress.complement,
				city: userAddress.city,
				province: userAddress.province,
				country: userAddress.country,
				postalCode: userAddress.postalCode,
				isDefault: userAddress.isDefault
			};

			const newUserAddResult = await this.userDAO.insertUserAddress(newUserAddress);

			const newUserPayment = {
				userId: newUserId,
				cardNumber: userPayment.cardNumber,
				expiryDate: userPayment.expiryDate,
				cvv: userPayment.cvv,
				paymentTypeId: userPayment.paymentTypeId,
				isDefault: userPayment.isDefault
			};

			const newuUserPayResult = await this.userDAO.insertUserPayment(newUserPayment);

			return {
				success: true,
				statusCode: 201,
				data: {
					user: result.user,
					userAddress: [{ ...newUserAddress, userAddressId: newUserAddResult.userAddressId }],
					userPayment: [{ ...newUserPayment, userPaymentId: newuUserPayResult.userPaymentId }],
					token: token
				}
			};
		} catch (err: any) {
			// Return the error message and status from DAO layer
			console.log('Error creating user:', err);
			return { success: false, message: err.message, statusCode: err.statusCode || 500 };
		}
	}

	/**
	 * @param {number} id - The ID of the user to update.
	 * @param {Partial<User>} updates - Contains fields to update in the user.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 */
	async editUserById(id: number, updates: Partial<User>): Promise<{ success: boolean; message: string }> {
		try {
			const existingUser = await this.getUserById(id);

			if (!existingUser) {
				return { success: false, message: 'User not found' };
			}

			const isUpdated = await this.userDAO.updateUserById(id, updates);

			if (isUpdated) {
				return { success: true, message: 'User updated successfully' };
			}

			return { success: false, message: 'Failed to update user' };
		} catch (err) {
			console.error(`Error updating user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update user' };
		}
	}

	/**
	 * @param {number} id - The ID of the user to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 */
	async removeUserById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const result = await this.userDAO.deleteUserById(id);
			return result;
		} catch (err) {
			console.error(`Error deleting user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to delete user' };
		}
	}

	async getUserAddress(id: number): Promise<any | null> {
		try {
			const userAddress = await this.userDAO.selectUserAddress(id);
			return userAddress || null;
		} catch (err) {
			console.error(`Error fetching user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch user' };
		}
	}

	async createUserAddress(user: any): Promise<{ success: boolean; message?: string; statusCode?: number; data?: any }> {
		try {
			// Prepare user data for insertion
			const newUserAddress = {
				userId: user.userId,
				street: user.street,
				complement: user.complement,
				province: user.province,
				country: user.country,
				postal_code: user.postal_code,
				isDefault: user.isDefault
			};

			const result = await this.userDAO.insertUserAddress(newUserAddress);

			console.log('User created successfully:', result);

			return { success: true, statusCode: 201, data: result };
		} catch (err: any) {
			// Return the error message and status from DAO layer
			console.log('Error creating user:', err);
			return { success: false, message: err.message, statusCode: err.statusCode || 500 };
		}
	}

	async getUserAddressById(id: number): Promise<any | null> {
		try {
			const user = await this.userDAO.selectUserAddressById(id);
			return user || null;
		} catch (err) {
			console.error(`Error fetching user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch user' };
		}
	}

	async editUserAddressById(id: number, updates: any): Promise<{ success: boolean; message: string }> {
		try {
			const existingUserAddress = await this.getUserAddressById(id);

			if (!existingUserAddress) {
				return { success: false, message: 'User Address not found' };
			}

			const isUpdated = await this.userDAO.updateUserAddressById(id, updates);

			if (isUpdated) {
				return { success: true, message: 'User updated successfully' };
			}

			return { success: false, message: 'Failed to update user' };
		} catch (err) {
			console.error(`Error updating user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update user' };
		}
	}

	async removeUserAddressById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const result = await this.userDAO.deleteUserAddressById(id);
			return result;
		} catch (err) {
			console.error(`Error deleting user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to delete user' };
		}
	}

	async getUserPayment(id: number): Promise<any | null> {
		try {
			const userAddress = await this.userDAO.selectUserPayment(id);
			return userAddress || null;
		} catch (err) {
			console.error(`Error fetching user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch user' };
		}
	}

	async createUserPayment(user: any): Promise<{ success: boolean; message?: string; statusCode?: number; data?: any }> {
		try {
			// Prepare user data for insertion
			const newUserpayment = {
				userId: user.userId,
				cardNumber: user.cardNumber,
				expiryDate: user.expiryDate,
				cvv: user.cvv,
				paymentTypeId: user.paymentTypeId,
				isDefault: user.isDefault
			};

			const result = await this.userDAO.insertUserPayment(newUserpayment);

			console.log('User created successfully:', result);

			return { success: true, statusCode: 201, data: result };
		} catch (err: any) {
			// Return the error message and status from DAO layer
			console.log('Error creating user:', err);
			return { success: false, message: err.message, statusCode: err.statusCode || 500 };
		}
	}

	async getUserPaymentById(id: number): Promise<any | null> {
		try {
			const user = await this.userDAO.selectUserPaymentById(id);
			return user || null;
		} catch (err) {
			console.error(`Error fetching user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch user' };
		}
	}

	async editUserPaymentById(id: number, updates: Partial<User>): Promise<{ success: boolean; message: string }> {
		try {
			const existingUserPayment = await this.getUserPaymentById(id);

			if (!existingUserPayment) {
				return { success: false, message: 'User Address not found' };
			}

			const isUpdated = await this.userDAO.updateUserPaymentById(id, updates);

			if (isUpdated) {
				return { success: true, message: 'User updated successfully' };
			}

			return { success: false, message: 'Failed to update user' };
		} catch (err) {
			console.error(`Error updating user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update user' };
		}
	}

	async removeUserPaymentById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const result = await this.userDAO.deleteUserPaymentById(id);
			return result;
		} catch (err) {
			console.error(`Error deleting user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to delete user' };
		}
	}

	/**
	 * @param {Omit<User, 'userId' | 'createdAt' | 'updatedAt'>} user - The user data to insert.
	 * @returns {Promise<{ success: boolean; message: string, data: any }>} - Success message or error message.
	 */
	async createAdminUser(
		userContact: any
	): Promise<{ success: boolean; message?: string; statusCode?: number; data?: any }> {
		try {
			// Hash the password before storing it
			const bcrypt = require('bcrypt');
			const saltRounds = 10;
			const passwordHash = await bcrypt.hash(userContact.password, saltRounds);

			// Prepare user data for insertion
			const newUser = {
				name: userContact.name,
				email: userContact.email,
				passwordHash, // Use hashed password
				phone: userContact.phone,
				role: 'admin'
			};

			const newUserId = await this.userDAO.insertUser(newUser);

			return {
				success: true,
				statusCode: 201,
				data: {
					userId: newUserId
				}
			};
		} catch (err: any) {
			// Return the error message and status from DAO layer
			console.log('Error creating user:', err);
			return { success: false, message: err.message, statusCode: err.statusCode || 500 };
		}
	}
}
