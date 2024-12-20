/**
 * Handles GET, POST, PUT, DELETE requests for payments.
 *
 * @file paymentRoute.ts
 * @description Payment routes to manage payment operations.
 * @author Carla da Silva Alves
 */

import { Router, Request, Response } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { asyncHandler } from '../middlewares/asyncHandler';

export const paymentRouter = Router();
const paymentController = new PaymentController(); // Initialize the PaymentController instance

/**
 * Creates a new payment record.
 *
 * @param {Object} payment - Payment details provided in the request body.
 * @returns {Object} Success message or error message.
 * @throws {400} If required fields are missing.
 */
paymentRouter.post(
	'/',
	asyncHandler(async (req: Request, res: Response) => {
		const paymentData = req.body;

		if (!paymentData.orderId || !paymentData.amount || !paymentData.paymentMethod || !paymentData.userId) {
			return res.status(400).json({ message: 'Missing required fields: orderId, amount, paymentMethod, userId.' });
		}

		const result = await paymentController.createPayment(paymentData);
		return res.status(result.success ? 201 : 400).json(result);
	})
);

/**
 * Updates the status of a payment by its ID.
 *
 * @param {number} id - The ID of the payment to update.
 * @param {string} status - The new payment status.
 * @returns {Object} Success message or error message.
 * @throws {400} If the ID or status is invalid.
 */
paymentRouter.put(
	'/:id/status',
	asyncHandler(async (req: Request, res: Response) => {
		const paymentId = parseInt(req.params.id, 10);
		const { status } = req.body;

		if (isNaN(paymentId) || paymentId <= 0) {
			return res.status(400).json({ message: 'Invalid payment ID.' });
		}

		if (!status) {
			return res.status(400).json({ message: 'Missing payment status in the request body.' });
		}

		const result = await paymentController.updatePaymentStatus(paymentId, status);
		return res.status(result.success ? 200 : 400).json(result);
	})
);

/**
 * Retrieves a specific payment by its ID.
 *
 * @param {number} id - The ID of the payment to retrieve.
 * @returns {PaymentModel} The payment record or an error message.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the payment is not found.
 */
paymentRouter.get(
	'/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const paymentId = parseInt(req.params.id, 10);

		if (isNaN(paymentId) || paymentId <= 0) {
			return res.status(400).json({ message: 'Invalid payment ID.' });
		}

		const payment = await paymentController.getPaymentById(paymentId);
		if (!payment) {
			return res.status(404).json({ message: `Payment with ID ${paymentId} not found.` });
		}

		return res.status(200).json({ message: 'Payment retrieved successfully.', data: payment });
	})
);

/**
 * Deletes a payment by its ID.
 *
 * @param {number} id - The ID of the payment to delete.
 * @returns {Object} Success message or error message.
 * @throws {400} If the ID is invalid.
 */
paymentRouter.delete(
	'/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const paymentId = parseInt(req.params.id, 10);

		if (isNaN(paymentId) || paymentId <= 0) {
			return res.status(400).json({ message: 'Invalid payment ID.' });
		}

		const result = await paymentController.deletePaymentById(paymentId);
		return res.status(result.success ? 200 : 404).json(result);
	})
);
