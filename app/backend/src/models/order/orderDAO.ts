/**
 * Handles database interactions to perform CRUD operations for the Order entity.
 *
 * @file OrderDAO.ts
 * @description Data Access Object (DAO) for orders.
 * @author Carla da Silva Alves
 */
import { getConnectionPool } from '../../config/dbConnection';
import { Pool } from 'mysql2/promise';
import { Order } from './Order';
import { OrderItem } from './OrderItem';

export class OrderDAO {
	private static pool: Pool;
	static async init() {
		OrderDAO.pool = await getConnectionPool();
	}

	/**
	 * Reads all orders from the database.
	 *
	 * @returns {Promise<Order[]>} - An array of all orders in the database.
	 */
	async selectOrders(): Promise<Order[]> {
		try {
			const query = 'SELECT * FROM `order`';
			const [results]: any = await OrderDAO.pool.query(query);

			return results.map((row: any) => ({
				orderId: row.order_id,
				userId: row.user_id,
				totalPrice: row.total_price,
				userPaymentId: row.user_payment_id,
				shippingAddressId: row.shipping_address_id,
				billingAddressId: row.billing_address_id,
				createdAt: row.created_at,
				updatedAt: row.updated_at
			}));
		} catch (err) {
			console.error('Error fetching orders:', err);
			throw { statusCode: 500, message: 'Failed to fetch orders.' };
		}
	}

	/**
	 * Reads a single order by its ID.
	 *
	 * @param {number} id - The ID of the order.
	 * @returns {Promise<Order | null>} - The order with the specified ID or null if not found.
	 */
	async selectOrderById(id: number): Promise<any | null> {
		try {
			const query = 'SELECT * FROM `order` WHERE order_id = ?';
			const [results]: any = await OrderDAO.pool.query(query, [id]);

			if (results.length === 0) return null;

			const row = results[0];
			return {
				orderId: row.order_id,
				userId: row.user_id,
				totalPrice: row.total_price,
				userPaymentId: row.user_payment_id,
				shippingAddressId: row.shipping_address_id,
				billingAddressId: row.billing_address_id,
				createdAt: row.created_at,
				updatedAt: row.updated_at
			};
		} catch (err) {
			console.error(`Error fetching order with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch order by ID.' };
		}
	}

	/**
	 * Reads the order for a specific user by ID
	 */
	async selectOrderByUserId(userId: number): Promise<Order[] | null> {
		try {
			const query = 'SELECT * FROM `order` WHERE user_id = ?';
			const [results]: any = await OrderDAO.pool.query(query, [userId]);
			if (results.length === 0) return null;
			return results.map((row: any) => ({
				orderId: row.order_id,
				userId: row.user_id,
				totalPrice: row.total_price,
				userPaymentId: row.user_payment_id,
				shippingAddressId: row.shipping_address_id,
				billingAddressId: row.billing_address_id,
				createdAt: row.created_at,
				updatedAt: row.updated_at
			}));
		} catch (err) {
			console.error(`Error fetching order with user ID ${userId}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch order by user ID.' };
		}
	}

	/**
	 * Creates a new order in the database.
	 *
	 * @param {Omit<Order, 'orderId' | 'createdAt' | 'updatedAt'>} order - The order object to insert.
	 * @returns {Promise<number>} - The ID of the newly inserted order.
	 */
	async insertOrder(order: any): Promise<number> {
		try {
			const query = `
				INSERT INTO \`order\`
				(user_id, total_price, user_payment_id, shipping_address_id, billing_address_id)
				VALUES (?, ?, ?, ?, ?)
			`;

			const [results]: any = await OrderDAO.pool.query(query, [
				order.userId,
				order.totalPrice,
				order.userPaymentId,
				order.shippingAddressId,
				order.billingAddressId
			]);

			return results.insertId;
		} catch (err) {
			console.error('Error inserting new order:', err);
			throw { statusCode: 500, message: 'Failed to insert order.' };
		}
	}

	/**
	 * Updates an existing order in the database.
	 *
	 * @param {number} id - The ID of the order to update.
	 * @param {Partial<Order>} order - The fields to update.
	 * @returns {Promise<boolean>} - True if the order was successfully updated, false otherwise.
	 */
	async updateOrderById(id: number, order: Partial<Order>): Promise<boolean> {
		try {
			const query = `
				UPDATE \`order\`
				SET user_id = COALESCE(?, user_id),
					total_price = COALESCE(?, total_price),
					user_payment_id = COALESCE(?, user_payment_id),
					shipping_address_id = COALESCE(?, shipping_address_id),
					billing_address_id = COALESCE(?, billing_address_id)
				WHERE order_id = ?
			`;

			const [results]: any = await OrderDAO.pool.query(query, [
				order.userId,
				order.totalPrice,
				order.userPaymentId,
				order.shippingAddressId,
				order.billingAddressId,
				id
			]);

			return results.affectedRows > 0;
		} catch (err) {
			console.error(`Error updating order with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update order.' };
		}
	}

	/**
	 * Deletes an order from the database by its ID.
	 *
	 * @param {number} id - The ID of the order to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - The result of the deletion.
	 */
	async deleteOrderById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const query = 'DELETE FROM `order` WHERE order_id = ?';
			const [results]: any = await OrderDAO.pool.query(query, [id]);

			if (results.affectedRows > 0) {
				return { success: true, message: 'Order deleted successfully.' };
			}

			return { success: false, message: 'Order not found.' };
		} catch (err: any) {
			if (err.code === 'ER_ROW_IS_REFERENCED_2') {
				return {
					success: false,
					message: 'Failed to delete order due to dependencies.'
				};
			}

			console.error(`Unexpected error during deletion of order with ID ${id}:`, err);
			return {
				success: false,
				message: 'An unexpected error occurred while deleting the order.'
			};
		}
	}

	async insertOrderItem(orderItem: any): Promise<number> {
		console.log('Order Item on Dao:', orderItem);
		try {
			const query = `
				INSERT INTO \`order_items\`
				(order_id, product_id, quantity)
				VALUES (?, ?, ?)
			`;

			console.log('Query:', query);
			const [results]: any = await OrderDAO.pool.query(query, [
				orderItem.orderId,
				orderItem.productId,
				orderItem.quantity
			]);

			return results.insertId;
		} catch (err) {
			console.error('Error inserting order item:', err);
			throw { statusCode: 500, message: 'Failed to insert order item.' };
		}
	}

	/**
	 * Retrieves all order items.
	 * @returns {Promise<OrderItem[]>} - List of all order items.
	 */
	async selectAllOrderItems(): Promise<OrderItem[]> {
		try {
			const query = 'SELECT * FROM order_items';
			const [results]: any = await OrderDAO.pool.query(query);

			return results.map((row: any) => ({
				orderItemId: row.order_item_id,
				orderId: row.order_id,
				productId: row.product_id,
				quantity: row.quantity
			}));
		} catch (err) {
			console.error('Error fetching order items:', err);
			throw { statusCode: 500, message: 'Failed to fetch order items.' };
		}
	}

	/**
	 * Retrieves an order item by its ID.
	 * @param {number} orderItemId - The ID of the order item.
	 * @returns {Promise<OrderItem | null>} - The order item or null if not found.
	 */
	async selectOrderItemById(orderItemId: number): Promise<OrderItem | null> {
		try {
			const query = 'SELECT * FROM order_items WHERE order_item_id = ?';
			const [results]: any = await OrderDAO.pool.query(query, [orderItemId]);

			if (results.length === 0) return null;

			const row = results[0];
			return {
				orderItemId: row.order_item_id,
				orderId: row.order_id,
				productId: row.product_id,
				quantity: row.quantity
			};
		} catch (err) {
			console.error(`Error fetching order item with ID ${orderItemId}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch order item.' };
		}
	}
	/**
	 * Updates an existing order item.
	 * @param {number} orderItemId - The ID of the order item to update.
	 * @param {Partial<Omit<OrderItem, 'orderItemId'>>} updates - Fields to update.
	 * @returns {Promise<boolean>} - True if the update was successful, false otherwise.
	 */
	async updateOrderItem(orderItemId: number, updates: Partial<Omit<OrderItem, 'orderItemId'>>): Promise<boolean> {
		try {
			const query = `
					UPDATE order_items
					SET
						order_id = COALESCE(?, order_id),
						product_id = COALESCE(?, product_id),
						quantity = COALESCE(?, quantity),
					WHERE order_item_id = ?
				`;

			const [results]: any = await OrderDAO.pool.query(query, [
				updates.orderId,
				updates.productId,
				updates.quantity,
				orderItemId
			]);

			return results.affectedRows > 0;
		} catch (err) {
			console.error(`Error updating order item with ID ${orderItemId}:`, err);
			throw { statusCode: 500, message: 'Failed to update order item.' };
		}
	}

	/**
	 * Deletes an order item by its ID.
	 * @param {number} orderItemId - The ID of the order item to delete.
	 * @returns {Promise<boolean>} - True if the deletion was successful, false otherwise.
	 */
	async deleteOrderItemById(orderItemId: number): Promise<boolean> {
		try {
			const query = 'DELETE FROM order_items WHERE order_item_id = ?';
			const [results]: any = await OrderDAO.pool.query(query, [orderItemId]);

			return results.affectedRows > 0;
		} catch (err) {
			console.error(`Error deleting order item with ID ${orderItemId}:`, err);
			throw { statusCode: 500, message: 'Failed to delete order item.' };
		}
	}
}
