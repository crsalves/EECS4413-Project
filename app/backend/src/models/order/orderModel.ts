/**
 * Represents the API's order by implementing the interface.
 * @file OrderModel.ts
 */

import { Order } from './Order';

export class OrderModel implements Order {
	orderId: number;
	userId: number;
	totalPrice: number;
	status: string;
	paymentStatus: string;
	userPaymentId: number; // Replaced paymentTypeId
	shippingAddressId: number; // Updated
	billingAddressId: number; // Added new field
	createdAt: Date;
	updatedAt: Date;

	/**
	 * Constructs a new orderModel object.
	 * @param {Order} order - The order details.
	 */
	constructor(order: Order) {
		this.orderId = order.orderId;
		this.userId = order.userId;
		this.totalPrice = order.totalPrice;
		this.userPaymentId = order.userPaymentId; // Updated
		this.shippingAddressId = order.shippingAddressId; // Updated
		this.billingAddressId = order.billingAddressId; // Added
		this.createdAt = order.createdAt;
		this.updatedAt = order.updatedAt;
	}
	products: { productId: number; quantity: number; }[];

	// Getters
	getOrderId(): number {
		return this.orderId;
	}

	getUserId(): number {
		return this.userId;
	}

	getTotalPrice(): number {
		return this.totalPrice;
	}

	getStatus(): string {
		return this.status;
	}

	getPaymentStatus(): string {
		return this.paymentStatus;
	}

	getUserPaymentId(): number {
		return this.userPaymentId;
	}

	getShippingAddressId(): number {
		return this.shippingAddressId;
	}

	getBillingAddressId(): number {
		return this.billingAddressId;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}

	getUpdatedAt(): Date {
		return this.updatedAt;
	}

	// Setters
	setOrderId(orderId: number): void {
		this.orderId = orderId;
	}

	setUserId(userId: number): void {
		this.userId = userId;
	}

	setTotalPrice(totalPrice: number): void {
		this.totalPrice = totalPrice;
	}

	setStatus(status: string): void {
		this.status = status;
	}

	setPaymentStatus(paymentStatus: string): void {
		this.paymentStatus = paymentStatus;
	}

	setUserPaymentId(userPaymentId: number): void {
		this.userPaymentId = userPaymentId;
	}

	setShippingAddressId(shippingAddressId: number): void {
		this.shippingAddressId = shippingAddressId;
	}

	setBillingAddressId(billingAddressId: number): void {
		this.billingAddressId = billingAddressId;
	}

	setCreatedAt(createdAt: Date): void {
		this.createdAt = createdAt;
	}

	setUpdatedAt(updatedAt: Date): void {
		this.updatedAt = updatedAt;
	}

	/**
	 * @returns {string} of the object's attributes.
	 */
	public toString(): string {
		return `Order ID: ${this.orderId}, User ID: ${this.userId}, Total Price: ${this.totalPrice}, Status: ${this.status}, Payment Status: ${this.paymentStatus}, User Payment ID: ${this.userPaymentId}, Shipping Address ID: ${this.shippingAddressId}, Billing Address ID: ${this.billingAddressId}, Created At: ${this.createdAt}, Updated At: ${this.updatedAt}`;
	}
}
