/**
 * Handles business operations to integrate database operations with endpoints.
 *
 * @file PaymentController.ts
 * @description Controller to manage payment operations.
 * @author Carla da Silva Alves
 */

import { PaymentDAO } from '../models/payment/paymentDAO';
import { PaymentModel } from '../models/payment/PaymentModel';

export class PaymentController {
	private paymentDAO: PaymentDAO;

	constructor() {
		this.paymentDAO = new PaymentDAO();
	}

	/**
	 * Creates a new payment record.
	 *
	 * @param {Omit<PaymentModel, 'paymentId' | 'createdAt' | 'updatedAt'>} payment - Payment details to insert.
	 * @returns {Promise<{ success: boolean; message: string }>} - Result of the operation.
	 */
	async createPayment(
		payment: Omit<PaymentModel, 'paymentId' | 'createdAt' | 'updatedAt'>
	): Promise<{ success: boolean; message: string }> {
		try {
			const result = await this.paymentDAO.insertPayment(payment);

			if (result) {
				return { success: true, message: 'Payment created successfully.' };
			}

			return { success: false, message: 'Failed to create payment.' };
		} catch (err) {
			console.error('Error creating payment:', err.message);
			throw { statusCode: 500, message: 'Failed to create payment.' };
		}
	}

	/**
	 * Updates the payment status by payment ID.
	 *
	 * @param {number} paymentId - The ID of the payment to update.
	 * @param {string} status - The new payment status.
	 * @returns {Promise<{ success: boolean; message: string }>} - Result of the operation.
	 */
	async updatePaymentStatus(paymentId: number, status: string): Promise<{ success: boolean; message: string }> {
		try {
			const isUpdated = await this.paymentDAO.updatePaymentStatus(paymentId, status);

			if (isUpdated) {
				return { success: true, message: 'Payment status updated successfully.' };
			}

			return { success: false, message: 'Failed to update payment status.' };
		} catch (err) {
			console.error(`Error updating payment status for ID ${paymentId}:`, err.message);
			throw { statusCode: 500, message: 'Failed to update payment status.' };
		}
	}

	/**
	 * Retrieves a payment by its ID.
	 *
	 * @param {number} paymentId - The ID of the payment to retrieve.
	 * @returns {Promise<PaymentModel | null>} - The payment details or null if not found.
	 */
	async getPaymentById(paymentId: number): Promise<PaymentModel | null> {
		try {
			const payment = await this.paymentDAO.selectPaymentById(paymentId);
			return payment || null;
		} catch (err) {
			console.error(`Error fetching payment with ID ${paymentId}:`, err.message);
			throw { statusCode: 500, message: 'Failed to retrieve payment.' };
		}
	}

	/**
	 * Deletes a payment by its ID.
	 *
	 * @param {number} paymentId - The ID of the payment to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - Result of the operation.
	 */
	async deletePaymentById(paymentId: number): Promise<{ success: boolean; message: string }> {
		try {
			const result = await this.paymentDAO.deletePaymentById(paymentId);
			return result;
		} catch (err) {
			console.error(`Error deleting payment with ID ${paymentId}:`, err.message);
			throw { statusCode: 500, message: 'Failed to delete payment.' };
		}
	}
}
