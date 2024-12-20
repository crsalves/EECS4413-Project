/**
 * Payment interface for the database.
 * @file Payment.ts
 * @author Carla da Silva Alves
 */

export interface Payment {
	paymentId: number;
	orderId: number;
	userId: number;
	userPaymentId: number;
	amount: number;
	paymentStatus: string;
	paymentMethod: string;
	type: string;
	cardNumber: string;
	expireDate: string;
	securityCode: string;
	createdAt: Date;
	updatedAt: Date;
}
