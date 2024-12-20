import { getConnectionPool } from '../../config/dbConnection';
import { Pool } from 'mysql2/promise';
import { OrderItem } from './OrderItem';

export class OrderItemDAO {
	private static pool: Pool;
	static async init() {
		OrderItemDAO.pool = await getConnectionPool();
	}

	/**
	 * Inserts a new order item.
	 * @param {Omit<OrderItem, 'orderItemId'>} orderItem - The order item details to insert.
	 * @returns {Promise<number>} - The ID of the newly inserted order item.
	 */
	async insertOrderItem(orderItem: any): Promise<number> {
		console.log('Order Item on Dao:', orderItem);
		try {
			const query = `
				INSERT INTO \`order_items\`
				(order_id, product_id, quantity)
				VALUES (?, ?, ?)
			`;

			console.log('Query:', query);
			const [results]: any = await OrderItemDAO.pool.query(query, [6, 1, 1]);

			return results.insertId;
		} catch (err) {
			console.error('Error inserting order item:', err);
			throw { statusCode: 500, message: 'Failed to insert order item.' };
		}
	}
}
