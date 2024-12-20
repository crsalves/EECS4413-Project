/**
 * Handles GET, POST, PUT, DELETE requests for orders.
 *
 * @file orderRoute.ts
 * @author Carla da Silva Alves
 */

import { Router, Request, Response } from 'express';
import { OrderController } from '../controllers/orderController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authenticateToken } from '../middlewares/authMiddleware';

export const orderRouter = Router();
const orderController = new OrderController(); // Initialize the OrderController instance to handle order operations

/**
 * Retrieves complete information of all orders.
 *
 * @returns {Array} List of orders.
 * @throws {404} If no orders are found in the database.
 */
orderRouter.get(
	'/',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const orders = await orderController.getOrders();
		if (orders.length === 0) {
			return res.status(404).json({ message: 'No orders found in the database.' });
		}
		return res.status(200).json({ message: 'Orders retrieved successfully.', data: orders });
	})
);

/**
 * Retrieves complete information of a specific order.
 *
 * @param {number} id - The ID of the order to retrieve.
 * @returns {Order} The order with the specified ID.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the order is not found.
 */
orderRouter.get(
	'/:id',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid order ID. ID must be a positive number.' });
		}

		const order = await orderController.getOrderById(id);
		if (!order) {
			return res.status(404).json({ message: `Order with ID ${id} not found.` });
		}

		return res.status(200).json({ message: 'Order retrieved successfully.', data: order });
	})
);

/**
 * Adds a new order to the database.
 *
 * @param {Omit<Order, 'orderId' | 'createdAt' | 'updatedAt'>} order - Order data to insert.
 * @returns {Object} Success message and order details.
 * @throws {400} If required fields are missing or invalid.
 */
orderRouter.post(
	'/',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const orderData = req.body;
		console.log('Order Data:', orderData);

		if (!orderData.userId) {
			const errorMessage = 'Invalid input: userId, shippingAddress, and totalPrice are required and must be valid.';
			console.error(errorMessage);
			return res.status(400).json({ message: errorMessage });
		}

		const result = await orderController.createOrder(orderData);
		return res.status(result.success ? 201 : 400).json(result);
	})
);

/**
 * Updates a order by its ID in the database.
 *
 * @param {number} id - The ID of the order to update.
 * @param {Partial<Order>} updates - Fields to update in the order.
 * @returns {Object} Success message and updated order details.
 * @throws {400} If the ID or update fields are invalid.
 * @throws {404} If the order is not found.
 */
orderRouter.put(
	'/:id',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		const updates = req.body;

		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid order ID.' });
		}

		if (Object.keys(updates).length === 0) {
			return res.status(400).json({ message: 'At least one field is required to update.' });
		}

		const result = await orderController.editOrderById(id, updates);
		return res.status(result.success ? 200 : 404).json(result);
	})
);

/**
 * Deletes a order by its ID from the database.
 *
 * @param {number} id - The ID of the order to delete.
 * @returns {Object} Success message or error message.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the order is not found.
 */
orderRouter.delete(
	'/:id',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid order ID.' });
		}

		const result = await orderController.removeOrderById(id);
		return res.status(result.success ? 200 : 404).json(result);
	})
);

/**
 * Retrieves complete information of a specific order.
 *
 * @param {number} id - The ID of the order to retrieve.
 * @returns {Order} The order with the specified ID.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the order is not found.
 */
orderRouter.get(
	'/user/:user_id',
	authenticateToken,
	asyncHandler(async (req: Request, res: Response) => {
		const userId = parseInt(req.params.user_id, 10);
		if (isNaN(userId) || userId <= 0) {
			return res.status(400).json({ message: 'Invalid user ID. ID must be a positive number.' });
		}

		const orders = await orderController.getOrderByUserId(userId);
		if (!orders) {
			return res.status(404).json({ message: `Orders with Category ID ${userId} not found.` });
		}

		return res.status(200).json({ message: 'Orders retrieved successfully.', data: orders });
	})
);