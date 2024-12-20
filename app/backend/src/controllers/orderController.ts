/**
 * Handles business operations to integrate database operations with endpoints.
 *
 * @file orderController.ts
 * @description Controller for order operations.
 * @author Carla da Silva Alves
 */

import { Order } from '../models/order/Order';
import { OrderDAO } from '../models/order/orderDAO';
import { ProductController } from './productController';


export class OrderController {
	private orderDAO: OrderDAO;
	private productControler: ProductController;

	constructor() {
		this.orderDAO = new OrderDAO();
		this.productControler = new ProductController();
	}

	/**
	 * @returns {Promise<Order[]>} - An array of all orders in the database.
	 */
	async getOrders(): Promise<Order[]> {
		try {
			const orders = await this.orderDAO.selectOrders();
			return orders || [];
		} catch (err) {
			console.error('Error fetching orders:', err);
			throw { statusCode: 500, message: 'Failed to fetch orders' };
		}
	}

	/**
	 * @param {number} id - The ID of the order.
	 * @returns {Promise<Order | null>} - The order with the specified ID or null if not found.
	 */
	async getOrderById(id: number): Promise<Order | null> {
		try {
			const order = await this.orderDAO.selectOrderById(id);
			return order || null;
		} catch (err) {
			console.error(`Error fetching order with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch order' };
		}
	}

	/**
	 * @param {Omit<Order, 'orderId' | 'createdAt' | 'updatedAt'>} order - The order to create.
	 */
	async createOrder(
		order: Omit<Order, 'orderId' | 'createdAt' | 'updatedAt'>
	): Promise<{ success: boolean; message: string; data?: { orderId: number } }> {
		try {
			// Input validation
			if (order.userPaymentId === undefined) {
				throw {
					statusCode: 400,
					message: 'Missing required field: userPaymentId'
				};
			}

			if (order.shippingAddressId === undefined) {
				throw {
					statusCode: 400,
					message: 'Missing required field: shippingAddressId'
				};
			}

			if (order.billingAddressId === undefined) {
				throw {
					statusCode: 400,
					message: 'Missing required field: billingAddressId'
				};
			}

			const { hasInventory, productsUpdatedQuantity } = await this.validateOrder(order);

			if (hasInventory) {
				// If all products have enough stock, update the quantities

				if (hasInventory) {
					for (const [productId, newQuantity] of productsUpdatedQuantity) {
						await this.productControler.decreaseProductQuantity(productId, newQuantity);
					}
				}

				const newOrderId = await this.orderDAO.insertOrder({
					userId: order.userId,
					totalPrice: order.totalPrice,
					userPaymentId: order.userPaymentId,
					shippingAddressId: order.shippingAddressId,
					billingAddressId: order.billingAddressId
				});

				// Insert order items

				const products = order.products;
				const orderItems: { orderId: number; productId: number; quantity: number }[] = products.map((product: any) => ({
					orderId: newOrderId,
					productId: product.productId,
					quantity: product.quantity
				}));

				console.log('Order Items:', orderItems);

				for (const orderItem of orderItems) {
					await await this.orderDAO.insertOrderItem(orderItem);
				}

				return { success: true, message: 'Order added successfully', data: { orderId: newOrderId } };
			} else {
				return { success: false, message: 'Item not available' };
			}
		} catch (err) {
			console.error('Error adding new order:', err);
			throw { statusCode: err.statusCode || 500, message: err.message || 'Failed to add new order' };
		}
	}

	/**
	 * @param {number} id - The ID of the order to update.
	 * @param {Partial<Order>} updates - Contains fields to update in the order.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 */
	async editOrderById(id: number, updates: Partial<Order>): Promise<{ success: boolean; message: string }> {
		try {
			const existingOrder = await this.getOrderById(id);

			if (!existingOrder) {
				return { success: false, message: 'Order not found' };
			}

			const isUpdated = await this.orderDAO.updateOrderById(id, updates);

			if (isUpdated) {
				return { success: true, message: 'Order updated successfully' };
			}

			return { success: false, message: 'Failed to update order' };
		} catch (err) {
			console.error(`Error updating order with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update order' };
		}
	}

	/**
	 * @param {number} id - The ID of the order to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 */
	async removeOrderById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const result = await this.orderDAO.deleteOrderById(id);
			return result;
		} catch (err) {
			console.error(`Error deleting order with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to delete order' };
		}
	}

	/**
	 * @param {number} userId - The ID of the user.
	 * @returns {Promise<Order[] | null>} - The orders with the specified user ID or null if not found.
	 */
	async getOrderByUserId(userId: number): Promise<Order[] | null> {
		try {
			const orders = await this.orderDAO.selectOrderByUserId(userId);
			return orders || null;
		} catch (err) {
			console.error(`Error fetching orders with user ID ${userId}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch orders for user' };
		}
	}

	// validate the order by checking the products quantities
	async validateOrder(order: any): Promise<{ hasInventory: boolean; productsUpdatedQuantity: Map<any, any> }> {
		try {
			// Extract product IDs from the order items
			const products: [] = order.products;
			const productIds: number[] = products.map((product: any) => product.productId);

			// Fetch product details (id, quantity) from the database

			const productsAvailable = [];

			for (const productId of productIds) {
				const product = await this.productControler.getProductById(productId);
				productsAvailable.push(product);
			}

			// Create a map for quick lookups

			console.log('productsAvailable:', productsAvailable);

			const productAvailableMap = new Map(productsAvailable.map((product) => [product.productId, product.quantity]));

			const productOrderMap = new Map(products.map((product: any) => [product.productId, product.quantity]));

			console.log('productAvailableMap:', productAvailableMap);
			console.log('productOrderMap:', productOrderMap);

			let hasInventory = true;

			// Validate each order item
			const productsUpdatedQuantity = new Map();

			for (const [productId, quantityOrdered] of productOrderMap) {
				const availableQuantity = productAvailableMap.get(productId);

				if (availableQuantity === undefined || quantityOrdered > availableQuantity) {
					console.warn(
						`Insufficient stock for Product ID ${productId}: Requested ${quantityOrdered}, Available ${availableQuantity}`
					);
					hasInventory = false;
				} else {
					console.log(
						`Product ID ${productId} has enough stock: Requested ${quantityOrdered}, Available ${availableQuantity}`
					);
					const updatedQuantity = availableQuantity - quantityOrdered;
					productsUpdatedQuantity.set(productId, updatedQuantity);
				}
			}

			console.log('hasInventory:', hasInventory);

			return { hasInventory, productsUpdatedQuantity };
		} catch (err) {
			console.error('Error validating order:', err);
			throw { statusCode: 500, message: 'Failed to validate order.' };
		}
	}
}
