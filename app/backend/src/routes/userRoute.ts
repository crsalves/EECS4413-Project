/**
 * Handles GET, POST, PUT, DELETE requests for users.
 *
 * @file userRoute.ts
 * @author
 */

import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authenticateToken } from '../middlewares/authMiddleware';

export const userRouter = Router();
const userController = new UserController(); // Initialize the UserController instance to handle user operations

/**
 * Retrieves complete information of all users.
 *
 * @returns {Array} List of users.
 * @throws {404} If no users are found in the database.
 */
userRouter.get(
	'/',
	asyncHandler(async (req: Request, res: Response) => {
		const users = await userController.getUsers();
		if (users.length === 0) {
			return res.status(404).json({ message: 'No users found in the database.' });
		}
		return res.status(200).json({ message: 'Users retrieved successfully.', data: users });
	})
);

/**
 * Retrieves complete information of a specific user.
 *
 * @param {number} id - The ID of the user to retrieve.
 * @returns {User} The user with the specified ID.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the user is not found.
 */
userRouter.get(
	'/:id',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid user ID. ID must be a positive number.' });
		}

		const user = await userController.getUserById(id);
		if (!user) {
			return res.status(404).json({ message: `User with ID ${id} not found.` });
		}

		return res.status(200).json({ message: 'User retrieved successfully.', data: user });
	})
);

/**
 * Adds a new user to the database.
 *
 * @param {Omit<User, 'userId' | 'createdAt' | 'updatedAt'>} user - User data to insert.
 * @returns {Object} Success message and user details.
 * @throws {400} If required fields are missing or invalid.
 */
userRouter.post(
	'/',
	asyncHandler(async (req: Request, res: Response) => {
		const userContact = req.body.contactData;
		const userAddress = req.body.addressData;
		const userPayment = req.body.paymentData;

		// Validate required fields
		if (!userContact.name || !userContact.email || !userContact.password) {
			return res.status(400).json({ message: 'Invalid input: name, email, and password are required.' });
		}

		// Call the controller to create the user
		const result = await userController.createUser(userContact, userAddress, userPayment);

		if (!result.success) {
			// Send appropriate HTTP response for the error
			const statusCode = result.statusCode || 500;
			return res.status(statusCode).json({ message: result.message });
		}

		// Respond with success message
		return res.status(201).json({ message: 'User added successfully.', data: result.data });
	})
);

/**
 * Updates a user by their ID in the database.
 *
 * @param {number} id - The ID of the user to update.
 * @param {Partial<User>} updates - Fields to update in the user.
 * @returns {Object} Success message and updated user details.
 * @throws {400} If the ID or update fields are invalid.
 * @throws {404} If the user is not found.
 */
userRouter.put(
	'/:id',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		const updates = req.body;

		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid user ID.' });
		}

		if (Object.keys(updates).length === 0) {
			return res.status(400).json({ message: 'At least one field is required to update.' });
		}

		const result = await userController.editUserById(id, updates);
		return res.status(result.success ? 200 : 404).json(result);
	})
);

/**
 * Deletes a user by their ID from the database.
 *
 * @param {number} id - The ID of the user to delete.
 * @returns {Object} Success message or error message.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the user is not found.
 */
userRouter.delete(
	'/:id',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid user ID.' });
		}

		const result = await userController.removeUserById(id);
		return res.status(result.success ? 200 : 404).json(result);
	})
);




userRouter.get(
	'/:id/address',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid user ID. ID must be a positive number.' });
		}

		const user = await userController.getUserAddress(id);
		if (!user) {
			return res.status(404).json({ message: `User with ID ${id} not found.` });
		}

		return res.status(200).json({ message: 'User retrieved successfully.', data: user });
	})
);

userRouter.post(
	'/:id/address',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const user = req.body;

		// Call the controller to create the user
		const result = await userController.createUserAddress(user);

		if (!result.success) {
			// Send appropriate HTTP response for the error
			const statusCode = result.statusCode || 500;
			return res.status(statusCode).json({ message: result.message });
		}

		// Respond with success message
		return res.status(201).json({ message: 'User added successfully.', data: result.data });
	})
);

userRouter.put(
	'/:id/address/:userAddressId',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const userAddressId = parseInt(req.params.userAddressId, 10);
		const updates = req.body;

		console.log('userAddressId', userAddressId);

		if (isNaN(userAddressId) || userAddressId <= 0) {
			return res.status(400).json({ message: 'Invalid user ID.' });
		}

		if (Object.keys(updates).length === 0) {
			return res.status(400).json({ message: 'At least one field is required to update.' });
		}

		const result = await userController.editUserAddressById(userAddressId, updates);
		return res.status(result.success ? 200 : 404).json(result);
	})
);

userRouter.delete(
	'/:id/address',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid user ID.' });
		}

		const result = await userController.removeUserAddressById(id);
		return res.status(result.success ? 200 : 404).json(result);
	})
);

userRouter.get(
	'/:id/payment',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid user ID. ID must be a positive number.' });
		}

		const user = await userController.getUserPayment(id);
		if (!user) {
			return res.status(404).json({ message: `User with ID ${id} not found.` });
		}

		return res.status(200).json({ message: 'User retrieved successfully.', data: user });
	})
);

userRouter.post(
	'/:id/payment',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const user = req.body;

		// Call the controller to create the user
		const result = await userController.createUserPayment(user);

		if (!result.success) {
			// Send appropriate HTTP response for the error
			const statusCode = result.statusCode || 500;
			return res.status(statusCode).json({ message: result.message });
		}

		// Respond with success message
		return res.status(201).json({ message: 'User added successfully.', data: result.data });
	})
);

userRouter.put(
	'/:id/payment/:paymentId',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const paymentId = parseInt(req.params.paymentId, 10);
		const updates = req.body;

		if (isNaN(paymentId) || paymentId <= 0) {
			return res.status(400).json({ message: 'Invalid user ID.' });
		}

		if (Object.keys(updates).length === 0) {
			return res.status(400).json({ message: 'At least one field is required to update.' });
		}

		const result = await userController.editUserPaymentById(paymentId, updates);
		return res.status(result.success ? 200 : 404).json(result);
	})
);

userRouter.delete(
	'/:id/payment',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid user ID.' });
		}

		const result = await userController.removeUserPaymentById(id);
		return res.status(result.success ? 200 : 404).json(result);
	})
);


userRouter.post(
	'/admin',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const userContact = req.body;

		console.log('Adding new aadmin user: ', userContact);

		// Validate required fields
		if (!userContact.name || !userContact.email || !userContact.password) {
			return res.status(400).json({ message: 'Invalid input: name, email, and password are required.' });
		}

		// Call the controller to create the user
		const result = await userController.createAdminUser(userContact);

		if (!result.success) {
			// Send appropriate HTTP response for the error
			const statusCode = result.statusCode || 500;
			return res.status(statusCode).json({ message: result.message });
		}

		// Respond with success message
		return res.status(201).json({ message: 'User added successfully.', data: result.data });
	})
);

/**
 * Updates a user by their ID in the database.
 *
 * @param {number} id - The ID of the user to update.
 * @param {Partial<User>} updates - Fields to update in the user.
 * @returns {Object} Success message and updated user details.
 * @throws {400} If the ID or update fields are invalid.
 * @throws {404} If the user is not found.
 */
userRouter.put(
	'/admin/:id',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		const updates = req.body;

		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid user ID.' });
		}

		if (Object.keys(updates).length === 0) {
			return res.status(400).json({ message: 'At least one field is required to update.' });
		}

		const result = await userController.editUserById(id, updates);
		return res.status(result.success ? 200 : 404).json(result);
	})
);

/**
 * Deletes a user by their ID from the database.
 *
 * @param {number} id - The ID of the user to delete.
 * @returns {Object} Success message or error message.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the user is not found.
 */
userRouter.delete(
	'/admin/:id',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid user ID.' });
		}

		const result = await userController.removeUserById(id);
		return res.status(result.success ? 200 : 404).json(result);
	})
);

