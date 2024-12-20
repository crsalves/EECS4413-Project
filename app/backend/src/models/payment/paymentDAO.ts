/**
 *  * Handles database interactions to perform CRUD operations
 * @file paymentDAO.ts
 * @author Carla da Silva Alves
 */
import { Pool } from 'mysql2/promise';
import { getConnectionPool } from '../../config/dbConnection';
import { PaymentModel } from './PaymentModel';

export class PaymentDAO {
	private static pool: Pool;
	static async init() {
        PaymentDAO.pool = await getConnectionPool();
    }

	/**
	 * Retrieves all payment records.
	 *
	 * @returns {Promise<PaymentModel[]>} - An array of all payments.
	 */
	async selectPayments(): Promise<PaymentModel[]> {
		try {
			const query = 'SELECT * FROM payments';
			const [results]: any = await PaymentDAO.pool.query(query);

			return results.map(
				(row: any) =>
					new PaymentModel(
						row.paymentId,
						row.orderId,
						row.userId,
						row.userPaymentId,
						row.amount,
						row.paymentStatus,
						row.paymentMethod,
						row.type,
						row.cardNumber,
						row.expireDate,
						row.securityCode,
						new Date(row.createdAt),
						new Date(row.updatedAt)
					)
			);
		} catch (err) {
			console.error('Error fetching payments:', err);
			throw { statusCode: 500, message: 'Failed to fetch payments.' };
		}
	}

	/**
	 * Retrieves a single payment by its ID.
	 *
	 * @param {number} paymentId - The ID of the payment.
	 * @returns {Promise<PaymentModel | null>} - PaymentModel or null if not found.
	 */
	async selectPaymentById(paymentId: number): Promise<PaymentModel | null> {
		try {
			const query = 'SELECT * FROM payments WHERE paymentId = ?';
			const [results]: any = await PaymentDAO.pool.query(query, [paymentId]);

			if (results.length === 0) return null;

			const row = results[0];
			return new PaymentModel(
				row.paymentId,
				row.orderId,
				row.userId,
				row.userPaymentId,
				row.amount,
				row.paymentStatus,
				row.paymentMethod,
				row.type,
				row.cardNumber,
				row.expireDate,
				row.securityCode,
				new Date(row.createdAt),
				new Date(row.updatedAt)
			);
		} catch (err) {
			console.error(`Error fetching payment with ID ${paymentId}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch payment.' };
		}
	}

	/**
	 * Inserts a new payment record into the database.
	 *
	 * @param {Omit<PaymentModel, 'paymentId' | 'createdAt' | 'updatedAt'>} payment - The payment details to insert.
	 * @returns {Promise<number>} - The ID of the newly inserted payment.
	 */
	async insertPayment(payment: Omit<PaymentModel, 'paymentId' | 'createdAt' | 'updatedAt'>): Promise<number> {
		try {
			const query = `
                INSERT INTO payments (
                    orderId, userId, userPaymentId, amount, paymentStatus,
                    paymentMethod, type, cardNumber, expireDate, securityCode, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;

			const [results]: any = await PaymentDAO.pool.query(query, [
				payment.orderId,
				payment.userId,
				payment.userPaymentId,
				payment.amount,
				payment.paymentStatus,
				payment.paymentMethod,
				payment.type,
				payment.cardNumber,
				payment.expireDate,
				payment.securityCode
			]);

			return results.insertId;
		} catch (err) {
			console.error('Error inserting payment:', err);
			throw { statusCode: 500, message: 'Failed to insert payment.' };
		}
	}

	/**
	 * Updates payment status and updatedAt timestamp.
	 *
	 * @param {number} paymentId - The ID of the payment to update.
	 * @param {string} paymentStatus - New status for the payment.
	 * @returns {Promise<boolean>} - True if update was successful, false otherwise.
	 */
	async updatePaymentStatus(paymentId: number, paymentStatus: string): Promise<boolean> {
		try {
			const query = `
                UPDATE payments
                SET paymentStatus = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE paymentId = ?
            `;

			const [results]: any = await PaymentDAO.pool.query(query, [paymentStatus, paymentId]);

			return results.affectedRows > 0;
		} catch (err) {
			console.error(`Error updating payment status for ID ${paymentId}:`, err);
			throw { statusCode: 500, message: 'Failed to update payment status.' };
		}
	}

	/**
	 * Deletes a payment record by its ID.
	 *
	 * @param {number} paymentId - The ID of the payment to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - Deletion result.
	 */
	async deletePaymentById(paymentId: number): Promise<{ success: boolean; message: string }> {
		try {
			const query = 'DELETE FROM payments WHERE paymentId = ?';
			const [results]: any = await PaymentDAO.pool.query(query, [paymentId]);

			if (results.affectedRows > 0) {
				return { success: true, message: 'Payment deleted successfully.' };
			}

			return { success: false, message: 'Payment not found.' };
		} catch (err) {
			console.error(`Error deleting payment with ID ${paymentId}:`, err);
			throw { statusCode: 500, message: 'Failed to delete payment.' };
		}
	}
}
