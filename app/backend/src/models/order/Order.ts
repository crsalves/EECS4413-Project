/**
 * Order interface for the database.
 * @file Order.ts
 * @author Carla da Silva Alves
 */
export interface Order {
	orderId: number;
	userId: number;
	totalPrice: number;
	userPaymentId: number;
	shippingAddressId: number;
	billingAddressId: number;
	products: { productId: number; quantity: number }[];
	createdAt: Date;
	updatedAt: Date;
}
